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

<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq/~05an?via=vite" title="Env Variables in Vite">Watch an interactive lesson on Scrimba</ScrimbaLink>

:::

This does not work in shell scripts and other tools like `docker compose`.
That said, Vite supports this behavior as this has been supported by `dotenv-expand` for a long time and other tools in JavaScript ecosystem use older versions that support this behavior.
Vite exposes env variables under the `import.meta.env` object as strings automatically.
Variables prefixed with `VITE_` will be exposed in client-side source code after Vite bundling. To prevent accidentally leaking env variables to the client, avoid using this prefix. As an example, consider the following:
The parsed value of `VITE_SOME_KEY` – `"123"` – will be exposed on the client, but the value of `DB_PASSWORD` will not. You can test this by adding the following to your code:
:::warning Protecting secrets

`VITE_*` variables should _not_ contain sensitive information such as API keys. The values of these variables are bundled into your source code at build time. For production deployments, consider a backend server or serverless/edge functions to properly secure secrets.

:::

:::warning Ignoring local `.env` files

`.env.*.local` files are local-only and can contain sensitive variables. You should add `*.local` to your `.gitignore` to avoid them being checked into git.

:::
