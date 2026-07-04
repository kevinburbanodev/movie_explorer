import { httpClient } from '@/shared/api/http-client'
import { useLocaleStore } from '@/shared/i18n/locale.store'
import { toMovieDetail, toPaginatedMovies } from '@/features/movies/api/movie.mapper'
import type {
  MovieDetail,
  PaginatedResult,
  Movie,
  TmdbCreditsDto,
  TmdbMovieDetailDto,
  TmdbMovieDto,
  TmdbPaginatedResponseDto,
  TmdbVideosDto,
  TmdbWatchProvidersDto,
} from '@/features/movies/types/movie.types'

function currentLanguage(): string {
  return useLocaleStore().tmdbLanguage()
}

function currentWatchRegion(): string {
  return useLocaleStore().tmdbWatchRegion()
}

export const moviesApi = {
  async discover(page: number, signal?: AbortSignal): Promise<PaginatedResult<Movie>> {
    const dto = await httpClient.get<TmdbPaginatedResponseDto<TmdbMovieDto>>(
      '/discover/movie',
      { page, sort_by: 'popularity.desc', language: currentLanguage() },
      signal,
    )
    return toPaginatedMovies(dto)
  },

  async search(query: string, page: number, signal?: AbortSignal): Promise<PaginatedResult<Movie>> {
    const dto = await httpClient.get<TmdbPaginatedResponseDto<TmdbMovieDto>>(
      '/search/movie',
      { query, page, language: currentLanguage() },
      signal,
    )
    return toPaginatedMovies(dto)
  },

  async getDetail(id: number, signal?: AbortSignal): Promise<MovieDetail> {
    const language = currentLanguage()
    const region = currentWatchRegion()
    const [detail, credits, similar, videos, watchProviders] = await Promise.all([
      httpClient.get<TmdbMovieDetailDto>(`/movie/${id}`, { language }, signal),
      httpClient.get<TmdbCreditsDto>(`/movie/${id}/credits`, { language }, signal),
      httpClient.get<TmdbPaginatedResponseDto<TmdbMovieDto>>(`/movie/${id}/similar`, { language }, signal),
      // Trailers are rarely dubbed/subtitled per-locale on TMDB, so we always
      // request the English catalog to make sure a trailer is actually found.
      httpClient.get<TmdbVideosDto>(`/movie/${id}/videos`, { language: 'en-US' }, signal),
      httpClient.get<TmdbWatchProvidersDto>(`/movie/${id}/watch/providers`, {}, signal),
    ])
    return toMovieDetail(detail, credits.cast, similar.results, videos.results, watchProviders, region)
  },
}
