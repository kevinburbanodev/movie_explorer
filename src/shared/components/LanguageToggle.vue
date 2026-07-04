<script setup lang="ts">
import { useLocaleStore } from '@/shared/i18n/locale.store'

const localeStore = useLocaleStore()
</script>

<template>
  <div class="lang-toggle">
    <button
      type="button"
      class="lang-toggle__option"
      :class="{ 'lang-toggle__option--active': localeStore.locale === 'en' }"
      @click="localeStore.setLocale('en')"
    >
      EN
    </button>
    <button
      type="button"
      class="lang-toggle__option"
      :class="{ 'lang-toggle__option--active': localeStore.locale === 'es' }"
      @click="localeStore.setLocale('es')"
    >
      ES
    </button>
  </div>
</template>

<style scoped>
.lang-toggle {
  display: flex;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  overflow: hidden;
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(8px);
}

.lang-toggle__option {
  padding: 7px 13px;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
  background: transparent;
  color: #a1a1aa;
  border: none;
  font: inherit;
}

.lang-toggle__option--active {
  background: #f4f4f5;
  color: #08080a;
}
</style>
