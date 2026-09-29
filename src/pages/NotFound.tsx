import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Page not found')
  return <EmptyState title="Page not found" description="That page does not exist." action={<Button to="/characters">Explore Characters</Button>} />
}
