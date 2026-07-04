<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
  }>(),
  {
    message: 'Something went wrong. Please try again.',
  },
)

defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="error-state">
    <p class="error-state__message">{{ message }}</p>
    <button type="button" class="error-state__retry" @click="$emit('retry')">Retry</button>
  </div>
</template>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 90px 0;
  text-align: center;
}

.error-state__message {
  font-size: 14px;
  color: #f87171;
}

.error-state__retry {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #f4f4f5;
  font: inherit;
  font-weight: 600;
  font-size: 13px;
  padding: 9px 18px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s;
}

.error-state__retry:hover {
  background: rgba(255, 255, 255, 0.14);
}
</style>
