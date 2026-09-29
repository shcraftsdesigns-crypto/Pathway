import { Link } from 'react-router-dom'
import type { BiblicalCharacter } from '@/types'
import { formatReference } from '@/lib/scripture'

export default function CharacterCard({ character: c }: { character: BiblicalCharacter }) {
  return (
    <Link to={`/characters/${c.slug}`} className="card flex flex-col gap-1.5 hover:border-acc">
      <div className="flex flex-wrap gap-2"><span className="tag">{c.testament}</span><span className="tag">{c.categories[0]}</span></div>
      <h3 className="text-xl">{c.name}</h3>
      <p>{c.shortDescription}</p>
      <p className="text-sm text-mute">Key: {formatReference(c.keyScriptures[0])}</p>
      <span className="mt-1 font-semibold text-acc">View Character →</span>
    </Link>
  )
}
