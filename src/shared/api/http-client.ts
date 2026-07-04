import { env } from '@/shared/config/env'

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

async function request<T>(path: string, params: Record<string, string | number | undefined> = {}, signal?: AbortSignal): Promise<T> {
  const url = new URL(`${env.tmdbApiBaseUrl}${path}`)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }

  const response = await fetch(url, {
    signal,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${env.tmdbAccessToken}`,
    },
  })

  if (!response.ok) {
    throw new HttpError(response.status, `TMDB request failed: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

export const httpClient = { get: request }
