import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import SectionHeader from '@/components/ui/SectionHeader'
import { usePageTitle } from '@/hooks/usePageTitle'
import { parseBiblePassage } from '@/lib/bibleReference'

interface SharedStudyCitation {
  book: string
  chapter: number
  verseStart?: number
  verseEnd?: number
}

interface SharedStudySection {
  heading: string
  content: string
}

interface SharedStudyData {
  type: 'character' | 'passage' | 'topic'
  subject: string
  answer: string
  sections: SharedStudySection[]
  scriptureCitations: SharedStudyCitation[]
  limitations: string[]
}

interface SharedStudyResponse {
  id: string
  createdAt: string
  study: SharedStudyData
}

export default function SharedStudy() {
  const { id } = useParams<{ id: string }>()

  const [sharedStudy, setSharedStudy] =
    useState<SharedStudyResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [copyMessage, setCopyMessage] = useState<{
    message: string
    error: boolean
  } | null>(null)

  usePageTitle(
    sharedStudy
      ? `${sharedStudy.study.subject} — Shared Study`
      : 'Shared Study',
  )

  useEffect(() => {
    let cancelled = false

    const loadStudy = async () => {
      if (!id) {
        setError(true)
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `/api/shared-studies?id=${encodeURIComponent(id)}`,
        )

        if (!response.ok) {
          throw new Error('Shared study not found')
        }

        const result =
          (await response.json()) as SharedStudyResponse

        if (
          !result ||
          !result.study ||
          typeof result.study.subject !== 'string'
        ) {
          throw new Error('Invalid shared study')
        }

        if (!cancelled) {
          setSharedStudy(result)
        }
      } catch {
        if (!cancelled) {
          setError(true)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadStudy()

    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div
        role="status"
        className="py-16 text-center text-mute"
      >
        Loading shared study…
      </div>
    )
  }

  if (error || !sharedStudy) {
    return (
      <div className="py-12">
        <SectionHeader
          title="Shared study unavailable"
          subtitle="This study link may be invalid or no longer available."
        />

        <div className="mt-6">
          <Link
            to="/"
            className="font-semibold text-acc hover:underline"
          >
            Return to Pathway
          </Link>
        </div>
      </div>
    )
  }

  const { study } = sharedStudy

  return (
    <div className="py-8">
      <SectionHeader
        title={study.subject}
        subtitle="A study shared from Pathway."
      />

      <article className="card mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-acc">
          {study.type} study
        </p>

        {study.sections.length > 0 ? (
          <div className="mt-5 space-y-6">
            {study.sections.map((section, index) => (
              <section
                key={`${section.heading}-${index}`}
              >
                <h2 className="text-lg">
                  {section.heading}
                </h2>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-mute">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        ) : (
          <p className="mt-5 whitespace-pre-wrap leading-7 text-mute">
            {study.answer}
          </p>
        )}

        {study.scriptureCitations.length > 0 && (
          <div className="mt-7">
            <h2 className="text-base">
              Scripture references
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {study.scriptureCitations.map(
                (citation, index) => {
                  const verses = citation.verseStart
                    ? citation.verseEnd &&
                      citation.verseEnd !==
                        citation.verseStart
                      ? `:${citation.verseStart}–${citation.verseEnd}`
                      : `:${citation.verseStart}`
                    : ''

                  const referenceLabel =
                    `${citation.book} ${citation.chapter}${verses}`

                  const passage =
                    parseBiblePassage(referenceLabel)

                  if (!passage) {
                    return (
                      <span
                        key={`${citation.book}-${citation.chapter}-${citation.verseStart ?? 0}-${index}`}
                        className="rounded-full border border-line px-3 py-1.5 text-sm"
                      >
                        {referenceLabel}
                      </span>
                    )
                  }

                  const verseTarget =
                    citation.verseStart
                      ? `?verse=${citation.verseStart}#verse-${citation.verseStart}`
                      : ''

                  return (
                    <Link
                      key={`${citation.book}-${citation.chapter}-${citation.verseStart ?? 0}-${index}`}
                      to={`/bible/${passage.book.id}/${citation.chapter}${verseTarget}`}
                      className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold hover:border-acc hover:text-acc"
                    >
                      {referenceLabel}
                    </Link>
                  )
                },
              )}
            </div>
          </div>
        )}

        {study.limitations.length > 0 && (
          <div className="mt-7">
            <h2 className="text-base">
              Study notes
            </h2>

            <div className="mt-2 space-y-2">
              {study.limitations.map(
                (limitation, index) => (
                  <p
                    key={index}
                    className="text-sm text-mute"
                  >
                    {limitation}
                  </p>
                ),
              )}
            </div>
          </div>
        )}

        <p className="mt-7 text-xs text-mute">
          Shared{' '}
          {new Date(
            sharedStudy.createdAt,
          ).toLocaleDateString()}
        </p>
      </article>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:border-acc hover:text-acc"
          onClick={() => {
            void navigator.clipboard
              .writeText(window.location.href)
              .then(() => {
                setCopyMessage({
                  message: 'Share link copied.',
                  error: false,
                })
              })
              .catch(() => {
                setCopyMessage({
                  message:
                    'Could not copy the link automatically.',
                  error: true,
                })
              })
          }}
        >
          Copy share link
        </button>

        <Link
          to="/"
          className="font-semibold text-acc hover:underline"
        >
          Explore Pathway
        </Link>
      </div>

      {copyMessage && (
        <p
          className={
            copyMessage.error
              ? 'mt-3 text-sm text-red-600'
              : 'mt-3 text-sm font-semibold text-acc'
          }
          role="status"
        >
          {copyMessage.message}
        </p>
      )}
    </div>
  )
}
