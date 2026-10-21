#!/usr/bin/env python3

from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PROFILE_DIR = ROOT / "src/data/characterProfiles"
OUTPUT = ROOT / "api/aiCharacterAuthority.generated.ts"

MAX_REFERENCES = 80


def string_field(text: str, name: str) -> str:
    match = re.search(
        rf"\b{re.escape(name)}:\s*'((?:\\.|[^'])*)'",
        text,
    )

    if not match:
        raise RuntimeError(f"Missing {name}")

    return match.group(1).replace("\\'", "'").replace("\\\\", "\\")


def array_field(text: str, name: str) -> list[str]:
    match = re.search(
        rf"\b{re.escape(name)}:\s*\[(.*?)\]",
        text,
        re.S,
    )

    if not match:
        return []

    return re.findall(r"'((?:\\.|[^'])*)'", match.group(1))


def references(text: str) -> list[dict]:
    match = re.search(
        r"\bkeyScriptures:\s*\[(.*?)\]\s*,?\s*}",
        text,
        re.S,
    )

    if not match:
        return []

    result = []

    for ref in re.finditer(
        r"\{\s*book:\s*'([^']+)'\s*,"
        r"\s*chapter:\s*(\d+)"
        r"(?:\s*,\s*verseStart:\s*(\d+))?"
        r"(?:\s*,\s*verseEnd:\s*(\d+))?"
        r"\s*}",
        match.group(1),
    ):
        item = {
            "book": ref.group(1),
            "chapter": int(ref.group(2)),
        }

        if ref.group(3):
            item["verseStart"] = int(ref.group(3))

        if ref.group(4):
            item["verseEnd"] = int(ref.group(4))

        result.append(item)

    return result


records = []

for path in sorted(PROFILE_DIR.glob("*.ts")):
    text = path.read_text(encoding="utf-8")

    record = {
        "id": string_field(text, "id"),
        "name": string_field(text, "name"),
        "slug": string_field(text, "slug"),
        "alternateNames": array_field(text, "alternateNames"),
        "testament": string_field(text, "testament"),
        "subtitle": string_field(text, "subtitle"),
        "shortDescription": string_field(text, "shortDescription"),
        "verifiedReferences": references(text)[:MAX_REFERENCES],
    }

    if not record["verifiedReferences"]:
        raise RuntimeError(
            f"{path.name}: no verified references parsed"
        )

    records.append(record)


if len(records) != 2922:
    raise RuntimeError(
        f"Expected 2922 profiles, found {len(records)}"
    )

ids = [record["id"] for record in records]
slugs = [record["slug"] for record in records]

if len(set(ids)) != len(ids):
    raise RuntimeError("Duplicate character IDs")

if len(set(slugs)) != len(slugs):
    raise RuntimeError("Duplicate character slugs")


important = {
    "jesus": "Jesus_Christ",
    "jesus-justus": "Jesus_1",
    "abraham": "Abram_1",
    "john-the-baptist": "John_1",
    "moses": "Moses_1",
    "david": "David_1",
}

by_slug = {
    record["slug"]: record
    for record in records
}

for slug, expected_id in important.items():
    actual = by_slug.get(slug)

    if not actual:
        raise RuntimeError(f"Missing critical identity: {slug}")

    if actual["id"] != expected_id:
        raise RuntimeError(
            f"{slug}: expected {expected_id}, "
            f"found {actual['id']}"
        )


payload = json.dumps(
    records,
    ensure_ascii=False,
    separators=(",", ":"),
)

content = f"""// AUTO-GENERATED. DO NOT EDIT BY HAND.
// Server-authoritative Pathway AI character identity/evidence.
// Generated from src/data/characterProfiles.

export interface AICharacterAuthorityRecord {{
  id: string
  name: string
  slug: string
  alternateNames: string[]
  testament: string
  subtitle: string
  shortDescription: string
  verifiedReferences: Array<{{
    book: string
    chapter: number
    verseStart?: number
    verseEnd?: number
  }}>
}}

const records: AICharacterAuthorityRecord[] = {payload}

const bySlug = new Map(
  records.map((record) => [record.slug, record]),
)

export function getAuthoritativeAICharacter(
  slug: string,
): AICharacterAuthorityRecord | null {{
  return bySlug.get(slug.toLowerCase()) ?? null
}}
"""

OUTPUT.write_text(content, encoding="utf-8")

print("=== AI CHARACTER AUTHORITY GENERATED ===")
print("Profiles:", len(records))
print("Unique IDs:", len(set(ids)))
print("Unique slugs:", len(set(slugs)))
print(
    "References:",
    sum(len(r["verifiedReferences"]) for r in records),
)
print(
    "Output size:",
    f"{OUTPUT.stat().st_size / 1024:.2f} KB",
)
print("Critical identities: PASS")
