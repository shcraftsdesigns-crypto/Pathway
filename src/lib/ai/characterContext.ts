import type { BiblicalCharacter } from '@/types'
import { collectReferences } from '@/lib/scripture'
import type { AICharacterContext } from './types'

const MAX_AI_CHARACTER_REFERENCES = 80

export function buildAICharacterContext(
  character: BiblicalCharacter,
): AICharacterContext {
  return {
    character: {
      id: character.id,
      name: character.name,
      slug: character.slug,
      alternateNames: character.alternateNames,
      testament: character.testament,
      subtitle: character.subtitle,
      shortDescription: character.shortDescription,
      biography: character.biography,
    },
    verifiedReferences: collectReferences(character).slice(
      0,
      MAX_AI_CHARACTER_REFERENCES,
    ),
  }
}
