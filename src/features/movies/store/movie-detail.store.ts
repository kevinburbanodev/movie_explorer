import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { moviesApi } from '@/features/movies/api/movies.api'
import { useLocaleStore } from '@/shared/i18n/locale.store'
import type { MovieDetail } from '@/features/movies/types/movie.types'

export const useMovieDetailStore = defineStore('movieDetail', () => {
  const localeStore = useLocaleStore()

  const movie = ref<MovieDetail | null>(null)
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
  const errorMessage = ref('')
  let currentId: number | null = null

  async function fetchMovie(id: number) {
    currentId = id
    status.value = 'loading'
    errorMessage.value = ''
    movie.value = null

    try {
      movie.value = await moviesApi.getDetail(id)
      status.value = 'success'
    } catch (error) {
      status.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : 'Something went wrong'
    }
  }

  watch(
    () => localeStore.locale,
    () => {
      if (currentId !== null) void fetchMovie(currentId)
    },
  )

  return { movie, status, errorMessage, fetchMovie }
})
