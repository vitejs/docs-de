      await Promise.all(
- [Environment API PR](https://github.com/vitejs/vite/pull/16471) where the new APIs were implemented and reviewed.
When `builder` option is not `undefined` (or when calling `vite build --app`), `vite build` will opt-in into building the entire app instead. This would later on become the default in a future major. A `ViteBuilder` instance will be created (build-time equivalent to a `ViteDevServer`) to build all configured environments for production. By default the build of environments is run in series respecting the order of the `environments` record. A framework or user can further configure how the environments are built using `builder.buildApp` option:
```js [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
})
  const indexHtmlPath = path.resolve(import.meta.dirname, 'index.html')
    new Request('http://example.com/request-to-handle'),
const response = handler(new Request('http://example.com/'))
const req = new Request('http://example.com/')
const response = handler(new Request('http://example.com/'))