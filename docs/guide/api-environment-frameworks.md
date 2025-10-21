# Environment API für Frameworks

:::warning Experimentell
Die Environment-API befindet sich noch in der Testphase. Wir werden die APIs während Vite 6 stabil halten, damit das Ökosystem damit experimentieren und darauf aufbauen kann. Wir planen, diese neuen APIs mit potenziellen grundlegenden Änderungen in Vite 7 zu stabilisieren.
Ressourcen:

- [Feedback-Diskussion](https://github.com/vitejs/vite/discussions/16358), wo wir Feedback zu den neuen APIs sammeln.
- [Environment API PR](https://github.com/vitejs/vite/pull/16471), wo die neuen APIs implementiert und überprüft wurden.

Bitte teilen Sie uns Ihr Feedback mit.
:::

## Umgebungen und Frameworks

Die implizite `ssr`-Umgebung und andere Nicht-Client-Umgebungen verwenden während der Entwicklung standardmäßig ein `RunnableDevEnvironment`. Während dies voraussetzt, dass die Laufzeit mit der des Vite-Servers übereinstimmt, funktioniert dies ähnlich mit `ssrLoadModule` und erlaubt es Frameworks zu migrieren und HMR für ihre SSR-Entwicklungsgeschichte zu aktivieren. Man kann jede lauffähige Umgebung mit einer `isRunnableDevEnvironment` Funktion überwachen.

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
Der `Runner` wird eifrig ausgewertet, wenn das erste Mal auf ihn zugegriffen wird. Achten Sie darauf, dass Vite die Source-Map-Unterstützung aktiviert, wenn der `Runner` erstellt wird, indem Sie `process.setSourceMapsEnabled` aufrufen oder `Error.prepareStackTrace` überschreiben, wenn es nicht verfügbar ist.
:::

## Standardwert `RunnableDevEnvironment`

Ausgehend von einem Vite-Server, der im Middleware-Modus konfiguriert ist, wie in der [SSR-Einrichtungsanleitung] (/guide/ssr#setting-up-the-dev-server) beschrieben, implementieren wir die SSR-Middleware mithilfe der Umgebungs-API. Die Fehlerbehandlung wird weggelassen.

```js
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const server = await createServer({
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
const environment = server.environments.node

app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  // 1. Read index.html
  const indexHtmlPath = path.resolve(__dirname, 'index.html')
  let template = fs.readFileSync(indexHtmlPath, 'utf-8')

  // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
  //    and also applies HTML transforms from Vite plugins, e.g. global
  //    preambles from @vitejs/plugin-react
  template = await server.transformIndexHtml(url, template)

  // 3. Load the server entry. import(url) automatically transforms
  //    ESM source code to be usable in Node.js! There is no bundling
  //    required, and provides full HMR support.
  const { render } = await environment.runner.import('/src/entry-server.js')

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

## Laufzeit-agnostische SSR

Da das `RunnableDevEnvironment` nur verwendet werden kann, um den Code in der gleichen Laufzeit wie der Vite-Server auszuführen, benötigt es eine Laufzeit, die den Vite-Server ausführen kann (eine Laufzeit, die mit Node.js kompatibel ist). Dies bedeutet, dass Sie das rohe `DevEnvironment` verwenden müssen, um es laufzeitunabhängig zu machen.

:::info `FetchableDevEnvironment` Vorschlag

Der ursprüngliche Vorschlag hatte eine „run“-Methode für die „DevEnvironment“-Klasse, die es den Verbrauchern erlauben würde, einen Import auf der Läuferseite aufzurufen, indem sie die Option „transport“ verwenden. Während unserer Tests haben wir festgestellt, dass die API nicht universell genug war, um sie zu empfehlen. Im Moment suchen wir nach Feedback zu [dem Vorschlag `FetchableDevEnvironment`] (https://github.com/vitejs/vite/discussions/18191).

:::

RunnableDevEnvironment“ hat eine Funktion ‚runner.import‘, die den Wert des Moduls zurückgibt. Diese Funktion ist jedoch in der rohen Entwicklungsumgebung nicht verfügbar und erfordert, dass der Code, der die APIs der Vite verwendet, und die Benutzermodule entkoppelt werden.

Das folgende Beispiel verwendet zum Beispiel den Wert des Benutzermoduls aus dem Code, der die APIs der Vite verwendet:

```ts
// code using the Vite's APIs
import { createServer } from 'vite'

const server = createServer()
const ssrEnvironment = server.environment.ssr
const input = {}

const { createHandler } = await ssrEnvironment.runner.import('./entry.js')
const handler = createHandler(input)
const response = handler(new Request('/'))

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

Wenn Ihr Code in der gleichen Laufzeit wie die Benutzermodule ausgeführt werden kann (d.h. er ist nicht auf Node.js-spezifische APIs angewiesen), können Sie ein virtuelles Modul verwenden. Bei diesem Ansatz entfällt die Notwendigkeit, auf den Wert vom Code aus über die APIs von Vite zuzugreifen.

```ts
// code using the Vite's APIs
import { createServer } from 'vite'

const server = createServer({
  plugins: [
    // a plugin that handles `virtual:entrypoint`
    {
      name: 'virtual-module',
      /* plugin implementation */
    },
  ],
})
const ssrEnvironment = server.environment.ssr
const input = {}

// use exposed functions by each environment factories that runs the code
// check for each environment factories what they provide
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  ssrEnvironment.runner.import('virtual:entrypoint')
} else if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Unsupported runtime for ${ssrEnvironment.name}`)
}

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)
const response = handler(new Request('/'))

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

