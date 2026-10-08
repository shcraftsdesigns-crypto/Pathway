import { Check, Circle } from 'lucide-react'
import type { ScriptureReference } from '@/types'
import { formatReference } from '@/lib/scripture'

interface StudyAreaCardProps {
  title: string
  description: string
  references: ScriptureReference[]
  completed?: boolean
  onToggleComplete?: () => void
}

export default function StudyAreaCard({
  title,
  description,
  references,
  completed = false,
  onToggleComplete,
}: StudyAreaCardProps) {
  return (
    <div className="card flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg">{title}</h3>

        {onToggleComplete && (
          <button
            type="button"
            onClick={onToggleComplete}
            className="shrink-0 rounded-lg p-1.5 text-acc hover:bg-accbg"
            aria-label={
              completed
                ? `Mark ${title} incomplete`
                : `Mark ${title} complete`
            }
            title={
              completed
                ? 'Mark incomplete'
                : 'Mark complete'
            }
          >
            {completed ? (
              <Check size={20} aria-hidden="true" />
            ) : (
              <Circle size={20} aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      <p className="mt-2 text-sm text-mute">
        {description}
      </p>

      {references.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-mute">
            Read in Scripture
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {references.slice(0, 6).map((reference) => (
              <span
                key={formatReference(reference)}
                className="tag"
              >
                {formatReference(reference)}
              </span>
            ))}
          </div>
        </div>
      )}

      {onToggleComplete && (
        <button
          type="button"
          onClick={onToggleComplete}
          className="mt-5 self-start text-sm font-semibold text-acc"
        >
          {completed
            ? '✓ Completed'
            : 'Mark as completed'}
        </button>
      )}
    </div>
  )
}
