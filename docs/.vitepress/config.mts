import { defineConfig } from 'vitepress'

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
  themeConfig: {
    logo: './logo.svg',    
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Guide', link: '/guide' },
      { text: 'API', link: '/api' }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide' },
          { text: 'Why Trotsky', link: '/guide/why' },
          { text: 'Features', link: '/guide/features' },
          { text: 'FAQ', link: '/guide/faq' },
        ]
      },
      {
        text: 'API',
        items: [
          { text: 'Reference', link: '/api' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/pirhoo/trotsky' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/trotsky.pirhoo.com' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'By <a href="https://bsky.app/profile/pirhoo.com">@pirhoo.com</a>',
    },
  }
})
