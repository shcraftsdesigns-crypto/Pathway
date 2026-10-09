import type {
  BibleChapterContent,
  BibleProvider,
  BibleTranslation,
} from '@/lib/bibleProvider'

let provider: BibleProvider | null = null

export function setBibleProvider(
  nextProvider: BibleProvider,
): void {
  provider = nextProvider
}

function requireProvider(): BibleProvider {
  if (!provider) {
    throw new Error(
      'Bible provider has not been connected yet.',
    )
  }

  return provider
}

export async function getBibleTranslations(): Promise<
  BibleTranslation[]
> {
  return requireProvider().getTranslations()
}

export async function getBibleChapter(
  translationId: string,
  bookId: string,
  chapter: number,
): Promise<BibleChapterContent> {
  return requireProvider().getChapter({
    translationId,
    bookId,
    chapter,
  })
}
