import type {
  BibleChapterContent,
  BibleProvider,
  BibleTranslation,
} from '@/lib/bibleProvider'

const BSB: BibleTranslation = {
  id: 'bsb',
  name: 'Berean Standard Bible',
  abbreviation: 'BSB',
  language: 'English',
  description:
    'Modern English Bible translation dedicated to the public domain.',
  copyright:
    'Berean Standard Bible (BSB). Dedicated to the public domain.',
}

export const localBibleProvider: BibleProvider = {
  async getTranslations(): Promise<BibleTranslation[]> {
    return [BSB]
  },

  async getChapter({
    translationId,
    bookId,
    chapter,
  }): Promise<BibleChapterContent> {
    if (translationId !== 'bsb') {
      throw new Error(
        'This Bible translation is not available.',
      )
    }

    const baseUrl = import.meta.env.BASE_URL

    const response = await fetch(
      `${baseUrl}bibles/bsb/${encodeURIComponent(
        bookId,
      )}/${chapter}.json`,
    )

    if (!response.ok) {
      throw new Error(
        'Unable to load this Bible chapter.',
      )
    }

    return response.json() as Promise<BibleChapterContent>
  },
}
