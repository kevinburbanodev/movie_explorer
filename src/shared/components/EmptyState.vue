<script setup lang="ts">
defineProps<{
  title: string
  message: string
}>()
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__title">{{ title }}</div>
    <div class="empty-state__message">{{ message }}</div>
  </div>
</template>

<style scoped>
.empty-state {
  padding: 90px 0;
  text-align: center;
}

.empty-state__title {
  font-family: 'Archivo Expanded', 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 30px;
  color: #3f3f46;
}

.empty-state__message {
  font-size: 14px;
  color: #71717a;
  margin-top: 10px;
}
</style>
