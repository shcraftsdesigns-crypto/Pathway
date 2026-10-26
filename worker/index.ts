import aiHandler from '../api/ai'
import sharedStudiesHandler from '../api/shared-studies'

interface Env {
  GROQ_API_KEY: string
  SUPABASE_URL: string
  SUPABASE_SECRET_KEY: string
  ASSETS: Fetcher
}

interface MockResponse {
  statusCode: number
  headers: Headers
  body: unknown
  setHeader(name: string, value: string): void
  status(code: number): MockResponse
  json(value: unknown): MockResponse
}

function createResponseAdapter(): MockResponse {
  return {
    statusCode: 200,
    headers: new Headers(),
    body: null,

    setHeader(name: string, value: string) {
      this.headers.set(name, value)
    },

    status(code: number) {
      this.statusCode = code
      return this
    },

    json(value: unknown) {
      this.body = value
      this.headers.set('Content-Type', 'application/json; charset=utf-8')
      return this
    },
  }
}

async function createRequestAdapter(request: Request) {
  const url = new URL(request.url)

  let body: unknown = undefined

  if (
    request.method !== 'GET' &&
    request.method !== 'HEAD' &&
    request.headers
      .get('content-type')
      ?.toLowerCase()
      .startsWith('application/json')
  ) {
    try {
      body = await request.json()
    } catch {
      body = undefined
    }
  }

  const headers: Record<string, string> = {}

  request.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value
  })

  const query: Record<string, string> = {}

  url.searchParams.forEach((value, key) => {
    query[key] = value
  })

  return {
    method: request.method,
    headers,
    query,
    body,
    socket: {
      remoteAddress:
        request.headers.get('cf-connecting-ip') ??
        request.headers.get('x-forwarded-for') ??
        undefined,
    },
  }
}

async function runHandler(
  request: Request,
  handler: typeof aiHandler | typeof sharedStudiesHandler,
  env: Env,
): Promise<Response> {
  process.env.GROQ_API_KEY = env.GROQ_API_KEY
  process.env.SUPABASE_URL = env.SUPABASE_URL
  process.env.SUPABASE_SECRET_KEY = env.SUPABASE_SECRET_KEY

  const adaptedRequest = await createRequestAdapter(request)
  const adaptedResponse = createResponseAdapter()

  await handler(
    adaptedRequest as never,
    adaptedResponse as never,
  )

  return new Response(
    JSON.stringify(adaptedResponse.body),
    {
      status: adaptedResponse.statusCode,
      headers: adaptedResponse.headers,
    },
  )
}

export default {
  async fetch(
    request: Request,
    env: Env,
  ): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/ai') {
      return runHandler(request, aiHandler, env)
    }

    if (url.pathname === '/api/shared-studies') {
      return runHandler(
        request,
        sharedStudiesHandler,
        env,
      )
    }

    const assetResponse = await env.ASSETS.fetch(request)
    const response = new Response(assetResponse.body, assetResponse)
    const headers = response.headers

    headers.set('X-Content-Type-Options', 'nosniff')
    headers.set('X-Frame-Options', 'DENY')
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=()',
    )

    if (url.pathname === '/sw.js') {
      headers.set(
        'Cache-Control',
        'no-cache, no-store, must-revalidate',
      )
      headers.set('Service-Worker-Allowed', '/')
    }

    return response
  },
}
