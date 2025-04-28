// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/icon', '@nuxt/ui'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  app: {
    rootAttrs: {dir:"rtl",lang:"fa"},
  },
  css: ["~/assets/css/main.css"],
})