- **Type:** [`() => (Plugin | Plugin[])[]`](./shared-options#plugins)
Vite plugins that apply to the worker bundles. Note that [config.plugins](./shared-options#plugins) only applies to workers in dev, it should be configured here instead for build.
The function should return new plugin instances as they are used in parallel rollup worker builds. As such, modifying `config.worker` options in the `config` hook will be ignored.
<!-- TODO: update the link below to Rolldown's documentation -->

- **Type:** [`RolldownOptions`](https://rollupjs.org/configuration-options/)

## worker.rollupOptions

- **Type:** `RolldownOptions`
- **Deprecated**

This option is an alias of `worker.rolldownOptions` option. Use `build.rolldownOptions` option instead.
## worker.rolldownOptions
This option is an alias of `worker.rolldownOptions` option. Use `worker.rolldownOptions` option instead.
- **Type:** [`RolldownOptions`](https://rolldown.rs/reference/)