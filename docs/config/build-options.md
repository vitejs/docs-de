# Build-Optionen

## build.target

- **Typ:** `string | string[]`
- **Standard:** `'modules'`
- **Verwandt:** [Browser-Kompatibilität](/guide/build#browser-compatibility)

Ziel für die Browserkompatibilität des finalen Bündels. Der Standardwert ist ein spezieller Wert von Vite, `'modules'`, der auf Browser abzielt, die [native ES-Module](https://caniuse.com/es6-module), [native ESM dynamic import](https://caniuse.com/es6-module-dynamic-import) und Unterstützung für [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta) haben. Vite ersetzt `'modules'` durch `['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14']`.

Ein weiterer spezieller Wert ist `'esnext'`, der von nativer Unterstützung für dynamisches Importieren ausgeht und so wenig wie möglich transpiliert:

- Wenn die [`build.minify`](#build-minify)-Option `'terser'` ist und die installierte Terser-Version unter 5.16.0 liegt, wird `'esnext'` auf `'es2021'` erzwungen.
- In anderen Fällen wird überhaupt keine Transpilierung durchgeführt.

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
    importer: string
  },
) => string[]
```

Die `resolveDependencies`-Funktion wird für jedes dynamische Importieren mit einer Liste der Chunks, von denen es abhängt, aufgerufen, und sie wird auch für jeden in den Eingabe-HTML-Dateien importierten Chunk aufgerufen. Es kann ein neues Abhängigkeiten-Array zurückgegeben werden, das diese gefilterten oder weiteren Abhängigkeiten enthält und deren Pfade geändert wurden. Die Pfade in `deps` sind relativ zum `build.outDir`. Das Zurückgeben eines relativen Pfads zum `hostId` für `hostType === 'js'` ist erlaubt, in diesem Fall wird `new URL(dep, import.meta.url)` verwendet, um einen absoluten Pfad zu erhalten, wenn dieses Modul-Preload im HTML-Header eingefügt wird.

```js
modulePreload: {
  resolveDependencies: (filename, deps, { hostId, hostType }) => {
    return deps.filter(condition)
  }
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

- **Typ:** `number`
- **Standard:** `4096` (4 KiB)

Importierte oder referenzierte Assets, die kleiner als diese Schwelle sind, werden als base64-URLs eingebettet, um zusätzliche HTTP-Anfragen zu vermeiden. Setzen Sie `0`, um die Einbettung vollständig zu deaktivieren.

Git LFS-Platzhalter werden automatisch von der Einbettung ausgeschlossen, da sie den In

halt der Datei, die sie repräsentieren, nicht enthalten.

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
- **Standard:** dasselbe wie [`build.minify`](#build-minify)

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

- **Typ:** `{ entry: string | string[] | { [entryAlias: string]: string }, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat, entryName: string) => string) }`
- **Verwandt:** [Library-Modus](/guide/build#library-mode)

Bauen Sie als Bibliothek. `entry` ist erforderlich, da die Bibliothek HTML nicht als Eingabe verwenden kann. `name` ist die freigegebene globale Variable und ist erforderlich, wenn `formats` `'umd'` oder `'iife'` enthält. Die Standardformate sind `['es', 'umd']` oder `['es', 'cjs']`, wenn mehrere Eingaben verwendet werden. `fileName` ist der Name der Paketdatei-Ausgabe, standardmäßig ist `fileName` die Optionsnamen aus package.json, er kann auch als Funktion definiert werden, die `format` und `entryAlias` als Argumente akzeptiert.

## build.manifest

- **Typ:** `boolean | string`
- **Standard:** `false`
- **Verwandt:** [Backend-Integration](/guide/backend-integration)

Wenn auf `true` gesetzt, wird der Build auch eine `.vite/manifest.json`-Datei generieren, die eine Zuordnung von nicht gehashten Asset-Dateinamen zu ihren gehashten Versionen enthält, die dann von einem Server-Framework verwendet werden kann, um die richtigen Asset-Links zu rendern. Wenn der Wert eine Zeichenkette ist, wird er als Name der Manifestdatei verwendet.

## build.ssrManifest

- **Typ:** `boolean | string`
- **Standard:** `false`
- **Verwandt:** [Server-seitiges Rendern](/guide/ssr)

Wenn auf `true` gesetzt, wird der Build auch ein SSR-Manifest generieren, um Style-Links und Asset-Preload-Anweisungen in der Produktion zu bestimmen. Wenn der Wert eine Zeichenkette ist, wird er als Name der Manifestdatei verwendet.

## build.ssr

- **Typ:** `boolean | string`
- **Standard:** `false`
- **Verwandt:** [Server-seitiges Rendern](/guide/ssr)

Erzeugen Sie einen build, der für serverseitiges Rendern (SSR) geeignet ist. Der Wert kann eine Zeichenkette sein, um das SSR-Eingabeziel direkt anzugeben, oder `true`,

was erfordert, dass das SSR-Eingabeziel über `rollupOptions.input` festgelegt wird.

## build.ssrEmitAssets

- **Type:** `boolean`
- **Default:** `false`

During the SSR build, static assets aren't emitted as it is assumed they would be emitted as part of the client build. This option allows frameworks to force emitting them in both the client and SSR build. It is responsibility of the framework to merge the assets with a post build step.

## build.minify

- **Typ:** `boolean | 'terser' | 'esbuild'`
- **Standard:** `'esbuild'`

Setzen Sie auf `false`, um die Minimierung zu deaktivieren, oder geben Sie den Minimierer an, der verwendet werden soll. Die Standardeinstellung ist [esbuild](https://github.com/evanw/esbuild), das 20 ~ 40x schneller als terser ist und nur eine 1 ~ 2% schlechtere Komprimierung bietet. [Benchmarks](https://github.com/privatenumber/minification-benchmarks)

Beachten Sie, dass die Option `build.minify` keine Leerzeichen minimiert, wenn das Format `'es'` im Lib-Modus verwendet wird, da es reine Anmerkungen entfernt und Tree-Shaking bricht.

Terser muss installiert sein, wenn es auf `'terser'` eingestellt ist.

```sh
npm add -D terser
```

## build.terserOptions

- **Typ:** `TerserOptions`

Zusätzliche [Minimierungsoptionen](https://terser.org/docs/api-reference#minify-options), die an Terser übergeben werden sollen.

In addition, you can also pass a `maxWorkers: number` option to specify the max number of workers to spawn. Defaults to the number of CPUs minus 1.

## build.write

- **Typ:** `boolean`
- **Standard:** `true`

Setzen Sie auf `false`, um das Bündel nicht auf die Festplatte zu schreiben. Dies wird hauptsächlich bei [programmatischen `build()`-Aufrufen](/guide/api-javascript#build) verwendet, bei denen das Bündel vor dem Schreiben auf die Festplatte weiterverarbeitet werden muss.

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

::: warning Verwendung von Vite unter Windows Subsystem for Linux (WSL) 2

Es gibt Fälle, in denen das Dateisystem-Watching nicht mit WSL2 funktioniert. Weitere Details finden Sie unter [`server.watch`](./server-options.md#server-watch).

:::
