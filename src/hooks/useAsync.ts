import { useEffect, useState } from 'react'

/** Minimal async loader: keeps the previous data while reloading, exposes loading and error. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  useEffect(() => {
    let live = true
    setLoading(true)
    setError(null)
    fn()
      .then((d) => { if (live) setData(d) })
      .catch((e: unknown) => { if (live) setError(e instanceof Error ? e : new Error(String(e))) })
      .finally(() => { if (live) setLoading(false) })
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return { data, loading, error }
}
