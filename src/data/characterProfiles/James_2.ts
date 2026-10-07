import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'James_2',
    name: 'James',
    slug: 'james-2',
    alternateNames: [],
    testament: 'New Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'disciple of the Messiah (MAT 10:3) one of the Twelve (MAT 10:2)',
    biography: 'disciple of the Messiah (MAT 10:3) one of the Twelve (MAT 10:2)',
    keyScriptures: [
      { book: 'Matthew', chapter: 10, verseStart: 3 },
      { book: 'Mark', chapter: 2, verseStart: 14 },
      { book: 'Mark', chapter: 3, verseStart: 18 },
      { book: 'Luke', chapter: 5, verseStart: 27 },
      { book: 'Luke', chapter: 5, verseStart: 29 },
      { book: 'Luke', chapter: 6, verseStart: 15 },
      { book: 'Acts', chapter: 1, verseStart: 13 },
    ],
  }

export default character
