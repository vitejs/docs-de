# Worker-Optionen

Optionen in Bezug auf Web Worker.

## worker.format

- **Type:** `'es' | 'iife'`
- **Default:** `'iife'`

Ausgabeformat für Worker-Bundle.

## worker.plugins

- **Type:** [`(Plugin | Plugin[])[]`](./shared-options#plugins)

Angabe der Plugins, die für das Worker-Bundle gelten. Beachten Sie, dass [config.plugins](./shared-options#plugins) nur für Worker in Dev gilt, es sollte stattdessen hier für Build konfiguriert werden.

## worker.rollupOptions

- **Type:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

Rollup-Optionen für die Erstellung des Worker-Bundles.
