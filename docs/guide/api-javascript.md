# JavaScript API

Die JavaScript-APIs von Vite sind vollständig typisiert, und es wird empfohlen, TypeScript zu verwenden oder die JavaScript-Typüberprüfung in VS Code zu aktivieren, um die Intellisense und Validierung zu nutzen.

## `createServer`

**Typ Signatur:**

```ts
async function createServer(inlineConfig?: InlineConfig): Promise<ViteDevServer>
```

**Beispielverwendung:**

```js
import { fileURLToPath } from 'url'
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  const server = await createServer({
    // Alle gültigen Benutzerkonfigurationsoptionen, plus `mode` und `configFile`
    configFile: false,
    root: __dirname,
    server: {
      port: 1337,
    },
  })
  await server.listen()

  server.printUrls()
  server.bindCLIShortcuts({ print: true })
})()
```

:::tip HINWEIS
Wenn Sie `createServer` und `build` im selben Node.js-Prozess verwenden, sind beide Funktionen auf `process.env.NODE_ENV` angewiesen, um ordnungsgemäß zu funktionieren, was auch von der `mode`-Konfigurationsoption abhängt. Um konflikte Verhalten zu verhindern, setzen Sie entweder `process.env.NODE_ENV` oder die `mode` der beiden APIs auf `development`. Andernfalls können Sie einen Kindprozess erstellen, um die APIs getrennt auszuführen.
:::

