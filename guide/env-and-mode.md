:::details Example

```js
if (import.meta.env.DEV) {
  // code inside here will be tree-shaken in production builds
  console.log('Dev mode')
}
```

:::

:::warning Bun users

When using [Bun](https://bun.sh), be aware that Bun automatically loads `.env` files before your script runs. This built-in behavior loads environment variables directly into `process.env` and can interfere with Vite's feature, as it respects existing `process.env` values. See [oven-sh/bun#5515](https://github.com/oven-sh/bun/issues/5515) for workarounds.

:::

This does not work in shell scripts and other tools like `docker compose`.