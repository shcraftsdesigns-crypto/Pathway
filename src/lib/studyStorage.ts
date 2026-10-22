export interface SavedCharacter {
  id: string
  name: string
  slug: string
  savedAt: string
}

export interface StudyNote {
  characterId: string
  text: string
  updatedAt: string
}

export interface StudyProgress {
  characterId: string
  completedAreaIds: string[]
}

export type SavedStudyType =
  | 'character'
  | 'passage'
  | 'topic'

export interface SavedStudyCitation {
  book: string
  chapter: number
  verseStart?: number
  verseEnd?: number
}

export interface SavedStudySection {
  heading: string
  content: string
}

export interface SavedStudy {
  id: string
  type: SavedStudyType
  subject: string
  answer: string
  sections: SavedStudySection[]
  scriptureCitations: SavedStudyCitation[]
  limitations: string[]
  completed: boolean
  savedAt: string
}

export interface SavedBibleVerse {
  id: string
  bookId: string
  bookName: string
  chapter: number
  verse: string
  text: string
  translation: string
  bookmarked: boolean
  note: string
  updatedAt: string
}

export interface StudyData {
  savedCharacters: SavedCharacter[]
  notes: StudyNote[]
  progress: StudyProgress[]
  savedStudies: SavedStudy[]
  bibleVerses: SavedBibleVerse[]
}

const STORAGE_KEY = 'pathway-study-v1'

const EMPTY_DATA: StudyData = {
  savedCharacters: [],
  notes: [],
  progress: [],
  savedStudies: [],
  bibleVerses: [],
}

function isBrowser() {
  return typeof window !== 'undefined'
}

export function getStudyData(): StudyData {
  if (!isBrowser()) return EMPTY_DATA

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) return EMPTY_DATA

    const parsed = JSON.parse(raw) as Partial<StudyData>

    return {
      savedCharacters: Array.isArray(parsed.savedCharacters)
        ? parsed.savedCharacters
        : [],
      notes: Array.isArray(parsed.notes)
        ? parsed.notes
        : [],
      progress: Array.isArray(parsed.progress)
        ? parsed.progress
        : [],
      savedStudies: Array.isArray(parsed.savedStudies)
        ? parsed.savedStudies
        : [],
      bibleVerses: Array.isArray(parsed.bibleVerses)
        ? parsed.bibleVerses
        : [],
    }
  } catch {
    return EMPTY_DATA
  }
}

function writeStudyData(data: StudyData) {
  if (!isBrowser()) return

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data),
    )

    window.dispatchEvent(
      new CustomEvent('pathway-study-change'),
    )
  } catch {
    // Storage may be unavailable. Keep the app usable.
  }
}


export function replaceStudyData(data: StudyData) {
  writeStudyData(data)
}

export function isCharacterSaved(characterId: string) {
  return getStudyData().savedCharacters.some(
    (character) => character.id === characterId,
  )
}

export function saveCharacter(
  character: Omit<SavedCharacter, 'savedAt'>,
) {
  const data = getStudyData()

  if (
    data.savedCharacters.some(
      (saved) => saved.id === character.id,
    )
  ) {
    return
  }

  writeStudyData({
    ...data,
    savedCharacters: [
      {
        ...character,
        savedAt: new Date().toISOString(),
      },
      ...data.savedCharacters,
    ],
  })
}

export function removeSavedCharacter(characterId: string) {
  const data = getStudyData()

  writeStudyData({
    ...data,
    savedCharacters: data.savedCharacters.filter(
      (character) => character.id !== characterId,
    ),
  })
}

export function toggleSavedCharacter(
  character: Omit<SavedCharacter, 'savedAt'>,
) {
  if (isCharacterSaved(character.id)) {
    removeSavedCharacter(character.id)
    return false
  }

  saveCharacter(character)
  return true
}

export function getCharacterNote(characterId: string) {
  return (
    getStudyData().notes.find(
      (note) => note.characterId === characterId,
    )?.text ?? ''
  )
}

