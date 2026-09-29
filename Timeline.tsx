import type { TimelineEvent } from '@/types'
import TimelineItem from './TimelineItem'

export default function Timeline({ events }: { events: TimelineEvent[] }) {
  return <ol className="ml-2 border-l-2 border-line pl-5">{events.map((e) => <TimelineItem key={e.id} event={e} />)}</ol>
}
