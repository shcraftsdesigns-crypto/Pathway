import type { ReactNode } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'

interface Props {
  title: string
  subtitle: string
  children: ReactNode
}

export default function InfoPage({ title, subtitle, children }: Props) {
  return (
    <div className="mx-auto max-w-3xl py-4">
      <SectionHeader title={title} subtitle={subtitle} as="h1" />
      <div className="mt-8 space-y-8">{children}</div>
    </div>
  )
}

export function InfoSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="card">
      <h2 className="text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-mute">
        {children}
      </div>
    </section>
  )
}
