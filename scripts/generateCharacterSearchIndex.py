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


def unquote(value):
    if len(value) >= 2 and value[0] in ("'", '"') and value[-1] == value[0]:
        body = value[1:-1]
        return bytes(body, "utf-8").decode("unicode_escape")
    return value


def ts_string(value):
    escaped = (
        value
        .replace("\\", "\\\\")
        .replace("'", "\\'")
        .replace("\n", " ")
        .replace("\r", " ")
    )
    return f"'{escaped}'"


def identity_hint(obj):
    description = unquote(
        scalar(obj, "shortDescription")
    ).strip()

    if not description:
        return ""

    # Remove uncertainty/editorial parentheticals such as
    # "(the wife?)", "(ancestor?)", "(his grandfather?)".
    description = re.sub(
        r"\([^)]*\?[^)]*\)",
        " ",
        description,
    )

    # Remove ordinary parenthetical Bible-reference groups.
    description = re.sub(
        r"\([^)]*\b(?:"
        r"GEN|EXO|LEV|NUM|DEU|DEUT|JOS|JDG|RUT|"
        r"1SA|2SA|1KI|2KI|1CH|2CH|EZR|NEH|EST|"
        r"JOB|PSA|PRO|ECC|SNG|ISA|JER|LAM|EZE|"
        r"DAN|HOS|JOL|AMO|OBA|JON|MIC|NAM|HAB|"
        r"ZEP|HAG|ZEC|MAL|"
        r"MAT|MRK|MAR|LUK|JHN|ACT|ROM|"
        r"1CO|2CO|GAL|EPH|PHP|COL|"
        r"1TH|2TH|1TI|2TI|TIT|PHM|HEB|JAS|"
        r"1PE|2PE|1JN|2JN|3JN|JUD|REV"
        r")\b[^)]*\)",
        " ",
        description,
        flags=re.I,
    )

    # Remove remaining inline reference forms such as:
    # "1CH 5:7", "NEH 10:1-27", "1 SA 14:3".
    description = re.sub(
        r"\b(?:[1-3]\s*)?[A-Z]{2,4}"
        r"\s+\d+(?::\d+(?:-\d+)?)?"
        r"(?:\s*,\s*(?:[1-3]\s*)?[A-Z]{2,4}"
        r"\s+\d+(?::\d+(?:-\d+)?)?)*",
        " ",
        description,
        flags=re.I,
    )

    # Remove explicit uncertainty from the compact label.
    description = re.split(
        r"\b(?:possibly|likely|perhaps|probably|"
        r"maybe|uncertain|assuming)\b",
        description,
        maxsplit=1,
        flags=re.I,
    )[0]

    # Tribe information belongs on the full profile.
    description = re.split(
        r"\bTribe:",
        description,
        maxsplit=1,
        flags=re.I,
    )[0]

    # Remove source-ID suffixes from names shown to users.
    description = re.sub(
        r"\b([A-Za-z][A-Za-z'-]*)_\d+\b",
        r"\1",
        description,
    )

    # Clean punctuation and whitespace left by removals.
    description = re.sub(r"\(\s*\)", " ", description)
    description = re.sub(r"\[\s*\]", " ", description)
    description = re.sub(r"\s+", " ", description)
    description = re.sub(
        r"\s+([,.;:])",
        r"\1",
        description,
    )
    description = description.strip(" .;,:-")

    # The identity hint is a label, not a biography.
    # Keep the first useful clause and cap it tightly.
    clauses = [
        value.strip(" .;,:-")
        for value in re.split(r"[.;]", description)
        if value.strip(" .;,:-")
    ]

    hint = clauses[0] if clauses else description

    if len(hint) > 80:
        cut = hint[:80]
        boundary = max(
            cut.rfind(","),
            cut.rfind(" "),
        )

        if boundary >= 45:
            cut = cut[:boundary]

        hint = cut.rstrip(" ,.;:-") + "…"

    # Never present uncertain source wording as a factual
    # identity label. The verified primary Scripture reference
    # will still distinguish this identity in the UI.
    unsafe_hint = (
        not hint
        or "?" in hint
        or "???" in hint
        or re.search(
            r"\b(?:possibly|likely|perhaps|probably|"
            r"maybe|uncertain|assuming)\b",
            hint,
            flags=re.I,
        )
        or re.search(
            r"\b(?:[1-3]\s*)?[A-Z]{2,4}"
            r"\s+\d+(?::\d+(?:-\d+)?)?",
            hint,
        )
    )

    return "" if unsafe_hint else hint

def first_key_scripture(obj):
    match = re.search(
        r"keyScriptures:\s*\[\s*"
        r"\{\s*book:\s*('(?:\\.|[^'])*'|\"(?:\\.|[^\"])*\")"
        r"\s*,\s*chapter:\s*(\d+)"
        r"(?:\s*,\s*verseStart:\s*(\d+))?"
        r"(?:\s*,\s*verseEnd:\s*(\d+))?"
        r"\s*\}",
        obj,
        re.S,
    )

    if not match:
        return None

    return {
        "book": match.group(1),
        "chapter": int(match.group(2)),
        "verseStart": int(match.group(3)) if match.group(3) else None,
        "verseEnd": int(match.group(4)) if match.group(4) else None,
    }


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
                "identityHint": identity_hint(obj),
                "primaryReference": first_key_scripture(obj),
            }
        )

    except Exception as exc:
        raise SystemExit(
            "STOP: failed parsing character "
            f"#{index}: {exc}"
        )


name_counts = {}

for record in records:
    normalized_name = unquote(record["name"]).strip().lower()
    name_counts[normalized_name] = (
        name_counts.get(normalized_name, 0) + 1
    )

for record in records:
    normalized_name = unquote(record["name"]).strip().lower()
    record["hasDuplicateName"] = (
        name_counts.get(normalized_name, 0) > 1
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
            *(
                [
                    (
                        "    identityHint: "
                        f"{ts_string(record['identityHint'])},"
                    ),
                    (
                        "    primaryReference: "
                        + (
                            "{ "
                            f"book: {record['primaryReference']['book']}, "
                            f"chapter: {record['primaryReference']['chapter']}"
                            + (
                                f", verseStart: {record['primaryReference']['verseStart']}"
                                if record['primaryReference']['verseStart'] is not None
                                else ""
                            )
                            + (
                                f", verseEnd: {record['primaryReference']['verseEnd']}"
                                if record['primaryReference']['verseEnd'] is not None
                                else ""
                            )
                            + " },"
                            if record['primaryReference']
                            else "undefined,"
                        )
                    ),
                ]
                if record["hasDuplicateName"]
                else []
            ),
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
