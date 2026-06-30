Note that `null` and `undefined` values in `overrides` are skipped and not merged. If you need to explicitly clear a value from `defaults`, modify the result of `mergeConfig` directly.

    rolldownOptions: {
Load `.env` files within the `envDir` and merge them with the matching variables already present in `process.env`. By default, only env variables prefixed with `VITE_` are loaded, unless `prefixes` is changed.
): Promise<RolldownOutput | RolldownOutput[] | RolldownWatcher>
Load a Vite config file manually with Rolldown.