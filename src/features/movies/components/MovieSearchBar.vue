<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import { ref, watch } from 'vue'

defineProps<{ placeholder: string }>()
const emit = defineEmits<{ search: [query: string] }>()

const input = ref('')
const debouncedInput = refDebounced(input, 350)

watch(debouncedInput, (value) => emit('search', value))
</script>

<template>
  <div class="search-bar">
    <input v-model="input" type="search" :placeholder="placeholder" class="search-bar__input" />
    <span class="search-bar__icon-ring" />
    <span class="search-bar__icon-handle" />
  </div>
</template>

<style scoped>
.search-bar {
  position: relative;
  flex: 1;
  max-width: 460px;
}

.search-bar__input {
  width: 100%;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #fff;
  border-radius: 999px;
  padding: 12px 18px 12px 44px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.search-bar__input:focus {
  border-color: var(--accent);
  background: rgba(255, 255, 255, 0.1);
}

.search-bar__icon-ring {
  position: absolute;
  left: 17px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.55);
  border-radius: 50%;
  pointer-events: none;
}

.search-bar__icon-handle {
  position: absolute;
  left: 28px;
  top: calc(50% + 5px);
  width: 8px;
  height: 2px;
  background: rgba(255, 255, 255, 0.55);
  transform: rotate(45deg);
  pointer-events: none;
}
</style>
