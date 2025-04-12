<script setup lang="ts">
import CommunityCard, { Testimonial } from './CommunityCard.vue'
import placeholderAvatar from '/images/community/placeholder.jpg'

const testimonials: Testimonial[] = [
  {
    name: 'Ryan Carniato',
    handle: '@RyanCarniato',
    avatar:
      'https://pbs.twimg.com/profile_images/1810837163447308292/8Piov0f6_400x400.jpg',
    comment: [
      `Mir gefällt, was Vite ermöglicht. Bei der Entwicklung von SolidStart haben wir festgestellt, dass es sich weniger um ein Metaframework als vielmehr um ein System von symbiotischen Vite-Plugins handelt. Obwohl sie mit SolidJS im Hinterkopf entwickelt wurden, sollten sie von unserer einfachsten Vorlage bis zum meinungsstarken Starter skalierbar sein. Wir bauen ein Ökosystem auf Vite auf.`,
    ],
  },
  {
    name: 'Rich Harris',
    handle: '@Rich_Harris',
    avatar:
      'https://pbs.twimg.com/profile_images/557940120184041473/bFyXy8Pu_400x400.jpeg',
    comment: [
      `Vite ist im Grunde genommen die Vereinten Nationen von JavaScript. Ich werde als Vertreter von Sveltelandia dort sein.`,
    ],
  },
  {
    name: 'David East',
    handle: '@_davideast',
    avatar:
      'https://pbs.twimg.com/profile_images/1691627325794725888/voQFcYjY_400x400.jpg',
    comment: [
      'Jedes Mal, wenn ich Vite benutze, empfinde ich ein wahres Gefühl der reinen und unbändigen Freude.',
    ],
  },
  {
    name: 'Mark Dalgleish',
    handle: '@markdalgleish',
    avatar:
      'https://pbs.twimg.com/profile_images/754886061872979968/BzaOWhs1_400x400.jpg',
    comment: [
      `Es ist auch eine großartige Plattform zum Aufbau eines Frameworks, da sie eine anpassbare Entwicklungsumgebung bietet.`,
      `Auch die Community ist fantastisch.`,
    ],
  },
  {
    name: 'Jason Miller',
    handle: '@_developit',
    avatar:
      'https://pbs.twimg.com/profile_images/1374778373239681025/Sc9ehtAr_400x400.jpg',
    comment: [
      `Jedes Mal, wenn ich vermute, dass ich die Grenzen dessen, was Vite kann, erreicht habe, liege ich falsch.`,
    ],
  },
  {
    name: 'David Cramer',
    handle: '@zeeg',
    avatar:
      'https://pbs.twimg.com/profile_images/1706891973553168384/zdAPOznc_400x400.jpg',
    comment: ['Vite hat die Branche grundlegend verändert.'],
  },
  {
    name: 'Dion Almaer',
    handle: '@dalmaer',
    avatar:
      'https://pbs.twimg.com/profile_images/3380865881/f73b3687ff39b795db05fcaf35972270_400x400.jpeg',
    comment: [
      'Ich bin begeistert, dass sich so viele großartige Rahmenwerke auf Vite zusammenschließen. So viele werden davon profitieren. ❤️ an das vite-Team.',
    ],
  },
  {
    name: 'Christoph Nakazawa',
    handle: '@cpojer',
    avatar:
      'https://pbs.twimg.com/profile_images/1189537722286952449/OrscO0bD_400x400.jpg',
    comment: ['Vite wird die (JavaScript-)Welt verschlingen.'],
  },
  {
    name: 'Nikolaj',
    handle: '@lopugit',
    avatar: 'https://avatars.githubusercontent.com/u/13629190?v=4',
    comment: [
      'Wow, wow, wow, wow, wow, wow, Vite ist..... Vite ist.... Wow 🤤🤯🙏',
    ],
  },
]
</script>

<template>
  <section class="community-section">
    <h2>Von der Community geliebt</h2>
    <h3>
      Vertrauen Sie nicht nicht auf unser Wort, sondern lesen Sie, was die
      Mitglieder der Vite-Community selbst sagen.
    </h3>
    <div class="community-grid-container">
      <div class="community-grid">
        <CommunityCard
          :testimonial="testimonial"
          v-for="testimonial in testimonials"
          :key="testimonial.name"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.community-section {
  margin-top: 140px;
  display: none;

  @media (min-width: 768px) {
    display: block;
  }

  h2 {
    background: linear-gradient(0deg, #fff 0%, rgba(255, 255, 255, 0.76) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0 auto 10px;
    text-align: center;
  }

  h3 {
    width: 455px;
    max-width: 100%;
    margin: 0 auto;
    text-align: center;
  }

  .community-grid-container {
    position: relative;
  }

  .community-grid {
    column-count: 2;
    column-gap: 25px;
    width: calc(100% - 50px);
    margin: 40px auto 0;

    @media (min-width: 1150px) {
      column-count: 3;
      width: 1100px;
    }
  }
}
</style>
