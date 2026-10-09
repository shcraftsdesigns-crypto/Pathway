export interface BibleTranslation {
  id: string
  name: string
  abbreviation: string
  language: string
  description?: string
  copyright?: string
}

export interface BibleVerse {
  id: string
  number: string
  text: string
}

export interface BibleChapterContent {
  translation: BibleTranslation
  bookId: string
  bookName: string
  chapter: number
  reference: string
  verses: BibleVerse[]
  copyright?: string
}

export interface BiblePassageRequest {
  translationId: string
  bookId: string
  chapter: number
}

export interface BibleProvider {
  getTranslations(): Promise<BibleTranslation[]>

  getChapter(
    request: BiblePassageRequest,
  ): Promise<BibleChapterContent>
}
