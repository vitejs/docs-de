`RunnableDevEnvironment` is an environment that can communicate arbitrary JavaScript values with your application code. Importing a module returns its real, live exports (functions, class instances, and any other values), so frameworks can run their server entries directly. The implicit `ssr` environment and other non-client environments use a `RunnableDevEnvironment` by default during dev. You can guard access to the runner with the `isRunnableDevEnvironment` function.

Its `runner` is a `ModuleRunner`. You import modules through it with `runner.import(url)`, which fetches, transforms, and evaluates a module from the Vite module graph (the `url` accepts a file path, server path, or id relative to the root) and returns the instantiated module with full HMR support. It is the modern replacement for `server.ssrLoadModule`, so frameworks can migrate to it to enable HMR for their SSR dev story.

:::info Why it can communicate arbitrary values
A `RunnableDevEnvironment` evaluates modules in the same runtime as the Vite server, so values cross the boundary in-process instead of being serialized. This is what distinguishes it from [`FetchableDevEnvironment`](#fetchabledevenvironment), which can only communicate through serialized `Request`/`Response` objects over the Fetch API. As a result, using a `RunnableDevEnvironment` requires the runner's runtime to be the same as the one the Vite server is running in.
:::
A common reason to reach for it is a framework that wants to support a runtime that can't run Vite directly (e.g. Cloudflare Workers). A `RunnableDevEnvironment` can't be used there, since it requires the runner to share the Vite server's runtime so values can cross the boundary in-process. Standardizing on the Fetch API lets the framework keep a single request-handling path across all of its target runtimes: its dev middleware forwards each incoming browser request as a `Request` and sends the returned `Response` back to the browser, mirroring how the app handles requests in production.

When the `builder` option is set (even to an empty object `{}`, which is what `vite build --app` does), `vite build` opts in to building the entire app instead. This will become the default in a future major. In this mode, Vite creates a `ViteBuilder` instance (the build-time equivalent of a `ViteDevServer`) and uses it to build all configured environments for production. By default, environments are built in series, following the order of the `environments` record.

### Configuring the app build with `builder.buildApp`

A framework or user can control how the environments are built through the `builder.buildApp` option. It receives the `ViteBuilder` instance (named `builder` in the example below) and is responsible for building each environment; for instance, to build some of them in parallel:
### The `buildApp` plugin hook

Besides the `builder.buildApp` config option, plugins can define a `buildApp` hook to participate in the app build. The config option and the plugin hooks run in a defined order: hooks with order `'pre'` or `null` run first, then the configured `builder.buildApp`, then hooks with order `'post'`. Within a hook, `environment.isBuilt` tells you whether an environment has already been built, which lets a plugin avoid building it twice.

### Building programmatically with `createBuilder`

To trigger an app build from your own code, use `createBuilder` instead of the standalone `build` function. `createBuilder` is the build-time equivalent of `createServer`: it resolves the config and returns a `ViteBuilder`, whose `buildApp` method builds every configured environment. You can also build a single environment with `builder.build(environment)`.

```js [build.js]
import { createBuilder } from 'vite'

const builder = await createBuilder()
await builder.buildApp()
```

`createBuilder` supersedes the standalone `build` function for environment-aware builds. `build` still works as the simple entry point for the legacy client-only and ssr-only builds described above, but it cannot build arbitrary environments. Running `builder.buildApp()` is the programmatic equivalent of `vite build --app`.