Note that by default, Vite only handles syntax transforms and **does not cover polyfills**. You can check out [Polyfill.io](https://polyfill.io/) which is a service that automatically generates polyfill bundles based on the user's browser UserAgent string.
### Relative base

If you don't know the base path in advance, you may set a relative base path with `"base": "./"` or `"base": ""`. This will make all generated URLs to be relative to each file.

:::warning Support for older browsers when using relative bases

`import.meta` support is required for relative bases. If you need to support [browsers that do not support `import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta), you can use [the `legacy` plugin](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy).

:::
