import type { Sponsor, SponsorTier } from '@voidzero-dev/vitepress-theme'
import { onMounted, ref } from 'vue'

interface Sponsors {
  main: Sponsor[]
  partnership: Sponsor[]
  platinum: Sponsor[]
  gold: Sponsor[]
}

// shared data across instances so we load only once.
const data = ref<SponsorTier[]>()

export function useSponsor() {
  onMounted(async () => {
    if (data.value) return

    const result = await fetch('https://sponsors.vite.dev/sponsors.json')
    const sponsors: Sponsors = await result.json()

    data.value = [
      {
        tier: 'Präsentiert von',
        size: 'big',
        items: sponsors.main,
      },
      {
        tier: 'In Kooperation mit',
        size: 'big',
        items: sponsors.partnership,
      },
      {
        tier: 'Platin-Sponsoren',
        size: 'big',
        items: sponsors.platinum,
      },
      {
        tier: 'Gold-Sponsoren',
        size: 'medium',
        items: sponsors.gold,
      },
    ]
  })

  return data
}
