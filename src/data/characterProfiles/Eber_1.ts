import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Eber_1',
    name: 'Eber',
    slug: 'eber-1',
    alternateNames: [],
    testament: 'Old Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'descendant of Shem (GEN 10:21), son of Shelah (GEN 10:24)',
    biography: 'descendant of Shem (GEN 10:21), son of Shelah (GEN 10:24)',
    keyScriptures: [
      { book: 'Genesis', chapter: 10, verseStart: 21 },
      { book: 'Genesis', chapter: 10, verseStart: 24 },
      { book: 'Genesis', chapter: 10, verseStart: 25 },
      { book: 'Genesis', chapter: 11, verseStart: 14 },
      { book: 'Genesis', chapter: 11, verseStart: 15 },
      { book: 'Genesis', chapter: 11, verseStart: 16 },
      { book: 'Genesis', chapter: 11, verseStart: 17 },
      { book: '1 Chronicles', chapter: 1, verseStart: 18 },
      { book: '1 Chronicles', chapter: 1, verseStart: 19 },
      { book: '1 Chronicles', chapter: 1, verseStart: 25 },
      { book: 'Luke', chapter: 3, verseStart: 35 },
    ],
  }

export default character
