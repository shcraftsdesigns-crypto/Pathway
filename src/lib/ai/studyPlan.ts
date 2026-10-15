import type { AIScriptureCitation } from './types'

export type StudyPlanType =
  | 'character'
  | 'passage'
  | 'topic'

export interface StudyPlanSection {
  title: string
  content: string
  reflectionQuestions: string[]
  scriptureCitations: AIScriptureCitation[]
}

export interface StudyPlan {
  id: string
  type: StudyPlanType
  title: string
  objective: string
  sections: StudyPlanSection[]
  scriptureCitations: AIScriptureCitation[]
  createdAt: string
}

export interface StudyPlanRequest {
  type: StudyPlanType
  subject: string
}
