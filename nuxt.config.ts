// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'nuxt-auth-utils',
    'reka-ui/nuxt'
  ],

  $production: {
    experimental: {
      checkOutdatedBuildInterval: 3600000 // 1h
    }
  },

  devtools: {
    enabled: true
  },

  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  css: ['~/assets/css/main.css'],

  ui: {
    fonts: false
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:5000'
    }
  },

  routeRules: {
    '/docs': { redirect: '/docs/getting-started', prerender: false },
    '/teacher/**': { appMiddleware: 'auth' },
    '/student/**': { appMiddleware: 'auth' },
    '/login': { ssr: false }
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true
    }
  },

  vite: {
    build: {
      sourcemap: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
