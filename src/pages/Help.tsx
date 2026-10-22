import { Link } from 'react-router-dom'
import InfoPage, { InfoSection } from '@/components/ui/InfoPage'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function Help() {
  usePageTitle('Help')

  return (
    <InfoPage
      title="Help"
      subtitle="A quick guide to studying with Pathway."
    >
      <InfoSection title="Find a biblical character">
        <p>
          Open Characters and search by name. Select a result to open the
          character profile and explore the available Scripture-based study
          information.
        </p>
        <Link className="font-semibold text-acc hover:underline" to="/characters">
          Go to Characters
        </Link>
      </InfoSection>

      <InfoSection title="Read Scripture">
        <p>
          Use the Bible section to choose a book and chapter. Scripture
          references throughout Pathway can also take you directly to relevant
          Bible passages.
        </p>
        <Link className="font-semibold text-acc hover:underline" to="/bible">
          Open the Bible
        </Link>
      </InfoSection>

      <InfoSection title="Save your study">
        <p>
          My Study keeps your saved characters, generated studies, notes, and
          study progress. When you are signed in, supported study data can sync
          with your Pathway account so it can be available on another device.
        </p>
        <Link className="font-semibold text-acc hover:underline" to="/my-study">
          Open My Study
        </Link>
      </InfoSection>

      <InfoSection title="Use Pathway AI carefully">
        <p>
          Pathway AI is designed for Scripture-focused assistance. AI can still
          make mistakes, so important claims should be checked against the
          Scripture references provided and the biblical text itself.
        </p>
        <Link className="font-semibold text-acc hover:underline" to="/ai">
          Open Pathway AI
        </Link>
      </InfoSection>

      <InfoSection title="Account and sync">
        <p>
          Use Account to sign in, create an account, recover your password, or
          check Cloud Sync status. You can continue using local study features
          without signing in, but account-based sync requires an internet
          connection.
        </p>
        <Link className="font-semibold text-acc hover:underline" to="/account">
          Open Account
        </Link>
      </InfoSection>
    </InfoPage>
  )
}
