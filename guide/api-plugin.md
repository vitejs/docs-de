    enforce: 'post',
## Chunk Import Map Information

:::info Experimental

This feature is experimental and may change in the future.

:::

When [`build.chunkImportMap`](/config/build-options#build-chunkimportmap) option is enabled, the import statements in the generated chunks will use a unique ID for each chunk instead of the file path.

To get the mapping from the chunk ID to the file path, you can access the import map emitted to the bundle in the `generateBundle` hook or the `writeBundle` hook. The import map has the name specified by [`build.rolldownOptions.experimental.chunkImportMap.fileName`](https://rolldown.rs/reference/InputOptions.experimental#chunkimportmap) (defaults to `importmap.json`).

```ts
function accessImportMap() {
  let config: ResolvedConfig
  return {
    name: 'access-import-map',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    generateBundle(options, bundle) {
      const chunkImportMap =
        config.build.rolldownOptions.experimental?.chunkImportMap
      if (chunkImportMap) {
        const importMapFilename =
          typeof chunkImportMap === 'object' && chunkImportMap.fileName
            ? chunkImportMap.fileName
            : 'importmap.json'
        const importMap = bundle[importMapFilename]! as OutputAsset
        const mapping = JSON.parse(importMap.source).imports
        console.log(mapping)
        // { "./entry.hash1.js": "./entry.hash2.js" }
      }
    },
  }
}
```
See also [Virtual Modules Convention](https://rolldown.rs/apis/plugin-api#virtual-modules).
- **Type:** `(config: UserConfig, env: { mode: 'build' | 'serve', command: string, isSsrBuild?: boolean, isPreview?: boolean }) => UserConfig | null | void`
      bundle?: import('rolldown').OutputBundle
      chunk?: import('rolldown').OutputChunk
      originalUrl?: string
- [`options`](https://rolldown.rs/reference/Interface.Plugin#options)
To send events from the client to the server, we can use [`hot.send`](/guide/api-hmr.html#hot-send-event-data):
Virtual modules allow you to pass build time information to the source files using normal ESM import syntax. See [Virtual Modules Convention](https://rolldown.rs/apis/plugin-api#virtual-modules) for the full convention.
In Vite, since `\0` is not a permitted char in import URLs, a `\0{id}` virtual id ends up encoded as `/@id/__x00__{id}` during dev in the browser. The id is decoded back before entering the plugins pipeline, so this is not seen by plugin hooks code.
    IndexHtmlTransformResult | void | Promise<IndexHtmlTransformResult | void>
## Rolldown Hooks
All rolldown hooks are [per-environment hooks](/guide/api-environment-plugins#per-environment-hooks-and-global-hooks).

- **Scope:** [Global](/guide/api-environment-plugins#per-environment-hooks-and-global-hooks)
- **Scope:** [Global](/guide/api-environment-plugins#per-environment-hooks-and-global-hooks)
- **Scope:** [Global](/guide/api-environment-plugins#per-environment-hooks-and-global-hooks)
- **Scope:** [Global](/guide/api-environment-plugins#per-environment-hooks-and-global-hooks)
- **Scope:** [Per-environment](/guide/api-environment-plugins#per-environment-hooks-and-global-hooks)
- **Scope:** [Per-environment](/guide/api-environment-plugins#per-environment-hooks-and-global-hooks)
### `closeServer`

- **Type:** `(context: { reason: 'restart' | 'close' }) => void | Promise<void>`
- **Kind:** `async`, `parallel`
- **Scope:** [Global](/guide/api-environment-plugins#per-environment-hooks-and-global-hooks)

  Called when the dev server is restarted or closed, after the server has been torn down. Typically used to dispose resources created in [`configureServer`](/guide/api-plugin.html#configureserver).

  The `context.reason` distinguishes the two cases:
  - `'restart'`: the server is restarting (e.g. a config file change or a call to `server.restart()`).
  - `'close'`: the server is shutting down (e.g. the `q` shortcut, or a call to `server.close()`).

  ```js
  const myPlugin = () => {
    let resource
    return {
      name: 'close-server',
      configureServer(server) {
        resource = createResource()
      },
      async closeServer({ reason }) {
        if (reason === 'close') {
          await resource.dispose()
        }
      },
    }
  }
  ```

### `closePreviewServer`

- **Type:** `() => void | Promise<void>`
- **Kind:** `async`, `parallel`
- **Scope:** [Global](/guide/api-environment-plugins#per-environment-hooks-and-global-hooks)

  Same as [`closeServer`](/guide/api-plugin.html#closeserver) but for the preview server. The preview server never restarts, so there is no `reason`.

  ```js
  const myPlugin = () => {
    let resource
    return {
      name: 'close-preview-server',
      configurePreviewServer(server) {
        resource = createResource()
      },
      async closePreviewServer() {
        await resource.dispose()
      },
    }
  }
  ```

## Referencing Emitted Assets

To emit an asset from a plugin, call [`this.emitFile({ type: 'asset', ... })`](https://rolldown.rs/reference/Interface.PluginContext#in-depth-type-asset). It returns a `referenceId` that you can use to generate the asset's URL, since its final file name isn't known until the bundle is generated.

### In JavaScript

Use `import.meta.ROLLDOWN_FILE_URL_<referenceId>`:

```js
const referenceId = this.emitFile({
  type: 'asset',
  name: 'icon.png',
  source: fileContent,
})

// it's a JavaScript expression, so append any query or hash with string concatenation
return `export default import.meta.ROLLDOWN_FILE_URL_${referenceId} + '#frag'`
```

### In CSS or HTML

`import.meta.ROLLDOWN_FILE_URL_<referenceId>` only works in JavaScript expression position. In CSS or HTML, use the `__VITE_ASSET__<referenceId>__` token instead, appending any query or hash right after it:

```css
background: url(__VITE_ASSET__<referenceId>__#frag);
```

For plugin hooks that have access to the plugin context, Vite exposes additional properties on `this.meta`:
Make sure to include the `.d.ts` extension when specifying TypeScript declaration files. Otherwise, TypeScript may not know which file the module is trying to extend.