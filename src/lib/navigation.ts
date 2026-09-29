import { BookOpen, Bookmark, Home, Users } from 'lucide-react'

export const NAV_ITEMS = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Characters', to: '/characters', icon: Users },
  { label: 'Study', to: '/study', icon: BookOpen },
  { label: 'My Study', to: '/my-study', icon: Bookmark },
] as const
