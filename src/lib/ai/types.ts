import type {
  BiblicalCharacter,
  ScriptureReference,
} from '@/types'

export type AIContextType =
  | 'general'
  | 'character'
  | 'bible'
  | 'study'

export interface AIBibleContext {
  bookId: string
  bookName: string
  chapter: number
  translation: string
  verses: {
    number: string
    text: string
  }[]
}

export interface AICharacterContext {
  character: BiblicalCharacter
  verifiedReferences: ScriptureReference[]
}

export interface AIStudyContext {
  topic?: string
  characterSlugs?: string[]
}

export interface AIRequest {
  question: string
  contextType: AIContextType
  character?: AICharacterContext
  bible?: AIBibleContext
  study?: AIStudyContext
}

export interface AIScriptureCitation {
  book: string
  chapter: number
  verseStart?: number
  verseEnd?: number
}

export interface AIResponseSection {
  heading: string
  content: string
}

export interface AIResponse {
  answer: string
  sections?: AIResponseSection[]
  scriptureCitations: AIScriptureCitation[]
  limitations?: string[]
}

export interface AIProvider {
  ask(request: AIRequest): Promise<AIResponse>
}
