# Gemeinsam genutzte Plugins während der Erstellung

::: tip Feedback
Geben Sie uns Rückmeldungen in der ["Environment API Feedback"-Diskussion](https://github.com/vitejs/vite/discussions/16358)
:::

Siehe [Gemeinsam genutzte Plugins während der Erstellung](/guide/api-environment-plugins.md#shared-plugins-during-build).

Betroffener Bereich: `Vite Plugin-Authoren`

::: warning Zukünftige Standardanpassungen
`builder.sharedConfigBuild` wurde eingeführt in `v6.0`. Sie können den Wert auf `true` setzen, um zu prüfen wie Ihre Plugins mit einer gemeinsamen Konfiguration funktionieren. Wir suchen nach 

 Wir suchen Feedback zur Änderung der Standardeinstellung in einer zukünftigen Hauptversion, sobald das Plugin-Ökosystem bereit ist.
:::

## Motivation

Entwicklungs- und Build-Plugin-Pipelines ausrichten.

## Migrationsleitfaden

Um Plugins über verschiedene Umgebungen hinweg gemeinsam nutzen zu können, muss der Plugin-Status anhand der aktuellen Umgebung verschlüsselt werden. Ein Plugin der folgenden Form zählt die Anzahl der transformierten Module über alle Umgebungen hinweg.

```js
function CountTransformedModulesPlugin() {
  let transformedModules
  return {
    name: 'count-transformed-modules',
    buildStart() {
      transformedModules = 0
    },
    transform(id) {
      transformedModules++
    },
    buildEnd() {
      console.log(transformedModules)
    },
  }
}
```

Wenn wir stattdessen die Anzahl der transformierten Module für jede Umgebung zählen möchten, müssen wir eine Zuordnung speichern:

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = new Map<Environment, { count: number }>()
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state.set(this.environment, { count: 0 })
    }
    transform(id) {
      state.get(this.environment).count++
    },
    buildEnd() {
      console.log(this.environment.name, state.get(this.environment).count)
    }
  }
}
```

Zur Vereinfachung dieses Musters exportiert Vite einen `perEnvironmentState`-Helfer:

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = perEnvironmentState<{ count: number }>(() => ({ count: 0 }))
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state(this).count = 0
    }
    transform(id) {
      state(this).count++
    },
    buildEnd() {
      console.log(this.environment.name, state(this).count)
    }
  }
}
```
