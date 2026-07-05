import { env } from '@/shared/config/env'

let loaded = false

export function loadAdsenseScript() {
  if (loaded || !env.adsenseEnabled) return
  loaded = true

  const script = document.createElement('script')
  script.async = true
  script.crossOrigin = 'anonymous'
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.adsenseClientId}`
  document.head.appendChild(script)
}
