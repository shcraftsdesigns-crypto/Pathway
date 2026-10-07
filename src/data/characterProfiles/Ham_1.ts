import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Ham_1',
    name: 'Ham',
    slug: 'ham',
    alternateNames: [],
    testament: 'Old Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'son of Noah (GEN 5:32)',
    biography: 'son of Noah (GEN 5:32)',
    keyScriptures: [
      { book: 'Genesis', chapter: 5, verseStart: 32 },
      { book: 'Genesis', chapter: 6, verseStart: 10 },
      { book: 'Genesis', chapter: 7, verseStart: 13 },
      { book: 'Genesis', chapter: 9, verseStart: 18 },
      { book: 'Genesis', chapter: 9, verseStart: 22 },
      { book: 'Genesis', chapter: 10, verseStart: 1 },
      { book: 'Genesis', chapter: 10, verseStart: 6 },
      { book: 'Genesis', chapter: 10, verseStart: 20 },
      { book: '1 Chronicles', chapter: 1, verseStart: 4 },
      { book: '1 Chronicles', chapter: 1, verseStart: 8 },
      { book: 'Psalms', chapter: 78, verseStart: 51 },
    ],
  }

export default character
