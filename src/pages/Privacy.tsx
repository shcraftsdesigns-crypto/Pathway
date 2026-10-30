import InfoPage, { InfoSection } from '@/components/ui/InfoPage'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function Privacy() {
  usePageTitle('Privacy')

  return (
    <InfoPage
      title="Privacy"
      subtitle="How Pathway handles study and account information."
    >
      <InfoSection title="Study information">
        <p>
          Pathway can store study information such as saved characters,
          generated studies, personal notes, and study progress. Some study
          information may be stored locally in your browser. When you sign in
          and Cloud Sync is available, supported study information may also be
          stored with your account for synchronization across devices.
        </p>
      </InfoSection>

      <InfoSection title="Accounts">
        <p>
          If you create an account, authentication information is handled by
          Pathway's authentication service. Pathway uses your authenticated
          account identity to keep cloud study data associated with your
          account.
        </p>
      </InfoSection>

      <InfoSection title="Shared studies">
        <p>
          When you choose to create a public study link, the generated study
          content and its Scripture references can be included in the shared
          copy. Personal notes and study progress are not included in the
          public shared-study copy.
        </p>
        <p>
          Anyone who receives a working public share link may be able to view
          the shared study, so only share links with people you intend to give
          access to that content.
        </p>
      </InfoSection>

      <InfoSection title="AI requests">
        <p>
          Information needed to answer a Pathway AI request may be sent to the
          AI service used by Pathway. Do not enter passwords, secret keys,
          financial information, or other highly sensitive personal information
          into AI prompts.
        </p>
      </InfoSection>

      <InfoSection title="Your device">
        <p>
          Pathway may use browser storage and caching to remember preferences,
          support saved study features, and provide the installable app
          experience. Clearing browser or app data may remove information that
          exists only on that device.
        </p>
      </InfoSection>

            <InfoSection title="Advertising, cookies, and similar technologies">
        <p>
          Pathway may use third-party advertising services, including Google
          AdSense on the website and, where available, Google AdMob in the
          Android application. These services may use cookies, device or app
          identifiers, IP addresses, and similar technologies to provide,
          measure, personalize, and improve advertising.
        </p>
        <p>
          Third-party vendors, including Google, may use advertising cookies
          or similar technologies to serve ads based on a user's visits to
          Pathway or other websites and apps. Where personalized advertising
          is available, users may be provided with controls for managing their
          advertising preferences.
        </p>
      </InfoSection>

      <InfoSection title="Advertising consent and choices">
        <p>
          Where required by applicable law, Pathway will request consent before
          using cookies or similar technologies for advertising or processing
          personal data for personalized advertising. Users in regions where
          consent requirements apply may be offered choices regarding
          personalized advertising, non-personalized advertising, and related
          data processing through an appropriate consent management platform.
        </p>
        <p>
          Third-party advertising providers process information according to
          their own privacy policies and provide their own privacy and
          advertising controls.
        </p>
      </InfoSection>

      <p className="text-sm text-mute">Last updated: October 30, 2026.</p>
    </InfoPage>
  )
}
