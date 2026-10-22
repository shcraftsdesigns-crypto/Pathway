import { useState } from 'react'
import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  FileText,
  NotebookPen,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import SectionHeader from '@/components/ui/SectionHeader'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useStudyData } from '@/hooks/useStudyData'
import { bibleBooks } from '@/data/bibleBooks'
import {
  removeSavedCharacter,
  removeSavedStudy,
  saveCharacterNote,
  toggleSavedStudyComplete,
} from '@/lib/studyStorage'

export default function MyStudy() {
  usePageTitle('My Study')

  const { data, refresh } = useStudyData()
  const [editingId, setEditingId] = useState<string | null>(
    null,
  )
  const [sharingId, setSharingId] = useState<string | null>(
    null,
  )
  const [shareMessage, setShareMessage] = useState<{
    studyId: string
    message: string
    error: boolean
  } | null>(null)

  const [shareUrls, setShareUrls] = useState<
    Record<string, string>
  >(() => {
    try {
      const stored = localStorage.getItem(
        'pathway-shared-study-links',
      )

      return stored
        ? (JSON.parse(stored) as Record<string, string>)
        : {}
    } catch {
      return {}
    }
  })

  const shareStudy = async (
    study: (typeof data.savedStudies)[number],
  ) => {
    setSharingId(study.id)
    setShareMessage(null)

    try {
      const response = await fetch('/api/shared-studies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          study: {
            type: study.type,
            subject: study.subject,
            answer: study.answer,
            sections: study.sections,
            scriptureCitations: study.scriptureCitations,
            limitations: study.limitations,
          },
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          typeof result?.error === 'string'
            ? result.error
            : 'Pathway could not create the share link. Please try again.',
        )
      }

      if (typeof result?.id !== 'string') {
        throw new Error(
          'Pathway could not create the share link. Please try again.',
        )
      }

      const shareUrl =
        `${window.location.origin}/shared-study/${result.id}`

      setShareUrls((current) => {
        const next = {
          ...current,
          [study.id]: shareUrl,
        }

        try {
          localStorage.setItem(
            'pathway-shared-study-links',
            JSON.stringify(next),
          )
        } catch {
          // The share still works if local storage is unavailable.
        }

        return next
      })

      try {
        await navigator.clipboard.writeText(shareUrl)

        setShareMessage({
          studyId: study.id,
          message: 'Share link created and copied.',
          error: false,
        })
      } catch {
        setShareMessage({
          studyId: study.id,
          message:
            'Share link created. Use the buttons below to copy or open it.',
          error: false,
        })
      }
    } catch (error) {
      setShareMessage({
        studyId: study.id,
        message:
          error instanceof Error
            ? error.message
            : 'Pathway could not create the share link. Please try again.',
        error: true,
      })
    } finally {
      setSharingId(null)
    }
  }

  const savedIds = new Set(
    data.savedCharacters.map((character) => character.id),
  )

  const notes = data.notes.filter(
    (note) =>
      savedIds.has(note.characterId) || note.text.trim(),
  )

  const completedCount = data.progress.reduce(
    (total, entry) =>
      total + entry.completedAreaIds.length,
    0,
  )

  const hasStudyActivity =
    data.savedCharacters.length > 0 ||
    notes.length > 0 ||
    completedCount > 0 ||
    data.savedStudies.length > 0 ||
    data.bibleVerses.length > 0

  if (!hasStudyActivity) {
    return (
      <EmptyState
        title="My Study"
        description="Save a biblical character, write personal notes, or complete study areas to begin building your study journey."
        action={
          <Button to="/characters">
            Explore Characters
          </Button>
        }
      />
    )
  }

  return (
    <div>
      <SectionHeader
        title="My Study"
        subtitle="Your saved characters, Scripture bookmarks, AI-generated studies, personal notes, and study progress."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <Bookmark
            size={22}
            className="text-acc"
            aria-hidden="true"
          />
          <p className="mt-3 text-2xl font-bold">
            {data.savedCharacters.length}
          </p>
          <p className="text-sm text-mute">
            Saved characters
          </p>
        </div>

        <div className="card">
          <FileText
            size={22}
            className="text-acc"
            aria-hidden="true"
          />
          <p className="mt-3 text-2xl font-bold">
            {notes.length}
          </p>
          <p className="text-sm text-mute">
            Personal notes
          </p>
        </div>

        <div className="card">
          <CheckCircle2
            size={22}
            className="text-acc"
            aria-hidden="true"
          />
          <p className="mt-3 text-2xl font-bold">
            {completedCount}
          </p>
          <p className="text-sm text-mute">
            Study areas completed
          </p>
        </div>

        <div className="card">
          <Sparkles
            size={22}
            className="text-acc"
            aria-hidden="true"
          />
          <p className="mt-3 text-2xl font-bold">
            {data.savedStudies.length}
          </p>
          <p className="text-sm text-mute">
            Saved studies
          </p>
        </div>
      </div>

      <section className="py-8">
        <SectionHeader
          title="Saved Characters"
          subtitle="Continue studying the characters you have bookmarked."
        />

        {data.savedCharacters.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.savedCharacters.map((character) => {
              const progress =
                data.progress.find(
                  (entry) =>
                    entry.characterId === character.id,
                )?.completedAreaIds.length ?? 0

              const note =
                data.notes.find(
                  (entry) =>
                    entry.characterId === character.id,
                )?.text ?? ''

              return (
                <article
                  key={character.id}
                  className="card flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl">
                        {character.name}
                      </h3>
                      <p className="mt-1 text-sm text-mute">
                        {progress}{' '}
                        {progress === 1
                          ? 'study area'
                          : 'study areas'}{' '}
                        completed
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        removeSavedCharacter(
                          character.id,
                        )
                        refresh()
                      }}
                      className="rounded-lg p-2 text-mute hover:bg-accbg hover:text-ink"
                      aria-label={`Remove ${character.name} from My Study`}
                    >
                      <Trash2
                        size={18}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  {note && (
                    <p className="mt-4 line-clamp-3 text-sm text-mute">
                      {note}
                    </p>
                  )}

                  <Link
                    to={`/characters/${character.slug}`}
                    className="mt-5 inline-flex items-center gap-2 font-semibold text-acc"
                  >
                    <BookOpen
                      size={17}
                      aria-hidden="true"
                    />
                    Continue study
                  </Link>
                </article>
              )
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm text-mute">
            You have not bookmarked a character yet.
          </p>
        )}
      </section>

      {data.bibleVerses.length > 0 && (
        <section className="py-8">
          <SectionHeader
            title="Bible Bookmarks & Notes"
            subtitle="Return to Scripture you bookmarked or annotated while reading."
          />

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {data.bibleVerses
              .filter(
                (verse) =>
                  verse.bookmarked ||
                  verse.note.trim(),
              )
              .map((verse) => (
                <article
                  key={verse.id}
                  className="card flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-mute">
                        {verse.translation}
                      </p>

                      <h3 className="mt-1 text-xl">
                        {verse.bookName} {verse.chapter}:{verse.verse}
                      </h3>
                    </div>

                    {verse.bookmarked && (
                      <Bookmark
                        size={20}
                        className="text-acc"
                        fill="currentColor"
                        aria-label="Bookmarked verse"
                      />
                    )}
                  </div>

                  <p className="mt-4 text-sm leading-6">
                    <sup className="mr-2 text-xs font-semibold text-acc">
                      {verse.verse}
                    </sup>
                    {verse.text}
                  </p>

                  {verse.note && (
                    <div className="mt-4 rounded-xl border border-line bg-accbg/40 p-3">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-mute">
                        <NotebookPen
                          size={15}
                          aria-hidden="true"
                        />
                        Personal note
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-mute">
                        {verse.note}
                      </p>
                    </div>
                  )}

                  <Link
                    to={`/bible/${verse.bookId}/${verse.chapter}?verse=${verse.verse}#verse-${verse.verse}`}
                    className="mt-5 inline-flex items-center gap-2 font-semibold text-acc"
                  >
                    <BookOpen
                      size={17}
                      aria-hidden="true"
                    />
                    Read in Bible
                  </Link>
                </article>
              ))}
          </div>
        </section>
      )}

      {data.savedStudies.length > 0 && (
        <section className="py-8">
          <SectionHeader
            title="Saved Studies"
            subtitle="Continue the personal Bible studies you generated with Pathway AI."
          />

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {data.savedStudies.map((study) => (
              <article
                key={study.id}
                className="card flex flex-col"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-mute">
                      {study.type === 'passage'
                        ? 'Bible Passage'
                        : study.type === 'character'
                          ? 'Character'
                          : 'Topic'}
                    </p>

                    <h3 className="mt-1 text-xl">
                      {study.subject}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      removeSavedStudy(study.id)
                      refresh()
                    }}
                    className="rounded-lg p-2 text-mute hover:bg-accbg hover:text-ink"
                    aria-label={`Remove ${study.subject} from My Study`}
                  >
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  {study.sections.length > 0 ? (
                    study.sections.map((section, index) => (
                      <section
                        key={`${section.heading}-${index}`}
                      >
                        <h4 className="font-semibold">
                          {section.heading}
                        </h4>

                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-mute">
                          {section.content}
                        </p>
                      </section>
                    ))
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-6 text-mute">
                      {study.answer}
                    </p>
                  )}
                </div>

                {study.scriptureCitations.length > 0 && (
                  <div className="mt-5">
                    <p className="text-sm font-semibold">
                      Scripture references
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {study.scriptureCitations.map(
                        (citation, index) => {
                          const verses = citation.verseStart
                            ? citation.verseEnd &&
                              citation.verseEnd !==
                                citation.verseStart
                              ? `:${citation.verseStart}–${citation.verseEnd}`
                              : `:${citation.verseStart}`
                            : ''

                          const normalizeBookName = (
                            value: string,
                          ) =>
                            value
                              .trim()
                              .toLowerCase()
                              .replace(/\./g, '')
                              .replace(/\s+/g, ' ')

                          const normalizedBook =
                            normalizeBookName(
                              citation.book,
                            )

                          const bibleBook =
                            bibleBooks.find(
                              (book) =>
                                normalizeBookName(
                                  book.name,
                                ) === normalizedBook ||
                                normalizeBookName(
                                  book.abbreviation,
                                ) === normalizedBook ||
                                normalizeBookName(
                                  book.id,
                                ) === normalizedBook,
                            )

                          const referenceLabel =
                            `${citation.book} ${citation.chapter}${verses}`

                          if (!bibleBook) {
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
                              to={`/bible/${bibleBook.id}/${citation.chapter}${verseTarget}`}
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

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      toggleSavedStudyComplete(study.id)
                      refresh()
                    }}
                    className={
                      study.completed
                        ? 'inline-flex items-center gap-2 inline-flex min-h-11 items-center rounded-xl bg-accbg px-3 py-2 text-sm font-semibold text-acc'
                        : 'inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-semibold transition-colors hover:border-acc hover:bg-accbg hover:text-acc'
                    }
                  >
                    <CheckCircle2
                      size={17}
                      aria-hidden="true"
                    />
                    {study.completed
                      ? 'Completed'
                      : 'Mark complete'}
                  </button>

                  <button
                    type="button"
                    onClick={() => void shareStudy(study)}
                    disabled={sharingId === study.id}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-semibold transition-colors hover:border-acc hover:bg-accbg hover:text-acc disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sharingId === study.id
                      ? 'Sharing...'
                      : 'Share'}
                  </button>

                  <p className="text-xs text-mute">
                    Saved{' '}
                    {new Date(
                      study.savedAt,
                    ).toLocaleDateString()}
                  </p>
                </div>

                <p className="mt-3 text-xs text-mute">
                  Sharing includes this generated study and its
                  Scripture references. Your personal notes and
                  study progress are not included.
                </p>

                {shareMessage?.studyId === study.id && (
                  <p
                    className={
                      shareMessage.error
                        ? 'mt-3 text-sm text-red-600'
                        : 'mt-3 text-sm font-semibold text-acc'
                    }
                    role="status"
                  >
                    {shareMessage.message}
                  </p>
                )}

                {shareUrls[study.id] && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line px-3 py-2 text-sm font-semibold transition-colors hover:border-acc hover:bg-accbg hover:text-acc"
                      onClick={() => {
                        void navigator.clipboard
                          .writeText(shareUrls[study.id])
                          .then(() => {
                            setShareMessage({
                              studyId: study.id,
                              message: 'Share link copied.',
                              error: false,
                            })
                          })
                          .catch(() => {
                            setShareMessage({
                              studyId: study.id,
                              message:
                                'Could not copy automatically. You can still open the shared study.',
                              error: true,
                            })
                          })
                      }}
                    >
                      Copy link
                    </button>

                    <a
                      href={shareUrls[study.id]}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center inline-flex min-h-11 items-center justify-center rounded-xl border border-line px-3 py-2 text-sm font-semibold transition-colors hover:border-acc hover:bg-accbg hover:text-acc"
                    >
                      Open shared study
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {notes.length > 0 && (
        <section className="py-8">
          <SectionHeader
            title="Study Notes"
            subtitle="Review and update the notes you have written during your studies."
          />

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {notes.map((note) => {
              const character =
                data.savedCharacters.find(
                  (saved) =>
                    saved.id === note.characterId,
                )

              const editing =
                editingId === note.characterId

              return (
                <article
                  key={note.characterId}
                  className="card"
                >
                  <h3 className="text-lg">
                    {character?.name ??
                      'Character study note'}
                  </h3>

                  {editing ? (
                    <div className="mt-3">
                      <textarea
                        id={`my-study-note-${note.characterId}`}
                        defaultValue={note.text}
                        rows={5}
                        className="w-full rounded-xl border border-line bg-transparent px-4 py-3 text-ink outline-none focus:border-acc"
                      />

                      <div className="mt-3 flex flex-wrap gap-3">
                        <button
                          type="button"
                          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-acc px-4 py-2 text-sm font-semibold text-on"
                          onClick={() => {
                            const element =
                              document.getElementById(
                                `my-study-note-${note.characterId}`,
                              ) as HTMLTextAreaElement | null

                            saveCharacterNote(
                              note.characterId,
                              element?.value ?? note.text,
                            )

                            setEditingId(null)
                            refresh()
                          }}
                        >
                          Save note
                        </button>

                        <button
                          type="button"
                          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line px-4 py-2 text-sm font-semibold"
                          onClick={() =>
                            setEditingId(null)
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="mt-3 whitespace-pre-wrap text-sm text-mute">
                        {note.text}
                      </p>

                      <button
                        type="button"
                        className="mt-4 text-sm font-semibold text-acc"
                        onClick={() =>
                          setEditingId(
                            note.characterId,
                          )
                        }
                      >
                        Edit note
                      </button>
                    </>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      )}

      <div className="py-6">
        <Button to="/characters" variant="secondary">
          Explore More Characters
        </Button>
      </div>
    </div>
  )
}
