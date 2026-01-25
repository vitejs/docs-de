---
title: Vite konfigurieren
---

# Vite konfigurieren

Wenn Sie `vite` von der Kommandozeile aus starten, wird Vite automatisch versuchen, eine Konfigurationsdatei namens `vite.config.js` im [Projektstamm](/guide/#index-html-and-project-root) aufzulösen (andere JS- und TS-Erweiterungen werden ebenfalls unterstützt).

Die einfachste Konfigurationsdatei sieht wie folgt aus:

```js [vite.config.js]
export default {
  // config options
}
```

Anmerkung: Vite unterstützt die Verwendung der ES-Module-Syntax in der Konfigurationsdatei, auch wenn das Projekt keinen nativen Node ESM verwendet, z.B. `"type": "module"` in `package.json`. In diesem Fall wird die Konfigurationsdatei vor dem Laden automatisch vorverarbeitet.

Sie können auch explizit eine Konfigurationsdatei angeben, die mit der CLI-Option `--config` verwendet wird (aufgelöst relativ zu `cwd`):

```bash
vite --config my-config.js
```

::: tip Laden der Konfiguration
Standardmäßig nutzt Vite `esbuild`, um die Konfiguration in einer temporären Datei zu bündeln. Dies kann zu Problemen beim Importieren von TypeScript-Dateien in einem Monorepo führen. Wenn Sie Probleme mit diesem Ansatz haben, können Sie stattdessen `--configLoader runner` angeben, um den [Modul-Runner](/guide/api-environment-runtimes.html#modulerunner) zu verwenden. Dieser erstellt keine temporäre Konfiguration und transformiert alle Dateien sofort. Beachten Sie, dass der Modul-Runner CJS in Konfigurationsdateien nicht unterstützt, externe CJS-Pakete sollten jedoch wie gewohnt funktionieren.

Wenn Sie eine Umgebung mit TypeScript-Support nutzen (z. B. `node --experimental-strip-types`) oder wenn Sie nur schlichtes JavaScript verwenden, dann können Sie die Option `--configLoader native` angeben, um die native Laufzeitumgebung zum Laden der Konfiguration zu verwenden. Beachten Sie, dass Updates von Modulen, die von der Konfigurationsdatei importiert werden, nicht erkannt werden und daher der Vite-Server nicht automatisch neu gestartet wird.
:::

## Intellisense-Konfiguration

Da Vite mit TypeScript-Typisierungen ausgeliefert wird, können Sie die Intellisense Ihrer IDE mit jsdoc-Typ-Hinweisen nutzen:

```js
/** @type {import('vite').UserConfig} */
export default {
  // ...
}
```

Alternativ können Sie die Hilfe `defineConfig` verwenden, die Intellisense ohne die Notwendigkeit von jsdoc-Annotationen bieten sollte:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

Vite unterstützt auch TypeScript-Konfigurationsdateien. Sie können `vite.config.ts` mit der obigen Hilfsfunktion `defineConfig` oder mit dem Operator `satisfies` verwenden:

```ts
import type { UserConfig } from 'vite'

export default {
  // ...
} satisfies UserConfig
```

## Bedingte Konfigurationen

Wenn die Konfiguration Optionen basierend auf dem Befehl (`serve` oder `build`), dem [mode](/guide/env-and-mode#modes), der verwendet wird, wenn es ein SSR-Build ist (`isSsrBuild`) oder eine Vorschau des Builds ist (`isPreview`), bestimmen muss, kann sie stattdessen eine Funktion exportieren:

```js
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      // dev specific config
    }
  } else {
    // command === 'build'
    return {
      // build specific config
    }
  }
})
```

Es ist wichtig zu beachten, dass in der API von Vite der Wert `command` während der Entwicklung `serve` ist (im Cli sind [`vite`](/guide/cli#vite), `vite dev` und `vite serve` Aliase), und `build` bei der Erstellung für die produktive Umgebung ([`vite build`](/guide/cli#vite-build)).

`isSsrBuild` und `isPreview` sind zusätzliche optionale Flags, um die Art der `build` bzw. `serve` Befehle zu unterscheiden. Einige Werkzeuge, die die Vite-Konfiguration laden, unterstützen diese Flags möglicherweise nicht und übergeben stattdessen `undefined`. Daher wird empfohlen, explizite Vergleiche gegen `true` und `false` zu verwenden.

## Asynchrone Konfiguration

Wenn die Konfiguration asynchrone Funktionen aufrufen muss, kann sie stattdessen eine asynchrone Funktion exportieren. Und diese asynchrone Funktion kann auch durch `defineConfig` für verbesserte Intellisense-Unterstützung übergeben werden:

```js
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // vite config
  }
})
```

## Umgebungsvariablen in der Konfiguration verwenden

Während der Auswertung der Konfiguration selbst stehen nur diejenigen Umgebungsvariablen zur Verfügung, die bereits in der aktuellen Prozessumgebung (`process.env`) vorhanden sind. Vite verschiebt das Laden von `.env*`-Dateien bewusst auf einen Zeitpunkt _nach_ der Auflösung der Benutzerkonfiguration, da die zu ladenden Dateien von Konfigurationsoptionen wie [`root`](/guide/#index-html-and-project-root) und [`envDir`](/config/shared-options.md#envdir) sowie vom endgültigen `mode` abhängen.

Das bedeutet, während Ihre `vite.config.*` ausgeführt wird, werden Variablen definiert in `.env`, `.env.local`, `.env.[mode]`, or `.env.[mode].local` **nicht** automatisch in `process.env` injiziert. Sie _werden_ später automatisch geladen und via `import.meta.env` (mit dem standardmäßigen `VITE_`-Präfixfilter) wie dokumentiert in [Umgebungsvariablen und Modi](/guide/env-and-mode.html) für den Anwendungscode bereitgestellt. Wenn Sie also nur Werte aus `.env*`-Dateien für die App bereitstellen müssen, brauchen Sie nichts in der Konfiguration aufrufen.

Beachten Sie, dass Vite die `.env`-Dateien nicht standardmäßig lädt, da die zu ladenden Dateien nur nach Auswertung der Vite-Konfiguration bestimmt werden können, zum Beispiel beeinflussen die Optionen `root` und `envDir` das Ladeverhalten. Sie können jedoch die exportierte `loadEnv`-Hilfe verwenden, um die spezifische `.env`-Datei zu laden, falls erforderlich.

```js
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the
  // `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      // Stellen Sie eine explizite Konstante auf App-Ebene bereit, die aus einer Umgebungsvariablen abgeleitet wird.
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    // Beispiel: Verwendung einer Umgebungsvariable, um den Port des Dev-Servers bedingt zu setzen
  }
})
```

## Debugging der Konfigurationsdatei im VS-Code

Mit dem standardmäßigen `--configLoader bundle`-Verhalten schreibt Vite die generierte, temporäre Konfigurationsdatei in den Ordner `node_modules/.vite-temp` und ein Fehler „Datei nicht gefunden“ tritt auf, wenn das Debuggen von Haltepunkten in der Vite-Konfigurationsdatei eingestellt wird. Um das Problem zu beheben, fügen Sie die folgende Konfiguration zu `.vscode/settings.json` hinzu:

```json
{
  "debug.javascript.terminalOptions": {
    "resolveSourceMapLocations": [
      "${workspaceFolder}/**",
      "!**/node_modules/**",
      "**/node_modules/.vite-temp/**"
    ]
  }
}
```
