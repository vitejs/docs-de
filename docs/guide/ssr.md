# Serverseitiges Rendern (SSR)

:::tip HINWEIS
SSR bezieht sich speziell auf Frontend-Frameworks (zum Beispiel React, Preact, Vue und Svelte), die die Ausführung derselben Anwendung in Node.js unterstützen, sie in HTML vorrendern und schließlich im Client hydratisieren. Wenn Sie nach Integration mit herkömmlichen serverseitigen Frameworks suchen, werfen Sie stattdessen einen Blick auf den [Leitfaden zur Backend-Integration](./backend-integration).

Der folgende Leitfaden setzt auch voraus, dass Sie bereits Erfahrung im Umgang mit SSR in Ihrem Framework Ihrer Wahl haben und konzentriert sich nur auf Vite-spezifische Integrationsdetails.
:::

:::warning Niedrigstufige API
Dies ist eine niedrigstufige API, die für Bibliotheks- und Framework-Autoren gedacht ist. Wenn Ihr Ziel darin besteht, eine Anwendung zu erstellen, sollten Sie zuerst die höherstufigigen SSR-Plugins und Tools im [Awesome Vite SSR-Abschnitt](https://github.com/vitejs/awesome-vite#ssr) überprüfen. Viele Anwendungen werden jedoch erfolgreich direkt auf der nativen niedrigstufigen API von Vite erstellt.
:::

:::tip HILFE
Bei Fragen steht Ihnen die Community normalerweise im [Vite Discord-Kanal für SSR](https://discord.gg/PkbxgzPhJv) hilfreich zur Seite.
:::

## Beispielprojekte

Vite bietet integrierte Unterstützung für serverseitiges Rendering (SSR). [`create-vite-extra`](https://github.com/bluwy/create-vite-extra) enthält Beispiel-SSR-Setups, die Sie als Referenz für diesen Leitfaden verwenden können:

- [Vue 3](https://github.com/vitejs/vite-plugin-vue/tree/main/playground/ssr-vue)
- [React](https://github.com/vitejs/vite-plugin-react/tree/main/playground/ssr-react)

## Dateistruktur

Eine typische SSR-Anwendung hat die folgende Dateistruktur:

```
- index.html
- server.js # Hauptanwendungsserver
- src/
  - main.js          # Exportiert umgebungsunabhängigen (universalen) App-Code
  - entry-client.js  # Bindet die App an ein DOM-Element
  - entry-server.js  # Rendert die App mit der SSR-API des Frameworks
```

Die `index.html` muss auf `entry-client.js` verweisen und einen Platzhalter enthalten, in den das servergerenderte Markup eingefügt werden soll:

```html
<div id="app"><!--ssr-outlet--></div>
<script type="module" src="/src/entry-client.js"></script>
```

Sie können jeden gewünschten Platzhalter anstelle von `<!--ssr-outlet-->` verwenden, solange er präzise ersetzt werden kann.

## Bedingte Logik

Wenn Sie bedingte Logik basierend auf SSR gegenüber Client ausführen müssen, können Sie folgendes verwenden:

```js
if (import.meta.env.SSR) {
  // ... serverseitige Logik
}
```

Dies wird während des Builds statisch ersetzt und ermöglicht das Entfernen von ungenutzten Verzweigungen (tree-shaking).

## Einrichten des Entwicklungsservers

Wenn Sie eine SSR-Anwendung erstellen, möchten Sie wahrscheinlich die volle Kontrolle über Ihren Hauptserver haben und Vite von der Produktionsumgebung entkoppeln. Es wird daher empfohlen, Vite im Middleware-Modus zu verwenden. Hier ist ein Beispiel mit [Express](https://expressjs.com/):

**server.js**

```js{15-18}
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // Erstellen Sie den Vite-Server im Middleware-Modus und konfigurieren Sie den App-Typ als
  // 'custom', um die eigene HTML-Bereitstellungslogik von Vite zu deaktivieren, damit der übergeordnete Server
  // die Kontrolle übernehmen kann
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // Verwenden Sie die Connect-Instanz von vite als Middleware. Wenn Sie Ihren eigenen
  // Express-Router (express.Router()) verwenden, sollten Sie router.use
  // Wenn der Server neu startet (z.B. nachdem der Benutzer die
  // vite.config.js), ist `vite.middlewares` immer noch die gleiche
  // Referenz (mit einem neuen internen Stapel von Vite und Plugin-injected
  // Middlewares). Das Folgende ist auch nach Neustarts gültig.
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // Stellen Sie die index.html bereit - wir werden diese als Nächstes angehen
  })

  app.listen(5173)
}

createServer()
```

Hierbei handelt es sich um eine Instanz von [ViteDevServer](./api-javascript#vitedevserver). `vite.middlewares` ist eine [Connect](https://github.com/senchalabs/connect)-Instanz, die als Middleware in jedem connect-kompatiblen Node.js-Framework verwendet werden kann.

Der nächste Schritt besteht darin, den Handler `*` zu implementieren, um servergerendertes HTML zu servieren:

```js
app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  try {
    // 1. Lesen Sie die index.html
    let template = fs.readFileSync(
      path.resolve(__dirname, 'index.html'),
      'utf-8',
    )

    // 2. Wenden Sie Vite-HTML-Transformationen an. Dadurch wird der Vite HMR-Client eingefügt,
    //    und es werden auch HTML-Transformationen von Vite-Plugins angewendet, z. B. globale
    //    Präambeln von @vitejs/plugin-react
    template = await vite.transformIndexHtml(url, template)

    // 3. Laden Sie den Server-Einstieg. ssrLoadModule transformiert automatisch
    //    ESM-Quellcode, damit er in Node.js verwendbar ist! Es ist kein Bündeln erforderlich und bietet
    //    effiziente Ungültigmachung ähnlich wie HMR.
    const { render } = await vite.ssrLoadModule('/src/entry-server.js')

    // 4. Rendern Sie das App-HTML. Dies setzt voraus, dass die exportierte Funktion von entry-server.js
    //     `render` die entsprechenden Framework-SSR-APIs aufruft, z. B. ReactDOMServer.renderToString()
    const appHtml = await render(url)

    // 5. Fügen Sie das vom App gerenderte HTML in die Vor

lage ein.
    const html = template.replace(`<!--ssr-outlet-->`, appHtml)

    // 6. Senden Sie das gerenderte HTML zurück.
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    // Wenn ein Fehler auftritt, lässt Vite den Stapelverfolgung korrigieren, damit er auf Ihren tatsächlichen Quellcode verweist.
    vite.ssrFixStacktrace(e)
    next(e)
  }
})
```

Das `dev`-Skript in `package.json` sollte ebenfalls geändert werden, um stattdessen das Server-Skript zu verwenden:

```diff
  "scripts": {
-   "dev": "vite"
+   "dev": "node server"
  }
```

## Erstellung für die Produktion

Um ein SSR-Projekt für die Produktion bereitzustellen, müssen wir Folgendes tun:

1. Erstellen Sie einen Client-Build wie gewohnt.
2. Erstellen Sie einen SSR-Build, der direkt über `import()` geladen werden kann, sodass wir nicht den `ssrLoadModule` von Vite durchlaufen müssen.

Unsere Skripts in `package.json` sehen folgendermaßen aus:

```json
{
  "scripts": {
    "dev": "node server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --outDir dist/server --ssr src/entry-server.js"
  }
}
```

Beachten Sie die `--ssr`-Flagge, die darauf hinweist, dass dies ein SSR-Build ist. Sie sollte auch den SSR-Einstieg angeben.

Dann müssen wir in `server.js` einige spezifische Logik für die Produktion hinzufügen, indem wir `process.env.NODE_ENV` überprüfen:

- Statt der Wurzel `index.html` verwenden wir stattdessen `dist/client/index.html` als Vorlage, da diese die richtigen Asset-Links zum Client-Build enthält.

- Statt `await vite.ssrLoadModule('/src/entry-server.js')` verwenden wir stattdessen `import('./dist/server/entry-server.js')` (diese Datei ist das Ergebnis des SSR-Builds).

- Verschieben Sie die Erstellung und alle Verwendungen des `vite`-Entwicklungsservers hinter bedingte Verzweigungen, die nur für die Entwicklung gelten, und fügen Sie statische Dateiserver-Middleware hinzu, um Dateien aus `dist/client` zu servieren.

In den [Beispielprojekten](#example-projects) finden Sie eine funktionierende Einrichtung.

## Generieren von Preload-Direktiven

`vite build` unterstützt die `--ssrManifest`-Flagge, die `.vite/ssr-manifest.json` im Build-Ausgabeverzeichnis generiert:

```diff
- "build:client": "vite build --outDir dist/client",
+ "build:client": "vite build --outDir dist/client --ssrManifest",
```

Das obige Skript generiert jetzt `dist/client/.vite/ssr-manifest.json` für den Client-Build (ja, das SSR-Manifest wird aus dem Client-Build generiert, weil wir Modul-IDs auf Client-Dateien abbilden möchten). Das Manifest enthält Zuordnungen von Modul-IDs zu den zugehörigen Chunks und Asset-Dateien.

Um das Manifest zu nutzen, müssen Frameworks eine Möglichkeit bereitstellen, die Modul-IDs der Komponenten zu sammeln, die während eines Server-Rendervorgangs verwendet wurden.

`@vitejs/plugin-vue` unterstützt dies von Haus aus und registriert automatisch verwendete Komponentenmodul-IDs im zugehörigen Vue-SSR-Kontext:

```js
// src/entry-server.js
const ctx = {}
const html = await vueServerRenderer.renderToString(app, ctx)
// ctx.modules ist jetzt ein Set von Modul-IDs, die während des Renderns verwendet wurden
```

Im Produktionszweig von `server.js` müssen wir das Manifest lesen und an die von `src/entry-server.js` exportierte `render`-Funktion übergeben. Dadurch erhalten wir genügend Informationen, um Preload-Direktiven für Dateien zu erstellen, die von asynchronen Routen verwendet werden! Siehe [Demo-Quellcode](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/src/entry-server.js) für ein vollständiges Beispiel.

## Vorabrendnern / SSG

Wenn die Routen und die für bestimmte Routen benötigten Daten im Voraus bekannt sind, können diese Routen mithilfe derselben Logik wie beim Produktions-SSR im Voraus in statisches HTML vorgerendert werden. Dies kann auch als Form der Generierung von statischen Websites (SSG) angesehen werden. Siehe [Vorabrender-Skript im Demo](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/prerender.js) für ein funktionierendes Beispiel.

## SSR-Externe

Abhängigkeiten werden standardmäßig von Vites SSR-Transformationsmodul-System "externalisiert", wenn SSR ausgeführt wird. Dies beschleunigt sowohl die Entwicklung als auch das Builden.

Wenn eine Abhängigkeit von Vites Pipeline transformiert werden muss, beispielsweise, weil Vite-Funktionen in ihnen untransformiert verwendet werden, können sie zu [`ssr.noExternal`](../config/ssr-options.md#ssr-noexternal) hinzugefügt werden.

Verknüpfte Abhängigkeiten werden standardmäßig nicht externalisiert, um von Vites HMR zu profitieren. Wenn dies nicht gewünscht ist, beispielsweise, um Abhängigkeiten zu testen, als wären sie nicht verknüpft, können Sie sie zu [`ssr.external`](../config/ssr-options.md#ssr-external) hinzufügen.

:::warning Arbeit mit Aliasen
Wenn Sie Alias-Konfigurationen haben, die eine Paketumleitung von einem auf ein

anderes Paket vornehmen, möchten Sie möglicherweise die tatsächlichen `node_modules`-Pakete aliassen, um sie für SSR-externalisierte Abhängigkeiten zu aktivieren. Sowohl [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) als auch [pnpm](https://pnpm.io/aliases/) unterstützen das Aliasieren über das Präfix `npm:`.
:::

## SSR-spezifische Plugin-Logik

Einige Frameworks wie Vue oder Svelte kompilieren Komponenten in verschiedene Formate, basierend auf Client vs. SSR. Um bedingte Transformationen zu unterstützen, gibt Vite den Plugin-Hooks `resolveId`, `load` und `transform` ein zusätzliches `ssr`-Eigenschaft im `options`-Objekt mit.

**Beispiel:**

```js
export function mySSRPlugin() {
  return {
    name: 'my-ssr',
    transform(code, id, options) {
      if (options?.ssr) {
        // Führen Sie Transformationen spezifisch für SSR aus...
      }
    }
  }
}
```

Das `options`-Objekt in `load` und `transform` ist optional, Rollup verwendet dieses Objekt derzeit nicht, kann diese Hooks jedoch in Zukunft um zusätzliche Metadaten erweitern.

:::tip HINWEIS
Vor Vite 2.7 wurde dies mit einem positionalen `ssr`-Parameter an Plugin-Hooks übergeben, anstatt das `options`-Objekt zu verwenden. Alle wichtigen Frameworks und Plugins wurden aktualisiert, aber Sie können veraltete Beiträge finden, die die vorherige API verwenden.
:::

## SSR-Ziel

Das Standardziel für den SSR-Build ist eine Node-Umgebung, aber Sie können den Server auch in einem Web Worker ausführen. Die Paket-Eintragsauflösung ist für jede Plattform unterschiedlich. Sie können das Ziel auf Web Worker setzen, indem Sie `ssr.target` auf `'webworker'` setzen.

## SSR-Bundle

In einigen Fällen, wie bei `webworker`-Laufzeiten, möchten Sie Ihren SSR-Build möglicherweise in eine einzige JavaScript-Datei bündeln. Dieses Verhalten können Sie aktivieren, indem Sie `ssr.noExternal` auf `true` setzen. Dies hat zwei Auswirkungen:

- Alle Abhängigkeiten werden als `noExternal` behandelt.
- Ein Fehler wird ausgelöst, wenn Node.js-Standardmodule importiert werden.

## SSR Resolve Conditions

By default package entry resolution will use the conditions set in [`resolve.conditions`](../config/shared-options.md#resolve-conditions) for the SSR build. You can use [`ssr.resolve.conditions`](../config/ssr-options.md#ssr-resolve-conditions) and [`ssr.resolve.externalConditions`](../config/ssr-options.md#ssr-resolve-externalconditions) to customize this behavior.

## Vite CLI

Die CLI-Befehle `$ vite dev` und `$ vite preview` können auch für SSR-Anwendungen verwendet werden. Sie können Ihre SSR-Middleware dem Entwicklungsserver mit [`configureServer`](/guide/api-plugin#configureserver) und dem Vorschau-Server mit [`configurePreviewServer`](/guide/api-plugin#configurepreviewserver) hinzufügen.

:::tip HINWEIS
Verwenden Sie einen Post-Hook, damit Ihre SSR-Middleware _nach_ den Mittelwaren von Vite ausgeführt wird.
:::
