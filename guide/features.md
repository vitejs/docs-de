This option is only partially supported. Full support requires type inference by the TypeScript compiler, which is not supported. See [Oxc Transformer's documentation](https://oxc.rs/docs/guide/usage/transformer/typescript.html#decorators) for details.
`.jsx` and `.tsx` files are also supported out of the box. JSX transpilation is also handled via [Oxc Transformer](https://oxc.rs/docs/guide/usage/transformer.html).
#### Case Sensitive Matching

By default, glob pattern matching is case-sensitive. You can use the `caseSensitive` option to change this behavior:

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/module*.js', {
  caseSensitive: false,
})
```

With `caseSensitive: false`, the glob will match files regardless of case (e.g., `Module.js`, `module.js`, `MODULE.js` will all be matched by `module*.js`).

Vite supports importing pre-compiled `.wasm` files in two ways: directly as an [ES module](#esm-integration) when you only need the module's exports, or with [`?init`](#manual-initialization) when you need explicit control over instantiation.

### ESM Integration

A `.wasm` file can be imported directly. Vite reads the module's imports and exports from the binary, instantiates it, and re-exposes its exports as named ES module exports:

```js
import { add } from './add.wasm'

console.log(add(1, 2)) // 3
```

If the WebAssembly module declares imports of its own, Vite resolves them from JavaScript modules. Each import's module name is treated as an import specifier (resolved relative to the `.wasm` file) and the requested members are wired into the instance automatically.

This follows the [WebAssembly/ES Module Integration proposal](https://github.com/WebAssembly/esm-integration). Because a WebAssembly module is instantiated asynchronously, a directly imported `.wasm` file behaves as an async module and requires top-level `await` support.

### Manual Initialization

When you need control over when and how the module is instantiated, import it with `?init`. The default export will be an initialization function that returns a Promise of the [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Instance):
Due to the lack of a universal way to load a file, the internal implementation for both direct `.wasm` imports and `.wasm?init` relies on the `node:fs` module. This means that these features will only work in Node.js compatible runtimes for SSR builds.
> Features listed below are automatically applied (except for the exprimental chunk importmap feature) as part of the build process and there is no need for explicit configuration unless you want to disable them.

### Chunk Import Map Optimization

To improve the cache hit rate of chunks, Vite can create an import map for chunks. This prevents the cascading cache invalidation issue, which is a problem with ES Modules.

For example, consider the following scenario:

```
Entry --> A ---> C
```

If `C` is updated, the only chunk that inherently needs to be invalidated is `C`. However, if `A` references `C` via a normal URL in a static import (i.e. the hash of `C` is included in the URL), the content of `A` is changed, thus `A` would also need to be invalidated. The same applies to `Entry`.

By utilizing the import maps feature, this issue can be avoided. When this optimization is enabled, Vite will create an import map that maps each chunk's ID to its URL and uses the chunk ID in the import statements instead of the URL. This way, when a chunk is updated, only the updated chunk needs to be invalidated, while the chunks that reference it will not be invalidated.

Note that this optimization currently does not apply to CSS and assets. If you update an asset, the chunks that reference it will be invalidated. That said, the invalidation would not cascade and the chunk importing the invalidated chunk would not be invalidated.

To enable this feature, set [`build.chunkImportMap`](/config/build-options.md#build-chunkimportmap) to `true`.
Vite respects some of the options in `tsconfig.json` and sets the corresponding Oxc Transformer options. For each file, Vite uses the closest parent `tsconfig.json` that matches the file, or a config referenced by its [`references`](https://www.typescriptlang.org/tsconfig/#references) field that matches the file. Vite treats a config as matching the file when the file satisfies the config's [`files`](https://www.typescriptlang.org/tsconfig/#files), [`include`](https://www.typescriptlang.org/tsconfig/#include), and [`exclude`](https://www.typescriptlang.org/tsconfig/#exclude) fields.
Vite starter templates have `"skipLibCheck": true` by default to avoid typechecking dependencies, as they may choose to only support specific versions and configurations of TypeScript. You can learn more at [vuejs/vue-cli#5688](https://github.com/vuejs/vue-cli/pull/5688).
::: tip TypeScript support

Since the types of `.wasm` files are unknown, TypeScript will report errors like `Module '"*.wasm"' has no exported member 'add'`. To fix this, enable [`allowArbitraryExtensions`](https://www.typescriptlang.org/tsconfig/#allowArbitraryExtensions) in your `tsconfig.json` and create a declaration file next to your `.wasm` file. With `allowArbitraryExtensions` enabled, TypeScript will look for a declaration file named `{filename}.d.wasm.ts` when resolving a `.wasm` import. For example, for `add.wasm`, create `add.d.wasm.ts`:

```ts [add.d.wasm.ts]
export function add(a: number, b: number): number
```

:::

[`resolve.tsconfigPaths: true`](/config/shared-options.md#resolve-tsconfigpaths) can be specified to tell Vite to use the `paths` option in `tsconfig.json` to resolve imports.
The worker detection will only work if the `new URL()` constructor is used directly inside the `new Worker()` declaration. Otherwise it is handled as a [static asset URL](./assets#new-url-url-import-meta-url) instead. Additionally, all options parameters must be static values (i.e. string literals).