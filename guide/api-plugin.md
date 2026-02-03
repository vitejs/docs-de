---

Internally, vite infers the type of a payload from the `CustomEventMap` interface, it is possible to type custom events by extending the interface:

:::tip Note
Make sure to include the `.d.ts` extension when specifying TypeScript declaration files. Otherwise, Typescript may not know which file the module is trying to extend.
:::
import 'vite/types/customEvent.d.ts'
declare module 'vite/types/customEvent.d.ts' {

This interface extension is utilized by `InferCustomEventPayload<T>` to infer the payload type for event `T`. For more information on how this interface is utilized, refer to the [HMR API Documentation](./api-hmr#hmr-api).

```ts twoslash
import 'vite/client'
import type { InferCustomEventPayload } from 'vite/types/customEvent.d.ts'
declare module 'vite/types/customEvent.d.ts' {
  interface CustomEventMap {
    'custom:foo': { msg: string }
  }
}
// ---cut---
type CustomFooPayload = InferCustomEventPayload<'custom:foo'>
import.meta.hot?.on('custom:foo', (payload) => {
  // The type of payload will be { msg: string }
})
import.meta.hot?.on('unknown:event', (payload) => {
  // The type of payload will be any
})
```
### Hook Filters

Rolldown introduced a [hook filter feature](https://rolldown.rs/plugins/hook-filters) to reduce the communication overhead between the Rust and JavaScript runtimes. This feature allows plugins to specify patterns that determine when hooks should be called, improving performance by avoiding unnecessary hook invocations.

This is also supported by Rollup 4.38.0+ and Vite 6.3.0+. To make your plugin backward compatible with older versions, make sure to also run the filter inside the hook handlers.

```js
export default function myPlugin() {
  const jsFileRegex = /\.js$/

  return {
    name: 'my-plugin',
    // Example: only call transform for .js files
    transform: {
      filter: {
        id: jsFileRegex,
      },
      handler(code, id) {
        // Additional check for backward compatibility
        if (!jsFileRegex.test(id)) return null

        return {
          code: transformCode(code),
          map: null,
        }
      },
    },
  }
}
```

::: tip
[`@rolldown/pluginutils`](https://www.npmjs.com/package/@rolldown/pluginutils) exports some utilities for hook filters like `exactRegex` and `prefixRegex`.
:::

  In some cases, other plugin hooks may need access to the dev server instance (e.g. accessing the WebSocket server, the file system watcher, or the module graph). This hook can also be used to store the server instance for access in other hooks:
    /**
     * attribute values will be escaped automatically if needed
     */