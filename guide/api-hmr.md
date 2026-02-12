  off<T extends string>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void
## `hot.off(event, cb)`

Remove callback from the event listeners

Note that re-assignment of `data` itself is not supported. Instead, you should mutate properties of the `data` object so information added from other handlers are preserved.

```js
// ok
import.meta.hot.data.someValue = 'hello'

// not supported
import.meta.hot.data = { someValue: 'hello' }
```

See [Client-server Communication](/guide/api-plugin.html#client-server-communication) for more details, including a section on [Typing Custom Events](/guide/api-plugin.html#typescript-for-custom-events).
Vite provides type definitions for `import.meta.hot` in [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts). You can add "vite/client" in the `tsconfig.json` so TypeScript picks up the type definitions:
```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
See [Client-server Communication](/guide/api-plugin.html#client-server-communication) for more details, including a section on [Typing Custom Events](/guide/api-plugin.html#typescript-for-custom-events).