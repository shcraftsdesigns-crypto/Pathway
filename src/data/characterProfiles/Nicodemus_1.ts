import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Nicodemus_1',
    name: 'Nicodemus',
    slug: 'nicodemus',
    alternateNames: [],
    testament: 'New Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'a Pharisee and ruler of the Jews (JHN 3:1)',
    biography: 'a Pharisee and ruler of the Jews (JHN 3:1)',
    keyScriptures: [
      { book: 'John', chapter: 3, verseStart: 1 },
      { book: 'John', chapter: 3, verseStart: 4 },
      { book: 'John', chapter: 3, verseStart: 9 },
      { book: 'John', chapter: 7, verseStart: 50 },
      { book: 'John', chapter: 19, verseStart: 39 },
    ],
  }

export default character
