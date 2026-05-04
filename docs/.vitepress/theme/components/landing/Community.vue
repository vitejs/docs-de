<script setup lang="ts">
import githubIcon from '@assets/social/github-light.svg'

interface Testimonial {
  name: string
  handle: string
  avatar: string
  comment: string[]
}

const testimonials: Testimonial[] = [
  {
    name: 'Ryan Carniato',
    handle: '@RyanCarniato',
    avatar:
      'https://pbs.twimg.com/profile_images/1810837163447308292/8Piov0f6_400x400.jpg',
    comment: [
      `Ich bin begeistert von den Möglichkeiten, die Vite bietet. Bei der Entwicklung von SolidStart haben wir festgestellt, dass es sich weniger um ein Meta-Framework handelt, sondern vielmehr um ein System aus symbiotisch zusammenwirkenden Vite-Plugins. Obwohl sie mit Blick auf SolidJS entwickelt wurden, sollten sie von unserer einfachsten Vorlage bis hin zu einem vorgefertigten Starter skalierbar sein. Wir bauen ein Ökosystem auf Vite auf.`,
    ],
  },
  {
    name: 'Rich Harris',
    handle: '@Rich_Harris',
    avatar:
      'https://pbs.twimg.com/profile_images/557940120184041473/bFyXy8Pu_400x400.jpeg',
    comment: [
      `Vite ist im Grunde genommen mittlerweile so etwas wie die „Vereinten Nationen“ von JavaScript. Ich werde als Vertreter von Sveltelandia dabei sein.`,
    ],
  },
  {
    name: 'David East',
    handle: '@_davideast',
    avatar:
      'https://pbs.twimg.com/profile_images/1691627325794725888/voQFcYjY_400x400.jpg',
    comment: [
      'Jedes Mal, wenn ich Vite benutze, verspüre ich ein echtes Gefühl von purer und unbändiger Freude.',
    ],
  },
  {
    name: 'Mark Dalgleish',
    handle: '@markdalgleish',
    avatar:
      'https://pbs.twimg.com/profile_images/754886061872979968/BzaOWhs1_400x400.jpg',
    comment: [
      `Es ist zudem eine hervorragende Plattform für die Entwicklung eines Frameworks, da es eine erweiterbare Entwicklungsumgebung bietet.`,
      `Die Gemeinschaft ist auch toll.`,
    ],
  },
  {
    name: 'Jason Miller',
    handle: '@_developit',
    avatar:
      'https://pbs.twimg.com/profile_images/1374778373239681025/Sc9ehtAr_400x400.jpg',
    comment: [
      `Jedes Mal, wenn ich glaube, an die Grenzen dessen gestoßen zu sein, was Vite leisten kann, muss ich feststellen, dass ich mich geirrt habe.`,
    ],
  },
  {
    name: 'David Cramer',
    handle: '@zeeg',
    avatar:
      'https://pbs.twimg.com/profile_images/1911613315765133312/HVkULegC_400x400.jpg',
    comment: ['Vite hat die Branche grundlegend verändert.'],
  },
  {
    name: 'Dion Almaer',
    handle: '@dalmaer',
    avatar:
      'https://pbs.twimg.com/profile_images/3380865881/f73b3687ff39b795db05fcaf35972270_400x400.jpeg',
    comment: [
      'Ich freue mich riesig, dass so viele großartige Frameworks auf Basis von Vite zusammenarbeiten. Davon werden so viele profitieren. ❤️ an das Vite-Team.',
    ],
  },
  {
    name: 'Christoph Nakazawa',
    handle: '@cpojer',
    avatar:
      'https://pbs.twimg.com/profile_images/1910252462126313472/gXgT-jxL_400x400.jpg',
    comment: ['Vite wird die (JavaScript-)Welt erobern.'],
  },
  {
    name: 'Nikolaj',
    handle: '@lopugit',
    avatar: 'https://avatars.githubusercontent.com/u/13629190?v=4',
    comment: [
      'Wow, wow, wow, wow, wow, wow, Vite ist … Vite ist … Wow 🤤🤯🙏',
    ],
  },
]
</script>

