import type {
  CastMember,
  Movie,
  MovieDetail,
  PaginatedResult,
  TmdbCastMemberDto,
  TmdbMovieDetailDto,
  TmdbMovieDto,
  TmdbPaginatedResponseDto,
  TmdbVideoDto,
  TmdbWatchProviderDto,
  TmdbWatchProvidersDto,
  WatchProvider,
  WatchProviders,
} from '@/features/movies/types/movie.types'

export function toMovie(dto: TmdbMovieDto): Movie {
  return {
    id: dto.id,
    title: dto.title,
    overview: dto.overview,
    posterPath: dto.poster_path,
    backdropPath: dto.backdrop_path,
    releaseDate: dto.release_date,
    voteAverage: dto.vote_average,
    genreIds: dto.genre_ids ?? [],
  }
}

export function toPaginatedMovies(dto: TmdbPaginatedResponseDto<TmdbMovieDto>): PaginatedResult<Movie> {
  return {
    items: dto.results.map(toMovie),
    page: dto.page,
    totalPages: dto.total_pages,
    totalResults: dto.total_results,
  }
}

export function toCastMember(dto: TmdbCastMemberDto): CastMember {
  return {
    id: dto.id,
    name: dto.name,
    character: dto.character,
    profilePath: dto.profile_path,
  }
}

export function pickTrailerKey(videos: TmdbVideoDto[]): string | null {
  const youtubeVideos = videos.filter((video) => video.site === 'YouTube')
  const trailer =
    youtubeVideos.find((video) => video.type === 'Trailer' && video.official) ??
    youtubeVideos.find((video) => video.type === 'Trailer') ??
    youtubeVideos.find((video) => video.type === 'Teaser') ??
    youtubeVideos[0]
  return trailer?.key ?? null
}

function toWatchProvider(dto: TmdbWatchProviderDto): WatchProvider {
  return { id: dto.provider_id, name: dto.provider_name, logoPath: dto.logo_path }
}

export function toWatchProviders(dto: TmdbWatchProvidersDto, region: string): WatchProviders {
  const regionData = dto.results[region]
  if (!regionData) {
    return { link: null, flatrate: [], rent: [], buy: [], ads: [] }
  }
  return {
    link: regionData.link,
    flatrate: (regionData.flatrate ?? []).map(toWatchProvider),
    rent: (regionData.rent ?? []).map(toWatchProvider),
    buy: (regionData.buy ?? []).map(toWatchProvider),
    ads: (regionData.ads ?? []).map(toWatchProvider),
  }
}

export function toMovieDetail(
  dto: TmdbMovieDetailDto,
  cast: TmdbCastMemberDto[],
  similar: TmdbMovieDto[],
  videos: TmdbVideoDto[],
  watchProviders: TmdbWatchProvidersDto,
  region: string,
): MovieDetail {
  return {
    ...toMovie(dto),
    genres: dto.genres.map((genre) => genre.name),
    runtime: dto.runtime,
    tagline: dto.tagline,
    cast: cast.slice(0, 10).map(toCastMember),
    similar: similar.slice(0, 6).map(toMovie),
    trailerKey: pickTrailerKey(videos),
    watchProviders: toWatchProviders(watchProviders, region),
  }
}
