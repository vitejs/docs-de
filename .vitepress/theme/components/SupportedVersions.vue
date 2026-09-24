import VersionsList from './VersionsList.vue'
        <VersionsList :versions="supportInfo.regularPatches" />.
        <VersionsList :versions="supportInfo.importantFixes" />.
        <VersionsList :versions="supportInfo.securityPatches" />.
@supports (field-sizing: content) {
  .checked-input {
    width: auto;
    field-sizing: content;
  }
}
