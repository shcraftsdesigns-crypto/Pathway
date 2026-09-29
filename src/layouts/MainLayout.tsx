import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import MobileNavigation from '@/components/layout/MobileNavigation'
import Footer from '@/components/layout/Footer'
import { useTheme } from '@/hooks/useTheme'

export default function MainLayout() {
  const { theme, toggle } = useTheme()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <Navbar theme={theme} onToggleTheme={toggle} />

      <main
        id="main"
        tabIndex={-1}
        className="mx-auto max-w-6xl px-5 py-6 focus:outline-none"
      >
        <Outlet />
      </main>

      <Footer />
      <MobileNavigation />
    </>
  )
}
