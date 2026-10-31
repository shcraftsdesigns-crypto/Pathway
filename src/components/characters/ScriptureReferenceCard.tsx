import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

import { findBiblePassage } from '@/lib/bibleReference'
import { formatReference } from '@/lib/scripture'
import type { ScriptureReference } from '@/types'

interface Props {
  reference: ScriptureReference
  compact?: boolean
}
function getBibleBookId(
  bookReference: string,
  chapter: number,
) {
  return findBiblePassage(
    `${bookReference} ${chapter}`,
  )?.book.id
}

function getBibleLink(reference: ScriptureReference) {
  const bookId = getBibleBookId(
    reference.book,
    reference.chapter,
  )

  if (!bookId) {
    return null
  }

  const base = `/bible/${bookId}/${reference.chapter}`

  if (reference.verseStart == null || reference.verseStart === 0) {
    return base
  }

  return `${base}?verse=${reference.verseStart}#verse-${reference.verseStart}`
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
