export default {
  server: {
    host: "0",
    port: 11111
  },
  googleAnalytics: {
    id: "UA-188493743-1",
    dev: false
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Przelicznik foremek",
    htmlAttrs: {
      lang: "pl"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Przelicznik foremek – aby gotującym żyło się łatwiej! :)" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~layouts/global.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/google-analytics", "@nuxtjs/sitemap"],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
};
