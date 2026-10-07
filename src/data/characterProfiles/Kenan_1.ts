import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Kenan_1',
    name: 'Kenan',
    slug: 'kenan',
    alternateNames: [],
    testament: 'Old Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'son of Enosh (GEN 5:9)',
    biography: 'son of Enosh (GEN 5:9)',
    keyScriptures: [
      { book: 'Genesis', chapter: 5, verseStart: 9 },
      { book: 'Genesis', chapter: 5, verseStart: 10 },
      { book: 'Genesis', chapter: 5, verseStart: 12 },
      { book: 'Genesis', chapter: 5, verseStart: 13 },
      { book: 'Genesis', chapter: 5, verseStart: 14 },
      { book: '1 Chronicles', chapter: 1, verseStart: 2 },
      { book: 'Luke', chapter: 3, verseStart: 38 },
    ],
  }

export default character
