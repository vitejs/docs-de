import { core, advisors, emeriti } from './_data/team'
  <VPTeamPageSection>
    <template #title>Advisors</template>
    <template #lead>
      Advisors help guide Vite from the ecosystem side, sharing their
      experience to shape the Environment API and the design of future APIs.
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="advisors" />
    </template>
  </VPTeamPageSection>