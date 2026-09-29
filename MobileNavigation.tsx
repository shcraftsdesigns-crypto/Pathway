import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '@/lib/navigation'

export default function MobileNavigation() {
  return (
    <nav aria-label="Mobile" className="fixed inset-x-0 bottom-0 z-10 flex border-t border-line bg-bg pb-[env(safe-area-inset-bottom)] md:hidden">
      {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
        <NavLink key={to} to={to} end={to === '/'}
          className={({ isActive }) => `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${isActive ? 'text-acc' : 'text-mute'}`}>
          <Icon size={20} aria-hidden="true" />{label}
        </NavLink>
      ))}
    </nav>
  )
}
