# Worker-Optionen

Optionen in Bezug auf Web Worker.

## worker.format

- **Type:** `'es' | 'iife'`
- **Default:** `'iife'`

Ausgabeformat für Worker-Bundle.

## worker.plugins

- **Type:** [`() => (Plugin | Plugin[])[]`](./shared-options#plugins)

Vite-Plugins, die für die Worker-Bundles gelten. Beachten Sie, dass [config.plugins](./shared-options#plugins) nur für Worker in dev gilt, es sollte stattdessen hier für build konfiguriert werden.
Die Funktion sollte neue Plugin-Instanzen zurückgeben, wie sie in parallelen Rollup-Worker-Builds verwendet werden. Daher wird die Änderung der `config.worker`-Optionen im `config`-Hook ignoriert.

## worker.rollupOptions

- **Type:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

Rollup-Optionen für die Erstellung des Worker-Bundles.
