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
      port: 1337
    }
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

- `configFile`: legen Sie die zu verwendende Konfigurationsdatei fest. Wenn nicht gesetzt, versucht Vite, automatisch eine aus dem Projektstamm zu ermitteln. Setzen Sie `false`, um die automatische Auflösung zu deaktivieren.
- `envFile`: Setzen Sie `false`, um `.env`-Dateien zu deaktivieren.

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
   * dann gibt diese einen Noop-Ereignis-Emitter zurück.
   * https://github.com/paulmillr/chokidar#api
   */
  watcher: FSWatcher
  /**
   * Web-Socket-Server mit der Methode `send(payload)`.
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
   * Die von Vite auf der Befehlszeile gedruckten aufgelösten URLs. In Middleware-Modus oder vor dem Aufruf von `server.listen` ist dies null.
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
  transformIndexHtml(url: string, html: string): Promise<string>
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
}
```

## `build`

**Typ Signatur:**

```ts
async function build(
  inlineConfig?: InlineConfig
): Promise<RollupOutput | RollupOutput[]>
```

**Beispielverwendung:**

```js
import path from 'path'
import { fileURLToPath } from 'url'
import { build } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  await build({
    root: path.resolve(__dirname, './project'),
    base: '/foo/',
    build: {
      rollupOptions: {
        // ...
      }
    }
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
      open: true
    }
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
   * Die von Vite auf der Befehlszeile gedruckten aufgelösten URLs.
   * Null, bevor der Server lauscht.
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
  isPreview = false,
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
  logLevel?: LogLevel
): Promise<{
  path: string
  config: UserConfig
  dependencies: string[]
} | null>
```

Lädt eine Vite-Konfigurationsdatei manuell mit Esbuild.
