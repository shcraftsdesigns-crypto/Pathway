import { Link } from 'react-router-dom'
import { BookOpen, Anchor, Crown, Flag, Flower2, Mail, Scale, Sparkles, Tent, type LucideIcon } from 'lucide-react'
import type { CharacterCategory } from '@/types'

const ICONS: Record<CharacterCategory, LucideIcon> = {
  Kings: Crown, Prophets: Sparkles, Women: Flower2, Apostles: Mail, Disciples: Anchor, Leaders: Flag, Patriarchs: Tent, Judges: Scale, Other: BookOpen,
}

export default function CategoryCard({ category }: { category: CharacterCategory }) {
  const Icon = ICONS[category]
  return (
    <Link to={`/characters?category=${category}`} className="card flex items-center gap-3 hover:border-acc">
      <Icon className="text-acc" aria-hidden="true" /><strong>{category}</strong>
    </Link>
  )
}
