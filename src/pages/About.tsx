import { Link } from 'react-router-dom'
import InfoPage, { InfoSection } from '@/components/ui/InfoPage'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function About() {
  usePageTitle('About')

  return (
    <InfoPage
      title="About Pathway"
      subtitle="A Scripture-focused tool for studying the people of the Bible."
    >
      <InfoSection title="Why Pathway exists">
        <p>
          Pathway helps people study biblical characters in a structured way:
          their stories, relationships, decisions, struggles, victories,
          failures, and the lessons that can be drawn from Scripture.
        </p>
      </InfoSection>

      <InfoSection title="Scripture first">
        <p>
          Pathway is designed to keep biblical study grounded in Scripture.
          Character profiles and AI-assisted study features are intended to
          support Bible study, not replace careful reading of the biblical text.
        </p>
        <p>
          Where interpretation or reflection is offered, it should be
          distinguished from what Scripture explicitly states.
        </p>
      </InfoSection>

      <InfoSection title="Explore Pathway">
        <p>
          You can browse biblical characters, read the Bible, create and save
          studies, keep personal notes, and use Pathway AI for Scripture-focused
          study assistance.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link className="font-semibold text-acc hover:underline" to="/characters">
            Explore characters
          </Link>
          <Link className="font-semibold text-acc hover:underline" to="/bible">
            Read the Bible
          </Link>
        </div>
      </InfoSection>
    </InfoPage>
  )
}
