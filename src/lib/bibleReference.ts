import {
  bibleBooks,
  type BibleBook,
} from '@/data/bibleBooks'

export interface ParsedBiblePassage {
  book: BibleBook
  chapter: number
  verseStart?: number
  verseEnd?: number
}

function normalizeBibleBookName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/\s+/g, ' ')
}

function getBookNames(book: BibleBook): string[] {
  const names = [
    book.name,
    book.abbreviation,
    book.id,
  ]

  if (book.id === 'PSA') {
    names.push('Psalm')
  }

  return names
}

function findBibleBook(value: string) {
  const normalizedValue = normalizeBibleBookName(value)
  const normalized = normalizedValue === 'psalm' ? 'psalms' : normalizedValue

  return bibleBooks.find((book) =>
    getBookNames(book).some(
      (name) =>
        normalizeBibleBookName(name) === normalized,
    ),
  )
}

function buildParsedPassage(
  rawBook: string,
  rawChapter: string,
  rawVerseStart?: string,
  rawVerseEnd?: string,
): ParsedBiblePassage | null {
  const book = findBibleBook(rawBook)

  if (!book) return null

  const chapter = Number(rawChapter)
  const verseStart = rawVerseStart
    ? Number(rawVerseStart)
    : undefined
  const verseEnd = rawVerseEnd
    ? Number(rawVerseEnd)
    : undefined

  if (
    !Number.isInteger(chapter) ||
    chapter < 1 ||
    chapter > book.chapters
  ) {
    return null
  }

  if (
    verseStart !== undefined &&
    (!Number.isInteger(verseStart) || verseStart < 1)
  ) {
    return null
  }

  if (
    verseEnd !== undefined &&
    (!Number.isInteger(verseEnd) ||
      verseEnd < (verseStart ?? 1))
  ) {
    return null
  }

  return {
    book,
    chapter,
    verseStart,
    verseEnd,
  }
}

export function parseBiblePassage(
  value: string,
): ParsedBiblePassage | null {
  const match = value.trim().match(
    /^(.+?)\s+(\d+)(?::(\d+)(?:\s*[-â€“]\s*(\d+))?)?$/,
  )

  if (!match) return null

  return buildParsedPassage(
    match[1],
    match[2],
    match[3],
    match[4],
  )
}

export function findBiblePassage(
  value: string,
): ParsedBiblePassage | null {
  const candidates = bibleBooks
    .flatMap((book) => getBookNames(book))
    .map((name) => name.replace(/\s+/g, '\\s+'))
    .sort((a, b) => b.length - a.length)
    .join('|')

  const pattern = new RegExp(
    `(?:^|[^A-Za-z0-9])(${candidates})\\.?\\s+(\\d+)(?::(\\d+)(?:\\s*[-â€“]\\s*(\\d+))?)?`,
    'i',
  )

  const match = value.match(pattern)

  if (!match) return null

  return buildParsedPassage(
    match[1],
    match[2],
    match[3],
    match[4],
  )
}

export function formatParsedBiblePassage(
  passage: ParsedBiblePassage,
) {
  const {
    book,
    chapter,
    verseStart,
    verseEnd,
  } = passage

  if (verseStart === undefined) {
    return `${book.name} ${chapter}`
  }

  return `${book.name} ${chapter}:${verseStart}${
    verseEnd !== undefined
      ? `-${verseEnd}`
      : ''
  }`
}

