import { useAsync } from './useAsync'
import { getCharacterBySlug } from '@/lib/characterRepository'

export const useCharacter = (slug: string) =>
  useAsync(() => getCharacterBySlug(slug), [slug])