::: tip HINWEIS
Bei Verwendung von [middleware mode](/config/server-options.html#server-middlewaremode) in Kombination mit [proxy config for WebSocket](/config/server-options.html#server-proxy) sollte der übergeordnete http-Server in `middlewareMode` angegeben werden, um den Proxy korrekt zu binden.

<details>
<summary>Beispiel</summary>

```ts
import http from 'http'
import { createServer } from 'vite'

const parentServer = http.createServer() // oder express, koa, etc.

const vite = await createServer({
  server: {
    // Aktivieren des Middleware-Modus
    middlewareMode: {
      // Den übergeordneten http-Server für Proxy-WebSocket bereitstellen
      server: parentServer,
    },
  },
  proxy: {
    '/ws': {
      target: 'ws://localhost:3000',
      // Proxying WebSocket
      ws: true,
    },
  },
})

parentServer.use(vite.middlewares)
```

</details>
:::

## `InlineConfig`

Die Schnittstelle `InlineConfig` erweitert `UserConfig` um zusätzliche Eigenschaften:

- `configFile`: legen Sie die zu verwendende Konfigurationsdatei fest. Wenn nicht gesetzt, versucht Vite, automatisch eine aus dem Projektstamm zu ermitteln. Setzen Sie dies auf `false`, um die automatische Auflösung zu deaktivieren.

## `ResolvedConfig`

Die Schnittstelle `ResolvedConfig` enthält alle Eigenschaften einer `UserConfig`, außer dass die meisten Eigenschaften aufgelöst und nicht undefiniert sind. Sie enthält auch Dienstprogramme wie:

- `config.assetsInclude`: Eine Funktion zum Überprüfen, ob eine `id` als Ressource betrachtet wird.
- `config.logger`: Das interne Logger-Objekt von Vite.

## `ViteDevServer`

```ts
interface ViteDevServer {
  /**
   * Das aufgelöste Vite-Konfigurationsobjekt.
   */
  config: ResolvedConfig
  /**
   * Eine Connect-App-Instanz
   * - Kann verwendet werden, um benutzerdefinierte Middleware an den Entwicklungs-Server anzuhängen.
   * - Kann auch als Handler-Funktion eines benutzerdefinierten HTTP-Servers oder als Middleware in jedem Node.js-Framework im Connect-Stil verwendet werden.
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * Native Node-HTTP-Server-Instanz.
   * Wird in Middleware-Modus null sein.
   */
  httpServer: http.Server | null
  /**
   * Chokidar-Watcher-Instanz. Wenn `config.server.watch` auf `null` gesetzt ist,
   * werden keine Dateien überwacht und der Aufruf von `add` or `unwatch` hat keine Auswirkungen.
   * https://github.com/paulmillr/chokidar/tree/3.6.0#api
   */
  watcher: FSWatcher
  /**
   * WebSocket-Server mit der Methode `send(payload)`.
   */
  ws: WebSocketServer
  /**
   * Rollup-Plugin-Container, der Plugin-Hooks auf einer gegebenen Datei ausführen kann.
   */
  pluginContainer: PluginContainer
  /**
   * Modulgraph, der die Importbeziehungen, die Zuordnung von URL zu Datei und den HMR-Status verfolgt.
   */
  moduleGraph: ModuleGraph
  /**
   * Die aufgelösten URLs, die Vite auf dem CLI ausgibt (URL-kodiert).
   * Gibt `null` zurück, wenn im Middleware-Modus oder wenn der Server an keinem Port läuft.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * Löst, lädt und transformiert eine URL programmgesteuert auf und gibt das Ergebnis zurück, ohne den HTTP-Anforderungspipeline zu durchlaufen.
   */
  transformRequest(
    url: string,
    options?: TransformOptions
  ): Promise<TransformResult | null>
  /**
   * Wendet Vite-eigene HTML-Transformationen und alle Plugin-HTML-Transformationen an.
   */
  transformIndexHtml(
    url: string,
    html: string,
    originalUrl?: string
  ): Promise<string>
  /**
   * Lädt ein gegebenes URL als instanziiertes Modul für SSR.
   */
  ssrLoadModule(
    url: string,
    options?: { fixStacktrace?: boolean }
  ): Promise<Record<string, any>>
  /**
   * Behebt den SS-Stacktrace-Fehler.
   */
  ssrFixStacktrace(e: Error): void
  /**
   * Löst HMR für ein Modul im Modulgraphen aus. Sie können die `server.moduleGraph`-API verwenden, um das neu zu ladende Modul abzurufen. Wenn `hmr` false ist, handelt es sich um einen No-Op.
   */
  reloadModule(module: ModuleNode): Promise<void>
  /**
   * Startet den Server.
   */
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>
  /**
   * Startet den Server neu.
   *
   * @param forceOptimize - erzwingt die Optimierung neu zu bündeln, wie der `--force`-CLI-Flag
   */
  restart(forceOptimize?: boolean): Promise<void>
  /**
   * Stoppt den Server.
   */
  close(): Promise<void>
  /**
   * Bindet CLI-Verknüpfungen
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<ViteDevServer>): void
  /**
   * Der Aufruf von `await server.waitForRequestsIdle(id)` wartet bis alle statischen 
   * Importe verarbeitet wurden. Falls er durch einen Load- oder Transform-Plugin-Hook
   * aufgerufen wurde, muss die ID als Parameter übergeben werden, um Deadlocks zu
   * vermeiden. Das Aufrufen der Funktion nach dem der erste statische Importbereich
   * des Modulgraphen verarbeitet wurde führt zu einer sofortigen Auflösung.
   * @experimental
   */
  waitForRequestsIdle: (ignoredId?: string) => Promise<void>
}
```

:::info
`waitForRequestsIdle` soll als Ausweichmöglichkeit dienen, um die DX für Funktionen zu verbessern, die aufgrund der On-Demand-Natur des Vite-Entwicklungsservers nicht implementiert werden können. Es kann während des Startups von Tools wie Tailwind verwendet werden, um die Generierung von CSS-Klassen der Anwendung zu verzögern bis der Anwendungscode gesehen wurde, um Flackern durch Stiländerungen zu vermeiden. Wenn diese Funktion in einer Load- oder Transform-Hook verwendet wird und der standardmäßige HTTP1-Server im Einsatz ist, dann wird einer von sechs HTTP-Kanälen blockiert, bis der Server alle statischen Importe verarbeitet hat. Der Abhängigkeitsoptimierer von Vite nutzt diese Funktion derzeit, um bei fehlenden Abhängigkeiten das vollständige Neuladen von Seiten zu vermeiden. Dies geschieht, in dem das Laden von vorab gebündelten Abhängigkeiten verzögert wird, bis alle importierten Abhängigkeiten von statisch importierten Quellen gesammelt wurden. Vite könnte in einer zukünftigen Hauptversion zu einer anderen Strategie wechseln und standardmäßig `optimizeDeps.crawlUntilStaticImports: false` festlegen, um Leistungseinbußen in großen Anwendungen beim Kaltstart zu vermeiden.
:::

## `build`

**Typ Signatur:**

```ts
async function build(
  inlineConfig?: InlineConfig
): Promise<RollupOutput | RollupOutput[]>
```

**Beispielverwendung:**

```ts twoslash [vite.config.js]
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  await build({
    root: path.resolve(__dirname, './project'),
    base: '/foo/',
    build: {
      rollupOptions: {
        // ...
      },
    },
  })
})()
```

## `preview`

**Typ Signatur:**

```ts
async function preview(inlineConfig?: InlineConfig): Promise<PreviewServer>
```

**Beispielverwendung:**

```js
import { preview } from 'vite'
;(async () => {
  const previewServer = await preview({
    // Alle gültigen Benutzerkonfigurationsoptionen, plus `mode` und `configFile`
    preview: {
      port: 8080,
      open: true,
    },
  })

  previewServer.printUrls()
  previewServer.bindCLIShortcuts({ print: true })
})()
```

## `PreviewServer`

```ts
interface PreviewServer {
  /**
   * Das aufgelöste Vite-Konfigurationsobjekt
   */
  config: ResolvedConfig
  /**
   * Eine Connect-App-Instanz.
   * - Kann verwendet werden, um benutzerdefinierte Middleware an den Vorschauserver anzuhängen.
   * - Kann auch als Handler-Funktion eines benutzerdefinierten HTTP-Servers oder als Middleware in jedem Node.js-Framework im Connect-Stil verwendet werden
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * native Node-HTTP-Server-Instanz
   */
  httpServer: http.Server
  /**
   * Die aufgelösten URLs, die Vite auf dem CLI ausgibt (URL-kodiert).
   * Gibt `null` zurück, wenn der Server an keinem Port lauscht.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * Druckt Server-URLs
   */
  printUrls(): void
  /**
   * Bindet CLI-Verknüpfungen
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<PreviewServer>): void
}
```

## `resolveConfig`

**Typ Signatur:**

```ts
async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development',
  defaultNodeEnv = 'development',
  isPreview = false
): Promise<ResolvedConfig>
```

Der "Command"-Wert ist "Serve" in Dev und Preview, und "Build" in Build.

## `mergeConfig`

**Typ Signatur:**

```ts
function mergeConfig(
  defaults: Record<string, any>,
  overrides: Record<string, any>,
  isRoot = true
): Record<string, any>
```

Vereinigt tief zwei Vite-Konfigurationen. `isRoot` repräsentiert die Ebene innerhalb der Vite-Konfiguration, die zusammengeführt wird. Legen Sie es beispielsweise auf `false`, wenn Sie zwei `build`-Optionen zusammenführen.

:::tip HINWEIS
`mergeConfig` akzeptiert nur Konfigurationen in Objektform. Wenn Sie eine Konfiguration in Rückrufform haben, sollten Sie sie aufrufen, bevor Sie sie an `mergeConfig` übergeben.

Sie können den `defineConfig`-Helfer verwenden, um eine Konfiguration in Rückrufform mit einer anderen Konfiguration zu vereinigen:

```ts
export default defineConfig((configEnv) =>
  mergeConfig(configAsCallback(configEnv), configAsObject)
)
```

:::

## `searchForWorkspaceRoot`

**Typ Signatur:**

```ts
function searchForWorkspaceRoot(
  current: string,
  root = searchForPackageRoot(current)
): string
```

**Verwandt:** [server.fs.allow](/config/server-options.md#server-fs-allow)

Sucht nach dem Stammverzeichnis des potenziellen Arbeitsbereichs, wenn die folgenden Bedingungen erfüllt sind, andernfalls fällt es auf `root` zurück:

- enthält das Feld `workspaces` in `package.json`
- enthält eine der folgenden Dateien
  - `lerna.json`
  - `pnpm-workspace.yaml`

## `loadEnv`

**Typ Signatur:**

```ts
function loadEnv(
  mode: string,
  envDir: string,
  prefixes: string | string[] = 'VITE_'
): Record<string, string>
```

**Verwandt:** [`.env`-Dateien](./env-and-mode.md#env-files)

Lädt `.env`-Dateien im `envDir`. Standardmäßig werden nur Umgebungsvariablen mit dem Präfix `VITE_` geladen, sofern `prefixes` nicht geändert wird.

## `normalizePath`

**Typ Signatur:**

```ts
function normalizePath(id: string): string
```

**Verwandt:** [Pfadnormalisierung](./api-plugin.md#path-normalization)

Normalisiert einen Pfad, um zwischen Vite-Plugins zu interoperieren.

## `transformWithEsbuild`

**Typ Signatur:**

```ts
async function transformWithEsbuild(
  code: string,
  filename: string,
  options?: EsbuildTransformOptions,
  inMap?: object
): Promise<ESBuildTransformResult>
```

Transformiert JavaScript oder TypeScript mit Esbuild. Nützlich für Plugins, die die interne Esbuild-Transformation von Vite bevorzugen.

## `loadConfigFromFile`

**Typ Signatur:**

```ts
async function loadConfigFromFile(
  configEnv: ConfigEnv,
  configFile?: string,
  configRoot: string = process.cwd(),
  logLevel?: LogLevel,
  customLogger?: Logger
): Promise<{
  path: string
  config: UserConfig
  dependencies: string[]
} | null>
```

Lädt eine Vite-Konfigurationsdatei manuell mit Esbuild.

## `preprocessCSS`

- **Experimental:** [Feedback geben](https://github.com/vitejs/vite/discussions/13815)

**Type Signature:**

```ts
async function preprocessCSS(
  code: string,
  filename: string,
  config: ResolvedConfig
): Promise<PreprocessCSSResult>

interface PreprocessCSSResult {
  code: string
  map?: SourceMapInput
  modules?: Record<string, string>
  deps?: Set<string>
}
```

Verarbeitet `.css`, `.scss`, `.sass`, `.less`, `.styl` und `.stylus` Dateien zu einfachem CSS, so dass es in Browsern verwendet oder von anderen Tools geparst werden kann. Ähnlich wie bei der [built-in CSS pre-processing support](/guide/features#css-pre-processors) muss der entsprechende Präprozessor installiert sein, wenn er verwendet wird.

Der verwendete Präprozessor wird aus der Erweiterung „Dateiname“ abgeleitet. Wenn der `Dateiname` mit `.module.{ext}` endet, wird er als [CSS-Modul](https://github.com/css-modules/css-modules) abgeleitet und das zurückgegebene Ergebnis enthält ein `modules`-Objekt, das die ursprünglichen Klassennamen auf die transformierten abbildet.

Beachten Sie, dass die Vorverarbeitung keine URLs in `url()` oder `image-set()` auflöst.
