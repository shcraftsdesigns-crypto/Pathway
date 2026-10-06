interface Props<T extends string> { label: string; options: readonly T[]; value: T | null; onChange: (v: T | null) => void }

export default function FilterChips<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap gap-2 py-1"
    >
      {options.map((o) => (
        <button key={o} type="button" aria-pressed={value === o} onClick={() => onChange(value === o ? null : o)}
          className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm ${value === o ? 'border-acc bg-acc text-on' : 'border-line bg-card'}`}>
          {o}
        </button>
      ))}
    </div>
  )
}
