import type { HeadConfig } from 'vitepress'
  localIconLoader,
import { extendConfig } from '@voidzero-dev/vitepress-theme/config'
import type { FooterLink } from '@voidzero-dev/vitepress-theme'
const versionLinks = (() => {
  const links: FooterLink[] = []
const config = defineConfig({
    [
      { rel: 'icon', type: 'image/svg+xml', href: '/logo-without-border.svg' },
import { graphvizMarkdownPlugin } from 'vitepress-plugin-graphviz'
    ],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    variant: 'vite',
    banner: {
      id: 'vite+',
      text: 'Announcing Vite+ | The Unified Toolchain for the Web',
      url: 'https://voidzero.dev/posts/announcing-vite-plus?utm_source=vite&utm_content=top_banner',
    },

      copyright: `© 2025 VoidZero Inc. and Vite contributors. (${commitRef})`,
      nav: [
        {
          title: 'Vite',
          items: [
            { text: 'Guide', link: '/guide/' },
            { text: 'Config', link: '/config/' },
            { text: 'Plugins', link: '/plugins/' },
          ],
        },
        {
          title: 'Resources',
          items: [
            { text: 'Team', link: '/team' },
            { text: 'Blog', link: '/blog' },
            {
              text: 'Releases',
              link: 'https://github.com/vitejs/vite/releases',
            },
          ],
        },
        {
          title: 'Versions',
          items: versionLinks,
        },
      ],
      social: [
        { icon: 'github', link: 'https://github.com/vitejs/vite' },
        { icon: 'discord', link: 'https://chat.vite.dev' },
        { icon: 'bluesky', link: 'https://bsky.app/profile/vite.dev' },
        { icon: 'x', link: 'https://x.com/vite_js' },
      ],
          'vite.config': localIconLoader(
            import.meta.url,
            '../public/logo-without-border.svg',
          ),
      include: ['@shikijs/vitepress-twoslash/client'],

export default extendConfig(config)
      copyright: `© ${new Date().getFullYear()} VoidZero Inc. and Vite contributors. (${commitRef})`,
      copyright: `© 2019-present VoidZero Inc. and Vite contributors. (${commitRef})`,
      path.resolve(import.meta.dirname, `./inlined-scripts/${file}`),
          { text: 'Acknowledgements', link: '/acknowledgements' },
    search: {
      provider: 'algolia',
      options: {
        appId: '7H67QR5P0A',
        apiKey: '208bb9c14574939326032b937431014b',
        indexName: 'vitejs',
        searchParameters: {
          facetFilters: ['tags:en'],
        },
        insights: true,
    async config(md) {
      await graphvizMarkdownPlugin(md)
          {
            text: 'Plugin Registry',
            link: 'https://registry.vite.dev/plugins',
          },
      id: 'viteplus-alpha',
      text: 'Announcing Vite+ Alpha: Open source. Unified. Next-gen.',
      url: 'https://voidzero.dev/posts/announcing-vite-plus-alpha?utm_source=vite&utm_content=top_banner',