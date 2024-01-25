// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Platform Review',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  colorMode: {
    preference: 'light',
  },
  devtools: { enabled: true },
  css: [
    '@/assets/css/tailwind.css',
  ],
  ui: {
    icons: ['solar'],
  },

  
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@sidebase/nuxt-auth',
    '@vueuse/nuxt',
  ],

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
    },
  },

  auth: {
    origin: process.env.ORIGIN_URL,
    baseURL: process.env.API_URL,
    provider: {
      type: 'local',
      pages: {
        login: "/"
      },
      sessionDataType: {
        id: 'string',
        name: 'string',
        email: 'string',
        role: 'string',
      },
      token: {
        maxAgeInSeconds: 8 * 60 * 60,
      },
    },
    globalAppMiddleware: true,
  },
})
