`vite build` supports the `--ssrManifest` flag which will generate `.vite/ssr-manifest.json` in build output directory:
The above script will now generate `dist/client/.vite/ssr-manifest.json` for the client build (Yes, the SSR manifest is generated from the client build because we want to map module IDs to client files). The manifest contains mappings of module IDs to their associated chunks and asset files.
## SSR Resolve Conditions

By default package entry resolution will use the conditions set in [`resolve.conditions`](../config/shared-options.md#resolve-conditions) for the SSR build. You can use [`ssr.resolve.conditions`](../config/ssr-options.md#ssr-resolve-conditions) and [`ssr.resolve.externalConditions`](../config/ssr-options.md#ssr-resolve-externalconditions) to customize this behavior.

Vite provides built-in support for server-side rendering (SSR). [`create-vite-extra`](https://github.com/bluwy/create-vite-extra) contains example SSR setups you can use as references for this guide:
- [Vanilla](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vanilla)
- [Vue](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vue)
- [React](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-react)
- [Preact](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-preact)
- [Svelte](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-svelte)
- [Solid](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-solid)

You can also scaffold these projects locally by [running `create-vite`](./index.md#scaffolding-your-first-vite-project) and choose `Others > create-vite-extra` under the framework option.
Refer to the [example projects](#example-projects) for a working setup.