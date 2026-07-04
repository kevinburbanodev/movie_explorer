import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Locale = 'en' | 'es'

const STORAGE_KEY = 'me_lang'
const TMDB_LANGUAGE: Record<Locale, string> = { en: 'en-US', es: 'es-ES' }
const TMDB_WATCH_REGION: Record<Locale, string> = { en: 'US', es: 'ES' }

export const useLocaleStore = defineStore('locale', () => {
  const storedLocale = localStorage.getItem(STORAGE_KEY)
  const locale = ref<Locale>(storedLocale === 'es' ? 'es' : 'en')

  watch(locale, (value) => localStorage.setItem(STORAGE_KEY, value))

  function setLocale(value: Locale) {
    locale.value = value
  }

  function tmdbLanguage() {
    return TMDB_LANGUAGE[locale.value]
  }

  function tmdbWatchRegion() {
    return TMDB_WATCH_REGION[locale.value]
  }

  return { locale, setLocale, tmdbLanguage, tmdbWatchRegion }
})
