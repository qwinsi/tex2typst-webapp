import { ViteSSG } from 'vite-ssg/single-page'
import App from './App.vue'
import "./assets/main.css"

// `export const createApp` is required instead of the original `createApp(App).mount('#app')`
export const createApp = ViteSSG(App);
