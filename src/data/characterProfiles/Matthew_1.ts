import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Matthew_1',
    name: 'Matthew',
    slug: 'matthew',
    alternateNames: [],
    testament: 'New Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'the tax collector (MAT 9:9) one of the Twelve (MAT 10:2)',
    biography: 'the tax collector (MAT 9:9) one of the Twelve (MAT 10:2)',
    keyScriptures: [
      { book: 'Matthew', chapter: 9, verseStart: 9 },
      { book: 'Matthew', chapter: 10, verseStart: 3 },
      { book: 'Mark', chapter: 3, verseStart: 18 },
      { book: 'Luke', chapter: 6, verseStart: 15 },
      { book: 'Acts', chapter: 1, verseStart: 13 },
    ],
  }

export default character
