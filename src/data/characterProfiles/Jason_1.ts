import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Jason_1',
    name: 'Jason',
    slug: 'jason',
    alternateNames: [],
    testament: 'New Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'owner of the house where Paul and Silas were staying in Thessalonica (ACT 17:5)',
    biography: 'owner of the house where Paul and Silas were staying in Thessalonica (ACT 17:5)',
    keyScriptures: [
      { book: 'Acts', chapter: 17, verseStart: 5 },
      { book: 'Acts', chapter: 17, verseStart: 6 },
      { book: 'Acts', chapter: 17, verseStart: 7 },
      { book: 'Acts', chapter: 17, verseStart: 9 },
      { book: 'Romans', chapter: 16, verseStart: 21 },
    ],
  }

export default character
