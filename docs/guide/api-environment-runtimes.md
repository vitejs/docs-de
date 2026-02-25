# Environment API for Runtimes

:::info Release-Kandidat
Die Environment API ist allgemein in der Phase für einen Release-Kandidaten. Wir werden für Stabilität in den APIs zwischen den Hauptversionen sorgen, damit das Ökosystem damit experimentieren und darauf aufbauen kann. Beachten Sie trotzdessen, dass [einige spezifische APIs](/changes/#considering) weiterhin als experimentell betrachtet werden.

Wir planen, diese neueren APIs (mit möglichen grundlegenden Änderungen) in einer zukünftigen Hauptversion zu stabilisieren, sobald nachgelagerte Projekte Zeit hatten, mit den neuen Funktionen zu experimentieren und sie zu validieren.

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
            hot: true,
            transport: customHotChannel(),
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

Ein Vite-Modul-Runner ermöglicht die Ausführung beliebiger Codes, indem diese zunächst mit Vite-Plugins verarbeitet werden. Er unterscheidet sich von „server.ssrLoadModule“, da die Runner-Implementierung vom Server entkoppelt ist. Dies ermöglicht es Autoren von Bibliotheken und Frameworks, ihre eigene Kommunikationsebene zwischen dem Vite-Server und dem Runner zu implementieren. Der Browser kommuniziert mit seiner entsprechenden Umgebung über den Server-WebSocket und über HTTP-Anfragen. Der Node-Modul-Runner kann direkt Funktionsaufrufe zur Verarbeitung von Modulen ausführen, da er im selben Prozess läuft. Andere Umgebungen könnten Module ausführen, die mit einer JS-Laufzeitumgebung wie workerd oder einem Worker-Thread verbunden sind, wie es Vitest tut.

Eines der Ziele dieser Funktion ist es, eine anpassbare API zur Verarbeitung und Ausführung von Code bereitzustellen. Benutzer können mit den offengelegten Primitiven neue Umgebungsfabriken erstellen.

```ts
import { DevEnvironment, HotChannel } from 'vite'

function createWorkerdDevEnvironment(
  name: string,
  config: ResolvedConfig,
  context: DevEnvironmentContext
) {
  const connection = /* ... */
  const transport: HotChannel = {
    on: (listener) => { connection.on('message', listener) },
    send: (data) => connection.send(data),
  }

  const workerdDevEnvironment = new DevEnvironment(name, config, {
    options: {
      resolve: { conditions: ['custom'] },
      ...context.options,
    },
    hot: true,
    transport,
  })
  return workerdDevEnvironment
}
```

Es gibt [mehrere Kommunikationsebenen für das `DevEnvironment`](/guide/api-environment-frameworks#devenvironment-communication-levels). Um Frameworks das Schreiben von laufzeitunabhängigem Code zu erleichtern, empfehlen wir, die flexibelste Kommunikationsebene zu implementieren.

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

**Beispielnutzung:**

```js
import { ModuleRunner, ESModulesEvaluator } from 'vite/module-runner'
import { transport } from './rpc-implementation.js'

const moduleRunner = new ModuleRunner(
  {
    transport,
    createImportMeta: createNodeImportMeta, // Falls der ModuleRunner in Node.js läuft
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
  transport: ModuleRunnerTransport
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

## `ModuleRunnerTransport`

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

```js [worker.js]
import { parentPort } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import {
  ESModulesEvaluator,
  ModuleRunner,
  createNodeImportMeta,
} from 'vite/module-runner'

/** @type {import('vite/module-runner').ModuleRunnerTransport} */
const transport = {
  connect({ onMessage, onDisconnection }) {
    parentPort.on('message', onMessage)
    parentPort.on('close', onDisconnection)
  },
  send(data) {
    parentPort.postMessage(data)
  },
}
```

```js [server.js]
import { BroadcastChannel } from 'node:worker_threads'
import { createServer, RemoteEnvironmentTransport, DevEnvironment } from 'vite'

function createWorkerEnvironment(name, config, context) {
  const worker = new Worker('./worker.js')
    const handlerToWorkerListener = new WeakMap()

  const workerHotChannel = {
    send: (data) => w.postMessage(data),
    on: (event, handler) => {
      if (event === 'connection') return

      const listener = (value) => {
        if (value.type === 'custom' && value.event === event) {
          const client = {
            send(payload) {
              w.postMessage(payload)
            },
          }
          handler(value.data, client)
        }
      }
      handlerToWorkerListener.set(handler, listener)
      w.on('message', listener)
    },
    off: (event, handler) => {
      if (event === 'connection') return
      const listener = handlerToWorkerListener.get(handler)
      if (listener) {
        w.off('message', listener)
        handlerToWorkerListener.delete(handler)
      }
    },
  }

  return new DevEnvironment(name, config, {
    transport: workerHotChannel,
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

Ein anderes Beispiels, bei dem HTTP-Anfragen verwendet werden, um zwischen dem Runner und dem Server zu kommunizieren: 

```ts
import { ESModulesEvaluator, ModuleRunner } from 'vite/module-runner'

export const runner = new ModuleRunner(
  {
    transport: {
      async invoke(data) {
        const response = await fetch(`http://my-vite-server/invoke`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
        return response.json()
      },
    },
    hmr: false, // disable HMR as HMR requires transport.connect
  },
  new ESModulesEvaluator()
)

await runner.import('/entry.js')
```

In diesem Fall kann die `handleInvoke`-Methode in `NormalizedHotChannel` verwendet werden:


```ts
const customEnvironment = new DevEnvironment(name, config, context)

server.onRequest((request: Request) => {
  const url = new URL(request.url)
  if (url.pathname === '/invoke') {
    const payload = (await request.json()) as HotPayload
    const result = customEnvironment.hot.handleInvoke(payload)
    return new Response(JSON.stringify(result))
  }
  return Response.error()
})
```

Beachten Sie allerdings, dass für die HMR-Unterstützung `send`- und `connect`-Methoden notwendig sind. Die `send`-Methode wird üblicherweise aufgerufen, wenn das benutzerdefinierte Event ausgelöst wird (wie beispielsweise `import.meta.hot.send("my-event")`).

Vite exportiert `createServerHotChannel` aus dem Haupteinstiegspunkt, um HMR während Vite SSR zu unterstützen.