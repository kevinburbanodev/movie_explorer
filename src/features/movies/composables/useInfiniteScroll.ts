import { useIntersectionObserver } from '@vueuse/core'
import type { Ref } from 'vue'

export function useInfiniteScroll(target: Ref<HTMLElement | null>, onIntersect: () => void) {
  useIntersectionObserver(target, ([entry]) => {
    if (entry?.isIntersecting) onIntersect()
  })
}
