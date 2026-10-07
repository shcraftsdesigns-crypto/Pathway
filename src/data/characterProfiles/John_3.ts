import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'John_3',
    name: 'John',
    slug: 'john-3',
    alternateNames: [],
    testament: 'New Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'the father of Peter and Andrew (JHN 1:42)',
    biography: 'the father of Peter and Andrew (JHN 1:42)',
    keyScriptures: [
      { book: 'John', chapter: 1, verseStart: 42 },
      { book: 'John', chapter: 21, verseStart: 15 },
      { book: 'John', chapter: 21, verseStart: 16 },
      { book: 'John', chapter: 21, verseStart: 17 },
    ],
  }

export default character
