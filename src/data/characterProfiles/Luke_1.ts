import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Luke_1',
    name: 'Luke',
    slug: 'luke',
    alternateNames: [],
    testament: 'New Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'the beloved physician (COL 4:14) author of the Gospel according to Luke',
    biography: 'the beloved physician (COL 4:14) author of the Gospel according to Luke',
    keyScriptures: [
      { book: 'Colossians', chapter: 4, verseStart: 14 },
      { book: '2 Timothy', chapter: 4, verseStart: 11 },
      { book: 'Philemon', chapter: 1, verseStart: 24 },
    ],
  }

export default character
