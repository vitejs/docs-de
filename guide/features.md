---

Importing `.css` files will inject its content to the page via a `<style>` tag with HMR support.
Default and named imports from CSS files (e.g `import style from './foo.css'`) are removed since Vite 5. Use the `?inline` query instead.
## npm Dependency Resolving and Pre-Bundling

- [TypeScript documentation](https://www.typescriptlang.org/tsconfig#useDefineForClassFields)

Other TypeScript targets will default to `false`.

#### `target`

The above import will throw an error in the browser. Vite will detect such bare module imports in all served source files and perform the following:

1. [Pre-bundle](./dep-pre-bundling) them to improve page loading speed and convert CommonJS / UMD modules to ESM. The pre-bundling step is performed with [esbuild](https://esbuild.github.io/) and makes Vite's cold start time significantly faster than any JavaScript-based bundler.

The [`esbuild.target`](/config/shared-options.html#esbuild) option can be used instead, which defaults to `esnext` for minimal transpilation. In builds, the [`build.target`](/config/build-options.html#build-target) option takes higher priority and can also be set if needed.

::: warning `useDefineForClassFields`
If `target` is not `ESNext` or `ES2022` or newer, or if there's no `tsconfig.json` file, `useDefineForClassFields` will default to `false` which can be problematic with the default `esbuild.target` value of `esnext`. It may transpile to [static initialization blocks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks#browser_compatibility) which may not be supported in your browser.

As such, it is recommended to set `target` to `ESNext` or `ES2022` or newer, or set `useDefineForClassFields` to `true` explicitly when configuring `tsconfig.json`.
:::

- [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax)
- [`jsx`](https://www.typescriptlang.org/tsconfig#jsx)
- [`jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource)
- [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators)
- [`alwaysStrict`](https://www.typescriptlang.org/tsconfig#alwaysStrict)
If a dependency doesn't work well with `"isolatedModules": true`. You can use `"skipLibCheck": true` to temporarily suppress the errors until it is fixed upstream.
Vite's default types are for its Node.js API. To shim the environment of client-side code in a Vite application, you can add `vite/client` to `compilerOptions.types` inside `tsconfig.json`:
Note that if [`compilerOptions.types`](https://www.typescriptlang.org/tsconfig#types) is specified, only these packages will be included in the global scope (instead of all visible ”@types” packages). This is recommended since TS 5.9.

::: details Using triple-slash directive

Alternatively, you can add a `d.ts` declaration file:

```typescript [vite-env.d.ts]
/// <reference types="vite/client" />
```
- If you are using `compilerOptions.types`, ensure the file is included in `tsconfig.json`:
  ```json [tsconfig.json]
  {
    "include": ["src", "./vite-env-override.d.ts"]
  }
  ```
- If you are using triple-slash directives, update the file containing the reference to `vite/client` (normally `vite-env.d.ts`):
- The glob matching is done via [`tinyglobby`](https://github.com/SuperchupuDev/tinyglobby) - check out its documentation for [supported glob patterns](https://superchupu.dev/tinyglobby/comparison).
## License

Vite can generate a file of all the dependencies' licenses used in the build with the [`build.license`](/config/build-options.md#build-license) option. It can be hosted to display and acknowledge the dependencies used by the app.

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

Vite respects some of the options in `tsconfig.json` and sets the corresponding esbuild options. For each file, Vite uses the `tsconfig.json` in the closest parent directory. If that `tsconfig.json` contains a [`references`](https://www.typescriptlang.org/tsconfig/#references) field, Vite will use the referenced config file that satisfies the [`include`](https://www.typescriptlang.org/tsconfig/#include) and [`exclude`](https://www.typescriptlang.org/tsconfig/#exclude) fields.

When the options are set in both the Vite config and the `tsconfig.json`, the value in the Vite config takes precedence.

export default defineConfig({
  build: {
    license: true,
  },
})
```

This will generate a `.vite/license.md` file with an output that may look like this:

```md
# Licenses

If a dependency doesn't work well with `"isolatedModules": true`, you can use `"skipLibCheck": true` to temporarily suppress the errors until it is fixed upstream.

## dep-1 - 1.2.3 (CC0-1.0)

CC0 1.0 Universal

...

## dep-2 - 4.5.6 (MIT)

MIT License

...
```

To serve the file at a different path, you can pass `{ fileName: 'license.md' }` for example, so that it's served at `https://example.com/license.md`. See the [`build.license`](/config/build-options.md#build-license) docs for more information.

#### `paths`

- [TypeScript documentation](https://www.typescriptlang.org/tsconfig/#paths)

`resolve.tsconfigPaths: true` can be specified to tell Vite to use the `paths` option in `tsconfig.json` to resolve imports.
This option is only partially supported. Full support requires type inference by the TypeScript compiler, which is not supported. See [Oxc Transformer's documentation](https://oxc.rs/docs/guide/usage/transformer/typescript#decorators) for details.

Vite improves `@import` resolving for Sass and Less so that Vite aliases are also respected. In addition, relative `url()` references inside imported Sass/Less files that are in different directories from the root file are also automatically rebased to ensure correctness. Rebasing `url()` references that start with a variable or a interpolation are not supported due to its API constraints.
Also note that the dynamic import must match the following rules to be bundled:

- Imports must start with `./` or `../`: ``import(`./dir/${foo}.js`)`` is valid, but ``import(`${foo}.js`)`` is not.
- Imports must end with a file extension: ``import(`./dir/${foo}.js`)`` is valid, but ``import(`./dir/${foo}`)`` is not.
- Imports to the own directory must specify a file name pattern: ``import(`./prefix-${foo}.js`)`` is valid, but ``import(`./${foo}.js`)`` is not.

These rules are enforced to prevent accidentally importing files that are not intended to be bundled. For example, without these rules, `import(foo)` would bundle everything in the file system.

<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq/~05pq?via=vite" title="Static Assets in Vite">Watch an interactive lesson on Scrimba</ScrimbaLink>

::: warning For SSR build, Node.js compatible runtimes are only supported

Due to the lack of a universal way to load a file, the internal implementation for `.wasm?init` relies on `node:fs` module. This means that this feature will only work in Node.js compatible runtimes for SSR builds.

:::
