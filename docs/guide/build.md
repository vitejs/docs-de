# Erstellung für die Produktion

Wenn es Zeit ist, Ihre App für die Produktion bereitzustellen, führen Sie einfach den Befehl `vite build` aus. Standardmäßig verwendet er `<root>/index.html` als den Einstiegspunkt für den Build und erzeugt ein Anwendungsbündel, das sich für die Bereitstellung über einen statischen Hosting-Dienst eignet. Werfen Sie einen Blick auf die [Bereitstellung einer statischen Website](./static-deploy) für Anleitungen zu beliebten Diensten.

## Browserkompatibilität

Das Produktionsbündel setzt die Unterstützung für modernes JavaScript voraus. Standardmäßig richtet Vite sich an Browser, die die [nativen ES-Module](https://caniuse.com/es6-module), [nativen ESM-Dynamic-Import](https://caniuse.com/es6-module-dynamic-import) und [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta) unterstützen:

- Chrome >=87
- Firefox >=78
- Safari >=14
- Edge >=88

Sie können benutzerdefinierte Ziele über die [`build.target` Konfigurationsoption](/config/build-options.md#build-target) festlegen, wobei das niedrigste Ziel `es2015` ist.

Beachten Sie, dass Vite standardmäßig nur Syntaxumwandlungen behandelt und **keine Polyfills abdeckt**. Sie können sich [Polyfill.io](https://polyfill.io/) ansehen, einen Dienst, der automatisch Polyfill-Bündel basierend auf dem UserAgent-String des Browsers des Benutzers generiert.

Ältere Browser können über [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) unterstützt werden, der automatisch Legacy-Chunks und entsprechende Polyfills für ES-Sprachfunktionen generiert. Die Legacy-Chunks werden nur in Browsern geladen, die keine native Unterstützung für ESM haben.

## Öffentlicher Basispfad

- Verwandt: [Asset-Verarbeitung](./assets)

Wenn Sie Ihr Projekt unter einem verschachtelten öffentlichen Pfad bereitstellen, geben Sie einfach die [`base` Konfigurationsoption](/config/shared-options.md#base) an, und alle Asset-Pfade werden entsprechend umgeschrieben. Diese Option kann auch als Befehlszeilenflagge angegeben werden, z. B. `vite build --base=/mein/öffentlicher/pfad/`.

JS-importierte Asset-URLs, CSS-`url()`-Verweise und Asset-Verweise in Ihren `.html`-Dateien werden während des Builds automatisch angepasst, um diese Option zu respektieren.

Die Ausnahme ist, wenn Sie URLs dynamisch konkatentieren müssen. In diesem Fall können Sie die global injizierte Variable `import.meta.env.BASE_URL` verwenden, die der öffentliche Basispfad sein wird. Beachten Sie, dass diese Variable während des Builds statisch ersetzt wird und daher genau so erscheinen muss, wie sie ist (d. h. `import.meta.env['BASE_URL']` funktioniert nicht).

Für erweiterte Steuerung des Basispfads siehe [Erweiterte Basisoptionen](#erweiterte-basisoptionen).

## Anpassen des Builds

Der Build kann über verschiedene [Build-Konfigurationsoptionen](/config/build-options.md) angepasst werden. Konkret können Sie die zugrunde liegenden [Rollup-Optionen](https://rollupjs.org/configuration-options/) direkt über `build.rollupOptions` anpassen:

```js
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
    }
  }
})
```

Sie können beispielsweise mehrere Rollup-Ausgaben mit Plugins spezifizieren, die nur während des Builds angewendet werden.

## Chunking-Strategie

Sie können konfigurieren, wie Chunks aufgeteilt werden, indem Sie `build.rollupOptions.output.manualChunks` verwenden (siehe [Rollup-Dokumentation](https://rollupjs.org/configuration-options/#output-manualchunks)). Bis Vite 2.8 teilte die standardmäßige Chunking-Strategie die Chunks in `index` und `vendor` auf. Dies ist eine gute Strategie für einige SPAs, aber es ist schwer, eine allgemeine Lösung für jeden Vite-Zielfall anzubieten. Ab Vite 2.9 wird `manualChunks` standardmäßig nicht mehr geändert. Sie können die Strategie zum Aufteilen des Vendor-Chunks weiterhin verwenden, indem Sie das `splitVendorChunkPlugin` in Ihrer Konfigurationsdatei hinzufügen:

```js
// vite.config.js
import { splitVendorChunkPlugin } from 'vite'
export default defineConfig({
  plugins: [splitVendorChunkPlugin()]
})
```

Diese Strategie wird auch als `splitVendorChunk({ cache: SplitVendorChunkCache })`-Factory bereitgestellt, falls eine Kombination mit benutzerdefinierter Logik erforderlich ist. In diesem Fall muss `cache.reset()` bei `buildStart` aufgerufen werden, damit der Build-Watch-Modus in diesem Fall korrekt funktioniert.

::: warning
Verwenden Sie die Funktion `build.rollupOptions.output.manualChunks`, falls Sie dieses Plugin verwenden. Wenn die Objektform verwendet wird, hat das Plugin keine Wirkung.
:::

## Fehlerbehandlung beim Laden

Vite gibt das Ereignis `vite:preloadError` aus, wenn das Laden dynamischer Importe fehlschlägt. `event.payload` enthält den ursprünglichen Importfehler. Wenn Sie `event.preventDefault()` aufrufen, wird der Fehler nicht ausgelöst.

```js
window.addEventListener('vite:preloadError', (event) => {
  window.reload() // for example, refresh the page
})
```

When a new deployment occurs, the hosting service may delete the assets from previous deployments. As a result, a user who visited your site before the new deployment might encounter an import error. This error happens because the assets running on that user's device are outdated and it tries to import the corresponding old chunk, which is deleted. This event is useful for addressing this situation.

## Neuerstellen bei Dateiänderungen

Sie können den Rollup Watcher mit `vite build --watch` aktivieren. Oder Sie können die zugrundeliegenden [`WatcherOptions`](https://rollupjs.org/configuration-options/#watch) direkt über `build.watch` anpassen:

```js
// vite.config.js
export default defineConfig({
  build: {
    watch: {
      // https://rollupjs.org/configuration-options/#watch
    }
  }
})
```

Mit der `--watch`-Flag aktiviert, führen Änderungen an der `vite.config.js`, sowie an allen zu bündelnden Dateien, zu einer Neukompilierung.

## Multi-Page-App

Angenommen, Sie haben folgende Quellcodestruktur:

```
├── package.json
├── vite.config.js
├── index.html
├── main.js
└── nested
    ├── index.html
    └── nested.js
```

Während der Entwicklung navigieren oder verlinken Sie einfach zu `/nested/` - es funktioniert wie erwartet, genauso wie für einen normalen statischen Dateiserver.

Während des Builds müssen Sie nur mehrere `.html`-Dateien als Einstiegspunkte angeben:

```js
// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html')
      }
    }
  }
})
```

Wenn Sie einen anderen Root angeben, denken Sie daran, dass `__dirname` immer der Ordner Ihrer vite.config.js-Datei ist, wenn die Eingabepfade aufgelöst werden. Daher müssen Sie Ihren `root`-Eintrag den Argumenten für `resolve` hinzufügen.

Beachten Sie, dass Vite für HTML-Dateien den Namen des Eintrags im Objekt `rollupOptions.input` ignoriert und stattdessen die aufgelöste ID der Datei respektiert, wenn das HTML-Asset im dist-Ordner generiert wird. Dies stellt eine konsistente Struktur mit der Funktionsweise des Entwicklungsservers sicher.

## Bibliotheksmodus

Wenn Sie eine auf den Browser ausgerichtete Bibliothek entwickeln, verbringen Sie wahrscheinlich die meiste Zeit auf einer Test-/Demo-Seite, die Ihre eigentliche Bibliothek importiert. Mit Vite können Sie Ihre `index.html` für diesen Zweck verwenden, um ein reibungsloses Entwicklungserlebnis zu erhalten.

Wenn es Zeit ist, Ihre Bibliothek für die Verteilung zu bündeln, verwenden Sie die [`build.lib`-Konfigurationsoption](/config/build-options.md#build-lib). Stellen Sie sicher, dass Sie auch Abhängigkeiten externisieren, die Sie nicht in Ihre Bibliothek bündeln möchten, z. B. `vue` oder `react`:

```js
// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      // Kann auch ein Dictionary oder ein Array von mehreren Einstiegspunkten sein
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'MyLib',
      // Die richtigen Dateierweiterungen werden hinzugefügt
      fileName: 'my-lib'
    },
    rollupOptions: {
      // Stellen Sie sicher, dass Abhängigkeiten, die nicht in Ihre Bibliothek gebündelt werden sollen, externisiert werden
      external: ['vue'],
      output: {
        // Stellen Sie globale Variablen für die Verwendung im UMD-Build bereit
        // für externalisierte Abhängigkeiten
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
```

Die Eingabedatei enthält Exporte, die von Benutzern Ihres Pakets importiert werden können:

```js
// lib/main.js
import Foo from './Foo.vue'
import Bar from './Bar.vue'
export { Foo, Bar }
```

Die Ausführung von `vite build` mit dieser Konfiguration verwendet ein Rollup-Preset, das auf die Bereitstellung von Bibliotheken ausgerichtet ist und zwei Bündelformate erstellt: `es` und `umd` (konfigurierbar über `build.lib`):

```
$ vite build
building for production...
dist/my-lib.js      0.08 kB / gzip: 0.07 kB
dist/my-lib.umd.cjs 0.30 kB / gzip: 0.16 kB
```

Empfohlenes `package.json` für Ihre Bibliothek:

```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    }
  }
}
```

Oder, wenn mehrere Einstiegspunkte freigegeben werden:

```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.cjs"
    },
    "./secondary": {
      "import": "./dist/secondary.js",
      "require": "./dist/secondary.cjs"
    }
  }
}
```

::: tip Dateierweiterungen
Wenn die `package.json` nicht `"type": "module"` enthält, generiert Vite unterschiedliche Dateierweiterungen für Node.js-Kompatibilität. `.js` wird zu `.mjs` und `.cjs` wird zu `.js`.
:::

::: tip Umgebungsvariablen
Im Bibliotheksmodus werden alle Verwendungen von [`import.meta.env.*`](./env-and-mode.md) statisch ersetzt, wenn sie für die Produktion erstellt wurden. Die Verwendung von `process.env.*` wird jedoch nicht ersetzt, so dass die Nutzer Ihrer Bibliothek diese dynamisch ändern können. Wenn dies unerwünscht ist, können Sie `define: { 'process.env.NODE_ENV': '"production"' }` setzen, um sie statisch zu ersetzen, oder [`esm-env`](https://github.com/benmccann/esm-env) für eine bessere Kompatibilität mit Bundlern und Laufzeiten verwenden.
:::

::: warning Erweiterte Verwendung
Der Bibliotheksmodus enthält eine einfache und vorgegebene Konfiguration für browserorientierte und JS-Framework-Bibliotheken. Wenn Sie nicht browserorientierte Bibliotheken erstellen oder erweiterte Build-Workflows benötigen, können Sie [Rollup](https://rollupjs.org) oder [esbuild](https://esbuild.github.io) direkt verwenden.
:::

## Erweiterte Basisoptionen

::: warning
Diese Funktion ist experimentell. [Feedback geben](https://github.com/vitejs/vite/discussions/13834).
:::

Für fortgeschrittene Anwendungsfälle können die bereitgestellten Assets und öffentlichen Dateien in unterschiedlichen Pfaden liegen, um z.B. verschiedene Caching-Strategien zu verwenden. Ein Benutzer kann wählen, in drei verschiedenen Pfaden bereitzustellen:

- Die generierten Einstiegs-HTML-Dateien (die während SSR verarbeitet werden können)
- Die generierten gehashten Assets (JS, CSS und andere Dateitypen wie Bilder)
- Die kopierten [öffentlichen Dateien](assets.md#the-public-directory)

Ein einziger statischer [Basispfad](#public-base-path) reicht in diesen Szenarien nicht aus. Vite bietet experimentelle Unterstützung für erweiterte Basisoptionen während des Builds, die `experimental.renderBuiltUrl` verwenden.

```ts
experimental: {
  renderBuiltUrl(filename: string, { hostType }: { hostType: 'js' | 'css' | 'html' }) {
    if (hostType === 'js') {
      return { runtime: `window.__toCdnUrl(${JSON.stringify(filename)})` }
    } else {
      return { relative: true }
    }
  }
}
```

Wenn die gehashten Assets und öffentlichen Dateien nicht gemeinsam bereitgestellt werden, können für jede Gruppe unabhängig Optionen mit dem Assettyp in der zweiten `context`-Parameter gegebenen `renderBuiltUrl`-Funktion definiert werden.

```ts
experimental: {
  renderBuiltUrl(filename: string, { hostId, hostType, type }: { hostId: string, hostType: 'js' | 'css' | 'html', type: 'public' | 'asset' }) {
    if (type === 'public') {
      return 'https://www.domain.com/' + filename
    }
    else if (path.extname(hostId) === '.js') {
      return { runtime: `window.__assetsPath(${JSON.stringify(filename)})` }
    }
    else {
      return 'https://cdn.domain.com/assets/' + filename
    }
  }
}
```
