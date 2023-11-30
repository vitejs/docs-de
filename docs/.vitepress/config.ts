import { defineConfig, DefaultTheme } from 'vitepress'
import { buildEnd } from './buildEnd.config'

const ogDescription = 'Frontend-Tooling der nächsten Generation'
const ogImage = 'https://vitejs.dev/og-image.png'
const ogTitle = 'Vite'
const ogUrl = 'https://vitejs.dev'

// netlify envs
const deployURL = process.env.DEPLOY_PRIME_URL || ''
const commitRef = process.env.COMMIT_REF?.slice(0, 8) || 'dev'

const deployType = (() => {
  switch (deployURL) {
    case 'https://vite-docs-de.netlify.app':
      return 'main'
    case '':
      return 'local'
    default:
      return 'release'
  }
})()
const additionalTitle = ((): string => {
  switch (deployType) {
    case 'main':
      return ' (main branch)'
    case 'local':
      return ' (local)'
    case 'release':
      return ''
  }
})()
const versionLinks = ((): DefaultTheme.NavItemWithLink[] => {
  const oldVersions: DefaultTheme.NavItemWithLink[] = [
    {
      text: 'Vite 4 Dokumentation',
      link: 'https://v4.vitejs.dev',
    },
    {
      text: 'Vite 3 Dokumentation',
      link: 'https://v3.vitejs.dev',
    },
    {
      text: 'Vite 2 Dokumentation',
      link: 'https://v2.vitejs.dev',
    },
  ]

  switch (deployType) {
    case 'main':
    case 'local':
      return [
        {
          text: 'Vite 5 Dokumentation (release)',
          link: 'https://vitejs.dev',
        },
        ...oldVersions,
      ]
    case 'release':
      return oldVersions
  }
})()

