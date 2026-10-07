import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Javan_1',
    name: 'Javan',
    slug: 'javan',
    alternateNames: [],
    testament: 'Old Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'son of Japheth (GEN 10:2)',
    biography: 'son of Japheth (GEN 10:2)',
    keyScriptures: [
      { book: 'Genesis', chapter: 10, verseStart: 2 },
      { book: 'Genesis', chapter: 10, verseStart: 4 },
      { book: '1 Chronicles', chapter: 1, verseStart: 5 },
      { book: '1 Chronicles', chapter: 1, verseStart: 7 },
      { book: 'Ezekiel', chapter: 27, verseStart: 13 },
    ],
  }

export default character
