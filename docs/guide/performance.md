# Leistung

Obwohl Vite standardmäßig ist, können Leistungsprobleme auftreten, wenn die Anforderungen des Projekts wachsen. Dieser Leitfaden soll Ihnen dabei helfen, gängige Leistungsprobleme zu identifizieren und zu beheben, wie beispielsweise:

- Langsame Serverstarts
- Langsame Seitenaufbauzeiten
- Langsame Builds

## Überprüfung konfigurierter Vite-Plugins

Die internen und offiziellen Plugins von Vite sind optimiert, um so wenig wie möglich zu arbeiten, während sie gleichzeitig die Kompatibilität mit dem breiteren Ökosystem sicherstellen. Zum Beispiel verwenden Code-Transformationen in der Entwicklung Regex, führen aber in der Build-Phase eine vollständige Analyse durch, um die Korrektheit sicherzustellen.

Die Leistung von Community-Plugins liegt jedoch außerhalb der Kontrolle von Vite und kann sich auf das Entwicklererlebnis auswirken. Hier sind einige Dinge, auf die Sie achten sollten, wenn Sie zusätzliche Vite-Plugins verwenden:

1. Die Hooks `buildStart`, `config` und `configResolved` sollten keine langwierigen und umfangreichen Operationen ausführen. Diese Hooks werden während des Startvorgangs des Entwicklungsservers erwartet, was dazu führt, dass der Zugriff auf die Website im Browser verzögert wird.

2. Die Hooks `resolveId`, `load` und `transform` können dazu führen, dass einige Dateien langsamer geladen werden als andere. Obwohl dies manchmal unvermeidlich ist, lohnt es sich dennoch, nach möglichen Bereichen zur Optimierung zu suchen. Zum Beispiel, überprüfen Sie, ob der `code` ein bestimmtes Schlüsselwort enthält oder ob die `id` zu einer bestimmten Erweiterung passt, bevor die vollständige Transformation durchgeführt wird.

Je länger es dauert, eine Datei zu transformieren, desto bedeutender wird der Anfrage-Verlauf sein, wenn die Website im Browser geladen wird.

Sie können die Dauer, die benötigt wird, um eine Datei zu transformieren, mit `DEBUG="vite:plugin-transform" vite` oder [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) überprüfen. Beachten Sie jedoch, dass asynchrone Operationen dazu neigen, ungenaue Zeitmessungen bereitzustellen, daher sollten Sie die Zahlen als grobe Schätzung behandeln, aber sie sollten immer noch die kostspieligeren Operationen aufzeigen.

::: Tipp Profiling
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

::: Tipp TypeScript
Wenn Sie TypeScript verwenden, aktivieren Sie `"moduleResolution": "bundler"` und `"allowImportingTsExtensions": true` in den `compilerOptions` Ihrer `tsconfig.json`, um `.ts` und `.tsx` Erweiterungen direkt in Ihrem Code zu verwenden.
:::

## Vermeiden von Barrel-Dateien

Barrel-Dateien sind Dateien, die die APIs anderer Dateien im selben Verzeichnis erneut exportieren. Zum Beispiel:

```js
// src/utils/index.js
export * from './color'
export * from './dom'
export * from './string'
```

Wenn Sie nur eine einzelne API importieren, z.B. `import { slash } from './utils'`, müssen alle Dateien in dieser Barrel-Datei abgerufen und transformiert werden, da sie die `slash` API enthalten können und auch Seiteneffekte enthalten können, die bei der Initialisierung ausgeführt werden. Dies bedeutet, dass Sie mehr Dateien als erforderlich beim ersten Laden der Seite laden, was zu längeren Ladezeiten führt.

Wenn möglich, sollten Sie Barrel-Dateien vermeiden und die einzelnen APIs direkt importieren, z.B. `import { slash } from './utils/slash'`. Sie können [Issue #8237](https://github.com/vitejs/vite/issues/8237) für weitere Informationen lesen.

## Häufig verwendete Dateien vorwärmen

Der Vite-Entwicklungsserver transformiert nur Dateien, die vom Browser angefordert werden, was es ihm ermöglicht, schnell zu starten und Transformationen nur für verwendete Dateien anzu

wenden. Er kann auch Dateien vorab transformieren, wenn er erwartet, dass bestimmte Dateien in Kürze angefordert werden. Es kann jedoch immer noch zu Anfrage-Wasserfällen kommen, wenn einige Dateien länger zur Transformation benötigen als andere. Zum Beispiel:

Angenommen, es gibt einen Importgraphen, bei dem die linke Datei die rechte Datei importiert:

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
