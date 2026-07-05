import type { Movie, TmdbMovieDto } from '@/features/movies/types/movie.types'

export interface PersonDetail {
  id: number
  name: string
  biography: string
  birthday: string | null
  deathday: string | null
  placeOfBirth: string | null
  profilePath: string | null
  knownForDepartment: string
  filmography: Movie[]
}

// Raw TMDB API shapes (snake_case, as returned by the API)
export interface TmdbPersonDto {
  id: number
  name: string
  biography: string
  birthday: string | null
  deathday: string | null
  place_of_birth: string | null
  profile_path: string | null
  known_for_department: string
}

export interface TmdbPersonMovieCreditDto extends TmdbMovieDto {
  character?: string
}

export interface TmdbPersonMovieCreditsDto {
  cast: TmdbPersonMovieCreditDto[]
}
