import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
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
import { STUDY_AREAS } from '@/data/studyAreas'

export default function CharacterProfile() {
  const { slug = '' } = useParams()
  const { data: c, loading, error } = useCharacter(slug)
  usePageTitle(c?.name)
  if (loading) return <LoadingState />
  if (error) return <EmptyState title="Something went wrong" description="This character could not be loaded." action={<Button to="/characters">Browse characters</Button>} />
  if (!c) return <EmptyState title="Character not found" action={<Button to="/characters">Browse characters</Button>} />

  return (
    <article>
      <Link to="/characters" className="inline-flex items-center gap-1 text-sm text-mute"><ArrowLeft size={16} aria-hidden="true" />All characters</Link>
      <CharacterHeader character={c} />
      {c.biography && <section className="py-6"><SectionHeader title="About" /><p className="max-w-2xl">{c.biography}</p></section>}
      {c.timeline && (
        <section className="py-6">
          <SectionHeader title="Life Timeline" />
          <p className="mb-5 rounded-lg bg-accbg px-4 py-2.5 text-sm">Sample structured study content — each event points to a passage for you to read.</p>
          <Timeline events={c.timeline} />
        </section>
      )}
      <section className="py-6">
        <SectionHeader title="Key Scriptures" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{collectReferences(c).map((r) => <ScriptureReferenceCard key={formatReference(r)} reference={r} />)}</div>
      </section>
      {c.relationships && (
        <section className="py-6">
          <SectionHeader title="Relationships" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.relationships.map((r) => <li key={r.id} className="card"><span className="tag">{r.relationshipType}</span><h3 className="mt-1 text-lg">{r.relatedName}</h3><p className="text-sm text-mute">{r.description}</p></li>)}
          </ul>
        </section>
      )}
      <section className="py-6">
        <SectionHeader title="Character Study Areas" subtitle="Placeholders for future guided content." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{STUDY_AREAS.map((a) => <StudyAreaCard key={a} title={a} />)}</div>
      </section>
    </article>
  )
}
