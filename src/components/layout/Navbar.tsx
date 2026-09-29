import { Link, NavLink } from 'react-router-dom'
import { Moon, Search, Sun, User } from 'lucide-react'
import Logo from './Logo'
import { NAV_ITEMS } from '@/lib/navigation'

interface Props { theme: 'light' | 'dark'; onToggleTheme: () => void }

const iconBtn = 'inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full border border-line px-3'

export default function Navbar({ theme, onToggleTheme }: Props) {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
        <Logo />
        <nav aria-label="Main" className="ml-4 hidden gap-1 md:flex">
          {NAV_ITEMS.map(({ label, to }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => `rounded-lg px-3 py-1.5 font-medium ${isActive ? 'bg-accbg text-acc' : 'text-mute'}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex-1" />
        <Link to="/characters?focus=1" className={iconBtn} aria-label="Search characters">
          <Search size={18} aria-hidden="true" /><span className="hidden text-mute sm:inline">Search</span>
        </Link>
        <button type="button" onClick={onToggleTheme} className={iconBtn} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button type="button" className={iconBtn} aria-label="Profile (coming soon)" title="Profile — coming soon"><User size={18} /></button>
      </div>
    </header>
  )
}
