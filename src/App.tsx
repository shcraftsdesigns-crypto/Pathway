import { lazy, Suspense } from 'react'
import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'
import Characters from '@/pages/Characters'
import Study from '@/pages/Study'
import MyStudy from '@/pages/MyStudy'
import Bible from '@/pages/Bible'
import BibleBook from '@/pages/BibleBook'
import BibleChapter from '@/pages/BibleChapter'
import NotFound from '@/pages/NotFound'

const loadCharacterProfile = () =>
  import('@/pages/CharacterProfile')

const CharacterProfile = lazy(loadCharacterProfile)

export function preloadCharacterProfile(): void {
  void loadCharacterProfile()
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
          path="404"
          element={<NotFound />}
        />

        <Route
          path="*"
          element={<Navigate to="/404" replace />}
        />
      </Route>
    </Routes>
  )
}
