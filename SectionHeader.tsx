interface Props { title: string; subtitle?: string; as?: 'h1' | 'h2' }

export default function SectionHeader({ title, subtitle, as: Tag = 'h2' }: Props) {
  return (
    <div className="mb-4">
      <Tag className={Tag === 'h1' ? 'text-3xl md:text-4xl' : 'text-2xl'}>{title}</Tag>
      {subtitle && <p className="mt-1 text-mute">{subtitle}</p>}
    </div>
  )
}
