# Vorbündeln von Abhängigkeiten

Wenn Sie `vite` zum ersten Mal ausführen, verpackt Vite Ihre Projektabhängigkeiten, bevor Ihre Website lokal geladen wird. Dies geschieht standardmäßig automatisch und transparent.

## Der Grund

Dies ist Vite, das das ausführt, was wir als "Abhängigkeitsvorverpackung" bezeichnen. Dieser Prozess dient zwei Zwecken:

1. **Kompatibilität mit CommonJS und UMD:** Während der Entwicklung stellt Vite alle Codes als nativen ESM (ECMAScript-Modul) bereit. Daher muss Vite Abhängigkeiten, die als CommonJS oder UMD ausgeliefert werden, zuerst in ESM umwandeln.

   Beim Umwandeln von CommonJS-Abhängigkeiten führt Vite eine intelligente Importanalyse durch, sodass benannte Imports zu CommonJS-Modulen wie erwartet funktionieren, selbst wenn die Exporte dynamisch zugewiesen werden (z. B. React):

   ```js
   // funktioniert wie erwartet
   import React, { useState } from 'react'
   ```

2. **Leistung:** Vite wandelt ESM-Abhängigkeiten mit vielen internen Modulen in ein einzelnes Modul um, um die Leistung beim anschließenden Laden der Seite zu verbessern.

   Einige Pakete liefern ihre ES-Modul-Builds als viele separate Dateien aus, die sich gegenseitig importieren. Zum Beispiel hat [`lodash-es` über 600 interne Module](https://unpkg.com/browse/lodash-es/)! Wenn wir `import { debounce } from 'lodash-es'` verwenden, sendet der Browser über 600 HTTP-Anfragen gleichzeitig ab! Obwohl der Server damit keine Probleme hat, führen die vielen Anfragen zu einer Netzwerküberlastung auf der Browserseite, was zu einer spürbar langsameren Seitenladung führt.

   Durch die Vorverpackung von `lodash-es` in ein einzelnes Modul benötigen wir jetzt nur noch eine HTTP-Anfrage!

:::tip HINWEIS
Die Abhängigkeitsvorverpackung gilt nur im Entwicklungsmodus und verwendet `esbuild`, um Abhängigkeiten in ESM umzuwandeln. In Produktions-Builds wird stattdessen `@rollup/plugin-commonjs` verwendet.
:::

## Automatische Abhängigkeitsentdeckung

Wenn kein vorhandener Cache gefunden wird, durchsucht Vite Ihren Quellcode und entdeckt automatisch Importe von Abhängigkeiten (d.h. "bare Imports", die aus `node_modules` aufgelöst werden sollen) und verwendet diese gefundenen Imports als Einstiegspunkte für die Vorverpackung. Die Vorverpackung erfolgt mit `esbuild`, daher ist sie in der Regel sehr schnell.

Nachdem der Server bereits gestartet wurde, wenn ein neuer Import einer Abhängigkeit gefunden wird, die noch nicht im Cache ist, führt Vite den Abhängigkeitsvorverpackungsprozess erneut aus und lädt die Seite bei Bedarf neu.

## Monorepos und verknüpfte Abhängigkeiten

In einer Monorepo-Konfiguration kann eine Abhängigkeit ein verknüpftes Paket aus demselben Repository sein. Vite erkennt automatisch Abhängigkeiten, die nicht aus `node_modules` aufgelöst werden, und behandelt die verknüpfte Abhängigkeit als Quellcode. Es wird versucht, die verknüpfte Abhängigkeit nicht zu bündeln, und stattdessen wird die Abhängigkeitsliste der verknüpften Abhängigkeit analysiert.

Dies erfordert jedoch, dass die verknüpfte Abhängigkeit als ESM exportiert wird. Andernfalls können Sie die Abhängigkeit zu [`optimizeDeps.include`](/config/dep-optimization-options.md#optimizedeps-include) und [`build.commonjsOptions.include`](/config/build-options.md#build-commonjsoptions) in Ihrer Konfiguration hinzufügen.

```js
export default defineConfig({
  optimizeDeps: {
    include: ['linked-dep']
  },
  build: {
    commonjsOptions: {
      include: [/linked-dep/, /node_modules/]
    }
  }
})
```

Wenn Sie Änderungen an der verknüpften Abhängigkeit vornehmen, starten Sie den Entwicklungsserver mit der Befehlszeilenoption `--force`, damit die Änderungen wirksam werden.

## Anpassen des Verhaltens

Die Standard-Abhängigkeitserkennungsheuristik ist nicht immer wünschenswert. In Fällen, in denen Sie Abhängigkeiten ausdrücklich in die Liste aufnehmen oder ausschließen möchten, verwenden Sie die [`optimizeDeps`-Konfigurationsoptionen](/config/dep-optimization-options.md).

Ein typischer Anwendungsfall für `optimizeDeps.include` oder `optimizeDeps.exclude` ist, wenn Sie einen Import haben, der nicht direkt im Quellcode zu finden ist. Zum Beispiel, wenn der Import als Ergebnis einer Plugin-Transformation erstellt wurde. Das bedeutet, dass Vite den Import beim ersten Scan nicht entdecken kann, sondern erst, nachdem die Datei vom Browser angefordert und transformiert wurde. Dies führt dazu, dass der Server sofort nach dem Start des Servers neu gebündelt wird.

Sowohl `include` als auch `exclude` können verwendet werden, um dieses Problem zu lösen. Wenn die Abhängigkeit groß ist (mit vielen internen Modulen) oder CommonJS ist, dann sollten Sie sie einschließen; wenn die Abhängigkeit klein ist und bereits gültiges ESM ist, können Sie sie ausschließen und den Browser sie direkt laden lassen.

Sie können esbuild auch mit der Option [`optimizeDeps.esbuildOptions`] (/config/dep-optimization-options.md#optimizedeps-esbuildoptions) weiter anpassen. Zum Beispiel durch das Hinzufügen eines esbuild-Plugins zur Behandlung spezieller Dateien in Abhängigkeiten oder durch das Ändern des [build `target`](https://esbuild.github.io/api/#target).

## Zwischenspeicherung

### Dateisystem-Cache

Vite zwischenspeichert die vorverpackten Abhängigkeiten in `node

\_modules/.vite`. Es bestimmt, ob der Vorverpackungsschritt erneut ausgeführt werden muss, basierend auf einigen Quellen:

- Inhalt der Paketmanager-Sperrdatei, z. B. `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml` oder `bun.lockb`.
- Änderungszeitpunkt des Patches-Ordners.
- Relevante Felder in Ihrer `vite.config.js`, falls vorhanden.
- Wert von `NODE_ENV`.

Der Vorverpackungsschritt muss nur erneut ausgeführt werden, wenn sich eines der oben genannten Elemente geändert hat.

Wenn Sie aus irgendeinem Grund möchten, dass Vite Abhängigkeiten erneut bündelt, können Sie entweder den Entwicklungsserver mit der Befehlszeilenoption `--force` starten oder das Verzeichnis `node_modules/.vite` im Cache manuell löschen.

### Browser-Cache

Aufgelöste Abhängigkeitsanfragen werden mit HTTP-Headern `max-age=31536000,immutable` stark zwischengespeichert, um die Leistung beim Neuladen der Seite während der Entwicklung zu verbessern. Sobald diese Anfragen zwischengespeichert sind, werden sie nie wieder den Entwicklungsserver treffen. Sie werden automatisch ungültig, wenn eine andere Version installiert ist (wie im Paketmanager-Sperrdatei angezeigt). Wenn Sie Ihre Abhängigkeiten zum Debuggen durch lokale Bearbeitungen ändern möchten, können Sie dies tun:

1. Deaktivieren Sie vorübergehend den Cache über das Netzwerk-Tab Ihrer Browser-Entwicklertools.
2. Starten Sie den Vite-Entwicklungsserver mit der `--force`-Flagge, um die Abhängigkeiten erneut zu bündeln.
3. Aktualisieren Sie die Seite.
