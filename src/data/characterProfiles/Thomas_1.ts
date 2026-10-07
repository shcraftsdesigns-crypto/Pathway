import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Thomas_1',
    name: 'Thomas',
    slug: 'thomas',
    alternateNames: [],
    testament: 'New Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'disciple of the Messiah (MAT 10:3) one of the Twelve (MAT 10:2)',
    biography: 'disciple of the Messiah (MAT 10:3) one of the Twelve (MAT 10:2)',
    keyScriptures: [
      { book: 'Matthew', chapter: 10, verseStart: 3 },
      { book: 'Mark', chapter: 3, verseStart: 18 },
      { book: 'Luke', chapter: 6, verseStart: 15 },
      { book: 'John', chapter: 11, verseStart: 16 },
      { book: 'John', chapter: 14, verseStart: 5 },
      { book: 'John', chapter: 20, verseStart: 24 },
      { book: 'John', chapter: 20, verseStart: 26 },
      { book: 'John', chapter: 20, verseStart: 27 },
      { book: 'John', chapter: 20, verseStart: 28 },
      { book: 'John', chapter: 21, verseStart: 2 },
      { book: 'Acts', chapter: 1, verseStart: 13 },
    ],
  }

export default character
