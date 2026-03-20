# Migration from v7
## New Features
If you are migrating from `rolldown-vite`, the technical preview release for Rolldown integrated Vite for v6 & v7, only the sections with <Badge text="NRV" type="warning" /> in the title are applicable.

## Default Browser Target Change [<Badge text="NRV" type="warning" />](#migration-from-v7)
- Firefox 104 → 114
The default browser value of `build.target` and `'baseline-widely-available'`, is updated to newer browser version:

Vite 8 uses Oxc based tools instead of esbuild and Rollup.

### Gradual migration

`rolldown-vite` package implements Vite 7 with Rolldown integration, but without the other Vite 8 changes. This can be used as a intermediate step to migrate to Vite 8. See [the Rolldown Integration guide](https://v7.vite.dev/guide/rolldown) in the Vite 7 docs to switch to `rolldown-vite` from Vite 7.
These browser versions align with [Baseline Widely Available](https://web-platform-dx.github.io/web-features/) feature sets as of 2026-01-01. In other words, they were all released about two and a half years ago.
<!-- TODO: Hide the guide from the sidebar as it is irrelevant in Vite 8. Also update the content there -->
## Rolldown
For users migrating from `rolldown-vite` to Vite 8, you can undo the dependencies changes in `package.json` and update to Vite 8.
Vite 8 uses [Rolldown](https://rolldown.rs/) and [Oxc](https://oxc.rs/) based tools instead of [esbuild](https://esbuild.github.io/) and [Rollup](https://rollupjs.org/).
```json
### Gradual Migration
  "dependencies": {
The `rolldown-vite` package implements Vite 7 with Rolldown, without other Vite 8 changes. This can be used as a intermediate step to migrate to Vite 8. See [the Rolldown Integration guide](https://v7.vite.dev/guide/rolldown) in the Vite 7 docs to switch to `rolldown-vite` from Vite 7.
    "vite": "^8.0.0" // [!code ++]
For users migrating from `rolldown-vite` to Vite 8, you can undo the dependency changes in `package.json` and update to Vite 8:

### Dependency Optimizer now uses Rolldown

  "devDependencies": {

The following options are converted:

- [`esbuildOptions.minify`](https://esbuild.github.io/api/#minify) -> `rolldownOptions.output.minify`
- [`esbuildOptions.treeShaking`](https://esbuild.github.io/api/#tree-shaking) -> `rolldownOptions.treeshake`
- [`esbuildOptions.define`](https://esbuild.github.io/api/#define) -> `rolldownOptions.transform.define`
### Dependency Optimizer Now Uses Rolldown
- [`esbuildOptions.preserveSymlinks`](https://esbuild.github.io/api/#preserve-symlinks) -> `!rolldownOptions.resolve.symlinks`
Rolldown is now used for dependency optimization instead of esbuild. Vite still supports [`optimizeDeps.esbuildOptions`](/config/dep-optimization-options#optimizedeps-esbuildoptions) for backward compatibility by converting it to [`optimizeDeps.rolldownOptions`](/config/dep-optimization-options#optimizedeps-rolldownoptions) automatically. `optimizeDeps.esbuildOptions` is now deprecated and will be removed in the future and we encourage you to migrate to `optimizeDeps.rolldownOptions`.
- [`esbuildOptions.mainFields`](https://esbuild.github.io/api/#main-fields) -> `rolldownOptions.resolve.mainFields`
The following options are converted automatically:
- [`esbuildOptions.keepNames`](https://esbuild.github.io/api/#keep-names) -> `rolldownOptions.output.keepNames`
- [`esbuildOptions.minify`](https://esbuild.github.io/api/#minify) -> [`rolldownOptions.output.minify`](https://rolldown.rs/reference/OutputOptions.minify)
- [`esbuildOptions.treeShaking`](https://esbuild.github.io/api/#tree-shaking) -> [`rolldownOptions.treeshake`](https://rolldown.rs/reference/InputOptions.treeshake)
- [`esbuildOptions.define`](https://esbuild.github.io/api/#define) -> [`rolldownOptions.transform.define`](https://rolldown.rs/reference/InputOptions.transform#define)
- [`esbuildOptions.loader`](https://esbuild.github.io/api/#loader) -> [`rolldownOptions.moduleTypes`](https://rolldown.rs/reference/InputOptions.moduleTypes)
- [`esbuildOptions.preserveSymlinks`](https://esbuild.github.io/api/#preserve-symlinks) -> [`!rolldownOptions.resolve.symlinks`](https://rolldown.rs/reference/InputOptions.resolve#symlinks)
- [`esbuildOptions.resolveExtensions`](https://esbuild.github.io/api/#resolve-extensions) -> [`rolldownOptions.resolve.extensions`](https://rolldown.rs/reference/InputOptions.resolve#extensions)
- [`esbuildOptions.mainFields`](https://esbuild.github.io/api/#main-fields) -> [`rolldownOptions.resolve.mainFields`](https://rolldown.rs/reference/InputOptions.resolve#mainfields)
- [`esbuildOptions.conditions`](https://esbuild.github.io/api/#conditions) -> [`rolldownOptions.resolve.conditionNames`](https://rolldown.rs/reference/InputOptions.resolve#conditionnames)
- [`esbuildOptions.keepNames`](https://esbuild.github.io/api/#keep-names) -> [`rolldownOptions.output.keepNames`](https://rolldown.rs/reference/OutputOptions.keepNames)
- [`esbuildOptions.platform`](https://esbuild.github.io/api/#platform) -> [`rolldownOptions.platform`](https://rolldown.rs/reference/InputOptions.platform)
- [`esbuildOptions.plugins`](https://esbuild.github.io/plugins/) -> [`rolldownOptions.plugins`](https://rolldown.rs/reference/InputOptions.plugins) (partial support)
},
You can get the options set by the compatibility layer from the `configResolved` hook:

### JS Transformation by Oxc

Oxc is now used for JS transformation instead of esbuild. Vite still supports the [`esbuild`](/config/shared-options#esbuild) option for backward compatibility by converting it to [`oxc`](/config/shared-options#oxc) internally. But `esbuild` is deprecated and will be removed in the future and we encourage you to migrate to `oxc`.

    console.log('options', config.optimizeDeps.rolldownOptions)

- `esbuild.jsxInject` -> `oxc.jsxInject`
- `esbuild.include` -> `oxc.include`
- `esbuild.exclude` -> `oxc.exclude`
### JavaScript Transforms by Oxc
  - `esbuild.jsx: 'preserve'` -> `oxc.jsx: 'preserve'`
Oxc is now used for JavaScript transformation instead of esbuild. Vite still supports the [`esbuild`](/config/shared-options#esbuild) option for backward compatibility by converting it to [`oxc`](/config/shared-options#oxc) automatically. `esbuild` is now deprecated and will be removed in the future and we encourage you to migrate to `oxc`.
    - [`esbuild.jsxImportSource`](https://esbuild.github.io/api/#jsx-import-source) -> `oxc.jsx.importSource`
The following options are converted automatically:
    - [`esbuild.jsxFactory`](https://esbuild.github.io/api/#jsx-factory) -> `oxc.jsx.pragma`
    - [`esbuild.jsxFragment`](https://esbuild.github.io/api/#jsx-fragment) -> `oxc.jsx.pragmaFrag`
  - [`esbuild.jsxDev`](https://esbuild.github.io/api/#jsx-dev) -> `oxc.jsx.development`
  - [`esbuild.jsxSideEffects`](https://esbuild.github.io/api/#jsx-side-effects) -> `oxc.jsx.pure`
- [`esbuild.define`](https://esbuild.github.io/api/#define) -> [`oxc.define`](https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#define)
- [`esbuild.banner`](https://esbuild.github.io/api/#banner) -> custom plugin using transform hook
- [`esbuild.footer`](https://esbuild.github.io/api/#footer) -> custom plugin using transform hook

[`esbuild.supported`](https://esbuild.github.io/api/#supported) option is not supported by Oxc. If you need these options, please check [oxc-project/oxc#15373](https://github.com/oxc-project/oxc/issues/15373).

You can also get the options set by the compatibility layer from the `configResolved` hook:

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.oxc)
The [`esbuild.supported`](https://esbuild.github.io/api/#supported) option is not supported by Oxc. If you need this option, please see [oxc-project/oxc#15373](https://github.com/oxc-project/oxc/issues/15373).
},
You can get the options set by the compatibility layer from the `configResolved` hook:

<!-- TODO: add link to rolldownOptions.output.minify -->

Currently, Oxc transformer does not support lowering native decorators ([oxc-project/oxc#9170](https://github.com/oxc-project/oxc/issues/9170)).

:::: details Workaround for lowering native decorators

You can use [Babel](https://babeljs.io/) or [SWC](https://swc.rs/) to lower native decorators for the time being. While SWC is faster than Babel, it does **not support the latest decorator spec** that esbuild supports.

The decorator spec has been updated multiple times since it reached stage 3 and the versions supported by each tools are (the version names are same with [babel's options](https://babeljs.io/docs/babel-plugin-proposal-decorators#version)):
Currently, the Oxc transformer does not support lowering native decorators as we are waiting for the specification to progress, see ([oxc-project/oxc#9170](https://github.com/oxc-project/oxc/issues/9170)).
- `"2023-01"` (TS5.0+ supports this version)
- `"2022-03"` (SWC supports this version)

**If you want to use babel:**

The decorator spec has been updated multiple times since it reached stage 3. The versions supported by each tool are:

- `"2023-11"` (esbuild, TypeScript 5.4+ and Babel support this version)
- `"2023-05"` (TypeScript 5.2+ supports this version)
- `"2023-01"` (TypeScript 5.0+ supports this version)

```bash [Yarn]
See the [Babel decorators versions guide](https://babeljs.io/docs/babel-plugin-proposal-decorators#version) for differences between each version.

**Using Babel:**
```

```bash [pnpm]
$ pnpm add -D @rollup/plugin-babel @babel/plugin-proposal-decorators
$ npm install -D @rolldown/plugin-babel @babel/plugin-proposal-decorators

```bash [Bun]
$ bun add -D @rollup/plugin-babel @babel/plugin-proposal-decorators
$ yarn add -D @rolldown/plugin-babel @babel/plugin-proposal-decorators

```bash [Deno]
$ deno add -D npm:@rollup/plugin-babel npm:@babel/plugin-proposal-decorators
$ pnpm add -D @rolldown/plugin-babel @babel/plugin-proposal-decorators

:::

$ bun add -D @rolldown/plugin-babel @babel/plugin-proposal-decorators
import { defineConfig, withFilter } from 'vite'
import { babel } from '@rollup/plugin-babel'

$ deno add -D npm:@rolldown/plugin-babel npm:@babel/plugin-proposal-decorators
  plugins: [
    withFilter(
      babel({
        configFile: false,
        plugins: [
import { defineConfig } from 'vite'
import babel from '@rolldown/plugin-babel'

function decoratorPreset(options: Record<string, unknown>) {
  return {
    preset: () => ({
      plugins: [['@babel/plugin-proposal-decorators', options]],
    }),
    rolldown: {
      // Only run this transform if the file contains a decorator.
      filter: {
        code: '@',
      },
    },
  }
}
      }),
      // only run this transform if the file contains a decorator
  plugins: [babel({ presets: [decoratorPreset({ version: '2023-11' })] })],
```

```bash [Yarn]
**Using SWC:**
```

```bash [pnpm]
$ pnpm add -D @rollup/plugin-swc @swc/core
```
```bash [Bun]
$ bun add -D @rollup/plugin-swc @swc/core
```
```bash [Deno]
$ deno add -D npm:@rollup/plugin-swc npm:@swc/core
```

:::

```js
import { defineConfig, withFilter } from 'vite'

export default defineConfig({
  // ...
  plugins: [
    withFilter(
      swc({
        swc: {
          jsc: {
            parser: { decorators: true, decoratorsBeforeExport: true },
            // NOTE: SWC doesn't support '2023-11' version yet
            transform: { decoratorVersion: '2022-03' },
          },
        },
      }),
      // only run this transform if the file contains a decorator
      { transform: { code: '@' } },
    ),
  ],
})
```
            // NOTE: SWC doesn't support the '2023-11' version yet.
::::

Note that if you use a plugin that uses `transformWithEsbuild` function, you need to install `esbuild` as a dev dependency as it's now an optional dependency. `transformWithEsbuild` function is now deprecated and will be removed in the future. We recommend to use the new `transformWithOxc` function instead.

      // Only run this transform if the file contains a decorator.

Oxc Minifier is now used for JS minification by default instead of esbuild. You can use [`build.minify: 'esbuild'`](/config/build-options#minify) option to switch back to esbuild, but this is deprecated and will be removed in the future. Note that you need to install `esbuild` as a dev dependency as it's now an optional dependency.

If you were using `esbuild.minify*` options to control the minification behavior, you can use `build.rolldownOptions.output.minify` option instead. If you were using `esbuild.drop` option, you can use [`build.rolldownOptions.output.minify.compress.drop*` options](https://oxc.rs/docs/guide/usage/minifier/dead-code-elimination) instead.

Property mangling feature is not supported by Oxc and the related options ([`mangleProps`, `reserveProps`, `mangleQuoted`, `mangleCache`](https://esbuild.github.io/api/#mangle-props)) are not supported. If you need these options, please check [oxc-project/oxc#15375](https://github.com/oxc-project/oxc/issues/15375).

Note that esbuild and Oxc Minifier have a slightly different assumptions about the input code. While this would not affect most projects, you can compare the assumptions if the minifier breaks your code ([esbuild assumptions](https://esbuild.github.io/api/#minify-considerations), [Oxc Minifier assumptions](https://oxc.rs/docs/guide/usage/minifier.html#assumptions)).
#### esbuild Fallbacks

`esbuild` is no longer directly used by Vite and is now an optional dependency. If you are using a plugin that uses the `transformWithEsbuild` function, you need to install `esbuild` as a `devDependency`. The `transformWithEsbuild` function is deprecated and will be removed in the future. We recommend migrating to the new `transformWithOxc` function instead.

### JavaScript Minification by Oxc

The Oxc Minifier is now used for JavaScript minification instead of esbuild. You can use the deprecated [`build.minify: 'esbuild'`](/config/build-options#build-minify) option to switch back to esbuild. This configuration option will be removed in the future and you need install `esbuild` as a `devDependency` as Vite no longer relies on esbuild directly.
### CSS Minification by Lightning CSS
If you were using the `esbuild.minify*` options to control minification behavior, you can now use `build.rolldownOptions.output.minify` instead. If you were using the `esbuild.drop` option, you can now use [`build.rolldownOptions.output.minify.compress.drop*` options](https://oxc.rs/docs/guide/usage/minifier/dead-code-elimination).
[Lightning CSS](https://lightningcss.dev/) is now used for CSS minification by default. You can use [`build.cssMinify: 'esbuild'`](/config/build-options#cssminify) option to switch back to esbuild. Note that you need to install `esbuild` as a dev dependency as it's now an optional dependency.
Property mangling and its related options ([`mangleProps`, `reserveProps`, `mangleQuoted`, `mangleCache`](https://esbuild.github.io/api/#mangle-props)) are not supported by Oxc. If you need these options, please see [oxc-project/oxc#15375](https://github.com/oxc-project/oxc/issues/15375).
Lightning CSS supports more syntax lowering, so you may see a bigger CSS bundle size.
esbuild and Oxc Minifier make slightly different assumptions about source code. In case you suspect the minifier is causing breakage in your code, you can compare these assumptions here:
### Consistent CJS Interop
- [esbuild minify assumptions](https://esbuild.github.io/api/#minify-considerations)
- [Oxc Minifier assumptions](https://oxc.rs/docs/guide/usage/minifier.html#assumptions)
The `default` import from a CJS module is now handled in a consistent way.
Please report any issues you find related to minification in your JavaScript apps.
If it matches one of the following conditions, the `default` import is the `module.exports` value of the importee CJS module. Otherwise, the `default` import is the `module.exports.default` value of the importee CJS module.

- The importer is `.mjs` or `.mts`
[Lightning CSS](https://lightningcss.dev/) is now used for CSS minification by default. You can use the [`build.cssMinify: 'esbuild'`](/config/build-options#build-cssminify) option to switch back to esbuild. Note that you need to install `esbuild` as a `devDependency`.
- The `module.exports.__esModule` value of the importee CJS module is not set to true
Lightning CSS supports better syntax lowering and your CSS bundle size might increase slightly.
::: details The previous behaviors
### Consistent CommonJS Interop
In dev, if it matches one of the following conditions, the `default` import is the `module.exports` value of the importee CJS module. Otherwise, the `default` import is the `module.exports.default` value of the importee CJS module.
The `default` import from a CommonJS (CJS) module is now handled in a consistent way.
- _The importer is included in the dependency optimization_ and `.mjs` or `.mts`
If it matches one of the following conditions, the `default` import is the `module.exports` value of the importee CJS module. Otherwise, the `default` import is the `module.exports.default` value of the importee CJS module:
- The `module.exports.__esModule` value of the importee CJS module is not set to true
- The importer is `.mjs` or `.mts`.
- The closest `package.json` for the importer has a `type` field set to `module`.
- The `module.exports.__esModule` value of the importee CJS module is not set to true.
- The `module.exports.__esModule` value of the importee CJS module is not set to true
::: details The previous behavior

In development, if it matches one of the following conditions, the `default` import is the `module.exports` value of the importee CJS module. Otherwise, the `default` import is the `module.exports.default` value of the importee CJS module:

- _The importer is included in the dependency optimization_ and `.mjs` or `.mts`.
- _The importer is included in the dependency optimization_ and the closest `package.json` for the importer has a `type` field set to `module`.
- The `module.exports.__esModule` value of the importee CJS module is not set to true.

This change may break some existing code importing CJS modules. You can use the `legacy.inconsistentCjsInterop: true` option to temporary restore the previous behavior. Note that this option will be removed in the future. If you find a package that is affected by this change, please report it to the package author. Make sure to link to the Rolldown document above so that the author can understand the context.

- The `module.exports.__esModule` value of the importee CJS module is not set to true.
- _`default` property of `module.exports` does not exist_.
When both `browser` and `module` fields are present in `package.json`, Vite used to resolve the field based on the content of the file, trying to pick the ESM file for browsers. This was introduced because some packages were using the `module` field to point to ESM files for Node.js and some other packages were using the `browser` field to point to UMD files for browsers. Given that the modern `exports` field solved this problem and is now adopted by many packages, Vite no longer uses this heuristic and always respects the order of the [`resolve.mainFields`](/config/shared-options#resolve-mainfields) option. If you were relying on this behavior, you can use the [`resolve.alias`](/config/shared-options#resolve-alias) option to map the field to the desired file or apply a patch with your package manager (e.g. `patch-package`, `pnpm patch`).

### Require Calls For Externalized Modules

`require` calls for externalized modules are now preserved as `require` calls and not converted to `import` statements. This is to preserve the semantics of `require` calls.
See Rolldown's docs about this problem for more details: [Ambiguous `default` import from CJS modules - Bundling CJS | Rolldown](https://rolldown.rs/in-depth/bundling-cjs#ambiguous-default-import-from-cjs-modules).

This change may break some existing code importing CJS modules. You can use the deprecated `legacy.inconsistentCjsInterop: true` option to temporarily restore the previous behavior. If you find a package that is affected by this change, please report it to the package author or send them a pull request. Make sure to link to the Rolldown documentation above so that the author can understand the context.

import { defineConfig, esmExternalRequirePlugin } from 'vite'

When both `browser` and `module` fields are present in `package.json`, Vite used to resolve the field based on the content of the file and it used to pick the ESM file for browsers. This was introduced because some packages were using the `module` field to point to ESM files for Node.js and some other packages were using the `browser` field to point to UMD files for browsers. Given that the modern `exports` field solved this problem and is now adopted by many packages, Vite no longer uses this heuristic and always respects the order of the [`resolve.mainFields`](/config/shared-options#resolve-mainfields) option. If you were relying on this behavior, you can use the [`resolve.alias`](/config/shared-options#resolve-alias) option to map the field to the desired file or apply a patch with your package manager (e.g. `patch-package`, `pnpm patch`).
  // ...
  plugins: [
    esmExternalRequirePlugin({
`require` calls for externalized modules are now preserved as `require` calls and not converted to `import` statements. This is to preserve the semantics of `require` calls. If you want to convert them to `import` statements, you can use [Rolldown's built-in `esmExternalRequirePlugin`](https://rolldown.rs/builtin-plugins/esm-external-require), which is re-exported from `vite`.
})
```

See Rolldown's document for more details: [`require` external modules - Bundling CJS | Rolldown](https://rolldown.rs/in-depth/bundling-cjs#require-external-modules).

### `import.meta.url` in UMD / IIFE

`import.meta.url` is not polyfilled in UMD / IIFE output formats. It will be replaced with `undefined` by default. If you prefer the previous behavior, you can use the `define` option with `build.rolldownOptions.output.intro` option. See Rolldown's document for more details: [Well-known `import.meta` properties - Non ESM Output Formats | Rolldown](https://rolldown.rs/in-depth/non-esm-output-formats#well-known-import-meta-properties).

### Removed `build.rollupOptions.watch.chokidar` option

`build.rollupOptions.watch.chokidar` option is removed. Please migrate to `build.rolldownOptions.watch.notify` option.

<!-- TODO: add link to rolldownOptions.watch.notify -->
See Rolldown's docs for more details: [`require` external modules - Bundling CJS | Rolldown](https://rolldown.rs/in-depth/bundling-cjs#require-external-modules).
### Deprecate `build.rollupOptions.output.manualChunks`

`output.manualChunks` option is deprecated. Rolldown has `advacedChunks` option, which is more flexible. Please migrate to `output.advancedChunks` option. See Rolldown's document for more details about `advancedChunks`: [Advanced Chunks - Rolldown](https://rolldown.rs/in-depth/advanced-chunks).
`import.meta.url` is no longer polyfilled in UMD / IIFE output formats. It will be replaced with `undefined` by default. If you prefer the previous behavior, you can use the [`define`](/config/shared-options#define) option with [`build.rolldownOptions.output.intro`](https://rolldown.rs/reference/OutputOptions.intro) option. See Rolldown's docs for more details: [Well-known `import.meta` properties - Non ESM Output Formats | Rolldown](https://rolldown.rs/in-depth/non-esm-output-formats#well-known-import-meta-properties).
<!-- TODO: add link to rolldownOptions.output.advancedChunks -->

### Other Related Deprecations
The `build.rollupOptions.watch.chokidar` option was removed. Please migrate to the [`build.rolldownOptions.watch.watcher`](https://rolldown.rs/reference/InputOptions.watch#watcher) option.
- `build.rollupOptions`: renamed to `build.rolldownOptions`
### Removed object form `build.rollupOptions.output.manualChunks` and deprecate function form one

The object form `output.manualChunks` option is not supported anymore. The function form `output.manualChunks` is deprecated. Rolldown has the more flexible [`codeSplitting`](https://rolldown.rs/reference/OutputOptions.codeSplitting) option. See Rolldown's docs for more details about `codeSplitting`: [Manual Code Splitting - Rolldown](https://rolldown.rs/in-depth/manual-code-splitting).
- **[TODO: fix before stable release]** https://github.com/rolldown/rolldown/issues/5726 (affects nuxt, qwik)
### `build()` Throws `BundleError`

_This change only affects JS API users._

`build()` now throws a [`BundleError`](https://rolldown.rs/reference/TypeAlias.BundleError) instead of the raw error thrown in the plugin. `BundleError` is typed as `Error & { errors?: RolldownError[] }` and it wraps the individual errors in an `errors` array. If you need the individual errors, you need to access `.errors`:

```js
try {
  await build()
} catch (e) {
  if (e.errors) {
    for (const error of e.errors) {
      console.log(error.code) // error code
    }
  }
}
```

### Module Type Support and Auto Detection

_This change only affects plugin authors._

Rolldown has experimental support for [Module types](https://rolldown.rs/guide/notable-features#module-types), similar to [esbuild's `loader` option](https://esbuild.github.io/api/#loader). Due to this, Rolldown automatically sets a module type based on the extension of the resolved id. If you are converting content from other module types to JavaScript in `load` or `transform` hooks, you may need to add `moduleType: 'js'` to the returned value:

```js
const plugin = {
  name: 'txt-loader',
  load(id) {
    if (id.endsWith('.txt')) {
      const content = fs.readFile(id, 'utf-8')
      return {
        code: `export default ${JSON.stringify(content)}`,
        moduleType: 'js', // [!code ++]
      }
    }
  },
}
```

- **[TODO: fix before stable release]** https://github.com/rolldown/rolldown/issues/3403 (affects sveltekit)
- **[TODO: fix before stable release]** Legacy chunks are emitted as an asset file instead of a chunk file due to the lack of prebuilt chunk emit feature ([rolldown#4304](https://github.com/rolldown/rolldown/issues/4034)). This means the chunk related options does not apply to legacy chunks and the manifest file will not include legacy chunks as a chunk file.
- **[TODO: fix before stable release]** resolver cache breaks minor cases in Vitest ([rolldown-vite#466](https://github.com/vitejs/rolldown-vite/issues/466), [vitest#8754](https://github.com/vitest-dev/vitest/issues/8754#issuecomment-3441115032))
- **[TODO: fix before stable release]** The resolver does not work with yarn pnp ([rolldown-vite#324](https://github.com/vitejs/rolldown-vite/issues/324), [rolldown-vite#392](https://github.com/vitejs/rolldown-vite/issues/392))
- **[TODO: fix before stable release]** native plugin ordering issue ([rolldown-vite#373](https://github.com/vitejs/rolldown-vite/issues/373))
- **[TODO: fix before stable release]** `@vite-ignore` comment edge case ([rolldown-vite#426](https://github.com/vitejs/rolldown-vite/issues/426))
- `build.commonjsOptions`: it is now no-op
- `build.dynamicImportVarsOptions.warnOnError`: it is now no-op
- `resolve.alias[].customResolver`: Use a custom plugin with `resolveId` hook and `enforce: 'pre'` instead
- **[TODO: fix before stable release]** https://github.com/rolldown/rolldown/issues/3403
## Removed Deprecated Features [<Badge text="NRV" type="warning" />](#migration-from-v7)
  - Assigning to `bundle[foo]` is not supported. This is discouraged by Rollup as well. Please use `this.emitFile()` instead.
- Passing an URL to `import.meta.hot.accept` is no longer supported. Please pass an id instead. ([#21382](https://github.com/vitejs/vite/pull/21382))

- **[TODO: clarify this in Rolldown's docs and link it from here]** All parallel hooks in Rollup works as sequential hooks.
- `"use strict";` is not injected sometimes. See [Rolldown's documentation](https://rolldown.rs/in-depth/directives) for more details.
These breaking changes are expected to only affect a minority of use cases:
- Passing the same browser with multiple versions of it to `build.target` option now errors: esbuild selects the latest version of it, which was probably not what you intended.
- [Extglobs](https://github.com/micromatch/picomatch/blob/master/README.md#extglobs) are not supported yet ([rolldown-vite#365](https://github.com/vitejs/rolldown-vite/issues/365))
- TypeScript legacy namespace is only supported partially. See [Oxc Transformer's related documentation](https://oxc.rs/docs/guide/usage/transformer/typescript.html#partial-namespace-support) for more details.
- `define` does not share reference for objects: When you pass an object as a value to `define`, each variable will have a separate copy of the object. See [Oxc Transformer's related documentation](https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#define) for more details.

Check the [Migration from v6 Guide](https://v7.vite.dev/guide/migration) in the Vite v7 docs first to see the needed changes to port your app to Vite 7, and then proceed with the changes on this page.
- All parallel hooks in Rollup works as sequential hooks. See [Rolldown's documentation](https://rolldown.rs/apis/plugin-api#sequential-hook-execution) for more details.
- `parseAst` / `parseAstAsync` functions are now deprecated in favor of `parseSync` / `parse` functions which has more features.
- `parseAst` / `parseAstAsync` functions are now deprecated in favor of `parseSync` / `parse` functions which have more features.
- (bug) `@vite-ignore` comment edge case ([rolldown-vite#426](https://github.com/vitejs/rolldown-vite/issues/426))
- Transforming to ES5 and below with plugin-legacy is not supported ([rolldown-vite#452](https://github.com/vitejs/rolldown-vite/issues/452))