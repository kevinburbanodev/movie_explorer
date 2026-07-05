<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { tmdbImageUrl } from '@/shared/lib/tmdb-image'
import { letterFor } from '@/shared/lib/movie-visual'
import type { CastMember } from '@/features/movies/types/movie.types'

const props = defineProps<{ cast: CastMember[] }>()

const ITEMS_PER_STEP = 6

const track = ref<HTMLElement | null>(null)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

let isDragging = false
let dragStartX = 0
let dragStartScrollLeft = 0
let didDrag = false

function updateArrowState() {
  const el = track.value
  if (!el) return
  canScrollPrev.value = el.scrollLeft > 4
  canScrollNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}

function stepWidth() {
  const el = track.value
  const item = el?.querySelector<HTMLElement>('.cast-list__item')
  if (!el || !item) return 0
  const gap = parseFloat(getComputedStyle(el).columnGap || '0')
  return (item.offsetWidth + gap) * ITEMS_PER_STEP
}

function scrollPrev() {
  track.value?.scrollBy({ left: -stepWidth(), behavior: 'smooth' })
}

function scrollNext() {
  track.value?.scrollBy({ left: stepWidth(), behavior: 'smooth' })
}

// Deliberately avoid setPointerCapture here: capturing the pointer on the
// track element causes the browser to dispatch the native "click" event to
// the track itself instead of the RouterLink under the cursor, which
// silently breaks navigation on a plain (non-drag) click. Tracking the drag
// via window-level listeners keeps native click targeting intact.
function onPointerDown(event: PointerEvent) {
  const el = track.value
  if (!el || event.button !== 0) return
  isDragging = true
  didDrag = false
  dragStartX = event.clientX
  dragStartScrollLeft = el.scrollLeft
  window.addEventListener('pointermove', onWindowPointerMove)
  window.addEventListener('pointerup', onWindowPointerUp)
  window.addEventListener('pointercancel', onWindowPointerUp)
}

function onWindowPointerMove(event: PointerEvent) {
  const el = track.value
  if (!isDragging || !el) return
  const delta = event.clientX - dragStartX
  if (Math.abs(delta) > 4) didDrag = true
  el.scrollLeft = dragStartScrollLeft - delta
}

function onWindowPointerUp() {
  isDragging = false
  window.removeEventListener('pointermove', onWindowPointerMove)
  window.removeEventListener('pointerup', onWindowPointerUp)
  window.removeEventListener('pointercancel', onWindowPointerUp)
}

function onClickCapture(event: MouseEvent) {
  if (didDrag) {
    event.preventDefault()
    event.stopPropagation()
  }
}

watch(
  () => props.cast,
  () => {
    if (track.value) track.value.scrollLeft = 0
    void nextTick(updateArrowState)
  },
)

onMounted(() => void nextTick(updateArrowState))
onUnmounted(onWindowPointerUp)
</script>

<template>
  <div class="cast-list">
    <button
      type="button"
      class="cast-list__arrow cast-list__arrow--prev"
      :disabled="!canScrollPrev"
      :aria-label="'Previous'"
      @click="scrollPrev"
    >
      ‹
    </button>

    <div
      ref="track"
      class="cast-list__track"
      @scroll="updateArrowState"
      @pointerdown="onPointerDown"
      @click.capture="onClickCapture"
    >
      <RouterLink
        v-for="member in cast"
        :key="member.id"
        :to="{ name: 'person-detail', params: { id: member.id } }"
        class="cast-list__item"
        draggable="false"
      >
        <div class="cast-list__avatar">
          <img
            v-if="tmdbImageUrl(member.profilePath, 'w185')"
            :src="tmdbImageUrl(member.profilePath, 'w185')!"
            :alt="member.name"
            loading="lazy"
            draggable="false"
            class="cast-list__avatar-image"
          />
          <span v-else>{{ letterFor(member.name) }}</span>
        </div>
        <div class="cast-list__name">{{ member.name }}</div>
        <div class="cast-list__character">{{ member.character }}</div>
      </RouterLink>
    </div>

    <button
      type="button"
      class="cast-list__arrow cast-list__arrow--next"
      :disabled="!canScrollNext"
      :aria-label="'Next'"
      @click="scrollNext"
    >
      ›
    </button>
  </div>
</template>

<style scoped>
.cast-list {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cast-list__track {
  display: flex;
  gap: 18px;
  overflow-x: auto;
  padding-bottom: 12px;
  cursor: grab;
  scrollbar-width: none;
  -ms-overflow-style: none;
  user-select: none;
  touch-action: pan-y;
}

.cast-list__track:active {
  cursor: grabbing;
}

.cast-list__track::-webkit-scrollbar {
  display: none;
}

.cast-list__item {
  flex: 0 0 116px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  display: block;
}

.cast-list__avatar {
  width: 116px;
  height: 116px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(150deg, #3f3f46, #18181b);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Archivo Expanded', 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 34px;
  color: rgba(255, 255, 255, 0.35);
}

.cast-list__avatar-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.cast-list__name {
  font-weight: 600;
  font-size: 13px;
  margin-top: 10px;
  line-height: 1.2;
}

.cast-list__character {
  font-size: 12px;
  color: #71717a;
  margin-top: 2px;
  line-height: 1.2;
}

.cast-list__arrow {
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.5);
  color: #f4f4f5;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.2s,
    opacity 0.2s;
}

.cast-list__arrow:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.14);
}

.cast-list__arrow:disabled {
  opacity: 0.25;
  cursor: default;
}
</style>
