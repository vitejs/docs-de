# Build-Optionen

Sofern nicht anders angegeben, gelten die Optionen in diesem Abschnitt nur für den Build-Prozess.

## build.target

- **Typ:** `string | string[]`
- **Standard:** `'baseline-widely-available'`
- **Verwandt:** [Browser-Kompatibilität](/guide/build#browser-compatibility)

Browser-Kompatibilitätsziel für das endgültige Bundle. Der Standardwert ist ein spezieller Vite-Wert, `'baseline-widely-available'`, der auf Browser abzielt, die in der [Baseline](https://web-platform-dx.github.io/web-features/) Widely Available am 01.05.2025 enthalten sind. Konkret sind dies `['chrome107', 'edge107', 'firefox104', 'safari16']`.

Ein weiterer spezieller Wert ist `'esnext'` - der die Unterstützung nativer dynamischer Importe voraussetzt und nur eine minimale Transpilierung durchführt.
Die Transpilierung erfolgt mit esbuild, und der Wert sollte eine gültige [esbuild-Zieloption](https://esbuild.github.io/api/#target) sein. Benutzerdefinierte Ziele können entweder eine ES-Version sein (z.B. `es2015`), ein Browser mit Version (z.B. `chrome58`) oder ein Array von mehreren Zielzeichenketten.

Beachten Sie, dass der Build fehlschlägt, wenn der Code Funktionen enthält, die von esbuild nicht sicher transpiliert werden können. Weitere Details finden Sie in den [esbuild-Dokumentationen](https://esbuild.github.io/content-types/#javascript).

## build.modulePreload

- **Typ:** `boolean | { polyfill?: boolean, resolveDependencies?: ResolveModulePreloadDependenciesFn }`
- **Standard:** `{ polyfill: true }`

Standardmäßig wird ein [Modul-Preload-Polyfill](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill) automatisch eingefügt. Das Polyfill wird automatisch in das Proxy-Modul jeder `index.html`-Eingabe eingefügt. Wenn der Build so konfiguriert ist, dass eine benutzerdefinierte Eingabe verwendet wird, die nicht HTML ist, über `build.rollupOptions.input`, ist es notwendig, das Polyfill in Ihrer benutzerdefinierten Eingabe manuell zu importieren:

```js
import 'vite/modulepreload-polyfill'
```

Hinweis: Das Polyfill gilt **nicht** für den [Library-Modus](/guide/build#library-mode). Wenn Sie Browser ohne native Unterstützung für dynamisches Importieren unterstützen müssen, sollten Sie es wahrscheinlich in Ihrer Bibliothek vermeiden.

Das Polyfill kann mit `{ polyfill: false }` deaktiviert werden.

Die Liste der Chunks, die für jedes dynamische Importieren vorab geladen werden sollen, wird von Vite berechnet. Standardmäßig wird ein absoluter Pfad, einschließlich des `base`, verwendet, wenn diese Abhängigkeiten geladen werden. Wenn das `base` relativ ist (`''` oder `'./'`), wird `import.meta.url` zur Laufzeit verwendet, um absolute Pfade zu vermeiden, die vom endgültigen bereitgestellten `base` abhängen.

Es gibt experimentelle Unterstützung für eine fein abgestimmte Kontrolle über die Liste der Abhängigkeiten und deren Pfade mithilfe der `resolveDependencies`-Funktion. [Feedback geben](https://github.com/vitejs/vite/discussions/13841). Es erwartet eine Funktion des Typs `ResolveModulePreloadDependenciesFn`:

```ts
type ResolveModulePreloadDependenciesFn = (
  url: string,
  deps: string[],
  context: {
    hostId: string
    hostType: 'html' | 'js'
  },
) => string[]
```

Die Funktion `resolveDependencies` wird für jeden dynamischen Import mit einer Liste der Chunks aufgerufen, von denen er abhängt, und sie wird auch für jeden Chunk aufgerufen, der in Entry-HTML-Dateien importiert wird. Ein neues dependencies-Array kann mit diesen gefilterten oder weiteren Abhängigkeiten zurückgegeben werden, wobei deren Pfade geändert werden. Die `deps`-Pfade sind relativ zum `build.outDir`. Der Rückgabewert sollte ein relativer Pfad zu `build.outDir` sein.

```js twoslash
/** @type {import('vite').UserConfig} */
const config = {
  build: {
    modulePreload: {
      resolveDependencies: (filename, deps, { hostId, hostType }) => {
        return deps.filter(condition)
      },
    },
  },
}
```

Die aufgelösten Abhängigkeitspfade können weiter mithilfe von [`experimental.renderBuiltUrl`](../guide/build.md#advanced-base-options) modifiziert werden.

## build.polyfillModulePreload

- **Typ:** `boolean`
- **Standard:** `true`
- **Veraltet:** Verwenden Sie stattdessen `build.modulePreload.polyfill`

Ob automatisch ein [Modul-Preload-Polyfill](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill) eingefügt werden soll.

## build.outDir

- **Typ:** `string`
- **Standard:** `dist`

Geben Sie das Ausgabeverzeichnis an (relativ zum [Projektstamm](/guide/#index-html-und-projektstamm)).

## build.assetsDir

- **Typ:** `string`
- **Standard:** `assets`

Geben Sie das Verzeichnis an, unter dem generierte Assets eingebettet werden sollen (relativ zu `build.outDir`). Dies wird nicht im [Library-Modus](/guide/build#library-mode) verwendet.

## build.assetsInlineLimit

- **Typ:** `number` | `((filePath: string, content: Buffer) => boolean | undefined)`
- **Standard:** `4096` (4 KiB)

Importierte oder referenzierte Assets, die kleiner als diese Schwelle sind, werden als base64-URLs eingebettet, um zusätzliche HTTP-Anfragen zu vermeiden. Setzen Sie dies auf `0`, um die Einbettung vollständig zu deaktivieren.

Wenn ein Callback übergeben wird, kann ein boolescher Wert zurückgegeben werden, um ein opt-in oder opt-out zu bewirken. Wenn nichts zurückgegeben wird, dann greift die Standardlogik.

Git LFS-Platzhalter werden automatisch von der Einbettung ausgeschlossen, da sie den Inhalt der Datei, die sie repräsentieren, nicht enthalten.

:::tip HINWEIS
Wenn Sie `build.lib` angeben, wird `build.assetsInlineLimit` ignoriert und Assets werden unabhängig von ihrer Größe oder ob es sich um einen Git LFS-Platzhalter handelt, immer eingebettet.
:::

## build.cssCodeSplit

- **Typ:** `boolean`
- **Standard:** `true`

Aktivieren/Deaktivieren des Aufteilens von CSS-Code. Wenn diese Option aktiviert ist, wird CSS, das in asynchronen JS-Chunks importiert wird, als Chunks beibehalten und zusammen mit dem Chunk abgerufen.

Wenn deaktiviert, wird das gesamte CSS im gesamten Projekt in eine einzelne CSS-Datei extrahiert.

:::tip HINWEIS
Wenn Sie `build.lib` angeben, wird `build.cssCodeSplit` standardmäßig auf `false` gesetzt.
:::

## build.cssTarget

- **Typ:** `string | string[]`
- **Standard:** dasselbe wie [`build.target`](#build-target)

Diese Option ermöglicht es Benutzern, ein anderes Browserziel für die CSS-Minimierung als für die JavaScript-Transpilierung festzulegen.

Es sollte nur verwendet werden, wenn Sie einen nicht-mainstream Browser anvisieren. Ein Beispiel ist der Android WeChat WebView, der die meisten modernen JavaScript-Funktionen unterstützt, aber nicht die [`#RGBA` hexadezimale Farbnotation in CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb_colors). In diesem Fall müssen Sie `build.cssTarget` auf `chrome61` setzen, um zu verhindern, dass Vite `rgba()`-Farben in `#RGBA`-hexadezimale Notationen umwandelt.

## build.cssMinify

- **Typ:** `boolean | 'esbuild' | 'lightningcss'`
- **Standard:** dasselbe wie [`build.minify`](#build-minify) für Clients, `'esbuild'` für SSR

Diese Option ermöglicht es Benutzern, die CSS-Minimierung speziell zu überschreiben, anstatt auf die Standardwerte von `build.minify` zurückzugreifen. Vite verwendet standardmäßig `esbuild` zur Minimierung von CSS. Setzen Sie die Option auf `'lightningcss'`, um stattdessen [Lightning CSS](https://lightningcss.dev/minification.html) zu verwenden. Wenn ausgewählt, kann es mit [`css.lightningcss`](./shared-options.md#css-lightningcss) konfiguriert werden.

## build.sourcemap

- **Typ:** `boolean | 'inline' | 'hidden'`
- **Standard:** `false`

Erzeugen von Produktionsquellekarten. Wenn `true`, wird eine separate Sourcemap-Datei erstellt. Wenn `'inline'`, wird die Sourcemap als Daten-URI an die resultierende Ausgabedatei angehängt. `'hidden'` funktioniert wie `true`, außer dass die entsprechenden Sourcemap-Kommentare in den gebündelten Dateien unterdrückt werden.

## build.rollupOptions

- **Typ:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

Direktes Anpassen des zugrunde liegenden Rollup-Bündels. Dies entspricht den Optionen, die aus einer Rollup-Konfigurationsdatei exportiert werden können, und wird mit den internen Rollup-Optionen von Vite zusammengeführt. Weitere Details finden Sie in den [Rollup-Optionen-Dokumenten](https://rollupjs.org/configuration-options/).

## build.commonjsOptions

- **Typ:** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

Optionen, die an [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs) übergeben werden sollen.

## build.dynamicImportVarsOptions

- **Typ:** [`RollupDynamicImportVarsOptions`](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#options)
- **Verwandt:** [Dynamisches Importieren](/guide/features#dynamisches-importieren)

Optionen, die an [@rollup/plugin-dynamic-import-vars](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars) übergeben werden sollen.

## build.lib

- **Typ:** `{ entry: string | string[] | { [entryAlias: string]: string }, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat, entryName: string) => string), cssFileName?: string }`
- **Verwandt:** [Library-Modus](/guide/build#library-mode)

Als Bibliothek erstellen. `entry` ist erforderlich, da die Bibliothek HTML nicht als Eintrag verwenden kann. `name` ist die exponierte globale Variable und erforderlich, wenn `formats` `'umd'` oder `'iife'` enthält. Die Standardformate sind `['es', 'umd']` oder `['es', 'cjs']`, wenn mehrere Einträge verwendet werden.

`fileName` ist der Name der ausgegebenen Paketdatei, der standardmäßig dem `"name"` in `package.json` entspricht. Er kann auch als Funktion definiert werden, die `format` und `entryName` als Argumente übernimmt und den Dateinamen zurückgibt.

Wenn Ihr Paket CSS importiert, kann „cssFileName“ verwendet werden, um den Namen der CSS-Datei-Ausgabe anzugeben. Der Standardwert ist derselbe wie „fileName“, wenn dieser als Zeichenfolge festgelegt ist, andernfalls wird ebenfalls auf „name“ in „package.json“ zurückgegriffen.

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: ['src/main.js'],
      fileName: (format, entryName) => `my-lib-${entryName}.${format}.js`,
      cssFileName: 'my-lib-style',
    },
  },
})
```

## build.manifest

- **Typ:** `boolean | string`
- **Standard:** `false`
- **Verwandt:** [Backend-Integration](/guide/backend-integration)

Legt fest, ob eine Manifestdatei erstellt werden soll, die eine Zuordnung von nicht gehashten Dateinamen von Assets zu ihren gehashten Versionen enthält, die dann von einem Server-Framework verwendet werden kann, um die richtigen Asset-Links zu rendern.

Wenn der Wert eine Zeichenfolge ist, wird er als Manifestdateipfad relativ zu `build.outDir` verwendet. Bei der Einstellung `true` lautet der Pfad `.vite/manifest.json`.

## build.ssrManifest

- **Typ:** `boolean | string`
- **Standard:** `false`
- **Verwandt:** [Server-seitiges Rendern](/guide/ssr)

Legt fest, ob eine SSR-Manifestdatei zur Bestimmung von Stilverknüpfungen und Anweisungen zum Vorladen von Assets in der Produktion generiert werden soll.

Wenn der Wert eine Zeichenfolge ist, wird er als Manifestdateipfad relativ zu `build.outDir` verwendet. Bei der Einstellung `true` lautet der Pfad `.vite/ssr-manifest.json`.

## build.ssr

- **Typ:** `boolean | string`
- **Standard:** `false`
- **Verwandt:** [Server-seitiges Rendern](/guide/ssr)

Erzeugen Sie einen build, der für serverseitiges Rendern (SSR) geeignet ist. Der Wert kann eine Zeichenkette sein, um das SSR-Eingabeziel direkt anzugeben, oder `true`,

was erfordert, dass das SSR-Eingabeziel über `rollupOptions.input` festgelegt wird.

## build.ssrEmitAssets

- **Typ:** `boolean`
- **Standard:** `false`

Während des SSR-Builds werden statische Assets nicht ausgegeben, da davon ausgegangen wird, dass sie als Teil des Client-Builds ausgegeben werden. Mit dieser Option können Frameworks die Ausgabe sowohl im Client- als auch im SSR-Build erzwingen. Es liegt in der Verantwortung des Frameworks, die Assets in einem Post-Build-Schritt zusammenzuführen.

## build.minify

- **Typ:** `boolean | 'terser' | 'esbuild'`
- **Standard:** 'esbuild' für Client-Build, 'false' für SSR-Build

Setzen Sie dies auf `false`, um die Minimierung zu deaktivieren, oder geben Sie den Minimierer an, der verwendet werden soll. Die Standardeinstellung ist [esbuild](https://github.com/evanw/esbuild), das 20 ~ 40x schneller als terser ist und nur eine 1 ~ 2% schlechtere Komprimierung bietet. [Benchmarks](https://github.com/privatenumber/minification-benchmarks)

Beachten Sie, dass die Option `build.minify` keine Leerzeichen minimiert, wenn das Format `'es'` im Lib-Modus verwendet wird, da es reine Anmerkungen entfernt und Tree-Shaking bricht.

Terser muss installiert sein, wenn es auf `'terser'` eingestellt ist.

```sh
npm add -D terser
```

## build.terserOptions

- **Typ:** `TerserOptions`

Zusätzliche [Minimierungsoptionen](https://terser.org/docs/api-reference#minify-options), die an Terser übergeben werden sollen.

Darüber hinaus können Sie auch die Option „maxWorkers: number“ übergeben, um die maximale Anzahl der zu erzeugenden Worker anzugeben. Der Standardwert ist die Anzahl der CPUs - 1.

## build.write

- **Typ:** `boolean`
- **Standard:** `true`

Setzen Sie dies auf `false`, um das Bündel nicht auf die Festplatte zu schreiben. Dies wird hauptsächlich bei [programmatischen `build()`-Aufrufen](/guide/api-javascript#build) verwendet, bei denen das Bündel vor dem Schreiben auf die Festplatte weiterverarbeitet werden muss.

## build.emptyOutDir

- **Typ:** `boolean`
- **Standard:** `true`, wenn `outDir` im `root` liegt

Standardmäßig leert Vite das `outDir` beim Build, wenn es sich im Projektstamm befindet. Es wird eine Warnung ausgegeben, wenn `outDir` außerhalb des `root` liegt, um das versehentliche Löschen wichtiger Dateien zu vermeiden. Sie können diese Option explizit setzen, um die Warnung zu unterdrücken. Dies ist auch über die Befehlszeile als `--emptyOutDir` verfügbar.

## build.copyPublicDir

- **Typ:** `boolean`
- **Standard:** `true`

Standardmäßig kopiert Vite Dateien aus dem `publicDir` in das `outDir` beim Build. Setzen Sie dies auf `false`, um dies zu deaktivieren.

## build.reportCompressedSize

- **Typ:** `boolean`
- **Standard:** `true`

Aktivieren/Deaktivieren der Berichterstellung über die Größe der gzip-komprimierten Dateien. Das Komprimieren großer Ausgabedateien kann langsam sein, daher kann das Deaktivieren dieser Option die Build-Leistung für große Projekte erhöhen.

## build.chunkSizeWarningLimit

- **Typ:** `number`
- **Standard:** `500`

Begrenzung für die Größe von Chunk-Warnungen (in kB). Sie wird mit der unkomprimierten Chunk-Größe verglichen, da die [JavaScript-Größe selbst mit der Ausführungszeit zusammenhängt](https://v8.dev/blog/cost-of-javascript-2019).

## build.watch

- **Typ:** [`WatcherOptions`](https://rollupjs.org/configuration-options/#watch)`| null`
- **Standard:** `null`

Setzen Sie dies auf `{}`, um den Rollup-Watcher zu aktivieren. Dies wird hauptsächlich in Fällen verwendet, die Build-only-Plugins oder Integrationsprozesse involvieren.

::: warning Verwendung von Vite unter WSL2

Es gibt Fälle, in denen das Dateisystem-Watching nicht mit WSL2 funktioniert. Weitere Details finden Sie unter [`server.watch`](./server-options.md#server-watch).

:::
