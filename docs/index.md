---
title: Vite
titleTemplate: Frontend-Tooling der nächsten Generation
layout: home
theme: dark
---

<script setup>
import Home from './.vitepress/theme/landing/Layout.vue'

const { isDark } = useData()

onMounted(() => {
  document.documentElement.classList.add('dark')
})

onBeforeUnmount(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
})
</script>

<Home />