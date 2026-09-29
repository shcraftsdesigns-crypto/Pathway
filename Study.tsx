import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function Study() {
  usePageTitle('Guided Studies')
  return <EmptyState title="Guided Studies" description="Structured study plans arrive in a later phase." action={<Button to="/characters">Explore Characters</Button>} />
}
