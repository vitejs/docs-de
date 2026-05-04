<script setup>
import RiveAnimation from '@components/shared/RiveAnimation.vue'
import flexiblePluginAnimation from '@assets/vite/animations/640_x_300_flexible_plugin.riv'
</script>

<template>
  <section
    class="wrapper wrapper--ticks border-t grid lg:grid-cols-2 divide-x divide-y divide-nickel"
  >
    <div class="p-5 sm:p-10 flex flex-col gap-3">
      <h5 class="text-balance sm:text-pretty text-white">
        Flexible Plugin System
      </h5>
      <p class="sm:max-w-[28rem] text-pretty">
        Vite-Plugins erweitern die gut durchdachte Plugin-Schnittstelle von Rollup um einige
        zusätzliche Vite-spezifische Optionen.
      </p>
      <RiveAnimation
        :desktop-src="flexiblePluginAnimation"
        :desktop-width="640"
        :desktop-height="300"
        canvas-class="w-[calc(100%_+_2.5rem)] mt-5 -mx-5"
      />
    </div>

    <div class="flex flex-col gap-3 border-r-0 justify-between">
      <div class="p-5 sm:p-10 flex flex-col gap-3">
        <h5 class="text-white">Vollständig typisierte API</h5>
        <p class="max-w-[26rem] text-pretty">Entwickelt, um darauf aufzubauen.</p>
      </div>
      <div class="relative p-5 sm:p-10 flex justify-center bg-[#370a7f]">
        <img
          class="absolute inset-0 h-full w-full object-cover"
          src="@assets/vite/vite-featurepanel-4-background.jpg"
          alt=""
          inert
          loading="lazy"
        />
        <img
          class="z-1"
          src="@assets/vite/vite-typed-api.svg"
          width="454"
          height="252"
          inert
          loading="lazy"
          alt="Typisierte API"
        />
      </div>
    </div>

    <div class="p-5 sm:p-10 flex flex-col gap-3 lg:border-b-0">
      <h5 class="text-white">Erstklassiger SSR-Support</h5>
      <p class="sm:max-w-[28rem] text-pretty mb-12 sm:mb-16">
        Es war noch nie so einfach, benutzerdefiniertes SSR (Server-Side Rendering) einzurichten oder
        ein eigenes SSR-Framework zu entwickeln.
      </p>
      <img
        src="@assets/vite/vite-ssr-support.png"
        width="1008"
        height="466"
        alt="SSR Support"
        loading="lazy"
        class="w-full px-5"
      />
    </div>

    <div class="flex flex-col gap-3 justify-between">
      <div class="p-5 sm:p-10 flex flex-col gap-3">
        <h5 class="text-white">Kontinuierliche Integration in das Ökosystem</h5>
        <p class="max-w-[25rem] text-pretty">
          Unsere CI testet Änderungen an Vite kontinuierlich in Bezug auf nachgelagerte Projekte,
          sodass wir Vite stabil und zuverlässig weiterentwickeln können.
        </p>
      </div>
      <div class="px-5 sm:px-10 flex justify-center">
        <img
          src="@assets/vite/vite-ci.svg"
          width="476"
          height="272"
          inert
          loading="lazy"
          alt="Kontinuierliche Integration in das Ökosystem"
        />
      </div>
    </div>
  </section>
</template>