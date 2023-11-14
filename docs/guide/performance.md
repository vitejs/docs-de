# Leistung

Obwohl Vite standardmäßig ist, können Leistungsprobleme auftreten, wenn die Anforderungen des Projekts wachsen. Dieser Leitfaden soll Ihnen dabei helfen, gängige Leistungsprobleme zu identifizieren und zu beheben, wie beispielsweise:

- Langsame Serverstarts
- Langsame Seitenaufbauzeiten
- Langsame Builds

## Überprüfung konfigurierter Vite-Plugins

Die internen und offiziellen Plugins von Vite sind optimiert, um so wenig wie möglich zu arbeiten, während sie gleichzeitig die Kompatibilität mit dem breiteren Ökosystem sicherstellen. Zum Beispiel verwenden Code-Transformationen in der Entwicklung Regex, führen aber in der Build-Phase eine vollständige Analyse durch, um die Korrektheit sicherzustellen.

Die Leistung von Community-Plugins liegt jedoch außerhalb der Kontrolle von Vite und kann sich auf das Entwicklererlebnis auswirken. Hier sind einige Dinge, auf die Sie achten sollten, wenn Sie zusätzliche Vite-Plugins verwenden:

1. Große Abhängigkeiten, die nur in bestimmten Fällen verwendet werden, sollten dynamisch importiert werden, um die Startzeit von Node.js zu reduzieren. Beispiel-Refactors: [vite-plugin-react#212](https://github.com/vitejs/vite-plugin-react/pull/212) und [vite-plugin-pwa#224](https://github.com/vite-pwa/vite-plugin-pwa/pull/244).

2. Die `buildStart`, `config`, und `configResolved` Hooks sollten keine langen und umfangreichen Operationen ausführen. Diese Hooks werden während des Starts des Dev-Servers erwartet, was den Zugriff auf die Site im Browser verzögert.

3. Die `resolveId`-, `load`- und `transform`-Hooks können dazu führen, dass einige Dateien langsamer geladen werden als andere. Auch wenn dies manchmal unvermeidbar ist, lohnt es sich, nach möglichen Optimierungsbereichen zu suchen. Zum Beispiel kann man prüfen, ob der `code` ein bestimmtes Schlüsselwort enthält oder die `id` mit einer bestimmten Erweiterung übereinstimmt, bevor man die vollständige Transformation durchführt.

   The longer it takes to transform a file, the more significant the request waterfall will be when loading the site in the browser.

   You can inspect the duration it takes to transform a file using `DEBUG="vite:plugin-transform" vite` or [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect). Note that as asynchronous operations tend to provide inaccurate timings, you should treat the numbers as a rough estimate, but it should still reveal the more expensive operations.

::: tip Profiling
Sie können `vite --profile` ausführen, die Website besuchen und in Ihrem Terminal `p + Enter` drücken, um ein `.cpuprofile` aufzuzeichnen. Ein Tool wie [speedscope](https://www.speedscope.app) kann dann verwendet werden, um das Profil zu überprüfen und Engpässe zu identifizieren. Sie können die Profile auch [mit dem Vite-Team teilen](https://chat.vitejs.dev), um bei der Identifizierung von Leistungsproblemen zu helfen.
:::

## Reduzierung der Auflösungsoperationen

Das Auflösen von Importpfaden kann eine teure Operation sein, wenn sie häufig im schlimmsten Fall auftritt. Zum Beispiel unterstützt Vite das "Raten" von Importpfaden mit der Option [`resolve.extensions`](/config/shared-options.md#resolve-extensions), die standardmäßig auf `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']` festgelegt ist.

Wenn Sie versuchen, `./Component.jsx` mit `import './Component'` zu importieren, wird Vite die folgenden Schritte ausführen, um sie aufzulösen:

1. Überprüfen, ob `./Component` existiert, nein.
2. Überprüfen, ob `./Component.mjs` existiert, nein.
3. Überprüfen, ob `./Component.js` existiert, nein.
4. Überprüfen, ob `./Component.mts` existiert, nein.
5. Überprüfen, ob `./Component.ts` existiert, nein.
6. Überprüfen, ob `./Component.jsx` existiert, ja!

Wie gezeigt, sind insgesamt 6 Dateisystemüberprüfungen erforderlich, um einen Importpfad aufzulösen. Je mehr implizite Importe Sie haben, desto mehr Zeit wird für das Auflösen der Pfade benötigt.

Daher ist es in der Regel besser, bei Ihren Importpfaden explizit zu sein, z. B. `import './Component.jsx'`. Sie können auch die Liste für `resolve.extensions` einschränken, um die allgemeinen Dateisystemüberprüfungen zu reduzieren, müssen jedoch sicherstellen, dass es auch für Dateien in `node_modules` funktioniert.

Wenn Sie ein Plugin-Autor sind, stellen Sie sicher, dass Sie [`this.resolve`](https://rollupjs.org/plugin-development/#this-resolve) nur aufrufen, wenn es notwendig ist, um die Anzahl der oben genannten Überprüfungen zu reduzieren.

::: tip TypeScript
Wenn Sie TypeScript verwenden, aktivieren Sie `"moduleResolution": "bundler"` und `"allowImportingTsExtensions": true` in den `compilerOptions` Ihrer `tsconfig.json`, um `.ts` und `.tsx` Erweiterungen direkt in Ihrem Code zu verwenden.
:::

## Vermeiden von Barrel-Dateien

Barrel-Dateien sind Dateien, die die APIs anderer Dateien im selben Verzeichnis erneut exportieren. Zum Beispiel:

```js
// src/utils/index.js
export * from './color.js'
export * from './dom.js'
export * from './slash.js'
```

Wenn Sie nur eine einzelne API importieren, z. B. `import { slash } from './utils'`, müssen alle Dateien in dieser Barrel-Datei abgerufen und transformiert werden, da sie die `slash`-API enthalten können und auch Seiteneffekte enthalten können, die bei der Initialisierung ausgeführt werden. Dies bedeutet, dass beim ersten Laden der Seite mehr Dateien als erforderlich geladen werden, was zu einem langsameren Laden der Seite führt.

Wenn möglich, sollten Sie Barrel-Dateien vermeiden und die einzelnen APIs direkt importieren, z. B. `import { slash } from './utils/slash.js'`. Weitere Informationen finden Sie unter [Issue #8237](https://github.com/vitejs/vite/issues/8237).

## Häufig verwendete Dateien aufwärmen

Der Vite Entwicklungsserver transformiert Dateien nur, wenn sie vom Browser auch angefordert werden. Dadurch kann er schneller starten und wendet nur Transformationen für verwendete Dateien an. Er kann auch Dateien vorverwandeln, wenn er erwartet, dass bestimmte Dateien in Kürze angefordert werden. Dennoch kann es zu einem "Request Wassfall" kommen, wenn die Umwandlung einiger Dateien länger dauert als die von anderen. Ein Beispiel:

Bei einem Importgraphen, bei dem die linke Datei die rechte Datei importiert:

```
main.js -> BigComponent.vue -> big-utils.js -> large-data.json
```

Die Importbeziehung kann erst nach der Transformation der Datei bekannt sein. Wenn `BigComponent.vue` einige Zeit für die Transformation benötigt, muss `big-utils.js` auf seine Ausführung warten, und so weiter. Dies führt zu einem internen Wasserfall, auch wenn eine Vor-Transformation eingebaut ist.

Vite ermöglicht es Ihnen, Dateien vorzuwärmen, von denen Sie wissen, dass sie häufig verwendet werden, z.B. `big-utils.js`, mithilfe der Option [`server.warmup`](/config/server-options.md#server-warmup). Auf diese Weise wird `big-utils.js` bereit und zwischengespeichert, um sofort bei Bedarf bereitgestellt zu werden.

Sie können Dateien, die häufig verwendet werden, ermitteln, indem Sie `DEBUG="vite:transform" vite` ausführen und die Protokolle überprüfen:

```bash
vite:transform 28.72ms /@vite/client +1ms
vite:transform 62.95ms /src/components/BigComponent.vue +1ms
vite:transform 102.54ms /src/utils/big-utils.js +1ms
```

```js
export default defineConfig({
  server: {
    warmup: {
      clientFiles: [
        './src/components/BigComponent.vue',
        './src/utils/big-utils.js',
      ],
    },
  },
})
```

Beachten Sie, dass Sie nur Dateien vorwärmen sollten, die häufig verwendet werden, um den Vite-Entwicklungsserver beim Start nicht zu überlasten. Überprüfen Sie die Option [`server.warmup`](/config/server-options.md#server-warmup) für weitere Informationen.

Die Verwendung von [`--open` oder `server.open`](/config/server-options.html#server-open) bietet ebenfalls eine Leistungssteigerung, da Vite automatisch den Einstiegspunkt Ihrer App oder die bereitgestellte URL vorab erwärmt.

## Weniger oder natives Werkzeug verwenden

Um die Geschwindigkeit von Vite mit einer wachsenden Codebasis beizubehalten, muss man den Arbeitsaufwand für die Quelldateien (JS/TS/CSS) reduzieren.

Beispiele für weniger Arbeit:

- CSS anstelle von Sass/Less/Stylus verwenden, wenn möglich (Verschachtelung kann von PostCSS gehandhabt werden).
- Transformieren Sie SVGs nicht in UI-Framework-Komponenten (React, Vue usw.). Importieren Sie sie stattdessen als Strings oder URLs.
- Wenn Sie `@vitejs/plugin-react` verwenden, vermeiden Sie es, die Babel-Optionen so zu konfigurieren, dass die Transformation während des Builds übersprungen wird (nur esbuild wird verwendet).

Beispiele für die Verwendung von nativen Werkzeugen:

Die Verwendung von nativem Werkzeug bringt oft eine größere Installation mit sich und ist daher nicht der Standard, wenn ein neues Vite-Projekt initialisiert wird. Für größere Anwendungen hingegen kann es sich aber lohnen.

- Probieren Sie die experimentelle Unterstützung für [LightningCSS](https://github.com/vitejs/vite/discussions/13835) aus.
- Verwenden Sie [`@vitejs/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react-swc) anstelle von `@vitejs/plugin-react`.
