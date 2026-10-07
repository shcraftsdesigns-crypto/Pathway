import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Thaddaeus_1',
    name: 'Thaddaeus',
    slug: 'thaddaeus',
    alternateNames: [],
    testament: 'New Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'disciple of the Messiah (MAT 10:3) one of the Twelve (MAT 10:2)',
    biography: 'disciple of the Messiah (MAT 10:3) one of the Twelve (MAT 10:2)',
    keyScriptures: [
      { book: 'Matthew', chapter: 10, verseStart: 3 },
      { book: 'Mark', chapter: 3, verseStart: 18 },
      { book: 'Luke', chapter: 6, verseStart: 16 },
      { book: 'John', chapter: 14, verseStart: 22 },
      { book: 'Acts', chapter: 1, verseStart: 13 },
    ],
  }

export default character
