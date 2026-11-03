import InfoPage, {
  InfoSection,
} from '@/components/ui/InfoPage'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function DeleteAccount() {
  usePageTitle('Delete Account')

  return (
    <InfoPage
      title="Delete Your Pathway Account"
      subtitle="How to permanently delete your Pathway account and associated cloud study data."
    >
      <InfoSection title="Delete your account in Pathway">
        <p>
          If you are signed in to your Pathway account,
          you can permanently delete your account from
          the Account page.
        </p>

        <ol className="list-decimal space-y-2 pl-5">
          <li>Sign in to your Pathway account.</li>
          <li>Open the Account page.</li>
          <li>Choose Delete account.</li>
          <li>Confirm that you want to delete the account.</li>
          <li>
            Type DELETE when asked for final confirmation.
          </li>
        </ol>

        <p>
          Account deletion is permanent and cannot be
          undone.
        </p>
      </InfoSection>

      <InfoSection title="What is deleted">
        <p>
          Deleting your Pathway account removes your
          Pathway account and cloud study data associated
          with that account, including supported saved
          study information synchronized through Cloud
          Sync.
        </p>
      </InfoSection>

      <InfoSection title="Data stored on your device">
        <p>
          Pathway may also store study information locally
          on your device or in your browser. Account
          deletion clears Pathway's local browser storage
          on the device used to complete the deletion.
          Information stored separately on another device
          may remain there until that device's local app
          or browser data is cleared.
        </p>
      </InfoSection>

      <InfoSection title="If you cannot access your account">
        <p>
          If you cannot sign in to your Pathway account,
          use the password recovery option on the Account
          page to regain access before requesting deletion.
        </p>
      </InfoSection>

      <InfoSection title="Important">
        <p>
          Deleting the Pathway application from your
          device does not by itself delete your Pathway
          account. Use the account deletion process above
          to permanently delete your account.
        </p>
      </InfoSection>

      <p className="text-sm text-mute">
        Last updated: November 3, 2026.
      </p>
    </InfoPage>
  )
}