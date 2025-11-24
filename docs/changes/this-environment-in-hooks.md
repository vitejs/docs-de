# `this.environment` in Hooks

::: tip Feedback
Geben Sie uns Rückmeldungen in der ["Environment API Feedback"-Diskussion](https://github.com/vitejs/vite/discussions/16358)
:::

Vor Vite 6 standen nur die Umgebungen `client` und `ssr` zur Verfügung. Ein einzelnes `options.ssr` Plugin-Hook-Argument in `resolveId`, `load` und `transform` ermöglichte Plugin-Authoren in der Verarbeitung von Modulen in Plugin-Hooks zwischen den beiden Umgebungen zu unterscheiden. In Vite 6, eine Vite-Applikation kann, je nach Bedarf, eine beliebige Anzahl der genannten umgebungen definieren. Wir führen `this.environment` im Plugin-Kontext ein, um in den Hooks mit der Umgebung des jeweiligen Moduls interagieren zu können.

Betroffener Bereich: `Vite Plugin-Authoren`

::: warning Zukünftige Veraltungen
`this.environment` wurde in `v6.0` eingeführt. Die Veraltung von `options.ssr` ist für eine zukünftige Hauptversion geplant. An diesem Pukt werden wir eine Migration der betroffenen Plugins zur neuen API empfehlen. Um eine mögliche Nutzung zu identifizieren, können Sie `future.removePluginHookSsrArgument` in Ihrer Vite-Konfiguration auf `"warn"` setzen.
:::

## Motivation

`this.environment` erlaubt der Plugin-Hook-Implementation nicht nur den den aktuellen Umgebungsnamen zu kennen, es gestattet auch Zugriff auf die Konfigurationsoptionen, Informationen zum Modulgraph und Pipeline-Transformationen (`environment.config`, `environment.moduleGraph`, `environment.transformRequest()`). Die Verfügbarkeit der Umgebungsinstanz im Kontext ermöglicht es Plugin-Authoren, die Abhängigkeit vom gesamten Server zu vermeiden (typischerweise wird diese zum Start durch die `configureServer`-Hook zwischengespeichert).

## Migrationsleitfaden

Für eine schnelle Migration von existierenden Plugins können Sie das `options.ssr`-Argument mit `this.environment.config.consumer === 'server'` in den `resolveId`-, `load`- und `transform`-Hooks ersetzen.

```ts
import { Plugin } from 'vite'

export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    resolveId(id, importer, options) {
      const isSSR = options.ssr // [!code --]
      const isSSR = this.environment.config.consumer === 'server' // [!code ++]

      if (isSSR) {
        // SSR specific logic
      } else {
        // Client specific logic
      }
    },
  }
}
```

Für eine robuste und langfristige Implementation sollte die Plugin-Hook [mehrere Umgebungen](/guide/api-environment-plugins.html#accessing-the-current-environment-in-hooks) behandeln, welche auf fein abgestimmte Umgebungsoptionen anstelle des reinen Umgebungsnamen beruhen sollte.
