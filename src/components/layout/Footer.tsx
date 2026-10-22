import { Link } from 'react-router-dom'

const links = [
  ['About', '/about'],
  ['Help', '/help'],
  ['Privacy', '/privacy'],
  ['Terms', '/terms'],
] as const

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-lg font-semibold">Pathway</p>
            <p className="mt-1 text-sm text-mute">
              Scripture-focused biblical character study.
            </p>
          </div>

          <nav
            aria-label="Information"
            className="flex flex-wrap gap-x-5 gap-y-3 text-sm"
          >
            {links.map(([label, to]) => (
              <Link
                key={to}
                to={to}
                className="min-h-11 content-center text-mute transition-colors hover:text-acc"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-5 border-t border-line pt-5 text-xs text-mute">
          © {new Date().getFullYear()} Pathway. Study Scripture carefully and
          verify AI-assisted answers against the biblical text.
        </p>
      </div>
    </footer>
  )
}
