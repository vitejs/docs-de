---
title: Vite konfigurieren
---

# Vite konfigurieren

Wenn Sie `vite` von der Kommandozeile aus starten, wird Vite automatisch versuchen, eine Konfigurationsdatei namens `vite.config.js` im [Projektstamm](/guide/#index-html-and-project-root) aufzulösen (andere JS- und TS-Erweiterungen werden ebenfalls unterstützt).

Die einfachste Konfigurationsdatei sieht wie folgt aus:

```js
// vite.config.js
export default {
  // config options
}
```

Anmerkung: Vite unterstützt die Verwendung der ES-Module-Syntax in der Konfigurationsdatei, auch wenn das Projekt keinen nativen Node ESM verwendet, z.B. `type: "Modul"` in `package.json`. In diesem Fall wird die Konfigurationsdatei vor dem Laden automatisch vorverarbeitet.

Sie können auch explizit eine Konfigurationsdatei angeben, die mit der CLI-Option `--config` verwendet wird (aufgelöst relativ zu `cwd`):

```bash
vite --config my-config.js
```

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

Vite unterstützt auch direkt TS-Konfigurationsdateien. Sie können `vite.config.ts` auch mit dem `defineConfig`-Helper verwenden.

## Bedingte Konfigurationen

Wenn die Konfiguration Optionen basierend auf dem Befehl (`serve` oder `build`), dem [mode](/guide/env-and-mode), der verwendet wird, wenn es ein SSR-Build ist (`isSsrBuild`) oder eine Vorschau des Builds ist (`isPreview`), bestimmen muss, kann sie stattdessen eine Funktion exportieren:

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

Es ist wichtig zu beachten, dass in der API von Vite der `command` Wert `serve` während der Entwicklung (in der Cli sind `vite`, `vite dev` und `vite serve` Aliase) und `build` bei der Erstellung für die Produktion (`vite build`) ist.

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

Umgebungsvariablen können wie üblich aus `process.env` bezogen werden.

Beachten Sie, dass Vite die `.env`-Dateien nicht standardmäßig lädt, da die zu ladenden Dateien nur nach Auswertung der Vite-Konfiguration bestimmt werden können, zum Beispiel beeinflussen die Optionen `root` und `envDir` das Ladeverhalten. Sie können jedoch die exportierte `loadEnv`-Hilfe verwenden, um die spezifische `.env`-Datei zu laden, falls erforderlich.

```js
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // vite config
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV)
    }
  }
})
```
