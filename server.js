/**
 * Adapted code from
 * https://vitejs.dev/guide/ssr.html
 * and
 * https://github.com/bluwy/create-vite-extra/blob/bb9a457b8e32f1fc5edec42d0e299a297e085815/template-ssr-vue/server.js
 * Though I don't have clear idea about what is exactly happening in this stuff, but it just works.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function startServer(isProduction) {
  // Constants
  const port = process.env.PORT || 5173
  const base = process.env.BASE || '/tex2typst-webapp/'

  // Cached production assets
  const templateHtml = isProduction
    ? fs.readFileSync('./dist/client/index.html', 'utf-8')
    : ''
  const ssrManifest = isProduction
    ? fs.readFileSync('./dist/client/.vite/ssr-manifest.json', 'utf-8')
    : undefined

  const app = express()

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base
  })

  // Use vite's connect instance as middleware. If you use your own
  // express router (express.Router()), you should use router.use
  // When the server restarts (for example after the user modifies
  // vite.config.js), `vite.middlewares` is still going to be the same
  // reference (with a new internal stack of Vite and plugin-injected
  // middlewares). The following is valid even after restarts.
  app.use(vite.middlewares)

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl.replace(base, '')

    try {
      if (url !== '' && url !== 'index.html') {
          const filePath = path.resolve(__dirname, 'dist/client', url)
          // if the file not found, return 404
          if (!fs.existsSync(filePath)) {
            res.status(404).end('File not found')
            return;
          }
          const content = fs.readFileSync(filePath, 'utf-8')
          // get the file extension
          const ext = path.extname(url).slice(1)
          switch (ext) {
            case 'js':
              res.setHeader('Content-Type', 'application/javascript')
              break
            case 'css':
              res.setHeader('Content-Type', 'text/css')
              break
            case 'json':
              res.setHeader('Content-Type', 'application/json')
              break
            case 'png':
              res.setHeader('Content-Type', 'image/png')
              break
            case 'jpg':
              res.setHeader('Content-Type', 'image/jpg')
              break
            case 'svg':
              res.setHeader('Content-Type', 'image/svg+xml')
              break
            case 'ico':
              res.setHeader('Content-Type', 'image/x-icon')
              break
            case 'html':
              res.setHeader('Content-Type', 'text/html')
              break
            default:
              res.setHeader('Content-Type', 'text/plain')
          }
          res.status(200).end(content);
          return;
      }
      let template
      let render
      if (!isProduction) {
        // Always read fresh template in development
        template = fs.readFileSync('./index.html', 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.js')).render
      } else {
        template = templateHtml
        render = (await import('./dist/server/entry-server.js')).render
      }

      const rendered = await render(url, ssrManifest)

      const html = template
        .replace(`<!--app-head-->`, rendered.head ?? '')
        .replace(`<!--app-html-->`, rendered.html ?? '')

      // 6. Send the rendered HTML back.
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your actual source code.
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  // Start http server
  const baseUrl = `http://localhost:${port}${base}`;
  let server;

   // https://stackoverflow.com/a/63629410
   const promise = new Promise((resolve, _reject) => {
      server = app.listen(port, () => {
        resolve();
      });
    });
  await promise; // Make sure that the server is up and ready to accept requests
  return { server, baseUrl };
}
