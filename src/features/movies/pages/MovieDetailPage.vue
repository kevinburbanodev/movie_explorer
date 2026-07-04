<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMovieDetailStore } from '@/features/movies/store/movie-detail.store'
import { tmdbImageUrl } from '@/shared/lib/tmdb-image'
import { gradientFor } from '@/shared/lib/movie-visual'
import { useLocaleStore } from '@/shared/i18n/locale.store'
import { useStrings } from '@/shared/i18n/strings'
import MovieCastList from '@/features/movies/components/MovieCastList.vue'
import MovieTrailer from '@/features/movies/components/MovieTrailer.vue'
import MovieWatchProviders from '@/features/movies/components/MovieWatchProviders.vue'
import MovieGrid from '@/features/movies/components/MovieGrid.vue'
import LanguageToggle from '@/shared/components/LanguageToggle.vue'
import SkeletonGrid from '@/shared/components/SkeletonGrid.vue'
import ErrorState from '@/shared/components/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const store = useMovieDetailStore()
const { locale } = storeToRefs(useLocaleStore())
const t = computed(() => useStrings(locale.value))

const movieId = computed(() => Number(route.params.id))
const trailerSection = ref<HTMLElement | null>(null)

function load() {
  store.fetchMovie(movieId.value)
}

onMounted(load)
watch(movieId, load)

