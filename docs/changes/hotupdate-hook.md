# HMR `hotUpdate` Plugin Hook

::: tip Feedback
Geben Sie uns Rückmeldungen in der ["Environment API Feedback"-Diskussion](https://github.com/vitejs/vite/discussions/16358)
:::

Wir planen, den Plugin-Hook `handleHotUpdate` zugunsten des Hooks `hotUpdate` zu verwerfen, um Environment API-kompatibel zu sein und zusätzliche Überwachungsereignisse mit `create` und `delete` zu verarbeiten.

Betroffener Bereich: `Vite Plugin-Authoren`



::: warning Future Deprecation
`hotUpdate` wurde zum ersten Mal in `v6.0` eingeführt. Die Veraltung von `handleHotUpdate` ist für eine zukünftige Hauptversion geplant. Wir empfehlen, vorerst noch nicht von `handleHotUpdate` abzuweichen. Wenn Sie herumexperimentieren möchten, können Sie gerne die `future.removePluginHookHandleHotUpdate` in Ihrer Vite-Konfiguration auf `"warn"` setzen und uns Feedback geben.
:::

## Motivation

Die [`handleHotUpdate`-Hook](/guide/api-plugin.md#handlehotupdate) erlaubt eine benutzerdefinierte Behandlung von HMR Updates. Eine Liste der zu aktualisierenden Module wird im `HmrContext` angegeben.

```ts
interface HmrContext {
  file: string
  timestamp: number
  modules: Array<ModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

Dieser Hook wird einmal für alle Umgebungen aufgerufen, und die übergebenen Module enthalten ausschließlich gemischte Informationen aus der Client- und der SSR-Umgebung. Sobald Frameworks zu benutzerdefinierten Umgebungen wechseln, wird für jede von ihnen eine neue Hook benötigt.

Die neue `hotUpdate`-Hook funktioniert gleichartig wie `handleHotUpdate`, aber sie wird für jede Umgebung aufgerufen und erhält eine neue `HotUpdateOptions`-Instanz:

```ts
interface HotUpdateOptions {
  type: 'create' | 'update' | 'delete'
  file: string
  timestamp: number
  modules: Array<EnvironmentModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

Auf die aktuelle Entwicklungsumgebung kann, wie in anderen Plugin-Hooks, mit `this.environment` zugegriffen werden. Die `modules`-Liste wird von nun an nur noch Modulknoten aus der aktuellen Umgebung enthalten. Jedes Umgebungsupdate kann unterschiedliche Strategien zur Aktualisierung festlegen.

Diese Hook wird nun auch für zusätzliche "watch"-Events aufgerufen und nicht nur für `'update'`. Verwenden Sie `type`, um zwischen ihnen zu unterscheiden.

## Migrationsleitfaden

Filtern und Einschränken der Liste der betroffenen Module, damit HMR präziser ist.

```js
handleHotUpdate({ modules }) {
  return modules.filter(condition)
}

// Migration zu:

hotUpdate({ modules }) {
  return modules.filter(condition)
}
```

Zurückgeben eines leeren Arrays, damit ein komplettes Neuladen stattfindet:

```js
handleHotUpdate({ server, modules, timestamp }) {
  // Module manuell ungültig machen
  const invalidatedModules = new Set()
  for (const mod of modules) {
    server.moduleGraph.invalidateModule(
      mod,
      invalidatedModules,
      timestamp,
      true
    )
  }
  server.ws.send({ type: 'full-reload' })
  return []
}

// Migration zu:

hotUpdate({ modules, timestamp }) {
  // Invalidate modules manually
  const invalidatedModules = new Set()
  for (const mod of modules) {
    this.environment.moduleGraph.invalidateModule(
      mod,
      invalidatedModules,
      timestamp,
      true
    )
  }
  this.environment.hot.send({ type: 'full-reload' })
  return []
}
```

Zurückgeben eines leeren Arrays und durchführen einer kompletten, benutzerdefinierten HMR-Behandlung durch das Versenden von benutzerdefinierten Events zum Client:

```js
handleHotUpdate({ server }) {
  server.ws.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}

// Migration zu...

hotUpdate() {
  this.environment.hot.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}
```
