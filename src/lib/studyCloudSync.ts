import type {
  SavedCharacter,
  SavedStudy,
  StudyData,
  StudyNote,
  StudyProgress,
} from '@/lib/studyStorage'
import {
  getStudyData,
  replaceStudyData,
} from '@/lib/studyStorage'
import { supabase } from '@/lib/supabase/client'

function normalizeStudyData(
  value: unknown,
): StudyData {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return {
      savedCharacters: [],
      notes: [],
      progress: [],
      savedStudies: [],
    }
  }

  const data = value as Partial<StudyData>

  return {
    savedCharacters: Array.isArray(
      data.savedCharacters,
    )
      ? data.savedCharacters
      : [],
    notes: Array.isArray(data.notes)
      ? data.notes
      : [],
    progress: Array.isArray(data.progress)
      ? data.progress
      : [],
    savedStudies: Array.isArray(data.savedStudies)
      ? data.savedStudies
      : [],
  }
}

function mergeCharacters(
  local: SavedCharacter[],
  cloud: SavedCharacter[],
) {
  const merged = new Map<string, SavedCharacter>()

  for (const character of [...cloud, ...local]) {
    const current = merged.get(character.id)

    if (
      !current ||
      character.savedAt > current.savedAt
    ) {
      merged.set(character.id, character)
    }
  }

  return [...merged.values()].sort((a, b) =>
    b.savedAt.localeCompare(a.savedAt),
  )
}

function mergeNotes(
  local: StudyNote[],
  cloud: StudyNote[],
) {
  const merged = new Map<string, StudyNote>()

  for (const note of [...cloud, ...local]) {
    const current = merged.get(note.characterId)

    if (
      !current ||
      note.updatedAt > current.updatedAt
    ) {
      merged.set(note.characterId, note)
    }
  }

  return [...merged.values()]
}

function mergeProgress(
  local: StudyProgress[],
  cloud: StudyProgress[],
) {
  const merged = new Map<string, Set<string>>()

  for (const entry of [...cloud, ...local]) {
    const completed =
      merged.get(entry.characterId) ??
      new Set<string>()

    for (const areaId of entry.completedAreaIds) {
      completed.add(areaId)
    }

    merged.set(entry.characterId, completed)
  }

  return [...merged.entries()].map(
    ([characterId, completedAreaIds]) => ({
      characterId,
      completedAreaIds: [...completedAreaIds],
    }),
  )
}

function mergeSavedStudies(
  local: SavedStudy[],
  cloud: SavedStudy[],
) {
  const merged = new Map<string, SavedStudy>()

  for (const study of [...cloud, ...local]) {
    const current = merged.get(study.id)

    if (!current) {
      merged.set(study.id, study)
      continue
    }

    merged.set(study.id, {
      ...(study.savedAt >= current.savedAt
        ? study
        : current),
      completed:
        current.completed || study.completed,
    })
  }

  return [...merged.values()].sort((a, b) =>
    b.savedAt.localeCompare(a.savedAt),
  )
}

export function mergeStudyData(
  local: StudyData,
  cloud: StudyData,
): StudyData {
  return {
    savedCharacters: mergeCharacters(
      local.savedCharacters,
      cloud.savedCharacters,
    ),
    notes: mergeNotes(
      local.notes,
      cloud.notes,
    ),
    progress: mergeProgress(
      local.progress,
      cloud.progress,
    ),
    savedStudies: mergeSavedStudies(
      local.savedStudies,
      cloud.savedStudies,
    ),
  }
}

async function saveCloudStudyData(
  userId: string,
  studyData: StudyData,
) {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured.',
    )
  }

  const { error } = await supabase
    .from('user_study_data')
    .upsert(
      {
        user_id: userId,
        study_data: studyData,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id',
      },
    )

  if (error) {
    throw error
  }
}

export async function syncStudyData(
  userId: string,
): Promise<StudyData> {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured.',
    )
  }

  const localData = getStudyData()

  const {
    data,
    error,
  } = await supabase
    .from('user_study_data')
    .select('study_data')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    await saveCloudStudyData(
      userId,
      localData,
    )

    return localData
  }

  const cloudData = normalizeStudyData(
    data.study_data,
  )

  const mergedData = mergeStudyData(
    localData,
    cloudData,
  )

  replaceStudyData(mergedData)

  await saveCloudStudyData(
    userId,
    mergedData,
  )

  return mergedData
}

export async function uploadCurrentStudyData(
  userId: string,
) {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured.',
    )
  }

  const localData = getStudyData()

  const {
    data,
    error,
  } = await supabase
    .from('user_study_data')
    .select('study_data')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    await saveCloudStudyData(
      userId,
      localData,
    )

    return
  }

  const cloudData = normalizeStudyData(
    data.study_data,
  )

  const mergedData = mergeStudyData(
    localData,
    cloudData,
  )

  replaceStudyData(mergedData)

  await saveCloudStudyData(
    userId,
    mergedData,
  )
}
