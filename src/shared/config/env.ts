function requireEnv(key: string): string {
  const value = import.meta.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function boolEnv(key: string): boolean {
  return import.meta.env[key] === 'true'
}

const adsenseEnabled = boolEnv('VITE_ADSENSE_ENABLED')

export const env = {
  tmdbAccessToken: requireEnv('VITE_TMDB_ACCESS_TOKEN'),
  tmdbApiBaseUrl: requireEnv('VITE_TMDB_API_BASE_URL'),
  tmdbImageBaseUrl: requireEnv('VITE_TMDB_IMAGE_BASE_URL'),

  adsenseEnabled,
  // Only required when ads are actually turned on, so the app keeps working
  // without any AdSense setup while VITE_ADSENSE_ENABLED is false.
  adsenseClientId: adsenseEnabled ? requireEnv('VITE_ADSENSE_CLIENT_ID') : '',
  adsenseSlotId: adsenseEnabled ? requireEnv('VITE_ADSENSE_SLOT_ID') : '',
} as const
