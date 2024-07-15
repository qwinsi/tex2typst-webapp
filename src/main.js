/**
 * Code from https://github.com/bluwy/create-vite-extra/blob/bb9a457b8e32f1fc5edec42d0e299a297e085815/template-ssr-vue/src/main.js
 */
import { createSSRApp } from 'vue'
import App from './App.vue'

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export function createApp() {
  const app = createSSRApp(App)
  return { app }
}
