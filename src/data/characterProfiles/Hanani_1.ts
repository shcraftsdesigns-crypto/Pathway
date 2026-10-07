import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Hanani_1',
    name: 'Hanani',
    slug: 'hanani-1',
    alternateNames: [],
    testament: 'Old Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'father of Jehu (1KI 16:1, 2CH 19:2)',
    biography: 'father of Jehu (1KI 16:1, 2CH 19:2)',
    keyScriptures: [
      { book: '1 Kings', chapter: 16, verseStart: 1 },
      { book: '1 Kings', chapter: 16, verseStart: 7 },
      { book: '2 Chronicles', chapter: 16, verseStart: 7 },
      { book: '2 Chronicles', chapter: 19, verseStart: 2 },
      { book: '2 Chronicles', chapter: 20, verseStart: 34 },
    ],
  }

export default character
