import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import CharacterHeader from '@/components/characters/CharacterHeader'
import Timeline from '@/components/characters/Timeline'
import ScriptureReferenceCard from '@/components/characters/ScriptureReferenceCard'
import StudyAreaCard from '@/components/characters/StudyAreaCard'
import { useCharacter } from '@/hooks/useCharacters'
import { collectReferences, formatReference } from '@/lib/scripture'
import { usePageTitle } from '@/hooks/usePageTitle'
import { UNIVERSAL_STUDY_AREAS } from '@/data/studyAreas'
import type { ScriptureReference } from '@/types'

const INITIAL_REFERENCE_LIMIT = 24

const STUDY_AREA_DESCRIPTIONS: Record<
  (typeof UNIVERSAL_STUDY_AREAS)[number],
  string
> = {
  Background:
    'Explore who this person was and the setting in which they appear in Scripture.',
  'Biblical Appearances':
    'Read the Scripture passages where this person is identified or mentioned.',
  Reflection:
    'Reflect on what these passages reveal without going beyond what Scripture supports.',
}

function getStudyAreaDescription(
  area: (typeof UNIVERSAL_STUDY_AREAS)[number],
  name: string,
) {
  return `${STUDY_AREA_DESCRIPTIONS[area]} Study ${name}'s referenced passages carefully.`
}

function uniqueReferences(
  references: ScriptureReference[],
): ScriptureReference[] {
  const seen = new Set<string>()

  return references.filter((reference) => {
    const key = formatReference(reference)

    if (seen.has(key)) return false

    seen.add(key)
    return true
  })
}

export default function CharacterProfile() {
  const { slug = '' } = useParams()
  const { data: c, loading, error } = useCharacter(slug)
  const [showAllReferences, setShowAllReferences] = useState(false)

  usePageTitle(c?.name)

  if (loading) return <LoadingState />

  if (error) {
    return (
      <EmptyState
        title="Something went wrong"
        description="This character could not be loaded."
        action={<Button to="/characters">Browse characters</Button>}
      />
    )
  }

  if (!c) {
    return (
      <EmptyState
        title="Character not found"
        action={<Button to="/characters">Browse characters</Button>}
      />
    )
  }

  const references = uniqueReferences(collectReferences(c))
  const visibleReferences = showAllReferences
    ? references
    : references.slice(0, INITIAL_REFERENCE_LIMIT)

  const hasMoreReferences = references.length > INITIAL_REFERENCE_LIMIT

  return (
    <article>
      <Link
        to="/characters"
        className="inline-flex items-center gap-1 text-sm text-mute"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        All characters
      </Link>

      <CharacterHeader character={c} />

      {c.biography && (
        <section className="py-6">
          <SectionHeader title="About" />
          <p className="max-w-2xl">{c.biography}</p>
        </section>
      )}

      {c.timeline && c.timeline.length > 0 && (
        <section className="py-6">
          <SectionHeader title="Life Timeline" />
          <p className="mb-5 rounded-lg bg-accbg px-4 py-2.5 text-sm">
            Structured study content with Scripture references for each event.
          </p>
          <Timeline events={c.timeline} />
        </section>
      )}

      <section className="py-6">
        <SectionHeader
          title="Scripture References"
          subtitle={`${references.length} ${
            references.length === 1 ? 'reference' : 'references'
          } connected to this character.`}
        />

        {references.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleReferences.map((reference) => (
                <ScriptureReferenceCard
                  key={formatReference(reference)}
                  reference={reference}
                />
              ))}
            </div>

            {hasMoreReferences && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:border-acc"
                  onClick={() =>
                    setShowAllReferences((current) => !current)
                  }
                >
                  {showAllReferences ? (
                    <>
                      Show fewer references
                      <ChevronUp size={16} aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      Show all {references.length} references
                      <ChevronDown size={16} aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-mute">
            No verified Scripture references are currently available for this
            character.
          </p>
        )}
      </section>

      {c.relationships && c.relationships.length > 0 && (
        <section className="py-6">
          <SectionHeader title="Relationships" />

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.relationships.map((relationship) => (
              <li key={relationship.id} className="card">
                <span className="tag">
                  {relationship.relationshipType}
                </span>
                <h3 className="mt-1 text-lg">
                  {relationship.relatedName}
                </h3>
                <p className="text-sm text-mute">
                  {relationship.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="py-6">
        <SectionHeader
          title="Character Study Areas"
          subtitle="Guided study prompts grounded in this character's Scripture references."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.studyAreas?.length
            ? c.studyAreas.map((area) => (
                <StudyAreaCard
                  key={area.id}
                  title={area.title}
                  description={area.description}
                  references={area.scriptureReferences}
                />
              ))
            : UNIVERSAL_STUDY_AREAS.map((area) => (
                <StudyAreaCard
                  key={area}
                  title={area}
                  description={getStudyAreaDescription(area, c.name)}
                  references={references}
                />
              ))}
        </div>
      </section>
    </article>
  )
}
