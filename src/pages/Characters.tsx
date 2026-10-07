import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SectionHeader from '@/components/ui/SectionHeader'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import SearchBar from '@/components/characters/SearchBar'
import FilterChips from '@/components/characters/FilterChips'
import CharacterGrid from '@/components/characters/CharacterGrid'
import { useCharacters } from '@/hooks/useCharacterSearch'
import { usePageTitle } from '@/hooks/usePageTitle'
import { CHARACTER_CATEGORIES, TESTAMENTS, type CharacterCategory, type Testament } from '@/types'

export default function Characters() {
  usePageTitle('Biblical Characters')
  const [params] = useSearchParams()
  const paramCategory = CHARACTER_CATEGORIES.find((c) => c === params.get('category')) ?? null
  const [query, setQuery] = useState('')
  const [testament, setTestament] = useState<Testament | null>(null)
  const [category, setCategory] = useState<CharacterCategory | null>(paramCategory)
  const { data, loading, error } = useCharacters({ query, testament, category })

  // Follow ?category= changes (e.g. back/forward navigation)
  useEffect(() => setCategory(paramCategory), [paramCategory])

  return (
    <section>
      <SectionHeader as="h1" title="Biblical Characters" subtitle="Explore the people whose stories shaped the biblical narrative." />
      <div className="space-y-2">
        <SearchBar value={query} onChange={setQuery} autoFocus={params.get('focus') === '1'} />
        <FilterChips label="Testament filter" options={TESTAMENTS} value={testament} onChange={setTestament} />
        <FilterChips label="Category filter" options={CHARACTER_CATEGORIES} value={category} onChange={setCategory} />
      </div>
      <div className="mt-4">
        <h2 className="sr-only">Results</h2>
        <p role="status" className="sr-only">{data ? `${data.length} characters found` : ''}</p>
        {error ? <EmptyState title="Something went wrong" description="Characters could not be loaded. Please try again." />
          : loading && !data ? <LoadingState />
          : <CharacterGrid characters={data ?? []} />}
      </div>
    </section>
  )
}
