import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

import SectionHeader from '@/components/ui/SectionHeader'
import { bibleBooks } from '@/data/bibleBooks'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function Bible() {
  usePageTitle('Bible')

  const oldTestament = bibleBooks.filter(
    (book) => book.testament === 'Old Testament',
  )

  const newTestament = bibleBooks.filter(
    (book) => book.testament === 'New Testament',
  )

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Bible"
        subtitle="Read Scripture inside Pathway while studying biblical characters."
      />

      <section className="card space-y-4">
        <div className="flex items-start gap-3">
          <BookOpen
            className="mt-1 shrink-0 text-acc"
            size={24}
            aria-hidden="true"
          />

          <div className="space-y-1">
            <h2 className="text-xl font-semibold">
              Bible translation
            </h2>

            <p className="text-sm text-mute">
              Translation support is being connected next.
              Pathway will only display Bible translations
              that it is permitted to provide.
            </p>
          </div>
        </div>

        <label className="block max-w-sm">
          <span className="mb-2 block text-sm font-medium">
            Translation
          </span>

          <select
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm"
            disabled
            aria-label="Bible translation"
          >
            <option>Translation coming next</option>
          </select>
        </label>
      </section>

      <TestamentSection
        title="Old Testament"
        books={oldTestament}
      />

      <TestamentSection
        title="New Testament"
        books={newTestament}
      />
    </div>
  )
}

function TestamentSection({
  title,
  books,
}: {
  title: string
  books: typeof bibleBooks
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">
          {title}
        </h2>

        <p className="mt-1 text-sm text-mute">
          {books.length} books
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <Link
            key={book.id}
            to={`/bible/${book.id}`}
            className="card flex items-center justify-between gap-4 hover:border-acc"
          >
            <div>
              <h3 className="font-semibold">
                {book.name}
              </h3>

              <p className="text-sm text-mute">
                {book.chapters}{' '}
                {book.chapters === 1 ? 'chapter' : 'chapters'}
              </p>
            </div>

            <span className="tag">
              {book.abbreviation}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
