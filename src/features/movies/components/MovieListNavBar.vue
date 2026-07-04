<script setup lang="ts">
import MovieSearchBar from '@/features/movies/components/MovieSearchBar.vue'
import LanguageToggle from '@/shared/components/LanguageToggle.vue'

defineProps<{
  searchPlaceholder: string
  headline: string
}>()

defineEmits<{ search: [query: string] }>()
</script>

<template>
  <div class="nav-bar">
    <div class="nav-bar__logo">CINE·PLEX</div>
    <MovieSearchBar :placeholder="searchPlaceholder" @search="(q) => $emit('search', q)" />
    <div class="nav-bar__actions">
      <LanguageToggle />
      <div class="nav-bar__headline">{{ headline }}</div>
    </div>
  </div>
</template>

<style scoped>
.nav-bar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 40px;
  background: linear-gradient(180deg, #08080a 60%, rgba(8, 8, 10, 0.7));
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-wrap: wrap;
}

.nav-bar__logo {
  font-family: 'Archivo Expanded', 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 20px;
  letter-spacing: 0.04em;
}

.nav-bar__actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-bar__headline {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  color: #71717a;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .nav-bar {
    padding: 16px 20px;
  }
}
</style>
