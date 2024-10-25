# Migration von v5

## Environment API

Als Teil der neuen experimentellen [Environment API](/guide/api-environment.md) war ein großes internes Refactoring notwendig. Vite 6 ist bestrebt, brechende Änderungen zu vermeiden, um sicherzustellen, dass die meisten Projekte schnell auf die neue Hauptversion umsteigen können. Wir werden warten, bis sich ein großer Teil des Ökosystems stabilisiert hat, um dann die Verwendung der neuen APIs zu empfehlen. Es kann einige Randfälle geben, aber diese sollten nur die Nutzung auf niedriger Ebene durch Frameworks und Tools betreffen. Wir haben mit den Maintainern im Ökosystem zusammengearbeitet, um diese Unterschiede vor der Veröffentlichung abzumildern. Bitte [öffnen Sie ein Problem](https://github.com/vitejs/vite/issues/new?assignees=&labels=pending+triage&projects=&template=bug_report.yml), wenn Sie eine Regression entdecken.

Einige interne APIs wurden aufgrund von Änderungen an der Implementierung von Vite entfernt. Wenn Sie sich auf eine von ihnen verlassen haben, erstellen Sie bitte einen [feature request](https://github.com/vitejs/vite/issues/new?assignees=&labels=enhancement%3A+pending+triage&projects=&template=feature_request.yml).

## Vite Runtime API

Die experimentelle Vite Runtime API entwickelte sich zur Module Runner API, die in Vite 6 als Teil der neuen experimentellen [Environment API](/guide/api-environment) veröffentlicht wurde. Da es sich um eine experimentelle Funktion handelte, ist die Entfernung der früheren API, die in Vite 5.1 eingeführt wurde, keine einschneidende Änderung, aber die Benutzer müssen ihre Verwendung auf das Modul-Runner-Äquivalent im Rahmen der Migration auf Vite 6 aktualisieren.

## Allgemeine Änderungen

### JSON stringify

In Vite 5, wenn [`json.stringify: true`](/config/shared-options#json-stringify) gesetzt ist, war [`json.namedExports`](/config/shared-options#json-namedexports) deaktiviert.

Ab Vite 6 wird `json.namedExports` auch dann nicht deaktiviert, wenn `json.stringify: true` gesetzt ist, und der Wert wird beibehalten. Wenn Sie das vorherige Verhalten erreichen wollen, können Sie `json.namedExports: false` setzen.

Vite 6 führt auch einen neuen Standardwert für `json.stringify` ein, nämlich `'auto'`, der nur große JSON-Dateien stringifizieren wird. Um dieses Verhalten zu deaktivieren, setzen Sie `json.stringify: false`.

### Sass verwendet jetzt standardmäßig die moderne API

In Vite 5 wurde standardmäßig die Legacy-API für Sass verwendet. Vite 5.4 fügte Unterstützung für die moderne API hinzu.

Ab Vite 6 wird die moderne API standardmäßig für Sass verwendet. Wenn Sie weiterhin die Legacy-API verwenden möchten, können Sie [`css.preprocessorOptions.sass.api: 'legacy'` / `css.preprocessorOptions.scss.api: 'legacy'`](/config/shared-options#css-preprocessoroptions) einstellen. Beachten Sie jedoch, dass die Unterstützung der Legacy-API in Vite 7 entfernt wird.

Um auf die moderne API umzusteigen, siehe [die Sass-Dokumentation](https://sass-lang.com/documentation/breaking-changes/legacy-js-api/).

## Erweitert

Es gibt weitere Änderungen, die nur wenige Benutzer betreffen.

- [[#15637] fix!: default `build.cssMinify` to `'esbuild'` for SSR](https://github.com/vitejs/vite/pull/15637)
  - [`build.cssMinify`](/config/build-options#build-cssminify) is now enabled by default even for SSR builds.
- [[#18209] refactor!: bump minimal terser version to 5.16.0](https://github.com/vitejs/vite/pull/18209)
  - Minimal supported terser version for [`build.minify: 'terser'`](/config/build-options#build-minify) was bumped to 5.16.0 from 5.4.0.
- [[#18231] chore(deps): update dependency @rollup/plugin-commonjs to v28](https://github.com/vitejs/vite/pull/18231)
  - [`commonjsOptions.strictRequires`](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#strictrequires) is now `true` by default (was `'auto'` before).
- [[#18243] chore(deps)!: migrate `fast-glob` to `tinyglobby`](https://github.com/vitejs/vite/pull/18243)
  - Range braces (`{01..03}` ⇒ `['01', '02', '03']`) and incremental braces (`{2..8..2}` ⇒ `['2', '4', '6', '8']`) are no longer supported in globs.

## Migration von v4

Schauen Sie sich zuerst den [Migration from v4 Guide](https://v5.vite.dev/guide/migration.html) in den Vite v5 Docs an, um zu sehen, welche Änderungen notwendig sind, um Ihre Anwendung auf Vite 5 zu portieren, und fahren Sie dann mit den Änderungen auf dieser Seite fort.
