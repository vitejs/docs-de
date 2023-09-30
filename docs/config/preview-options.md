# Vorschau-Optionen

## preview.host

- **Typ:** `string | boolean`
- **Standardwert:** [`server.host`](./server-options#server-host)

Geben Sie an, auf welchen IP-Adressen der Server lauschen soll.
Setzen Sie dies auf `0.0.0.0` oder `true`, um auf allen Adressen zu lauschen, einschließlich LAN- und öffentlicher Adressen.

Dies kann über die Befehlszeile mit `--host 0.0.0.0` oder `--host` festgelegt werden.

:::tip HINWEIS

Es gibt Fälle, in denen andere Server anstelle von Vite antworten könnten.
Weitere Details finden Sie unter [`server.host`](./server-options#server-host).

:::

## preview.port

- **Typ:** `number`
- **Standardwert:** `4173`

Legen Sie den Serverport fest. Beachten Sie, dass Vite automatisch den nächsten verfügbaren Port versucht, wenn der Port bereits verwendet wird. Daher muss dies nicht unbedingt der tatsächliche Port sein, auf dem der Server lauscht.

**Beispiel:**

```js
export default defineConfig({
  server: {
    port: 3030
  },
  preview: {
    port: 8080
  }
})
```

## preview.strictPort

- **Typ:** `boolean`
- **Standardwert:** [`server.strictPort`](./server-options#server-strictport)

Setzen Sie dies auf `true`, um den Vorgang zu beenden, wenn der Port bereits verwendet wird, anstatt automatisch den nächsten verfügbaren Port zu versuchen.

## preview.https

- **Typ:** `boolean | https.ServerOptions`
- **Standardwert:** [`server.https`](./server-options#server-https)

Aktivieren Sie TLS + HTTP/2. Beachten Sie, dass dies auf TLS allein downgradet, wenn auch die [`server.proxy`-Option](./server-options#server-proxy) verwendet wird.

Der Wert kann auch ein [Optionsobjekt](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) sein, das an `https.createServer()` übergeben wird.

## preview.open

- **Typ:** `boolean | string`
- **Standardwert:** [`server.open`](./server-options#server-open)

Öffnen Sie die App automatisch im Browser beim Start des Servers. Wenn der Wert ein String ist, wird er als Pfadname der URL verwendet. Wenn Sie den Server in einem bestimmten Browser öffnen möchten, können Sie die Umgebungsvariable `process.env.BROWSER` setzen (z.B. `firefox`). Sie können auch `process.env.BROWSER_ARGS` setzen, um zusätzliche Argumente zu übergeben (z.B. `--incognito`).

`BROWSER` und `BROWSER_ARGS` sind auch spezielle Umgebungsvariablen, die Sie in der `.env`-Datei konfigurieren können. Weitere Details finden Sie in [dem `open`-Paket](https://github.com/sindresorhus/open#app).

## preview.proxy

- **Typ:** `Record<string, string | ProxyOptions>`
- **Standardwert:** [`server.proxy`](./server-options#server-proxy)

Konfigurieren Sie benutzerdefinierte Proxyregeln für den Vorschau-Server. Erwartet ein Objekt von `{ Schlüssel: Optionen }`-Paaren. Wenn der Schlüssel mit `^` beginnt, wird er als `RegExp` interpretiert. Die `configure`-Option kann verwendet werden, um auf die Proxyinstanz zuzugreifen.

Verwendet [`http-proxy`](https://github.com/http-party/node-http-proxy). Vollständige Optionen [hier](https://github.com/http-party/node-http-proxy#options).

## preview.cors

- **Typ:** `boolean | CorsOptions`
- **Standardwert:** [`server.cors`](./server-options#server-cors)

Konfigurieren Sie CORS für den Vorschau-Server. Dies ist standardmäßig aktiviert und erlaubt jede Herkunft. Übergeben Sie ein [Optionsobjekt](https://github.com/expressjs/cors#configuration-options), um das Verhalten fein abzustimmen, oder `false`, um es zu deaktivieren.

## preview.headers

- **Typ:** `OutgoingHttpHeaders`

Legen Sie Serverantwort-Header fest.
