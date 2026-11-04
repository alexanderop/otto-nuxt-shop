export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: [
    '@otto-de/b2b-core-components/dist/b2b-core-components/b2b-core-components.css',
    '~/assets/css/main.css',
  ],

  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.startsWith('b2b-'),
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'de' },
      title: 'OTTO Demo-Shop',
      meta: [{ name: 'description', content: 'Vereinfachter otto.de-Klon mit Nuxt und dem OTTO B2B Design System' }],
    },
  },
})
