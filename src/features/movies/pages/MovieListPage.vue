<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import MovieListNavBar from '@/features/movies/components/MovieListNavBar.vue'
import MovieGrid from '@/features/movies/components/MovieGrid.vue'
import { useInfiniteScroll } from '@/features/movies/composables/useInfiniteScroll'
import { useMovieListStore } from '@/features/movies/store/movie-list.store'
import { useLocaleStore } from '@/shared/i18n/locale.store'
import { useStrings } from '@/shared/i18n/strings'
import SkeletonGrid from '@/shared/components/SkeletonGrid.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import ErrorState from '@/shared/components/ErrorState.vue'

const store = useMovieListStore()
const { locale } = storeToRefs(useLocaleStore())
const t = computed(() => useStrings(locale.value))

const sentinel = ref<HTMLElement | null>(null)
useInfiniteScroll(sentinel, () => store.loadNextPage())

onMounted(() => store.init())

const sectionTitle = computed(() =>
  store.query.trim() ? t.value.resultsFor(store.query.trim()) : t.value.trending,
)
const headline = computed(() => t.value.titlesCount(store.movies.length))
</script>

<template>
  <div class="movie-list-page">
    <MovieListNavBar :search-placeholder="t.searchPlaceholder" :headline="headline" @search="store.search" />

    <div class="movie-list-page__content">
      <div class="movie-list-page__section-title">{{ sectionTitle }}</div>

      <SkeletonGrid v-if="store.isInitialLoading" />

      <ErrorState v-else-if="store.status === 'error' && store.movies.length === 0" :message="store.errorMessage" @retry="store.init" />

      <EmptyState
        v-else-if="store.isEmpty"
        :title="t.noResults"
        :message="t.emptyLine(store.query.trim())"
      />

      <template v-else>
        <MovieGrid :movies="store.movies" />

        <div v-if="store.isLoadingMore" class="movie-list-page__loading-more">
          <span class="movie-list-page__spinner" />
          {{ t.loadingMore }}
        </div>
        <div v-else-if="store.isAtEnd" class="movie-list-page__end">{{ t.endOfCatalog }}</div>

        <div ref="sentinel" class="movie-list-page__sentinel" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.movie-list-page {
  animation: fade-in 0.4s;
}

.movie-list-page__content {
  padding: 30px 40px 60px;
}

@media (max-width: 640px) {
  .movie-list-page__content {
    padding: 24px 20px 40px;
  }
}

.movie-list-page__section-title {
  font-family: 'Archivo Expanded', 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 26px;
  letter-spacing: -0.01em;
  margin-bottom: 22px;
}

.movie-list-page__loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 36px 0;
  color: #71717a;
  font-family: 'Space Mono', monospace;
  font-size: 13px;
}

.movie-list-page__spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s infinite linear;
}

.movie-list-page__end {
  text-align: center;
  padding: 36px 0;
  color: #3f3f46;
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.1em;
}

.movie-list-page__sentinel {
  height: 1px;
}
</style>
