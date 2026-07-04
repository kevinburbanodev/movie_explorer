<script setup lang="ts">
import { computed } from 'vue'
import { tmdbImageUrl } from '@/shared/lib/tmdb-image'
import type { WatchProviders } from '@/features/movies/types/movie.types'

const props = defineProps<{
  providers: WatchProviders
  labels: { stream: string; rent: string; buy: string; empty: string; poweredBy: string }
}>()

const groups = computed(() =>
  [
    { key: 'flatrate', label: props.labels.stream, items: props.providers.flatrate },
    { key: 'rent', label: props.labels.rent, items: props.providers.rent },
    { key: 'buy', label: props.labels.buy, items: props.providers.buy },
  ].filter((group) => group.items.length > 0),
)

const isEmpty = computed(() => groups.value.length === 0)
</script>

<template>
  <div v-if="isEmpty" class="watch-providers watch-providers--empty">{{ labels.empty }}</div>
  <div v-else class="watch-providers">
    <div class="watch-providers__groups">
      <div v-for="group in groups" :key="group.key" class="watch-providers__group">
        <span class="watch-providers__label">{{ group.label }}</span>
        <span class="watch-providers__logos">
          <a
            v-for="provider in group.items"
            :key="provider.id"
            :href="providers.link ?? undefined"
            target="_blank"
            rel="noopener noreferrer"
            class="watch-providers__logo"
            :title="provider.name"
          >
            <img
              v-if="tmdbImageUrl(provider.logoPath, 'w92')"
              :src="tmdbImageUrl(provider.logoPath, 'w92')!"
              :alt="provider.name"
              loading="lazy"
            />
            <span v-else class="watch-providers__logo-fallback">{{ provider.name.charAt(0) }}</span>
          </a>
        </span>
      </div>
    </div>
    <div class="watch-providers__attribution">{{ labels.poweredBy }}</div>
  </div>
</template>

<style scoped>
.watch-providers {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.watch-providers--empty {
  font-size: 14px;
  color: #71717a;
}

.watch-providers__groups {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.watch-providers__group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.watch-providers__label {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #a1a1aa;
}

.watch-providers__logos {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.watch-providers__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  transition: transform 0.2s;
}

.watch-providers__logo:hover {
  transform: translateY(-3px);
}

.watch-providers__logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.watch-providers__logo-fallback {
  font-family: 'Archivo Expanded', 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.4);
}

.watch-providers__attribution {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: #52525b;
}
</style>
