# Migration von v3

## Rollup 3

Vite verwendet jetzt [Rollup 3](https://github.com/vitejs/vite/issues/9870), das es uns ermöglichte, die interne Handhabung von Vite zu vereinfachen und viele Verbesserungen vorzunehmen. Siehe die [Rollup 3 Release Notes hier](https://github.com/rollup/rollup/releases/tag/v3.0.0).

Rollup 3 ist größtenteils kompatibel mit Rollup 2. Wenn Sie in Ihrem Projekt benutzerdefinierte [`rollupOptions`](../config/build-options.md#rollup-options) verwenden und auf Probleme stoßen, lesen Sie die [Rollup-Migrationsanleitung](https://rollupjs.org/migration/), um Ihre Konfiguration zu aktualisieren.

## Modern Browser Baseline Änderung

Der moderne Browser-Build zielt nun standardmäßig auf `safari14` für eine breitere ES2020-Kompatibilität (von `safari13`). Das bedeutet, dass moderne Builds nun [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) verwenden können und dass der [nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) nicht mehr transpiliert wird. Wenn Sie ältere Browser unterstützen müssen, können Sie [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) wie gewohnt hinzufügen.

## Allgemeine Änderungen

### Kodierung

Der Standardzeichensatz für die Erstellung ist jetzt utf8 (siehe [#10753](https://github.com/vitejs/vite/issues/10753) für Details).

### Importieren von CSS als String

In Vite 3 konnte es beim Importieren des Standard-Exports einer "css"-Datei zu einem doppelten Laden von CSS kommen.

```ts
import cssString from './global.css'
```

Dieses doppelte Laden könnte auftreten, da eine "css"-Datei ausgegeben wird und es wahrscheinlich ist, dass die CSS-Zeichenkette auch vom Anwendungscode verwendet wird - zum Beispiel durch die Laufzeit des Frameworks. Ab Vite 4 wurde der `.css`-Standard-Export [veraltet](https://github.com/vitejs/vite/issues/11094). Der Abfragesuffix-Modifikator "inline" muss in diesem Fall verwendet werden, da er die importierten "css"-Stile nicht ausgibt.

```ts
import stuff from './global.css?inline'
```

### Production Builds als Standard

`vite build` wird nun immer für die Produktion bauen, unabhängig von dem übergebenen `--mode`. Zuvor führte das Ändern von `mode` in einen anderen Modus als `production` zu einem Entwicklungs-Build. Wenn Sie weiterhin für die Entwicklung bauen wollen, können Sie `NODE_ENV=development` in der Datei `.env.{mode}` setzen.

Als Teil dieser Änderung werden `vite dev` und `vite build` nicht mehr `process.env.NODE_ENV` überschreiben, wenn es bereits definiert ist. Wenn Sie also `process.env.NODE_ENV = 'development'` vor dem Bauen gesetzt haben, wird es auch für die Entwicklung gebaut. Dies gibt mehr Kontrolle, wenn mehrere Builds oder Dev-Server parallel laufen.

Siehe die aktualisierte [`mode` Dokumentation](https://vitejs.dev/guide/env-and-mode.html#modes) für weitere Details.

### Umgebungsvariablen

Vite verwendet jetzt `dotenv` 16 und `dotenv-expand` 9 (vorher `dotenv` 14 und `dotenv-expand` 5). Wenn Sie einen Wert haben, der `#` oder `` ` `` enthält, müssen Sie diese mit Anführungszeichen umschließen.

```diff
-VITE_APP=ab#cd`ef
+VITE_APP="ab#cd`ef"
```

Für weitere Details siehe [`dotenv`](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md) und [`dotenv-expand` changelog](https://github.com/motdotla/dotenv-expand/blob/master/CHANGELOG.md).

## Erweitert

Es gibt einige Änderungen, die nur Plugin/Tool-Ersteller betreffen.

- [[#11036] feat(client)!: remove never implemented hot.decline](https://github.com/vitejs/vite/issues/11036)
  - verwende stattdessen `hot.invalidate`
- [[#9669] feat: Objekt-Schnittstelle für `transformIndexHtml`-Hook anpassen](https://github.com/vitejs/vite/issues/9669)
  - benutze `order` anstelle von `enforce`

Außerdem gibt es weitere Änderungen, die nur wenige Benutzer betreffen.

- [[#11101] feat(ssr)!: dedupe und mode Unterstützung für CJS entfernen](https://github.com/vitejs/vite/pull/11101)
  - Sie sollten auf den Standard-ESM-Modus für SSR migrieren, die Unterstützung für CJS SSR könnte im nächsten Vite-Major entfernt werden.
- [[#10475] feat: Behandlung statischer Assets unter Berücksichtigung der Groß-/Kleinschreibung](https://github.com/vitejs/vite/pull/10475)
  - Ihr Projekt sollte sich nicht darauf verlassen, dass ein Betriebssystem die Groß- und Kleinschreibung von Dateinamen ignoriert.
- [[#10996] fix!: `NODE_ENV` berechenbarer machen](https://github.com/vitejs/vite/pull/10996)
  - Siehe den PR für eine Erklärung dieser Änderung.
- [[#10903] refactor(types)!: Fassadentypdateien entfernen](https://github.com/vitejs/vite/pull/10903)

## Migration von v2

Schauen Sie sich zuerst den [Migration from v2 Guide](https://v3.vitejs.dev/guide/migration.html) in den Vite v3 Dokumenten an, um zu sehen, welche Änderungen notwendig sind, um Ihre Anwendung auf Vite v3 zu portieren, und fahren Sie dann mit den Änderungen auf dieser Seite fort.
