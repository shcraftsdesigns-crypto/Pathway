import { Link } from 'react-router-dom'
import type { CharacterSummary } from '@/types'
import { preloadCharacterProfile } from '@/App'
import { preloadCharacterBySlug } from '@/lib/characterRepository'

export default function CharacterCard({
  character: c,
}: {
  character: CharacterSummary
}) {
  const preload = () => {
    preloadCharacterProfile()
    preloadCharacterBySlug(c.slug)
  }

  return (
    <Link
      to={`/characters/${c.slug}`}
      className="card flex flex-col gap-1.5 hover:border-acc"
      onMouseEnter={preload}
      onFocus={preload}
      onTouchStart={preload}
      onPointerDown={preload}
    >
      <div className="flex flex-wrap gap-2">
        <span className="tag">{c.testament}</span>
        <span className="tag">
          {c.categories[0]}
        </span>
      </div>

      <h3 className="text-xl">{c.name}</h3>

      {(c.alternateNames?.length ?? 0) > 0 && (
        <p className="text-sm text-mute">
          Also known as: {c.alternateNames?.join(', ')}
        </p>
      )}

      <span className="mt-1 font-semibold text-acc">
        View Character →
      </span>
    </Link>
  )
}
