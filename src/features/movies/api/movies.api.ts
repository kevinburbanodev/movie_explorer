import { httpClient } from '@/shared/api/http-client'
import { useLocaleStore } from '@/shared/i18n/locale.store'
import { toMovie, toMovieDetail, toPaginatedMovies } from '@/features/movies/api/movie.mapper'
import type {
  ActorSearchResult,
  MovieDetail,
  PaginatedResult,
  Movie,
  TmdbCreditsDto,
  TmdbMovieDetailDto,
  TmdbMovieDto,
  TmdbPaginatedResponseDto,
  TmdbPersonMovieCreditsDto,
  TmdbPersonSearchResultDto,
  TmdbVideosDto,
  TmdbWatchProvidersDto,
} from '@/features/movies/types/movie.types'

function currentLanguage(): string {
  return useLocaleStore().tmdbLanguage()
}

function currentWatchRegion(): string {
  return useLocaleStore().tmdbWatchRegion()
}

// Below this, TMDB's fuzzy name matching starts surfacing near-unknown people
// whose name merely contains the query (e.g. searching "batman" can match an
// obscure actor literally named "Batman"), which would hijack an otherwise
// normal title search.
const MIN_ACTOR_POPULARITY = 5

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

  async searchByActor(query: string, signal?: AbortSignal): Promise<ActorSearchResult> {
    const language = currentLanguage()
    const peopleResult = await httpClient.get<TmdbPaginatedResponseDto<TmdbPersonSearchResultDto>>(
      '/search/person',
      { query, language },
      signal,
    )
    const topPerson = peopleResult.results[0]
    if (!topPerson || topPerson.popularity < MIN_ACTOR_POPULARITY) return { person: null, movies: [] }

    const credits = await httpClient.get<TmdbPersonMovieCreditsDto>(
      `/person/${topPerson.id}/movie_credits`,
      { language },
      signal,
    )
    const seen = new Set<number>()
    const movies = credits.cast
      .filter((movie) => {
        if (seen.has(movie.id)) return false
        seen.add(movie.id)
        return true
      })
      .sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''))
      .map(toMovie)

    return { person: { id: topPerson.id, name: topPerson.name }, movies }
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
