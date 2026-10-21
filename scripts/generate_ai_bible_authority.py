#!/usr/bin/env python3

from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
BIBLE_DIR = ROOT / "public/bibles/bsb"
OUTPUT = ROOT / "api/aiBibleAuthority.generated.ts"

manifest_path = BIBLE_DIR / "manifest.json"

if not manifest_path.exists():
    raise RuntimeError("Missing BSB manifest")

manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
books = manifest.get("books")

if not isinstance(books, list) or len(books) != 66:
    raise RuntimeError(
        f"Expected 66 BSB books, found {len(books) if isinstance(books, list) else 0}"
    )

records = []
chapter_total = 0
verse_total = 0

seen_book_ids = set()
seen_book_names = set()

for book in books:
    book_id = book.get("id")
    book_name = book.get("name")
    chapter_count = book.get("chapters")

    if not isinstance(book_id, str) or not book_id:
        raise RuntimeError("Invalid BSB book ID")

    if not isinstance(book_name, str) or not book_name:
        raise RuntimeError(f"{book_id}: invalid book name")

    if not isinstance(chapter_count, int) or chapter_count < 1:
        raise RuntimeError(f"{book_id}: invalid chapter count")

    if book_id in seen_book_ids:
        raise RuntimeError(f"Duplicate BSB book ID: {book_id}")

    if book_name in seen_book_names:
        raise RuntimeError(f"Duplicate BSB book name: {book_name}")

    seen_book_ids.add(book_id)
    seen_book_names.add(book_name)

    for chapter in range(1, chapter_count + 1):
        chapter_path = BIBLE_DIR / book_id / f"{chapter}.json"

        if not chapter_path.exists():
            raise RuntimeError(
                f"Missing BSB chapter: {book_id} {chapter}"
            )

        data = json.loads(chapter_path.read_text(encoding="utf-8"))

        if data.get("bookId") != book_id:
            raise RuntimeError(
                f"{book_id} {chapter}: mismatched bookId"
            )

        if data.get("bookName") != book_name:
            raise RuntimeError(
                f"{book_id} {chapter}: mismatched bookName"
            )

        if data.get("chapter") != chapter:
            raise RuntimeError(
                f"{book_id} {chapter}: mismatched chapter"
            )

        verses = data.get("verses")

        if not isinstance(verses, list) or not verses:
            raise RuntimeError(
                f"{book_id} {chapter}: no verses"
            )

        clean_verses = []
        seen_verses = set()

        for verse in verses:
            number_raw = verse.get("number")
            text = verse.get("text")

            try:
                number = int(number_raw)
            except (TypeError, ValueError):
                raise RuntimeError(
                    f"{book_id} {chapter}: invalid verse number"
                )

            if number < 1:
                raise RuntimeError(
                    f"{book_id} {chapter}: invalid verse {number}"
                )

            if number in seen_verses:
                raise RuntimeError(
                    f"{book_id} {chapter}: duplicate verse {number}"
                )

            if not isinstance(text, str) or not text.strip():
                raise RuntimeError(
                    f"{book_id} {chapter}:{number}: empty verse text"
                )

            seen_verses.add(number)

            clean_verses.append({
                "number": number,
                "text": text.strip(),
            })

        clean_verses.sort(key=lambda item: item["number"])

        records.append({
            "bookId": book_id,
            "bookName": book_name,
            "chapter": chapter,
            "verses": clean_verses,
        })

        chapter_total += 1
        verse_total += len(clean_verses)

if chapter_total != 1189:
    raise RuntimeError(
        f"Expected 1189 BSB chapters, found {chapter_total}"
    )

payload = json.dumps(
    records,
    ensure_ascii=False,
    separators=(",", ":"),
)

content = f"""// AUTO-GENERATED. DO NOT EDIT BY HAND.
// Server-authoritative Pathway AI Bible evidence.
// Generated from public/bibles/bsb.

export interface AIBibleAuthorityVerse {{
  number: number
  text: string
}}

export interface AIBibleAuthorityChapter {{
  bookId: string
  bookName: string
  chapter: number
  verses: AIBibleAuthorityVerse[]
}}

const records: AIBibleAuthorityChapter[] = {payload}

const byChapter = new Map(
  records.map((record) => [
    `${{record.bookId}}:${{record.chapter}}`,
    record,
  ]),
)

export function getAuthoritativeAIBibleChapter(
  bookId: string,
  chapter: number,
): AIBibleAuthorityChapter | null {{
  return (
    byChapter.get(
      `${{bookId.toUpperCase()}}:${{chapter}}`,
    ) ?? null
  )
}}
"""

OUTPUT.write_text(content, encoding="utf-8")

print("=== AI BIBLE AUTHORITY GENERATED ===")
print("Books:", len(seen_book_ids))
print("Chapters:", chapter_total)
print("Verses:", verse_total)
print(
    "Output size:",
    f"{OUTPUT.stat().st_size / 1024 / 1024:.2f} MB",
)
print("Bible authority: PASS")
