<script setup lang="ts">
withDefaults(defineProps<{ count?: number }>(), { count: 12 })
</script>

<template>
  <div class="skeleton-grid">
    <div v-for="i in count" :key="i" class="skeleton-grid__tile" />
  </div>
</template>

<style scoped>
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

@media (min-width: 640px) {
  .skeleton-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 900px) {
  .skeleton-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1200px) {
  .skeleton-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

.skeleton-grid__tile {
  aspect-ratio: 2 / 3;
  border-radius: 12px;
  background: linear-gradient(100deg, #141416 30%, #242427 50%, #141416 70%);
  background-size: 600px 100%;
  animation: shimmer 1.3s infinite linear;
}
</style>
