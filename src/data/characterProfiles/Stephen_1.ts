import type { BiblicalCharacter } from '@/types'

const character: BiblicalCharacter = {
    id: 'Stephen_1',
    name: 'Stephen',
    slug: 'stephen',
    alternateNames: [],
    testament: 'New Testament',
    categories: ['Other'],
    subtitle: 'Biblical character',
    shortDescription: 'chosen to serve the widows of the Hellenistic Jews (ACT 6:5)',
    biography: 'chosen to serve the widows of the Hellenistic Jews (ACT 6:5)',
    keyScriptures: [
      { book: 'Acts', chapter: 6, verseStart: 5 },
      { book: 'Acts', chapter: 6, verseStart: 8 },
      { book: 'Acts', chapter: 6, verseStart: 9 },
      { book: 'Acts', chapter: 7, verseStart: 59 },
      { book: 'Acts', chapter: 8, verseStart: 2 },
      { book: 'Acts', chapter: 11, verseStart: 19 },
      { book: 'Acts', chapter: 22, verseStart: 20 },
    ],
  }

export default character
