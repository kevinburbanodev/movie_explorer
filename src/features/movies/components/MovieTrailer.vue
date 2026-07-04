<script setup lang="ts">
defineProps<{ trailerKey: string | null; noTrailerLabel: string }>()
</script>

<template>
  <div v-if="trailerKey" class="trailer">
    <iframe
      :src="`https://www.youtube.com/embed/${trailerKey}`"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="trailer__frame"
    />
  </div>
  <div v-else class="trailer trailer--empty">
    <div class="trailer__play-icon" />
    {{ noTrailerLabel }}
  </div>
</template>

<style scoped>
.trailer {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 30px 60px -24px rgba(0, 0, 0, 0.9);
}

.trailer__frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.trailer--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  background: repeating-linear-gradient(45deg, #141416, #141416 12px, #111113 12px, #111113 24px);
  color: #52525b;
  font-family: 'Space Mono', monospace;
  font-size: 13px;
}

.trailer__play-icon {
  width: 0;
  height: 0;
  border-left: 26px solid #3f3f46;
  border-top: 16px solid transparent;
  border-bottom: 16px solid transparent;
}
</style>
