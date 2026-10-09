import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Link, Navigate, useLocation, useParams, useSearchParams } from 'react-router-dom'

import { bibleBooks, getBibleBook } from '@/data/bibleBooks'
import { usePageTitle } from '@/hooks/usePageTitle'
import type {
  BibleChapterContent,
  BibleTranslation,
} from '@/lib/bibleProvider'
import {
  getPreferredBibleTranslation,
  setPreferredBibleTranslation,
} from '@/lib/biblePreferences'
import {
  getBibleChapter,
  getBibleTranslations,
} from '@/lib/bibleService'

export default function BibleChapter() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const requestedVerse = searchParams.get('verse')
  const { bookId, chapter: chapterParam } = useParams()
  const book = bookId ? getBibleBook(bookId) : undefined
  const chapter = Number(chapterParam)

  const validChapter =
    Number.isInteger(chapter) &&
    chapter >= 1 &&
    book !== undefined &&
    chapter <= book.chapters

  const [translations, setTranslations] = useState<
    BibleTranslation[]
  >([])
  const [translationId, setTranslationId] = useState('')
  const [content, setContent] =
    useState<BibleChapterContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  usePageTitle(
    book && validChapter
      ? `${book.name} ${chapter} — Bible`
      : 'Bible',
  )

  const bookIndex = useMemo(
    () =>
      book
        ? bibleBooks.findIndex(
            (item) => item.id === book.id,
          )
        : -1,
    [book],
  )

  const loadTranslations = useCallback(async () => {
    try {
      const available = await getBibleTranslations()
      setTranslations(available)

      if (available.length === 0) {
        throw new Error(
          'No Bible translations are currently available.',
        )
      }

      const preferred = getPreferredBibleTranslation()

      const selected =
        available.find(
          (translation) => translation.id === preferred,
        ) ?? available[0]

      setTranslationId(selected.id)
      setPreferredBibleTranslation(selected.id)
      setError(null)
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load Bible translations.',
      )
      setLoading(false)
    }
  }, [])

  const loadChapter = useCallback(async () => {
    if (!book || !validChapter || !translationId) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const chapterContent = await getBibleChapter(
        translationId,
        book.id,
        chapter,
      )

      setContent(chapterContent)
    } catch (loadError) {
      setContent(null)
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load this Bible chapter.',
      )
    } finally {
      setLoading(false)
    }
  }, [book, chapter, translationId, validChapter])

  useEffect(() => {
    void loadTranslations()
  }, [loadTranslations])

  useEffect(() => {
    if (translationId) {
      void loadChapter()
    }
  }, [loadChapter, translationId])

  if (!book) {
    return <Navigate to="/bible" replace />
  }

  if (!validChapter) {
    return <Navigate to={`/bible/${book.id}`} replace />
  }

  const previousBook =
    bookIndex > 0 ? bibleBooks[bookIndex - 1] : undefined

  const nextBook =
    bookIndex < bibleBooks.length - 1
      ? bibleBooks[bookIndex + 1]
      : undefined

  const previous =
    chapter > 1
      ? { book, chapter: chapter - 1 }
      : previousBook
        ? {
            book: previousBook,
            chapter: previousBook.chapters,
          }
        : null

  const next =
    chapter < book.chapters
      ? { book, chapter: chapter + 1 }
      : nextBook
        ? { book: nextBook, chapter: 1 }
        : null

  function handleTranslationChange(
    nextTranslationId: string,
  ) {
    setTranslationId(nextTranslationId)
    setPreferredBibleTranslation(nextTranslationId)
    setContent(null)
  }


  useEffect(() => {
    if (!content || !location.hash) return

    const verseId = decodeURIComponent(
      location.hash.replace(/^#/, ''),
    )

    const frame = window.requestAnimationFrame(() => {
      const element = document.getElementById(verseId)

      if (!element) {
        console.warn(`Bible verse target not found: ${verseId}`)
        return
      }

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [content, location.hash])

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link
        to={`/bible/${book.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-acc"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        {book.name} chapters
      </Link>

      <header className="space-y-4">
        <div>
          <p className="text-sm text-mute">
            {book.testament}
          </p>

          <h1 className="text-3xl font-semibold">
            {book.name} {chapter}
          </h1>
        </div>

        {translations.length > 0 && (
          <label className="block max-w-xs space-y-2">
            <span className="text-sm font-medium">
              Translation
            </span>

            <select
              value={translationId}
              onChange={(event) =>
                handleTranslationChange(event.target.value)
              }
              className="w-full rounded-xl border border-line bg-card px-3 py-2"
            >
              {translations.map((translation) => (
                <option
                  key={translation.id}
                  value={translation.id}
                >
                  {translation.abbreviation} —{' '}
                  {translation.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </header>

      <section
        aria-label={`${book.name} chapter ${chapter}`}
        className="card"
      >
        {loading && (
          <p role="status" className="text-mute">
            Loading Scripture…
          </p>
        )}

        {!loading && error && (
          <div className="space-y-4">
            <p role="alert" className="text-mute">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                if (translationId) {
                  void loadChapter()
                } else {
                  setLoading(true)
                  void loadTranslations()
                }
              }}
              className="inline-flex items-center gap-2 font-medium text-acc"
            >
              <RefreshCw size={17} aria-hidden="true" />
              Try again
            </button>
          </div>
        )}

        {!loading && !error && content && (
          <div className="space-y-6">
            <div className="space-y-4 text-lg leading-8">
              {requestedVerse &&
              !content.verses.some(
                (verse) => String(verse.number) === requestedVerse,
              ) && (
                <div
                  role="note"
                  className="mb-6 rounded-xl border border-border bg-muted/50 p-4 text-sm"
                >
                  <p className="font-semibold">
                    Verse {requestedVerse} is not numbered in the{' '}
                    {content.translation.abbreviation}.
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    This character reference uses a traditional verse number
                    that is not present in this translation. The chapter is
                    shown below so you can continue reading in context.
                  </p>
                </div>
              )}

              {content.verses.map((verse) => (
                <p
                  key={verse.id}
                  id={`verse-${verse.number}`}
                  className={
                    location.hash === `#verse-${verse.number}`
                      ? 'scroll-mt-24 rounded-lg bg-accbg px-3 py-2 ring-1 ring-acc'
                      : 'scroll-mt-24'
                  }
                >
                  <sup className="mr-2 text-xs font-semibold text-acc">
                    {verse.number}
                  </sup>

                  {verse.text}
                </p>
              ))}
            </div>

            {(content.copyright ||
              content.translation.copyright) && (
              <p className="border-t border-line pt-4 text-xs text-mute">
                {content.copyright ??
                  content.translation.copyright}
              </p>
            )}
          </div>
        )}
      </section>

      <nav
        aria-label="Chapter navigation"
        className="flex items-center justify-between gap-4"
      >
        {previous ? (
          <Link
            to={`/bible/${previous.book.id}/${previous.chapter}`}
            className="inline-flex items-center gap-2 font-medium text-acc"
          >
            <ChevronLeft size={18} aria-hidden="true" />
            <span>
              {previous.book.id === book.id
                ? `Chapter ${previous.chapter}`
                : `${previous.book.name} ${previous.chapter}`}
            </span>
          </Link>
        ) : (
          <span />
        )}

        {next ? (
          <Link
            to={`/bible/${next.book.id}/${next.chapter}`}
            className="inline-flex items-center gap-2 text-right font-medium text-acc"
          >
            <span>
              {next.book.id === book.id
                ? `Chapter ${next.chapter}`
                : `${next.book.name} ${next.chapter}`}
            </span>
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  )
}
