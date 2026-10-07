import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Barabbas_1',
    name: 'Barabbas',
    slug: 'barabbas',
    alternateNames: [],
    testament: 'New Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'notorious prisoner (MAT 27:16) set free instead of the Messiah',
    biography: 'notorious prisoner (MAT 27:16) set free instead of the Messiah',
    keyScriptures: [
      { book: 'Matthew', chapter: 27, verseStart: 16 },
      { book: 'Matthew', chapter: 27, verseStart: 17 },
      { book: 'Matthew', chapter: 27, verseStart: 20 },
      { book: 'Matthew', chapter: 27, verseStart: 21 },
      { book: 'Matthew', chapter: 27, verseStart: 26 },
      { book: 'Mark', chapter: 15, verseStart: 7 },
      { book: 'Mark', chapter: 15, verseStart: 11 },
      { book: 'Mark', chapter: 15, verseStart: 15 },
      { book: 'Luke', chapter: 23, verseStart: 18 },
      { book: 'John', chapter: 18, verseStart: 40 },
    ],
  }

export default character
