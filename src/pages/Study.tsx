import {
  BookOpen,
  BookmarkCheck,
  Bot,
  Crown,
  Heart,
  Route,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { preloadCharacterProfile } from '@/App'
import {
  getCharacterBySlug,
  preloadCharacterBySlug,
} from '@/lib/characterRepository'
import { searchCharacterSummaries } from '@/lib/characterSearchRepository'
import { collectReferences } from '@/lib/scripture'
import SectionHeader from '@/components/ui/SectionHeader'
import { usePageTitle } from '@/hooks/usePageTitle'
import type { StudyPlanType } from '@/lib/ai/studyPlan'
import { askPathwayAI } from '@/lib/ai/provider'
import type { AIResponse } from '@/lib/ai/types'
import type { CharacterSummary } from '@/types'
import { bibleBooks } from '@/data/bibleBooks'
import { saveGeneratedStudy } from '@/lib/studyStorage'

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
  const [studyType, setStudyType] =
    useState<StudyPlanType>('character')
  const [studySubject, setStudySubject] = useState('')
  const [generatedStudy, setGeneratedStudy] =
    useState<AIResponse | null>(null)
  const [generatingStudy, setGeneratingStudy] =
    useState(false)
  const [studyError, setStudyError] = useState('')
  const [generatedStudySaved, setGeneratedStudySaved] =
    useState(false)
  const [characterChoices, setCharacterChoices] =
    useState<CharacterSummary[]>([])
  const [selectedCharacterSlug, setSelectedCharacterSlug] =
    useState('')

  const preloadCharacter = (slug: string) => {
    preloadCharacterProfile()
    preloadCharacterBySlug(slug)
  }

  const generatePersonalStudy = async () => {
    const rawSubject = studySubject.trim()

    if (!rawSubject || generatingStudy) {
      return
    }

    let subject = rawSubject

    setGeneratingStudy(true)
    setStudyError('')
    setGeneratedStudy(null)
    setGeneratedStudySaved(false)

    if (studyType !== 'character') {
      setCharacterChoices([])
      setSelectedCharacterSlug('')
    }

    const typeLabel =
      studyType === 'character'
        ? 'biblical character'
        : studyType === 'passage'
          ? 'Bible passage'
          : 'biblical topic'

    try {
      let characterContext

      if (studyType === 'character') {
        const matches = await searchCharacterSummaries({
          query: rawSubject,
          testament: null,
          category: null,
        })

        const normalizedInput = rawSubject.toLowerCase()

        const exactMatches = matches.filter((character) => {
          if (character.name.toLowerCase() === normalizedInput) {
            return true
          }

          return (character.alternateNames ?? []).some(
            (alternateName) =>
              alternateName.toLowerCase() === normalizedInput,
          )
        })

        if (exactMatches.length === 0) {
          setCharacterChoices([])
          setSelectedCharacterSlug('')
          setStudyError(
            `No exact Pathway character match was found for "${rawSubject}". Try the character's biblical name.`,
          )
          return
        }

        let matchedCharacter: CharacterSummary

        if (exactMatches.length > 1) {
          const selectedMatch = exactMatches.find(
            (character) =>
              character.slug === selectedCharacterSlug,
          )

          if (!selectedMatch) {
            setCharacterChoices(exactMatches)
            setSelectedCharacterSlug('')
            setStudyError(
              `Pathway found ${exactMatches.length} biblical people named "${rawSubject}". Choose the person you want to study.`,
            )
            return
          }

          matchedCharacter = selectedMatch
        } else {
          matchedCharacter = exactMatches[0]
        }

        setCharacterChoices([])
        setSelectedCharacterSlug('')

        const character = await getCharacterBySlug(
          matchedCharacter.slug,
        )

        if (!character) {
          setStudyError(
            'Pathway could not load that biblical character.',
          )
          return
        }

        subject = character.name
        setStudySubject(character.name)

        characterContext = {
          character,
          verifiedReferences: collectReferences(character),
        }
      } else if (studyType === 'topic') {
        subject = rawSubject
          .toLowerCase()
          .replace(/\b\w/g, (letter) =>
            letter.toUpperCase(),
          )

        setStudySubject(subject)
      }

      const result = await askPathwayAI({
        question:
          `Create a concise personal Bible study about the ${typeLabel} "${subject}". ` +
          'Include what Scripture establishes, careful interpretation, practical reflection, ' +
          'and 3 to 5 reflection questions. Cite relevant Scripture references. ' +
          'Do not invent biblical details or references.',
        contextType:
          studyType === 'character' ? 'character' : 'study',
        character: characterContext,
        study:
          studyType === 'character'
            ? undefined
            : {
                topic: `${studyType}:${subject}`,
              },
      })

      setGeneratedStudy(result)
    } catch {
      setStudyError(
        'Pathway AI could not generate this study right now. Please try again.',
      )
    } finally {
      setGeneratingStudy(false)
    }
  }

  const savePersonalStudy = () => {
    if (!generatedStudy || generatedStudySaved) return

    saveGeneratedStudy({
      type: studyType,
      subject: studySubject.trim(),
      answer: generatedStudy.answer,
      sections: generatedStudy.sections ?? [],
      scriptureCitations: generatedStudy.scriptureCitations,
      limitations: generatedStudy.limitations ?? [],
    })

    setGeneratedStudySaved(true)
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

      <section className="mt-8 rounded-xl border border-line bg-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-accbg p-2.5 text-acc">
              <Bot size={22} aria-hidden="true" />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Study with Pathway AI
              </h2>

              <p className="mt-1 max-w-2xl text-sm text-mute">
                Ask biblical questions, explore characters and passages,
                and create reflection questions with a Scripture-first
                AI study assistant.
              </p>
            </div>
          </div>

          <Link
            to="/ai"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-acc px-4 py-2.5 font-semibold text-white"
          >
            Ask Pathway AI
          </Link>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-line bg-card p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-accbg p-2.5 text-acc">
            <Sparkles size={22} aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Personal Study Generator
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-mute">
              Create a personalized Bible study around a biblical character,
              Bible passage, or topic.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold">
            What would you like to study?
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ['character', 'Character'],
                ['passage', 'Bible Passage'],
                ['topic', 'Topic'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setStudyType(value)
                  setStudySubject('')
                  setGeneratedStudy(null)
                  setStudyError('')
                  setCharacterChoices([])
                  setSelectedCharacterSlug('')
                }}
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                  studyType === value
                    ? 'border-acc bg-accbg text-acc'
                    : 'border-line'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="personal-study-subject"
            className="text-sm font-semibold"
          >
            {studyType === 'character'
              ? 'Biblical character'
              : studyType === 'passage'
                ? 'Bible passage'
                : 'Study topic'}
          </label>

          <input
            id="personal-study-subject"
            type="text"
            value={studySubject}
            onChange={(event) => {
              setStudySubject(event.target.value)
              setCharacterChoices([])
              setSelectedCharacterSlug('')
              setStudyError('')
            }}
            maxLength={120}
            placeholder={
              studyType === 'character'
                ? 'Example: Abraham'
                : studyType === 'passage'
                  ? 'Example: Genesis 12'
                  : 'Example: Faith'
            }
            className="mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3 outline-none focus:border-acc"
          />
        </div>

        {studyType === 'character' &&
          characterChoices.length > 0 && (
            <div className="mt-4 rounded-xl border border-line p-4">
              <p className="text-sm font-semibold">
                Choose the biblical person
              </p>
              <p className="mt-1 text-sm text-mute">
                Pathway keeps people with the same name separate so their
                Scripture references are not combined.
              </p>

              <div className="mt-3 grid gap-2">
                {characterChoices.map((character) => (
                  <label
                    key={character.id}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-line p-3 hover:border-acc"
                  >
                    <input
                      type="radio"
                      name="personal-study-character"
                      value={character.slug}
                      checked={
                        selectedCharacterSlug === character.slug
                      }
                      onChange={() => {
                        setSelectedCharacterSlug(character.slug)
                        setStudyError('')
                      }}
                      className="mt-1"
                    />

                    <span className="min-w-0">
                      <span className="block font-semibold">
                        {character.name}
                      </span>
                      <span className="block text-sm text-mute">
                        {[
                          character.testament,
                          ...character.categories,
                        ].join(' • ')}
                      </span>
                      {character.alternateNames?.length ? (
                        <span className="mt-1 block text-xs text-mute">
                          Also known as:{' '}
                          {character.alternateNames.join(', ')}
                        </span>
                      ) : null}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

        <button
          type="button"
          onClick={generatePersonalStudy}
          disabled={!studySubject.trim() || generatingStudy}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-acc px-4 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles size={18} aria-hidden="true" />
          {generatingStudy
            ? 'Generating study...'
            : 'Generate my study'}
        </button>

        {studyError ? (
          <p
            className="mt-4 text-sm text-red-600"
            role="alert"
          >
            {studyError}
          </p>
        ) : null}

        {generatedStudy ? (
          <div className="mt-6 space-y-5 rounded-xl border border-line bg-bg p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-mute">
                Your personal study
              </p>

              <h3 className="mt-1 text-lg font-semibold">
                {studySubject.trim()}
              </h3>
            </div>

            {generatedStudy.sections?.length ? (
              generatedStudy.sections.map((section, index) => (
                <section
                  key={`${section.heading}-${index}`}
                >
                  <h4 className="font-semibold">
                    {section.heading}
                  </h4>

                  <p className="mt-2 whitespace-pre-wrap leading-7">
                    {section.content}
                  </p>
                </section>
              ))
            ) : (
              <p className="whitespace-pre-wrap leading-7">
                {generatedStudy.answer}
              </p>
            )}

            {generatedStudy.scriptureCitations.length ? (
              <div>
                <p className="text-sm font-semibold">
                  Scripture references
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {generatedStudy.scriptureCitations.map(
                    (citation, index) => {
                      const verses = citation.verseStart
                        ? citation.verseEnd &&
                          citation.verseEnd !== citation.verseStart
                          ? `:${citation.verseStart}–${citation.verseEnd}`
                          : `:${citation.verseStart}`
                        : ''

                      const normalizedBook = citation.book
                        .trim()
                        .toLowerCase()

                      const bibleBook = bibleBooks.find(
                        (book) =>
                          book.name.toLowerCase() === normalizedBook ||
                          book.id.toLowerCase() === normalizedBook,
                      )

                      const referenceLabel =
                        `${citation.book} ${citation.chapter}${verses}`

                      if (!bibleBook) {
                        return (
                          <span
                            key={`${citation.book}-${citation.chapter}-${citation.verseStart ?? 0}-${index}`}
                            className="rounded-full border border-line px-3 py-1.5 text-sm"
                          >
                            {referenceLabel}
                          </span>
                        )
                      }

                      const verseTarget = citation.verseStart
                        ? `?verse=${citation.verseStart}#verse-${citation.verseStart}`
                        : ''

                      return (
                        <Link
                          key={`${citation.book}-${citation.chapter}-${citation.verseStart ?? 0}-${index}`}
                          to={`/bible/${bibleBook.id}/${citation.chapter}${verseTarget}`}
                          className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold hover:border-acc hover:text-acc"
                        >
                          {referenceLabel}
                        </Link>
                      )
                    },
                  )}
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={savePersonalStudy}
                disabled={generatedStudySaved}
                className="inline-flex items-center gap-2 rounded-xl bg-acc px-4 py-2.5 font-semibold text-white disabled:cursor-default disabled:opacity-70"
              >
                <BookmarkCheck size={18} aria-hidden="true" />
                {generatedStudySaved
                  ? 'Saved to My Study'
                  : 'Save to My Study'}
              </button>

              {generatedStudySaved ? (
                <Link
                  to="/my-study"
                  className="text-sm font-semibold text-acc hover:underline"
                >
                  Open My Study
                </Link>
              ) : null}
            </div>

            <p className="text-xs text-mute">
              AI-generated study. Verify interpretations and conclusions
              against Scripture.
            </p>
          </div>
        ) : null}

        <p className="mt-3 text-xs text-mute">
          Pathway AI will distinguish Scripture from interpretation and
          reflection and will avoid presenting unsupported details as
          biblical facts.
        </p>
      </section>

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
