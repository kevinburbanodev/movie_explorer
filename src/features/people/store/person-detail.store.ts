import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { peopleApi } from '@/features/people/api/people.api'
import { useLocaleStore } from '@/shared/i18n/locale.store'
import type { PersonDetail } from '@/features/people/types/person.types'

export const usePersonDetailStore = defineStore('personDetail', () => {
  const localeStore = useLocaleStore()

  const person = ref<PersonDetail | null>(null)
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
  const errorMessage = ref('')
  let currentId: number | null = null

  async function fetchPerson(id: number) {
    currentId = id
    status.value = 'loading'
    errorMessage.value = ''
    person.value = null

    try {
      person.value = await peopleApi.getDetail(id)
      status.value = 'success'
    } catch (error) {
      status.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : 'Something went wrong'
    }
  }

  watch(
    () => localeStore.locale,
    () => {
      if (currentId !== null) void fetchPerson(currentId)
    },
  )

  return { person, status, errorMessage, fetchPerson }
})
