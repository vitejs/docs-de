# Gemeinsame Optionen

## root

- **Typ:** `string`
- **Standardwert:** `process.cwd()`

Projektstammverzeichnis (wo `index.html` sich befindet). Kann ein absoluter Pfad oder ein Pfad relativ zum aktuellen Arbeitsverzeichnis sein.

Siehe [Projektstamm](/guide/#index-html-and-project-root) für weitere Details.

## base

- **Typ:** `string`
- **Standardwert:** `/`
- **Verwandt:** [`server.origin`](/config/server-options.md#server-origin)

Öffentlicher Basispfad bei der Ausführung in Entwicklung oder Produktion. Gültige Werte sind:

- Absoluter URL-Pfad, z. B. `/foo/`
- Vollständige URL, z. B. `https://foo.com/` (Der ursprüngliche Tei wird in der Entwicklung nicht verwendet)
- Leerzeichen oder `./` (für die eingebettete Bereitstellung)

Siehe [Öffentlicher Basispfad](/guide/build#public-base-path) für weitere Details.

## Modus

- **Typ:** `string`
- **Standardwert:** `'development'` für die Ausführung, `'production'` für den Build

Die Angabe in der Konfiguration überschreibt den Standardmodus für **Ausführung und Build**. Dieser Wert kann auch über die Befehlszeile mit der Option `--mode` überschrieben werden.

Siehe [Umgebungsvariablen und Modi](/guide/env-and-mode) für weitere Details.

## definieren

- **Typ:** `Record<string, string>`

Definieren von globalen Konstantenersatzwerten. Einträge werden während der Entwicklung als Globals definiert und während des Builds statisch ersetzt.

Vite verwendet [esbuild defines](https://esbuild.github.io/api/#define), um Ersetzungen durchzuführen, daher müssen Wertausdrücke eine Zeichenkette sein, die einen JSON-serialisierbaren Wert (null, boolesch, Zahl, Zeichenkette, Array oder Objekt) oder einen einzelnen Bezeichner enthält. Bei Werten, die keine Strings sind, konvertiert Vite sie automatisch mit `JSON.stringify` in einen String.

**Beispiel:**

```js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('v1.0.0'),
    __API_URL__: 'window.__backend_api_url',
  },
})
```

:::tip HINWEIS
Für TypeScript-Benutzer stellen Sie sicher, dass Sie die Typerklärungen in der Datei `env.d.ts` oder `vite-env.d.ts` hinzufügen, um Typprüfungen und Intellisense zu erhalten.

Beispiel:

```ts
// vite-env.d.ts
declare const __APP_VERSION__: string
```

:::

## Plugins

- **Typ:** `(Plugin | Plugin[] | Promise<Plugin | Plugin[]>)[]`

Array von Plugins zur Verwendung. Falsche Plugins werden ignoriert, und Arrays von Plugins werden abgeflacht. Wenn ein Versprechen zurückgegeben wird, wird es vor der Ausführung aufgelöst. Siehe [Plugin-API](/guide/api-plugin) für weitere Details zu Vite-Plugins.

## publicDir

- **Typ:** `string | false`
- **Standardwert:** `"public"`

Verzeichnis zur Bereitstellung von einfachen statischen Assets. Dateien in diesem Verzeichnis werden während der Entwicklung unter `/` bereitgestellt und während des Builds in das Stammverzeichnis von `outDir` kopiert und immer unverändert bereitgestellt oder kopiert. Der Wert kann entweder ein absoluter Dateisystempfad oder ein Pfad relativ zum Projektstamm sein.

Die Definition von `publicDir` als `false` deaktiviert diese Funktion.

Siehe [Das `public`-Verzeichnis](/guide/assets#the-public-directory) für weitere Details.

## cacheDir

- **Typ:** `string`
- **Standardwert:** `"node_modules/.vite"`

Verzeichnis zur Speicherung von Cache-Dateien. Dateien in diesem Verzeichnis sind vorab gebündelte Abhängigkeiten oder einige andere von Vite generierte Cache-Dateien, die die Leistung verbessern können. Sie können die Flagge `--force` verwenden oder das Verzeichnis manuell löschen, um die Cache-Dateien neu zu generieren. Der Wert kann entweder ein absoluter Dateisystempfad oder ein Pfad relativ zum Projektstamm sein. Standardmäßig auf `.vite`, wenn keine `package.json` erkannt wird.

## resolve.alias

- **Typ:**
  `Record<string, string> | Array<{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }>`

Wird als [Einträge-Option](https://github.com/rollup/plugins/tree/master/packages/alias#entries) an `@rollup/plugin-alias` übergeben. Kann entweder ein Objekt oder ein Array von `{ find, replacement, customResolver }`-Paaren sein.

Beim Aliasieren von Dateisystempfaden sollten immer absolute Pfade verwendet werden. Relative Alias-Werte werden wie angegeben verwendet und nicht in Dateisystempfade aufgelöst.

Fortgeschrittene benutzerdefinierte Auflösung kann über [Plugins](/guide/api-plugin) erreicht werden.

::: warning Verwendung mit SSR
Wenn Sie Aliase für [SSR-externe Abhängigkeiten](/guide/ssr.md#ssr-externals) konfiguriert haben, möchten Sie möglicherweise die tatsächlichen `node_modules`-Pakete als Alias festlegen. Sowohl [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) als auch [pnpm](https://pnpm.io/aliases/) unterstützen das Aliasieren über das Präfix `npm:`.
:::

## resolve.dedupe

- **Typ:** `string[]`

Wenn Sie kopierte Kopien derselben Abhängigkeit in Ihrer App haben (

wahrscheinlich aufgrund des Hoistings oder verknüpfter Pakete in Monorepos), verwenden Sie diese Option, um Vite dazu zu zwingen, aufgelistete Abhängigkeiten immer auf dieselbe Kopie (aus dem Projektstamm) zu lösen.

:::warning SSR + ESM
Für SSR-Builds funktioniert die Deduplizierung für ESM-Build-Ausgaben, die von `build.rollupOptions.output` konfiguriert sind, nicht. Ein Workaround besteht darin, CJS-Build-Ausgaben zu verwenden, bis ESM eine bessere Plugin-Unterstützung für die Modulladung hat.
:::

## resolve.conditions

- **Typ:** `string[]`

Zusätzliche erlaubte Bedingungen bei der Auflösung von [bedingten Exports](https://nodejs.org/api/packages.html#packages_conditional_exports) aus einem Paket.

Ein Paket mit bedingten Exports kann das folgende `exports`-Feld in seiner `package.json` haben:

```json
{
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.js"
    }
  }
}
```

Hier sind `import` und `require` "Bedingungen". Bedingungen können verschachtelt sein und sollten von am spezifischsten bis am wenigsten spezifisch angegeben werden.

Vite hat eine Liste von "erlaubten Bedingungen" und passt die erste Bedingung an, die in der erlaubten Liste steht, an. Die standardmäßig erlaubten Bedingungen sind: `import`, `module`, `browser`, `default` und `production/development` basierend auf dem aktuellen Modus. Die Konfigurationsoption `resolve.conditions` ermöglicht die Angabe zusätzlicher erlaubter Bedingungen.

:::warning Auflösen von Subpath-Exports
Die Verwendung von Exportschlüsseln, die mit "/" enden, ist von Node veraltet und funktioniert möglicherweise nicht gut. Bitte kontaktieren Sie den Paketautor, um stattdessen [`*`-Subpfadmuster](https://nodejs.org/api/packages.html#package-entry-points) zu verwenden.
:::

## resolve.mainFields

- **Typ:** `string[]`
- **Standardwert:** `['browser', 'module', 'jsnext:main', 'jsnext']`

Liste der Felder in `package.json`, die bei der Auflösung des Einstiegspunktes eines Pakets zu versuchen sind. Beachten Sie, dass dies einen geringeren Vorrang hat als bedingte Exporte, die aus dem Feld `exports` aufgelöst werden: Wenn ein Einstiegspunkt erfolgreich aus `exports` aufgelöst wird, wird das Hauptfeld ignoriert.

## resolve.extensions

- **Typ:** `string[]`
- **Standardwert:** `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`

Liste der Dateierweiterungen, die für Importe ohne Erweiterungen ausprobiert werden sollen. Beachten Sie, dass es **NICHT** empfohlen wird, Erweiterungen für benutzerdefinierte Importtypen (z. B. `.vue`) auszulassen, da dies die Unterstützung in der IDE und der Typprüfung stören kann.

## resolve.preserveSymlinks

- **Typ:** `boolean`
- **Standardwert:** `false`

Durch Aktivieren dieser Einstellung bestimmt Vite die Dateiidentität anhand des ursprünglichen Dateipfads (d. h. des Pfads ohne das Folgen von Symbolischen Links), anstelle des realen Dateipfads (d. h. des Pfads nach dem Folgen von Symbolischen Links).

- **Verwandt:** [esbuild#preserve-symlinks](https://esbuild.github.io/api/#preserve-symlinks), [webpack#resolve.symlinks](https://webpack.js.org/configuration/resolve/#resolvesymlinks)

## css.modules

- **Typ:**
  ```ts
  interface CSSModulesOptions {
    getJSON?: (
      cssFileName: string,
      json: Record<string, string>,
      outputFileName: string,
    ) => void
    scopeBehaviour?: 'global' | 'local'
    globalModulePaths?: RegExp[]
    exportGlobals?: boolean
    generateScopedName?:
      | string
      | ((name: string, filename: string, css: string) => string)
    hashPrefix?: string
    /**
     * default: undefined
     */
    localsConvention?:
      | 'camelCase'
      | 'camelCaseOnly'
      | 'dashes'
      | 'dashesOnly'
      | ((
          originalClassName: string,
          generatedClassName: string,
          inputFile: string,
        ) => string)
  }
  ```

Konfigurieren Sie das Verhalten von CSS-Modulen. Die Optionen werden an [postcss-modules](https://github.com/css-modules/postcss-modules) übergeben.

Diese Option hat keine Auswirkungen, wenn [Lightning CSS](../guide/features.md#lightning-css) verwendet wird. Wenn aktiviert, sollte [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html) verwendet werden.

## css.postcss

- **Typ:** `string | (postcss.ProcessOptions & { plugins?: postcss.AcceptedPlugin[] })`

Inline-PostCSS-Konfiguration oder ein benutzerdefiniertes Verzeichnis zum Suchen der PostCSS-Konfiguration (Standard ist das Projektstammverzeichnis).

Für die Inline-PostCSS-Konfiguration wird dasselbe Format wie `postcss.config.js` erwartet. Für die `plugins`-Eigenschaft kann nur das [Array-Format](https://github.com/postcss/postcss-load-config/blob/main/README.md#array) verwendet werden.

Die Suche erfolgt mit [postcss-load-config](https://github.com/postcss/postcss-load-config), und nur die unterstützten Dateinamen für die Konfiguration werden geladen.

Hinweis: Wenn eine Inline-Konfiguration bereitgestellt wird, sucht Vite nicht nach anderen PostCSS-Konfigurationsquellen.

## css.preprocessorOptions

- **Typ:** `Record<string, object>`

Geben Sie Optionen an, die an CSS-Preprozessoren übergeben werden sollen. Die Dateierweiterungen werden als Schlüssel für die Optionen verwendet. Die unterstützten Optionen für jeden Preprozessor finden Sie in ihrer jeweiligen Dokumentation:

- `sass`/`scss` - [Optionen](https://sass-lang.com/documentation/js-api/interfaces/LegacyStringOptions).
- `less` - [Optionen](https://lesscss.org/usage/#less-options).

- `styl`/`stylus` - Es wird nur [`define`](https://stylus-lang.com/docs/js.html#define-name-node) unterstützt, das als Objekt übergeben werden kann.

Alle Preprozessor-Optionen unterstützen auch die Option `additionalData`, die verwendet werden kann, um zusätzlichen Code für den Inhalt jeder Style-Datei einzufügen.

Beispiel:

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`
      },
      less: {
        math: 'parens-division'
      },
      styl: {
        define: {
          $specialColor: new stylus.nodes.RGBA(51, 197, 255, 1)
        }
      }
    }
  }
})
```

## css.devSourcemap

- **Experimentell:** [Feedback geben](https://github.com/vitejs/vite/discussions/13845)
- **Typ:** `boolean`
- **Standardwert:** `false`

Ob Sourcemaps während der Entwicklung aktiviert werden sollen.

## css.transformer

- **Experimentell:** [Feedback geben](https://github.com/vitejs/vite/discussions/13835)
- **Typ:** `'postcss' | 'lightningcss'`
- **Standardwert:** `'postcss'`

Wählt den für die CSS-Verarbeitung verwendeten Engine aus. Weitere Informationen finden Sie unter [Lightning CSS](../guide/features.md#lightning-css).

## css.lightningcss

- **Experimentell:** [Feedback geben](https://github.com/vitejs/vite/discussions/13835)
- **Typ:**

```js
import type {
  CSSModulesConfig,
  Drafts,
  Features,
  NonStandard,
  PseudoClasses,
  Targets
} from 'lightningcss'
```

```js
{
  targets?: Targets
  include?: Features
  exclude?: Features
  drafts?: Drafts
  nonStandard?: NonStandard
  pseudoClasses?: PseudoClasses
  unusedSymbols?: string[]
  cssModules?: CSSModulesConfig,
  // ...
}
```

Konfigurieren Sie Lightning CSS. Die vollständigen Transformationsoptionen finden Sie im [Lightning CSS-Repo](https://github.com/parcel-bundler/lightningcss/blob/master/node/index.d.ts).

## json.namedExports

- **Typ:** `boolean`
- **Standardwert:** `true`

Ob benannte Imports aus `.json`-Dateien unterstützt werden sollen.

## json.stringify

- **Typ:** `boolean`
- **Standardwert:** `false`

Wenn auf `true` gesetzt, wird importiertes JSON in `export default JSON.parse("...")` umgewandelt, was wesentlich performanter ist als Objektliterale, insbesondere wenn die JSON-Datei groß ist.

Wenn dies aktiviert ist, werden benannte Imports deaktiviert.

## esbuild

- **Typ:** `ESBuildOptions | false`

`ESBuildOptions` erweitert [die eigenen Transformationsoptionen von esbuild](https://esbuild.github.io/api/#transform). Der häufigste Anwendungsfall ist die Anpassung von JSX:

```js
export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
})
```

Standardmäßig wird esbuild auf Dateien mit den Erweiterungen `ts`, `jsx` und `tsx` angewendet. Sie können dies mit `esbuild.include` und `esbuild.exclude` anpassen, die eine Regex, ein [picomatch-Muster](https://github.com/micromatch/picomatch#globbing-features) oder ein Array davon sein können.

Darüber hinaus können Sie auch `esbuild.jsxInject` verwenden, um automatisch JSX-Helper-Imports für jede von esbuild transformierte Datei einzufügen:

```js
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`
  }
})
```

Wenn [`build.minify`](./build-options.md#build-minify) auf `true` gesetzt ist, werden standardmäßig alle Minify-Optimierungen angewendet. Um bestimmte Aspekte davon zu deaktivieren, setzen Sie eine der Optionen `esbuild.minifyIdentifiers`, `esbuild.minifySyntax` oder `esbuild.minifyWhitespace` auf `false`. Beachten Sie, dass die Option `esbuild.minify` nicht verwendet werden kann, um `build.minify` zu überschreiben.

Auf `false` setzen, um esbuild-Transformationen zu deaktivieren.

## assetsInclude

- **Typ:** `string | RegExp | (string | RegExp)[]`
- **Verwandt:** [Behandlung statischer Assets](/guide/assets)

Geben Sie zusätzliche [picomatch-Muster](https://github.com/micromatch/picomatch#globbing-features) an, die als statische Assets behandelt werden sollen, damit:

- Sie aus der Plugin-Transformationspipeline ausgeschlossen werden, wenn sie aus HTML referenziert oder direkt über `fetch` oder XHR angefordert werden.

- Beim Importieren aus JS wird ihre aufgelöste URL-Zeichenfolge zurückgegeben (dies kann überschrieben werden, wenn Sie ein Plugin mit `enforce: 'pre'` haben, um den Asset-Typ anders zu behandeln).

Die eingebauten Asset-Typenliste finden Sie [hier](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts).

**Beispiel:**

```js
export default defineConfig({
  assetsInclude: ['**/*.gltf']
})
```

## logLevel

- **Typ:** `'info' | 'warn' | 'error' | 'silent'`

Passen Sie die Konsolenausgabe an. Standardmäßig ist `'info'`.

## customLogger

- **Typ:**
  ```ts
  interface Logger {
    info(msg: string, options?: LogOptions): void
    warn(msg: string, options?: LogOptions): void
    warnOnce(msg: string, options?: LogOptions): void
    error(msg: string, options?: LogErrorOptions): void
    clearScreen(type: LogType): void
    hasErrorLogged(error: Error | RollupError): boolean
    hasWarned: boolean
  }
  ```

Verwenden Sie einen benutzerdefinierten Logger, um Nachrichten zu protokollieren. Sie können die `createLogger`-API von Vite verwenden, um den Standard-Logger zu erhalten und ihn anpassen, um beispielsweise die Nachricht zu ändern oder bestimmte Warnungen auszufiltern.

```js
import { createLogger, defineConfig } from 'vite'

const logger = createLogger()
const loggerWarn = logger.warn

logger.warn = (msg, options) => {
  // Ignore empty CSS files warning
  if (msg.includes('vite:css') && msg.includes(' is empty')) return
  loggerWarn(msg, options)
}

export default defineConfig({
  customLogger: logger
})
```

## clearScreen

- **Typ:** `boolean`
- **Standardwert:** `true`

Legen Sie fest, ob der Konsolenbildschirm bei jedem Neustart gelöscht werden soll. Wenn Sie dieses Verhalten deaktivieren möchten, setzen Sie es auf `false`.

## envDir

- **Typ:** `string`
- **Standardwert:** `root`

Das Verzeichnis, aus dem die `.env`-Dateien geladen werden. Kann ein absoluter Pfad oder ein Pfad relativ zum Projektstammverzeichnis sein.

Weitere Informationen zu Umgebungsdateien finden Sie [hier](/guide/env-and-mode#env-files).

## envPrefix

- **Typ:** `string | string[]`
- **Standardwert:** `VITE_`

Umgebungsvariablen, die mit `envPrefix` beginnen, werden über `import.meta.env` in Ihrem Client-Quellcode freigegeben.

:::warning SICHERHEITSHINWEISE
`envPrefix` sollte nicht als `''` festgelegt werden, da dies alle Ihre Umgebungsvariablen freigibt und unerwartetes Lecken sensibler Informationen verursachen kann. Vite gibt einen Fehler aus, wenn `''` erkannt wird.

Wenn Sie eine nicht vorab festgelegte Variable freigeben möchten, können Sie [define](#define) verwenden, um sie freizugeben:

```js
define: {
  'import.meta.env.ENV_VARIABLE': JSON.stringify(process.env.ENV_VARIABLE)
}
```

:::

## appType

- **Typ:** `'spa' | 'mpa' | 'custom'`
- **Standardwert:** `'spa'`

Ob Ihre Anwendung eine Single Page Application (SPA), eine [Multi Page Application (MPA)](../guide/build#multi-page-app) oder eine benutzerdefinierte Anwendung (SSR und Frameworks mit benutzerdefinierter HTML-Behandlung) ist:

- `'spa'`: HTML-Middleware einschließen und SPA-Fallback verwenden. Konfigurieren Sie [sirv](https://github.com/lukeed/sirv) mit `single: true` in der Vorschau.
- `'mpa'`: HTML-Middleware einschließen
- `'custom'`: Keine HTML-Middleware einschließen

Weitere Informationen finden Sie im [SSR-Handbuch von Vite](/guide/ssr#vite-cli). Verwandt: [`server.middlewareMode`](./server-options#server-middlewaremode).
