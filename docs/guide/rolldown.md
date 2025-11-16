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