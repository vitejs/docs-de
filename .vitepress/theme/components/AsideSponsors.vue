  <a
    class="viteconf"
import { VPDocAsideSponsors } from '@voidzero-dev/vitepress-theme'
import { useSponsor, voidZero } from '../composables/sponsor'
  >
    <img width="22" height="22" src="/viteconf.svg" />
      <p class="extra-info">Beyond Fast</p>
      <p class="heading">ViteConf 2023</p>
  return [
    { size: 'small' as const, items: [voidZero] },
    ...(data?.value.map((sponsor) => {
.viteconf:hover {
        size: (sponsor.size === 'big' ? 'mini' : 'xmini') as 'mini' | 'xmini',
.viteconf:hover img {
.viteconf .heading {
    }) ?? []),
  ]
    #b047ff 16%,
    var(--vp-c-brand-lighter),
    var(--vp-c-brand-lighter)
  );
.viteconf .extra-info {
  opacity: 0;
    href="https://www.youtube.com/playlist?list=PLqGQbXn_GDmkJaoykvHCUmXUPjhgH2bVr"
  opacity: 0.9;
}
    <img width="22" height="22" src="/viteconf.svg" alt="ViteConf Logo" />
      <p class="extra-info">View the replays</p>
<style scoped>
.viteconf span {
  display: block;
}
.viteconf p {
  margin: 0;
  padding: 0;
  line-height: 1.1rem;
  color: var(--vp-c-text-1);
}
  color: var(--vp-c-brand-lighter);
  opacity: 1;