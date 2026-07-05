<script setup lang="ts">
import { onMounted } from 'vue'
import { env } from '@/shared/config/env'
import { loadAdsenseScript } from '@/shared/lib/load-adsense-script'

withDefaults(
  defineProps<{
    format?: string
    fullWidthResponsive?: boolean
  }>(),
  {
    format: 'auto',
    fullWidthResponsive: true,
  },
)

onMounted(() => {
  if (!env.adsenseEnabled) return
  loadAdsenseScript()
  try {
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch {
    // AdSense script may not be ready yet (e.g. blocked by an ad blocker) — fail silently.
  }
})
</script>

<template>
  <ins
    v-if="env.adsenseEnabled"
    class="adsbygoogle ad-slot"
    style="display: block"
    :data-ad-client="env.adsenseClientId"
    :data-ad-slot="env.adsenseSlotId"
    :data-ad-format="format"
    :data-full-width-responsive="fullWidthResponsive"
  />
</template>

<style scoped>
.ad-slot {
  min-height: 1px;
}
</style>
