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
