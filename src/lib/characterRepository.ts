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

const richCharacters = new Map(
  characters.map((character) => [
    character.slug,
    enrichCharacter(character),
  ])
)

const allCharacters = [
  ...verifiedCharacters.map((character) => {
    const rich = richCharacters.get(character.slug)

    return rich ?? enrichCharacter(character)
  }),
  ...characters.filter(
    (character) =>
      !verifiedCharacters.some(
        (verified) => verified.slug === character.slug
      )
  ),
]

export async function listFeaturedCharacters(): Promise<BiblicalCharacter[]> {
  return FEATURED_SLUGS
    .map((slug) => richCharacters.get(slug))
    .filter((character): character is BiblicalCharacter => Boolean(character))
}

export async function getCharacterBySlug(
  slug: string
): Promise<BiblicalCharacter | null> {
  const normalizedSlug = slug.toLowerCase()

  return (
    richCharacters.get(normalizedSlug) ??
    (() => {
      const character = verifiedCharacters.find(
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

  return allCharacters.filter((character) => {
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
}
