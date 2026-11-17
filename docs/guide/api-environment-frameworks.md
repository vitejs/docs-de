# Environment API für Frameworks

:::info Release-Kandidat
Die Environment API ist allgemein in der Phase für einen Release-Kandidaten. Wir werden für Stabilität in den APIs zwischen den Hauptversionen sorgen, damit das Ökosystem damit experimentieren und darauf aufbauen kann. Beachten Sie trotzdessen, dass [einige spezifische APIs](/changes/#considering) weiterhin als experimentell betrachtet werden.

Wir planen, diese neueren APIs (mit möglichen grundlegenden Änderungen) in einer zukünftigen Hauptversion zu stabilisieren, sobald nachgelagerte Projekte Zeit hatten, mit den neuen Funktionen zu experimentieren und sie zu validieren.

Ressourcen:

- [Feedback-Diskussion](https://github.com/vitejs/vite/discussions/16358), wo wir Feedback zu den neuen APIs sammeln.
- [Environment API PR](https://github.com/vitejs/vite/pull/16471), wo die neuen APIs implementiert und überprüft wurden.

Bitte teilen Sie uns Ihr Feedback mit.
:::

## DevEnvironment Kommunikationsebenen

Da Umgebungen in verschiedenen Laufzeiten ausgeführt werden können, kann die Kommunikation mit ihnen, je nach Laufzeit, eingeschränkt sein. Um Frameworks. Damit Frameworks problemlos laufzeitunabhängigen Code schreiben können, bietet die Environment-API drei Arten von Kommunikationsebenen.

### `RunnableDevEnvironment`

`RunnableDevEnvironment` ist eine Umgebung, die beliebige JavaScript-Werte mit Ihrem Anwendungscode austauschen kann. Beim Importieren eines Moduls erhalten Sie dessen echte, lebendige Exporte (Funktionen, Klasseninstanzen und alle anderen Werte), sodass Frameworks ihre Server-Einstiegspunkte direkt ausführen können. Die implizite `ssr`-Umgebung und andere Nicht-Client-Umgebungen verwenden während der Entwicklung standardmäßig ein `RunnableDevEnvironment`. Den Zugriff auf den Runner können Sie mit der Funktion `isRunnableDevEnvironment` absichern.

Sein `runner` ist ein `ModuleRunner`. Über `runner.import(url)` importieren Sie Module: Damit wird ein Modul aus dem Vite-Modulgraphen abgerufen, transformiert und ausgewertet (die `url` akzeptiert einen Dateipfad, einen Serverpfad oder eine ID relativ zum Root), und Sie erhalten das instanziierte Modul mit voller HMR-Unterstützung zurück. Es ist der moderne Ersatz für `server.ssrLoadModule`, sodass Frameworks darauf migrieren können, um HMR für ihre SSR-Entwicklung zu aktivieren.

:::info Warum beliebige Werte ausgetauscht werden können
Ein `RunnableDevEnvironment` wertet Module in derselben Laufzeitumgebung wie der Vite-Server aus, sodass Werte prozessintern übergeben werden, statt serialisiert zu werden. Das unterscheidet es vom [`FetchableDevEnvironment`](#fetchabledevenvironment), das nur über serialisierte `Request`-/`Response`-Objekte per Fetch API kommunizieren kann. Daher setzt die Verwendung eines `RunnableDevEnvironment` voraus, dass die Laufzeitumgebung des Runners dieselbe ist wie die des Vite-Servers.
:::

```ts
export class RunnableDevEnvironment extends DevEnvironment {
  public readonly runner: ModuleRunner
}

class ModuleRunner {
  /**
   * URL to execute.
   * Accepts file path, server path, or id relative to the root.
   * Returns an instantiated module (same as in ssrLoadModule)
   */
  public async import(url: string): Promise<Record<string, any>>
  /**
   * Other ModuleRunner methods...
   */
}

if (isRunnableDevEnvironment(server.environments.ssr)) {
  await server.environments.ssr.runner.import('/entry-point.js')
}
```

:::warning
Der `Runner` wird faul ausgewertet, wenn das erste Mal auf ihn zugegriffen wird. Achten Sie darauf, dass Vite die Source-Map-Unterstützung aktiviert, wenn der `Runner` erstellt wird, indem Sie `process.setSourceMapsEnabled` aufrufen oder `Error.prepareStackTrace` überschreiben, wenn es nicht verfügbar ist.
:::

Ausgehend von einem Vite-Server, der im Middleware-Modus konfiguriert ist, wie in der [SSR-Einrichtungsanleitung] (/guide/ssr#setting-up-the-dev-server) beschrieben, implementieren wir die SSR-Middleware mithilfe der Umgebungs-API. Beachten Sie, dass der Name nicht `ssr` lauten muss, weshalb wir den Namen `server` für dieses Beispiel gewählt haben. Die Fehlerbehandlung wird weggelassen.

```js
import fs from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'

const viteServer = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    server: {
      // by default, modules are run in the same process as the vite server
    },
  },
})

// You might need to cast this to RunnableDevEnvironment in TypeScript or
// use isRunnableDevEnvironment to guard the access to the runner
const serverEnvironment = viteServer.environments.server

app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  // 1. Read index.html
  const indexHtmlPath = path.resolve(import.meta.dirname, 'index.html')
  let template = fs.readFileSync(indexHtmlPath, 'utf-8')

  // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
  //    and also applies HTML transforms from Vite plugins, e.g. global
  //    preambles from @vitejs/plugin-react
  template = await viteServer.transformIndexHtml(url, template)

  // 3. Load the server entry. import(url) automatically transforms
  //    ESM source code to be usable in Node.js! There is no bundling
  //    required, and provides full HMR support.
  const { render } = await environment.runner.import(
    '/src/entry-server.js'
  )

  // 4. render the app HTML. This assumes entry-server.js's exported
  //     `render` function calls appropriate framework SSR APIs,
  //    e.g. ReactDOMServer.renderToString()
  const appHtml = await render(url)

  // 5. Inject the app-rendered HTML into the template.
  const html = template.replace(`<!--ssr-outlet-->`, appHtml)

  // 6. Send the rendered HTML back.
  res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
})
```

Bei Verwendung von Umgebungen, die HMR unterstützen (wie z. B. `RunnableDevEnvironment`), sollten Sie für ein optimales Verhalten `import.meta.hot.accept()` in Ihre Server-Eingabedatei einfügen. Ohne diese Angabe führen Änderungen an Serverdateien dazu, dass der gesamte Servermodulgraph ungültig wird:

```js
// src/entry-server.js
export function render(...) { ... }

if (import.meta.hot) {
  import.meta.hot.accept()
}
```

### `FetchableDevEnvironment`

:::info

Im Moment suchen wir nach Feedback zu [dem Vorschlag `FetchableDevEnvironment`] (https://github.com/vitejs/vite/discussions/18191).

:::

`FetchableDevEnvironment` ist eine Umgebung, die über die Schnittstelle [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) mit ihrer Laufzeitumgebung kommunizieren kann. Da die `RunnableDevEnvironment` nur in einer begrenzten Anzahl von Laufzeiten implementiert werden kann, empfehlen wir, anstelle der `RunnableDevEnvironment` die `FetchableDevEnvironment` zu verwenden.

Ein häufiger Grund dafür ist ein Framework, das eine Laufzeitumgebung unterstützen möchte, in der Vite nicht direkt laufen kann (z. B. Cloudflare Workers). Ein `RunnableDevEnvironment` lässt sich dort nicht verwenden, da der Runner die Laufzeitumgebung des Vite-Servers teilen muss, damit Werte prozessintern übergeben werden können. Durch die Standardisierung auf die Fetch API kann das Framework einen einzigen Weg zur Verarbeitung von Anfragen für alle Ziel-Laufzeitumgebungen beibehalten: Seine Entwicklungs-Middleware leitet jede eingehende Browser-Anfrage als `Request` weiter und sendet die zurückgegebene `Response` an den Browser zurück – genau so, wie die App Anfragen in der Produktion verarbeitet.

Diese Umgebung stellt einen standardisierten Weg bereit, Anfragen mit Hilfe der `handleRequest`-Methode zu bearbeiten:

```ts
import {
  createServer,
  createFetchableDevEnvironment,
  isFetchableDevEnvironment,
} from 'vite'

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    custom: {
      dev: {
        createEnvironment(name, config) {
          return createFetchableDevEnvironment(name, config, {
            handleRequest(request: Request): Promise<Response> | Response {
              // Bearbeite Anfrage und gib Antwort zurück
            },
          })
        },
      },
    },
  },
})

// Jeder Konsument der Umgebungs-API kann nun `dispatchFetch` aufrufen
if (isFetchableDevEnvironment(server.environments.custom)) {
  const response: Response = await server.environments.custom.dispatchFetch(
    new Request('http://example.com/request-to-handle'),
  )
}
```

:::warning
Vite validiert die Eingabe und Ausgabe der `dispatchFetch`-Methode. Die Anfrage muss eine Instanz der globalen `Request`-Klasse sein und die Antwort muss eine Instanz der globalen `Response`-Klasse sein. Vite wirft einen Fehler vom Typ `TypeError`, wenn dies nicht der Fall ist.

Beachten Sie, dass auch wenn `FetchableDevEnvironment` als Klasse implementiert ist, wird es vom Vite-Team als Implementationsdetail betrachtet und könnte sich jederzeit ändern.
:::

### Rohes `DevEnvironment`

Wenn die Umgebung keine `RunnableDevEnvironment`- oder `FetchableDevEnvironment`-Schnittstellen implementiert, dann müssen Sie die Kommunikation manuell anlegen.

Wenn Ihr Code in der gleichen Laufzeit wie die Benutzermodule ausgeführt werden kann (d.h. er ist nicht auf Node.js-spezifische APIs angewiesen), können Sie ein virtuelles Modul verwenden. Bei diesem Ansatz entfällt die Notwendigkeit, auf den Wert vom Code aus über die APIs von Vite zuzugreifen.

```ts
// code using the Vite's APIs
import { createServer } from 'vite'

const server = await createServer({
  plugins: [
    // a plugin that handles `virtual:entrypoint`
    {
      name: 'virtual-module',
      /* plugin implementation */
    },
  ],
})
const ssrEnvironment = server.environments.ssr
const input = {}

// use exposed functions by each environment factories that runs the code
// check for each environment factories what they provide
if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Unsupported runtime for ${ssrEnvironment.name}`)
}

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)
const response = handler(new Request('http://example.com/'))

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

Um zum Beispiel `transformIndexHtml` auf dem Benutzermodul aufzurufen, kann das folgende Plugin verwendet werden:

```ts {13-21}
function vitePluginVirtualIndexHtml(): Plugin {
  let server: ViteDevServer | undefined
  return {
    name: vitePluginVirtualIndexHtml.name,
    configureServer(server_) {
      server = server_
    },
    resolveId(source) {
      return source === 'virtual:index-html' ? '\0' + source : undefined
    },
    async load(id) {
      if (id === '\0' + 'virtual:index-html') {
        let html: string
        if (server) {
          this.addWatchFile('index.html')
          html = fs.readFileSync('index.html', 'utf-8')
          html = await server.transformIndexHtml('/', html)
        } else {
          html = fs.readFileSync('dist/client/index.html', 'utf-8')
        }
        return `export default ${JSON.stringify(html)}`
      }
      return
    },
  }
}
```

Wenn Ihr Code Node.js-APIs benötigt, können Sie `hot.send` verwenden, um mit dem Code zu kommunizieren, der die APIs von Vite aus den Benutzermodulen verwendet. Beachten Sie jedoch, dass dieser Ansatz nach dem Build-Prozess möglicherweise nicht mehr auf die gleiche Weise funktioniert.

```ts
// code using the Vite's APIs
import { createServer } from 'vite'

const server = await createServer({
  plugins: [
    // a plugin that handles `virtual:entrypoint`
    {
      name: 'virtual-module',
      /* plugin implementation */
    },
  ],
})
const ssrEnvironment = server.environments.ssr
const input = {}

// use exposed functions by each environment factories that runs the code
// check for each environment factories what they provide
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  await ssrEnvironment.runner.import('virtual:entrypoint')
} else if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Unsupported runtime for ${ssrEnvironment.name}`)
}

const req = new Request('http://example.com/')

const uniqueId = 'a-unique-id'
ssrEnvironment.hot.send('request', serialize({ req, uniqueId }))
const response = await new Promise((resolve) => {
  ssrEnvironment.hot.on('response', (data) => {
    data = deserialize(data)
    if (data.uniqueId === uniqueId) {
      resolve(data.res)
    }
  })
})

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)

