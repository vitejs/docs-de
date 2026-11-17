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
} from '@voidzero-dev/vitepress-theme'
import { core, advisors, emeriti } from './_data/team'
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
    <template #title>Berater</template>
    <template #lead>
      Berater unterstützen Vite aus Sicht des Ökosystems und teilen ihre
      Erfahrung, um die Environment API und das Design zukünftiger APIs zu prägen.
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="advisors" />
    </template>
  </VPTeamPageSection>
  <VPTeamPageSection>
    <template #title>Ehemalige Team-Mitglieder</template>
    <template #lead>
      Hier ehren wir einige nicht mehr aktive Teammitglieder, die in der Vergangenheit wertvolle Beiträge geleistet haben.
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="emeriti" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>
