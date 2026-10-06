import { characters, FEATURED_SLUGS } from '@/data/characters'
import { verifiedCharacters } from '@/data/verifiedCharacters.generated'
import { JESUS_STUDY_AREAS } from '@/data/jesusStudyAreas'
import type { BiblicalCharacter, CharacterFilters } from '@/types'

function enrichCharacter(character: BiblicalCharacter): BiblicalCharacter {
  if (character.slug === 'jesus') {
    return {
      ...character,
      studyAreas: JESUS_STUDY_AREAS,
    }
  }

  return character
}

// Rich profiles are linked to verified biblical people by person ID.
// This prevents people who share the same name from being merged accidentally.
const richCharactersById = new Map(
  characters.map((character) => [
    character.id,
    enrichCharacter(character),
  ])
)

const richCharactersBySlug = new Map(
  characters.map((character) => [
    character.slug,
    enrichCharacter(character),
  ])
)

const allCharacters = [
  ...verifiedCharacters.map((character) => {
    const rich = richCharactersById.get(character.id)

    return rich ?? enrichCharacter(character)
  }),
  ...characters.filter(
    (character) =>
      !verifiedCharacters.some(
        (verified) => verified.id === character.id
      )
  ),
]

export async function listFeaturedCharacters(): Promise<BiblicalCharacter[]> {
  return FEATURED_SLUGS
    .map((slug) => richCharactersBySlug.get(slug))
    .filter((character): character is BiblicalCharacter => Boolean(character))
}

export async function getCharacterBySlug(
  slug: string
): Promise<BiblicalCharacter | null> {
  const normalizedSlug = slug.toLowerCase()

  return (
    richCharactersBySlug.get(normalizedSlug) ??
    (() => {
      const character = allCharacters.find(
        (character) => character.slug === normalizedSlug
      )

      return character ? enrichCharacter(character) : null
    })()
  )
}

export async function searchCharacters({
  query,
  testament,
  category,
}: CharacterFilters): Promise<BiblicalCharacter[]> {
  const q = query.trim().toLowerCase()

  const matches = allCharacters.filter((character) => {
    if (testament && character.testament !== testament) return false

    if (category && !character.categories.includes(category)) return false

    if (!q) return true

    return [
      character.name,
      ...(character.alternateNames ?? []),
      ...character.categories,
      character.testament,
      character.subtitle,
      character.shortDescription,
    ].some((value) => value.toLowerCase().includes(q))
  })

  // Preserve the normal database order when there is no search query.
  if (!q) return matches

  // Rank search results by relevance without merging or changing identities.
  // Primary names outrank aliases, and aliases outrank descriptive matches.
  const score = (character: BiblicalCharacter): number => {
    const name = character.name.toLowerCase()
    const alternateNames = (character.alternateNames ?? []).map(
      (value) => value.toLowerCase()
    )

    if (name === q) return 0
    if (name.startsWith(q)) return 1
    if (alternateNames.some((value) => value === q)) return 2
    if (alternateNames.some((value) => value.startsWith(q))) return 3
    if (name.includes(q)) return 4
    if (alternateNames.some((value) => value.includes(q))) return 5

    if (
      character.categories.some(
        (value) => value.toLowerCase() === q
      )
    ) {
      return 6
    }

    if (character.testament.toLowerCase() === q) return 7

    if (character.subtitle.toLowerCase().includes(q)) return 8
    if (character.shortDescription.toLowerCase().includes(q)) return 9

    return 10
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
