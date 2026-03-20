---

Vite plugins extends Rolldown's plugin interface with a few extra Vite-specific options. As a result, you can write a Vite plugin once and have it work for both dev and build.

**It is recommended to go through [Rolldown's plugin documentation](https://rolldown.rs/apis/plugin-api) first before reading the sections below.**

:::
import 'vite/types/customEvent.d.ts'
Vite strives to offer established patterns out of the box, so before creating a new plugin make sure that you check the [Features guide](/guide/features) to see if your need is covered. Also review available community plugins, both in the form of a [compatible Rollup plugin](https://github.com/rollup/awesome) and [Vite Specific plugins](https://github.com/vitejs/awesome-vite#plugins).

This interface extension is utilized by `InferCustomEventPayload<T>` to infer the payload type for event `T`. For more information on how this interface is utilized, refer to the [HMR API Documentation](./api-hmr#hmr-api).

```ts twoslash
import 'vite/client'
import type { InferCustomEventPayload } from 'vite/types/customEvent.d.ts'
declare module 'vite/types/customEvent.d.ts' {
  interface CustomEventMap {
    'custom:foo': { msg: string }
  }
If the plugin doesn't use Vite specific hooks and can be implemented as a [Compatible Rolldown Plugin](#rolldown-plugin-compatibility), then it is recommended to use the [Rolldown Plugin naming conventions](https://rolldown.rs/apis/plugin-api#conventions).
// ---cut---
- Rolldown Plugins should have a clear name with `rolldown-plugin-` prefix.
- Include `rolldown-plugin` and `vite-plugin` keywords in package.json `keywords` field.
  // The type of payload will be { msg: string }
This exposes the plugin to be also used in pure Rolldown or Rollup based projects.
import.meta.hot?.on('unknown:event', (payload) => {
  // The type of payload will be any
})
```
- Include `vite-plugin` keyword in package.json `keywords` field.

Rolldown introduced a [hook filter feature](https://rolldown.rs/plugins/hook-filters) to reduce the communication overhead between the Rust and JavaScript runtimes. This feature allows plugins to specify patterns that determine when hooks should be called, improving performance by avoiding unnecessary hook invocations.
If your plugin is only going to work for a particular framework, its name should be included as part of the prefix.
This is also supported by Rollup 4.38.0+ and Vite 6.3.0+. To make your plugin backward compatible with older versions, make sure to also run the filter inside the hook handlers.

```js
export default function myPlugin() {
  const jsFileRegex = /\.js$/

  return {
    name: 'my-plugin',
    // Example: only call transform for .js files
    transform: {
      filter: {
        id: jsFileRegex,
      },
      handler(code, id) {
        // Additional check for backward compatibility
        if (!jsFileRegex.test(id)) return null

        return {
          code: transformCode(code),
          map: null,
        }
      },
    },
  }
}
```

::: tip
[`@rolldown/pluginutils`](https://www.npmjs.com/package/@rolldown/pluginutils) exports some utilities for hook filters like `exactRegex` and `prefixRegex`.
:::

  In some cases, other plugin hooks may need access to the dev server instance (e.g. accessing the WebSocket server, the file system watcher, or the module graph). This hook can also be used to store the server instance for access in other hooks:
    /**
     * attribute values will be escaped automatically if needed
     */
Internally, vite infers the type of a payload from the `CustomEventMap` interface, it is possible to type custom events by extending the interface:

:::tip Note
Make sure to include the `.d.ts` extension when specifying TypeScript declaration files. Otherwise, Typescript may not know which file the module is trying to extend.
:::
import 'vite/types/customEvent.d.ts'
declare module 'vite/types/customEvent.d.ts' {

This interface extension is utilized by `InferCustomEventPayload<T>` to infer the payload type for event `T`. For more information on how this interface is utilized, refer to the [HMR API Documentation](./api-hmr#hmr-api).

```ts twoslash
It is common convention to author a Vite/Rolldown/Rollup plugin as a factory function that returns the actual plugin object. The function can accept options which allows users to customize the behavior of the plugin.
import type { InferCustomEventPayload } from 'vite/types/customEvent.d.ts'
declare module 'vite/types/customEvent.d.ts' {
  interface CustomEventMap {
    'custom:foo': { msg: string }
  }
}
// ---cut---
type CustomFooPayload = InferCustomEventPayload<'custom:foo'>
import.meta.hot?.on('custom:foo', (payload) => {
  // The type of payload will be { msg: string }
})
    transform: {
      filter: {
        id: fileRegex,
      },
      handler(src, id) {
})
```
Virtual modules in Vite (and Rolldown / Rollup) are prefixed with `virtual:` for the user-facing path by convention. If possible the plugin name should be used as a namespace to avoid collisions with other plugins in the ecosystem. For example, a `vite-plugin-posts` could ask users to import a `virtual:posts` or `virtual:posts/helpers` virtual modules to get build time information. Internally, plugins that use virtual modules should prefix the module ID with `\0` while resolving the id, a convention from the rollup ecosystem. This prevents other plugins from trying to process the id (like node resolution), and core features like sourcemaps can use this info to differentiate between virtual modules and regular files. `\0` is not a permitted char in import URLs so we have to replace them during import analysis. A `\0{id}` virtual id ends up encoded as `/@id/__x00__{id}` during dev in the browser. The id will be decoded back before entering the plugins pipeline, so this is not seen by plugins hooks code.
During dev, the Vite dev server creates a plugin container that invokes [Rolldown Build Hooks](https://rolldown.rs/apis/plugin-api#build-hooks) the same way Rolldown does it.
      },
- [`buildStart`](https://rolldown.rs/reference/Interface.Plugin#buildstart)
- [`resolveId`](https://rolldown.rs/reference/Interface.Plugin#resolveid)
- [`load`](https://rolldown.rs/reference/Interface.Plugin#load)
- [`transform`](https://rolldown.rs/reference/Interface.Plugin#transform)
- [`buildEnd`](https://rolldown.rs/reference/Interface.Plugin#buildend)
- [`closeBundle`](https://rolldown.rs/reference/Interface.Plugin#closebundle)
Note that the [`moduleParsed`](https://rolldown.rs/reference/Interface.Plugin#moduleparsed) hook is **not** called during dev, because Vite avoids full AST parses for better performance.
[Output Generation Hooks](https://rolldown.rs/apis/plugin-api#output-generation-hooks) (except `closeBundle`) are **not** called during dev.
Note that this is separate from hooks ordering, those are still separately subject to their [`order` attribute](https://rolldown.rs/reference/TypeAlias.ObjectHook#order) as usual for Rolldown hooks.
## Rolldown Plugin Compatibility
A fair number of Rolldown / Rollup plugins will work directly as a Vite plugin (e.g. `@rollup/plugin-alias` or `@rollup/plugin-json`), but not all of them, since some plugin hooks do not make sense in an unbundled dev server context.
In general, as long as a Rolldown / Rollup plugin fits the following criteria then it should just work as a Vite plugin:
- It doesn't use the [`moduleParsed`](https://rolldown.rs/reference/Interface.Plugin#moduleparsed) hook.
- It doesn't rely on the Rolldown specific options like [`transform.inject`](https://rolldown.rs/reference/InputOptions.transform#inject)
import { exactRegex } from '@rolldown/pluginutils'

If a Rolldown / Rollup plugin only makes sense for the build phase, then it can be specified under `build.rolldownOptions.plugins` instead. It will work the same as a Vite plugin with `enforce: 'post'` and `apply: 'build'`.
You can also augment an existing Rolldown / Rollup plugin with Vite-only properties:
import example from 'rolldown-plugin-example'
Rolldown introduced a [hook filter feature](https://rolldown.rs/apis/plugin-api/hook-filters) to reduce the communication overhead between the Rust and JavaScript runtimes. This feature allows plugins to specify patterns that determine when hooks should be called, improving performance by avoiding unnecessary hook invocations.
[`@rolldown/pluginutils`](https://www.npmjs.com/package/@rolldown/pluginutils) exports some utilities for hook filters like `exactRegex` and `prefixRegex`. These are also re-exported from `rolldown/filter` for convenience.
## Output Bundle Metadata
    resolveId: {
      filter: { id: exactRegex(virtualModuleId) },
      handler() {

      },

    load: {
      filter: { id: exactRegex(resolvedVirtualModuleId) },
      handler() {

      },

- `viteMetadata.importedCss: Set<string>`
- `viteMetadata.importedAssets: Set<string>`

This is useful when writing plugins that need to inspect emitted CSS and static assets without relying on [`build.manifest`](/config/build-options#build-manifest).

Example:

```ts [vite.config.ts]
function outputMetadataPlugin(): Plugin {
  return {
    name: 'output-metadata-plugin',
    generateBundle(_, bundle) {
      for (const output of Object.values(bundle)) {
        const css = output.viteMetadata?.importedCss
        const assets = output.viteMetadata?.importedAssets
        if (!css?.size && !assets?.size) continue

        console.log(output.fileName, {
          css: css ? [...css] : [],
          assets: assets ? [...assets] : [],
        })
      }
    },
  }
}
```

## Plugin Context Meta

For plugin hooks that has access to the plugin context, Vite exposes additional properties on `this.meta`:

- `this.meta.viteVersion`: The current Vite version string (e.g. `"8.0.0"`).

::: tip Detecting Rolldown powered Vite

[`this.meta.rolldownVersion`](https://rolldown.rs/reference/Interface.PluginContextMeta#rolldownversion) is only available for Rolldown powered Vite (i.e. Vite 8+). You can use it to detect whether the current Vite instance is powered by Rolldown:

```ts
function versionCheckPlugin(): Plugin {
  return {
    name: 'version-check',
    buildStart() {
      if (this.meta.rolldownVersion) {
        // only do something if running on a Rolldown powered Vite
      } else {
        // do something else if running on a Rollup powered Vite
      }
    },
  }
}
```

:::
