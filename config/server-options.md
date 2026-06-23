`server.sourcemapIgnoreList` is the equivalent of [`build.rolldownOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) for the dev server. A difference between the two config options is that the rollup function is called with a relative path for `sourcePath` while `server.sourcemapIgnoreList` is called with an absolute path. During dev, most modules have the map and the source in the same folder, so the relative path for `sourcePath` is the file name itself. In these cases, absolute paths makes it convenient to be used instead.
[`server.sourcemapIgnoreList`](#server-sourcemapignorelist) and [`build.rolldownOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) need to be set independently. `server.sourcemapIgnoreList` is a server only config and doesn't get its default value from the defined rollup options.
You can set the environment variable `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` to add additional allowed hosts. Use commas to separate multiple hosts (e.g., `host1.example.com,host2.example.com`).
- **Type:** `boolean | { overlay?: boolean }`
Disable or configure HMR behavior.
::: warning Deprecated Options
The WebSocket-related options (`protocol`, `host`, `port`, `path`, `clientPort`, `timeout`, `server`) are deprecated. Use [`server.ws`](#server-ws) instead. These options are automatically synced, so existing configurations will continue to work.
:::

## server.ws

- **Type:** `false | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, clientPort?: number, server?: Server }`

Configure WebSocket connection options. Set to `false` to disable the WebSocket connection entirely.

- `protocol` - WebSocket protocol (`ws` or `wss`)
- `host` - WebSocket server host
- `port` - WebSocket server port
- `path` - WebSocket path
- `clientPort` - Override the port on the client side, allowing you to serve the websocket on a different port than the client code looks for it on
- `timeout` - Connection timeout in milliseconds (default: 30000)
- `server` - Use a custom HTTP server for WebSocket connections

When `server.ws.server` is defined, Vite will process the WebSocket connection requests through the provided server. If not in middleware mode, Vite will attempt to process WebSocket connection requests through the existing server. This can be helpful when using self-signed certificates or when you want to expose Vite over a network on a single port.

```js
export default defineConfig({
  server: {
    ws: {
      protocol: 'wss',
      host: 'localhost',
      port: 3001,
    },
  },
})
```
Direct websocket connection fallback. Check out https://vite.dev/config/server-options.html#server-ws to remove the previous connection error.
- set [`server.strictPort = true`](#server-strictport) and set `server.ws.clientPort` to the same value with `server.port`
- set `server.ws.port` to a different value from [`server.port`](#server-port)
- **Default:** `['.env', '.env.*', '*.{crt,pem,key,p12,pfx,cer,der}', '.npmrc', '.yarnrc.yml', '**/.git/**']`