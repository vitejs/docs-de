This page is for runtime providers, authors who integrate a JavaScript runtime with Vite. A runtime here is the JavaScript engine where transformed code executes, such as Node.js, the browser, Cloudflare's workerd, or a Worker thread. A runtime provider packages the integration for one of these runtimes, so framework authors and end users (the developers building an app) don't have to set it up themselves.

Environment factories are intended to be implemented by runtime providers, not by end users. Environment factories return an `EnvironmentOptions` for the most common case of using the target runtime for both dev and build environments. The default environment options can also be set so the user doesn't need to do it.
For an SSR environment running in the same Node.js process as the Vite server, Vite exports `createServerHotChannel` as a ready-made `HotChannel`:

```js
import { createServerHotChannel, DevEnvironment } from 'vite'

new DevEnvironment(name, config, {
  hot: true,
  transport: createServerHotChannel(),
})
```