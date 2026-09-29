import Button from '@/components/ui/Button'
import SectionHeader from '@/components/ui/SectionHeader'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import { usePageTitle } from '@/hooks/usePageTitle'
import CharacterGrid from '@/components/characters/CharacterGrid'
import CategoryCard from '@/components/characters/CategoryCard'
import { useFeaturedCharacters } from '@/hooks/useCharacters'
import { CHARACTER_CATEGORIES } from '@/types'

const STEPS = [
  ['Choose a Character', 'Find the person you want to study.'],
  ['Explore Their Story', 'Follow their life, relationships, decisions, struggles, victories, and failures.'],
  ['Reflect and Learn', 'Use Scripture references and reflection questions to apply what you learn.'],
]

export default function Home() {
  const { data, loading, error } = useFeaturedCharacters()
  usePageTitle()
  return (
    <>
      <section className="py-10">
        <h1 className="text-4xl md:text-6xl">Discover the People Behind the Story</h1>
        <p className="mt-4 max-w-2xl text-lg text-mute">Explore the lives, journeys, struggles, faith, failures, and lessons of biblical characters through a structured Bible study experience.</p>
        <div className="mt-6 flex flex-wrap gap-3"><Button to="/characters">Explore Characters</Button><Button to="/study" variant="secondary">Start a Study</Button></div>
      </section>
      <section className="py-6">
        <SectionHeader title="Featured Characters" />
        {error ? <EmptyState title="Something went wrong" description="Characters could not be loaded." /> : loading ? <LoadingState /> : <CharacterGrid characters={data ?? []} />}
      </section>
      <section className="py-6">
        <SectionHeader title="Explore by Category" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{CHARACTER_CATEGORIES.map((c) => <CategoryCard key={c} category={c} />)}</div>
      </section>
      <section className="py-6">
        <SectionHeader title="How It Works" />
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="card"><span className="grid h-8 w-8 place-items-center rounded-full bg-accbg font-semibold text-acc">{i + 1}</span><h3 className="mt-2 text-xl">{t}</h3><p className="text-mute">{d}</p></li>
          ))}
        </ol>
      </section>
    </>
  )
}
