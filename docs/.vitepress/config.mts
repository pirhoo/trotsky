import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Trotsky",
  description: "A type-safe library to build automation at the top of ATProto/Bluesky API.",  
  vite: {
    server: {
      port: 9009,
      host: '0.0.0.0'
    }
  },  
  head: [
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'Trotsky' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { property: 'og:title', content: 'Trotsky' } ],
    ['meta', { property: 'og:description', content: 'A type-safe library to build automation at the top of ATProto/Bluesky API.' } ],
    ['meta', { property: 'og:image', content: 'https://trotsky.pirhoo.com/og.png' } ],
    ['meta', { property: 'og:url', content: 'https://trotsky.pirhoo.com' } ],
    ['meta', { property: 'og:type', content: 'website' } ],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://trotsky.pirhoo.com/og.png' }]
  ],
  lastUpdated: true,
  themeConfig: {
    editLink: {
      pattern: 'https://github.com/pirhoo/trotsky/tree/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    logo: '/logo.svg',  
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/reference' },
      { text: 'Ecosystem', link: '/ecosystem' }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Why Trotsky', link: '/guide/why' },
          { text: 'Features', link: '/guide/features' },
          { text: 'Lifecycle Hooks', link: '/guide/hooks' },
          { text: 'Code of Conduct', link: '/guide/code-of-conduct' },
          { text: 'Architecture', link: '/guide/architecture' },
          { text: 'FAQ', link: '/guide/faq' },
        ]
      },
      {
        text: 'Ecosystem',
        items: [
          { text: 'Community', link: '/ecosystem' },
        ]
      },
      {
        text: `API <span class="VPBadge info">${version}</span>`,

        items: [
          { text: 'Reference', link: '/api/reference' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/pirhoo/trotsky', ariaLabel: 'GitHub' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/trotsky.pirhoo.com', ariaLabel: 'Bluesky' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/trotsky', ariaLabel: 'NPM' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'By <a href="https://bsky.app/profile/pirhoo.com">@pirhoo.com</a>',
    },
  }
})
