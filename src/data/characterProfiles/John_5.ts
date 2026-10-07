import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'John_5',
    name: 'John',
    slug: 'john-5',
    alternateNames: [],
    testament: 'New Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'also called Mark (ACT 12:12) a companion of Barnabas and Saul (ACT 12:25) likely author of the book of Mark',
    biography: 'also called Mark (ACT 12:12) a companion of Barnabas and Saul (ACT 12:25) likely author of the book of Mark',
    keyScriptures: [
      { book: 'Acts', chapter: 12, verseStart: 12 },
      { book: 'Acts', chapter: 12, verseStart: 25 },
      { book: 'Acts', chapter: 13, verseStart: 5 },
      { book: 'Acts', chapter: 13, verseStart: 13 },
      { book: 'Acts', chapter: 15, verseStart: 37 },
      { book: 'Acts', chapter: 15, verseStart: 39 },
      { book: 'Colossians', chapter: 4, verseStart: 10 },
      { book: '2 Timothy', chapter: 4, verseStart: 11 },
      { book: 'Philemon', chapter: 1, verseStart: 24 },
      { book: '1 Peter', chapter: 5, verseStart: 13 },
    ],
  }

export default character
