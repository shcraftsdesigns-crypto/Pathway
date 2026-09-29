import type { BiblicalCharacter, ScriptureReference } from '@/types'

export const ref = (book: string, chapter: number, verseStart?: number, verseEnd?: number): ScriptureReference => ({ book, chapter, verseStart, verseEnd })

export function formatReference(r: ScriptureReference): string {
  if (r.verseStart == null) return `${r.book} ${r.chapter}`
  return `${r.book} ${r.chapter}:${r.verseStart}${r.verseEnd ? `–${r.verseEnd}` : ''}`
}

/** Key scriptures plus every timeline reference, de-duplicated. */
export function collectReferences(c: BiblicalCharacter): ScriptureReference[] {
  const all = [...c.keyScriptures, ...(c.timeline ?? []).flatMap((e) => e.scriptureReferences)]
  return all.filter((r, i) => all.findIndex((x) => formatReference(x) === formatReference(r)) === i)
}
