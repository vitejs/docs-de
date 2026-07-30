By default, a [module preload polyfill](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill) is automatically injected. The polyfill is auto injected into the proxy module of each `index.html` entry. If the build is configured to use a non-HTML custom entry via `build.rolldownOptions.input`, then it is necessary to manually import the polyfill in your custom entry:
Produce SSR-oriented build. The value can be a string to directly specify the SSR entry, or `true`, which requires specifying the SSR entry via `rolldownOptions.input`.
Browser compatibility target for the final bundle. The default value is a Vite special value, `'baseline-widely-available'`, which targets browsers that are included in the [Baseline](https://web-platform-dx.github.io/web-features/) Widely Available on 2026-01-01. Specifically, it is `['chrome111', 'edge111', 'firefox114', 'safari16.4', 'ios16.4']`.
## build.chunkImportMap

- **Type:** `boolean`
- **Default:** `false`
- **Experimental**
- **Related:** [Chunk Import Map Optimization](/guide/features#chunk-import-map-optimization)

Whether to use import maps feature to optimize chunk caching efficiency.

Note that this option requires [`import.meta.resolve` support](https://caniuse.com/mdn-javascript_operators_import_meta_resolve). If you need to support older browsers, check out [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy).

Instead of `build.rolldownOptions.input`, it is recommended to set the top-level [`input`](/config/shared-options#input) option, because it will be used in dev as well. If `build.rolldownOptions.input` is set, it overrides the top-level `input` option for build only.

- **Type:** `{ entry?: string | string[] | { [entryAlias: string]: string }, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat, entryName: string) => string), cssFileName?: string }`
Build as a library. `entry` defaults to the top-level [`input`](/config/shared-options#input) option, and one of them is required since the library cannot use HTML as entry. `name` is the exposed global variable and is required when `formats` includes `'umd'` or `'iife'`. Default `formats` are `['es', 'umd']`, or `['es', 'cjs']`, if multiple entries are used.
Produce SSR-oriented build. The value can be a string to directly specify the SSR entry, or `true`, which requires specifying the SSR entry via [`input`](/config/shared-options#input) or `build.rolldownOptions.input`.