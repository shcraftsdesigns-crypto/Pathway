import { useEffect } from 'react'

const BASE = 'Pathway — Biblical Character Study'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — Pathway` : BASE
  }, [title])
}
