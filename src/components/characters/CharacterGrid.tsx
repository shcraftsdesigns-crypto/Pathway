import { useEffect, useState } from 'react'
import type { CharacterSummary } from '@/types'
import CharacterCard from './CharacterCard'
import EmptyState from '@/components/ui/EmptyState'

const INITIAL_VISIBLE = 48
const LOAD_MORE_COUNT = 48

export default function CharacterGrid({
  characters,
}: {
  characters: CharacterSummary[]
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE)
  }, [characters])

  if (!characters.length) {
    return (
      <EmptyState
        title="No characters found"
        description="Try a different name or clear your filters."
      />
    )
  }

  const visibleCharacters = characters.slice(0, visibleCount)
  const remaining = characters.length - visibleCharacters.length

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-mute">
          Showing {visibleCharacters.length} of {characters.length} characters
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCharacters.map((character) => (
          <li key={character.id} className="flex">
            <div className="flex-1 [&>a]:h-full">
              <CharacterCard character={character} />
            </div>
          </li>
        ))}
      </ul>

      {remaining > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="btn"
            onClick={() =>
              setVisibleCount((count) =>
                Math.min(count + LOAD_MORE_COUNT, characters.length),
              )
            }
          >
            Load more ({remaining} remaining)
          </button>
        </div>
      )}
    </>
  )
}
