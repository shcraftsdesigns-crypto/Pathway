import type {
  AIProvider,
  AIRequest,
  AIResponse,
} from './types'

interface APIResponse {
  answer?: string
  sections?: AIResponse['sections']
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

    const responseText = await response.text()

    if (!responseText.trim()) {
      throw new Error(
        response.ok
          ? 'Pathway AI returned an empty response. Please try again.'
          : `Pathway AI request failed (${response.status}). Please try again.`
      )
    }

    let data: APIResponse

    try {
      data = JSON.parse(responseText) as APIResponse
    } catch {
      throw new Error(
        'Pathway AI returned an incomplete response. Please try again.'
      )
    }

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
      sections: data.sections,
      scriptureCitations: data.scriptureCitations ?? [],
      limitations: data.limitations,
    }
  },
}
