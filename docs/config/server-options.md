# Server-Optionen

## server.host

- **Typ:** `string | boolean`
- **Standardwert:** `'localhost'`

Geben Sie an, auf welchen IP-Adressen der Server lauschen soll.
Setzen Sie dies auf `0.0.0.0` oder `true`, um auf allen Adressen zu lauschen, einschließlich LAN- und öffentlichen Adressen.

Dies kann über die CLI mit `--host 0.0.0.0` oder `--host` festgelegt werden.

:::tip HINWEIS

Es gibt Fälle, in denen andere Server möglicherweise anstelle von Vite antworten.

Der erste Fall tritt auf, wenn `localhost` verwendet wird. Node.js unter v17 ordnet die Ergebnisse der DNS-aufgelösten Adressen standardmäßig neu an. Beim Zugriff auf `localhost` verwenden Browser DNS, um die Adresse aufzulösen, und diese Adresse kann von der Adresse abweichen, auf die Vite hört. Vite gibt die aufgelöste Adresse aus, wenn sie sich unterscheidet.

Sie können [`dns.setDefaultResultOrder('verbatim')`](https://nodejs.org/api/dns.html#dns_dns_setdefaultresultorder_order) festlegen, um das Neuanordnungsverhalten zu deaktivieren. Vite gibt die Adresse dann als `localhost` aus.

```js
// vite.config.js
import { defineConfig } from 'vite'
import dns from 'dns'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  // ausgelassen
})
```

Der zweite Fall tritt auf, wenn Platzhalterhosts (z. B. `0.0.0.0`) verwendet werden. Dies liegt daran, dass Server, die auf Nicht-Platzhalterhosts lauschen, Vorrang vor denen haben, die auf Platzhalterhosts lauschen.

:::

::: tip Zugriff auf den Server in WSL2 von Ihrem LAN aus

Wenn Sie Vite unter WSL2 ausführen, reicht es nicht aus, `host: true` festzulegen, um auf den Server von Ihrem LAN aus zuzugreifen.
Weitere Informationen finden Sie im [WSL-Dokument](https://learn.microsoft.com/en-us/windows/wsl/networking#accessing-a-wsl-2-distribution-from-your-local-area-network-lan).

:::

## server.port

- **Typ:** `number`
- **Standardwert:** `5173`

Geben Sie den Serverport an. Beachten Sie, dass Vite automatisch den nächsten verfügbaren Port ausprobiert, wenn der Port bereits verwendet wird. Daher ist dies möglicherweise nicht der tatsächliche Port, auf den der Server hört.

## server.strictPort

- **Typ:** `boolean`

Legen Sie fest, dass der Server bei Verwendung des Ports bereits in Verwendung ist, anstatt automatisch den nächsten verfügbaren Port auszuprobieren.

## server.https

- **Typ:** `https.ServerOptions`

Aktivieren Sie TLS + HTTP/2. Beachten Sie, dass dies auf TLS herabgestuft wird, wenn die [`server.proxy`-Option](#server-proxy) ebenfalls verwendet wird.

Der Wert kann auch ein [Optionsobjekt](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) sein, das an `https.createServer()` übergeben wird.

Ein gültiges Zertifikat ist erforderlich. Für eine grundlegende Einrichtung können Sie [@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl) zu den Projekt-Plugins hinzufügen, das automatisch ein selbstsigniertes Zertifikat erstellt und zwischenspeichert. Wir empfehlen jedoch, eigene Zertifikate zu erstellen.

## server.open

- **Typ:** `boolean | string`

Öffnen Sie die App automatisch im Browser beim Start des Servers. Wenn der Wert eine Zeichenfolge ist, wird er als Pfadname der URL verwendet. Wenn Sie den Server in einem bestimmten Browser öffnen möchten, den Sie mögen, können Sie die Umgebungsvariable `process.env.BROWSER` festlegen (z. B. `firefox`). Sie können auch `process.env.BROWSER_ARGS` festlegen, um zusätzliche Argumente zu übergeben (z. B. `--incognito`).

`BROWSER` und `BROWSER_ARGS` sind auch spezielle Umgebungsvariablen, die in der `.env`-Datei festgelegt werden können, um sie zu konfigurieren. Weitere Details finden Sie in [dem `open`-Paket](https://github.com/sindresorhus/open#app).

**Beispiel:**

```js
export default defineConfig({
  server: {
    open: '/docs/index.html'
  }
})
```

## server.proxy

- **Typ:** `Record<string, string | ProxyOptions>`

Konfigurieren Sie benutzerdefinierte Proxyregeln für den Entwicklungsserver. Erwartet ein Objekt mit `{ Schlüssel: Optionen }`-Paaren. Alle Anfragen, die mit diesem Schlüssel beginnen, werden an das angegebene Ziel weitergeleitet. Wenn der Schlüssel mit `^` beginnt, wird er als `RegExp` interpretiert. Die Option `configure` kann verwendet werden, um auf die Proxyinstanz zuzugreifen.

Beachten Sie, dass bei Verwendung von nicht relativem [`base`](/config/shared-options.md#base) jeder Schlüssel mit diesem `base` vorangestellt werden muss.

Erweitert [`http-proxy`](https://github.com/http-party/node-http-proxy#options). Weitere Optionen finden Sie [hier](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/middlewares/proxy.ts#L12).

In einigen Fällen möchten Sie möglicherweise auch den zugrunde liegenden Entwicklungsserver konfigurieren (z. B. um benutzerdefinierte Middlewares zur internen [connect](https://github.com/senchalabs/connect)-App hinzuzufügen). Um dies zu tun, müssen Sie Ihr eigenes [Plugin](/guide/using-plugins.html) schreiben und die Funktion [configureServer](/guide/api-plugin.html#configureserver) verwenden.

**Beispiel:**

```js
export default defineConfig({
  server: {
    proxy: {
      // Zeichenfolgen-Schnellzugriff: http://localhost:5173/foo -> http://localhost:4567/foo
      '/foo': 'http://localhost:4567',
      // Mit Optionen: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // Mit RegEx: http://localhost:5173/fallback/ -> http://jsonplaceholder.typicode.com/
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, '')
      },
      // Verwendung der Proxyinstanz
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy wird eine Instanz von 'http-proxy' sein
        }
      },
      // Proxying von Websockets oder socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
      '/socket.io': {
        target: 'ws://localhost:5174',
        ws: true
      }
    }
  }
})
```

## server.cors

- **Typ:** `boolean | CorsOptions`

Konfigurieren Sie CORS für den Entwicklungsserver. Dies ist standardmäßig aktiviert und erlaubt jeden Ursprung. Übergeben Sie ein [Optionsobjekt](https://github.com/expressjs/cors#configuration-options), um das Verhalten fein abzustimmen, oder `false`, um es zu deaktivieren.

## server.headers

- **Typ:** `OutgoingHttpHeaders`

Legen Sie die Serverantwortheader fest.

## server.hmr

- **Typ:** `boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }`

Deaktivieren oder konfigurieren Sie die HMR-Verbindung (in Fällen, in denen das HMR-WebSocket eine andere Adresse als der HTTP-Server verwenden muss).

Legen Sie `server.hmr.overlay` auf `false`, um das Serverfehler-Overlay zu deaktivieren.

`clientPort` ist eine erweiterte Option, die den Port nur auf der Clientseite überschreibt und es Ihnen ermöglicht, das WebSocket auf einem anderen Port als der Clientcode danach suchen lässt.

Wenn `server.hmr.server` definiert ist, wird Vite die HMR-Verbindungsanfragen über den bereitgestellten Server verarbeiten. Wenn sich Vite nicht im Middleware-Modus befindet, wird Vite versuchen, HMR-Verbindungsanfragen über den vorhandenen Server zu verarbeiten. Dies kann hilfreich sein, wenn Sie selbstsignierte Zertifikate verwenden oder Vite über ein Netzwerk auf einem einzelnen Port verfügbar machen möchten.

Schauen Sie sich [`vite-setup-catalogue`](https://github.com/sapphi-red/vite-setup-catalogue) für einige Beispiele an.

:::tip HINWEIS

Mit der Standardkonfiguration wird erwartet, dass Reverse-Proxys vor Vite WebSocket-Proxying unterstützen. Wenn der Vite HMR-Client keine Verbindung zum WebSocket herstellen kann, fällt der Client auf die direkte Verbindung zum Vite HMR-Server zurück und umgeht die Reverse-Proxys:

```
Direkter WebSocket-Verbindungsrückfall. Weitere Informationen finden Sie unter https://vitejs.dev/config/server-options.html#server-hmr, um den vorherigen Verbindungsfehler zu entfernen.
```

Der Fehler, der im Browser angezeigt wird, wenn der Rückfall erfolgt, kann ignoriert werden. Um den Fehler zu vermeiden, indem Sie die Reverse-Proxys direkt umgehen, können Sie entweder:

- Konfigurieren Sie den Reverse-Proxy so, dass er auch WebSocket proxyt
- Setzen Sie [`server.strictPort = true`](#server-strictport) und legen Sie `server.hmr.clientPort` auf denselben Wert wie `server.port`
- Legen Sie `server.hmr.port` auf einen anderen Wert als [`server.port`](#server-port)

:::

## server.warmup

- **Typ:** `{ clientFiles?: string[], ssrFiles?: string[] }`
- **Verwandt:** [Aufwärmen häufig verwendeter Dateien](/guide/performance.html#warm-up-frequently-used-files)

Aufwärmen der zu transformierenden Dateien und Zwischenspeichern der Ergebnisse im Voraus. Dies verbessert das anfängliche Laden der Seite bei Serverstarts und verhindert Transformations-Wasserfälle.

`clientFiles` sind Dateien, die nur im Client verwendet werden, während `ssrFiles` Dateien sind, die nur in SSR verwendet werden. Sie akzeptieren ein Array von Dateipfaden oder [`fast-glob`](https://github.com/mrmlnc/fast-glob) Mustern relativ zum `root`.

Stellen Sie sicher, dass Sie nur Dateien hinzufügen, die häufig verwendet werden, um den Vite Dev Server beim Start nicht zu überlasten.

```js
export default defineConfig({
  server: {
    warmup: {
      clientFiles: ['./src/components/*.vue', './src/utils/big-utils.js'],
      ssrFiles: ['./src/server/modules/*.js'],
    },
  },
})
```

## server.watch

- **Typ:** `object | null`

Optionen für den Dateisystem-Watcher, die an [chokidar](https://github.com/paulmillr/chokidar#api) weitergegeben werden.

Der Vite Server Watcher überwacht das `root` und überspringt standardmäßig die Verzeichnisse `.git/`, `node_modules/`, Vites `cacheDir` und Vites `build.outDir`. Wenn eine überwachte Datei aktualisiert wird, wendet Vite HMR an und aktualisiert nur bei Bedarf die Seite.

Wenn auf `null` gesetzt, dann werden keine Dateien überwacht. `server.watcher` stellt einen kompatiblen Ereignis-Emitter zur Verfügung, aber der Aufruf von `add` oder `unwatch` hat keine Wirkung.

::: warning Überwachen von Dateien in `node_modules`

Es ist derzeit nicht möglich, Dateien und Pakete in `node_modules` zu überwachen. Für weitere Fortschritte und Umwege hierzu können Sie [issue #8619](https://github.com/vitejs/vite/issues/8619) verfolgen.

:::

::: warning Verwendung von Vite unter Windows Subsystem for Linux (WSL) 2

Wenn Sie Vite unter WSL2 ausführen, funktioniert das Dateisystem-Watching nicht, wenn eine Datei von Windows-Anwendungen (nicht WSL2-Prozess) bearbeitet wird. Dies liegt an [einer WSL2-Beschränkung](https://github.com/microsoft/WSL/issues/4739). Dies gilt auch für die Verwendung von Docker mit einem WSL2-Backend.

Um das Problem zu beheben, können Sie Folgendes tun:

- **Empfohlen**: Verwenden Sie WSL2-Anwendungen zum Bearbeiten Ihrer Dateien.
  - Es wird auch empfohlen, den Projektordner aus einem Windows-Dateisystem zu verschieben. Der Zugriff auf Windows-Dateisysteme von WSL2 aus ist langsam. Durch Entfernen dieses Overheads wird die Leistung verbessert.
- Setzen Sie `{ usePolling: true }`.
  - Beachten Sie, dass [`usePolling` zu hoher CPU-Auslastung führt](https://github.com/paulmillr/chokidar#performance).

:::

## server.middlewareMode

- **Typ:** `boolean`
- **Standardwert:** `false`

Erstellen Sie den Vite-Server im Middleware-Modus.

- **Verwandte Themen:** [appType](./shared-options#apptype), [SSR - Einrichten des Entwicklungsservers](/guide/ssr#setting-up-the-dev-server)

- **Beispiel:**

```js
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()

  // Erstellen Sie den Vite-Server im Middleware-Modus
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom' // Vites Standard-HTML-Handling-Middlewares nicht einschließen
  })
  // Verwenden Sie Vites Connect-Instanz als Middleware
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // Da `appType` `'custom'` ist, sollte die Antwort hier bedient werden.
    // Hinweis: Wenn `appType` `'spa'` oder `'mpa'` ist, fügt Vite Middlewares hinzu, um
    // HTML-Anfragen und 404er zu behandeln, sodass Benutzer-Middlewares hinzugefügt werden sollten
    // vor Vites Middlewares, um wirksam zu werden.
  })
}

createServer()
```

## server.fs.strict

- **Typ:** `boolean`
- **Standardwert:** `true` (standardmäßig aktiviert seit Vite 2.7)

Beschränken Sie das Servieren von Dateien außerhalb des Arbeitsbereichs.

## server.fs.allow

- **Typ:** `string[]`

Beschränken Sie Dateien, die über `/@fs/` serviert werden können. Wenn `server.fs.strict` auf `true` gesetzt ist, führt der Zugriff auf Dateien außerhalb dieser Verzeichnisliste, die nicht von einer erlaubten Datei importiert werden, zu einem 403-Fehler.

Sowohl Verzeichnisse als auch Dateien können angegeben werden.

Vite sucht nach dem Stammverzeichnis des potenziellen Arbeitsbereichs und verwendet es als Standardwert. Ein gültiger Arbeitsbereich erfüllt die folgenden Bedingungen, andernfalls wird auf das [Projektstammverzeichnis](/guide/#index-html-and-project-root) zurückgegriffen.

- enthält das Feld `workspaces` in `package.json`
- enthält eine der folgenden Dateien
  - `lerna.json`
  - `pnpm-workspace.yaml`

Akzeptiert einen Pfad, um das benutzerdefinierte Arbeitsverzeichnis anzugeben. Dies kann ein absoluter Pfad oder ein Pfad relativ zum [Projektstammverzeichnis](/guide/#index-html-and-project-root) sein. Zum Beispiel:

```js
export default defineConfig({
  server: {
    fs: {
      // Erlaube das Servieren von Dateien vom Stammverzeichnis des Projekts bis zu einer Ebene höher
      allow: ['..']
    }
  }
})
```

Wenn `server.fs.allow` angegeben ist, wird die automatische Suche nach dem Arbeitsbereichsstamm deaktiviert. Um das ursprüngliche Verhalten zu erweitern, wird ein Dienstprogramm `searchForWorkspaceRoot` zur Verfügung gestellt:

```js
import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  server: {
    fs: {
      allow: [
        // Suchen Sie nach dem Arbeitsbereichsstamm
        searchForWorkspaceRoot(process.cwd()),
        // Ihre benutzerdefinierten Regeln
        '/path/to/custom/allow_directory',
        '/path/to/custom/allow_file.demo'
      ]
    }
  }
})
```

## server.fs.deny

- **Typ:** `string[]`
- **Standardwert:** `['.env', '.env.*', '*.{crt,pem}']`

Blockliste für sensitive Dateien, die vom Vite-Entwicklungsserver nicht serviert werden dürfen. Dies hat eine höhere Priorität als [`server.fs.allow`](#server-fs-allow). [Picomatch-Muster](https://github.com/micromatch/picomatch#globbing-features) werden unterstützt.

## server.origin

- **Typ:** `string`

Definiert den Ursprung der generierten Asset-URLs während der Entwicklung.

```js
export default defineConfig({
  server: {
    origin: 'http://127.0.0.1:8080'
  }
})
```

## server.sourcemapIgnoreList

- **Typ:** `false | (sourcePath: string, sourcemapPath: string) => boolean`
- **Standardwert:** `(sourcePath) => sourcePath.includes('node_modules')`

Gibt an, ob Quelldateien in der Server-Sourcemap ignoriert werden sollen, die verwendet wird, um die [`x_google_ignoreList`-Source-Map-Erweiterung](https://developer.chrome.com/blog/devtools-better-angular-debugging/#the-x_google_ignorelist-source-map-extension) zu füllen.

`server.sourcemapIgnoreList` entspricht [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) für den Entwicklungsserver. Ein Unterschied zwischen den beiden Konfigurationsoptionen besteht darin, dass die Rollup-Funktion für `sourcePath` einen relativen Pfad aufruft, während `server.sourcemapIgnoreList` mit einem absoluten Pfad aufgerufen wird. Während der Entwicklung haben die meisten Module die Karte und die Quelle im selben Verzeichnis, sodass der relative Pfad für `sourcePath` der Dateiname selbst ist. In diesen Fällen erleichtern absolute Pfade ihre Verwendung.

Standardmäßig werden alle Pfade, die `node_modules` enthalten, ausgeschlossen. Sie können `false` übergeben, um dieses Verhalten zu deaktivieren, oder, um die volle Kontrolle zu haben, eine Funktion, die den Quellpfad und den Sourcemap-Pfad akzeptiert und zurückgibt, ob der Quellpfad ignoriert werden soll.

```js
export default defineConfig({
  server: {
    // Dies ist der Standardwert und wird alle Dateien mit 'node_modules'
    // in ihrem Pfad zur Ignorierungsliste hinzufügen.
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes('node_modules')
    }
  }
};
```

:::tip HINWEIS
[`server.sourcemapIgnoreList`](#server-sourcemapignorelist) und [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) müssen unabhängig voneinander festgelegt werden. `server.sourcemapIgnoreList` ist eine serverseitige Konfiguration und erhält ihren Standardwert nicht aus den definierten Rollup-Optionen.
:::
