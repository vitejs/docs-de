# Worker-Optionen

Sofern nicht anders angegeben, gelten die Optionen in diesem Abschnitt für alle Dev-, Build- und Preview-Versionen.

## worker.format

- **Typ:** `'es' | 'iife'`
- **Standardwert:** `'iife'`

Ausgabeformat für Worker-Bundle.

## worker.plugins

- **Typ:** [`() => (Plugin | Plugin[])[]`](./shared-options#plugins)

Vite-Plugins, die für die Worker-Bundles gelten. Beachten Sie, dass [config.plugins](./shared-options#plugins) nur für Worker in dev gilt, es sollte stattdessen hier für build konfiguriert werden.
Die Funktion sollte neue Plugin-Instanzen zurückgeben, wie sie in parallelen Rollup-Worker-Builds verwendet werden. Daher wird die Änderung der `config.worker`-Optionen im `config`-Hook ignoriert.

## worker.rollupOptions

- **Typ:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

Rollup-Optionen für die Erstellung des Worker-Bundles.
