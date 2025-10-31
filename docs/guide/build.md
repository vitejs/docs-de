# Erstellung für die Produktion

Wenn es Zeit ist, Ihre App für die Produktion bereitzustellen, führen Sie einfach den Befehl `vite build` aus. Standardmäßig verwendet er `<root>/index.html` als den Einstiegspunkt für den Build und erzeugt ein Anwendungsbündel, das sich für die Bereitstellung über einen statischen Hosting-Dienst eignet. Werfen Sie einen Blick auf die [Bereitstellung einer statischen Website](./static-deploy) für Anleitungen zu beliebten Diensten.

## Browserkompatibilität

Standardmäßig setzt das Produktionsbündel die Unterstützung für modernes JavaScript voraus, inklusive [nativer ES-Module](https://caniuse.com/es6-module), [nativem ESM-Dynamic-Import](https://caniuse.com/es6-module-dynamic-import) und [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta), [Null-Koaleszenz](https://caniuse.com/mdn-javascript_operators_nullish_coalescing), und [BigInt](https://caniuse.com/bigint). Der Standardbereich für unterstützte Browser ist:

<!-- Suche nach der `ESBUILD_MODULES_TARGET` Konstante für mehr Informationen -->

- Chrome >=87
- Firefox >=78
- Safari >=14
- Edge >=88

Sie können benutzerdefinierte Ziele über die [`build.target` Konfigurationsoption](/config/build-options.md#build-target) festlegen, wobei das niedrigste Ziel `es2015` ist. Wenn ein niedrigeres Ziel festgelegt wird, benötigt Vite dennoch die Mindestanforderungen an die Browserunterstützung, da es auf den [nativen, dynamischen ESM-Import](https://caniuse.com/es6-module-dynamic-import) und [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta) angewiesen ist:

<!-- Suche nach der `defaultEsbuildSupported` Konstante für mehr Informationen -->

- Chrome >=64
- Firefox >=67
- Safari >=11.1
- Edge >=79

Beachten Sie, dass Vite standardmäßig nur Syntaxtransformationen verarbeitet und **keine Polyfills** abdeckt. Sie könnten zum Beispiel https://cdnjs.cloudflare.com/polyfill/, um automatisch Polyfill-Bundles auf Grundlage des UserAgent-Strings des Browsers des Nutzers zu generieren.

Ältere Browser können über [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) unterstützt werden, der automatisch Legacy-Chunks und entsprechende Polyfills für ES-Sprachfunktionen generiert. Die Legacy-Chunks werden nur in Browsern geladen, die keine native Unterstützung für ESM haben.

## Öffentlicher Basispfad

- Verwandt: [Asset-Verarbeitung](./assets)

Wenn Sie Ihr Projekt unter einem verschachtelten öffentlichen Pfad bereitstellen, geben Sie einfach die [`base` Konfigurationsoption](/config/shared-options.md#base) an, und alle Asset-Pfade werden entsprechend umgeschrieben. Diese Option kann auch als Befehlszeilenflagge angegeben werden, z. B. `vite build --base=/mein/öffentlicher/pfad/`.

JS-importierte Asset-URLs, CSS-`url()`-Verweise und Asset-Verweise in Ihren `.html`-Dateien werden während des Builds automatisch angepasst, um diese Option zu respektieren.

Die Ausnahme ist, wenn Sie URLs dynamisch konkatentieren müssen. In diesem Fall können Sie die global injizierte Variable `import.meta.env.BASE_URL` verwenden, die der öffentliche Basispfad sein wird. Beachten Sie, dass diese Variable während des Builds statisch ersetzt wird und daher genau so erscheinen muss, wie sie ist (d. h. `import.meta.env['BASE_URL']` funktioniert nicht).

Für erweiterte Steuerung des Basispfads siehe [Erweiterte Basisoptionen](#erweiterte-basisoptionen).

## Anpassen des Builds

Der Build kann über verschiedene [Build-Konfigurationsoptionen](/config/build-options.md) angepasst werden. Konkret können Sie die zugrunde liegenden [Rollup-Optionen](https://rollupjs.org/configuration-options/) direkt über `build.rollupOptions` anpassen:

```js [vite.config.js]
export default defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
    },
  },
})
```

Sie können beispielsweise mehrere Rollup-Ausgaben mit Plugins spezifizieren, die nur während des Builds angewendet werden.

## Chunking-Strategie

Sie können konfigurieren, wie Chunks aufgeteilt werden, indem Sie `build.rollupOptions.output.manualChunks` verwenden (siehe [Rollup docs](https://rollupjs.org/configuration-options/#output-manualchunks)). Wenn Sie ein Framework verwenden, lesen Sie dessen Dokumentation, um zu konfigurieren, wie Chunks aufgeteilt werden.

## Fehlerbehandlung beim Laden

Vite gibt das Ereignis `vite:preloadError` aus, wenn das Laden dynamischer Importe fehlschlägt. `event.payload` enthält den ursprünglichen Importfehler. Wenn Sie `event.preventDefault()` aufrufen, wird der Fehler nicht ausgelöst.

```js
window.addEventListener('vite:preloadError', (event) => {
  window.location.reload() // for example, refresh the page
})
```

When a new deployment occurs, the hosting service may delete the assets from previous deployments. As a result, a user who visited your site before the new deployment might encounter an import error. This error happens because the assets running on that user's device are outdated and it tries to import the corresponding old chunk, which is deleted. This event is useful for addressing this situation.

## Neuerstellen bei Dateiänderungen

Sie können den Rollup Watcher mit `vite build --watch` aktivieren. Oder Sie können die zugrundeliegenden [`WatcherOptions`](https://rollupjs.org/configuration-options/#watch) direkt über `build.watch` anpassen:

```js [vite.config.js]
export default defineConfig({
  build: {
    watch: {
      // https://rollupjs.org/configuration-options/#watch
    },
  },
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

```js twoslash [vite.config.js]
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html'),
      },
    },
  },
})
```

Wenn Sie einen anderen Root angeben, denken Sie daran, dass `__dirname` immer der Ordner Ihrer vite.config.js-Datei ist, wenn die Eingabepfade aufgelöst werden. Daher müssen Sie Ihren `root`-Eintrag den Argumenten für `resolve` hinzufügen.

Beachten Sie, dass Vite für HTML-Dateien den Namen des Eintrags im Objekt `rollupOptions.input` ignoriert und stattdessen die aufgelöste ID der Datei respektiert, wenn das HTML-Asset im dist-Ordner generiert wird. Dies stellt eine konsistente Struktur mit der Funktionsweise des Entwicklungsservers sicher.

## Bibliotheksmodus

Wenn Sie eine auf den Browser ausgerichtete Bibliothek entwickeln, verbringen Sie wahrscheinlich die meiste Zeit auf einer Test-/Demo-Seite, die Ihre eigentliche Bibliothek importiert. Mit Vite können Sie Ihre `index.html` für diesen Zweck verwenden, um ein reibungsloses Entwicklungserlebnis zu erhalten.

Wenn es Zeit ist, Ihre Bibliothek für die Verteilung zu bündeln, verwenden Sie die [`build.lib`-Konfigurationsoption](/config/build-options.md#build-lib). Stellen Sie sicher, dass Sie auch Abhängigkeiten externisieren, die Sie nicht in Ihre Bibliothek bündeln möchten, z. B. `vue` oder `react`:

```js twoslash [vite.config.js]
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      // Kann auch ein Dictionary oder ein Array von mehreren Einstiegspunkten sein
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'MyLib',
      // Die richtigen Dateierweiterungen werden hinzugefügt
      fileName: 'my-lib',
    },
    rollupOptions: {
      // Stellen Sie sicher, dass Abhängigkeiten, die nicht in Ihre Bibliothek gebündelt werden sollen, externisiert werden
      external: ['vue'],
      output: {
        // Stellen Sie globale Variablen für die Verwendung im UMD-Build bereit
        // für externalisierte Abhängigkeiten
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```

```js twoslash [vite.config.js (mehrere Einstiegspunkte)]
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: {
        'my-lib': resolve(__dirname, 'lib/main.js'),
        secondary: resolve(__dirname, 'lib/secondary.js'),
      },
      name: 'MyLib',
    },
    rollupOptions: {
      // Stellen Sie sicher, dass Abhängigkeiten, die nicht in Ihre Bibliothek gebündelt werden sollen, externisiert werden
      external: ['vue'],
      output: {
        // Stellen Sie globale Variablen für die Verwendung im UMD-Build bereit
        // für externalisierte Abhängigkeiten
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```

Die Eingabedatei enthält Exporte, die von Benutzern Ihres Pakets importiert werden können:

```js [lib/main.js]
import Foo from './Foo.vue'
import Bar from './Bar.vue'
export { Foo, Bar }
```

Wenn Sie `vite build` mit dieser Konfiguration ausführen, wird eine Rollup-Voreinstellung verwendet, die auf die Auslieferung von Bibliotheken ausgerichtet ist und zwei Bundle-Formate erzeugt:

- `es` und `umd` (für einen einzelnen Eintrag)
- `es` und `cjs` (für mehrere Einträge)

Die Formate können mit der Option [„build.lib.formats“](/config/build-options.md#build-lib) konfiguriert werden.

```
$ vite build
building for production...
dist/my-lib.js      0.08 kB / gzip: 0.07 kB
dist/my-lib.umd.cjs 0.30 kB / gzip: 0.16 kB
```

Empfohlenes `package.json` für Ihre Bibliothek:

```json [package.json]
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

```json [package.json]
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

:::

### CSS-Unterstützung

Wenn Ihre Bibliothek CSS importiert, wird es neben den erstellten JS-Dateien als einzelne CSS-Datei gebündelt, z. B. `dist/my-lib.css`. Der Name lautet standardmäßig `build.lib.fileName`, kann aber auch mit [`build.lib.cssFileName`](/config/build-options.md#build-lib) geändert werden.

Sie können die CSS-Datei in Ihrer `package.json` exportieren, damit sie von Benutzern importiert werden kann:

```json {12}
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
    },
    "./style.css": "./dist/my-lib.css"
  }
}
```

::: tip File Extensions
If the `package.json` does not contain `"type": "module"`, Vite will generate different file extensions for Node.js compatibility. `.js` will become `.mjs` and `.cjs` will become `.js`.
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

A single static [base](#public-base-path) isn't enough in these scenarios. Vite provides experimental support for advanced base options during build, using `experimental.renderBuiltUrl`.

```ts twoslash
import type { UserConfig } from 'vite'
const config: UserConfig = {
  experimental: {
    renderBuiltUrl(
      filename: string,
      { hostType }: { hostType: 'js' | 'css' | 'html' }
    ) {
      if (hostType === 'js') {
        return { runtime: `window.__toCdnUrl(${JSON.stringify(filename)})` }
      } else {
        return { relative: true }
      }
    },
  },
}
```

Wenn die gehashten Assets und öffentlichen Dateien nicht gemeinsam bereitgestellt werden, können für jede Gruppe unabhängig Optionen mit dem Assettyp in der zweiten `context`-Parameter gegebenen `renderBuiltUrl`-Funktion definiert werden.

```ts twoslash
import type { UserConfig } from 'vite'
import path from 'node:path'

const config: UserConfig = {
// ---cut-before---
experimental: {
  renderBuiltUrl(filename, { hostId, hostType, type }) {
    if (type === 'public') {
      return 'https://www.domain.com/' + filename
    } else if (path.extname(hostId) === '.js') {
      return {
        runtime: `window.__assetsPath(${JSON.stringify(filename)})`
      }
    } else {
      return 'https://cdn.domain.com/assets/' + filename
    }
  },
},
// ---cut-after---
}
```

Note that the `filename` passed is a decoded URL, and if the function returns a URL string, it should also be decoded. Vite will handle the encoding automatically when rendering the URLs. If an object with `runtime` is returned, encoding should be handled yourself where needed as the runtime code will be rendered as is.
