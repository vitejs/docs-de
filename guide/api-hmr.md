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
```dot
digraph hmr_boundary {
  rankdir=RL
  ranksep=0.3
  node [shape=box style="rounded,filled" fontname="Arial" fontsize=11 margin="0.2,0.1" fontcolor="${#3c3c43|#ffffff}" color="${#c2c2c4|#3c3f44}"]
  edge [color="${#67676c|#98989f}" fontname="Arial" fontsize=10 fontcolor="${#67676c|#98989f}"]
  bgcolor="transparent"

  root [label="main.js" fillcolor="${#f6f6f7|#2e2e32}"]
  parent [label="App.vue" fillcolor="${#f6f6f7|#2e2e32}"]
  boundary [label="Component.vue\n(HMR boundary)\nhot.accept()" fillcolor="${#def5ed|#15312d}" color="${#18794e|#3dd68c}" penwidth=2]
  edited [label="utils.js\n(edited)" fillcolor="${#fcf4dc|#38301a}" color="${#915930|#f9b44e}" penwidth=2]

  boundary -> edited [label="imports" color="${#915930|#f9b44e}" style=bold]
  parent -> boundary [label="imports" style=dashed]
  root -> parent [label="imports" style=dashed]
}
```
