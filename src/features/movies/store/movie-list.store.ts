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
  const matchedActorName = ref<string | null>(null)

  let activeController: AbortController | null = null
  let knownIds = new Set<number>()

  const hasMore = computed(() => page.value < totalPages.value)
  const isEmpty = computed(() => status.value === 'success' && movies.value.length === 0)
  const isInitialLoading = computed(() => status.value === 'loading' && movies.value.length === 0)
  const isLoadingMore = computed(() => status.value === 'loading' && movies.value.length > 0)
  const isAtEnd = computed(() => status.value === 'success' && movies.value.length > 0 && !hasMore.value)

  function appendUnique(newMovies: Movie[]) {
    const fresh = newMovies.filter((movie) => !knownIds.has(movie.id))
    fresh.forEach((movie) => knownIds.add(movie.id))
    movies.value = [...movies.value, ...fresh]
  }

  async function loadPage(targetPage: number) {
    activeController?.abort()
    const controller = new AbortController()
    activeController = controller

    status.value = 'loading'
    errorMessage.value = ''

    try {
      const trimmedQuery = query.value.trim()

      if (!trimmedQuery) {
        const result = await moviesApi.discover(targetPage, controller.signal)
        movies.value = targetPage === 1 ? result.items : [...movies.value, ...result.items]
        knownIds = new Set(movies.value.map((movie) => movie.id))
        page.value = result.page
        totalPages.value = result.totalPages
        matchedActorName.value = null
        status.value = 'success'
        return
      }

      if (targetPage === 1) {
        const [titleResult, actorResult] = await Promise.all([
          moviesApi.search(trimmedQuery, 1, controller.signal),
          moviesApi.searchByActor(trimmedQuery, controller.signal),
        ])

        movies.value = []
        knownIds = new Set()
        matchedActorName.value = actorResult.person?.name ?? null
        appendUnique(actorResult.movies)
        appendUnique(titleResult.items)

        page.value = titleResult.page
        totalPages.value = titleResult.totalPages
        status.value = 'success'
        return
      }

      const titleResult = await moviesApi.search(trimmedQuery, targetPage, controller.signal)
      appendUnique(titleResult.items)
      page.value = titleResult.page
      totalPages.value = titleResult.totalPages
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
    knownIds = new Set()
    page.value = 0
    totalPages.value = 0
    matchedActorName.value = null
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
      knownIds = new Set()
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
    matchedActorName,
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