import.meta.hot.on('request', (data) => {
  const { req, uniqueId } = deserialize(data)
  const res = handler(req)
  import.meta.hot.send('response', serialize({ res: res, uniqueId }))
})

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

## Umgebungen während des Builds

In der CLI werden beim Aufruf von `vite build` und `vite build --ssr` aus Gründen der Abwärtskompatibilität weiterhin nur die Client- und nur die ssr-Umgebung gebaut.

Wenn die Option `builder` gesetzt ist (auch auf ein leeres Objekt `{}`, was `vite build --app` tut), baut `vite build` stattdessen die gesamte Anwendung. In einer zukünftigen Major-Version wird dies zum Standard. In diesem Modus erstellt Vite eine `ViteBuilder`-Instanz (das Build-Zeit-Gegenstück zu einem `ViteDevServer`) und verwendet sie, um alle konfigurierten Umgebungen für die Produktion zu bauen. Standardmäßig werden die Umgebungen nacheinander in der Reihenfolge des `environments`-Eintrags gebaut.

### Den App-Build mit `builder.buildApp` konfigurieren

Ein Framework oder Benutzer kann über die Option `builder.buildApp` steuern, wie die Umgebungen gebaut werden. Sie erhält die `ViteBuilder`-Instanz (im folgenden Beispiel `builder` genannt) und ist dafür verantwortlich, jede Umgebung zu bauen, zum Beispiel einige davon parallel:

