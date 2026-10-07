import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Adam_1',
    name: 'Adam',
    slug: 'adam',
    alternateNames: [],
    testament: 'Old Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'first man (1CO 15:45)',
    biography: 'first man (1CO 15:45)',
    keyScriptures: [
      { book: 'Genesis', chapter: 2, verseStart: 20 },
      { book: 'Genesis', chapter: 3, verseStart: 17 },
      { book: 'Genesis', chapter: 3, verseStart: 21 },
      { book: 'Genesis', chapter: 4, verseStart: 25 },
      { book: 'Genesis', chapter: 5, verseStart: 1 },
      { book: 'Genesis', chapter: 5, verseStart: 3 },
      { book: 'Genesis', chapter: 5, verseStart: 4 },
      { book: 'Genesis', chapter: 5, verseStart: 5 },
      { book: '1 Chronicles', chapter: 1, verseStart: 1 },
      { book: 'Job', chapter: 31, verseStart: 33 },
      { book: 'Hosea', chapter: 6, verseStart: 7 },
      { book: 'Luke', chapter: 3, verseStart: 38 },
      { book: 'Romans', chapter: 5, verseStart: 14 },
      { book: '1 Corinthians', chapter: 15, verseStart: 22 },
      { book: '1 Corinthians', chapter: 15, verseStart: 45 },
      { book: '1 Timothy', chapter: 2, verseStart: 13 },
      { book: '1 Timothy', chapter: 2, verseStart: 14 },
      { book: 'Jude', chapter: 1, verseStart: 14 },
    ],
  }

export default character
