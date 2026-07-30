- [Oxc Minifier assumptions](https://github.com/oxc-project/oxc/blob/main/crates/oxc_minifier/docs/ASSUMPTIONS.md)
- Passing a URL to `import.meta.hot.accept` is no longer supported. Please pass an id instead. ([#21382](https://github.com/vitejs/vite/pull/21382))
- All parallel hooks in Rollup work as sequential hooks. See [Rolldown's documentation](https://rolldown.rs/apis/plugin-api#sequential-hook-execution) for more details.
- Missing support by Rolldown: The following features are not supported by Rolldown and are no longer supported by Vite.
The default browser values of `build.target` and `'baseline-widely-available'` are updated to newer browser versions:
- The `module.exports.__esModule` value of the importee CJS module is not set to `true`.
- The `module.exports.__esModule` value of the importee CJS module is not set to `true`.
- The `module.exports.__esModule` value of the importee CJS module is not set to `true`.
  - `build.rollupOptions.output.format: 'amd'` ([rolldown#2528](https://github.com/rolldown/rolldown/issues/2528))