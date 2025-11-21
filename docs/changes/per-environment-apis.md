# Umstellung auf umgebungsbezogene APIs

::: tip Feedback
Geben Sie uns Rückmeldungen in der ["Environment API Feedback"-Diskussion](https://github.com/vitejs/vite/discussions/16358)
:::

Mehrere APIs von `ViteDevServer` bezogen auf den Modulgraph und Modultransformationen wurden in die `DevEnvironment`-Instanzen verschoben.

Betroffener Bereich: `Vite Plugin-Authoren`

::: warning Zukünftige Veraltungen
Die `Environment`-Instanz wurde in `v6.0` eingeführt. Die Veraltung von `server.moduleGraph` und anderen Methoden, die sich jetzt in Umgebungen befinden, sind für eine zukünftige Hauptversion geplant. Wir empfehlen, vorerst bei den Server-Methoden zu bleiben. Um die Nutzung in Ihren Projekten zu identifizieren, setzen Sie diese Optionen in Ihrer Vite-Konfiguration.

```ts
future: {
  removeServerModuleGraph: 'warn',
  removeServerReloadModule: 'warn',
  removeServerPluginContainer: 'warn',
  removeServerHot: 'warn',
  removeServerTransformRequest: 'warn',
  removeServerWarmupRequest: 'warn',
}
```

:::

## Motivation

In Vite v5 und früheren Versionen hatte ein einzelner Vite-Entwicklungsserver immer zwei Umgebungen (`client` und `ssr`). Die Option `server.moduleGraph` enthielt gemischte Module aus beiden Umgebungen. Die Knoten wurden über die Listen `clientImportedModules` und `ssrImportedModules` verbunden (für jede Umgebung wurde jedoch eine einzelne Liste `importers` verwaltet). Ein transformiertes Modul wurde durch eine `id` und einen `ssr`-booleschen Wert dargestellt. Dieser boolesche Wert musste an APIs übergeben werden, zum Beispiel `server.moduleGraph.getModuleByUrl(url, ssr)` und `server.transformRequest(url, { ssr })`.

In Vite v6 ist es nun möglich, eine beliebige Anzahl von benutzerdefinierten Umgebungen (`client`, `ssr`, `edge`, etc.) zu erstellen. Ein einzelner boolescher Wert `ssr` reicht nicht mehr aus. Anstatt die APIs in die Form `server.transformRequest(url, { environment })` zu ändern, haben wir diese Methoden in die Umgebungsinstanz verschoben, sodass sie ohne einen Vite-Entwicklungsserver aufgerufen werden können.

## Migrationsleitfaden

- `server.moduleGraph` -> [`environment.moduleGraph`](/guide/api-environment-instances#separate-module-graphs)
- `server.reloadModule(module)` -> `environment.reloadModule(module)`
- `server.pluginContainer` -> `environment.pluginContainer`
- `server.transformRequest(url, ssr)` -> `environment.transformRequest(url)`
- `server.warmupRequest(url, ssr)` -> `environment.warmupRequest(url)`
- `server.hot` -> `server.client.environment.hot`
