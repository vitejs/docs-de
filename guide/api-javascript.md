   * Chokidar watcher instance. If `config.server.watch` is set to `null`,
   * returns a noop event emitter.
  defaultNodeEnv = 'development',
  isPreview = false,
The `command` value is `serve` in dev and preview, and `build` in build.
  /**
   * Calling `await server.waitForRequestsIdle(id)` will wait until all static imports
   * are processed. If called from a load or transform plugin hook, the id needs to be
   * passed as a parameter to avoid deadlocks. Calling this function after the first
   * static imports section of the module graph has been processed will resolve immediately.
   * @experimental
   */
  waitForRequestsIdle: (ignoredId?: string) => Promise<void>
:::info
`waitForRequestsIdle` is meant to be used as a escape hatch to improve DX for features that can't be implemented following the on-demand nature of the Vite dev server. It can be used during startup by tools like Tailwind to delay generating the app CSS classes until the app code has been seen, avoiding flashes of style changes. When this function is used in a load or transform hook, and the default HTTP1 server is used, one of the six http channels will be blocked until the server processes all static imports. Vite's dependency optimizer currently uses this function to avoid full-page reloads on missing dependencies by delaying loading of pre-bundled dependencies until all imported dependencies have been collected from static imported sources. Vite may switch to a different strategy in a future major release, setting `optimizeDeps.crawlUntilStaticImports: false` by default to avoid the performance hit in large applications during cold start.
:::

   * WebSocket server with `send(payload)` method.