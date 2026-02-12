- **Default:** `['browser', 'module', 'jsnext:main', 'jsnext']`
Vite uses [esbuild defines](https://esbuild.github.io/api/#define) to perform replacements, so value expressions must be a string that contains a JSON-serializable value (null, boolean, number, string, array, or object) or a single identifier. For non-string values, Vite will automatically convert it to a string with `JSON.stringify`.
**Example:**
```js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('v1.0.0'),
    __API_URL__: 'window.__backend_api_url',
  },
})
```

## future

- **Type:** `Record<string, 'warn' | undefined>`
- **Related:** [Breaking Changes](/changes/)

Enable future breaking changes to prepare for a smooth migration to the next major version of Vite. The list may be updated, added, or removed at any time as new features are developed.

See the [Breaking Changes](/changes/) page for details of the possible options.