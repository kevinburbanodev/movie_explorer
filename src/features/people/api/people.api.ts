import { httpClient } from '@/shared/api/http-client'
import { useLocaleStore } from '@/shared/i18n/locale.store'
import { toPersonDetail } from '@/features/people/api/person.mapper'
import type { PersonDetail, TmdbPersonDto, TmdbPersonMovieCreditsDto } from '@/features/people/types/person.types'

export const peopleApi = {
  async getDetail(id: number, signal?: AbortSignal): Promise<PersonDetail> {
    const language = useLocaleStore().tmdbLanguage()
    const [person, credits] = await Promise.all([
      httpClient.get<TmdbPersonDto>(`/person/${id}`, { language }, signal),
      httpClient.get<TmdbPersonMovieCreditsDto>(`/person/${id}/movie_credits`, { language }, signal),
    ])
    return toPersonDetail(person, credits.cast)
  },
}
