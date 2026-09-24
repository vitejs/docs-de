For SSR builds, deduplication does not work for ESM build outputs configured from `build.rolldownOptions.output`. A workaround is to use CJS build outputs until ESM has better plugin support for module loading.
## html.additionalAssetSources

- **Type:** `Record<string, HtmlAssetSource>`

```ts
interface HtmlAssetSource {
  srcAttributes?: string[]
  srcsetAttributes?: string[]
  filter?: (data: {
    key: string
    value: string
    attributes: Record<string, string>
  }) => boolean
}
```

Define additional HTML elements and attributes to be treated as asset sources. This extends the built-in list that includes standard elements like `<img src>`, `<video src>`, `<link href>`, etc.

This is useful when using custom web components or non-standard attributes (like `data-*`) that reference assets.

**Example:**

```js
export default defineConfig({
  html: {
    additionalAssetSources: {
      // Custom web component
      'html-import': { srcAttributes: ['src'] },
      // Add data-* attributes to existing element
      img: { srcAttributes: ['data-src-dark', 'data-src-light'] },
      // With srcset format
      'my-picture': { srcsetAttributes: ['data-srcset'] },
      // With filter function
      'my-component': {
        srcAttributes: ['asset'],
## input <NonInheritBadge />

- **Type:** `string | string[] | { [entryAlias: string]: string }`

Entry points of your application, resolved relative to the project root. This works as the default value for [`build.rolldownOptions.input`](/config/build-options#build-rolldownoptions), [`build.lib.entry`](/config/build-options#build-lib), [`build.ssr`](/config/build-options#build-ssr) (if `true`), and [`optimizeDeps.entries`](/config/dep-optimization-options#optimizedeps-entries) when those are not set explicitly.

This is useful when your application does not use an `index.html` entry, so you only need to declare the entry once instead of repeating it across the options above.

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  input: 'src/main.ts',
})
```

        filter: ({ attributes }) => attributes.type === 'image',
      },
    },
  },
})
```

`paths` only applies to a file matched by a `tsconfig.json` through its `files` or `include`. Non-JS extension files should be explicitly listed in them, since a bare `"src"` or `"**/*"` `include` only matches TS/JS extensions, aligning with TypeScript's behavior. For example, to use a `paths` alias inside a CSS file (such as `@import '@/foo.css'`), list those files in `files`, or add an explicit extension to `include`:

```json [tsconfig.json]
{
  "include": ["src", "src/**/*.css", "src/**/*.scss"]
}
```

::: warning Less is not supported
`resolve.tsconfigPaths` does not apply inside `.less` files. Less only gives Vite the importing file's directory, not the file itself, so Vite cannot find the `tsconfig.json` that matches it. Use a relative path or [`resolve.alias`](#resolve-alias) for `@import` in Less.
:::

      string | ((name: string, filename: string, css: string) => string)
## tsconfig

- **Type:** `string`

Path to the TypeScript configuration file used by Vite. Relative paths are resolved from the project [`root`](#root).

When this option is not set, Vite discovers the closest matching `tsconfig.json` for each file. See [TypeScript Compiler Options](/guide/features#typescript-compiler-options) for more details.

::: warning Prefer automatic discovery
Setting this option is discouraged because it overrides Vite's per-file tsconfig discovery which is aligned with TypeScript language server. Prefer placing a `tsconfig.json` near the files it configures and using TypeScript [`references`](https://www.typescriptlang.org/tsconfig/#references) for multi-project setups.

If the goal is to remap imports, prefer [`resolve.alias`](#resolve-alias) or the `imports` and `exports` fields in `package.json` instead of selecting a tsconfig solely for [`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig/#paths). Use this option only when automatic discovery cannot identify the intended configuration.
:::

Enable devtools integration for inspecting the dev server and analyzing builds.
Ensure that `@vitejs/devtools` is installed as a dependency. Install `@vitejs/devtools-vite` to inspect the Vite dev server and `@vitejs/devtools-rolldown` to enable build analysis. DevTools runs for both `serve` and `build` by default; use `apply` to limit it to either command.

Plugin `config` hooks cannot change the `devtools` option. Set it in the user config instead.

When installed, `@vitejs/devtools` provides the type definitions for this option:

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  devtools: {
    apply: 'serve',
  },
})
```