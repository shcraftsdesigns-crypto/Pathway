import { lazy, Suspense } from 'react'
import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'

const Characters = lazy(() => import('@/pages/Characters'))
const Study = lazy(() => import('@/pages/Study'))
const MyStudy = lazy(() => import('@/pages/MyStudy'))
const Bible = lazy(() => import('@/pages/Bible'))
const BibleBook = lazy(() => import('@/pages/BibleBook'))
const BibleChapter = lazy(() => import('@/pages/BibleChapter'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const PathwayAI = lazy(() => import('@/pages/PathwayAI'))
const SharedStudy = lazy(() => import('@/pages/SharedStudy'))
const Account = lazy(() => import('@/pages/Account'))
const About = lazy(() => import('@/pages/About'))
const Help = lazy(() => import('@/pages/Help'))
const Privacy = lazy(() => import('@/pages/Privacy'))
const Terms = lazy(() => import('@/pages/Terms'))

const loadCharacterProfile = () =>
  import('@/pages/CharacterProfile')

const CharacterProfile = lazy(loadCharacterProfile)

export function preloadCharacterProfile(): void {
  void loadCharacterProfile()
}

function PageLoader() {
  return <div className="min-h-24" aria-hidden="true" />
}

function ProfileLoader() {
  return (
    <div
      role="status"
      className="py-12 text-center text-mute"
    >
      Loading character…
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
        <Route index element={<Home />} />

        <Route
          path="characters"
          element={<Characters />}
        />

        <Route
          path="characters/:slug"
          element={
            <Suspense fallback={<ProfileLoader />}>
              <CharacterProfile />
            </Suspense>
          }
        />

        <Route
          path="study"
          element={<Study />}
        />

        <Route
          path="my-study"
          element={<MyStudy />}
        />

        <Route
          path="bible"
          element={<Bible />}
        />

        <Route
          path="bible/:bookId"
          element={<BibleBook />}
        />

        <Route
          path="bible/:bookId/:chapter"
          element={<BibleChapter />}
        />

        <Route
          path="ai"
          element={<PathwayAI />}
        />

        <Route
          path="shared-study/:id"
          element={<SharedStudy />}
        />

        <Route
          path="account"
          element={<Account />}
        />

        <Route path="about" element={<About />} />
        <Route path="help" element={<Help />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />

        <Route
          path="404"
          element={<NotFound />}
        />

        <Route
          path="*"
          element={<Navigate to="/404" replace />}
        />
        </Route>
      </Routes>
    </Suspense>
  )
}
