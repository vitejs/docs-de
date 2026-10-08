```js{12-15} twoslash [server.js]
::: tip SSR-only module updates
By default, updating a module that is only imported by the SSR environment does not reload the page in the browser. Framework integrations usually handle this for you. For a low-level custom SSR setup, you can add a plugin that reloads the browser when an SSR-only module changes:

```ts twoslash
import type { EnvironmentModuleNode, Plugin } from 'vite'

export function ssrReload(): Plugin {
  return {
    name: 'ssr-reload',
    enforce: 'post',
    hotUpdate: {
      order: 'post',
      handler({ modules, server, timestamp }) {
        if (this.environment.name !== 'ssr') return

        const invalidatedModules = new Set<EnvironmentModuleNode>()
        let hasSsrOnlyModules = false

        for (const mod of modules) {
          if (mod.file == null) continue
          const clientModules =
            server.environments.client.moduleGraph.getModulesByFile(mod.file)
          if (clientModules != null) continue

          this.environment.moduleGraph.invalidateModule(
            mod,
            invalidatedModules,
            timestamp,
            true,
          )
          hasSsrOnlyModules = true
        }

        if (hasSsrOnlyModules) {
          server.environments.client.hot.send({ type: 'full-reload' })
          return []
        }
      },
    },
  }
}
```

Add `ssrReload()` to the `plugins` array passed to `createViteServer` in the example above. See the [`hotUpdate` hook](./api-environment-plugins#the-hotupdate-hook) for details.
:::
