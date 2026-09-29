import type { TimelineEvent } from '@/types'
import ScriptureReferenceCard from './ScriptureReferenceCard'
import { formatReference } from '@/lib/scripture'

export default function TimelineItem({ event }: { event: TimelineEvent }) {
  return (
    <li className="relative pb-6 pl-4 before:absolute before:-left-[28px] before:top-1.5 before:h-3.5 before:w-3.5 before:rounded-full before:border-[3px] before:border-bg before:bg-acc">
      <h3 className="text-lg">{event.title}</h3>
      <p>{event.description}</p>
      <div className="mt-1 flex flex-wrap gap-2">{event.scriptureReferences.map((r) => <ScriptureReferenceCard key={formatReference(r)} reference={r} compact />)}</div>
    </li>
  )
}
