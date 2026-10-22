import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  to: string
  variant?: 'primary' | 'secondary'
  children: ReactNode
  onIntent?: () => void
}

export default function Button({
  to,
  variant = 'primary',
  children,
  onIntent,
}: Props) {
  const styles =
    variant === 'primary'
      ? 'bg-acc text-on'
      : 'border border-line text-ink'

  return (
    <Link
      to={to}
      onMouseEnter={onIntent}
      onFocus={onIntent}
      onTouchStart={onIntent}
      className={`inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-3 font-semibold transition-[transform,background-color,border-color,color] hover:brightness-95 active:scale-[0.98] ${styles}`}
    >
      {children}
    </Link>
  )
}
