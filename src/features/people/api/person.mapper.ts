import { toMovie } from '@/features/movies/api/movie.mapper'
import type { Movie } from '@/features/movies/types/movie.types'
import type {
  PersonDetail,
  TmdbPersonDto,
  TmdbPersonMovieCreditDto,
} from '@/features/people/types/person.types'

function toFilmography(credits: TmdbPersonMovieCreditDto[]): Movie[] {
  const seen = new Set<number>()
  return credits
    .filter((credit) => {
      if (seen.has(credit.id)) return false
      seen.add(credit.id)
      return true
    })
    .sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''))
    .map(toMovie)
}

export function toPersonDetail(dto: TmdbPersonDto, credits: TmdbPersonMovieCreditDto[]): PersonDetail {
  return {
    id: dto.id,
    name: dto.name,
    biography: dto.biography,
    birthday: dto.birthday,
    deathday: dto.deathday,
    placeOfBirth: dto.place_of_birth,
    profilePath: dto.profile_path,
    knownForDepartment: dto.known_for_department,
    filmography: toFilmography(credits),
  }
}
