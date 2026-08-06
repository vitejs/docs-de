## Per-environment Hooks and Global Hooks

Plugins run on a shared pipeline, but their hooks fall into two categories depending on whether they run once for the whole server or once for each environment.

Global hooks are called a single time, independent of the configured environments. They handle app-wide concerns such as resolving the config or setting up the dev and preview servers, so `this.environment` is not relevant to them. Config resolution related hooks and server related hooks are global hooks.

Per-environment hooks are called once for each environment, and expose the current environment through `this.environment` in their context. All [universal hooks](/guide/api-plugin#universal-hooks) are per-environment, as are other Vite-specific hooks that handle modules. However, note that `buildStart` and `buildEnd` are only called for the client environment without [the `perEnvironmentStartEndDuringDev: true` flag](##per-environment-state-in-plugins).

## Configuring Environment Using the `configEnvironment` Hook

- **Type:** `(name: string, config: EnvironmentOptions, env: { mode: string, command: 'build' | 'serve', isSsrBuild?: boolean, isPreview?: boolean, isSsrTargetWebworker?: boolean }) => EnvironmentOptions | null | void`
- **Kind:** `async`, `sequential`
- **Scope:** [Per-environment](#per-environment-hooks-and-global-hooks)
- **Scope:** [Per-environment](#per-environment-hooks-and-global-hooks)
## Per-environment Plugins Using the `applyToEnvironment` Hook

- **Type:** `(environment: PartialEnvironment) => boolean | PluginOption | Promise<boolean>`
- **Kind:** `async`, `sequential`
- **Scope:** [Per-environment](#per-environment-hooks-and-global-hooks)
- **During both dev and build:** plugins are shared, with [per-environment filtering](#per-environment-plugins-using-the-applytoenvironment-hook)
Per-environment hooks are called once for each environment, and expose the current environment through `this.environment` in their context. All [Rolldown hooks](/guide/api-plugin#rolldown-hooks) are per-environment, as are other Vite-specific hooks that handle modules. However, note that `buildStart` and `buildEnd` are only called for the client environment without [the `perEnvironmentStartEndDuringDev: true` flag](#per-environment-state-in-plugins).