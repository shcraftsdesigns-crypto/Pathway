import { useState } from 'react'
import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  FileText,
  Trash2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import SectionHeader from '@/components/ui/SectionHeader'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useStudyData } from '@/hooks/useStudyData'
import {
  removeSavedCharacter,
  saveCharacterNote,
} from '@/lib/studyStorage'

export default function MyStudy() {
  usePageTitle('My Study')

  const { data, refresh } = useStudyData()
  const [editingId, setEditingId] = useState<string | null>(
    null,
  )

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
    completedCount > 0

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
        subtitle="Your saved characters, personal notes, and study progress on this device."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
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
                          className="rounded-lg bg-acc px-4 py-2 text-sm font-semibold text-on"
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
                          className="rounded-lg border border-line px-4 py-2 text-sm font-semibold"
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