function scrollToTrailer() {
  trailerSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function goBack() {
  router.push({ name: 'movie-list' })
}

const backdropUrl = computed(() => (store.movie ? tmdbImageUrl(store.movie.backdropPath, 'original') : null))
const posterUrl = computed(() => (store.movie ? tmdbImageUrl(store.movie.posterPath, 'w500') : null))
const [g1, g2] = computed(() => (store.movie ? gradientFor(store.movie.id) : ['#1c1917', '#0f172a'])).value

const runtimeLabel = computed(() => {
  const runtime = store.movie?.runtime
  if (!runtime) return '—'
  return `${Math.floor(runtime / 60)}h ${runtime % 60}m`
})
</script>

<template>
  <div class="movie-detail-page">
    <SkeletonGrid v-if="store.status === 'loading'" :count="6" />
    <ErrorState v-else-if="store.status === 'error'" :message="store.errorMessage" @retry="load" />

    <template v-else-if="store.movie">
      <div class="hero" :style="{ background: `linear-gradient(120deg, ${g1}, ${g2})` }">
        <img v-if="backdropUrl" :src="backdropUrl" :alt="store.movie.title" class="hero__backdrop" />
        <div class="hero__scrim" />

        <div class="hero__topbar">
          <button type="button" class="hero__back" @click="goBack">
            <span class="hero__back-arrow" /> {{ t.back }}
          </button>
          <LanguageToggle />
        </div>

        <div class="hero__content">
          <div class="hero__poster" :style="{ background: `linear-gradient(150deg, ${g1}, ${g2})` }">
            <img v-if="posterUrl" :src="posterUrl" :alt="store.movie.title" class="hero__poster-image" />
          </div>
          <div class="hero__info">
            <div class="hero__meta">★ {{ store.movie.voteAverage.toFixed(1) }} · {{ store.movie.releaseDate?.slice(0, 4) }} · {{ runtimeLabel }}</div>
            <h1 class="hero__title">{{ store.movie.title }}</h1>
            <div class="hero__genres">
              <span v-for="genre in store.movie.genres" :key="genre" class="hero__genre-pill">{{ genre }}</span>
            </div>
            <p class="hero__overview">{{ store.movie.overview }}</p>
            <div class="hero__actions">
              <button v-if="store.movie.trailerKey" type="button" class="hero__watch-trailer" @click="scrollToTrailer">
                <span class="hero__play-icon" /> {{ t.watchTrailer }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-body">
        <template v-if="store.movie.cast.length">
          <div class="detail-body__section-title">{{ t.cast }}</div>
          <MovieCastList :cast="store.movie.cast" />
        </template>

        <div ref="trailerSection" />
        <div class="detail-body__section-title detail-body__section-title--trailer">{{ t.trailer }}</div>
        <MovieTrailer :trailer-key="store.movie.trailerKey" :no-trailer-label="t.noTrailer" />

        <template v-if="store.movie.similar.length">
          <div class="detail-body__section-title detail-body__section-title--similar">{{ t.similar }}</div>
          <MovieGrid :movies="store.movie.similar" />
        </template>

        <div class="detail-body__section-title detail-body__section-title--watch">{{ t.whereToWatch }}</div>
        <MovieWatchProviders
          :providers="store.movie.watchProviders"
          :labels="{ stream: t.stream, rent: t.rent, buy: t.buy, empty: t.noWatchProviders, poweredBy: t.poweredByJustWatch }"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.movie-detail-page {
  animation: detail-in 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.hero {
  position: relative;
  min-height: 560px;
  overflow: hidden;
}

.hero__backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
}

.hero__scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(0deg, #08080a 3%, transparent 55%),
    linear-gradient(90deg, #08080a 8%, rgba(8, 8, 10, 0.4) 45%, transparent 70%);
}

.hero__topbar {
  position: absolute;
  top: 24px;
  left: 40px;
  right: 40px;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hero__back {
  display: flex;
  align-items: center;
  gap: 9px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 9px 16px 9px 13px;
  border-radius: 999px;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  backdrop-filter: blur(8px);
  transition: background 0.2s;
}

.hero__back:hover {
  background: rgba(0, 0, 0, 0.75);
}

.hero__back-arrow {
  border-right: 8px solid #fff;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
}

.hero__content {
  position: relative;
  z-index: 10;
  display: flex;
  gap: 38px;
  padding: 120px 40px 44px;
  align-items: flex-end;
  max-width: 1200px;
}

.hero__poster {
  flex: 0 0 220px;
  aspect-ratio: 2 / 3;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.8);
  position: relative;
}

.hero__poster-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__info {
  flex: 1;
  padding-bottom: 8px;
  min-width: 0;
}

.hero__meta {
  display: flex;
  gap: 12px;
  align-items: center;
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
}

.hero__title {
  font-family: 'Archivo Expanded', 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 56px;
  line-height: 0.94;
  margin: 12px 0 0;
  letter-spacing: -0.02em;
}

.hero__genres {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.hero__genre-pill {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 5px 12px;
  border-radius: 999px;
  color: #d4d4d8;
}

.hero__overview {
  font-size: 16px;
  line-height: 1.6;
  color: #d4d4d8;
  margin: 20px 0 0;
  max-width: 640px;
}

.hero__actions {
  display: flex;
  gap: 12px;
  margin-top: 26px;
}

.hero__watch-trailer {
  display: flex;
  align-items: center;
  gap: 9px;
  background: var(--accent);
  color: #08080a;
  font: inherit;
  font-weight: 800;
  font-size: 14px;
  padding: 13px 24px;
  border-radius: 999px;
  cursor: pointer;
  border: none;
  transition: transform 0.2s;
}

.hero__watch-trailer:hover {
  transform: scale(1.04);
}

.hero__play-icon {
  border-left: 9px solid #08080a;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

.detail-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 40px 70px;
}

@media (max-width: 640px) {
  .hero {
    min-height: 0;
  }

  .hero__content {
    flex-direction: column;
    align-items: flex-start;
    padding: 96px 20px 32px;
    gap: 20px;
  }

  .hero__poster {
    flex-basis: auto;
    width: 130px;
  }

  .hero__title {
    font-size: 34px;
  }

  .hero__topbar {
    left: 20px;
    right: 20px;
  }

  .detail-body {
    padding: 14px 20px 50px;
  }
}

.detail-body__section-title {
  font-family: 'Archivo Expanded', 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 22px;
  margin: 26px 0 18px;
}

.detail-body__section-title--trailer {
  margin-top: 38px;
}

.detail-body__section-title--similar {
  margin-top: 40px;
}

.detail-body__section-title--watch {
  margin-top: 40px;
}
</style>