```js [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  builder: {
    buildApp: async (builder) => {
      const environments = Object.values(builder.environments)
      await Promise.all(
        environments.map((environment) => builder.build(environment)),
      )
    },
  },
})
```

### Der Plugin-Hook `buildApp`

- **Typ:** `(this: MinimalPluginContextWithoutEnvironment, builder: ViteBuilder) => Promise<void>`
- **Art:** `async`, `sequential`
- **Geltungsbereich:** [Global](/guide/api-environment-plugins#per-environment-hooks-and-global-hooks)

Neben der Konfigurationsoption `builder.buildApp` können Plugins einen `buildApp`-Hook definieren, um sich am App-Build zu beteiligen. Die Konfigurationsoption und die Plugin-Hooks laufen in einer festgelegten Reihenfolge: zuerst Hooks mit der Reihenfolge `'pre'` oder `null`, dann das konfigurierte `builder.buildApp` und anschließend Hooks mit der Reihenfolge `'post'`. Innerhalb eines Hooks gibt `environment.isBuilt` an, ob eine Umgebung bereits gebaut wurde, sodass ein Plugin vermeiden kann, sie doppelt zu bauen.

### Programmatisch bauen mit `createBuilder`

Um einen App-Build aus Ihrem eigenen Code auszulösen, verwenden Sie `createBuilder` statt der eigenständigen Funktion `build`. `createBuilder` ist das Build-Zeit-Gegenstück zu `createServer`: Es löst die Konfiguration auf und gibt einen `ViteBuilder` zurück, dessen Methode `buildApp` jede konfigurierte Umgebung baut. Mit `builder.build(environment)` können Sie auch eine einzelne Umgebung bauen.

```js [build.js]
import { createBuilder } from 'vite'

const builder = await createBuilder()
await builder.buildApp()
```

`createBuilder` löst die eigenständige Funktion `build` für umgebungsbewusste Builds ab. `build` funktioniert weiterhin als einfacher Einstiegspunkt für die oben beschriebenen klassischen Builds nur für den Client bzw. nur für SSR, kann aber keine beliebigen Umgebungen bauen. `builder.buildApp()` auszuführen ist das programmatische Gegenstück zu `vite build --app`.

## Umgebungsunabhängiger Code

Die meiste Zeit wird die aktuelle `Environment`-Instanz als Teil des Kontexts des ausgeführten Codes verfügbar sein, so dass die Notwendigkeit, auf sie über `server.environments` zuzugreifen, selten sein sollte. Zum Beispiel wird die Umgebung innerhalb von Plugin-Hooks als Teil des `PluginContext` offengelegt, so dass auf sie mit `this.environment` zugegriffen werden kann. Siehe [Environment API for Plugins](./api-environment-plugins.md), um zu erfahren, wie man umweltbewusste Plugins erstellt.
