import type {
  AIProvider,
  AIRequest,
  AIResponse,
} from './types'

interface APIResponse {
  answer?: string
  scriptureCitations?: AIResponse['scriptureCitations']
  limitations?: string[]
  error?: string
}

export const httpAIProvider: AIProvider = {
  async ask(request: AIRequest): Promise<AIResponse> {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    const data = (await response.json()) as APIResponse

    if (!response.ok) {
      throw new Error(
        data.error || 'Pathway AI could not answer right now.',
      )
    }

    if (!data.answer?.trim()) {
      throw new Error(
        'Pathway AI returned an empty response.',
      )
    }

    return {
      answer: data.answer.trim(),
      scriptureCitations: data.scriptureCitations ?? [],
      limitations: data.limitations,
    }
  },
}
