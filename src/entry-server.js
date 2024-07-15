/**
 * Code from https://github.com/bluwy/create-vite-extra/blob/bb9a457b8e32f1fc5edec42d0e299a297e085815/template-ssr-vue/src/entry-server.js
 */

import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'

export async function render() {
  const { app } = createApp()

  // passing SSR context object which will be available via useSSRContext()
  // @vitejs/plugin-vue injects code into a component's setup() that registers
  // itself on ctx.modules. After the render, ctx.modules would contain all the
  // components that have been instantiated during this render call.
  const ctx = {}
  const html = await renderToString(app, ctx)

  return { html }
}