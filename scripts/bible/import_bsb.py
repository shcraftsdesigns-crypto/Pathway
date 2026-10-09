import json, re, shutil, zipfile
import xml.etree.ElementTree as ET
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "bsb.xlsx"
OUTPUT = ROOT / "public/bibles/bsb"

BOOKS = [
("Genesis","GEN",50),("Exodus","EXO",40),("Leviticus","LEV",27),
("Numbers","NUM",36),("Deuteronomy","DEU",34),("Joshua","JOS",24),
("Judges","JDG",21),("Ruth","RUT",4),("1 Samuel","1SA",31),
("2 Samuel","2SA",24),("1 Kings","1KI",22),("2 Kings","2KI",25),
("1 Chronicles","1CH",29),("2 Chronicles","2CH",36),("Ezra","EZR",10),
("Nehemiah","NEH",13),("Esther","EST",10),("Job","JOB",42),
("Psalms","PSA",150),("Proverbs","PRO",31),("Ecclesiastes","ECC",12),
("Song of Solomon","SNG",8),("Isaiah","ISA",66),("Jeremiah","JER",52),
("Lamentations","LAM",5),("Ezekiel","EZK",48),("Daniel","DAN",12),
("Hosea","HOS",14),("Joel","JOL",3),("Amos","AMO",9),
("Obadiah","OBA",1),("Jonah","JON",4),("Micah","MIC",7),
("Nahum","NAM",3),("Habakkuk","HAB",3),("Zephaniah","ZEP",3),
("Haggai","HAG",2),("Zechariah","ZEC",14),("Malachi","MAL",4),
("Matthew","MAT",28),("Mark","MRK",16),("Luke","LUK",24),
("John","JHN",21),("Acts","ACT",28),("Romans","ROM",16),
("1 Corinthians","1CO",16),("2 Corinthians","2CO",13),
("Galatians","GAL",6),("Ephesians","EPH",6),("Philippians","PHP",4),
("Colossians","COL",4),("1 Thessalonians","1TH",5),
("2 Thessalonians","2TH",3),("1 Timothy","1TI",6),
("2 Timothy","2TI",4),("Titus","TIT",3),("Philemon","PHM",1),
("Hebrews","HEB",13),("James","JAS",5),("1 Peter","1PE",5),
("2 Peter","2PE",3),("1 John","1JN",5),("2 John","2JN",1),
("3 John","3JN",1),("Jude","JUD",1),("Revelation","REV",22)
]

BOOK_MAP = {name:(code,count) for name,code,count in BOOKS}

# Official BSB workbook reference-name aliases.
BOOK_MAP["Psalm"] = BOOK_MAP["Psalms"]

NS = {"m":"http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
REF_RE = re.compile(r"^(.+?)\s+(\d+):(\d+)$")

def text_of(node):
    return "".join(
        x.text or "" for x in node.iter()
        if x.tag.endswith("}t")
    )

with zipfile.ZipFile(SOURCE) as z:
    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        root = ET.fromstring(z.read("xl/sharedStrings.xml"))
        shared = [text_of(x) for x in root if x.tag.endswith("}si")]

    sheet = ET.fromstring(z.read("xl/worksheets/sheet1.xml"))
    chapters = defaultdict(list)
    unknown = set()

    for row in sheet.findall(".//m:row", NS):
        values = {}

        for cell in row.findall("m:c", NS):
            ref = cell.attrib.get("r","")
            col = re.match(r"[A-Z]+", ref)
            if not col:
                continue

            col = col.group()
            kind = cell.attrib.get("t")
            value = cell.find("m:v", NS)

            if kind == "inlineStr":
                inline = cell.find("m:is", NS)
                val = text_of(inline) if inline is not None else ""
            elif value is None:
                val = ""
            elif kind == "s":
                val = shared[int(value.text)]
            else:
                val = value.text or ""

            values[col] = val.strip()

        reference = values.get("B","")
        verse_text = values.get("C","")
        match = REF_RE.match(reference)

        if not match or not verse_text:
            continue

        name, chapter, verse = match.group(1), int(match.group(2)), int(match.group(3))

        if name not in BOOK_MAP:
            unknown.add(name)
            continue

        code, max_chapters = BOOK_MAP[name]

        if not 1 <= chapter <= max_chapters:
            raise SystemExit(f"ERROR invalid chapter: {reference}")

        chapters[(code,chapter)].append((verse,verse_text))

if unknown:
    raise SystemExit("ERROR unknown books: " + ", ".join(sorted(unknown)))

expected = sum(count for _,_,count in BOOKS)

if len(chapters) != expected:
    missing = [
        f"{code} {chapter}"
        for _,code,count in BOOKS
        for chapter in range(1,count+1)
        if (code,chapter) not in chapters
    ]
    raise SystemExit(
        f"ERROR expected {expected} chapters, found {len(chapters)}; "
        f"missing: {', '.join(missing[:20])}"
    )

if OUTPUT.exists():
    shutil.rmtree(OUTPUT)

OUTPUT.mkdir(parents=True)

verse_total = 0

for name,code,count in BOOKS:
    directory = OUTPUT / code
    directory.mkdir()

    for chapter in range(1,count+1):
        verses = sorted(chapters[(code,chapter)])
        verse_total += len(verses)

        data = {
            "translation":{
                "id":"bsb",
                "name":"Berean Standard Bible",
                "abbreviation":"BSB",
                "language":"English",
                "copyright":"Berean Standard Bible (BSB). Dedicated to the public domain."
            },
            "bookId":code,
            "bookName":name,
            "chapter":chapter,
            "reference":f"{name} {chapter}",
            "verses":[
                {
                    "id":f"{code}.{chapter}.{number}",
                    "number":str(number),
                    "text":text
                }
                for number,text in verses
            ],
            "copyright":"Berean Standard Bible (BSB). Dedicated to the public domain."
        }

        (directory / f"{chapter}.json").write_text(
            json.dumps(data,ensure_ascii=False,separators=(",",":")),
            encoding="utf-8"
        )

manifest = {
    "translation":{
        "id":"bsb",
        "name":"Berean Standard Bible",
        "abbreviation":"BSB",
        "language":"English",
        "description":"Modern English Bible translation dedicated to the public domain.",
        "copyright":"Berean Standard Bible (BSB). Dedicated to the public domain."
    },
    "books":[
        {"id":code,"name":name,"chapters":count}
        for name,code,count in BOOKS
    ]
}

(OUTPUT/"manifest.json").write_text(
    json.dumps(manifest,ensure_ascii=False,separators=(",",":")),
    encoding="utf-8"
)

print("BSB IMPORT PASS")
print("Books:", len(BOOKS))
print("Chapters:", len(chapters))
print("Verses:", verse_total)
print("Output: public/bibles/bsb")
