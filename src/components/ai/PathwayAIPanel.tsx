import { FormEvent, useId, useState } from 'react'
import { Bot, Send, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { askPathwayAI } from '@/lib/ai/provider'
import { getBibleChapter } from '@/lib/bibleService'
import { findBiblePassage } from '@/lib/bibleReference'
import { bibleBooks } from '@/data/bibleBooks'
import type {
  AIBibleContext,
  AICharacterContext,
  AIContextType,
  AIResponse,
  AIStudyContext,
} from '@/lib/ai/types'

interface PathwayAIPanelProps {
  contextType?: AIContextType
  character?: AICharacterContext
  bible?: AIBibleContext
  study?: AIStudyContext
  title?: string
  description?: string
  suggestions?: string[]
}

function cleanAIText(value: string) {
  return value
    .replace(/&#x20;/gi, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/^\\-\s?/gm, '- ')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function getCitationBookId(bookName: string) {
  const normalized = bookName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

  return bibleBooks.find(
    (book) =>
      book.name.toLowerCase() === normalized,
  )?.id
}

function getCitationLabel(
  book: string,
  chapter: number,
  verseStart?: number,
  verseEnd?: number,
) {
  if (!verseStart) {
    return `${book} ${chapter}`
  }

  if (verseEnd && verseEnd !== verseStart) {
    return `${book} ${chapter}:${verseStart}–${verseEnd}`
  }

  return `${book} ${chapter}:${verseStart}`
}

const DEFAULT_SUGGESTIONS = [
  'What does Scripture explicitly say?',
  'What should I study next?',
  'Give me reflection questions.',
]

export default function PathwayAIPanel({
  contextType = 'general',
  character,
  bible,
  study,
  title = 'Ask Pathway AI',
  description = 'Ask a Bible-study question and explore Scripture with Pathway.',
  suggestions = DEFAULT_SUGGESTIONS,
}: PathwayAIPanelProps) {
  const titleId = useId()
  const questionId = useId()

  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState<AIResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submitQuestion(nextQuestion: string) {
    const trimmed = nextQuestion.trim()

    if (!trimmed || loading) return

    setQuestion(trimmed)
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      let requestContextType = contextType
      let requestBible = bible

      if (contextType === 'general') {
        const passage = findBiblePassage(trimmed)

        if (passage) {
          const content = await getBibleChapter(
            'bsb',
            passage.book.id,
            passage.chapter,
          )

          let verses = content.verses

          if (passage.verseStart !== undefined) {
            verses = verses.filter((verse) => {
              const number = Number.parseInt(
                verse.number,
                10,
              )

              return (
                Number.isFinite(number) &&
                number >= passage.verseStart! &&
                number <= (
                  passage.verseEnd ??
                  passage.verseStart!
                )
              )
            })

            if (verses.length === 0) {
              throw new Error(
                `Pathway could not find that verse range in ${passage.book.name} ${passage.chapter}.`,
              )
            }
          }

          requestContextType = 'bible'
          requestBible = {
            bookId: passage.book.id,
            bookName: passage.book.name,
            chapter: passage.chapter,
            translation:
              content.translation.abbreviation,
            verses: verses.map((verse) => ({
              number: verse.number,
              text: verse.text,
            })),
          }
        }
      }

      const result = await askPathwayAI({
        question: trimmed,
        contextType: requestContextType,
        character,
        bible: requestBible,
        study,
      })

      setResponse(result)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Pathway AI could not answer right now.',
      )
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submitQuestion(question)
  }

  return (
    <section
      aria-labelledby={titleId}
      className="card overflow-hidden"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-accbg p-2.5 text-acc">
          <Sparkles size={22} aria-hidden="true" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h2
              id={titleId}
              className="text-xl font-semibold"
            >
              {title}
            </h2>

            <span className="rounded-full border border-line px-2 py-0.5 text-xs text-mute">
              AI
            </span>
          </div>

          <p className="mt-1 text-sm text-mute">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            disabled={loading}
            onClick={() => void submitQuestion(suggestion)}
            className="rounded-full border border-line px-3 py-1.5 text-left text-sm hover:border-acc hover:text-acc disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-5"
      >
        <label
          htmlFor={questionId}
          className="sr-only"
        >
          Ask Pathway AI
        </label>

        <div className="flex gap-2">
          <textarea
            id={questionId}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={3}
            maxLength={1500}
            placeholder="Ask a Bible-study question..."
            className="min-w-0 flex-1 resize-none rounded-xl border border-line bg-transparent px-4 py-3 text-ink outline-none focus:border-acc"
          />

          <button
            type="submit"
            disabled={loading || !question.trim()}
            aria-label="Send question"
            className="self-end rounded-xl bg-acc p-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={19} aria-hidden="true" />
          </button>
        </div>
      </form>

      {loading && (
        <div
          role="status"
          className="mt-5 flex items-center gap-2 text-sm text-mute"
        >
          <Bot
            size={18}
            className="animate-pulse"
            aria-hidden="true"
          />
          Pathway AI is studying the supplied biblical context…
        </div>
      )}

      {error && (
        <div
          role="note"
          className="mt-5 rounded-xl border border-line bg-accbg p-4"
        >
          <p className="font-semibold">
            Pathway AI
          </p>

          <p className="mt-1 text-sm text-mute">
            {error}
          </p>
        </div>
      )}

      {response && (
        <div className="mt-5 space-y-5 rounded-xl border border-line p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-mute">
            Pathway AI response
          </p>

          {response.sections?.length ? (
            <div className="space-y-5">
              {response.sections.map((section, index) => (
                <section
                  key={`${section.heading}-${index}`}
                >
                  <h3 className="font-semibold">
                    {section.heading}
                  </h3>

                  <p className="mt-2 whitespace-pre-wrap leading-7">
                    {cleanAIText(section.content)}
                  </p>
                </section>
              ))}
            </div>
          ) : (
            <p className="whitespace-pre-wrap leading-7">
              {cleanAIText(response.answer)}
            </p>
          )}

          {response.scriptureCitations.length ? (
            <div>
              <p className="text-sm font-semibold">
                Scripture references
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {response.scriptureCitations.map(
                  (citation, index) => {
                    const bookId =
                      getCitationBookId(citation.book)

                    const label = getCitationLabel(
                      citation.book,
                      citation.chapter,
                      citation.verseStart,
                      citation.verseEnd,
                    )

                    if (!bookId) {
                      return (
                        <span
                          key={`${label}-${index}`}
                          className="rounded-full border border-line px-3 py-1.5 text-sm"
                        >
                          {label}
                        </span>
                      )
                    }

                    const verseQuery =
                      citation.verseStart
                        ? `?verse=${citation.verseStart}#verse-${citation.verseStart}`
                        : ''

                    return (
                      <Link
                        key={`${label}-${index}`}
                        to={`/bible/${bookId}/${citation.chapter}${verseQuery}`}
                        className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-acc hover:text-acc"
                      >
                        {label}
                      </Link>
                    )
                  },
                )}
              </div>
            </div>
          ) : null}

          {response.limitations?.length ? (
            <div>
              <p className="text-sm font-semibold">
                Evidence notes
              </p>

              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-mute">
                {response.limitations.map((limitation) => (
                  <li key={limitation}>
                    {limitation}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      <p className="mt-4 text-xs text-mute">
        AI explanations can make mistakes. Verify important conclusions
        by reading the linked Scripture in context.
      </p>
    </section>
  )
}
