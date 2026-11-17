<script setup>
// these components live in @voidzero-dev/vitepress-theme
import Footer from '@components/oss/Footer.vue'
import HeadingSection from '@components/oss/HeadingSection.vue'
import Sponsors from '@components/oss/Sponsors.vue'
import TrustedBy from '@components/oss/TrustedBy.vue'
import Spacer from '@components/shared/Spacer.vue'
import { computed } from 'vue'
import { useSponsor } from '../composables/sponsor'
import ViteCommunity from './Community.vue'
import ViteFeatureGrid1 from './FeatureGrid1.vue'
import ViteFeatureGrid2 from './FeatureGrid2.vue'
import ViteFrameworks from './Frameworks.vue'
import Hero from './Hero.vue'

const data = useSponsor()

const sponsors = computed(
  () => data.value?.filter((s) => s.tier !== 'Brought to you by') ?? [],
)
</script>

<template>
  <Hero />
  <TrustedBy
    :logos="['openai', 'shopify', 'stripe', 'linear', 'clickup', 'wiz']"
  />
  <HeadingSection
    heading="Die Entwicklererfahrung neu definieren"
    subheading="Mit Vite macht Webentwicklung wieder Spaß"
  />
  <ViteFeatureGrid1 />
  <HeadingSection heading="Eine gemeinsame Grundlage, auf der wir aufbauen können" />
  <ViteFeatureGrid2 />
  <HeadingSection heading="Unterstützung für Ihre bevorzugten Frameworks und Tools" />
  <ViteFrameworks />
  <ViteCommunity />
  <Sponsors :sponsors="sponsors" />
  <Spacer />
  <Footer
    heading="Beginnen Sie mit Vite"
    subheading="Machen Sie sich bereit für eine Entwicklungsumgebung, die endlich mit Ihren Gedanken Schritt halten kann."
    button-text="Erste Schritte"
    button-link="/guide/"
  />
</template>