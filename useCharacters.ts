import { useAsync } from './useAsync'
import { getCharacterBySlug, listFeaturedCharacters, searchCharacters } from '@/lib/characterRepository'
import type { CharacterFilters } from '@/types'

export const useCharacters = (f: CharacterFilters) => useAsync(() => searchCharacters(f), [f.query, f.testament, f.category])
export const useFeaturedCharacters = () => useAsync(listFeaturedCharacters, [])
export const useCharacter = (slug: string) => useAsync(() => getCharacterBySlug(slug), [slug])
