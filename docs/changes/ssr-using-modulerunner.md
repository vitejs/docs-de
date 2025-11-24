# SSR verwendet die `ModuleRunner` API

::: tip Feedback
Geben Sie uns Rückmeldungen in der ["Environment API Feedback"-Diskussion](https://github.com/vitejs/vite/discussions/16358)
:::

`server.ssrLoadModule` wurde durch die Importierung eines [Module Runners](/guide/api-environment#modulerunner) ersetzt.

Betroffener Bereich: `Vite Plugin-Authoren`

::: warning Zukünftige Veraltungen
`ModuleRunner` wurde eingeführt in `v6.0`. Die Veraltung von `server.ssrLoadModule` ist für eine zukünftige Hauptversion geplant. Um eine mögliche Nutzung zu identifizieren, können Sie `future.removeSsrLoadModule` in Ihrer Vite-Konfiguration auf `"warn"` setzen.
:::

## Motivation

`server.ssrLoadModule(url)` erlaubt nur die Importierung von Modulen in der `ssr`-Umgebung und kann nur die Module ausführen, die sich im Gleichen Prozess wie der Vite-Entwicklungsserver befinden. Für Anwendungen mit benutzerdefinierten Umgebungen, wird jede mit einem `ModulRunner` versehen, der in einem seperaten Thread oder Prozess laufen darf. Module können nun mit Hilfe von `moduleRunner.import(url)` importiert werden.

## Migration Guide

Schauen Sie sich den [Environment API für Frameworks Leitfaden](../guide/api-environment-frameworks.md) an.

`server.ssrFixStacktrace` und `server.ssrRewriteStacktrace` müssen nicht aufgerufen werden, wenn die Module Runner APIs verwendet werden. Die Stapelverfolgungen werden aktualisiert, außer `sourcemapInterceptor` wird auf `false` gesetzt.
