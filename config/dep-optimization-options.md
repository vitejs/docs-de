If neither of these fit your needs, you can specify custom entries using this option - the value should be a [fast-glob pattern](https://github.com/mrmlnc/fast-glob#basic-syntax) or array of patterns that are relative from Vite project root. This will overwrite default entries inference. Only `node_modules` and `build.outDir` folders will be ignored by default when `optimizeDeps.entries` is explicitly defined. If other folders need to be ignored, you can use an ignore pattern as part of the entries list, marked with an initial `!`. If you don't want to ignore `node_modules` and `build.outDir`, you can specify using literal string paths (without fast-glob patterns) instead.
If neither of these fit your needs, you can specify custom entries using this option - the value should be a [`tinyglobby` pattern](https://superchupu.dev/tinyglobby/comparison) or array of patterns that are relative from Vite project root. This will overwrite default entries inference. Only `node_modules` and `build.outDir` folders will be ignored by default when `optimizeDeps.entries` is explicitly defined. If other folders need to be ignored, you can use an ignore pattern as part of the entries list, marked with an initial `!`. `node_modules` will not be ignored for patterns that explicitly include the string `node_modules`.
## optimizeDeps.rolldownOptions <NonInheritBadge />

- **Type:** [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)`<``RolldownOptions`, `'input' | 'logLevel' | 'output'> & {
  output?: [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)`<`
    `RolldownOutputOptions`,
    `'format' | 'sourcemap' | 'dir' | 'banner'>`
`}`

<!-- TODO: add link to RolldownOptions -->
<!-- TODO: add link to RolldownOutputOptions -->

Options to pass to Rolldown during the dep scanning and optimization.

Certain options are omitted since changing them would not be compatible with Vite's dep optimization.

- `plugins` are merged with Vite's dep plugin

- **Deprecated**
This option is converted to `optimizeDeps.rolldownOptions` internally. Use `optimizeDeps.rolldownOptions` instead.
- **Type:** [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)`<`[`RolldownOptions`](https://rolldown.rs/reference/), `'input' | 'logLevel' | 'output'> & {
    [`RolldownOutputOptions`](https://rolldown.rs/reference/),
- **Type:** <code>Omit<<a href="https://rolldown.rs/reference/Interface.RolldownOptions">RolldownOptions</a>, 'input' | 'logLevel' | 'output'> & { output?: Omit<<a href="https://rolldown.rs/reference/#:~:text=Output%20Options">RolldownOutputOptions</a>, 'format' | 'sourcemap' | 'dir' | 'banner'> }</code>
- **Type:** <code>Omit<<a href="https://esbuild.github.io/api/#general-options">EsbuildBuildOptions</a>, 'bundle' | 'entryPoints' | 'external' | 'write' | 'watch' | 'outdir' | 'outfile' | 'outbase' | 'outExtension' | 'metafile'></code>