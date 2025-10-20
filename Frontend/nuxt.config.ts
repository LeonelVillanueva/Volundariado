// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false, // Deshabilitar SSR para evitar problemas con localStorage
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  // Configurar el puerto del servidor de desarrollo
  devServer: {
    port: 3001,
    host: 'localhost'
  },

  app: {
    head: {
      title: 'Voluntariado - Sistema de Gestión',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sistema de gestión de eventos de voluntariado' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2024-10-19'
})
