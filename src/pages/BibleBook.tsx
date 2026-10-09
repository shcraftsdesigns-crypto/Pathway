import { ArrowLeft, BookOpen } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { getBibleBook } from '@/data/bibleBooks'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function BibleBook() {
  const { bookId } = useParams()
  const book = bookId ? getBibleBook(bookId) : undefined

  usePageTitle(book ? `${book.name} — Bible` : 'Bible')

  if (!book) {
    return <Navigate to="/bible" replace />
  }

  const chapters = Array.from(
    { length: book.chapters },
    (_, index) => index + 1,
  )

  return (
    <div className="space-y-8">
      <Link
        to="/bible"
        className="inline-flex items-center gap-2 text-sm font-medium text-acc"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        All Bible books
      </Link>

      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <BookOpen
            size={28}
            className="text-acc"
            aria-hidden="true"
          />

          <div>
            <p className="text-sm text-mute">
              {book.testament}
            </p>

            <h1 className="text-3xl font-semibold">
              {book.name}
            </h1>
          </div>
        </div>

        <p className="text-mute">
          Choose a chapter to read.
        </p>
      </header>

      <section aria-labelledby="chapters-heading">
        <h2
          id="chapters-heading"
          className="mb-4 text-xl font-semibold"
        >
          Chapters
        </h2>

        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
          {chapters.map((chapter) => (
            <Link
              key={chapter}
              to={`/bible/${book.id}/${chapter}`}
              className="card flex min-h-14 items-center justify-center font-semibold hover:border-acc hover:text-acc"
              aria-label={`${book.name} chapter ${chapter}`}
            >
              {chapter}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
