from pathlib import Path
import re

source = Path("src/data/verifiedCharacters.generated.ts")
output = Path("src/data/characterSearchIndex.generated.ts")

text = source.read_text(encoding="utf-8")

array_start = text.find("[")
array_end = text.rfind("]")

if array_start == -1 or array_end == -1:
    raise SystemExit(
        "Could not locate verifiedCharacters array."
    )

body = text[array_start + 1:array_end]

objects = []
depth = 0
start = None
quote = None
escape = False

for i, ch in enumerate(body):
    if quote:
        if escape:
            escape = False
        elif ch == "\\":
            escape = True
        elif ch == quote:
            quote = None
        continue

    if ch in ("'", '"', "`"):
        quote = ch
        continue

    if ch == "{":
        if depth == 0:
            start = i
        depth += 1

    elif ch == "}":
        depth -= 1

        if depth == 0 and start is not None:
            objects.append(body[start:i + 1])
            start = None


print("Parsed verified characters:", len(objects))

if len(objects) != 2922:
    raise SystemExit(
        "STOP: expected 2922 verified characters, "
        f"found {len(objects)}"
    )


def scalar(obj, field):
    match = re.search(
        rf"^\s*{re.escape(field)}:\s*"
        r"""('(?:\\.|[^'])*'|"(?:\\.|[^"])*")"""
        r"\s*,?",
        obj,
        re.M,
    )

    if not match:
        raise ValueError(
            f"Missing scalar field: {field}"
        )

    return match.group(1)


def array_field(obj, field):
    match = re.search(
        rf"^\s*{re.escape(field)}:\s*"
        r"(\[[^\n]*\])\s*,?",
        obj,
        re.M,
    )

    if not match:
        raise ValueError(
            f"Missing array field: {field}"
        )

    return match.group(1)


records = []

for index, obj in enumerate(objects, 1):
    try:
        records.append(
            {
                "id": scalar(obj, "id"),
                "name": scalar(obj, "name"),
                "slug": scalar(obj, "slug"),
                "alternateNames": array_field(
                    obj,
                    "alternateNames",
                ),
                "testament": scalar(
                    obj,
                    "testament",
                ),
                "categories": array_field(
                    obj,
                    "categories",
                ),
            }
        )

    except Exception as exc:
        raise SystemExit(
            "STOP: failed parsing character "
            f"#{index}: {exc}"
        )


lines = [
    "import type { CharacterSummary } from '@/types'",
    "",
    "// AUTO-GENERATED from verifiedCharacters.generated.ts.",
    "// Compact browse/search data. Full profiles load separately.",
    (
        "export const characterSearchIndex: "
        "CharacterSummary[] = ["
    ),
]

for record in records:
    lines.extend(
        [
            "  {",
            f"    id: {record['id']},",
            f"    name: {record['name']},",
            f"    slug: {record['slug']},",
            (
                "    alternateNames: "
                f"{record['alternateNames']},"
            ),
            f"    testament: {record['testament']},",
            f"    categories: {record['categories']},",
            "  },",
        ]
    )

lines.extend(
    [
        "]",
        "",
    ]
)

output.write_text(
    "\n".join(lines),
    encoding="utf-8",
)

print("Generated:", output)
print("Records:", len(records))
print(
    "Size:",
    f"{output.stat().st_size / 1024:.2f} KB",
)
