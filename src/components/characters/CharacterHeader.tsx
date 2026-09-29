import type { BiblicalCharacter } from '@/types'
import { formatReference } from '@/lib/scripture'

export default function CharacterHeader({ character: c }: { character: BiblicalCharacter }) {
  return (
    <header className="pb-2 pt-4">
      <h1 className="text-4xl md:text-5xl">{c.name}</h1>
      <p className="mt-1 text-lg">{c.subtitle}</p>
      <p className="mt-1 text-mute">{c.testament} · {c.categories.join(' · ')}{c.alternateNames?.length ? ` · Also: ${c.alternateNames.join(', ')}` : ''}</p>
      <p className="mt-3"><span className="tag">Key Scripture: {formatReference(c.keyScriptures[0])}</span></p>
    </header>
  )
}
