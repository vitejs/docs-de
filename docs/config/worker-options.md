# Worker-Optionen

Sofern nicht anders angegeben, gelten die Optionen in diesem Abschnitt für alle `dev`-, `build`- und `preview`-Versionen.

## worker.format

- **Typ:** `'es' | 'iife'`
- **Standard:** `'iife'`

Ausgabeformat für Worker-Bundle.

## worker.plugins

- **Typ:** [`() => (Plugin | Plugin[])[]`](./shared-options#plugins)

Vite-Plugins, die für die Worker-Bundles gelten. Beachten Sie, dass [config.plugins](./shared-options#plugins) nur für Worker in dev gilt, es sollte stattdessen hier für build konfiguriert werden.
Die Funktion sollte neue Plugin-Instanzen zurückgeben, wie sie in parallelen Rollup-Worker-Builds verwendet werden. Daher wird die Änderung der `config.worker`-Optionen im `config`-Hook ignoriert.

## worker.rollupOptions

<!-- TODO: update the link below to Rolldown's documentation -->

- **Typ:** [`RolldownOptions`](https://rollupjs.org/configuration-options/)

Rollup-Optionen für die Erstellung des Worker-Bundles.

## worker.rollupOptions

- **Typ:** `RolldownOptions`
- **Veraltet**

Diese Option ist ein Alias der `worker.rolldownOptions`-Option. Nutzen Sie stattdessen `build.rolldownOptions`.
