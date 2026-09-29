import { Route, Routes } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'
import Characters from '@/pages/Characters'
import CharacterProfile from '@/pages/CharacterProfile'
import Study from '@/pages/Study'
import MyStudy from '@/pages/MyStudy'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="characters" element={<Characters />} />
        <Route path="characters/:slug" element={<CharacterProfile />} />
        <Route path="study" element={<Study />} />
        <Route path="my-study" element={<MyStudy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
