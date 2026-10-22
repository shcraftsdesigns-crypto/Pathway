import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '@/lib/navigation'

export default function MobileNavigation() {
  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
        <NavLink key={to} to={to} end={to === '/'}
          className={({ isActive }) =>
            `flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-xs transition-colors ${
              isActive
                ? 'bg-accbg/60 font-medium text-acc'
                : 'text-mute hover:text-ink'
            }`
          }>
          <Icon size={20} aria-hidden="true" />{label}
        </NavLink>
      ))}
    </nav>
  )
}
