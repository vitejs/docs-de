# Environment API for Runtimes

:::warning Experimentell
Die Environment-API befindet sich noch in der Testphase. Wir werden die APIs während Vite 6 stabil halten, damit das Ökosystem damit experimentieren und darauf aufbauen kann. Wir planen, diese neuen APIs mit potenziellen grundlegenden Änderungen in Vite 7 zu stabilisieren.

Ressourcen:

- [Feedback-Diskussion](https://github.com/vitejs/vite/discussions/16358), in der wir Feedback zu den neuen APIs sammeln.
- [Environment API PR](https://github.com/vitejs/vite/pull/16471), wo die neue API implementiert und überprüft wurde.

Bitte teilen Sie uns Ihr Feedback mit.
:::

## Umgebungs-"Fabriken"

Umgebungsfabriken sind für die Implementierung durch Umgebungsanbieter wie Cloudflare vorgesehen und nicht für Endbenutzer. Umgebungsfabriken geben eine `EnvironmentOptions` für den häufigsten Fall zurück, bei dem die Ziel-Laufzeitumgebung sowohl für Entwicklungs- als auch für Build-Umgebungen verwendet wird. Die Standardumgebungsoptionen können auch so eingestellt werden, dass der Benutzer dies nicht tun muss.

```ts
function createWorkerdEnvironment(
  userConfig: EnvironmentOptions
): EnvironmentOptions {
  return mergeConfig(
    {
      resolve: {
        conditions: [
          /*...*/
        ],
      },
      dev: {
        createEnvironment(name, config) {
          return createWorkerdDevEnvironment(name, config, {
            hot: customHotChannel(),
          })
        },
      },
      build: {
        createEnvironment(name, config) {
          return createWorkerdBuildEnvironment(name, config)
        },
      },
    },
    userConfig
  )
}
```

Dann kann die Konfigurationsdatei folgend geschrieben werden:

```js
import { createWorkerdEnvironment } from 'vite-environment-workerd'

export default {
  environments: {
    ssr: createWorkerdEnvironment({
      build: {
        outDir: '/dist/ssr',
      },
    }),
    rsc: createWorkerdEnvironment({
      build: {
        outDir: '/dist/rsc',
      },
    }),
  },
}
```

und Frameworks können eine Umgebung mit der Worker-Laufzeitumgebung verwenden, um SSR mithilfe von:

```js
const ssrEnvironment = server.environments.ssr
```

## Erstellen einer neuen Umgebungsfabrik

Ein Vite-Entwicklungsserver stellt standardmäßig zwei Umgebungen bereit: eine `client`-Umgebung und eine `ssr`-Umgebung. Die Client-Umgebung ist standardmäßig eine Browserumgebung, und der Modul-Runner wird durch Importieren des virtuellen Moduls `/@vite/client` in Client-Apps implementiert. Die SSR-Umgebung läuft standardmäßig in derselben Node-Laufzeitumgebung wie der Vite-Server und ermöglicht die Verwendung von Anwendungsservern zum Rendern von Anfragen während der Entwicklung mit vollständiger HMR-Unterstützung.

Der transformierte Quellcode wird als Modul bezeichnet, und die Beziehungen zwischen den in jeder Umgebung verarbeiteten Modulen werden in einem Modulgraphen gespeichert. Der transformierte Code für diese Module wird an die mit jeder Umgebung verbundenen Laufzeitumgebungen gesendet, um dort ausgeführt zu werden. Wenn ein Modul in der Laufzeitumgebung ausgewertet wird, werden seine importierten Module angefordert, wodurch die Verarbeitung eines Abschnitts des Modulgraphen ausgelöst wird.

Ein Vite-Modul-Runner ermöglicht die Ausführung beliebiger Codes, indem diese zunächst mit Vite-Plugins verarbeitet werden. Er unterscheidet sich von „server.ssrLoadModule“, da die Runner-Implementierung vom Server entkoppelt ist. Dies ermöglicht es Autoren von Bibliotheken und Frameworks, ihre eigene Kommunikationsebene zwischen dem Vite-Server und dem Runner zu implementieren. Der Browser kommuniziert mit seiner entsprechenden Umgebung über den Server-Websocket und über HTTP-Anfragen. Der Node-Modul-Runner kann direkt Funktionsaufrufe zur Verarbeitung von Modulen ausführen, da er im selben Prozess läuft. Andere Umgebungen könnten Module ausführen, die mit einer JS-Laufzeitumgebung wie workerd oder einem Worker-Thread verbunden sind, wie es Vitest tut.

Eines der Ziele dieser Funktion ist es, eine anpassbare API zur Verarbeitung und Ausführung von Code bereitzustellen. Benutzer können mit den offengelegten Primitiven neue Umgebungsfabriken erstellen.

```ts
import { DevEnvironment, RemoteEnvironmentTransport } from 'vite'

function createWorkerdDevEnvironment(
  name: string,
  config: ResolvedConfig,
  context: DevEnvironmentContext
) {
  const hot = /* ... */
  const connection = /* ... */
  const transport = new RemoteEnvironmentTransport({
    send: (data) => connection.send(data),
    onMessage: (listener) => connection.on('message', listener),
  })

  const workerdDevEnvironment = new DevEnvironment(name, config, {
    options: {
      resolve: { conditions: ['custom'] },
      ...context.options,
    },
    hot,
    remoteRunner: {
      transport,
    },
  })
  return workerdDevEnvironment
}
```

## `ModuleRunner`

Ein Modul-Runner wird in der Ziel-Laufzeit instanziiert. Alle APIs im nächsten Abschnitt werden aus `vite/module-runner` importiert, sofern nicht anders angegeben. Dieser Export-Einstiegspunkt wird so schlank wie möglich gehalten und exportiert nur das Minimum, das zum Erstellen von Modul-Runners erforderlich ist.

**Type Signature:**

```ts
export class ModuleRunner {
  constructor(
    public options: ModuleRunnerOptions,
    public evaluator: ModuleEvaluator = new ESModulesEvaluator(),
    private debug?: ModuleRunnerDebugger
  ) {}
  /**
   * URL to execute.
   * Accepts file path, server path, or id relative to the root.
   */
  public async import<T = any>(url: string): Promise<T>
  /**
   * Clear all caches including HMR listeners.
   */
  public clearCache(): void
  /**
   * Clear all caches, remove all HMR listeners, reset sourcemap support.
   * This method doesn't stop the HMR connection.
   */
  public async close(): Promise<void>
  /**
   * Returns `true` if the runner has been closed by calling `close()`.
   */
  public isClosed(): boolean
}
```

Der Modul-Evaluator in `ModuleRunner` ist für die Ausführung des Codes verantwortlich. Vite exportiert `ESModulesEvaluator` standardmäßig und verwendet `new AsyncFunction`, um den Code zu evaluieren. Sie können Ihre eigene Implementierung bereitstellen, wenn Ihre JavaScript-Laufzeitumgebung keine unsichere Evaluierung unterstützt.

Der Modul-Runner stellt die Methode `import` zur Verfügung. Wenn der Vite-Server das HMR-Ereignis `full-reload` auslöst, werden alle betroffenen Module erneut ausgeführt. Beachten Sie, dass der Modul-Runner in diesem Fall das Objekt `exports` nicht aktualisiert (sondern überschreibt), sodass Sie `import` ausführen oder das Modul erneut aus `evaluatedModules` abrufen müssen, wenn Sie auf das aktuelle Objekt `exports` angewiesen sind.

**Example Usage:**

```js
import { ModuleRunner, ESModulesEvaluator } from 'vite/module-runner'
import { fetchModule } from './rpc-implementation.js'

const moduleRunner = new ModuleRunner(
  {
    fetchModule,
    // you can also provide hmr.connection to support HMR
  },
  new ESModulesEvaluator()
)

await moduleRunner.import('/src/entry-point.js')
```

## `ModuleRunnerOptions`

```ts twoslash
import type {
  InterceptorOptions as InterceptorOptionsRaw,
  ModuleRunnerHmr as ModuleRunnerHmrRaw,
  EvaluatedModules,
} from 'vite/module-runner'
import type { Debug } from '@type-challenges/utils'

type InterceptorOptions = Debug<InterceptorOptionsRaw>
type ModuleRunnerHmr = Debug<ModuleRunnerHmrRaw>
/** see below */
type ModuleRunnerTransport = unknown

// ---cut---
// @errors: 2307 2304
interface ModuleRunnerOptions {
  /**
   * A set of methods to communicate with the server.
   */
  transport: RunnerTransport
  /**
   * Configure how source maps are resolved.
   * Prefers `node` if `process.setSourceMapsEnabled` is available.
   * Otherwise it will use `prepareStackTrace` by default which overrides
   * `Error.prepareStackTrace` method.
   * You can provide an object to configure how file contents and
   * source maps are resolved for files that were not processed by Vite.
   */
  sourcemapInterceptor?:
    | false
    | 'node'
    | 'prepareStackTrace'
    | InterceptorOptions
  /**
   * Disable HMR or configure HMR options.
   *
   * @default true
   */
  hmr?: boolean | ModuleRunnerHmr
  /**
   * Custom module cache. If not provided, it creates a separate module
   * cache for each module runner instance.
   */
  evaluatedModules?: EvaluatedModules
}
```

## `ModuleEvaluator`

**Type Signature:**

```ts twoslash
import type { ModuleRunnerContext as ModuleRunnerContextRaw } from 'vite/module-runner'
import type { Debug } from '@type-challenge/utils'

type ModuleRunnerContext = Debug<ModuleRunnerContextRaw>

// ---cut---
// @errors: 2307
export interface ModuleEvaluator {
  /**
   * Number of prefixed lines in the transformed code.
   */
  startOffset?: number
  /**
   * Evaluate code that was transformed by Vite.
   * @param context Function context
   * @param code Transformed code
   * @param id ID that was used to fetch the module
   */
  runInlinedModule(
    context: ModuleRunnerContext,
    code: string,
    id: string
  ): Promise<any>
  /**
   * evaluate externalized module.
   * @param file File URL to the external module
   */
  runExternalModule(file: string): Promise<any>
}
```

Vite exportiert standardmäßig `ESModulesEvaluator`, das diese Schnittstelle implementiert. Es verwendet `new AsyncFunction`, um Code auszuwerten. Wenn der Code also eine Inline-Quellkarte enthält, sollte er einen [Offset von 2 Zeilen](https://tc39.es/ecma262/#sec-createdynamicfunction) enthalten, um die hinzugefügten neuen Zeilen zu berücksichtigen. Dies wird automatisch von `ESModulesEvaluator` durchgeführt. Benutzerdefinierte Evaluatoren fügen keine zusätzlichen Zeilen hinzu.

## RunnerTransport

**Type Signature:**

```ts twoslash
import type { ModuleRunnerTransportHandlers } from 'vite/module-runner'
/** an object */
type HotPayload = unknown
// ---cut---
interface ModuleRunnerTransport {
  connect?(handlers: ModuleRunnerTransportHandlers): Promise<void> | void
  disconnect?(): Promise<void> | void
  send?(data: HotPayload): Promise<void> | void
  invoke?(data: HotPayload): Promise<{ result: any } | { error: any }>
  timeout?: number
}
```

Transportobjekt, das über einen RPC oder durch direkten Aufruf der Funktion mit der Umgebung kommuniziert. Wenn die Methode `invoke` nicht implementiert ist, müssen die Methoden `send` und `connect` implementiert werden. Vite erstellt die Methode `invoke` intern.

Sie müssen sie mit der Instanz `HotChannel` auf dem Server koppeln, wie in diesem Beispiel, in dem der Modul-Runner im Worker-Thread erstellt wird:

::: code-group

```ts [worker.js]
import { parentPort } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import {
  ESModulesEvaluator,
  ModuleRunner,
  RemoteRunnerTransport,
} from 'vite/module-runner'

const runner = new ModuleRunner(
  {
    transport: new RemoteRunnerTransport({
      send: (data) => parentPort.postMessage(data),
      onMessage: (listener) => parentPort.on('message', listener),
      timeout: 5000,
    }),
  },
  new ESModulesEvaluator()
)
```

```ts [server.js]
import { BroadcastChannel } from 'node:worker_threads'
import { createServer, RemoteEnvironmentTransport, DevEnvironment } from 'vite'

function createWorkerEnvironment(name, config, context) {
  const worker = new Worker('./worker.js')
  return new DevEnvironment(name, config, {
    hot: /* custom hot channel */,
    remoteRunner: {
      transport: new RemoteEnvironmentTransport({
        send: (data) => worker.postMessage(data),
        onMessage: (listener) => worker.on('message', listener),
      }),
    },
  })
}

await createServer({
  environments: {
    worker: {
      dev: {
        createEnvironment: createWorkerEnvironment,
      },
    },
  },
})
```

:::

`RemoteRunnerTransport` und `RemoteEnvironmentTransport` sind für die gemeinsame Verwendung vorgesehen, müssen jedoch nicht unbedingt verwendet werden. Sie können Ihre eigene Funktion definieren, um die Kommunikation zwischen dem Runner und dem Server zu ermöglichen. Wenn Sie beispielsweise über eine HTTP-Anfrage eine Verbindung zur Umgebung herstellen, können Sie `fetch().json()` in der Funktion `fetchModule` aufrufen:

```ts
import { ESModulesEvaluator, ModuleRunner } from 'vite/module-runner'

export const runner = new ModuleRunner(
  {
    transport: {
      async fetchModule(id, importer) {
        const response = await fetch(
          `http://my-vite-server/fetch?id=${id}&importer=${importer}`
        )
        return response.json()
      },
    },
    hmr: false, // disable HMR as HMR requires transport.connect
  },
  new ESModulesEvaluator()
)

