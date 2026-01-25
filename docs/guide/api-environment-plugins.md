# Umgebungs-API für Plugins

:::info Release-Kandidat
Die Environment API ist allgemein in der Phase für einen Release-Kandidaten. Wir werden für Stabilität in den APIs zwischen den Hauptversionen sorgen, damit das Ökosystem damit experimentieren und darauf aufbauen kann. Beachten Sie trotzdessen, dass [einige spezifische APIs](/changes/#considering) weiterhin als experimentell betrachtet werden.

Wir planen, diese neueren APIs (mit möglichen grundlegenden Änderungen) in einer zukünftigen Hauptversion zu stabilisieren, sobald nachgelagerte Projekte Zeit hatten, mit den neuen Funktionen zu experimentieren und sie zu validieren.

Ressourcen:

- [Feedback-Diskussion](https://github.com/vitejs/vite/discussions/16358), in der wir Feedback zu den neuen APIs sammeln.
- [Umgebungs-API PR](https://github.com/vitejs/vite/pull/16471), wo die neue API implementiert und überprüft wurde.

Bitte teilen Sie uns Ihr Feedback mit.
:::

## Zugriff auf die aktuelle Umgebung in Hooks

Da es bis Vite 6 nur zwei Umgebungen gab (`client` und `ssr`), reichte ein `ssr`-Boolescher Wert aus, um die aktuelle Umgebung in Vite-APIs zu identifizieren. Plugin-Hooks erhielten einen booleschen Wert „ssr“ im letzten Optionsparameter, und mehrere APIs erwarteten einen optionalen letzten Parameter „ssr“, um Module korrekt der richtigen Umgebung zuzuordnen (z. B. „server.moduleGraph.getModuleByUrl(url, { ssr })“).

Mit der Einführung konfigurierbarer Umgebungen haben wir nun eine einheitliche Möglichkeit, auf deren Optionen und Instanzen in Plugins zuzugreifen. Plugin-Hooks legen nun „this.environment“ in ihrem Kontext offen, und APIs, die zuvor einen booleschen Wert „ssr“ erwarteten, sind nun auf die richtige Umgebung beschränkt (z. B. „environment.moduleGraph.getModuleByUrl(url)“).

Der Vite-Server verfügt über eine gemeinsame Plugin-Pipeline, aber wenn ein Modul verarbeitet wird, geschieht dies immer im Kontext einer bestimmten Umgebung. Die Instanz `environment` ist im Plugin-Kontext verfügbar.

Ein Plugin könnte die Instanz `environment` verwenden, um die Verarbeitung eines Moduls in Abhängigkeit von der Konfiguration der Umgebung (auf die mit `environment.config` zugegriffen werden kann) zu ändern.

```ts
  transform(code, id) {
    console.log(this.environment.config.resolve.conditions)
  }
```

## Registrieren neuer Umgebungen mithilfe von Hooks

Plugins können im Hook `config` neue Umgebungen hinzufügen. Zum Beispiel verwendet die [RSC-Unterstützung](/plugins/#vitejs-plugin-rsc) eine zusätzliche Umgebung, um einen separaten Modulgraphen mit der `react-server`-Bedingung zu haben:

```ts
  config(config: UserConfig) {
    return {
      environments: {
        rsc: {
          resolve: {
            conditions: ['react-server', ...defaultServerConditions],
          },
        },
      },
    }
  }
```

Ein leeres Objekt reicht aus, um die Umgebung zu registrieren, Standardwerte aus der Konfiguration der Umgebung auf Root-Ebene.

## Konfigurieren der Umgebung mithilfe von Hooks

Während der `config`-Hook ausgeführt wird, ist die vollständige Liste der Umgebungen noch nicht bekannt, und die Umgebungen können sowohl durch die Standardwerte aus der Konfiguration der Umgebung auf Root-Ebene als auch explizit durch den `config.environments`-Eintrag beeinflusst werden.
Plugins sollten Standardwerte mithilfe des Hooks „config“ festlegen. Um jede Umgebung zu konfigurieren, können sie den neuen Hook „configEnvironment“ verwenden. Dieser Hook wird für jede Umgebung mit ihrer teilweise aufgelösten Konfiguration einschließlich der Auflösung der endgültigen Standardwerte aufgerufen.

```ts
  configEnvironment(name: string, options: EnvironmentOptions) {
    // Füge "workerd"-Bedingung zur RSC-Umgebung hinzu
    if (name === 'rsc') {
      return {
        resolve: {
          conditions: ['workerd'],
        },
      }
    }
  }
```

## Der `hotUpdate`-Hook

- **Type:** `(this: { environment: DevEnvironment }, options: HotUpdateOptions) => Array<EnvironmentModuleNode> | void | Promise<Array<EnvironmentModuleNode> | void>`
- **Siehe auch:** [HMR API](./api-hmr)

Der Hook `hotUpdate` ermöglicht es Plugins, benutzerdefinierte HMR-Aktualisierungen für eine bestimmte Umgebung durchzuführen. Wenn sich eine Datei ändert, wird der HMR-Algorithmus für jede Umgebung nacheinander gemäß der Reihenfolge in `server.environments` ausgeführt, sodass der Hook „hotUpdate“ mehrmals aufgerufen wird. Der Hook empfängt ein Kontextobjekt mit der folgenden Signatur:

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

- `this.environment` ist die Modulausführungsumgebung, in der derzeit eine Dateiaktualisierung verarbeitet wird.

- `modules` ist ein Array von Modulen in dieser Umgebung, die von der geänderten Datei betroffen sind. Es handelt sich um ein Array, da eine einzelne Datei mehreren bereitgestellten Modulen zugeordnet sein kann (z. B. Vue SFCs).

- `read` ist eine asynchrone Lesefunktion, die den Inhalt der Datei zurückgibt. Dies wird bereitgestellt, da auf einigen Systemen der Callback für Dateiänderungen möglicherweise zu schnell ausgelöst wird, bevor der Editor die Aktualisierung der Datei abgeschlossen hat, und `fs.readFile` direkt einen leeren Inhalt zurückgibt. Die übergebene Lesefunktion normalisiert dieses Verhalten.

Der Hook kann Folgendes auswählen:

- Filtern und Eingrenzen der Liste der betroffenen Module, damit die HMR genauer ist.

- Zurückgeben eines leeren Arrays und Durchführen eines vollständigen Neuladens:

  ```js
  hotUpdate({ modules, timestamp }) {
    if (this.environment.name !== 'client')
      return

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

- Geben Sie ein leeres Array zurück und führen Sie eine vollständige benutzerdefinierte HMR-Verarbeitung durch, indem Sie benutzerdefinierte Ereignisse an den Client senden:

  ```js
  hotUpdate() {
    if (this.environment.name !== 'client')
      return

    this.environment.hot.send({
      type: 'custom',
      event: 'special-update',
      data: {}
    })
    return []
  }
  ```

  Der Client-Code sollte den entsprechenden Handler mithilfe der [HMR-API](./api-hmr) registrieren (dies könnte durch den `transform`-Hook desselben Plugins injiziert werden):

  ```js
  if (import.meta.hot) {
    import.meta.hot.on('special-update', (data) => {
      // perform custom update
    })
  }
  ```

## Status pro Umgebung in Plugins

Da dieselbe Plugin-Instanz für verschiedene Umgebungen verwendet wird, muss der Plugin-Status mit `this.environment` verschlüsselt werden. Dies entspricht dem Muster, das das Ökosystem bereits verwendet, um den Status von Modulen zu speichern, wobei der boolesche Wert `ssr` als Schlüssel verwendet wird, um eine Vermischung des Status von Client- und SSR-Modulen zu vermeiden. Mit `Map<Environment, State>` kann der Status für jede Umgebung separat gespeichert werden. Beachten Sie, dass aus Gründen der Abwärtskompatibilität `buildStart` und `buildEnd` nur für die Client-Umgebung ohne das Flag `perEnvironmentStartEndDuringDev: true` aufgerufen werden.

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = new Map<Environment, { count: number }>()
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state.set(this.environment, { count: 0 })
    },
    transform(id) {
      state.get(this.environment).count++
    },
    buildEnd() {
      console.log(this.environment.name, state.get(this.environment).count)
    }
  }
}
```

## Plugins pro Umgebung

Ein Plugin kann mit der Funktion `applyToEnvironment` festlegen, auf welche Umgebungen es angewendet werden soll.

```js
const UnoCssPlugin = () => {
  // shared global state
  return {
    buildStart() {
      // init per-environment state with WeakMap<Environment,Data>
      // using this.environment
    },
    configureServer() {
      // use global hooks normally
    },
    applyToEnvironment(environment) {
      // return true if this plugin should be active in this environment
      // if the hook is not used, the plugin is active in all environments
    },
    resolveId(id, importer) {
      // only called for environments this plugin apply to
    },
  }
}
```

Die `applyToEnvironment`-Hook wird zur konfigurierten Zeit aufgerufen, aktuell nach `configResolved`, da Projekte im Ökosystem die Plugins in der Hook ändern. Das Auflösen der Umgebungs-Plugins könnte zukünftig vor `configResolved` stattfinden.

## Umgebung in Build-Hooks

Genau wie während der Entwicklung erhalten Plugin-Hooks auch während des Builds die Umgebungsinstanz, die den booleschen Wert `ssr` ersetzt.
Dies funktioniert auch für `renderChunk`, `generateBundle` und andere reine Build-Hooks.

## Gemeinsame Plugins während des Builds

Vor Vite 6 funktionierten die Plugin-Pipelines während der Entwicklung und des Builds unterschiedlich:

- **Während der Entwicklung:** Plugins werden gemeinsam genutzt
- **Während des Builds:** Plugins werden für jede Umgebung isoliert (in verschiedenen Prozessen: `vite build`, dann `vite build --ssr`).

Dadurch waren Frameworks gezwungen, den Status zwischen dem `client`-Build und dem `ssr`-Build über Manifestdateien zu teilen, die in das Dateisystem geschrieben wurden. In Vite 6 erstellen wir nun alle Umgebungen in einem einzigen Prozess, sodass die Plugin-Pipeline und die Kommunikation zwischen den Umgebungen an die Entwicklung angepasst werden können.

In einer zukünftigen Hauptversion könnten wir eine vollständige Angleichung haben:

- **Sowohl während der Entwicklung als auch beim Build:** Plugins werden gemeinsam genutzt, mit [Umgebungsfilterung](#per-environment-plugins)

Außerdem wird es eine einzige `ResolvedConfig`-Instanz geben, die während des Builds gemeinsam genutzt wird und die Caching auf der Ebene des gesamten App-Build-Prozesses ermöglicht, so wie wir es bisher mit `WeakMap<ResolvedConfig, CachedData>` während der Entwicklung gemacht haben.

Für Vite 6 müssen wir einen kleineren Schritt unternehmen, um die Abwärtskompatibilität zu gewährleisten. Ökosystem-Plugins verwenden derzeit `config.build` anstelle von `environment.config.build`, um auf die Konfiguration zuzugreifen, sodass wir standardmäßig eine neue `ResolvedConfig` pro Umgebung erstellen müssen. Ein Projekt kann sich für die gemeinsame Nutzung der vollständigen Konfiguration und der Plugins-Pipeline entscheiden, indem es `builder.sharedConfigBuild` auf `true` setzt.

Diese Option würde zunächst nur für eine kleine Untergruppe von Projekten funktionieren, daher können Plugin-Autoren sich dafür entscheiden, ein bestimmtes Plugin freizugeben, indem sie das Flag `sharedDuringBuild` auf `true` setzen. Dies ermöglicht eine einfache Freigabe des Status sowohl für reguläre Plugins:

```js
function myPlugin() {
  // Share state among all environments in dev and build
  const sharedState = ...
  return {
    name: 'shared-plugin',
    transform(code, id) { ... },

    // Opt-in into a single instance for all environments
    sharedDuringBuild: true,
  }
}
```
