import { useAsync } from './useAsync'
import { searchCharacterSummaries } from '@/lib/characterSearchRepository'
import type { CharacterFilters } from '@/types'

export const useCharacters = (filters: CharacterFilters) =>
  useAsync(
    () => searchCharacterSummaries(filters),
    [filters.query, filters.testament, filters.category],
  )
