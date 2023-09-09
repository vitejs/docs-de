---
layout: page
title: Lernen Sie das Team kennen
description: Die Entwicklung von Vite wird von einem internationalen Team geleitet.
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamPageSection,
  VPTeamMembers
} from 'vitepress/theme'
import { core, emeriti } from './_data/team'
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>Lernen Sie das Team kennen</template>
    <template #lead>
      Die Entwicklung von Vite wird von einem internationalen Team geleitet, von dem einige sich entschieden haben, im Folgenden vorgestellt zu werden.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members="core" />
  <VPTeamPageSection>
    <template #title>Ehemalige Team-Mitglieder</template>
    <template #lead>
      Hier ehren wir einige nicht mehr aktive Teammitglieder, die in der Vergangenheit wertvolle Beiträge geleistet haben. die in der Vergangenheit wertvolle Beiträge geleistet haben.
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="emeriti" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>
