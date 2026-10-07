import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Alphaeus_1',
    name: 'Alphaeus',
    slug: 'alphaeus',
    alternateNames: [],
    testament: 'New Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'father of James the disciple (MAT 10:3)',
    biography: 'father of James the disciple (MAT 10:3)',
    keyScriptures: [
      { book: 'Matthew', chapter: 10, verseStart: 3 },
      { book: 'Mark', chapter: 2, verseStart: 14 },
      { book: 'Mark', chapter: 3, verseStart: 18 },
      { book: 'Luke', chapter: 6, verseStart: 15 },
      { book: 'Acts', chapter: 1, verseStart: 13 },
    ],
  }

export default character
