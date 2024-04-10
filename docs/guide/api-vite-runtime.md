# Vite Runtime API

:::warning Low-level API
Diese API wurde in Vite 5.1 als experimentelle Funktion eingeführt. Sie wurde zu [gather feedback](https://github.com/vitejs/vite/discussions/15774) hinzugefügt. Es wird wahrscheinlich zu Änderungen kommen, also stellen Sie sicher, dass Sie die Vite-Version auf `~5.1.0` setzen, wenn Sie sie benutzen. Dies ist eine Low-Level-API, die für Bibliotheks- und Framework-Autoren gedacht ist. Wenn es Ihr Ziel ist, eine Anwendung zu erstellen, sollten Sie sich zuerst die SSR-Plugins und -Tools auf [Awesome Vite SSR section](https://github.com/vitejs/awesome-vite#ssr) ansehen.

Derzeit wird die API als [Environment API](https://github.com/vitejs/vite/discussions/16358) überarbeitet, die als `^6.0.0-alpha.0` veröffentlicht wird.
:::

Die "Vite Runtime" ist ein Werkzeug, das es erlaubt, jeden Code auszuführen, indem es ihn zuerst mit Vite-Plugins verarbeitet. Es unterscheidet sich von `server.ssrLoadModule`, weil die Runtime-Implementierung vom Server entkoppelt ist. Dies erlaubt es Autoren von Bibliotheken und Frameworks, ihre eigene Kommunikationsschicht zwischen dem Server und der Laufzeit zu implementieren.

Eines der Ziele dieser Funktion ist es, eine anpassbare API für die Verarbeitung und Ausführung des Codes bereitzustellen. Vite stellt genügend Werkzeuge zur Verfügung, um Vite Runtime zu verwenden, aber Benutzer können darauf aufbauen, wenn ihre Bedürfnisse nicht mit der eingebauten Implementierung von Vite übereinstimmen.

Alle APIs können von `vite/runtime` importiert werden, sofern nicht anders angegeben.

## `ViteRuntime`

**Typ Signatur:**

```ts
export class ViteRuntime {
  constructor(
    public options: ViteRuntimeOptions,
    public runner: ViteModuleRunner,
    private debug?: ViteRuntimeDebugger,
  ) {}
  /**
   * URL to execute. Accepts file path, server path, or id relative to the root.
   */
  public async executeUrl<T = any>(url: string): Promise<T>
  /**
   * Entry point URL to execute. Accepts file path, server path or id relative to the root.
   * In the case of a full reload triggered by HMR, this is the module that will be reloaded.
   * If this method is called multiple times, all entry points will be reloaded one at a time.
   */
  public async executeEntrypoint<T = any>(url: string): Promise<T>
  /**
   * Clear all caches including HMR listeners.
   */
  public clearCache(): void
  /**
   * Clears all caches, removes all HMR listeners, and resets source map support.
   * This method doesn't stop the HMR connection.
   */
  public async destroy(): Promise<void>
  /**
   * Returns `true` if the runtime has been destroyed by calling `destroy()` method.
   */
  public isDestroyed(): boolean
}
```

::: tip Erweiterte Verwendung
Wenn Sie gerade von `server.ssrLoadModule` migrieren und HMR unterstützen wollen, sollten Sie stattdessen [`createViteRuntime`](#createviteruntime) verwenden.
:::

Die Klasse `ViteRuntime` benötigt die Optionen `root` und `fetchModule`, wenn sie gestartet wird. Vite stellt `ssrFetchModule` auf der [`server`](/guide/api-javascript) Instanz für eine einfachere Integration mit Vite SSR zur Verfügung. Vite exportiert auch `fetchModule` von seinem Haupteinstiegspunkt - es macht keine Annahmen darüber, wie der Code läuft, im Gegensatz zu `ssrFetchModule`, das erwartet, dass der Code mit `new Function` läuft. Dies kann in den Source-Maps gesehen werden, die diese Funktionen zurückgeben.

Der Runner in `ViteRuntime` ist für die Ausführung des Codes verantwortlich. Vite exportiert `ESModulesRunner` von Haus aus, er verwendet `new AsyncFunction`, um den Code auszuführen. Sie können Ihre eigene Implementierung bereitstellen, wenn Ihre JavaScript-Laufzeitumgebung keine unsichere Auswertung unterstützt.

Die beiden wichtigsten Methoden, die die Laufzeitumgebung zur Verfügung stellt, sind `executeUrl` und `executeEntrypoint`. Der einzige Unterschied zwischen ihnen ist, dass alle Module, die von `executeEntrypoint` ausgeführt werden, erneut ausgeführt werden, wenn HMR das Ereignis `full-reload` auslöst. Beachten Sie, dass Vite Runtime das `exports`-Objekt in diesem Fall nicht aktualisiert (es wird überschrieben). Sie müssten `executeUrl` ausführen oder das Modul erneut aus dem `moduleCache` holen, wenn Sie sich darauf verlassen, dass Sie das neueste `exports`-Objekt haben.

**Beispiel für die Verwendung:**

```js
import { ViteRuntime, ESModulesRunner } from 'vite/runtime'
import { root, fetchModule } from './rpc-implementation.js'

const runtime = new ViteRuntime(
  {
    root,
    fetchModule,
    // you can also provide hmr.connection to support HMR
  },
  new ESModulesRunner(),
)

await runtime.executeEntrypoint('/src/entry-point.js')
```

## `ViteRuntimeOptions`

```ts
export interface ViteRuntimeOptions {
  /**
   * Root of the project
   */
  root: string
  /**
   * A method to get the information about the module.
   * For SSR, Vite exposes `server.ssrFetchModule` function that you can use here.
   * For other runtime use cases, Vite also exposes `fetchModule` from its main entry point.
   */
  fetchModule: FetchFunction
  /**
   * Configure how source maps are resolved. Prefers `node` if `process.setSourceMapsEnabled` is available.
   * Otherwise it will use `prepareStackTrace` by default which overrides `Error.prepareStackTrace` method.
   * You can provide an object to configure how file contents and source maps are resolved for files that were not processed by Vite.
   */
  sourcemapInterceptor?:
    | false
    | 'node'
    | 'prepareStackTrace'
    | InterceptorOptions
  /**
   * Disable HMR or configure HMR options.
   */
  hmr?:
    | false
    | {
        /**
         * Configure how HMR communicates between the client and the server.
         */
        connection: HMRRuntimeConnection
        /**
         * Configure HMR logger.
         */
        logger?: false | HMRLogger
      }
  /**
   * Custom module cache. If not provided, it creates a separate module cache for each ViteRuntime instance.
   */
  moduleCache?: ModuleCacheMap
}
```

## `ViteModuleRunner`

**Type Signature:**

```ts
export interface ViteModuleRunner {
  /**
   * Run code that was transformed by Vite.
   * @param context Function context
   * @param code Transformed code
   * @param id ID that was used to fetch the module
   */
  runViteModule(
    context: ViteRuntimeModuleContext,
    code: string,
    id: string,
  ): Promise<any>
  /**
   * Run externalized module.
   * @param file File URL to the external module
   */
  runExternalModule(file: string): Promise<any>
}
```

Vite exportiert `ESModulesRunner`, der diese Schnittstelle standardmäßig implementiert. Er verwendet `new AsyncFunction`, um Code auszuführen. Wenn der Code also eine Inline-Source-Map hat, sollte er einen [Offset von 2 Zeilen](https://tc39.es/ecma262/#sec-createdynamicfunction) enthalten, um neue hinzugefügte Zeilen zu berücksichtigen. Dies wird automatisch von `server.ssrFetchModule` gemacht. Wenn Ihre Runner-Implementierung diese Einschränkung nicht hat, sollten Sie `fetchModule` (exportiert von `vite`) direkt verwenden.

## HMRRuntimeConnection

**Type Signature:**

```ts
export interface HMRRuntimeConnection {
  /**
   * Checked before sending messages to the client.
   */
  isReady(): boolean
  /**
   * Send message to the client.
   */
  send(message: string): void
  /**
   * Configure how HMR is handled when this connection triggers an update.
   * This method expects that connection will start listening for HMR updates and call this callback when it's received.
   */
  onUpdate(callback: (payload: HMRPayload) => void): void
}
```

Diese Schnittstelle definiert, wie die HMR-Kommunikation aufgebaut wird. Vite exportiert `ServerHMRConnector` vom Haupteinstiegspunkt, um HMR während Vite SSR zu unterstützen. Die Methoden `isReady` und `send` werden normalerweise aufgerufen, wenn das benutzerdefinierte Ereignis ausgelöst wird (z.B. `import.meta.hot.send("my-event")`).

`onUpdate` wird nur einmal aufgerufen, wenn die neue Laufzeit initiiert wird. Es übergibt eine Methode, die aufgerufen werden soll, wenn die Verbindung das HMR-Ereignis auslöst. Die Implementierung hängt von der Art der Verbindung ab (als Beispiel kann es sich um `WebSocket`/`EventEmitter`/`MessageChannel` handeln), sieht aber in der Regel etwa so aus:

```js
function onUpdate(callback) {
  this.connection.on('hmr', (event) => callback(event.data))
}
```

Der Rückruf wird in eine Warteschlange gestellt und wartet, bis die aktuelle Aktualisierung abgeschlossen ist, bevor er die nächste Aktualisierung verarbeitet. Im Gegensatz zur Browser-Implementierung warten die HMR-Aktualisierungen in Vite Runtime, bis alle Listener (z. B. `vite:beforeUpdate`/`vite:beforeFullReload`) beendet sind, bevor die Module aktualisiert werden.

## `createViteRuntime`

**Typ Signatur:**

```ts
async function createViteRuntime(
  server: ViteDevServer,
  options?: MainThreadRuntimeOptions,
): Promise<ViteRuntime>
```

**Beispiel für die Verwendung:**

```js
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  const server = await createServer({
    root: __dirname,
  })
  await server.listen()

  const runtime = await createViteRuntime(server)
  await runtime.executeEntrypoint('/src/entry-point.js')
})()
```

Diese Methode dient als einfacher Ersatz für `server.ssrLoadModule`. Im Gegensatz zu `ssrLoadModule` bietet `createViteRuntime` standardmäßig HMR-Unterstützung. Sie können [`options`](#mainthreadruntimeoptions) weitergeben, um das Verhalten der SSR-Laufzeit an Ihre eigenen Bedürfnisse anzupassen.

## `MainThreadRuntimeOptions`

```ts
export interface MainThreadRuntimeOptions
  extends Omit<ViteRuntimeOptions, 'root' | 'fetchModule' | 'hmr'> {
  /**
   * Disable HMR or configure HMR logger.
   */
  hmr?:
    | false
    | {
        logger?: false | HMRLogger
      }
  /**
   * Provide a custom module runner. This controls how the code is executed.
   */
  runner?: ViteModuleRunner
}
```
