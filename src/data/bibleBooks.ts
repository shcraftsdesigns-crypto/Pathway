export type BibleTestament = 'Old Testament' | 'New Testament'

export interface BibleBook {
  id: string
  name: string
  abbreviation: string
  testament: BibleTestament
  chapters: number
}

export const bibleBooks: BibleBook[] = [
  { id: 'GEN', name: 'Genesis', abbreviation: 'Gen', testament: 'Old Testament', chapters: 50 },
  { id: 'EXO', name: 'Exodus', abbreviation: 'Exod', testament: 'Old Testament', chapters: 40 },
  { id: 'LEV', name: 'Leviticus', abbreviation: 'Lev', testament: 'Old Testament', chapters: 27 },
  { id: 'NUM', name: 'Numbers', abbreviation: 'Num', testament: 'Old Testament', chapters: 36 },
  { id: 'DEU', name: 'Deuteronomy', abbreviation: 'Deut', testament: 'Old Testament', chapters: 34 },
  { id: 'JOS', name: 'Joshua', abbreviation: 'Josh', testament: 'Old Testament', chapters: 24 },
  { id: 'JDG', name: 'Judges', abbreviation: 'Judg', testament: 'Old Testament', chapters: 21 },
  { id: 'RUT', name: 'Ruth', abbreviation: 'Ruth', testament: 'Old Testament', chapters: 4 },
  { id: '1SA', name: '1 Samuel', abbreviation: '1 Sam', testament: 'Old Testament', chapters: 31 },
  { id: '2SA', name: '2 Samuel', abbreviation: '2 Sam', testament: 'Old Testament', chapters: 24 },
  { id: '1KI', name: '1 Kings', abbreviation: '1 Kgs', testament: 'Old Testament', chapters: 22 },
  { id: '2KI', name: '2 Kings', abbreviation: '2 Kgs', testament: 'Old Testament', chapters: 25 },
  { id: '1CH', name: '1 Chronicles', abbreviation: '1 Chr', testament: 'Old Testament', chapters: 29 },
  { id: '2CH', name: '2 Chronicles', abbreviation: '2 Chr', testament: 'Old Testament', chapters: 36 },
  { id: 'EZR', name: 'Ezra', abbreviation: 'Ezra', testament: 'Old Testament', chapters: 10 },
  { id: 'NEH', name: 'Nehemiah', abbreviation: 'Neh', testament: 'Old Testament', chapters: 13 },
  { id: 'EST', name: 'Esther', abbreviation: 'Esth', testament: 'Old Testament', chapters: 10 },
  { id: 'JOB', name: 'Job', abbreviation: 'Job', testament: 'Old Testament', chapters: 42 },
  { id: 'PSA', name: 'Psalms', abbreviation: 'Ps', testament: 'Old Testament', chapters: 150 },
  { id: 'PRO', name: 'Proverbs', abbreviation: 'Prov', testament: 'Old Testament', chapters: 31 },
  { id: 'ECC', name: 'Ecclesiastes', abbreviation: 'Eccl', testament: 'Old Testament', chapters: 12 },
  { id: 'SNG', name: 'Song of Solomon', abbreviation: 'Song', testament: 'Old Testament', chapters: 8 },
  { id: 'ISA', name: 'Isaiah', abbreviation: 'Isa', testament: 'Old Testament', chapters: 66 },
  { id: 'JER', name: 'Jeremiah', abbreviation: 'Jer', testament: 'Old Testament', chapters: 52 },
  { id: 'LAM', name: 'Lamentations', abbreviation: 'Lam', testament: 'Old Testament', chapters: 5 },
  { id: 'EZK', name: 'Ezekiel', abbreviation: 'Ezek', testament: 'Old Testament', chapters: 48 },
  { id: 'DAN', name: 'Daniel', abbreviation: 'Dan', testament: 'Old Testament', chapters: 12 },
  { id: 'HOS', name: 'Hosea', abbreviation: 'Hos', testament: 'Old Testament', chapters: 14 },
  { id: 'JOL', name: 'Joel', abbreviation: 'Joel', testament: 'Old Testament', chapters: 3 },
  { id: 'AMO', name: 'Amos', abbreviation: 'Amos', testament: 'Old Testament', chapters: 9 },
  { id: 'OBA', name: 'Obadiah', abbreviation: 'Obad', testament: 'Old Testament', chapters: 1 },
  { id: 'JON', name: 'Jonah', abbreviation: 'Jonah', testament: 'Old Testament', chapters: 4 },
  { id: 'MIC', name: 'Micah', abbreviation: 'Mic', testament: 'Old Testament', chapters: 7 },
  { id: 'NAM', name: 'Nahum', abbreviation: 'Nah', testament: 'Old Testament', chapters: 3 },
  { id: 'HAB', name: 'Habakkuk', abbreviation: 'Hab', testament: 'Old Testament', chapters: 3 },
  { id: 'ZEP', name: 'Zephaniah', abbreviation: 'Zeph', testament: 'Old Testament', chapters: 3 },
  { id: 'HAG', name: 'Haggai', abbreviation: 'Hag', testament: 'Old Testament', chapters: 2 },
  { id: 'ZEC', name: 'Zechariah', abbreviation: 'Zech', testament: 'Old Testament', chapters: 14 },
  { id: 'MAL', name: 'Malachi', abbreviation: 'Mal', testament: 'Old Testament', chapters: 4 },

  { id: 'MAT', name: 'Matthew', abbreviation: 'Matt', testament: 'New Testament', chapters: 28 },
  { id: 'MRK', name: 'Mark', abbreviation: 'Mark', testament: 'New Testament', chapters: 16 },
  { id: 'LUK', name: 'Luke', abbreviation: 'Luke', testament: 'New Testament', chapters: 24 },
  { id: 'JHN', name: 'John', abbreviation: 'John', testament: 'New Testament', chapters: 21 },
  { id: 'ACT', name: 'Acts', abbreviation: 'Acts', testament: 'New Testament', chapters: 28 },
  { id: 'ROM', name: 'Romans', abbreviation: 'Rom', testament: 'New Testament', chapters: 16 },
  { id: '1CO', name: '1 Corinthians', abbreviation: '1 Cor', testament: 'New Testament', chapters: 16 },
  { id: '2CO', name: '2 Corinthians', abbreviation: '2 Cor', testament: 'New Testament', chapters: 13 },
  { id: 'GAL', name: 'Galatians', abbreviation: 'Gal', testament: 'New Testament', chapters: 6 },
  { id: 'EPH', name: 'Ephesians', abbreviation: 'Eph', testament: 'New Testament', chapters: 6 },
  { id: 'PHP', name: 'Philippians', abbreviation: 'Phil', testament: 'New Testament', chapters: 4 },
  { id: 'COL', name: 'Colossians', abbreviation: 'Col', testament: 'New Testament', chapters: 4 },
  { id: '1TH', name: '1 Thessalonians', abbreviation: '1 Thess', testament: 'New Testament', chapters: 5 },
  { id: '2TH', name: '2 Thessalonians', abbreviation: '2 Thess', testament: 'New Testament', chapters: 3 },
  { id: '1TI', name: '1 Timothy', abbreviation: '1 Tim', testament: 'New Testament', chapters: 6 },
  { id: '2TI', name: '2 Timothy', abbreviation: '2 Tim', testament: 'New Testament', chapters: 4 },
  { id: 'TIT', name: 'Titus', abbreviation: 'Titus', testament: 'New Testament', chapters: 3 },
  { id: 'PHM', name: 'Philemon', abbreviation: 'Phlm', testament: 'New Testament', chapters: 1 },
  { id: 'HEB', name: 'Hebrews', abbreviation: 'Heb', testament: 'New Testament', chapters: 13 },
  { id: 'JAS', name: 'James', abbreviation: 'Jas', testament: 'New Testament', chapters: 5 },
  { id: '1PE', name: '1 Peter', abbreviation: '1 Pet', testament: 'New Testament', chapters: 5 },
  { id: '2PE', name: '2 Peter', abbreviation: '2 Pet', testament: 'New Testament', chapters: 3 },
  { id: '1JN', name: '1 John', abbreviation: '1 John', testament: 'New Testament', chapters: 5 },
  { id: '2JN', name: '2 John', abbreviation: '2 John', testament: 'New Testament', chapters: 1 },
  { id: '3JN', name: '3 John', abbreviation: '3 John', testament: 'New Testament', chapters: 1 },
  { id: 'JUD', name: 'Jude', abbreviation: 'Jude', testament: 'New Testament', chapters: 1 },
  { id: 'REV', name: 'Revelation', abbreviation: 'Rev', testament: 'New Testament', chapters: 22 },
]

export function getBibleBook(id: string): BibleBook | undefined {
  return bibleBooks.find((book) => book.id === id.toUpperCase())
}
