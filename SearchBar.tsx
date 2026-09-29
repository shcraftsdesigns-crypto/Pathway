import { useEffect, useRef } from 'react'

interface Props { value: string; onChange: (v: string) => void; autoFocus?: boolean }

export default function SearchBar({ value, onChange, autoFocus }: Props) {
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => { if (autoFocus) input.current?.focus() }, [autoFocus])
  return (
    <div>
      <label htmlFor="character-search" className="mb-1 block text-sm text-mute">Search by name, category or testament</label>
      <input id="character-search" ref={input} type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search characters..." autoComplete="off"
        className="w-full rounded-xl border border-line bg-card px-4 py-3.5 text-ink" />
    </div>
  )
}
