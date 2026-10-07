import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Eve_1',
    name: 'Eve',
    slug: 'eve',
    alternateNames: [],
    testament: 'Old Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'first woman, created from Adam (GEN 2:22)',
    biography: 'first woman, created from Adam (GEN 2:22)',
    keyScriptures: [
      { book: 'Genesis', chapter: 3, verseStart: 20 },
      { book: 'Genesis', chapter: 4, verseStart: 1 },
      { book: '2 Corinthians', chapter: 11, verseStart: 3 },
      { book: '1 Timothy', chapter: 2, verseStart: 13 },
    ],
  }

export default character
