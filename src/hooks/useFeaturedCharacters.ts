import { listFeaturedCharacters } from '@/data/characters'
import { useAsync } from '@/hooks/useAsync'

export const useFeaturedCharacters = () =>
  useAsync(listFeaturedCharacters, [])
