## CJS

### Vite CJS Node API deprecated

The CJS build of Vite's Node API is deprecated and will be removed in Vite 6. See the [GitHub discussion](https://github.com/vitejs/vite/discussions/13928) for more context. You should update your files or frameworks to import the ESM build of Vite instead.

In a basic Vite project, make sure:

1. The `vite.config.js` file content is using the ESM syntax.
2. The closest `package.json` file has `"type": "module"`, or use the `.mjs` extension, e.g. `vite.config.mjs`.

For other projects, there are a few general approaches:

- **Configure ESM as default, opt-in to CJS if needed:** Add `"type": "module"` in the project `package.json`. All `*.js` files are now interpreted as ESM and needs to use the ESM syntax. You can rename a file with the `.cjs` extension to keep using CJS instead.
- **Keep CJS as default, opt-in to ESM if needed:** If the project `package.json` does not have `"type": "module"`, all `*.js` files are interpreted as CJS. You can rename a file with the `.mjs` extension to use ESM instead.
- **Dynamically import Vite:** If you need to keep using CJS, you can dynamically import Vite using `import('vite')` instead. This requires your code to be written in an `async` context, but should still be manageable as Vite's API is mostly asynchronous.

If you're unsure where the warning is coming from, you can run your script with the `VITE_CJS_TRACE=true` flag to log the stack trace:

```bash
VITE_CJS_TRACE=true vite dev
```

If you'd like to temporarily ignore the warning, you can run your script with the `VITE_CJS_IGNORE_WARNING=true` flag:

```bash
VITE_CJS_IGNORE_WARNING=true vite dev
```

Note that postcss config files does not support ESM + TypeScript (`.mts` or `.ts` in `"type": "module"`) yet. If you have postcss configs with `.ts` and added `"type": "module"` to package.json, you'll also need to rename the postcss config to use `.cts`.