<template>
  <div class="wrapper wrapper--ticks border-t pt-14 sm:pt-30 px-5 sm:px-10">
    <div class="flex flex-col sm:flex-row justify-between items-center gap-8 sm:gap-20 text-center sm:text-left">
      <div class="flex flex-col gap-3">
        <h3 class="text-white max-w-xl text-balance">Geliebt von der Community</h3>
        <p class="max-w-md text-white/70 text-balance">
          Glauben Sie nicht nur uns - hören Sie sich an, was die Mitglieder der Vite-Community zu sagen haben.
        </p>
      </div>
      <div class="flex gap-8 sm:gap-12 items-start justify-center sm:justify-start sm:pr-20">
        <!-- GitHub Stars -->
        <div class="flex flex-col gap-3">
          <h2 class="text-white">75k+</h2>
          <p class="text-grey flex items-center gap-2">
            <img :src="githubIcon" alt="" class="size-6" />
            Github-Sterne
          </p>
        </div>

        <!-- NPM Downloads -->
        <div class="flex flex-col gap-3">
          <h2 class="text-white">40m+</h2>
          <p class="text-grey">Wöchentliche NPM-Downloads</p>
        </div>
      </div>
    </div>
    <div
      class="pt-14 sm:pt-30 h-[50rem] overflow-clip [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]">
      <!-- Masonry Grid -->
      <div class="columns-1 sm:columns-2 lg:columns-3 gap-5">
        <div v-for="(testimonial, index) in testimonials" :key="index" class="break-inside-avoid mb-5">
          <div
            class="testimonial-card relative overflow-clip isolate rounded-lg p-6 sm:px-8 sm:py-10 flex flex-col gap-6 before:content-[''] before:absolute before:inset-0 before:opacity-0 before:z-0 before:pointer-events-none before:transition-opacity before:duration-100 before:ease-in-out after:content-[''] after:absolute after:inset-px after:z-[1] after:rounded-lg after:bg-slate after:border after:border-nickel after:transition-[border-color,background] after:duration-100 after:ease-in-out hover:before:opacity-100 hover:after:border-transparent">
            <!-- Comment -->
            <div class="relative z-[2] flex flex-col gap-4">
              <p v-for="(paragraph, pIndex) in testimonial.comment" :key="pIndex"
                class="text-white/70 leading-relaxed text-sm sm:text-base">
                {{ paragraph }}
              </p>
            </div>

            <!-- Author -->
            <div class="relative z-[2] flex items-center gap-5 mt-auto">
              <!-- Avatar -->
              <img :src="testimonial.avatar" :alt="testimonial.name"
                class="w-12 h-12 rounded-sm object-cover flex-shrink-0" loading="lazy" />

              <!-- Author info -->
              <div class="flex flex-col">
                <span class="text-grey text-sm font-mono">{{
                  testimonial.name
                  }}</span>
                <span class="text-biege text-sm font-mono">{{
                  testimonial.handle
                  }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Background image and animation for ::before pseudo-element */
.testimonial-card::before {
  background-image: url('@assets/vite/vite-featurepanel-4-background.jpg');
  background-size: 150% 150%;
  background-position: center;
  animation: move-background 16s ease-in-out infinite;
}

/* Randomize animation timing for organic feel */
.testimonial-card:nth-child(2)::before {
  animation-duration: 18s;
  animation-delay: -3s;
}

.testimonial-card:nth-child(3)::before {
  animation-duration: 14s;
  animation-delay: -7s;
}

.testimonial-card:nth-child(4)::before {
  animation-duration: 20s;
  animation-delay: -5s;
}

.testimonial-card:nth-child(5)::before {
  animation-duration: 15s;
  animation-delay: -9s;
}

.testimonial-card:nth-child(6)::before {
  animation-duration: 19s;
  animation-delay: -2s;
}

.testimonial-card:nth-child(7)::before {
  animation-duration: 17s;
  animation-delay: -11s;
}

.testimonial-card:nth-child(8)::before {
  animation-duration: 16s;
  animation-delay: -6s;
}
</style>