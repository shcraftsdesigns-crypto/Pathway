import { characters } from '@/data/characters'
import { JESUS_STUDY_AREAS } from '@/data/jesusStudyAreas'
import type { BiblicalCharacter } from '@/types'

type CharacterBucketModule = {
  default: Record<string, BiblicalCharacter>
}

function enrichCharacter(character: BiblicalCharacter): BiblicalCharacter {
  if (character.slug === 'jesus') {
    return {
      ...character,
      studyAreas: JESUS_STUDY_AREAS,
    }
  }

  return character
}

// Generated profiles are authoritative for biblical identity and verified
// Scripture references. Handcrafted rich profiles may enhance study content,
// but they must never replace the generated identity.
function mergeRichProfile(
  generated: BiblicalCharacter,
  rich: BiblicalCharacter,
): BiblicalCharacter {
  if (generated.id !== rich.id) {
    throw new Error(
      `Rich profile ID mismatch: ${generated.id} / ${rich.id}`,
    )
  }

  return {
    ...generated,
    subtitle: rich.subtitle,
    shortDescription: rich.shortDescription,
    biography: rich.biography ?? generated.biography,
    timeline: rich.timeline ?? generated.timeline,
    relationships: rich.relationships ?? generated.relationships,
    studyAreas: rich.studyAreas ?? generated.studyAreas,

    // Explicitly preserve canonical generated identity/evidence fields.
    id: generated.id,
    name: generated.name,
    slug: generated.slug,
    alternateNames: generated.alternateNames,
    testament: generated.testament,
    categories: generated.categories,
    keyScriptures: generated.keyScriptures,
  }
}

// Rich profiles remain linked by exact biblical person ID.
// Never merge people merely because they share a display name.
const richCharactersById = new Map(
  characters.map((character) => [
    character.id,
    enrichCharacter(character),
  ]),
)

const PROFILE_BUCKET_COUNT = 32

// Must match scripts/generateProfileBuckets.py.
// The slug determines its bucket, so no 2,922-entry runtime manifest
// is required.
function bucketForSlug(slug: string): number {
  let hash = 5381

  for (let index = 0; index < slug.length; index += 1) {
    hash = ((hash * 33) ^ slug.charCodeAt(index)) >>> 0
  }

  return hash % PROFILE_BUCKET_COUNT
}

// Explicit lazy loaders let Vite create only 32 profile chunks.
const bucketLoaders: Record<
  number,
  () => Promise<CharacterBucketModule>
> = {
  0: () => import('@/data/characterProfileBuckets/bucket-00'),
  1: () => import('@/data/characterProfileBuckets/bucket-01'),
  2: () => import('@/data/characterProfileBuckets/bucket-02'),
  3: () => import('@/data/characterProfileBuckets/bucket-03'),
  4: () => import('@/data/characterProfileBuckets/bucket-04'),
  5: () => import('@/data/characterProfileBuckets/bucket-05'),
  6: () => import('@/data/characterProfileBuckets/bucket-06'),
  7: () => import('@/data/characterProfileBuckets/bucket-07'),
  8: () => import('@/data/characterProfileBuckets/bucket-08'),
  9: () => import('@/data/characterProfileBuckets/bucket-09'),
  10: () => import('@/data/characterProfileBuckets/bucket-10'),
  11: () => import('@/data/characterProfileBuckets/bucket-11'),
  12: () => import('@/data/characterProfileBuckets/bucket-12'),
  13: () => import('@/data/characterProfileBuckets/bucket-13'),
  14: () => import('@/data/characterProfileBuckets/bucket-14'),
  15: () => import('@/data/characterProfileBuckets/bucket-15'),
  16: () => import('@/data/characterProfileBuckets/bucket-16'),
  17: () => import('@/data/characterProfileBuckets/bucket-17'),
  18: () => import('@/data/characterProfileBuckets/bucket-18'),
  19: () => import('@/data/characterProfileBuckets/bucket-19'),
  20: () => import('@/data/characterProfileBuckets/bucket-20'),
  21: () => import('@/data/characterProfileBuckets/bucket-21'),
  22: () => import('@/data/characterProfileBuckets/bucket-22'),
  23: () => import('@/data/characterProfileBuckets/bucket-23'),
  24: () => import('@/data/characterProfileBuckets/bucket-24'),
  25: () => import('@/data/characterProfileBuckets/bucket-25'),
  26: () => import('@/data/characterProfileBuckets/bucket-26'),
  27: () => import('@/data/characterProfileBuckets/bucket-27'),
  28: () => import('@/data/characterProfileBuckets/bucket-28'),
  29: () => import('@/data/characterProfileBuckets/bucket-29'),
  30: () => import('@/data/characterProfileBuckets/bucket-30'),
  31: () => import('@/data/characterProfileBuckets/bucket-31'),
}

async function loadCharacterBySlug(
  slug: string,
): Promise<BiblicalCharacter | null> {
  const normalizedSlug = slug.toLowerCase()
  const bucket = bucketForSlug(normalizedSlug)
  const loadBucket = bucketLoaders[bucket]

  if (!loadBucket) {
    throw new Error(
      `No profile bucket loader for bucket ${bucket}`,
    )
  }

  // Jesus has an unusually large verified reference set.
  // Keep its direct lazy loader so opening Jesus does not load
  // unrelated profiles from the same bucket.
  if (normalizedSlug === 'jesus') {
    const module = await import(
      '@/data/characterProfiles/Jesus_Christ'
    )
    const character = module.default

    if (
      character.id !== 'Jesus_Christ' ||
      character.slug !== 'jesus'
    ) {
      throw new Error('Jesus Christ profile identity mismatch')
    }

    return enrichCharacter(character)
  }

  const module = await loadBucket()
  const generatedCharacter = module.default[normalizedSlug]

  if (!generatedCharacter) {
    return null
  }

  // Rich profiles are selected only after the generated profile has
  // established the exact biblical person ID. This prevents people
  // who share a name from being merged.
  const rich = richCharactersById.get(generatedCharacter.id)

  if (rich) {
    return enrichCharacter(
      mergeRichProfile(generatedCharacter, rich),
    )
  }

  if (generatedCharacter.slug !== normalizedSlug) {
    throw new Error(
      `Character slug mismatch: expected ${normalizedSlug}, received ${generatedCharacter.slug}`,
    )
  }

  return enrichCharacter(generatedCharacter)
}

const characterPromiseCache = new Map<
  string,
  Promise<BiblicalCharacter | null>
>()

export function getCharacterBySlug(
  slug: string,
): Promise<BiblicalCharacter | null> {
  const normalizedSlug = slug.toLowerCase()

  const cached = characterPromiseCache.get(normalizedSlug)
  if (cached) return cached

  const request = loadCharacterBySlug(normalizedSlug).catch((error) => {
    characterPromiseCache.delete(normalizedSlug)
    throw error
  })

  characterPromiseCache.set(normalizedSlug, request)
  return request
}

export function preloadCharacterBySlug(slug: string): void {
  void getCharacterBySlug(slug)
}

