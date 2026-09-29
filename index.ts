export const CHARACTER_CATEGORIES = ['Kings', 'Prophets', 'Women', 'Apostles', 'Disciples', 'Leaders', 'Patriarchs', 'Judges', 'Other'] as const
export type CharacterCategory = (typeof CHARACTER_CATEGORIES)[number]

export const TESTAMENTS = ['Old Testament', 'New Testament'] as const
export type Testament = (typeof TESTAMENTS)[number]

export interface ScriptureReference {
  book: string
  chapter: number
  verseStart?: number
  verseEnd?: number
}

export interface TimelineEvent {
  id: string
  title: string
  description: string
  scriptureReferences: ScriptureReference[]
}

export interface CharacterRelationship {
  id: string
  relatedName: string
  relatedSlug?: string
  relationshipType: string
  description: string
  scriptureReferences: ScriptureReference[]
}

export interface BiblicalCharacter {
  id: string
  name: string
  slug: string
  alternateNames?: string[]
  testament: Testament
  categories: CharacterCategory[]
  subtitle: string
  shortDescription: string
  biography?: string
  keyScriptures: ScriptureReference[]
  timeline?: TimelineEvent[]
  relationships?: CharacterRelationship[]
  imageUrl?: string
}

export interface CharacterFilters {
  query: string
  testament: Testament | null
  category: CharacterCategory | null
}
