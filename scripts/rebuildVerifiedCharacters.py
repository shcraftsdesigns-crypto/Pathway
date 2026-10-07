import csv
import re
from collections import defaultdict
from pathlib import Path

DB = Path("verification/final-verified-character-database.csv")
PV = Path("verification/source/BibleData-PersonVerse.csv")
PERSON = Path("verification/source/BibleData-Person.csv")
OUT = Path("src/data/verifiedCharacters.generated.ts")

BOOKS = {
    "GEN":"Genesis","EXO":"Exodus","LEV":"Leviticus","NUM":"Numbers","DEU":"Deuteronomy",
    "JOS":"Joshua","JDG":"Judges","RUT":"Ruth","1SA":"1 Samuel","2SA":"2 Samuel",
    "1KI":"1 Kings","2KI":"2 Kings","1CH":"1 Chronicles","2CH":"2 Chronicles",
    "EZR":"Ezra","NEH":"Nehemiah","EST":"Esther","JOB":"Job","PSA":"Psalms",
    "PRO":"Proverbs","ECC":"Ecclesiastes","SNG":"Song of Solomon","ISA":"Isaiah",
    "JER":"Jeremiah","LAM":"Lamentations","EZK":"Ezekiel","DAN":"Daniel","HOS":"Hosea",
    "JOL":"Joel","AMO":"Amos","OBA":"Obadiah","JON":"Jonah","MIC":"Micah",
    "NAM":"Nahum","HAB":"Habakkuk","ZEP":"Zephaniah","HAG":"Haggai","ZEC":"Zechariah",
    "MAL":"Malachi","MAT":"Matthew","MRK":"Mark","LUK":"Luke","JHN":"John",
    "ACT":"Acts","ROM":"Romans","1CO":"1 Corinthians","2CO":"2 Corinthians",
    "GAL":"Galatians","EPH":"Ephesians","PHP":"Philippians","COL":"Colossians",
    "1TH":"1 Thessalonians","2TH":"2 Thessalonians","1TI":"1 Timothy","2TI":"2 Timothy",
    "TIT":"Titus","PHM":"Philemon","HEB":"Hebrews","JAS":"James","1PE":"1 Peter",
    "2PE":"2 Peter","1JN":"1 John","2JN":"2 John","3JN":"3 John","JUD":"Jude",
    "REV":"Revelation",
}

OT = set(list(BOOKS)[:39])

def ts(s):
    return "'" + (s or "").replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ") + "'"

def slugify(s):
    s = s.lower().replace("’", "").replace("'", "")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")

def parse_ref(ref):
    m = re.fullmatch(r"([1-3]?[A-Z]+)\s+(\d+):(\d+)", ref.strip())
    if not m:
        return None
    code, ch, vs = m.groups()
    if code not in BOOKS:
        return None
    return {
        "code": code,
        "book": BOOKS[code],
        "chapter": int(ch),
        "verse": int(vs),
    }

# ---------------------------------------------------------
# Load approved identities and remove explicit LXX-only rows
# ---------------------------------------------------------
people = []

# Load source person metadata by exact person_id so identity-specific
# attributes are never merged between people who share the same name.
with PERSON.open(newline="", encoding="utf-8-sig") as f:
    person_metadata = {
        r["person_id"]: r
        for r in csv.DictReader(f)
    }

