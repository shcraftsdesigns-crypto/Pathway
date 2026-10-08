import {
  BookOpen,
  Crown,
  Heart,
  Route,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { preloadCharacterProfile } from '@/App'
import { preloadCharacterBySlug } from '@/lib/characterRepository'
import SectionHeader from '@/components/ui/SectionHeader'
import { usePageTitle } from '@/hooks/usePageTitle'

interface GuidedStudy {
  id: string
  title: string
  description: string
  characters: {
    name: string
    slug: string
  }[]
  icon: typeof BookOpen
}

const GUIDED_STUDIES: GuidedStudy[] = [
  {
    id: 'patriarchs',
    title: 'Patriarchs',
    description:
      'Study major figures connected with the beginnings and development of Israel.',
    icon: Users,
    characters: [
      { name: 'Abraham', slug: 'abraham' },
      { name: 'Isaac', slug: 'isaac' },
      { name: 'Jacob', slug: 'jacob' },
      { name: 'Joseph', slug: 'joseph' },
    ],
  },
  {
    id: 'exodus-leadership',
    title: 'Exodus & Leadership',
    description:
      'Follow key people connected with Israel’s deliverance, wilderness journey, and entrance into the land.',
    icon: Route,
    characters: [
      { name: 'Moses', slug: 'moses' },
      { name: 'Aaron', slug: 'aaron' },
      { name: 'Miriam', slug: 'miriam-1' },
      { name: 'Joshua', slug: 'joshua' },
    ],
  },
  {
    id: 'kings',
    title: 'Kings of Israel & Judah',
    description:
      'Explore selected rulers and study their lives through their verified character profiles.',
    icon: Crown,
    characters: [
      { name: 'Saul', slug: 'saul-1' },
      { name: 'David', slug: 'david' },
      { name: 'Solomon', slug: 'solomon' },
      { name: 'Hezekiah', slug: 'hezekiah' },
      { name: 'Josiah', slug: 'josiah' },
    ],
  },
  {
    id: 'prophets',
    title: 'Prophets',
    description:
      'Study selected prophetic figures and the Scripture passages connected with them.',
    icon: Sparkles,
    characters: [
      { name: 'Samuel', slug: 'samuel-2' },
      { name: 'Elijah', slug: 'elijah' },
      { name: 'Elisha', slug: 'elisha' },
      { name: 'Isaiah', slug: 'isaiah' },
      { name: 'Jeremiah', slug: 'jeremiah-6' },
      { name: 'Daniel', slug: 'daniel' },
    ],
  },
  {
    id: 'faithful-women',
    title: 'Women in Scripture',
    description:
      'Explore selected women through their individual biblical character studies.',
    icon: Heart,
    characters: [
      { name: 'Sarah', slug: 'sarah' },
      { name: 'Ruth', slug: 'ruth' },
      { name: 'Esther', slug: 'esther' },
      { name: 'Deborah', slug: 'deborah-2' },
      { name: 'Hannah', slug: 'hannah' },
    ],
  },
  {
    id: 'jesus-disciples',
    title: 'Jesus & His Disciples',
    description:
      'Begin with Jesus Christ, then explore selected disciples and apostles.',
    icon: BookOpen,
    characters: [
      { name: 'Jesus', slug: 'jesus' },
      { name: 'Peter', slug: 'peter' },
      { name: 'John', slug: 'john-son-of-zebedee' },
      { name: 'Paul', slug: 'paul' },
    ],
  },
]

export default function Study() {
  const preloadCharacter = (slug: string) => {
    preloadCharacterProfile()
    preloadCharacterBySlug(slug)
  }

  usePageTitle('Guided Studies')

  return (
    <div>
      <SectionHeader
        title="Guided Studies"
        subtitle="Choose a study pathway, open a character, read the connected Scripture references, take notes, and track your progress."
      />

      <div className="mt-6 rounded-xl border border-line bg-accbg p-4">
        <div className="flex gap-3">
          <Shield
            size={21}
            className="mt-0.5 shrink-0 text-acc"
            aria-hidden="true"
          />
          <p className="text-sm">
            These pathways organize character studies for easier exploration.
            Biblical details and Scripture references remain grounded in each
            character’s verified profile.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {GUIDED_STUDIES.map((study) => {
          const Icon = study.icon

          return (
            <section
              key={study.id}
              className="card flex flex-col"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-accbg p-2.5 text-acc">
                  <Icon size={22} aria-hidden="true" />
                </div>

                <div>
                  <h2 className="text-xl">
                    {study.title}
                  </h2>
                  <p className="mt-1 text-sm text-mute">
                    {study.description}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-mute">
                  Characters in this study
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {study.characters.map((character) => (
                    <Link
                      key={character.slug}
                      to={`/characters/${character.slug}`}
                      onMouseEnter={() => preloadCharacter(character.slug)}
                      onFocus={() => preloadCharacter(character.slug)}
                      onTouchStart={() => preloadCharacter(character.slug)}
                      onPointerDown={() => preloadCharacter(character.slug)}
                      className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold hover:border-acc hover:text-acc"
                    >
                      {character.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to={`/characters/${study.characters[0].slug}`}
                  onMouseEnter={() =>
                    preloadCharacter(study.characters[0].slug)
                  }
                  onFocus={() =>
                    preloadCharacter(study.characters[0].slug)
                  }
                  onTouchStart={() =>
                    preloadCharacter(study.characters[0].slug)
                  }
                  onPointerDown={() =>
                    preloadCharacter(study.characters[0].slug)
                  }
                className="mt-6 inline-flex items-center gap-2 self-start font-semibold text-acc"
              >
                <BookOpen size={17} aria-hidden="true" />
                Start study
              </Link>
            </section>
          )
        })}
      </div>

      <section className="py-10">
        <div className="card">
          <h2 className="text-xl">
            Build your own character study
          </h2>

          <p className="mt-2 max-w-2xl text-sm text-mute">
            Pathway includes thousands of named biblical people. Explore the
            complete character collection, save the people you want to study,
            record personal notes, and mark study areas as completed.
          </p>

          <Link
            to="/characters"
            className="mt-5 inline-flex items-center gap-2 font-semibold text-acc"
          >
            Explore all characters →
          </Link>
        </div>
      </section>
    </div>
  )
}
