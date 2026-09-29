import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function MyStudy() {
  usePageTitle('My Study')
  return <EmptyState title="My Study" description="Notes, bookmarks and progress arrive in a later phase." action={<Button to="/characters">Explore Characters</Button>} />
}
