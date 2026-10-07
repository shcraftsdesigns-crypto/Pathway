import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Felix_1',
    name: 'Felix',
    slug: 'felix',
    alternateNames: [],
    testament: 'New Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'the governor of Caesarea (ACT 23:24)',
    biography: 'the governor of Caesarea (ACT 23:24)',
    keyScriptures: [
      { book: 'Acts', chapter: 23, verseStart: 24 },
      { book: 'Acts', chapter: 23, verseStart: 26 },
      { book: 'Acts', chapter: 24, verseStart: 3 },
      { book: 'Acts', chapter: 24, verseStart: 22 },
      { book: 'Acts', chapter: 24, verseStart: 24 },
      { book: 'Acts', chapter: 24, verseStart: 25 },
      { book: 'Acts', chapter: 24, verseStart: 27 },
      { book: 'Acts', chapter: 25, verseStart: 14 },
    ],
  }

export default character
