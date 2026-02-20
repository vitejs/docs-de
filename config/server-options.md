- **Type:** `object | null`
If set to `null`, no files will be watched. `server.watcher` will provide a compatible event emitter, but calling `add` or `unwatch` will have no effect.

The Vite server watcher watches the `root` and skips the `.git/` and `node_modules/` directories by default. When updating a watched file, Vite will apply HMR and update the page only if needed.
::: warning Watching files in `node_modules`

It's currently not possible to watch files and packages in `node_modules`. For further progress and workarounds, you can follow [issue #8619](https://github.com/vitejs/vite/issues/8619).

:::

## server.warmup

- **Type:** `{ clientFiles?: string[], ssrFiles?: string[] }`

Warm up files to transform and cache the results in advance. This improves the initial page load during server starts and prevents transform waterfalls.

The `clientFiles` and `ssrFiles` options accept an array of file paths or glob patterns relative to the `root`. Make sure to only add files that are hot code, as otherwise adding too many may slow down the transform process.

To understand why warmup can be useful, here's an example. Given this module graph where the left file imports the right file:

```
main.js -> Component.vue -> big-file.js -> large-data.json
```

The imported ids can only be known after the file is transformed, so if `Component.vue` takes some time to transform, `big-file.js` has to wait for it's turn, and so on. This causes an internal waterfall.

By warming up `big-file.js`, or any files that you know is hot path in your app, they'll be cached and can be served immediately.

```js
export default defineConfig({
  server: {
    warmup: {
      clientFiles: ['./src/big-file.js', './src/components/*.vue'],
    },
  },
})
```

- **Related:** [Warm Up Frequently Used Files](/guide/performance.html#warm-up-frequently-used-files)
`clientFiles` are files that are used in the client only, while `ssrFiles` are files that are used in SSR only. They accept an array of file paths or [`fast-glob`](https://github.com/mrmlnc/fast-glob) patterns relative to the `root`.
Make sure to only add files that are frequently used to not overload the Vite dev server on startup.
      clientFiles: ['./src/components/*.vue', './src/utils/big-utils.js'],
      ssrFiles: ['./src/server/modules/*.js'],
- **Type:** `https.ServerOptions`
Extends [`http-proxy`](https://github.com/http-party/node-http-proxy#options). Additional options are [here](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/middlewares/proxy.ts#L13).
      // Exercise caution using `rewriteWsOrigin` as it can leave the proxying open to CSRF attacks.
        rewriteWsOrigin: true,
Configure custom proxy rules for the dev server. Expects an object of `{ key: options }` pairs. Any requests that request path starts with that key will be proxied to that specified target. If the key starts with `^`, it will be interpreted as a `RegExp`. The `configure` option can be used to access the proxy instance. If a request matches any of the configured proxy rules, the request won't be transformed by Vite.
`clientFiles` are files that are used in the client only, while `ssrFiles` are files that are used in SSR only. They accept an array of file paths or [`tinyglobby` patterns](https://superchupu.dev/tinyglobby/comparison) relative to the `root`.