import type {
  VercelRequest,
  VercelResponse,
} from '@vercel/node'

const SUPABASE_TIMEOUT_MS = 10_000

function setSecurityHeaders(
  response: VercelResponse,
): void {
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader(
    'X-Content-Type-Options',
    'nosniff',
  )
  response.setHeader(
    'Referrer-Policy',
    'no-referrer',
  )
}

async function supabaseRequest(
  url: string,
  options: RequestInit,
): Promise<Response> {
  const controller = new AbortController()

  const timeout = setTimeout(
    () => controller.abort(),
    SUPABASE_TIMEOUT_MS,
  )

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  setSecurityHeaders(response)

  if (request.method !== 'DELETE') {
    response.setHeader('Allow', 'DELETE')

    return response.status(405).json({
      error: 'Method not allowed.',
    })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseSecretKey =
    process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl || !supabaseSecretKey) {
    return response.status(500).json({
      error: 'Account deletion is not configured.',
    })
  }

  const authorization =
    request.headers.authorization

  if (
    !authorization ||
    !authorization.startsWith('Bearer ')
  ) {
    return response.status(401).json({
      error: 'Authentication required.',
    })
  }

  const accessToken = authorization
    .slice('Bearer '.length)
    .trim()

  if (!accessToken) {
    return response.status(401).json({
      error: 'Authentication required.',
    })
  }

  const baseUrl = supabaseUrl.replace(
    /\/+$/,
    '',
  )

  try {
    const userResponse = await supabaseRequest(
      `${baseUrl}/auth/v1/user`,
      {
        method: 'GET',
        headers: {
          apikey: supabaseSecretKey,
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      },
    )

    if (!userResponse.ok) {
      return response.status(401).json({
        error:
          'Your session is no longer valid. Please sign in again.',
      })
    }

    const authenticatedUser =
      (await userResponse.json()) as {
        id?: string
      }

    if (!authenticatedUser.id) {
      return response.status(401).json({
        error: 'Authentication required.',
      })
    }

    const userId = authenticatedUser.id

    const studyDataResponse =
      await supabaseRequest(
        `${baseUrl}/rest/v1/user_study_data?user_id=eq.${encodeURIComponent(
          userId,
        )}`,
        {
          method: 'DELETE',
          headers: {
            apikey: supabaseSecretKey,
            Authorization:
              `Bearer ${supabaseSecretKey}`,
            Prefer: 'return=minimal',
          },
        },
      )

    if (!studyDataResponse.ok) {
      console.error(
        'Account study-data deletion failed:',
        studyDataResponse.status,
      )

      return response.status(500).json({
        error:
          'Pathway could not delete your account data. Please try again.',
      })
    }

    const authDeleteResponse =
      await supabaseRequest(
        `${baseUrl}/auth/v1/admin/users/${encodeURIComponent(
          userId,
        )}`,
        {
          method: 'DELETE',
          headers: {
            apikey: supabaseSecretKey,
            Authorization:
              `Bearer ${supabaseSecretKey}`,
          },
        },
      )

    if (!authDeleteResponse.ok) {
      console.error(
        'Account authentication deletion failed:',
        authDeleteResponse.status,
      )

      return response.status(500).json({
        error:
          'Pathway could not complete account deletion. Please contact support.',
      })
    }

    return response.status(200).json({
      success: true,
    })
  } catch {
    console.error('Account deletion failed.')

    return response.status(500).json({
      error:
        'Pathway could not delete your account. Please try again.',
    })
  }
}