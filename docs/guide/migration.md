# Migration von v4

## Unterstützung für Node.js

Vite unterstützt nicht mehr Node.js 14 / 16 / 17 / 19, da diese das Ende ihrer Lebensdauer erreicht haben. Node.js 18 / 20+ ist nun erforderlich.

## Rollup 4

Vite verwendet nun Rollup 4, welches auch seine Änderungen mit sich bringt:

- Import Assertions (`assertions` prop) wurde umbenannt in Import Attributes (`attributes` prop).
- Acorn-Plugins werden nicht mehr unterstützt.
- Für Vite-Plugins ist die Option `this.resolve` `skipSelf` nun standardmäßig `true`.
- Für Vite-Plugins unterstützt `this.parse` jetzt nur noch die Option `allowReturnOutsideFunction`.

Lesen Sie die vollständigen Änderungen in [Rollup's release notes](https://github.com/rollup/rollup/releases/tag/v4.0.0) für Build-bezogene Änderungen in [`build.rollupOptions`](/config/build-options.md#build-rollupoptions).

Falls Sie TypeScript verwenden, dann stellen Sie sicher, dass Sie `moduleResolution: 'bundler'` (oder `node16`/`nodenext`) einstellen, da Rollup 4 dies erfordert. Alternativ können Sie stattdessen `skipLibCheck: true` einstellen.

## Veraltete CJS Node API

Die CJS-Node-API von Vite ist veraltet. Wenn Sie `require('vite')` aufrufen, wird nun eine Veraltungs-Warnung protokolliert. Sie sollten Ihre Dateien oder Frameworks aktualisieren, um stattdessen den ESM-Build von Vite zu importieren.

In einem einfachen Vite-Projekt stellen Sie sicher, dass:

1. Der Inhalt der Datei `vite.config.js` die ESM-Syntax verwendet.
2. Die nächstgelegene `package.json`-Datei, die `"type": "module"` enthält oder die Erweiterung `.mjs`/`.mts` verwendet, z.B. `vite.config.mjs` or `vite.config.mts`.

Für andere Projekte gibt es einige allgemeine Ansätze:

- **Konfigurieren Sie ESM als Standard und wählen Sie bei Bedarf CJS aus:** Fügen Sie `"type": "module"` in die `package.json` des Projekts hinzu. Alle `*.js`-Dateien werden jetzt als ESM interpretiert und müssen die ESM-Syntax verwenden. Sie können eine Datei mit der Erweiterung `.cjs` umbenennen, um weiterhin CJS zu verwenden.
- **Behalten Sie CJS als Standard und wählen Sie bei Bedarf ESM aus:** Wenn die `package.json` des Projekts nicht `"type": "module"` enthält, werden alle `*.js`-Dateien als CJS interpretiert. Sie können eine Datei mit der Erweiterung `.mjs` umbenennen, um stattdessen ESM zu verwenden.
- **Importieren Sie Vite dynamisch:** Wenn Sie weiterhin CJS verwenden müssen, können Sie Vite dynamisch mit `import('vite')` importieren. Dies erfordert, dass Ihr Code in einem `async`-Kontext geschrieben ist, sollte aber immer noch gut beherrschbar sein, da die Vite-API größtenteils asynchron ist.

Weitere Informationen finden Sie im [Leitfaden zur Problembehandlung](/guide/troubleshooting.html#vite-cjs-node-api-deprecated).

## Überarbeitung der `define` und `import.meta.env.*` Ersetzungsstrategie

In Vite 4 verwenden die Funktionen [`define`](/config/shared-options.md#define) und [`import.meta.env.*`](/guide/env-and-mode.md#env-variables) unterschiedliche Ersetzungsstrategien in dev und build:

- In dev werden beide Funktionen als globale Variablen in `globalThis` bzw. `import.meta` injiziert.
- In der Build-Version werden beide Merkmale statisch durch einen Regex ersetzt.

Dies führt zu einer Inkonsistenz zwischen Dev und Build, wenn man versucht, auf die Variablen zuzugreifen, und manchmal sogar zu fehlgeschlagenen Builds. Zum Beispiel:

```js
// vite.config.js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
})
```

```js
const data = { __APP_VERSION__ }
// dev: { __APP_VERSION__: "1.0.0" } ✅
// build: { "1.0.0" } ❌

const docs = 'I like import.meta.env.MODE'
// dev: "I like import.meta.env.MODE" ✅
// build: "I like "production"" ❌
```

Vite 5 behebt dies, indem `esbuild` die Ersetzungen in Builds handhabt, was dem Verhalten von Dev entspricht.

Diese Änderung sollte sich auf die meisten Setups nicht auswirken, da es bereits dokumentiert ist, dass `define`-Werte der Syntax von esbuild folgen sollten:

> Um mit dem esbuild-Verhalten konsistent zu sein, müssen Ausdrücke entweder ein JSON-Objekt (null, boolean, number, string, array, or object) oder ein einzelner Bezeichner sein.

Wenn Sie es jedoch vorziehen, Werte weiterhin statisch direkt zu ersetzen, können Sie [`@rollup/plugin-replace`](https://github.com/rollup/plugins/tree/master/packages/replace) verwenden.

## Allgemeine Änderungen

### Der Wert der externalisierten SSR-Module entspricht jetzt dem Produktionswert.

In Vite 4 werden externalisierte SSR-Module mit `.default` und `.__esModule` umhüllt, um die Interoperabilität zu verbessern. Dies entspricht jedoch nicht dem Verhalten in der Produktion, wenn sie von der Laufzeitumgebung (z.B. Node.js) geladen werden, was zu schwer zu fangenden Inkonsistenzen führt. Standardmäßig werden alle direkten Projektabhängigkeiten von SSR externalisiert.

Vite 5 entfernt nun die Handhabung von `.default` und `.__esModule`, um dem Produktionsverhalten zu entsprechen. In der Praxis sollte dies keine Auswirkungen auf ordnungsgemäß verpackte Abhängigkeiten haben, aber wenn Sie auf neue Probleme beim Laden von Modulen stoßen, können Sie diese Umstrukturierungen ausprobieren:

```js
// Before:
import { foo } from 'bar'

// After:
import _bar from 'bar'
const { foo } = _bar
```

```js
// Before:
import foo from 'bar'

// After:
import * as _foo from 'bar'
const foo = _foo.default
```

Beachten Sie, dass diese Änderungen dem Verhalten von Node.js entsprechen, so dass Sie die Importe auch in Node.js ausführen können, um sie zu testen. Wenn Sie es vorziehen, das bisherige Verhalten beizubehalten, können Sie `legacy.proxySsrExternalModules` auf `true` setzen.

### `worker.plugins` ist jetzt eine Funktion

In Vite 4 akzeptierte [`worker.plugins`](/config/worker-options.md#worker-plugins) ein Array von Plugins (`(Plugin | Plugin[])[]`). Ab Vite 5 muss sie als Funktion konfiguriert werden, die ein Array von Plugins zurückgibt (`() => (Plugin | Plugin[])[]`). Diese Änderung ist erforderlich, damit parallele Worker-Builds konsistenter und vorhersehbarer ablaufen.

### Pfad mit `.` kann jetzt auf index.html zurückfallen

In Vite 4 wurde beim Zugriff auf einen Pfad in dev, der `.` enthielt, nicht auf index.html zurückgegriffen, selbst wenn [`appType`](/config/shared-options.md#apptype) auf `'spa'` (Standard) gesetzt war. Ab Vite 5 wird es auf index.html zurückgreifen.

Beachten Sie, dass der Browser keine 404-Fehlermeldung mehr in der Konsole anzeigt, wenn Sie den Bildpfad auf eine nicht existierende Datei zeigen (z.B. `<img src="./file-does-not-exist.png">`).

### Angleichung des Verhaltens bei der HTML-Ausgabe von Dev und Preview

In Vite 4 servieren die Dev- und Preview-Server HTML auf der Grundlage der Verzeichnisstruktur und des abschließenden Schrägstrichs unterschiedlich. Dies führt zu Inkonsistenzen beim Testen Ihrer erstellten Anwendung. In Vite 5 wird das Verhalten bei folgender Dateistruktur in ein einziges Verhalten umgewandelt (siehe unten):

```
├── index.html
├── file.html
└── dir
    └── index.html
```

| Anfrage           | Vorher (dev)                 | Vorher (preview)  | Nachher (dev & preview)      |
| ----------------- | ---------------------------- | ----------------- | ---------------------------- |
| `/dir/index.html` | `/dir/index.html`            | `/dir/index.html` | `/dir/index.html`            |
| `/dir`            | `/index.html` (SPA fallback) | `/dir/index.html` | `/index.html` (SPA fallback) |
| `/dir/`           | `/dir/index.html`            | `/dir/index.html` | `/dir/index.html`            |
| `/file.html`      | `/file.html`                 | `/file.html`      | `/file.html`                 |
| `/file`           | `/index.html` (SPA fallback) | `/file.html`      | `/file.html`                 |
| `/file/`          | `/index.html` (SPA fallback) | `/file.html`      | `/index.html` (SPA fallback) |

### Manifestdateien werden standardmäßig im Verzeichnis `.vite` generiert

In Vite 4 wurden die Manifestdateien ([`build.manifest`](/config/build-options.md#build-manifest) und [`build.ssrManifest`](/config/build-options.md#build-ssrmanifest)) standardmäßig im Stammverzeichnis von [`build.outDir`](/config/build-options.md#build-outdir) erzeugt.

Ab Vite 5 werden sie standardmäßig im Verzeichnis `.vite` im `build.outDir` erzeugt. Diese Änderung trägt dazu bei, dass öffentliche Dateien mit denselben Manifest-Dateinamen nicht mehr in Konflikt geraten, wenn sie in das `build.outDir` kopiert werden.

### Entsprechende CSS-Dateien sind nicht als oberster Eintrag in der manifest.json-Datei aufgeführt

In Vite 4 wurde die entsprechende CSS-Datei für einen JavaScript-Einstiegspunkt auch als Top-Level-Eintrag in der Manifestdatei ([`build.manifest`](/config/build-options.md#build-manifest)) aufgeführt. Diese Einträge wurden unbeabsichtigt hinzugefügt und funktionierten nur in einfachen Fällen.

In Vite 5 sind die entsprechenden CSS-Dateien nur im Abschnitt der JavaScript-Eingabedatei zu finden.
Wenn die JS-Datei injiziert wird, sollten die entsprechenden CSS-Dateien [injiziert werden](/guide/backend-integration.md#:~:text=%3C!%2D%2D%20if%20production%20%2D%2D%3E%0A%3Clink%20rel%3D%22stylesheet%22%20href%3D%22/assets/%7B%7B%20manifest%5B%27main.js%27%5D.css%20%7D%7D%22%20/%3E%0A%3Cscript%20type%3D%22module%22%20src%3D%22/assets/%7B%7B%20manifest%5B%27main.js%27%5D.file%20%7D%7D%22%3E%3C/script%3E).
Wenn das CSS separat injiziert werden soll, muss es als separater Einstiegspunkt hinzugefügt werden.

### CLI-Verknüpfungen erfordern eine zusätzliche Eingabetaste

CLI-Verknüpfungen, wie z.B. `r`, um den Dev-Server neu zu starten, erfordern nun eine zusätzliche Eingabetaste, um die Verknüpfung auszulösen. Zum Beispiel `r + Enter`, um den Dev-Server neu zu starten.

Diese Änderung verhindert, dass Vite OS-spezifische Verknüpfungen verschluckt und steuert, was eine bessere Kompatibilität bei der Kombination des Vite-Dev-Servers mit anderen Prozessen ermöglicht und die [früheren Einschränkungen](https://github.com/vitejs/vite/pull/14342) vermeidet.

### Update `experimentalDecorators` und `useDefineForClassFields` TypeScript Verhalten

Vite 5 verwendet esbuild 0.19 und entfernt die Kompatibilitätsschicht für esbuild 0.18, was die Handhabung von [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators) und [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig#useDefineForClassFields) ändert.

- **`experimentalDecorators` ist standardmäßig nicht aktiviert**

  Sie müssen `compilerOptions.experimentalDecorators` in `tsconfig.json` auf `true` setzen, um Dekoratoren zu verwenden.

- **`useDefineForClassFields` Voreinstellungen hängen vom TypeScript `target` Wert ab**

  Wenn `target` nicht `ESNext` oder `ES2022` oder neuer ist, oder wenn es keine `tsconfig.json` Datei gibt, wird `useDefineForClassFields` standardmäßig auf `false` gesetzt, was mit dem Standard `esbuild.target` Wert von `esnext` problematisch sein kann. Es kann zu [statischen Initialisierungsblöcken](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks#browser_compatibility) transpilieren, was von Ihrem Browser möglicherweise nicht unterstützt wird.

  Es wird daher empfohlen, `target` auf `ESNext` oder `ES2022` oder neuer zu setzen, oder `useDefineForClassFields` explizit auf `true` zu setzen, wenn Sie `tsconfig.json` konfigurieren.

```jsonc
{
  "compilerOptions": {
    // Setzen Sie dies auf "true", wenn Sie Decorators verwenden
    "experimentalDecorators": true,
    // Setzen Sie dies auf "true", wenn Sie Parsing-Fehler in Ihrem Browser erhalten
    "useDefineForClassFields": true
  }
}
```

### Entfernen Sie `--https` und `https: true`.

Das `--https` Flag setzt intern `server.https: true` und `preview.https: true`. Diese Konfiguration war dafür gedacht, zusammen mit der automatischen https-Zertifizierungsfunktion verwendet zu werden, die [in Vite 3](https://v3.vitejs.dev/guide/migration.html#automatic-https-certificate-generation) eingestellt wurde. Daher ist diese Konfiguration nicht mehr nützlich, da sie einen Vite-HTTPS-Server ohne Zertifikat starten wird.

Wenn Sie [`@vitejs/plugin-basic-ssl`](https://github.com/vitejs/vite-plugin-basic-ssl) oder [`vite-plugin-mkcert`](https://github.com/liuweiGL/vite-plugin-mkcert) verwenden, setzen sie die `https`-Konfiguration bereits intern, so dass Sie `--https`, `server.https: true` und `preview.https: true` in Ihrem Setup entfernen können.

### `resolvePackageEntry` und `resolvePackageData` APIs entfernen

Die `resolvePackageEntry` und `resolvePackageData` APIs werden entfernt, da sie die Interna von Vite offenlegen und in der Vergangenheit potentielle Optimierungen von Vite 4.3 blockiert haben. Diese APIs können z.B. durch Pakete von Drittanbietern ersetzt werden:

- `resolvePackageEntry`: [`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) oder das Paket [`import-meta-resolve`](https://github.com/wooorm/import-meta-resolve).
- `resolvePackageData`: Dasselbe wie oben, und crawlen Sie das Paketverzeichnis, um die Wurzel `package.json` zu erhalten. Oder verwenden Sie das Gemeinschaftspaket [`vitefu`](https://github.com/svitejs/vitefu).

```js
import { resolve } from 'import-meta-env'
import { findDepPkgJsonPath } from 'vitefu'
import fs from 'node:fs'

const pkg = 'my-lib'
const basedir = process.cwd()

// `resolvePackageEntry`:
const packageEntry = resolve(pkg, basedir)

// `resolvePackageData`:
const packageJsonPath = findDepPkgJsonPath(pkg, basedir)
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
```

## Entfernte veraltete APIs

- Standardexports von CSS-Dateien (z.B. `import style from './foo.css'`): Verwenden Sie stattdessen die `?inline`-Query-Komponente
- `import.meta.globEager`: Verwenden Sie stattdessen `import.meta.glob('*', { eager: true })`
- `ssr.format: 'cjs`' und `legacy.buildSsrCjsExternalHeuristics` ([#13816](https://github.com/vitejs/vite/discussions/13816))
- `server.middlewareMode: 'ssr'` und `server.middlewareMode: 'html'`: Verwenden Sie stattdessen [`appType`](/config/shared-options.md#apptype) + [`server.middlewareMode: true`](/config/server-options.md#server-middlewaremode) ([#8452](https://github.com/vitejs/vite/pull/8452))

## Fortgeschrittene

Es gibt einige Änderungen, die nur Auswirkungen auf Plugin- oder Tool-Ersteller haben.

- [[#14119] refactor!: merge `PreviewServerForHook` into `PreviewServer` type](https://github.com/vitejs/vite/pull/14119)
  - The `configurePreviewServer` hook now accepts the `PreviewServer` type instead of `PreviewServerForHook` type.
- [[#14818] refactor(preview)!: use base middleware](https://github.com/vitejs/vite/pull/14818)
  - Middlewares added from the returned function in `configurePreviewServer` now does not have access to the `base` when comparing the `req.url` value. This aligns the behaviour with the dev server. You can check the `base` from the `configResolved` hook if needed.
- [[#14834] fix(types)!: expose httpServer with Http2SecureServer union](https://github.com/vitejs/vite/pull/14834)
  - `http.Server | http2.Http2SecureServer` wird jetzt anstelle von `http.Server` dort verwendet, wo es geeignet ist.

Es gibt auch andere Änderungen, die nur einige Benutzer betreffen.

- [[#14098] fix!: avoid rewriting this (reverts #5312)](https://github.com/vitejs/vite/pull/14098)
  - Die oberste Ebene von `this` wurde standardmäßig beim Erstellen in `globalThis` umgeschrieben. Dieses Verhalten wurde entfernt.
- [[#14231] feat!: add extension to internal virtual modules](https://github.com/vitejs/vite/pull/14231)
  - Die ID der internen virtuellen Module hat jetzt eine Erweiterung (`.js`).
- [[#14583] refactor!: Entfernen des Exports von internen APIs](https://github.com/vitejs/vite/pull/14583)
  - Entfernt versehentlich exportierte interne APIs: `isDepsOptimizerEnabled` und `getDepOptimizationConfig`
  - Entfernt exportierte interne Typen: `DepOptimizationResult`, `DepOptimizationProcessing` und `DepsOptimizer`
  - Umbenennung des Typs `ResolveWorkerOptions` in `ResolvedWorkerOptions`
- [[#5657] fix!: return 404 for resources requests outside the base path](https://github.com/vitejs/vite/pull/5657)
  - In der Vergangenheit hat Vite auf Anfragen außerhalb des Basispfades ohne `Accept: text/html` geantwortet, als ob sie mit dem Basispfad angefordert worden wären. Vite tut dies nicht mehr und antwortet stattdessen mit 404.
- [[#14723] fix(resolve)!: remove special .mjs handling](https://github.com/vitejs/vite/pull/14723)
  - In der Vergangenheit hat Vite, wenn ein "exports"-Feld einer Bibliothek auf eine "mjs"-Datei verweist, immer noch versucht, die "browser"- und "module"-Felder abzugleichen, um die Kompatibilität mit bestimmten Bibliotheken zu gewährleisten. Dieses Verhalten wird nun entfernt, um es mit dem Algorithmus zur Auflösung von Exporten in Einklang zu bringen.
- [[#14733] feat(resolve)!: remove `resolve.browserField`](https://github.com/vitejs/vite/pull/14733)
  - `resolve.browserField` ist seit Vite 3 veraltet zugunsten eines aktualisierten Standards von `['browser', 'module', 'jsnext:main', 'jsnext']` für [`resolve.mainFields`](/config/shared-options.md#resolve-mainfields).
- [[#14855] feat!: add isPreview to ConfigEnv and resolveConfig](https://github.com/vitejs/vite/pull/14855)
  - Umbenennung von `ssrBuild` in `isSsrBuild` im `ConfigEnv` Objekt.
- [[#14945] fix(css): correctly set manifest source name and emit CSS file](https://github.com/vitejs/vite/pull/14945)
  - CSS-Dateinamen werden jetzt auf der Grundlage des Chunk-Namens generiert.

## Migration von v3

Überprüfen Sie zuerst die [Migrationsanleitung von v3](https://v4.vitejs.dev/guide/migration.html) in der Vite v4-Dokumentation, um die erforderlichen Änderungen für die Portierung Ihrer App auf Vite v4 zu sehen, und setzen Sie dann die Änderungen auf dieser Seite fort.
