#!/usr/bin/env python3

from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/data/verifiedCharacters.generated.ts"
OUT_DIR = ROOT / "src/data/characterProfiles"

text = SOURCE.read_text(encoding="utf-8")

start_marker = "export const verifiedCharacters: BiblicalCharacter[] = ["
start = text.find(start_marker)

if start == -1:
    raise SystemExit("ERROR: verifiedCharacters array not found")

start = text.find("[", start) + 1
end = text.rfind("]")

if end <= start:
    raise SystemExit("ERROR: Could not locate verifiedCharacters array end")

body = text[start:end]

# Parse each top-level character object without being confused by
# nested Scripture reference objects.
records = []
depth = 0
record_start = None
in_string = False
quote = None
escape = False

for i, ch in enumerate(body):
    if in_string:
        if escape:
            escape = False
        elif ch == "\\":
            escape = True
        elif ch == quote:
            in_string = False
        continue

    if ch in ("'", '"', "`"):
        in_string = True
        quote = ch
        continue

    if ch == "{":
        if depth == 0:
            record_start = i
        depth += 1

    elif ch == "}":
        depth -= 1

        if depth < 0:
            raise SystemExit("ERROR: Object parser depth became negative")

        if depth == 0 and record_start is not None:
            records.append(body[record_start:i + 1])
            record_start = None

if depth != 0:
    raise SystemExit(f"ERROR: Unbalanced object depth: {depth}")

if len(records) != 2922:
    raise SystemExit(
        f"ERROR: Expected 2922 character records, found {len(records)}"
    )

parsed = []

for record in records:
    id_match = re.search(r"\bid:\s*'([^']+)'", record)
    slug_match = re.search(r"\bslug:\s*'([^']+)'", record)
    refs_match = re.search(
        r"\bkeyScriptures:\s*\[(.*?)\]\s*,?\s*}",
        record,
        re.S,
    )

    if not id_match or not slug_match:
        raise SystemExit("ERROR: Character missing ID or slug")

    pid = id_match.group(1)
    slug = slug_match.group(1)

    ref_count = 0
    if refs_match:
        ref_count = len(
            re.findall(r"\{\s*book:\s*'", refs_match.group(1))
        )

    parsed.append((pid, slug, record, ref_count))

ids = [x[0] for x in parsed]
slugs = [x[1] for x in parsed]

if len(set(ids)) != 2922:
    raise SystemExit("ERROR: Duplicate character IDs detected")

if len(set(slugs)) != 2922:
    raise SystemExit("ERROR: Duplicate character slugs detected")

if "Jesus_Christ" not in ids:
    raise SystemExit("ERROR: Jesus_Christ missing")

if "Jesus_1" not in ids:
    raise SystemExit("ERROR: Jesus_1 / Jesus Justus missing")

jesus = next(x for x in parsed if x[0] == "Jesus_Christ")
jesus_justus = next(x for x in parsed if x[0] == "Jesus_1")

if jesus[1] != "jesus":
    raise SystemExit(f"ERROR: Jesus Christ slug changed: {jesus[1]}")

if jesus_justus[1] != "jesus-justus":
    raise SystemExit(
        f"ERROR: Jesus Justus slug changed: {jesus_justus[1]}"
    )

if jesus[3] != 871:
    raise SystemExit(
        f"ERROR: Expected 871 Jesus Christ references, found {jesus[3]}"
    )

if any(x[3] == 0 for x in parsed):
    bad = [x[0] for x in parsed if x[3] == 0]
    raise SystemExit(
        "ERROR: Zero-reference profiles detected: " + ", ".join(bad[:20])
    )

# Only replace generated directory AFTER all source checks pass.
tmp_dir = ROOT / "src/data/characterProfiles.__new__"

if tmp_dir.exists():
    shutil.rmtree(tmp_dir)

tmp_dir.mkdir(parents=True)

manifest = []

for pid, slug, record, ref_count in parsed:
    # IDs are already unique and safe for generated filenames.
    filename = f"{pid}.ts"

    content = (
        "import type { BiblicalCharacter } from '@/types'\n\n"
        f"const character: BiblicalCharacter = {record}\n\n"
        "export default character\n"
    )

    (tmp_dir / filename).write_text(content, encoding="utf-8")

    manifest.append((slug, pid, filename, ref_count))

manifest_lines = [
    "// AUTO-GENERATED. DO NOT EDIT BY HAND.",
    "",
    "export interface CharacterProfileManifestEntry {",
    "  slug: string",
    "  id: string",
    "  file: string",
    "  referenceCount: number",
    "}",
    "",
    "export const characterProfileManifest: CharacterProfileManifestEntry[] = [",
]

for slug, pid, filename, ref_count in manifest:
    manifest_lines.append(
        "  { "
        f"slug: {slug!r}, "
        f"id: {pid!r}, "
        f"file: {filename!r}, "
        f"referenceCount: {ref_count}"
        " },"
    )

manifest_lines += ["]", ""]

(ROOT / "src/data/characterProfileManifest.generated.ts").write_text(
    "\n".join(manifest_lines),
    encoding="utf-8",
)

if OUT_DIR.exists():
    shutil.rmtree(OUT_DIR)

tmp_dir.rename(OUT_DIR)

print("=== PROFILE SPLIT COMPLETE ===")
print("Profiles:", len(parsed))
print("Unique IDs:", len(set(ids)))
print("Unique slugs:", len(set(slugs)))
print("Zero-reference profiles:", sum(x[3] == 0 for x in parsed))
print("Jesus Christ references:", jesus[3])
print("Jesus Christ:", jesus[0], "->", jesus[1])
print("Jesus Justus:", jesus_justus[0], "->", jesus_justus[1])
print("Output:", OUT_DIR)
