import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Simon_2',
    name: 'Simon',
    slug: 'simon-2',
    alternateNames: [],
    testament: 'New Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'disciple of the Messiah (MAT 10:4), the zealot one of the Twelve (MAT 10:2)',
    biography: 'disciple of the Messiah (MAT 10:4), the zealot one of the Twelve (MAT 10:2)',
    keyScriptures: [
      { book: 'Matthew', chapter: 10, verseStart: 4 },
      { book: 'Mark', chapter: 3, verseStart: 18 },
      { book: 'Luke', chapter: 6, verseStart: 15 },
      { book: 'Acts', chapter: 1, verseStart: 13 },
    ],
  }

export default character
