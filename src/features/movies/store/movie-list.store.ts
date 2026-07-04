import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { moviesApi } from '@/features/movies/api/movies.api'
import { useLocaleStore } from '@/shared/i18n/locale.store'
import type { Movie } from '@/features/movies/types/movie.types'

export const useMovieListStore = defineStore('movieList', () => {
  const localeStore = useLocaleStore()

  const query = ref('')
  const movies = ref<Movie[]>([])
  const page = ref(0)
  const totalPages = ref(0)
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
  const errorMessage = ref('')

  let activeController: AbortController | null = null

  const hasMore = computed(() => page.value < totalPages.value)
  const isEmpty = computed(() => status.value === 'success' && movies.value.length === 0)
  const isInitialLoading = computed(() => status.value === 'loading' && movies.value.length === 0)
  const isLoadingMore = computed(() => status.value === 'loading' && movies.value.length > 0)
  const isAtEnd = computed(() => status.value === 'success' && movies.value.length > 0 && !hasMore.value)

  async function loadPage(targetPage: number) {
    activeController?.abort()
    const controller = new AbortController()
    activeController = controller

    status.value = 'loading'
    errorMessage.value = ''

    try {
      const result = query.value.trim()
        ? await moviesApi.search(query.value.trim(), targetPage, controller.signal)
        : await moviesApi.discover(targetPage, controller.signal)

      movies.value = targetPage === 1 ? result.items : [...movies.value, ...result.items]
      page.value = result.page
      totalPages.value = result.totalPages
      status.value = 'success'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      status.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : 'Something went wrong'
    }
  }

  function search(newQuery: string) {
    query.value = newQuery
    movies.value = []
    page.value = 0
    totalPages.value = 0
    void loadPage(1)
  }

  function loadNextPage() {
    if (status.value === 'loading' || !hasMore.value) return
    void loadPage(page.value + 1)
  }

  function init() {
    if (movies.value.length === 0 && status.value === 'idle') {
      void loadPage(1)
    }
  }

  watch(
    () => localeStore.locale,
    () => {
      movies.value = []
      page.value = 0
      totalPages.value = 0
      void loadPage(1)
    },
  )

  return {
    query,
    movies,
    status,
    errorMessage,
    hasMore,
    isEmpty,
    isInitialLoading,
    isLoadingMore,
    isAtEnd,
    search,
    loadNextPage,
    init,
  }
})
