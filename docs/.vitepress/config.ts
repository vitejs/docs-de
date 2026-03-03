import path from 'node:path'
import fs from 'node:fs'
import type { DefaultTheme, HeadConfig } from 'vitepress'
import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'
import { markdownItImageSize } from 'markdown-it-image-size'
import { buildEnd } from './buildEnd.config'

// NOTE: allow additional options to be passed to rolldown for now
process.env.ROLLDOWN_OPTIONS_VALIDATION = 'loose'

const ogDescription = 'Frontend-Tooling der nächsten Generation'
const ogImage = 'https://vite.dev/og-image.jpg'
const ogTitle = 'Vite'
const ogUrl = 'https://vite.dev'

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
      text: 'Vite 6 Docs',
      link: 'https://v6.vite.dev',
    },
    {
      text: 'Vite 5 Docs',
      link: 'https://v5.vite.dev',
    },
    {
      text: 'Vite 4 Docs',
      link: 'https://v4.vite.dev',
    },
    {
      text: 'Vite 3 Docs',
      link: 'https://v3.vite.dev',
    },
    {
      text: 'Vite 2 Docs',
      link: 'https://v2.vite.dev',
    },
  ]

  switch (deployType) {
    case 'main':
    case 'local':
      return [
        {
          text: 'Vite 7 Docs (release)',
          link: 'https://vite.dev',
        },
        ...oldVersions,
      ]
    case 'release':
      return oldVersions
  }
})()

// function inlineScript(file: string): HeadConfig {
//   return [
//     'script',
//     {},
//     fs.readFileSync(
//       path.resolve(__dirname, `./inlined-scripts/${file}`),
//       'utf-8',
//     ),
//   ]
// }

export default defineConfig({
  title: `Vite${additionalTitle}`,
  description: 'Frontend-Tooling der nächsten Generation',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    [
      'link',
      { rel: 'alternate', type: 'application/rss+xml', href: '/blog.rss' },
    ],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'true',
      },
    ],
    [
      'link',
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600&family=IBM+Plex+Mono:wght@400&display=swap',
        as: 'style',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600&family=IBM+Plex+Mono:wght@400&display=swap',
      },
    ],
    ['link', { rel: 'me', href: 'https://m.webtoo.ls/@vite' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { property: 'og:site_name', content: 'vitejs' }],
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
    en: { label: 'English', link: 'https://vite.dev' },
    zh: { label: '简体中文', link: 'https://cn.vite.dev' },
    ja: { label: '日本語', link: 'https://ja.vite.dev' },
    es: { label: 'Español', link: 'https://es.vite.dev' },
    pt: { label: 'Português', link: 'https://pt.vite.dev' },
    ko: { label: '한국어', link: 'https://ko.vite.dev' },
    fa: { label: 'فارسی', link: 'https://fa.vite.dev' },
  },

  themeConfig: {
    logo: '/logo.svg',

    editLink: {
      pattern: 'https://github.com/vitejs/docs-de/edit/main/docs/:path',
      text: 'Änderungen für diese Seite vorschlagen',
    },

    socialLinks: [
      { icon: 'bluesky', link: 'https://bsky.app/profile/vite.dev' },
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@vite' },
      { icon: 'x', link: 'https://x.com/vite_js' },
      { icon: 'discord', link: 'https://chat.vite.dev' },
      { icon: 'github', link: 'https://github.com/vitejs/vite' },
    ],

    algolia: {
      appId: '7H67QR5P0A',
      apiKey: '208bb9c14574939326032b937431014b',
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
      copyright: 'Copyright © 2019-present VoidZero Inc. & Vite Contributors',
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
            text: 'Die Dokumentation',
            link: 'https://www.youtube.com/watch?v=bmWQqAKLgT4',
          },
          {
            items: [
              {
                text: 'Bluesky',
                link: 'https://bsky.app/profile/vite.dev',
              },
              {
                text: 'Mastodon',
                link: 'https://elk.zone/m.webtoo.ls/@vite',
              },
              {
                text: 'X',
                link: 'https://x.com/vite_js',
              },
              {
                text: 'Discord Chat',
                link: 'https://chat.vite.dev',
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
          text: 'Einführung',
          items: [
            {
              text: 'Erste Schritte',
              link: '/guide/',
            },
            {
              text: 'Projekt-Philosophie',
              link: '/guide/philosophy',
            },
            {
              text: 'Wieso Vite?',
              link: '/guide/why',
            },
          ],
        },
        {
          text: 'Guide',
          items: [
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
              text: 'Fehlerbehebung',
              link: '/guide/troubleshooting',
            },
            {
              text: 'Leistung',
              link: '/guide/performance',
            },
            {
              text: 'Rolldown',
              link: '/guide/rolldown',
            },
            {
              text: 'Migration von v6',
              link: '/guide/migration',
            },
            {
              text: 'Grundlegende Änderungen',
              link: '/changes',
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
              text: 'Konfiguration',
              link: '/config/',
            },
          ],
        },
        {
          text: 'Environment API',
          items: [
            {
              text: 'Einführung',
              link: '/guide/api-environment',
            },
            {
              text: 'Environment Instanzen',
              link: '/guide/api-environment-instances',
            },
            {
              text: 'Plugins',
              link: '/guide/api-environment-plugins',
            },
            {
              text: 'Frameworks',
              link: '/guide/api-environment-frameworks',
            },
            {
              text: 'Runtimes',
              link: '/guide/api-environment-runtimes',
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
      '/changes/': [
        {
          text: 'Grundlegende Änderungen',
          link: '/changes/',
        },
        {
          text: 'Aktuelles',
          items: [],
        },
        {
          text: 'Zukünftiges',
          items: [
            {
              text: 'this.environment in Hooks',
              link: '/changes/this-environment-in-hooks',
            },
            {
              text: 'HMR hotUpdate Plugin Hook',
              link: '/changes/hotupdate-hook',
            },
            {
              text: 'Umstellung auf umgebungsbezogene APIs',
              link: '/changes/per-environment-apis',
            },
            {
              text: 'SSR verwendet die ModuleRunner API',
              link: '/changes/ssr-using-modulerunner',
            },
            {
              text: 'Gemeinsam genutzte Plugins während der Erstellung',
              link: '/changes/shared-plugins-during-build',
            },
          ],
        },
        {
          text: 'Vergangenes',
          items: [],
        },
      ],
    },

    outline: {
      level: [2, 3],
    },
  },
  transformPageData(pageData) {
    const canonicalUrl = `${ogUrl}/${pageData.relativePath}`
      .replace(/\/index\.md$/, '/')
      .replace(/\.md$/, '')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.unshift(
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: pageData.title }],
    )
    return pageData
  },
  markdown: {
    // languages used for twoslash and jsdocs in twoslash
    languages: ['ts', 'js', 'json'],
    codeTransformers: [transformerTwoslash()],
    config(md) {
      md.use(groupIconMdPlugin)
      md.use(markdownItImageSize, {
        publicDir: path.resolve(import.meta.dirname, '../public'),
      })
    },
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          firebase: 'vscode-icons:file-type-firebase',
          '.gitlab-ci.yml': 'vscode-icons:file-type-gitlab',
        },
      }),
    ],
    optimizeDeps: {
      include: [
        '@shikijs/vitepress-twoslash/client',
        'gsap',
        'gsap/dist/ScrollTrigger',
        'gsap/dist/MotionPathPlugin',
      ],
    },
  },
  buildEnd,
})
