function requireEnv(key: string): string {
  const value = import.meta.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const env = {
  tmdbAccessToken: requireEnv('VITE_TMDB_ACCESS_TOKEN'),
  tmdbApiBaseUrl: requireEnv('VITE_TMDB_API_BASE_URL'),
  tmdbImageBaseUrl: requireEnv('VITE_TMDB_IMAGE_BASE_URL'),
} as const
