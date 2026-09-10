import VersionsList from './VersionsList.vue'
        <VersionsList :versions="supportInfo.regularPatches" />.
        <VersionsList :versions="supportInfo.importantFixes" />.
        <VersionsList :versions="supportInfo.securityPatches" />.