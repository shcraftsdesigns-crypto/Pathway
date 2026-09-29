import type { ScriptureReference } from '@/types'
import { formatReference } from '@/lib/scripture'

interface Props { reference: ScriptureReference; compact?: boolean }

export default function ScriptureReferenceCard({ reference, compact }: Props) {
  if (compact) return <span className="tag">{formatReference(reference)}</span>
  return <div className="card"><span className="text-sm text-mute">Scripture</span><p className="font-semibold">{formatReference(reference)}</p></div>
}
