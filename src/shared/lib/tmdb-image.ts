import { env } from '@/shared/config/env'

export type ImageSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original'

export function tmdbImageUrl(path: string | null, size: ImageSize = 'w342'): string | null {
  if (!path) return null
  return `${env.tmdbImageBaseUrl}/${size}${path}`
}