with DB.open(newline="", encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        notes = r.get("person_notes") or ""
        low = notes.lower()

        if "not present in the bhs hebrew text" in low and "septuaginta" in low:
            continue

        metadata = person_metadata.get(r["person_id"], {})
        r["unique_attribute"] = (metadata.get("unique_attribute") or "").strip()

        people.append(r)

if len(people) != 2921:
    raise SystemExit(f"ERROR: Expected 2921 in-scope identities, got {len(people)}")

approved_ids = {r["person_id"] for r in people}

# ---------------------------------------------------------
# References strictly by person_id
# ---------------------------------------------------------
refs = defaultdict(list)
seen_refs = defaultdict(set)

with PV.open(newline="", encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        pid = r["person_id"]
        if pid not in approved_ids:
            continue

        parsed = parse_ref(r["reference_id"])
        if not parsed:
            continue

        key = (parsed["book"], parsed["chapter"], parsed["verse"])
        if key not in seen_refs[pid]:
            seen_refs[pid].add(key)
            refs[pid].append(parsed)

# ---------------------------------------------------------
# Evidence-based special mappings
# ---------------------------------------------------------
def add_ref(pid, reference):
    parsed = parse_ref(reference)
    if not parsed:
        raise ValueError(reference)

    key = (parsed["book"], parsed["chapter"], parsed["verse"])
    if key not in seen_refs[pid]:
        seen_refs[pid].add(key)
        refs[pid].append(parsed)

# Source metadata explicitly identifies these verses.
add_ref("Ammizabad_1", "1CH 27:6")
add_ref("Gemariah_2", "JER 36:10")
add_ref("Hashabiah_6", "NEH 10:9")
add_ref("Hashabiah_6", "NEH 10:11")
add_ref("Zechariah_17", "EZR 8:11")

# Source note identifies Raphah_1 with 2 Samuel 21:16.
# Some translations render this as "the giant".
add_ref("Raphah_1", "2SA 21:16")

# BibleData PersonVerse records Shishak under Pharaoh_5.
for ref in ["1KI 14:25", "2CH 12:2", "2CH 12:5", "2CH 12:7", "2CH 12:9"]:
    add_ref("Shishak_1", ref)

# ---------------------------------------------------------
# Jesus Christ:
# BibleData identifies Jesus Christ under YHVH_1.
# Keep this as a distinct Pathway identity.
# ---------------------------------------------------------
jesus_refs = []
jesus_seen = set()
jesus_labels = {"jesus", "jesus christ", "lord jesus christ", "christ jesus"}

with PV.open(newline="", encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        if r["person_id"] != "YHVH_1":
            continue
        if (r.get("person_label") or "").strip().lower() not in jesus_labels:
            continue

        parsed = parse_ref(r["reference_id"])
        if not parsed:
            continue

        key = (parsed["book"], parsed["chapter"], parsed["verse"])
        if key not in jesus_seen:
            jesus_seen.add(key)
            jesus_refs.append(parsed)

if len(jesus_refs) != 871:
    raise SystemExit(
        f"ERROR: Expected 871 verified Jesus references, got {len(jesus_refs)}"
    )

# ---------------------------------------------------------
# Determine duplicate display names and unique slugs
# ---------------------------------------------------------
by_name = defaultdict(list)
for r in people:
    by_name[r["character_name"]].append(r)

used_slugs = set()

def make_slug(row):
    name = row["character_name"]
    pid = row["person_id"]
    base = slugify(name)

    # Preserve important public slugs.
    if pid == "Jesus_1":
        base = "jesus-justus"

    if len(by_name[name]) == 1 and base not in used_slugs:
        slug = base
    else:
        suffix = re.sub(r"^.*?_", "", pid).lower()
        slug = f"{base}-{suffix}"

    original = slug
    n = 2
    while slug in used_slugs:
        slug = f"{original}-{n}"
        n += 1

    used_slugs.add(slug)
    return slug

# ---------------------------------------------------------
# Testament based on actual references
# ---------------------------------------------------------
def testament_for(pid):
    rr = refs.get(pid, [])
    if not rr:
        return "Old Testament"

    if any(x["code"] in OT for x in rr):
        return "Old Testament"

    return "New Testament"

# ---------------------------------------------------------
# Descriptions
# ---------------------------------------------------------
def descriptions(row):
    name = row["character_name"]
    unique_attribute = (row.get("unique_attribute") or "").strip()
    notes = (row.get("person_notes") or "").strip()
    tribe = (row.get("tribe") or "").strip()

    details = []

    if unique_attribute:
        details.append(unique_attribute)

    if tribe:
        details.append(f"Tribe: {tribe}.")

    if notes:
        details.append(notes)

    if details:
        return " ".join(details)

    return f"Biblical person named {name}."

# ---------------------------------------------------------
# Generate
# ---------------------------------------------------------
out = []
out.append("import type { BiblicalCharacter } from '@/types'")
out.append("")
out.append("export const verifiedCharacters: BiblicalCharacter[] = [")

for row in people:
    pid = row["person_id"]
    name = row["character_name"]

    # Canonical public identities.
    #
    # Abram_1 is one biblical person whose name changes from Abram to
    # Abraham in Genesis 17:5. Keep the source person ID unchanged while
    # using the later biblical name as the public display name/slug.
    #
    # Jesus_1 in the source is Jesus Justus, not Jesus Christ.
    if pid == "Abram_1":
        display_name = "Abraham"
        slug = "abraham"
    elif pid == "Jesus_1":
        display_name = "Jesus Justus"
        slug = make_slug(row)
    else:
        display_name = name
        slug = make_slug(row)

    desc = descriptions(row)

    out.append("  {")
    out.append(f"    id: {ts(pid)},")
    out.append(f"    name: {ts(display_name)},")
    out.append(f"    slug: {ts(slug)},")

    if pid == "Abram_1":
        out.append("    alternateNames: ['Abram'],")
    elif pid == "Jesus_1":
        out.append("    alternateNames: ['Jesus', 'Justus'],")
    else:
        out.append("    alternateNames: [],")

    out.append(f"    testament: {ts(testament_for(pid))},")
    out.append("    categories: ['Other'],")
    out.append("    subtitle: 'Biblical character',")
    out.append(f"    shortDescription: {ts(desc)},")
    out.append(f"    biography: {ts(desc)},")
    out.append("    keyScriptures: [")

    for r in refs.get(pid, []):
        out.append(
            f"      {{ book: {ts(r['book'])}, chapter: {r['chapter']}, "
            f"verseStart: {r['verse']} }},"
        )

    out.append("    ],")
    out.append("  },")

# Jesus Christ is separate from Jesus Justus.
out.append("  {")
out.append("    id: 'Jesus_Christ',")
out.append("    name: 'Jesus',")
out.append("    slug: 'jesus',")
out.append("    alternateNames: ['Jesus Christ', 'Christ Jesus', 'Lord Jesus Christ'],")
out.append("    testament: 'New Testament',")
out.append("    categories: ['Other'],")
out.append("    subtitle: 'Jesus Christ',")
out.append("    shortDescription: 'Jesus Christ as identified in the verified Scripture source.',")
out.append("    biography: 'Jesus Christ as identified in the verified Scripture source.',")
out.append("    keyScriptures: [")

for r in jesus_refs:
    out.append(
        f"      {{ book: {ts(r['book'])}, chapter: {r['chapter']}, "
        f"verseStart: {r['verse']} }},"
    )

out.append("    ],")
out.append("  },")
out.append("]")
out.append("")

OUT.write_text("\n".join(out), encoding="utf-8")

print("=== PATHWAY REBUILD COMPLETE ===")
print("66-book source identities:", len(people))
print("Jesus Christ added separately: 1")
print("Generated characters:", len(people) + 1)
print("Jesus Christ references:", len(jesus_refs))

zero = [r["person_id"] for r in people if not refs.get(r["person_id"])]

print("Characters with zero references:", len(zero))
for pid in zero:
    print(" -", pid)

print("Output:", OUT)
