const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 3000,
  PORT_API: process.env.PORT_API || 3001,
  env: {
    STRIPE_PK: 'pk_test_51IvuuiEHEquBk10HT8SXUX4Zj19QIqNUQjloFVe18IoY9gJPjRDxuqq0Ho2mqI5FVVFJGiUSKQOLYDuowfBEb05f00EeabU3OF',
  }
}
if (process.env.NODE_ENV === 'production') {
  env.API_URL = 'https://meditationgrdn-raffle-app-api.herokuapp.com';
} else {
  env.API_URL = `http://localhost:${env.PORT_API}`
}

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  ssr: false,
  static: {
    prefix: false
  },
  head: {
    title: 'Meditation Garden Draw app',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/tickets.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Quicksand' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Source+Code+Pro' },
      { rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css' },

    ],
    script: [

      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.2/zxcvbn.js'
      },
      {
        src: 'https://polyfill.io/v3/polyfill.min.js?version=3.52.1&features=fetch'
      },
      {
        src: "https://js.stripe.com/v3",
      },

    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/v-tailwind-picker',
    '~/plugins/vue-table',
    '~/plugins/vue-qr-scanner',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
  axios: {
    baseURL: env.API_URL
  },
  auth: {
    strategies: {
      local: {

        token: {
          property: 'accessToken',
          required: true,
          type: 'Bearer'
        },
        user: {
          property: 'user',
          autoFetch: true
        },
        endpoints: {
          login: { url: '/api/auth/signin', method: 'post' },
          logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/auth/session', method: 'get' },

        }
      }
    }
  },
  router: {

    middleware: ['auth']
  },

}
