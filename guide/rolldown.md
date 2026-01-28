If you are starting a new project, you can use `create-vite` as normal for rolldown-vite, too. The latest version will ask you whether to use `rolldown-vite` or not.

::: tip Please pin the version!

While these examples use `@latest`, we recommend using a specific version number to avoid unexpected breaking changes as [`rolldown-vite` is considered experimental](#versioning-policy).

:::

Rolldown introduced a [hook filter feature](https://rolldown.rs/plugins/hook-filters) to reduce the communication overhead between the Rust and JavaScript runtimes. This feature allows plugins to specify patterns that determine when hooks should be called, improving performance by avoiding unnecessary hook invocations.
See the [Hook Filters guide](/guide/api-plugin#hook-filters) for more information.
For additional insights on the motivations behind Rolldown, see the [reasons why Rolldown is being built](https://rolldown.rs/guide/introduction#why-rolldown).
Rolldown introduced a [hook filter feature](https://rolldown.rs/apis/plugin-hook-filters) to reduce the communication overhead between the Rust and JavaScript runtimes. This feature allows plugins to specify patterns that determine when hooks should be called, improving performance by avoiding unnecessary hook invocations.
This is because [Rolldown supports non-JavaScript modules](https://rolldown.rs/in-depth/module-types) and infers the module type from extensions unless specified.
While Rolldown has support for the `manualChunks` option that is also exposed by Rollup, it is marked deprecated. Instead of it, Rolldown offers a more fine-grained setting via the [`advancedChunks` option](https://rolldown.rs/in-depth/advanced-chunks), which is more similar to webpack's `splitChunk`:
  "devDependencies": {