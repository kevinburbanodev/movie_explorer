<script setup lang="ts">
import MovieCard from '@/features/movies/components/MovieCard.vue'
import type { Movie } from '@/features/movies/types/movie.types'

defineProps<{ movies: Movie[] }>()
</script>

<template>
  <div class="movie-grid">
    <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
  </div>
</template>

<style scoped>
.movie-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

@media (min-width: 640px) {
  .movie-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 900px) {
  .movie-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1200px) {
  .movie-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
