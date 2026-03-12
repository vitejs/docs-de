Uses [Oxc Transformer](https://oxc.rs/docs/guide/usage/transformer) and [Babel](https://babeljs.io/), achieving fast HMR with a small package footprint and the flexibility of being able to use the Babel transform pipeline. Without additional Babel plugins, only Oxc Transformer is used.
Replaces Babel with [SWC](https://swc.rs/) during development. During production builds, SWC+Oxc Transformer are used when using plugins, and Oxc Transformer only otherwise. For big projects that requires custom plugins, cold start and Hot Module Replacement (HMR) can be significantly faster, if the plugin is also available for SWC.
## Rolldown Builtin Plugins

Vite uses [Rolldown](https://rolldown.rs/) under the hood and it provides a few builtin plugins for common use cases.

Read the [Rolldown Builtin Plugins section](https://rolldown.rs/builtin-plugins/) for more information.

Replaces Babel with [SWC](https://swc.rs/) during development. During production builds, SWC+Oxc Transformer are used when using plugins, and Oxc Transformer only otherwise. For big projects that require custom plugins, cold start and Hot Module Replacement (HMR) can be significantly faster, if the plugin is also available for SWC.
Check out [Vite Plugin Registry](https://registry.vite.dev/plugins) for the list of plugins published to npm.
## Rolldown / Rollup Plugins
[Vite plugins](../guide/api-plugin) are an extension of Rollup's plugin interface. Check out the [Rollup Plugin Compatibility section](../guide/api-plugin#rolldown-plugin-compatibility) for more information.
Provides React Fast Refresh support via [Oxc Transformer](https://oxc.rs/docs/guide/usage/transformer).
Replaces Oxc with [SWC](https://swc.rs/) during development for SWC plugin usage. During production builds, SWC+Oxc Transformer are used when using plugins. For big projects that require custom plugins, cold start and Hot Module Replacement (HMR) can be significantly faster, if the plugin is also available for SWC.