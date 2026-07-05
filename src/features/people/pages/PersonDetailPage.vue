<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePersonDetailStore } from '@/features/people/store/person-detail.store'
import { tmdbImageUrl } from '@/shared/lib/tmdb-image'
import { gradientFor, letterFor } from '@/shared/lib/movie-visual'
import { useLocaleStore } from '@/shared/i18n/locale.store'
import { useStrings } from '@/shared/i18n/strings'
import { departmentName } from '@/shared/i18n/departments'
import MovieGrid from '@/features/movies/components/MovieGrid.vue'
import LanguageToggle from '@/shared/components/LanguageToggle.vue'
import SkeletonGrid from '@/shared/components/SkeletonGrid.vue'
import ErrorState from '@/shared/components/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const store = usePersonDetailStore()
const { locale } = storeToRefs(useLocaleStore())
const t = computed(() => useStrings(locale.value))

const personId = computed(() => Number(route.params.id))

function load() {
  store.fetchPerson(personId.value)
}

onMounted(load)
watch(personId, load)

function goBack() {
  router.back()
}

const photoUrl = computed(() => (store.person ? tmdbImageUrl(store.person.profilePath, 'w500') : null))
const [g1, g2] = computed(() => (store.person ? gradientFor(store.person.id) : ['#1c1917', '#0f172a'])).value

const dateLocale = computed(() => (locale.value === 'es' ? 'es-ES' : 'en-US'))

function formatDate(value: string | null): string | null {
  if (!value) return null
  return new Date(value).toLocaleDateString(dateLocale.value, { year: 'numeric', month: 'long', day: 'numeric' })
}

const birthdayLabel = computed(() => formatDate(store.person?.birthday ?? null))
const deathdayLabel = computed(() => formatDate(store.person?.deathday ?? null))
const departmentLabel = computed(() =>
  store.person?.knownForDepartment ? departmentName(store.person.knownForDepartment, locale.value) : '',
)
</script>

<template>
  <div class="person-detail-page">
    <SkeletonGrid v-if="store.status === 'loading'" :count="6" />
    <ErrorState v-else-if="store.status === 'error'" :message="store.errorMessage" @retry="load" />

    <template v-else-if="store.person">
      <div class="topbar">
        <button type="button" class="topbar__back" @click="goBack">
          <span class="topbar__back-arrow" /> {{ t.back }}
        </button>
        <LanguageToggle />
      </div>

      <div class="content">
        <div class="profile">
          <div class="profile__photo" :style="{ background: `linear-gradient(150deg, ${g1}, ${g2})` }">
            <img v-if="photoUrl" :src="photoUrl" :alt="store.person.name" class="profile__photo-image" />
            <span v-else class="profile__photo-letter">{{ letterFor(store.person.name) }}</span>
          </div>
          <div class="profile__info">
            <h1 class="profile__name">{{ store.person.name }}</h1>
            <div v-if="departmentLabel" class="profile__department">
              {{ t.knownFor(departmentLabel) }}
            </div>
            <dl class="profile__facts">
              <template v-if="birthdayLabel">
                <dt>{{ t.born }}</dt>
                <dd>{{ birthdayLabel }}<span v-if="store.person.placeOfBirth"> · {{ store.person.placeOfBirth }}</span></dd>
              </template>
              <template v-if="deathdayLabel">
                <dt>{{ t.diedOn }}</dt>
                <dd>{{ deathdayLabel }}</dd>
              </template>
            </dl>
          </div>
        </div>

        <div class="section-title">{{ t.biography }}</div>
        <p class="biography">{{ store.person.biography || t.noBiography }}</p>

        <template v-if="store.person.filmography.length">
          <div class="section-title section-title--filmography">{{ t.filmography }}</div>
          <MovieGrid :movies="store.person.filmography" />
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
.person-detail-page {
  animation: detail-in 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 40px;
}

.topbar__back {
  display: flex;
  align-items: center;
  gap: 9px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.16);
  padding: 9px 16px 9px 13px;
  border-radius: 999px;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: #f4f4f5;
  transition: background 0.2s;
}

.topbar__back:hover {
  background: rgba(255, 255, 255, 0.12);
}

.topbar__back-arrow {
  border-right: 8px solid #fff;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 40px 70px;
}

.profile {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  margin-bottom: 12px;
}

.profile__photo {
  flex: 0 0 200px;
  aspect-ratio: 2 / 3;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 24px 48px -20px rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile__photo-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile__photo-letter {
  font-family: 'Archivo Expanded', 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 72px;
  color: rgba(255, 255, 255, 0.2);
}

.profile__info {
  flex: 1;
  padding-top: 8px;
  min-width: 0;
}

.profile__name {
  font-family: 'Archivo Expanded', 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 40px;
  line-height: 1.05;
  margin: 0;
  letter-spacing: -0.01em;
}

.profile__department {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
  margin-top: 10px;
}

.profile__facts {
  margin: 20px 0 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.profile__facts dt {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #71717a;
}

.profile__facts dd {
  margin: 0 0 8px;
  font-size: 14px;
  color: #d4d4d8;
}

.section-title {
  font-family: 'Archivo Expanded', 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 22px;
  margin: 32px 0 14px;
}

.section-title--filmography {
  margin-top: 40px;
}

.biography {
  font-size: 15px;
  line-height: 1.65;
  color: #d4d4d8;
  max-width: 760px;
  white-space: pre-line;
}

@media (max-width: 640px) {
  .topbar {
    padding: 16px 20px;
  }

  .content {
    padding: 14px 20px 50px;
  }

  .profile {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
  }

  .profile__photo {
    flex-basis: auto;
    width: 160px;
  }

  .profile__facts {
    align-items: center;
  }

  .profile__name {
    font-size: 30px;
  }
}
</style>
