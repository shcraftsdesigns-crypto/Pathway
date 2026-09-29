import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props { to: string; variant?: 'primary' | 'secondary'; children: ReactNode }

export default function Button({ to, variant = 'primary', children }: Props) {
  const styles = variant === 'primary' ? 'bg-acc text-on' : 'border border-line text-ink'
  return <Link to={to} className={`inline-block rounded-xl px-5 py-3 font-semibold ${styles}`}>{children}</Link>
}
