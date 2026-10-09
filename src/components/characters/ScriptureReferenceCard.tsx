import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

import { bibleBooks } from '@/data/bibleBooks'
import { formatReference } from '@/lib/scripture'
import type { ScriptureReference } from '@/types'

interface Props {
  reference: ScriptureReference
  compact?: boolean
}

function getBibleBookId(bookReference: string) {
  const normalized = bookReference.trim().toLowerCase()

  const book = bibleBooks.find(
    (item) =>
      item.id.toLowerCase() === normalized ||
      item.name.toLowerCase() === normalized ||
      item.abbreviation.toLowerCase() === normalized,
  )

  return book?.id
}

function getBibleLink(reference: ScriptureReference) {
  const bookId = getBibleBookId(reference.book)

  if (!bookId) {
    return null
  }

  const base = `/bible/${bookId}/${reference.chapter}`

  return reference.verseStart == null
    ? base
    : `${base}#verse-${reference.verseStart}`
}

export default function ScriptureReferenceCard({
  reference,
  compact,
}: Props) {
  const label = formatReference(reference)
  const bibleLink = getBibleLink(reference)

  if (!bibleLink) {
    return compact ? (
      <span className="tag">{label}</span>
    ) : (
      <div className="card">
        <span className="text-sm text-mute">Scripture</span>
        <p className="font-semibold">{label}</p>
      </div>
    )
  }

  if (compact) {
    return (
      <Link
        to={bibleLink}
        className="tag transition hover:opacity-80"
        title={`Read ${label} in the Bible`}
      >
        {label}
      </Link>
    )
  }

  return (
    <Link
      to={bibleLink}
      className="card block transition hover:-translate-y-0.5 hover:shadow-md"
      title={`Read ${label} in the Bible`}
    >
      <span className="flex items-center gap-2 text-sm text-mute">
        <BookOpen className="h-4 w-4" aria-hidden="true" />
        Scripture
      </span>

      <p className="mt-1 font-semibold">{label}</p>

      <span className="mt-2 inline-block text-sm text-mute">
        Read in Bible →
      </span>
    </Link>
  )
}
