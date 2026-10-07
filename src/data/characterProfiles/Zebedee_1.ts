import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Zebedee_1',
    name: 'Zebedee',
    slug: 'zebedee',
    alternateNames: [],
    testament: 'New Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'father of James and John (MAT 4:21) fisherman (mending their nets- MAT 4:21)',
    biography: 'father of James and John (MAT 4:21) fisherman (mending their nets- MAT 4:21)',
    keyScriptures: [
      { book: 'Matthew', chapter: 4, verseStart: 21 },
      { book: 'Matthew', chapter: 10, verseStart: 2 },
      { book: 'Matthew', chapter: 20, verseStart: 20 },
      { book: 'Matthew', chapter: 26, verseStart: 37 },
      { book: 'Matthew', chapter: 27, verseStart: 56 },
      { book: 'Mark', chapter: 1, verseStart: 19 },
      { book: 'Mark', chapter: 1, verseStart: 20 },
      { book: 'Mark', chapter: 3, verseStart: 17 },
      { book: 'Mark', chapter: 10, verseStart: 35 },
      { book: 'Luke', chapter: 5, verseStart: 10 },
      { book: 'John', chapter: 21, verseStart: 2 },
    ],
  }

export default character
