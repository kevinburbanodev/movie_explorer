<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { tmdbImageUrl } from '@/shared/lib/tmdb-image'
import { gradientFor, letterFor } from '@/shared/lib/movie-visual'
import { genreName } from '@/shared/i18n/genres'
import { useLocaleStore } from '@/shared/i18n/locale.store'
import type { Movie } from '@/features/movies/types/movie.types'

const props = defineProps<{ movie: Movie }>()

const { locale } = storeToRefs(useLocaleStore())

const posterUrl = computed(() => tmdbImageUrl(props.movie.posterPath, 'w500'))
const year = computed(() => props.movie.releaseDate?.slice(0, 4) || '—')
const rating = computed(() => props.movie.voteAverage.toFixed(1))
const genre = computed(() => genreName(props.movie.genreIds[0], locale.value))
const [g1, g2] = gradientFor(props.movie.id)
const letter = letterFor(props.movie.title)
</script>

<template>
  <RouterLink :to="{ name: 'movie-detail', params: { id: movie.id } }" class="movie-card">
    <div class="movie-card__poster" :style="{ background: `linear-gradient(150deg, ${g1}, ${g2})` }">
      <img v-if="posterUrl" :src="posterUrl" :alt="movie.title" loading="lazy" class="movie-card__image" />
      <div v-else class="movie-card__letter">{{ letter }}</div>

      <div class="movie-card__rating">★ {{ rating }}</div>

      <div class="movie-card__overlay">
        <div class="movie-card__overlay-title">{{ movie.title }}</div>
        <div class="movie-card__overlay-meta">{{ year }} · {{ genre }}</div>
      </div>
    </div>
    <div class="movie-card__title">{{ movie.title }}</div>
  </RouterLink>
</template>

<style scoped>
.movie-card {
  display: block;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.movie-card__poster {
  position: relative;
  aspect-ratio: 2 / 3;
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.35s;
}

.movie-card:hover .movie-card__poster {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 24px 44px -18px rgba(0, 0, 0, 0.8);
}

.movie-card__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-card__letter {
  position: absolute;
  top: 36px;
  left: 0;
  right: 0;
  text-align: center;
  font-family: 'Archivo Expanded', 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 96px;
  color: rgba(255, 255, 255, 0.14);
  line-height: 1;
}

.movie-card__rating {
  position: absolute;
  top: 10px;
  right: 10px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.66);
  padding: 4px 8px;
  border-radius: 8px;
  color: var(--accent);
}

.movie-card__overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 14px 12px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.9), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.movie-card:hover .movie-card__overlay {
  opacity: 1;
}

.movie-card__overlay-title {
  font-weight: 800;
  font-size: 14px;
  line-height: 1.2;
}

.movie-card__overlay-meta {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: #a1a1aa;
  margin-top: 3px;
}

.movie-card__title {
  font-weight: 600;
  font-size: 13px;
  margin-top: 9px;
  line-height: 1.25;
  color: #e4e4e7;
}
</style>
