import { characters, FEATURED_SLUGS } from '@/data/characters'
import type { BiblicalCharacter, CharacterFilters } from '@/types'

export async function listFeaturedCharacters(): Promise<BiblicalCharacter[]> {
  return FEATURED_SLUGS.map((s) => characters.find((c) => c.slug === s)).filter((c): c is BiblicalCharacter => Boolean(c))
}

export async function getCharacterBySlug(slug: string): Promise<BiblicalCharacter | null> {
  return characters.find((c) => c.slug === slug.toLowerCase()) ?? null
}

export async function searchCharacters({ query, testament, category }: CharacterFilters): Promise<BiblicalCharacter[]> {
  const q = query.trim().toLowerCase()
  return characters.filter((c) => {
    if (testament && c.testament !== testament) return false
    if (category && !c.categories.includes(category)) return false
    if (!q) return true
    return [c.name, ...(c.alternateNames ?? []), ...c.categories, c.testament].some((v) => v.toLowerCase().includes(q))
  })
}
