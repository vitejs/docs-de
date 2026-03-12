## build.ssrEmitAssets

- **Type:** `boolean`
- **Default:** `false`

During the SSR build, static assets aren't emitted as it is assumed they would be emitted as part of the client build. This option allows frameworks to force emitting them in both the client and SSR build. It is responsability of the framework to merge the assets with a post build step.

When set to `true`, the build will also generate a `.vite/manifest.json` file that contains a mapping of non-hashed asset filenames to their hashed versions, which can then be used by a server framework to render the correct asset links. When the value is a string, it will be used as the manifest file name.
In addition, you can also pass a `maxWorkers: number` option to specify the max number of workers to spawn. Defaults to the number of CPUs minus 1.

Browser compatibility target for the final bundle. The default value is a Vite special value, `'baseline-widely-available'`, which targets browsers that are included in the [Baseline](https://web-platform-dx.github.io/web-features/) Widely Available on 2026-01-01. Specifically, it is `['chrome111', 'edge111', 'firefox114', 'safari16.4']`.
) => string[]
    hostId: string
    hostType: 'html' | 'js'
The transform is performed with Oxc Transformer and the value should be a valid [Oxc Transformer target option](https://oxc.rs/docs/guide/usage/transformer/lowering#target). Custom targets can either be an ES version (e.g. `es2015`), a browser with version (e.g. `chrome58`), or an array of multiple target strings.
## build.emitAssets
Note the build will output a warning if the code contains features that cannot be safely transpiled by Oxc. See [Oxc docs](https://oxc.rs/docs/guide/usage/transformer/lowering#warnings) for more details.
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
- **Type:** `boolean | 'lightningcss' | 'esbuild'`
- **Default:** the same as [`build.minify`](#build-minify) for client, `'lightningcss'` for SSR
This option allows users to override CSS minification specifically instead of defaulting to `build.minify`, so you can configure minification for JS and CSS separately. Vite uses [Lightning CSS](https://lightningcss.dev/minification.html) by default to minify CSS. It can be configured using [`css.lightningcss`](./shared-options.md#css-lightningcss). Set the option to `'esbuild'` to use esbuild instead.
- **Type:** `boolean | 'oxc' | 'terser' | 'esbuild'`
- **Default:** `'oxc'` for client build, `false` for SSR build
Set to `false` to disable minification, or specify the minifier to use. The default is [Oxc Minifier](https://oxc.rs/docs/guide/usage/minifier) which is 30 ~ 90x faster than terser and only 0.5 ~ 2% worse compression. [Benchmarks](https://github.com/privatenumber/minification-benchmarks)

`build.minify: 'esbuild'` is deprecated and will be removed in the future.
esbuild or Terser must be installed when it is set to `'esbuild'` or `'terser'` respectively.
npm add -D esbuild
esbuild must be installed when it is set to `'esbuild'`.

```sh
npm add -D esbuild
```

## build.rolldownOptions

- **Type:** [`RolldownOptions`](https://rollupjs.org/configuration-options/)
<!-- TODO: update the link above and below to Rolldown's documentation -->
Directly customize the underlying Rolldown bundle. This is the same as options that can be exported from a Rolldown config file and will be merged with Vite's internal Rolldown options. See [Rolldown options docs](https://rollupjs.org/configuration-options/) for more details.
## build.rollupOptions
- **Type:** `RolldownOptions`
- **Deprecated**
This option is an alias of `build.rolldownOptions` option. Use `build.rolldownOptions` option instead.
<!-- TODO: we need to have a more detailed explanation here as we no longer use @rollup/plugin-dynamic-import-vars. we should say it's compatible with it though -->

<!-- TODO: update the link below to Rolldown's documentation -->

::: tip

If you'd like to reference the license file in the built code, you can use `build.rolldownOptions.output.postBanner` to inject a comment at the top of the files. For example:

<!-- TODO: add a link for output.postBanner above to Rolldown's documentation -->

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    license: true,
    rollupOptions: {
      output: {
        postBanner:
          '/* See licenses of bundled dependencies at https://example.com/license.md */',
      },
    },
  },
})
```

:::

    rolldownOptions: {
- **Type:** [`RolldownOptions`](https://rolldown.rs/reference/)
Directly customize the underlying Rolldown bundle. This is the same as options that can be exported from a Rolldown config file and will be merged with Vite's internal Rolldown options. See [Rolldown options docs](https://rolldown.rs/reference/) for more details.
- **Type:** [`WatcherOptions`](https://rolldown.rs/reference/InputOptions.watch)`| null`
- **Type:** `{ include?: string | RegExp | (string | RegExp)[], exclude?: string | RegExp | (string | RegExp)[] }`
Whether to transform dynamic imports with variables.
If you'd like to reference the license file in the built code, you can use [`build.rolldownOptions.output.postBanner`](https://rolldown.rs/reference/OutputOptions.postBanner#postbanner) to inject a comment at the top of the files. For example:
If you are writing a plugin and need to inspect each output chunk or asset's related CSS and static assets during the build, you can also use [`viteMetadata` output bundle metadata API](/guide/api-plugin#output-bundle-metadata).
