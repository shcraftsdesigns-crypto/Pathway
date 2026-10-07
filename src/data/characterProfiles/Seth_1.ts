import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Seth_1',
    name: 'Seth',
    slug: 'seth',
    alternateNames: [],
    testament: 'Old Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'son of Adam (GEN 4:25)',
    biography: 'son of Adam (GEN 4:25)',
    keyScriptures: [
      { book: 'Genesis', chapter: 4, verseStart: 25 },
      { book: 'Genesis', chapter: 4, verseStart: 26 },
      { book: 'Genesis', chapter: 5, verseStart: 3 },
      { book: 'Genesis', chapter: 5, verseStart: 4 },
      { book: 'Genesis', chapter: 5, verseStart: 6 },
      { book: 'Genesis', chapter: 5, verseStart: 7 },
      { book: 'Genesis', chapter: 5, verseStart: 8 },
      { book: '1 Chronicles', chapter: 1, verseStart: 1 },
      { book: 'Luke', chapter: 3, verseStart: 38 },
    ],
  }

export default character
