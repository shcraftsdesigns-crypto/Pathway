import type { ScriptureReference } from '@/types'
import { formatReference } from '@/lib/scripture'

interface StudyAreaCardProps {
  title: string
  description: string
  references: ScriptureReference[]
}

export default function StudyAreaCard({
  title,
  description,
  references,
}: StudyAreaCardProps) {
  return (
    <div className="card">
      <h3 className="text-lg">{title}</h3>
      <p className="mt-2 text-sm text-mute">{description}</p>

      {references.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-mute">
            Read in Scripture
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {references.slice(0, 6).map((reference) => (
              <span key={formatReference(reference)} className="tag">
                {formatReference(reference)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
