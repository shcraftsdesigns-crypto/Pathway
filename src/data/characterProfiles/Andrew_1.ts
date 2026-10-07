import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Andrew_1',
    name: 'Andrew',
    slug: 'andrew',
    alternateNames: [],
    testament: 'New Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'brother of Simon/Peter (MAT 4:18) a fisherman (MAT 4:18), one of the Twelve (MAT 10:2), from the city of Bethsaida (JHN 1:44)',
    biography: 'brother of Simon/Peter (MAT 4:18) a fisherman (MAT 4:18), one of the Twelve (MAT 10:2), from the city of Bethsaida (JHN 1:44)',
    keyScriptures: [
      { book: 'Matthew', chapter: 4, verseStart: 18 },
      { book: 'Matthew', chapter: 10, verseStart: 2 },
      { book: 'Mark', chapter: 1, verseStart: 16 },
      { book: 'Mark', chapter: 1, verseStart: 29 },
      { book: 'Mark', chapter: 3, verseStart: 18 },
      { book: 'Mark', chapter: 13, verseStart: 3 },
      { book: 'Luke', chapter: 6, verseStart: 14 },
      { book: 'John', chapter: 1, verseStart: 40 },
      { book: 'John', chapter: 1, verseStart: 44 },
      { book: 'John', chapter: 6, verseStart: 8 },
      { book: 'John', chapter: 12, verseStart: 22 },
      { book: 'Acts', chapter: 1, verseStart: 13 },
    ],
  }

export default character
