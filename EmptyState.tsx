import type { ReactNode } from 'react'

interface Props { title: string; description?: string; action?: ReactNode }

export default function EmptyState({ title, description, action }: Props) {
  return (
    <div className="py-12 text-center">
      <h2 className="text-2xl">{title}</h2>
      {description && <p className="mt-2 text-mute">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