export function saveCharacterNote(
  characterId: string,
  text: string,
) {
  const data = getStudyData()
  const trimmed = text.trim()

  const notes = data.notes.filter(
    (note) => note.characterId !== characterId,
  )

  if (trimmed) {
    notes.unshift({
      characterId,
      text,
      updatedAt: new Date().toISOString(),
    })
  }

  writeStudyData({
    ...data,
    notes,
  })
}

export function getCompletedStudyAreas(characterId: string) {
  return (
    getStudyData().progress.find(
      (entry) => entry.characterId === characterId,
    )?.completedAreaIds ?? []
  )
}

export function toggleStudyArea(
  characterId: string,
  areaId: string,
) {
  const data = getStudyData()

  const existing = data.progress.find(
    (entry) => entry.characterId === characterId,
  )

  const completed = new Set(
    existing?.completedAreaIds ?? [],
  )

  if (completed.has(areaId)) {
    completed.delete(areaId)
  } else {
    completed.add(areaId)
  }

  const progress = data.progress.filter(
    (entry) => entry.characterId !== characterId,
  )

  if (completed.size > 0) {
    progress.push({
      characterId,
      completedAreaIds: [...completed],
    })
  }

  writeStudyData({
    ...data,
    progress,
  })

  return completed.has(areaId)
}

export function saveGeneratedStudy(
  study: Omit<SavedStudy, 'id' | 'savedAt' | 'completed'>,
) {
  const data = getStudyData()

  const savedStudy: SavedStudy = {
    ...study,
    id: crypto.randomUUID(),
    completed: false,
    savedAt: new Date().toISOString(),
  }

  writeStudyData({
    ...data,
    savedStudies: [
      savedStudy,
      ...data.savedStudies,
    ],
  })

  return savedStudy
}

export function removeSavedStudy(studyId: string) {
  const data = getStudyData()

  writeStudyData({
    ...data,
    savedStudies: data.savedStudies.filter(
      (study) => study.id !== studyId,
    ),
  })
}

export function toggleSavedStudyComplete(studyId: string) {
  const data = getStudyData()

  let completed = false

  const savedStudies = data.savedStudies.map((study) => {
    if (study.id !== studyId) return study

    completed = !study.completed

    return {
      ...study,
      completed,
    }
  })

  writeStudyData({
    ...data,
    savedStudies,
  })

  return completed
}



export function getSavedBibleVerse(
  bookId: string,
  chapter: number,
  verse: string,
) {
  const id = `${bookId}-${chapter}-${verse}`

  return getStudyData().bibleVerses.find(
    (entry) => entry.id === id,
  )
}

export function toggleBibleVerseBookmark(
  verse: Omit<
    SavedBibleVerse,
    'id' | 'bookmarked' | 'note' | 'updatedAt'
  >,
) {
  const data = getStudyData()
  const id = `${verse.bookId}-${verse.chapter}-${verse.verse}`
  const existing = data.bibleVerses.find(
    (entry) => entry.id === id,
  )

  const next: SavedBibleVerse = {
    ...verse,
    id,
    bookmarked: !(existing?.bookmarked ?? false),
    note: existing?.note ?? '',
    updatedAt: new Date().toISOString(),
  }

  writeStudyData({
    ...data,
    bibleVerses: [
      next,
      ...data.bibleVerses.filter(
        (entry) => entry.id !== id,
      ),
    ],
  })

  return next.bookmarked
}

export function saveBibleVerseNote(
  verse: Omit<
    SavedBibleVerse,
    'id' | 'bookmarked' | 'note' | 'updatedAt'
  >,
  note: string,
) {
  const data = getStudyData()
  const id = `${verse.bookId}-${verse.chapter}-${verse.verse}`
  const existing = data.bibleVerses.find(
    (entry) => entry.id === id,
  )

  const next: SavedBibleVerse = {
    ...verse,
    id,
    bookmarked: existing?.bookmarked ?? false,
    note: note.trim(),
    updatedAt: new Date().toISOString(),
  }

  writeStudyData({
    ...data,
    bibleVerses: [
      next,
      ...data.bibleVerses.filter(
        (entry) => entry.id !== id,
      ),
    ],
  })

  return next
}
