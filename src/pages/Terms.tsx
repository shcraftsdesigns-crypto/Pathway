import InfoPage, { InfoSection } from '@/components/ui/InfoPage'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function Terms() {
  usePageTitle('Terms')

  return (
    <InfoPage
      title="Terms of Use"
      subtitle="Basic conditions for using Pathway."
    >
      <InfoSection title="Purpose">
        <p>
          Pathway is a Bible study and educational tool. It provides biblical
          character information, Scripture navigation, study features, and
          AI-assisted study tools.
        </p>
      </InfoSection>

      <InfoSection title="Accuracy and AI">
        <p>
          Pathway is designed to prioritize Scripture and verified study data,
          but software and AI-generated responses can contain errors. Users
          should verify important claims by reading the cited Scripture in
          context.
        </p>
      </InfoSection>

      <InfoSection title="Accounts">
        <p>
          You are responsible for maintaining the security of your account and
          for activity performed through it. Do not attempt to access another
          user's account or private study information.
        </p>
      </InfoSection>

      <InfoSection title="Acceptable use">
        <p>
          Do not misuse Pathway, attempt to disrupt the service, bypass
          security controls, abuse automated features, or use the service in a
          way that violates applicable law or the rights of others.
        </p>
      </InfoSection>

      <InfoSection title="Shared content">
        <p>
          If you create and distribute a public study link, you are responsible
          for deciding who receives that link. Public shared studies should not
          be used to publish private or sensitive information.
        </p>
      </InfoSection>

      <InfoSection title="Availability">
        <p>
          Features may change, be improved, or occasionally become unavailable.
          Internet-dependent features such as AI assistance, authentication,
          and cloud synchronization require network access and their supporting
          services.
        </p>
      </InfoSection>

      <p className="text-sm text-mute">Last updated: October 22, 2026.</p>
    </InfoPage>
  )
}
