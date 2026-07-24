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