export default defineConfig({
  title: `Vite${additionalTitle}`,
  description: 'Frontend-Tooling der nächsten Generation',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    [
      'link',
      { rel: 'alternate', type: 'application/rss+xml', href: '/blog.rss' },
    ],
    ['link', { rel: 'me', href: 'https://m.webtoo.ls/@vite' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@vite_js' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'CBDFBSLI',
        'data-spa': 'auto',
        defer: '',
      },
    ],
  ],

  locales: {
    root: { label: 'Deutsch' },
    en: { label: 'English', link: 'https://vitejs.dev' },
    zh: { label: '简体中文', link: 'https://cn.vitejs.dev' },
    ja: { label: '日本語', link: 'https://ja.vitejs.dev' },
    es: { label: 'Español', link: 'https://es.vitejs.dev' },
    pt: { label: 'Português', link: 'https://pt.vitejs.dev' },
    ko: { label: '한국어', link: 'https://ko.vitejs.dev' },
  },

  themeConfig: {
    logo: '/logo.svg',

    editLink: {
      pattern: 'https://github.com/vitejs/vite/edit/main/docs/:path',
      text: 'Änderungen für diese Seite vorschlagen',
    },

    socialLinks: [
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@vite' },
      { icon: 'twitter', link: 'https://twitter.com/vite_js' },
      { icon: 'discord', link: 'https://chat.vitejs.dev' },
      { icon: 'github', link: 'https://github.com/vitejs/vite' },
    ],

    algolia: {
      appId: '7H67QR5P0A',
      apiKey: 'deaab78bcdfe96b599497d25acc6460e',
      indexName: 'vitejs',
      searchParameters: {
        facetFilters: ['tags:de'],
      },
      placeholder: 'Suche',
      translations: {
        button: {
          buttonText: 'Suche',
        },
        modal: {
          searchBox: {
            resetButtonTitle: 'Suche zurücksetzen.',
            resetButtonAriaLabel: 'Suche zurücksetzen.',
            cancelButtonText: 'Zurücksetzen',
            cancelButtonAriaLabel: 'Zurücksetzen',
          },
          startScreen: {
            recentSearchesTitle: 'Letzte Suchanfragen',
            noRecentSearchesText: 'Keine letzten Suchanfragen.',
          },
          errorScreen: {
            titleText: 'Fehler beim Abrufen von Suchergebnissen.',
            helpText:
              'Möglicherweise müssen Sie Ihre Netzwerkverbindung überprüfen.',
          },
          footer: {
            selectText: 'Auswählen',
            navigateText: 'Navigieren',
            closeText: 'Schließen',
          },
          noResultsScreen: {
            noResultsText: 'Keine Ergebnisse gefunden.',
            suggestedQueryText: 'Alternative Vorschläge',
          },
        },
      },
    },

    carbonAds: {
      code: 'CEBIEK3N',
      placement: 'vitejsdev',
    },

    outlineTitle: 'Auf dieser Seite',
    docFooter: {
      prev: 'Vorherige Seite',
      next: 'Nächste Seite',
    },

    footer: {
      message: `Veröffentlicht unter der MIT-Lizenz. (${commitRef})`,
      copyright: 'Copyright © 2019-present Evan You & Vite Contributors',
    },

    nav: [
      { text: 'Leitfaden', link: '/guide/', activeMatch: '/guide/' },
      { text: 'Konfiguration', link: '/config/', activeMatch: '/config/' },
      { text: 'Plugins', link: '/plugins/', activeMatch: '/plugins/' },
      {
        text: 'Ressourcen',
        items: [
          { text: 'Team', link: '/team' },
          { text: 'Blog', link: '/blog' },
          { text: 'Veröffentlichungen', link: '/releases' },
          {
            items: [
              {
                text: 'Twitter',
                link: 'https://twitter.com/vite_js',
              },
              {
                text: 'Discord Chat',
                link: 'https://chat.vitejs.dev',
              },
              {
                text: 'Awesome Vite',
                link: 'https://github.com/vitejs/awesome-vite',
              },
              {
                text: 'ViteConf',
                link: 'https://viteconf.org',
              },
              {
                text: 'DEV Community',
                link: 'https://dev.to/t/vite',
              },
              {
                text: 'Rollup Plugins Compat',
                link: 'https://vite-rollup-plugins.patak.dev/',
              },
              {
                text: 'Changelog',
                link: 'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md',
              },
              {
                text: 'Beitragen',
                link: 'https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md',
              },
            ],
          },
        ],
      },
      {
        text: 'Version',
        items: versionLinks,
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Leitfaden',
          items: [
            {
              text: 'Wieso Vite?',
              link: '/guide/why',
            },
            {
              text: 'Erste Schritte',
              link: '/guide/',
            },
            {
              text: 'Funktionen',
              link: '/guide/features',
            },
            {
              text: 'CLI',
              link: '/guide/cli',
            },
            {
              text: 'Plugins verwenden',
              link: '/guide/using-plugins',
            },
            {
              text: 'Vorbündeln von Abhängigkeiten',
              link: '/guide/dep-pre-bundling',
            },
            {
              text: 'Umgang mit statischen Assets',
              link: '/guide/assets',
            },
            {
              text: 'Erstellung für die Produktion',
              link: '/guide/build',
            },
            {
              text: 'Bereitstellen einer statischen Website',
              link: '/guide/static-deploy',
            },
            {
              text: 'Umgebungsvariablen und Modi',
              link: '/guide/env-and-mode',
            },
            {
              text: 'Serverseitiges Rendern (SSR)',
              link: '/guide/ssr',
            },
            {
              text: 'Backend-Integration',
              link: '/guide/backend-integration',
            },
            {
              text: 'Vergleiche',
              link: '/guide/comparisons',
            },
            {
              text: 'Fehlerbehebung',
              link: '/guide/troubleshooting',
            },
            {
              text: 'Leistung',
              link: '/guide/performance',
            },
            {
              text: 'Projekt-Philosophie',
              link: '/guide/philosophy',
            },
            {
              text: 'Migration von v4',
              link: '/guide/migration',
            },
          ],
        },
        {
          text: 'APIs',
          items: [
            {
              text: 'Plugin API',
              link: '/guide/api-plugin',
            },
            {
              text: 'HMR API',
              link: '/guide/api-hmr',
            },
            {
              text: 'JavaScript API',
              link: '/guide/api-javascript',
            },
            {
              text: 'Referenzen zur Konfiguration',
              link: '/config/',
            },
          ],
        },
      ],
      '/config/': [
        {
          text: 'Konfiguration',
          items: [
            {
              text: 'Vite konfigurieren',
              link: '/config/',
            },
            {
              text: 'Gemeinsame Optionen',
              link: '/config/shared-options',
            },
            {
              text: 'Server-Optionen',
              link: '/config/server-options',
            },
            {
              text: 'Build-Optionen',
              link: '/config/build-options',
            },
            {
              text: 'Vorschau-Optionen',
              link: '/config/preview-options',
            },
            {
              text: 'Optionen zur Optimierung der Abhängigkeiten',
              link: '/config/dep-optimization-options',
            },
            {
              text: 'SSR-Optionen',
              link: '/config/ssr-options',
            },
            {
              text: 'Worker-Optionen',
              link: '/config/worker-options',
            },
          ],
        },
      ],
    },

    outline: {
      level: [2, 3],
    },
  },
  buildEnd,
})
