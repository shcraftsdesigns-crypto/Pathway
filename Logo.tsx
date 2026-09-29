import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

export default function Logo() {
  return (
    <Link to="/" aria-label="Pathway home" className="flex items-center gap-2 font-serif text-xl font-semibold">
      <BookOpen className="text-acc" size={26} aria-hidden="true" />
      Pathway
    </Link>
  )
}
