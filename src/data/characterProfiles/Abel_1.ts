import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Abel_1',
    name: 'Abel',
    slug: 'abel',
    alternateNames: [],
    testament: 'Old Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'son of Adam(GEN 4:2), first person murdered (GEN 4:8)',
    biography: 'son of Adam(GEN 4:2), first person murdered (GEN 4:8)',
    keyScriptures: [
      { book: 'Genesis', chapter: 4, verseStart: 2 },
      { book: 'Genesis', chapter: 4, verseStart: 4 },
      { book: 'Genesis', chapter: 4, verseStart: 8 },
      { book: 'Genesis', chapter: 4, verseStart: 9 },
      { book: 'Genesis', chapter: 4, verseStart: 25 },
      { book: 'Matthew', chapter: 23, verseStart: 35 },
      { book: 'Luke', chapter: 11, verseStart: 51 },
      { book: 'Hebrews', chapter: 11, verseStart: 4 },
      { book: 'Hebrews', chapter: 12, verseStart: 24 },
    ],
  }

export default character
