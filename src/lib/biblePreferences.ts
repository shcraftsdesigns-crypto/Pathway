const TRANSLATION_KEY = 'pathway-bible-translation'

export function getPreferredBibleTranslation():
  | string
  | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage.getItem(TRANSLATION_KEY)
  } catch {
    return null
  }
}

export function setPreferredBibleTranslation(
  translationId: string,
): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(
      TRANSLATION_KEY,
      translationId,
    )
  } catch {
    // Reading the Bible should still work if storage is unavailable.
  }
}
