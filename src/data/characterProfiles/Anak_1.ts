import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Anak_1',
    name: 'Anak',
    slug: 'anak',
    alternateNames: [],
    testament: 'Old Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'ancestor of the Anakim (NUM 13:22)',
    biography: 'ancestor of the Anakim (NUM 13:22)',
    keyScriptures: [
      { book: 'Numbers', chapter: 13, verseStart: 22 },
      { book: 'Numbers', chapter: 13, verseStart: 28 },
      { book: 'Numbers', chapter: 13, verseStart: 33 },
      { book: 'Deuteronomy', chapter: 9, verseStart: 2 },
      { book: 'Joshua', chapter: 15, verseStart: 13 },
      { book: 'Joshua', chapter: 15, verseStart: 14 },
      { book: 'Joshua', chapter: 21, verseStart: 11 },
      { book: 'Judges', chapter: 1, verseStart: 20 },
    ],
  }

export default character
