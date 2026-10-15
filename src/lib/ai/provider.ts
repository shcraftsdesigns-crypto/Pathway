import type {
  AIProvider,
  AIRequest,
  AIResponse,
} from './types'

let provider: AIProvider | null = null

export function setAIProvider(nextProvider: AIProvider) {
  provider = nextProvider
}

export async function askPathwayAI(
  request: AIRequest,
): Promise<AIResponse> {
  if (!provider) {
    throw new Error(
      'Pathway AI is not connected yet. The study assistant is being prepared.',
    )
  }

  return provider.ask(request)
}
