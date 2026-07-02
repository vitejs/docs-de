For SSR builds, deduplication does not work for ESM build outputs configured from `build.rolldownOptions.output`. A workaround is to use CJS build outputs until ESM has better plugin support for module loading.
## html.additionalAssetSources

- **Type:** `Record<string, HtmlAssetSource>`

```ts
interface HtmlAssetSource {
  srcAttributes?: string[]
  srcsetAttributes?: string[]
  filter?: (data: {
    key: string
    value: string
    attributes: Record<string, string>
  }) => boolean
}
```

Define additional HTML elements and attributes to be treated as asset sources. This extends the built-in list that includes standard elements like `<img src>`, `<video src>`, `<link href>`, etc.

This is useful when using custom web components or non-standard attributes (like `data-*`) that reference assets.

**Example:**

```js
export default defineConfig({
  html: {
    additionalAssetSources: {
      // Custom web component
      'html-import': { srcAttributes: ['src'] },
      // Add data-* attributes to existing element
      img: { srcAttributes: ['data-src-dark', 'data-src-light'] },
      // With srcset format
      'my-picture': { srcsetAttributes: ['data-srcset'] },
      // With filter function
      'my-component': {
        srcAttributes: ['asset'],
        filter: ({ attributes }) => attributes.type === 'image',
      },
    },
  },
})
```

`paths` only applies to a file matched by a `tsconfig.json` through its `files` or `include`. Non-JS extension files should be explicitly listed in them, since a bare `"src"` or `"**/*"` `include` only matches TS/JS extensions, aligning with TypeScript's behavior. For example, to use a `paths` alias inside a CSS file (such as `@import '@/foo.css'`), list those files in `files`, or add an explicit extension to `include`:

```json [tsconfig.json]
{
  "include": ["src", "src/**/*.css", "src/**/*.scss"]
}
```

::: warning Less is not supported
`resolve.tsconfigPaths` does not apply inside `.less` files. Less only gives Vite the importing file's directory, not the file itself, so Vite cannot find the `tsconfig.json` that matches it. Use a relative path or [`resolve.alias`](#resolve-alias) for `@import` in Less.
:::
