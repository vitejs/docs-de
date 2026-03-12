# SSR using `ModuleRunner` API

::: tip Feedback
Give us feedback at [Environment API feedback discussion](https://github.com/vitejs/vite/discussions/16358)
:::

`server.ssrLoadModule` has been replaced by [Module Runner](/guide/api-environment#modulerunner).

Affect scope: `Vite Plugin Authors`

::: warning Future Deprecation
`ModuleRunner` was first introduce in `v6.0`. The deprecation of `server.ssrLoadModule` is planned for a future major. To identify your usage, set `future.removeSrLoadModule` to `"warn"` in your vite config.
:::

## Motivation

// TODO:

## Migration Guide

// TODO:
`server.ssrFixStacktrace` and `server.ssrRewriteStacktrace` do not have to be called when using the Module Runner APIs. The stack traces will be updated unless `sourcemapInterceptor` is set to `false`.