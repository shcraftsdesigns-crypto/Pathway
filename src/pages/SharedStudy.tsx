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

const studyTypeLabels: Record<SharedStudyData['type'], string> = {
  character: 'Character Study',
  passage: 'Bible Passage Study',
  topic: 'Topic Study',
}

const studyTypeDescriptions: Record<
  SharedStudyData['type'],
  string
> = {
  character:
    'Explore what Scripture establishes about this biblical character.',
  passage:
    'Explore this Bible passage with Scripture-centered study and reflection.',
  topic:
    'Explore this biblical topic through Scripture, interpretation, and reflection.',
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
      ? `${sharedStudy.study.subject} — ${studyTypeLabels[sharedStudy.study.type]}`
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
  const studyTypeLabel = studyTypeLabels[study.type]
  const studyTypeDescription =
    studyTypeDescriptions[study.type]

  return (
    <div className="mx-auto max-w-4xl py-8 sm:py-12">
      <header className="rounded-2xl border border-line bg-accbg/40 px-5 py-7 sm:px-8 sm:py-9">
        <p className="text-xs font-semibold uppercase tracking-widest text-acc">
          Shared from Pathway
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {study.subject}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-line bg-white/50 px-3 py-1.5 text-sm font-semibold text-acc">
            {studyTypeLabel}
          </span>

          <span className="text-sm text-mute">
            Shared{' '}
            {new Date(
              sharedStudy.createdAt,
            ).toLocaleDateString()}
          </span>
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-mute sm:text-base">
          {studyTypeDescription}
        </p>
      </header>

      <article className="card mt-6 sm:p-8">
        {study.sections.length > 0 ? (
          <div className="space-y-7">
            {study.sections.map((section, index) => (
              <section
                key={`${section.heading}-${index}`}
                className={
                  index === 0
                    ? ''
                    : 'border-t border-line pt-7'
                }
              >
                <h2 className="text-xl font-semibold">
                  {section.heading}
                </h2>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-mute sm:text-base">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-7 text-mute sm:text-base">
            {study.answer}
          </p>
        )}

        {study.scriptureCitations.length > 0 && (
          <section className="mt-8 border-t border-line pt-7">
            <h2 className="text-xl font-semibold">
              Scripture references
            </h2>

            <p className="mt-1 text-sm text-mute">
              Open a reference to continue reading it in Pathway.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
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
                        className="rounded-full border border-line px-3 py-2 text-sm"
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
                      className="rounded-full border border-line px-3 py-2 text-sm font-semibold transition-colors hover:border-acc hover:bg-accbg hover:text-acc"
                    >
                      {referenceLabel}
                    </Link>
                  )
                },
              )}
            </div>
          </section>
        )}

        {study.limitations.length > 0 && (
          <section className="mt-8 border-t border-line pt-7">
            <h2 className="text-xl font-semibold">
              Study notes
            </h2>

            <div className="mt-3 space-y-3">
              {study.limitations.map(
                (limitation, index) => (
                  <p
                    key={index}
                    className="text-sm leading-6 text-mute"
                  >
                    {limitation}
                  </p>
                ),
              )}
            </div>
          </section>
        )}
      </article>

      <section className="card mt-6">
        <h2 className="text-lg font-semibold">
          Continue studying with Pathway
        </h2>

        <p className="mt-2 text-sm leading-6 text-mute">
          Explore biblical characters, read Scripture, and create your own personal Bible studies.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            to="/study"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-acc px-4 py-2 text-sm font-semibold text-on"
          >
            Create a study
          </Link>

          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-acc hover:text-acc"
          >
            Explore Pathway
          </Link>

          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-acc hover:text-acc"
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
      </section>

      <p className="mt-5 text-center text-xs leading-5 text-mute">
        This shared page contains the generated study and its Scripture references. Personal notes, bookmarks, study progress, and account information are not included.
      </p>
    </div>
  )
}
