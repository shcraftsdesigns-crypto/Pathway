export const UNIVERSAL_STUDY_AREAS = [
  'Background',
  'Biblical Appearances',
  'Reflection',
] as const

export type UniversalStudyArea = (typeof UNIVERSAL_STUDY_AREAS)[number]
