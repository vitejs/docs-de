Note that by default, Vite only handles syntax transforms and **does not cover polyfills**. You can check out [Polyfill.io](https://polyfill.io/) which is a service that automatically generates polyfill bundles based on the user's browser UserAgent string.
### Relative base

If you don't know the base path in advance, you may set a relative base path with `"base": "./"` or `"base": ""`. This will make all generated URLs to be relative to each file.
<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq/~037q?via=vite" title="Building for Production">Watch an interactive lesson on Scrimba</ScrimbaLink>


:::warning Support for older browsers when using relative bases

`import.meta` support is required for relative bases. If you need to support [browsers that do not support `import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta), you can use [the `legacy` plugin](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy).

:::
- Chrome >=111
- Edge >=111
- Firefox >=114
- Safari >=16.4

<!-- TODO: update the link above and below to Rolldown's documentation -->
    rolldownOptions: {
For example, you can specify multiple Rolldown outputs with plugins that are only applied during build.
You can configure how chunks are split using `build.rolldownOptions.output.advancedChunks` (see [Rolldown docs](https://rolldown.rs/in-depth/advanced-chunks)). If you use a framework, refer to their documentation for configuring how chunks are split.
<!-- TODO: update the link above to Rolldown's documentation -->

    rolldownOptions: {
Note that for HTML files, Vite ignores the name given to the entry in the `rolldownOptions.input` object and instead respects the resolved id of the file when generating the HTML asset in the dist folder. This ensures a consistent structure with the way the dev server works.
    rolldownOptions: {
Library mode includes a simple and opinionated configuration for browser-oriented and JS framework libraries. If you are building non-browser libraries, or require advanced build flows, you can use [tsdown](https://tsdown.dev/) or [Rolldown](https://rolldown.rs/) directly.
The build can be customized via various [build config options](/config/build-options.md). Specifically, you can directly adjust the underlying [Rolldown options](https://rolldown.rs/reference/) via `build.rolldownOptions`:
      // https://rolldown.rs/reference/
You can enable rollup watcher with `vite build --watch`. Or, you can directly adjust the underlying [`WatcherOptions`](https://rolldown.rs/reference/InputOptions.watch) via `build.watch`:
      // https://rolldown.rs/reference/InputOptions.watch
You can configure how chunks are split using [`build.rolldownOptions.output.codeSplitting`](https://rolldown.rs/reference/OutputOptions.codeSplitting) (see [Rolldown docs](https://rolldown.rs/in-depth/manual-code-splitting)). If you use a framework, refer to their documentation for configuring how chunks are split.
If you specify a different root, remember that `__dirname` will still be the folder of your `vite.config.js` file when resolving the input paths. Therefore, you will need to add your `root` entry to the arguments for `resolve`.
        main: resolve(import.meta.dirname, 'index.html'),
        nested: resolve(import.meta.dirname, 'nested/index.html'),
If you specify a different root, remember that `import.meta.dirname` will still be the folder of your `vite.config.js` file when resolving the input paths. Therefore, you will need to add your `root` entry to the arguments for `resolve`.
      entry: resolve(import.meta.dirname, 'lib/main.js'),
        'my-lib': resolve(import.meta.dirname, 'lib/main.js'),
        secondary: resolve(import.meta.dirname, 'lib/secondary.js'),
With the `--watch` flag enabled, changes to files to be bundled will trigger a rebuild. Note that changes to the config and its dependencies require restarting the build command.