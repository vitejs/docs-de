# Rolldown Integration

Vite plant die Integration von [Rolldown](https://rolldown.rs), einem Rust-basierten JavaScript-Bundler, um die Build-Leistung und -Fähigkeiten zu verbessern.

## Was ist Rolldown?

Rolldown ist ein moderner, leistungsstarker JavaScript-Bundler, der in Rust geschrieben wurde. Er wurde als Ersatz für Rollup entwickelt und soll erhebliche Leistungsverbesserungen bieten, während die Kompatibilität mit dem bestehenden Ökosystem erhalten bleibt.

Rolldown konzentriert sich auf drei Grundprinzipien:

- **Geschwindigkeit**: Mit Rust für maximale Leistung entwickelt
- **Kompatibilität**: Funktioniert mit bestehenden Rollup-Plugins
- **Entwicklererfahrung**: Vertraute API für Rollup-Benutzer

## Warum Vite zu Rolldown migriert

1. **Vereinheitlichung**: Vite verwendet derzeit esbuild für die Vorab-Bündelung von Abhängigkeiten und Rollup für Produktions-Builds. Rolldown zielt darauf ab, diese zu einem einzigen, leistungsstarken Bündler zu vereinen, der für beide Zwecke verwendet werden kann, wodurch die Komplexität reduziert wird.

2. **Leistung**: Die Rust-basierte Implementierung von Rolldown bietet gegenüber JavaScript-basierten Bundlern erhebliche Leistungsverbesserungen. Auch wenn spezifische Benchmarks je nach Projektgröße und Komplexität variieren können, zeigen erste Tests vielversprechende Geschwindigkeitssteigerungen im Vergleich zu Rollup.

Weitere Einblicke in die Beweggründe für Rolldown finden Sie unter [Gründe für die Entwicklung von Rolldown](https://rolldown.rs/guide/#why-rolldown).

## Vorteile des Ausprobierens von `rolldown-vite`
- Profitieren Sie von deutlich schnelleren Build-Zeiten, insbesondere bei größeren Projekten.
- Geben Sie wertvolles Feedback, um die Zukunft der Bundling-Erfahrung von Vite mitzugestalten.
- Bereiten Sie Ihre Projekte auf die spätere offizielle Rolldown-Integration vor.

## Wie man Rolldown ausprobiert

Die Rolldown-basierte Version von Vite ist derzeit als separates Paket namens „rolldown-vite” verfügbar. Sie können es ausprobieren, indem Sie Paketüberschreibungen zu Ihrer „package.json” hinzufügen:

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

## Bekannte Einschränkungen

Rolldown soll zwar ein direkter Ersatz für Rollup sein, es gibt jedoch Funktionen, die noch implementiert werden, sowie geringfügige beabsichtigte Unterschiede im Verhalten. Eine umfassende Liste finden Sie in [diesem GitHub PR](https://github.com/vitejs/rolldown-vite/pull/84#issue-2903144667), der regelmäßig aktualisiert wird.

## Probleme melden

Da es sich um eine experimentelle Integration handelt, können Probleme auftreten. Wenn dies der Fall ist, melden Sie diese bitte im Repository [`vitejs/rolldown-vite`](https://github.com/vitejs/rolldown-vite) und **nicht im Haupt-Repository von Vite**.

Wenn Sie [Probleme melden](https://github.com/vitejs/rolldown-vite/issues/new), befolgen Sie bitte die Vorlage für Probleme und geben Sie Folgendes an:

- Eine minimale Reproduktion des Problems
- Details zu Ihrer Umgebung (Betriebssystem, Node-Version, Paketmanager)
- Alle relevanten Fehlermeldungen oder Protokolle

Für Echtzeit-Diskussionen und Fehlerbehebung treten Sie bitte dem [Rolldown Discord](https://chat.rolldown.rs/) bei.

## Zukünftige Pläne

Das Paket `rolldown-vite` ist eine vorübergehende Lösung, um Feedback zu sammeln und die Rolldown-Integration zu stabilisieren. In Zukunft wird diese Funktionalität wieder in das Haupt-Repository von Vite integriert werden.

Wir ermutigen Sie, `rolldown-vite` auszuprobieren und durch Feedback und Fehlerberichte zur Entwicklung beizutragen.

## Plugin- / Framework-Authoren Leitfaden

### Liste von großen Änderungen

- Rolldown wird für den Build genutzt (Rollup wurde zuvor verwendet)
- Rolldown wird für den Optimierer genutzt (esbuild wurde zuvor verwendet)
- CommonJS Unterstützung wird von Rollup bereitgestellt (@rollup/plugin-commonjs zuvor verwendet)
- Oxc wird zur Syntax-Reduktion genutzt (esbuild wurde zuvor verwendet)
- Lightning CSS wird standardmäßig zur Minifizierung von CSS genutzt (esbuild wurde zuvor verwendet)
- Oxc-Minifier wird standardmäßig zur Minifizierung von JS genutzt (esbuild wurde zuvor verwendet)
- Rolldown wird zum Bündeln der Konfiguration genutzt (esbuild wurde zuvor verwendet)


### Rolldown-Vite erkennen

Sie können es entweder erkennen durch

- Prüfen der Existenz von `this.meta.rolldownVersion`

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

- Prüfen der Existenz des `rolldownVersion` Exports

```js
import * as vite from 'vite'

if (vite.rolldownVersion) {
  // Logik für rolldown-vite
} else {
  // Logik für rollup-vite
}
```

Wenn sie `vite` als Abhängigkeit (nicht als Peer-Abhängigkeit) haben, bietet sich der `rolldownVersion`-Export an, da er überall in Ihrem Code verwendet werden kann.

### Ignorieren von Optionsvalidierung in Rolldown

Rolldown wirft einen Fehler, wenn unbekannte oder ungültige Optionen angegeben werden. Da manche Optionen, die in Rollup verfügbar sind, in Rolldown nicht zur Verfügung stehen, kann es zu Fehlern kommen. Im Folgenden sehen Sie ein Beispiel für solch eine Fehlermeldung:

> Error: Failed validate input options.
>
> - For the "preserveEntrySignatures". Invalid key: Expected never but received "preserveEntrySignatures".

Dieser Fehler kann behoben werden, in dem die Option nur unter bestimmten Bedingungen angegeben wird. Wie oben gezeigt, muss dann in der Bedingung geprüft werden, ob das Programm mit `rolldown-vite` ausgeführt wird.

Wenn Sie den Fehler vorerst unterdrücken möchten, können Sie die Umgebungsvariable `ROLLDOWN_OPTIONS_VALIDATION=loose` setzen. Beachten Sie allerdings, dass Sie irgendwann aufhören müssen, Optionen anzugeben, die nicht von Rolldown unterstützt werden.

### `transformWithEsbuild` benötigt eine seperate `esbuild` Installation

Eine ähnliche Funktion namens `transformWithOxc`, die Oxc anstelle von `esbuild` verwendet, wird von `rolldown-vite` exportiert.

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

Rolldown hat eine [Hook-Filter](https://rolldown.rs/guide/plugin-development#plugin-hook-filters) Funktion eingeführt, um den Kommunikationsaufwand zwischen Rust und JavaScript Laufzeiten zu verringern. Durch die Verwendung dieser Funktion, können Sie Ihre Plugins performanter gestalten.

Dies wird auch von Rollup 4.38.0+ und Vite 6.3.0+ unterstützt. Um eine Rückwärtskompatibilität für ältere Versionen für Ihr Plugin zu gewährleisten, sollten Sie die Filter auch im Hook-Behandler ausführen.

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

Das liegt daran, dass [Rolldown unterstützt JavaScript-fremde Module](https://rolldown.rs/guide/in-depth/module-types) und leitet sich den Modultyp aus der Erweiterung ab, außer es wird spezifiziert. Beachten Sie, dass `rolldown-vite` keine ModuleTypes in dev unterstützt.