# Rolldown Integration

Vite plant die Integration von [Rolldown](https://rolldown.rs), einem Rust-basierten JavaScript-Bundler, um die Build-Leistung und -Fähigkeiten zu verbessern.

<YouTubeVideo videoId="RRjfm8cMveQ" />

## Was ist Rolldown?

Rolldown ist ein moderner, leistungsstarker JavaScript-Bundler, der in Rust geschrieben wurde. Er wurde als Ersatz für Rollup entwickelt und soll erhebliche Leistungsverbesserungen bieten, während die Kompatibilität mit dem bestehenden Ökosystem erhalten bleibt.

Rolldown konzentriert sich auf drei Grundprinzipien:

- **Geschwindigkeit**: Mit Rust für maximale Leistung entwickelt
- **Kompatibilität**: Funktioniert mit bestehenden Rollup-Plugins
- **Optimierung**: Liefert fortschrittlichere Funktionen, im Vergleich zu esbuild und Rollup

## Warum Vite zu Rolldown migriert

1. **Vereinheitlichung**: Vite verwendet derzeit esbuild für die Vorab-Bündelung von Abhängigkeiten und Rollup für Produktions-Builds. Rolldown zielt darauf ab, diese zu einem einzigen, leistungsstarken Bündler zu vereinen, der für beide Zwecke verwendet werden kann, wodurch die Komplexität reduziert wird.

2. **Leistung**: Die Rust-basierte Implementierung von Rolldown bietet gegenüber JavaScript-basierten Bundlern erhebliche Leistungsverbesserungen. Auch wenn spezifische Benchmarks je nach Projektgröße und Komplexität variieren können, zeigen erste Tests vielversprechende Geschwindigkeitssteigerungen im Vergleich zu Rollup.

3. **Zusätzliche Funktionen**: Rolldown führt Funktionen ein, die nicht in Rollup oder esbuild vorhanden sind, wie beispielsweise die erweiterte Steuerung der Chunk-Aufteilung, eingebautes HMR und Modulverbünde.

Weitere Einblicke in die Beweggründe für Rolldown finden Sie unter [Gründe für die Entwicklung von Rolldown](https://rolldown.rs/guide/#why-rolldown).

## Vorteile des Ausprobierens von `rolldown-vite`
- Profitieren Sie von deutlich schnelleren Build-Zeiten, insbesondere bei größeren Projekten.
- Geben Sie wertvolles Feedback, um die Zukunft der Bundling-Erfahrung von Vite mitzugestalten.
- Bereiten Sie Ihre Projekte auf die spätere offizielle Rolldown-Integration vor.

## Wie man Rolldown ausprobiert

Die Rolldown-basierte Version von Vite ist derzeit als separates Paket namens `rolldown-vite` verfügbar. Wenn Sie `vite` als direkte Abhängigkeit haben, können Sie das `vite`-Paket über einen Alias in der `package.json` Ihres Projekts mit `rolldown-vite` verknüpfen, was zu einem direkten Ersatz führen sollte.

```json
{
  "dependencies": {
    "vite": "^7.0.0" // [!code --]
    "vite": "npm:rolldown-vite@latest" // [!code ++]
  }
}
```

Wenn Sie Vitepress oder ein Meta-Framework, das Vite als Peer-Abhängigkeit hat, müssen Sie die Abhängigkeit `vite` in Ihrer `package.json` überschreiben, welche je nach Paketmanager leicht unterscheidlich funktioniert:

:::code-group

```json [npm]
{
  "overrides": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

```json [Yarn]
{
  "resolutions": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

```json [pnpm]
{
  "pnpm": {
    "overrides": {
      "vite": "npm:rolldown-vite@latest"
    }
  }
}
```

```json [Bun]
{
  "overrides": {
    "vite": "npm:rolldown-vite@latest"
  }
}

```

:::

Nachdem Sie diese Überschreibungen hinzugefügt haben, installieren Sie Ihre Abhängigkeiten neu und starten Sie Ihren Entwicklungsserver oder erstellen Sie Ihr Projekt wie gewohnt. Es sind keine weiteren Konfigurationsänderungen erforderlich.

Wenn Sie ein neues Projekt starten, können Sie auch wie gewohnt `create-vite` für rolldown-vite nutzen. Die aktuellste Version wird Sie fragen, ob Sie `rolldown-vite` verwenden möchten oder nicht.

## Bekannte Einschränkungen

Rolldown soll zwar ein direkter Ersatz für Rollup sein, es gibt jedoch Funktionen, die noch implementiert werden, sowie geringfügige beabsichtigte Unterschiede im Verhalten. Eine umfassende Liste finden Sie in [diesem GitHub PR](https://github.com/vitejs/rolldown-vite/pull/84#issue-2903144667), der regelmäßig aktualisiert wird.

### Warnungen bei der Validierung von Optionen

Rolldown erzeugt eine Warnung, wenn unbekannte oder ungültige Optionen angegeben werden. Da manche Optionen, die in Rollup verfügbar sind, in Rolldown nicht zur Verfügung stehen, kann es zu Warnungen kommen. Im Folgenden sehen Sie ein Beispiel für solch eine Warnung:

> Warning validate output options.
>
> - For the "generatedCode". Invalid key: Expected never but received "generatedCode".

Wenn Sie die Optione nicht selbst angeben, muss der Fehler durch das verwendete Framework behoben werden.

### API Unterschiede

#### `manualChunks` to `advancedChunks`

Rolldown unterstützt die `manualChunks`-Option, welche durch Rollup bereitgestellt wird, allerdings wurde diese als veraltet gekennzeichnet. Stattdessen wird eine feinkörnige Einstellung mit Hilfe der [`advancedChunks`-Option](https://rolldown.rs/guide/in-depth/advanced-chunks#advanced-chunks) bereitgestellt, die ähnlich zur `splitChunk`-Option von Webpack ist.

```js
// Alte Konfiguration (Rollup)
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/\/react(?:-dom)?/.test(id)) {
            return 'vendor'
          }
        }
      }
    }
  }
}

// Neue Konfiguration (Rolldown)
export default {
  build: {
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [{ name: 'vendor', test: /\/react(?:-dom)?/ }]
        }
      }
    }
  }
}
```

## Performanz

`rolldown-vite` konzentriert sich darauf, die Kompatibilität mit dem bestehenden Ökosystem sicherzustellen, daher sind die Standardeinstellungen auf einen reibungslosen Übergang ausgerichtet. Sie können die Performanz weiter erhöhen, in dem Sie auf Rust-basierte interne Plugins und andere Anpassungen umsteigen.

### Aktivieren nativer Plugins

Dank Rolldown und Oxc wurden verschiedene interne Vite-Plugins, wie beispielsweise das Alias- oder Resolve-Plugin, nach Rust portiert. Native Plugins sind nun mit standardmäßig aktiviert und enthalten den Standardwert `'v1'`.

Falls Sie irgendwelchen Problemen begegnen, können Sie die `experimental.enableNativePlugin`-Option als Workaround in Ihrer Vite Konfiguration zu `'resolver'` oder `false` ändern. Beachten Sie, dass diese Möglichkeit in der Zukunft entfernt wird.

### Verwendung der React-Aktualisierungstransformation von Oxc

`@vitejs/plugin-react` v5.0.0+ verwendet die React-Aktualisierungstransformation von Oxc. Wenn Sie keine Babel-Plugins (einschließlich des React-Compilers) verwenden, wird die vollständige Transformation nun von Oxc durchgeführt und verbessert die Build-Leistung, ohne dass außer der Aktualisierung von `@vitejs/plugin-react` weitere Änderungen erforderlich sind.

Falls Sie `@vitejs/plugin-react-swc` ohne SWC-Plugins und benutzerdefinierte SWC-Optionen verwenden, können Sie zum `@vitejs/plugin-react`-Plugin wechseln, um Oxc zu nutzen.

::: details `@vitejs/plugin-react-oxc`-Plugin ist veraltet

Bisher haben wir empfohlen, `@vitejs/plugin-react-oxc` zu verwenden, um die React-Aktualisierungstransformation von Oxc zu nutzen. Wir haben die Implementierung jedoch in `@vitejs/plugin-react` integriert, damit der Wechsel zu `rolldown-vite` einfacher ist. `@vitejs/plugin-react-oxc` ist nun veraltet und wird nicht mehr aktualisiert.

:::

### `withFilter` Wrapper

Plugin-Authoren haben die Möglichkeit, die [Hook-Filter-Funktion](#hook-filter-feature) zu verwenden, um den Kommunikationsaufwand zwischen Rust- und JavaScript-Laufzeiten zu verringern.
Für den Fall, dass manche der genutzten Plugins diese Funktion (noch) nicht verwenden, können Sie den `withFilter`-Wrapper verwenden, um einen Filter auf das Plugin anzuwenden.

```js
// In Ihrer vite.config.ts
import { withFilter, defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    // Lädt das `svgr` Plugin nur für Dateien, die mit `.svg?react` enden
    withFilter(
      svgr({
        /*...*/
      }),
      { load: { id: /\.svg\?react$/ } },
    ),
  ],
})
```

## Probleme melden

Da es sich um eine experimentelle Integration handelt, können Probleme auftreten. Wenn dies der Fall ist, melden Sie diese bitte im Repository [`vitejs/rolldown-vite`](https://github.com/vitejs/rolldown-vite) und **nicht im Haupt-Repository von Vite**.

Wenn Sie [Probleme melden](https://github.com/vitejs/rolldown-vite/issues/new), befolgen Sie bitte die geeignete Vorlage für Probleme und geben Sie bitte an, was von Ihnen gefordert wird. Üblicherweise enthalten sind:

- Eine minimale Reproduktion des Problems
- Details zu Ihrer Umgebung (Betriebssystem, Node-Version, Paketmanager)
- Alle relevanten Fehlermeldungen oder Protokolle

Für Echtzeit-Diskussionen und Fehlerbehebung treten Sie bitte dem [Rolldown Discord](https://chat.rolldown.rs/) bei.

# Versionierungsrichtlinie

Die Versionierungsrichtlinie von `rolldown-vite` richtet die Major- und Minor-Versionen nach denen vom normalen Vite Paket aus. Diese Synchronisierung stellt sicher, dass Funktionen in einem speziellen Minor-Release auch in der entsprechenden `rolldown-vite`-Version vertreten sind. Allerdings ist zu beachten, dass Patch-Versionen nicht zwischen den beiden Paketen synchronisiert werden. Wenn Sie nachsehen möchten, ob eine bestimme Änderung in Vite auch in `rolldown-vite` vertreten ist, können Sie das im [seperaten `rolldown-vite` Änderungsprotokoll](https://github.com/vitejs/rolldown-vite/blob/rolldown-vite/packages/vite/CHANGELOG.md) tun.

Seien Sie sich bitte weiterhin bewusst, dass `rolldown-vite` aktuell noch als experimentell betrachtet wird. Auf Grund der experimentellen Veranlagung, können grundlegende Änderungen auch zwischen Patch-Versionen eingeführt werden. Beachten Sie bitte außerdem, dass `rolldown-vite` nur Updates für die aktuelleste Minor-Version erhält. Auch wichtige Sicherheitsaktualisierungen werden nicht für ältere Major- oder Minor-Versionen erstellt.

## Zukünftige Pläne

Das Paket `rolldown-vite` ist eine vorübergehende Lösung, um Feedback zu sammeln und die Rolldown-Integration zu stabilisieren. In Zukunft wird diese Funktionalität wieder in das Haupt-Repository von Vite integriert werden.

Wir ermutigen Sie, `rolldown-vite` auszuprobieren und durch Feedback und Fehlerberichte zur Entwicklung beizutragen.

In der Zukunft werden wir auch noch einen vollständigen Bündelmodus für Vite einführen, der gebündelte Dateien sowohl im Produktions-Modus, als auch im _Entwicklungs-Modus_ bereitstellt.

### Wozu die Einführung eines vollständigen Bündelmodus?

Vite ist für seinen Ansatz mit einem ungebündelten Entwicklungs-Server bekannt, was der Hauptgrund für Vites Geschwindigkeit und Bekanntheit war, als es veröffentlicht wurde. Dieser Ansatz war inital ein Experiment, um zu testen, wie weit man die Grenzen der Performanz von Entwicklungs-Servern ausreizen kann, ohne traditionelles Bündeln zu nutzen.

Mit zunehmender Größe und Komplexität der Projekte sind jedoch zwei wesentliche Herausforderungen entstanden:

1. **Inkonsistenz zwischen Entwicklung und Produktion**: Das in der Entwicklung bereitgestellte ungebündelte JavaScript und das gebündelte Produktions-Build führen zu unterschiedlichen Laufzeitverhalten. Dies kann zu Problemen führen, die nur in der Produktion auftreten und die Fehlersuche erschweren.

2. **Leistungsabfall während der Entwicklung**: Der ungebündelte Ansatz führt dazu, dass jedes Modul separat abgerufen wird, was eine große Anzahl von Netzwerkanfragen verursacht. Dies hat zwar _keine Auswirkungen auf die Produktion_, verursacht jedoch einen erheblichen Mehraufwand beim Start des Entwicklungsservers und beim Aktualisieren der Seite während der Entwicklung. Die Auswirkungen sind besonders bei großen Anwendungen spürbar, bei denen Hunderte oder sogar Tausende von separaten Anfragen verarbeitet werden müssen. Diese Engpässe werden noch gravierender, wenn Entwickler einen Netzwerk-Proxy verwenden, was zu langsameren Aktualisierungszeiten und einer verschlechterten Entwicklererfahrung führt.

Mit der Rolldown-Integration besteht die Möglichkeit, die Entwicklungs- und Produktionserfahrungen zu vereinen und gleichzeitig die Performanz von Vite aufrecht zu erhalten. Ein vollständiger Bündelungsmodus ermöglicht das Bereitstellen von gebündelten Dateien in der Produktion, sowie in der Entwicklung. Dadurch werden die Vorteile beider Welten kombiniert:

- Kurze Startzeiten, auch für große Anwendungen
- Konsistentes Verhalten von Entwicklung und Produktion
- Reduzierter Netzwerkaufwand beim Neuladen von Seiten
- Aufrechterhaltung einer effizienten HMR zusätzlich zur ESM-Ausgabe

Wenn der vollständige Bündelungsmodus eingeführt wird, besteht erstmal die Möglichkeit ihn per opt-in zu verwenden. Ähnlich zu Rolldown zielen wir darauf ab, ihn zum Standard werden zu lassen, nachdem wir Feedback gesammelt haben und Stabilität gewährleisten können.

## Plugin- / Framework-Authoren Leitfaden

::: tip
Dieser Bereich ist primär relevant für Plugin- und Framework-Authoren. Falls Sie ein Nutzer sind, können Sie diesen Bereich überspringen.
:::

### Übersicht von großen Änderungen

- Rolldown wird für den Build genutzt (Rollup wurde zuvor verwendet)
- Rolldown wird für den Optimierer genutzt (esbuild wurde zuvor verwendet)
- CommonJS Unterstützung wird von Rollup bereitgestellt (@rollup/plugin-commonjs zuvor verwendet)
- Oxc wird zur Syntax-Reduktion genutzt (esbuild wurde zuvor verwendet)
- Lightning CSS wird standardmäßig zur Minifizierung von CSS genutzt (esbuild wurde zuvor verwendet)
- Oxc-Minifier wird standardmäßig zur Minifizierung von JS genutzt (esbuild wurde zuvor verwendet)
- Rolldown wird zum Bündeln der Konfiguration genutzt (esbuild wurde zuvor verwendet)

### `rolldown-vite` erkennen

::: warning
In den meisten Fällen müssen sie nicht prüfen, ob ihr Plugin mit `rolldown-vite` oder `vite` läuft. Sie sollten eher darauf abzielen, ein konsistentes Verhalten zwischen beiden zu erreichen, ohne bedingte Verzweigungen.
:::

Für den Fall, dass Sie ein unterschiedliches Verhalten mit `rolldown-vite` benötigen, gibt es zwei Möglichkeiten zu erkennen, ob `rolldown-vite` verwendet wird.

Prüfen der Existenz von `this.meta.rolldownVersion`:

```js
const plugin = {
  resolveId() {
    if (this.meta.rolldownVersion) {
      // Logik für rolldown-vite
    } else {
      // Logik für rollup-vite
    }
  },
}
```

::: tip

Seit Vite 7.0.0 ist `this.meta` in allen Hooks verfügbar. In früheren Versionen war `this.meta` in Vite-spezifischen Hooks nicht verfügbar, wie zum Beispiel der `config`-Hook.

:::

<br>

Prüfen der Existenz des `rolldownVersion` Exports:

```js
import * as vite from 'vite'

if (vite.rolldownVersion) {
  // Logik für rolldown-vite
} else {
  // Logik für rollup-vite
}
```

Wenn sie `vite` als Abhängigkeit (nicht als Peer-Abhängigkeit) haben, bietet sich der `rolldownVersion`-Export an, da er überall in Ihrem Code verwendet werden kann.

### Ignorieren der Optionsvalidierung in Rolldown

Wie [oben erwähnt](#option-validation-errors) erzeugt Rolldown eine Warnung, wenn unbekannte oder ungültige Optionen übergeben werden.

Dieser Fehler kann behoben werden, in dem die Option nur unter bestimmten Bedingungen angegeben wird. Wie [oben gezeigt](#detecting-rolldown-vite), muss dann in der Bedingung geprüft werden, ob das Programm mit rolldown-vite ausgeführt wird.

### `transformWithEsbuild` benötigt eine seperate `esbuild` Installation

Da Vite selbst `esbuild` nicht mehr verwendet, wird `esbuild` als optionale Peer-Abhängigkeit behandelt. Wenn Ihr Plugin `transformWithEsbuild` verwendet, muss es `esbuild` zu seinen Abhängigkeiten hinzufügen oder der Nutzer muss es manuell installieren.

Die empfohlene Migration ist die Verwendung der neulich exportierten Funktion `transformWithOxc`, welche Oxc anstelle von `esbuild` verwendet.

### Kompatibilitätsschicht für `esbuild`-Optionen

Rolldown-Vite hat eine Kompatibilitätsschicht, um Optionen von `esbuild` für Oxc oder `rolldown` zu konvertieren. Getestet wurde in der [ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci/blob/rolldown-vite/README-temp.md) und funktioniert für viele Fälle, inklusive einfacher `esbuild`-Plugins.
In Zukunft **werden wir die Unterstützung für `esbuild`-Optionen entfernen** und Sie ermutigen, die entsprechenden Optionen von Oxc oder `rolldown` zu verwenden.
Sie können das Set an Optionen von der Kompatibilitätsschicht mit Hilfe der `configResolved`-Hook erhalten.

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.optimizeDeps, config.oxc)
  },
},
```

### Hook-Filter Funktion

Rolldown hat eine [Hook-Filter](https://rolldown.rs/guide/plugins/hook-filters) Funktion eingeführt, um den Kommunikationsaufwand zwischen Rust und JavaScript Laufzeiten zu verringern. Durch die Verwendung dieser Funktion, können Sie Ihre Plugins performanter gestalten.

Dies wird auch von Rollup 4.38.0+ und Vite 6.3.0+ unterstützt. Um eine Rückwärtskompatibilität für ältere Versionen für Ihr Plugin zu gewährleisten, sollten Sie die Filter auch im Hook-Behandler ausführen.

::: tip

[`@rolldown/pluginutils`](https://www.npmjs.com/package/@rolldown/pluginutils) exportiert einige Funktionen für Hook-Filter wie `exactRegex` oder `prefixRegex`.

:::

### Inhalt zu JavaScript konvertieren in `load`- oder `transform`-Hooks

Wenn Sie den Inhalt von anderen Typen zu JavaScript konvertieren in `load`- oder `transform`-Hooks, müssen Sie möglicherweise `moduleType: 'js'` zur zurückgegebenen Variable hinzufügen.

```js
const plugin = {
  name: 'txt-loader',
  load(id) {
    if (id.endsWith('.txt')) {
      const content = fs.readFile(id, 'utf-8')
      return {
        code: `export default ${JSON.stringify(content)}`,
        moduleType: 'js', // [!code ++]
      }
    }
  },
}
```

Das liegt daran, dass [Rolldown unterstützt JavaScript-fremde Module](https://rolldown.rs/guide/in-depth/module-types) und leitet sich den Modultyp aus der Erweiterung ab, außer es wird spezifiziert.