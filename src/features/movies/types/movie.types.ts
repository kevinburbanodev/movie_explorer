export interface Movie {
  id: number
  title: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  releaseDate: string
  voteAverage: number
  genreIds: number[]
}

export interface PaginatedResult<T> {
  items: T[]
  page: number
  totalPages: number
  totalResults: number
}

export interface CastMember {
  id: number
  name: string
  character: string
  profilePath: string | null
}

export interface WatchProvider {
  id: number
  name: string
  logoPath: string | null
}

export interface WatchProviders {
  link: string | null
  flatrate: WatchProvider[]
  rent: WatchProvider[]
  buy: WatchProvider[]
  ads: WatchProvider[]
}

export interface MovieDetail extends Movie {
  genres: string[]
  runtime: number | null
  tagline: string
  cast: CastMember[]
  similar: Movie[]
  trailerKey: string | null
  watchProviders: WatchProviders
}

// Raw TMDB API shapes (snake_case, as returned by the API)
export interface TmdbMovieDto {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  genre_ids?: number[]
}

export interface TmdbPaginatedResponseDto<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface TmdbCastMemberDto {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export interface TmdbCreditsDto {
  cast: TmdbCastMemberDto[]
}

export interface TmdbVideoDto {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface TmdbVideosDto {
  results: TmdbVideoDto[]
}

export interface TmdbGenreDto {
  id: number
  name: string
}

export interface TmdbMovieDetailDto extends TmdbMovieDto {
  genres: TmdbGenreDto[]
  runtime: number | null
  tagline: string
}

export interface TmdbWatchProviderDto {
  provider_id: number
  provider_name: string
  logo_path: string | null
}

export interface TmdbWatchProvidersRegionDto {
  link: string
  flatrate?: TmdbWatchProviderDto[]
  rent?: TmdbWatchProviderDto[]
  buy?: TmdbWatchProviderDto[]
  ads?: TmdbWatchProviderDto[]
}

export interface TmdbWatchProvidersDto {
  results: Record<string, TmdbWatchProvidersRegionDto>
}
