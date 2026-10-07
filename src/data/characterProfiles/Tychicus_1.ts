import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Tychicus_1',
    name: 'Tychicus',
    slug: 'tychicus',
    alternateNames: [],
    testament: 'New Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'a believer from Asia (ACT 20:4)',
    biography: 'a believer from Asia (ACT 20:4)',
    keyScriptures: [
      { book: 'Acts', chapter: 20, verseStart: 4 },
      { book: 'Ephesians', chapter: 6, verseStart: 21 },
      { book: 'Colossians', chapter: 4, verseStart: 7 },
      { book: '2 Timothy', chapter: 4, verseStart: 12 },
      { book: 'Titus', chapter: 3, verseStart: 12 },
    ],
  }

export default character
