import type { VercelRequest, VercelResponse } from '@vercel/node'

const MAX_REQUEST_BYTES = 50_000
const SUPABASE_TIMEOUT_MS = 10_000

type StudyType = 'character' | 'passage' | 'topic'

interface SharedStudyCitation {
  book: string
  chapter: number
  verseStart?: number
  verseEnd?: number
}

interface SharedStudySection {
  heading: string
  content: string
}

interface SharedStudy {
  type: StudyType
  subject: string
  answer: string
  sections: SharedStudySection[]
  scriptureCitations: SharedStudyCitation[]
  limitations: string[]
}

function setSecurityHeaders(response: VercelResponse): void {
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('Referrer-Policy', 'no-referrer')
}

function getRequestSize(request: VercelRequest): number {
  try {
    return Buffer.byteLength(
      JSON.stringify(request.body ?? {}),
      'utf8',
    )
  } catch {
    return MAX_REQUEST_BYTES + 1
  }
}

function isNonEmptyString(
  value: unknown,
  maxLength: number,
): value is string {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value.length <= maxLength
  )
}

function validateStudy(value: unknown): SharedStudy | null {
  if (!value || typeof value !== 'object') return null

  const study = value as Record<string, unknown>

  if (
    study.type !== 'character' &&
    study.type !== 'passage' &&
    study.type !== 'topic'
  ) {
    return null
  }

  if (!isNonEmptyString(study.subject, 500)) return null

  if (
    typeof study.answer !== 'string' ||
    study.answer.length > 20_000
  ) {
    return null
  }

  if (
    !Array.isArray(study.sections) ||
    study.sections.length > 12
  ) {
    return null
  }

  const sections: SharedStudySection[] = []

  for (const item of study.sections) {
    if (!item || typeof item !== 'object') return null

    const section = item as Record<string, unknown>

    if (
      !isNonEmptyString(section.heading, 200) ||
      typeof section.content !== 'string' ||
      section.content.length > 10_000
    ) {
      return null
    }

    sections.push({
      heading: section.heading.trim(),
      content: section.content,
    })
  }

  if (
    !Array.isArray(study.scriptureCitations) ||
    study.scriptureCitations.length > 20
  ) {
    return null
  }

  const scriptureCitations: SharedStudyCitation[] = []

  for (const item of study.scriptureCitations) {
    if (!item || typeof item !== 'object') return null

    const citation = item as Record<string, unknown>

    if (
      !isNonEmptyString(citation.book, 100) ||
      !Number.isInteger(citation.chapter) ||
      (citation.chapter as number) < 1
    ) {
      return null
    }

    const verseStart =
      citation.verseStart === undefined
        ? undefined
        : citation.verseStart

    const verseEnd =
      citation.verseEnd === undefined
        ? undefined
        : citation.verseEnd

    if (
      (verseStart !== undefined &&
        (!Number.isInteger(verseStart) ||
          (verseStart as number) < 1)) ||
      (verseEnd !== undefined &&
        (!Number.isInteger(verseEnd) ||
          (verseEnd as number) < 1))
    ) {
      return null
    }

    scriptureCitations.push({
      book: citation.book.trim(),
      chapter: citation.chapter as number,
      ...(verseStart !== undefined
        ? { verseStart: verseStart as number }
        : {}),
      ...(verseEnd !== undefined
        ? { verseEnd: verseEnd as number }
        : {}),
    })
  }

  if (
    !Array.isArray(study.limitations) ||
    study.limitations.length > 10 ||
    !study.limitations.every(
      (item) =>
        typeof item === 'string' && item.length <= 1000,
    )
  ) {
    return null
  }

  return {
    type: study.type,
    subject: study.subject.trim(),
    answer: study.answer,
    sections,
    scriptureCitations,
    limitations: study.limitations as string[],
  }
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  setSecurityHeaders(response)

  if (
    request.method !== 'POST' &&
    request.method !== 'GET'
  ) {
    response.setHeader('Allow', 'GET, POST')
    return response.status(405).json({
      error: 'Method not allowed',
    })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl || !supabaseSecretKey) {
    return response.status(500).json({
      error: 'Study sharing is not configured.',
    })
  }

  if (request.method === 'GET') {
    const rawId = request.query.id
    const id = Array.isArray(rawId) ? rawId[0] : rawId

    if (
      typeof id !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
    ) {
      return response.status(400).json({
        error: 'Invalid shared study link.',
      })
    }

    const controller = new AbortController()
    const timeout = setTimeout(
      () => controller.abort(),
      SUPABASE_TIMEOUT_MS,
    )

    try {
      const params = new URLSearchParams({
        id: `eq.${id}`,
        select: 'id,created_at,study',
        limit: '1',
      })

      const supabaseResponse = await fetch(
        `${supabaseUrl.replace(/\/+$/, '')}/rest/v1/shared_studies?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            apikey: supabaseSecretKey,
            Accept: 'application/json',
          },
          signal: controller.signal,
        },
      )

      if (!supabaseResponse.ok) {
        console.error(
          'Shared study database lookup failed:',
          supabaseResponse.status,
        )

        return response.status(502).json({
          error: 'Pathway could not load this shared study.',
        })
      }

      const rows = await supabaseResponse.json()
      const row = rows?.[0]

      if (
        !row ||
        typeof row.id !== 'string' ||
        !row.study
      ) {
        return response.status(404).json({
          error: 'Shared study not found.',
        })
      }

      return response.status(200).json({
        id: row.id,
        createdAt: row.created_at,
        study: row.study,
      })
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === 'AbortError'
      ) {
        return response.status(504).json({
          error: 'Loading this shared study took too long. Please try again.',
        })
      }

      console.error('Shared study database lookup failed.')

      return response.status(502).json({
        error: 'Pathway could not load this shared study.',
      })
    } finally {
      clearTimeout(timeout)
    }
  }

  const contentType = request.headers['content-type']

  if (
    typeof contentType !== 'string' ||
    !contentType.toLowerCase().startsWith('application/json')
  ) {
    return response.status(415).json({
      error: 'Content-Type must be application/json.',
    })
  }

  if (getRequestSize(request) > MAX_REQUEST_BYTES) {
    return response.status(413).json({
      error: 'The shared study is too large.',
    })
  }

  const study = validateStudy(request.body?.study)

  if (!study) {
    return response.status(400).json({
      error: 'The shared study is invalid.',
    })
  }

  const controller = new AbortController()
  const timeout = setTimeout(
    () => controller.abort(),
    SUPABASE_TIMEOUT_MS,
  )

  try {
    const supabaseResponse = await fetch(
      `${supabaseUrl.replace(/\/+$/, '')}/rest/v1/shared_studies`,
      {
        method: 'POST',
        headers: {
          apikey: supabaseSecretKey,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({ study }),
        signal: controller.signal,
      },
    )

    if (!supabaseResponse.ok) {
      const errorText = (await supabaseResponse.text()).slice(0, 500)

      console.error(
        'Shared study database insert failed:',
        supabaseResponse.status,
        errorText,
      )

      return response.status(502).json({
        error: 'Pathway could not create the share link.',
      })
    }

    const rows = await supabaseResponse.json()
    const id = rows?.[0]?.id

    if (typeof id !== 'string' || !id) {
      return response.status(502).json({
        error: 'Pathway could not create the share link.',
      })
    }

    return response.status(201).json({ id })
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === 'AbortError'
    ) {
      return response.status(504).json({
        error: 'Study sharing took too long. Please try again.',
      })
    }

    console.error('Shared study database request failed.')

    return response.status(502).json({
      error: 'Pathway could not create the share link.',
    })
  } finally {
    clearTimeout(timeout)
  }
}
