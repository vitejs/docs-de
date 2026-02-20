
## ssr.resolve.conditions

- **Type:** `string[]`
- **Related:** [Resolve Conditions](./shared-options.md#resolve-conditions)

Defaults to the the root [`resolve.conditions`](./shared-options.md#resolve-conditions).

These conditions are used in the plugin pipeline, and only affect non-externalized dependencies during the SSR build. Use `ssr.resolve.externalConditions` to affect externalized imports.

## ssr.resolve.externalConditions

- **Type:** `string[]`
- **Default:** `[]`

Conditions that are used during ssr import (including `ssrLoadModule`) of externalized dependencies.