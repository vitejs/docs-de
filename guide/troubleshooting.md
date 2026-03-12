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
When importing an ESM only package by `require`, the following error happens.

If you'd like to temporarily ignore the warning, you can run your script with the `VITE_CJS_IGNORE_WARNING=true` flag:

```bash
VITE_CJS_IGNORE_WARNING=true vite dev
```

Note that postcss config files does not support ESM + TypeScript (`.mts` or `.ts` in `"type": "module"`) yet. If you have postcss configs with `.ts` and added `"type": "module"` to package.json, you'll also need to rename the postcss config to use `.cts`.

It might be possible to work around by selecting a different chunk name by [`build.rolldownOptions.output.chunkFileNames`](../config/build-options.md#build-rolldownoptions), as these extensions often block requests based on file names (e.g. names containing `ad`, `track`).
### Vite crashes with ENOSPC error

If you see an error like this on Linux:

> Error: ENOSPC: System limit for number of file watchers reached

This happens when you have too many files in your project directory (e.g., many images or assets) and exceed the system's file watcher limit. Linux has a default limit of around 8,192-10,000 file watchers.

To solve this, you can:

- Increase the system file watcher limit:

  ```shell
  # Check current limit
  $ cat /proc/sys/fs/inotify/max_user_watches
  # Increase limit (temporary)
  $ sudo sysctl fs.inotify.max_user_watches=524288
  # Make it permanent - add to /etc/sysctl.conf (or edit if it already exists)
  $ echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
  $ sudo sysctl -p
  ```

- Exclude directories with many files from file watching using [`server.watch.ignored`](/config/server-options#server-watch)
- Use polling instead of file system events with [`server.watch.usePolling`](/config/server-options#server-watch). Note that polling uses more CPU resources