await runner.import('/entry.js')
```

## ModuleRunnerHMRConnection

**Type Signature:**

```ts
export interface ModuleRunnerHMRConnection {
  /**
   * Checked before sending messages to the server.
   */
  isReady(): boolean
  /**
   * Send a message to the server.
   */
  send(payload: HotPayload): void
  /**
   * Configure how HMR is handled when this connection triggers an update.
   * This method expects that the connection will start listening for HMR
   * updates and call this callback when it's received.
   */
  onUpdate(callback: (payload: HotPayload) => void): void
}
```

Diese Schnittstelle definiert, wie die HMR-Kommunikation hergestellt wird. Vite exportiert `ServerHMRConnector` vom Haupteinstiegspunkt, um HMR während Vite SSR zu unterstützen. Die Methoden `isReady` und `send` werden normalerweise aufgerufen, wenn das benutzerdefinierte Ereignis ausgelöst wird (z. B. `import.meta.hot.send("my-event")`).

`onUpdate` wird nur einmal aufgerufen, wenn der neue Modul-Runner gestartet wird. Es übergibt eine Methode, die aufgerufen werden soll, wenn die Verbindung das HMR-Ereignis auslöst. Die Implementierung hängt vom Verbindungstyp ab (beispielsweise kann es sich um `WebSocket`/`EventEmitter`/`MessageChannel` handeln), sieht aber in der Regel etwa so aus:

```js
function onUpdate(callback) {
  this.connection.on('hmr', (event) => callback(event.data))
}
```

Der Callback wird in die Warteschlange gestellt und wartet, bis die aktuelle Aktualisierung abgeschlossen ist, bevor die nächste Aktualisierung verarbeitet wird. Im Gegensatz zur Browser-Implementierung warten HMR-Aktualisierungen in einem Modul-Runner, bis alle Listener (wie „vite:beforeUpdate“/„vite:beforeFullReload“) abgeschlossen sind, bevor die Module aktualisiert werden.
