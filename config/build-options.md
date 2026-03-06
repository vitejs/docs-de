## build.ssrEmitAssets

- **Type:** `boolean`
- **Default:** `false`

During the SSR build, static assets aren't emitted as it is assumed they would be emitted as part of the client build. This option allows frameworks to force emitting them in both the client and SSR build. It is responsability of the framework to merge the assets with a post build step.

When set to `true`, the build will also generate a `.vite/manifest.json` file that contains a mapping of non-hashed asset filenames to their hashed versions, which can then be used by a server framework to render the correct asset links. When the value is a string, it will be used as the manifest file name.
In addition, you can also pass a `maxWorkers: number` option to specify the max number of workers to spawn. Defaults to the number of CPUs minus 1.

During the SSR build, static assets aren't emitted as it is assumed they would be emitted as part of the client build. This option allows frameworks to force emitting them in both the client and SSR build. It is responsibility of the framework to merge the assets with a post build step.
) => string[]
    hostId: string
    hostType: 'html' | 'js'
The `resolveDependencies` function will be called for each dynamic import with a list of the chunks it depends on, and it will also be called for each chunk imported in entry HTML files. A new dependencies array can be returned with these filtered or more dependencies injected, and their paths modified. The `deps` paths are relative to the `build.outDir`. The return value should be a relative path to the `build.outDir`.
## build.emitAssets

- **Type:** `boolean`
- **Default:** `false`

During non-client builds, static assets aren't emitted as it is assumed they would be emitted as part of the client build. This option allows frameworks to force emitting them in other environments build. It is responsibility of the framework to merge the assets with a post build step.

During the SSR build, static assets aren't emitted as it is assumed they would be emitted as part of the client build. This option allows frameworks to force emitting them in both the client and SSR build. It is responsibility of the framework to merge the assets with a post build step. This option will be replaced by `build.emitAssets` once Environment API is stable.
Build as a library. `entry` is required since the library cannot use HTML as entry. `name` is the exposed global variable and is required when `formats` includes `'umd'` or `'iife'`. Default `formats` are `['es', 'umd']`, or `['es', 'cjs']`, if multiple entries are used. `fileName` is the name of the package file output, default `fileName` is the name option of package.json, it can also be defined as function taking the `format` and `entryName` as arguments.
## build.license

- **Type:** `boolean | { fileName?: string }`
- **Default:** `false`

When set to `true`, the build will generate a `.vite/license.md` file that includes all bundled dependencies' licenses. It can be hosted to display and acknowledge the dependencies used by the app. When `fileName` is passed, it will be used as the license file name relative to the `outDir`. An example output may look like this:

```md
# Licenses

The app bundles dependencies which contain the following licenses:

## dep-1 - 1.2.3 (CC0-1.0)

CC0 1.0 Universal

...

## dep-2 - 4.5.6 (MIT)

MIT License

...
```

If the `fileName` ends with `.json`, the raw JSON metadata will be generated instead and can be used for further processing. For example:
```json
[
  {
  // prettier-ignore
    "name": "dep-1",
    "version": "1.2.3",
    "identifier": "CC0-1.0",
    "text": "CC0 1.0 Universal\n\n..."
  },
  {
    "name": "dep-2",
    "version": "4.5.6",
    "identifier": "MIT",
    "text": "MIT License\n\n..."
  }
```

::: tip
If you'd like to reference the license file in the built code, you can use `build.rollupOptions.output.banner` to inject a comment at the top of the files. For example:

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    license: true,
    rollupOptions: {
      output: {
        banner:
          '/* See licenses of bundled dependencies at https://example.com/license.md */',
      },
    },
  },
})
```

:::

- **Related:** [License](/guide/features#license)
When set to `true`, the build will generate a `.vite/license.md` file that includes all bundled dependencies' licenses.
If `fileName` is passed, it will be used as the license file name relative to the `outDir`. If it ends with `.json`, the raw JSON metadata will be generated instead and can be used for further processing. For example: