import type { BiblicalCharacter } from '@/types'
import CharacterCard from './CharacterCard'
import EmptyState from '@/components/ui/EmptyState'

export default function CharacterGrid({ characters }: { characters: BiblicalCharacter[] }) {
  if (!characters.length) return <EmptyState title="No characters found" description="Try a different name or clear your filters." />
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {characters.map((c) => <li key={c.id} className="flex"><div className="flex-1 [&>a]:h-full"><CharacterCard character={c} /></div></li>)}
    </ul>
  )
}
