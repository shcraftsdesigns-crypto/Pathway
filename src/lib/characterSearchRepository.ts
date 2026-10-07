import type {
  CharacterFilters,
  CharacterSummary,
} from '@/types'

let characterIndexPromise: Promise<CharacterSummary[]> | null = null

function loadCharacterIndex(): Promise<CharacterSummary[]> {
  if (!characterIndexPromise) {
    characterIndexPromise = import(
      '@/data/characterSearchIndex.generated'
    ).then((module) => module.characterSearchIndex)
  }

  return characterIndexPromise
}

export function preloadCharacterSearchIndex(): void {
  void loadCharacterIndex()
}

export async function searchCharacterSummaries({
  query,
  testament,
  category,
}: CharacterFilters): Promise<CharacterSummary[]> {
  const allCharacterSummaries = await loadCharacterIndex()
  const q = query.trim().toLowerCase()

  const matches = allCharacterSummaries.filter((character) => {
    if (testament && character.testament !== testament) return false
    if (category && !character.categories.includes(category)) return false
    if (!q) return true

    return [
      character.name,
      ...(character.alternateNames ?? []),
      ...character.categories,
      character.testament,
    ].some((value) => value.toLowerCase().includes(q))
  })

  if (!q) return matches

  const score = (character: CharacterSummary): number => {
    const name = character.name.toLowerCase()
    const alternateNames = (character.alternateNames ?? []).map(
      (value) => value.toLowerCase(),
    )

    if (name === q) return 0
    if (name.startsWith(q)) return 1
    if (alternateNames.some((value) => value === q)) return 2
    if (alternateNames.some((value) => value.startsWith(q))) return 3
    if (name.includes(q)) return 4
    if (alternateNames.some((value) => value.includes(q))) return 5

    if (
      character.categories.some(
        (value) => value.toLowerCase() === q,
      )
    ) {
      return 6
    }

    if (character.testament.toLowerCase() === q) return 7

    return 8
  }

  return matches
    .map((character, index) => ({
      character,
      index,
      score: score(character),
    }))
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map(({ character }) => character)
}
