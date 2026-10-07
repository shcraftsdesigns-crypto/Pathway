import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Haggith_1',
    name: 'Haggith',
    slug: 'haggith',
    alternateNames: [],
    testament: 'Old Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'wife (concubine?) of King David (2SA 3:4)',
    biography: 'wife (concubine?) of King David (2SA 3:4)',
    keyScriptures: [
      { book: '2 Samuel', chapter: 3, verseStart: 4 },
      { book: '1 Kings', chapter: 1, verseStart: 5 },
      { book: '1 Kings', chapter: 1, verseStart: 11 },
      { book: '1 Kings', chapter: 2, verseStart: 13 },
      { book: '1 Chronicles', chapter: 3, verseStart: 2 },
    ],
  }

export default character
