import { BookOpen, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import PathwayAIPanel from '@/components/ai/PathwayAIPanel'
import SectionHeader from '@/components/ui/SectionHeader'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function PathwayAI() {
  usePageTitle('Pathway AI')

  return (
    <div>
      <SectionHeader
        title="Pathway AI"
        subtitle="Explore biblical questions, characters, passages, and study ideas with an AI assistant designed around Pathway's Scripture-first approach."
      />

      <div className="mt-6 rounded-xl border border-line bg-accbg p-4">
        <div className="flex gap-3">
          <Sparkles
            size={21}
            className="mt-0.5 shrink-0 text-acc"
            aria-hidden="true"
          />

          <div>
            <p className="font-semibold">
              AI-assisted, Scripture-first study
            </p>

            <p className="mt-1 text-sm text-mute">
              Pathway AI is designed to distinguish what Scripture
              explicitly says from interpretation and reflection.
              AI responses can still make mistakes, so important
              conclusions should be checked against Scripture.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <PathwayAIPanel
          contextType="general"
          title="Ask Pathway AI"
          description="Ask a biblical study question. For stronger contextual answers, you can also use Pathway AI directly from character profiles and Bible chapters."
          suggestions={[
            'Help me begin a character study.',
            'How should I study a Bible passage in context?',
            'Create reflection questions for my Bible study.',
          ]}
        />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          to="/characters"
          className="card group"
        >
          <Users
            size={22}
            className="text-acc"
            aria-hidden="true"
          />

          <h2 className="mt-3 text-lg font-semibold">
            Character Assistant
          </h2>

          <p className="mt-1 text-sm text-mute">
            Open a biblical character to ask questions using that
            character's verified Pathway information.
          </p>

          <span className="mt-4 inline-block font-semibold text-acc">
            Browse characters →
          </span>
        </Link>

        <Link
          to="/bible"
          className="card group"
        >
          <BookOpen
            size={22}
            className="text-acc"
            aria-hidden="true"
          />

          <h2 className="mt-3 text-lg font-semibold">
            Bible Assistant
          </h2>

          <p className="mt-1 text-sm text-mute">
            Open a Bible chapter to ask questions using the actual
            Scripture text loaded in Pathway.
          </p>

          <span className="mt-4 inline-block font-semibold text-acc">
            Open Bible →
          </span>
        </Link>
      </div>
    </div>
  )
}