const server = createServer({
  plugins: [
    // a plugin that handles `virtual:entrypoint`
    {
      name: 'virtual-module',
      /* plugin implementation */
    },
  ],
})
const ssrEnvironment = server.environment.ssr
const input = {}

// use exposed functions by each environment factories that runs the code
// check for each environment factories what they provide
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  ssrEnvironment.runner.import('virtual:entrypoint')
} else if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Unsupported runtime for ${ssrEnvironment.name}`)
}

const req = new Request('/')

const uniqueId = 'a-unique-id'
ssrEnvironment.send('request', serialize({ req, uniqueId }))
const response = await new Promise((resolve) => {
  ssrEnvironment.on('response', (data) => {
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

const response = handler(new Request('/'))

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

Wenn `builder` nicht `undefined` ist (oder wenn `vite build --app` aufgerufen wird), wird `vite build` stattdessen die gesamte Anwendung bauen. Dies würde später in einem zukünftigen Major zum Standard werden. Eine `ViteBuilder`-Instanz wird erstellt (zur Build-Zeit äquivalent zu einem `ViteDevServer`), um alle konfigurierten Umgebungen für die Produktion zu erstellen. Standardmäßig wird die Erstellung der Umgebungen in der Reihenfolge des Eintrags „environments“ durchgeführt. Ein Framework oder Benutzer kann weiter konfigurieren, wie die Umgebungen gebaut werden:

```js
export default {
  builder: {
    buildApp: async (builder) => {
      const environments = Object.values(builder.environments)
      return Promise.all(
        environments.map((environment) => builder.build(environment)),
      )
    },
  },
}
```

## Umgebungsunabhängiger Code

Die meiste Zeit wird die aktuelle `Environment`-Instanz als Teil des Kontexts des ausgeführten Codes verfügbar sein, so dass die Notwendigkeit, auf sie über `server.environments` zuzugreifen, selten sein sollte. Zum Beispiel wird die Umgebung innerhalb von Plugin-Hooks als Teil des `PluginContext` offengelegt, so dass auf sie mit `this.environment` zugegriffen werden kann. Siehe [Environment API for Plugins](./api-environment-plugins.md), um zu erfahren, wie man umweltbewusste Plugins erstellt.
