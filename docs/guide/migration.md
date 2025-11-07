# Migration von v5

## Environment API

Als Teil der neuen experimentellen [Environment API](/guide/api-environment.md) war ein großes internes Refactoring notwendig. Vite 6 ist bestrebt, brechende Änderungen zu vermeiden, um sicherzustellen, dass die meisten Projekte schnell auf die neue Hauptversion umsteigen können. Wir werden warten, bis sich ein großer Teil des Ökosystems stabilisiert hat, um dann die Verwendung der neuen APIs zu empfehlen. Es kann einige Randfälle geben, aber diese sollten nur die Nutzung auf niedriger Ebene durch Frameworks und Tools betreffen. Wir haben mit den Maintainern im Ökosystem zusammengearbeitet, um diese Unterschiede vor der Veröffentlichung abzumildern. Bitte [öffnen Sie ein Problem](https://github.com/vitejs/vite/issues/new?assignees=&labels=pending+triage&projects=&template=bug_report.yml), wenn Sie eine Regression entdecken.

Einige interne APIs wurden aufgrund von Änderungen an der Implementierung von Vite entfernt. Wenn Sie sich auf eine von ihnen verlassen haben, erstellen Sie bitte einen [feature request](https://github.com/vitejs/vite/issues/new?assignees=&labels=enhancement%3A+pending+triage&projects=&template=feature_request.yml).

## Vite Runtime API

Die experimentelle Vite Runtime API entwickelte sich zur Module Runner API, die in Vite 6 als Teil der neuen experimentellen [Environment API](/guide/api-environment) veröffentlicht wurde. Da es sich um eine experimentelle Funktion handelte, ist die Entfernung der früheren API, die in Vite 5.1 eingeführt wurde, keine einschneidende Änderung, aber die Benutzer müssen ihre Verwendung auf das Modul-Runner-Äquivalent im Rahmen der Migration auf Vite 6 aktualisieren.

## Allgemeine Änderungen

### Standardwert für `resolve.conditions`

Diese Änderung hat keine Auswirkungen auf Benutzer, die [`resolve.conditions`](/config/shared-options#resolve-conditions) / [`ssr.resolve.conditions`](/config/ssr-options#ssr-resolve-conditions) / [`ssr.resolve.externalConditions`](/config/ssr-options#ssr-resolve-externalconditions) konfiguriert haben.

In Vite 5 war der Standardwert für `resolve.conditions` `[]` und einige Bedingungen wurden intern hinzugefügt. Der Standardwert für `ssr.resolve.conditions` war der Wert von `resolve.conditions`.

Ab Vite 6 werden einige der Bedingungen nicht mehr intern hinzugefügt und müssen in die Konfigurationswerte aufgenommen werden.
Die Bedingungen, die nicht mehr intern hinzugefügt werden, sind

- `resolve.conditions` sind `['module', 'browser', 'development|production']`
- `ssr.resolve.conditions` sind `['module', 'node', 'development|production']`

Die Standardwerte für diese Optionen werden auf die entsprechenden Werte aktualisiert, und „ssr.resolve.conditions“ verwendet „resolve.conditions“ nicht mehr als Standardwert. Beachten Sie, dass „development|production“ eine spezielle Variable ist, die je nach Wert von „process.env.NODE_ENV“ durch „production“ oder „development“ ersetzt wird. Diese Standardwerte werden aus `vite` als `defaultClientConditions` und `defaultServerConditions` exportiert.

Wenn Sie einen benutzerdefinierten Wert für `resolve.conditions` oder `ssr.resolve.conditions` angegeben haben, müssen Sie diesen aktualisieren, um die neuen Bedingungen einzubeziehen.
Wenn Sie beispielsweise zuvor `['custom']` für `resolve.conditions` angegeben haben, müssen Sie stattdessen `['custom', ...defaultClientConditions]` angeben.

### JSON stringify

In Vite 5, wenn [`json.stringify: true`](/config/shared-options#json-stringify) gesetzt ist, war [`json.namedExports`](/config/shared-options#json-namedexports) deaktiviert.

Ab Vite 6 wird `json.namedExports` auch dann nicht deaktiviert, wenn `json.stringify: true` gesetzt ist, und der Wert wird beibehalten. Wenn Sie das vorherige Verhalten erreichen wollen, können Sie `json.namedExports: false` setzen.

Vite 6 führt auch einen neuen Standardwert für `json.stringify` ein, nämlich `'auto'`, der nur große JSON-Dateien stringifizieren wird. Um dieses Verhalten zu deaktivieren, setzen Sie `json.stringify: false`.

### Erweiterte Unterstützung von Asset-Referenzen in HTML-Elementen

In Vite 5 konnten nur wenige unterstützte HTML-Elemente auf Assets verweisen, die von Vite verarbeitet und gebündelt werden, wie z. B. `<link href>`, `<img src>` usw.

Vite 6 erweitert die Unterstützung auf noch mehr HTML-Elemente. Die vollständige Liste finden Sie in der Dokumentation zu den [HTML-Funktionen](/guide/features.html#html).

Um die HTML-Verarbeitung für bestimmte Elemente zu deaktivieren, können Sie dem Element das Attribut `vite-ignore` hinzufügen.

### postcss-load-config

[`postcss-load-config`](https://npmjs.com/package/postcss-load-config) wurde von v4 auf v6 aktualisiert. [`tsx`](https://www.npmjs.com/package/tsx) oder [`jiti`](https://www.npmjs.com/package/jiti) wird nun benötigt, um TypeScript postcss-Konfigurationsdateien zu laden, anstatt [`ts-node`](https://www.npmjs.com/package/ts-node). Auch [`yaml`](https://www.npmjs.com/package/yaml) wird nun benötigt, um YAML postcss Konfigurationsdateien zu laden.

### Sass verwendet jetzt standardmäßig die moderne API

In Vite 5 wurde standardmäßig die Legacy-API für Sass verwendet. Vite 5.4 fügte Unterstützung für die moderne API hinzu.

Ab Vite 6 wird die moderne API standardmäßig für Sass verwendet. Wenn Sie weiterhin die Legacy-API verwenden möchten, können Sie [`css.preprocessorOptions.sass.api: 'legacy'` / `css.preprocessorOptions.scss.api: 'legacy'`](/config/shared-options#css-preprocessoroptions) einstellen. Beachten Sie jedoch, dass die Unterstützung der Legacy-API in Vite 7 entfernt wird.

Um zur modernen API zu migrieren, lesen Sie bitte die [Sass-Dokumentation](https://sass-lang.com/documentation/breaking-changes/legacy-js-api/).

### CSS-Ausgabedateinamen im Bibliotheksmodus anpassen

In Vite 5 lautete der CSS-Ausgabedateiname im Bibliotheksmodus immer „style.css“ und konnte nicht ohne Weiteres über die Vite-Konfiguration geändert werden.

Ab Vite 6 wird für den Standarddateinamen nun „name“ aus „package.json“ verwendet, ähnlich wie bei den JS-Ausgabedateien. Wenn [`build.lib.fileName`](/config/build-options.md#build-lib) mit einer Zeichenfolge festgelegt ist, wird dieser Wert auch für den Namen der CSS-Ausgabedatei verwendet. Um explizit einen anderen CSS-Dateinamen festzulegen, können Sie die neue Option [`build.lib.cssFileName`](/config/build-options.md#build-lib) verwenden.

Wenn Sie sich bisher auf den Dateinamen `style.css` verlassen haben, sollten Sie für die Migration die Verweise darauf auf den neuen Namen basierend auf Ihrem Paketnamen aktualisieren. Beispiel:

```json [package.json]
{
  "name": "my-lib",
  "exports": {
    "./style.css": "./dist/style.css" // [!code --]
    "./style.css": "./dist/my-lib.css" // [!code ++]
  }
}
```

Wenn Sie wie in Vite 5 lieber bei `style.css` bleiben möchten, können Sie stattdessen `build.lib.cssFileName: 'style'` festlegen.

## Erweitert

Es gibt weitere Änderungen, die nur wenige Benutzer betreffen.

- [[#17922] fix(css)!: remove default import in ssr dev](https://github.com/vitejs/vite/pull/17922)
  - Die Unterstützung für den Standardimport von CSS-Dateien wurde [in Vite 4 als veraltet markiert](https://v4.vite.dev/guide/migration.html#importing-css-as-a-string) und in Vite 5 entfernt, wurde jedoch im SSR-Entwicklungsmodus unbeabsichtigt weiterhin unterstützt. Diese Unterstützung wurde nun entfernt.
- [[#15637] fix!: Standardwert für `build.cssMinify` auf `'esbuild'` für SSR setzen](https://github.com/vitejs/vite/pull/15637)
  - [`build.cssMinify`](/config/build-options#build-cssminify) ist nun standardmäßig auch für SSR-Builds aktiviert.
- [[#18070] feat!: Proxy-Bypass mit WebSocket](https://github.com/vitejs/vite/pull/18070)
  - `server.proxy[path].bypass` wird nun für WebSocket-Upgrade-Anfragen aufgerufen, wobei der Parameter `res` in diesem Fall `undefined` ist.
- [[#18209] refactor!: Minimale Terser-Version auf 5.16.0 erhöhen](https://github.com/vitejs/vite/pull/18209)
  - Die minimal unterstützte Terser-Version für [`build.minify: 'terser'`](/config/build-options#build-minify) wurde von 5.4.0 auf 5.16.0 erhöht.
- [[#18231] chore(deps): Aktualisierung der Abhängigkeit @rollup/plugin-commonjs auf v28](https://github.com/vitejs/vite/pull/18231)
  - [`commonjsOptions.strictRequires`](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#strictrequires) ist jetzt standardmäßig auf `true` gesetzt (vorher war es `'auto'`).
    - Dies kann zu größeren Bundle-Größen führen, sorgt aber für deterministischere Builds.
    - Wenn Sie eine CommonJS-Datei als Einstiegspunkt angeben, sind möglicherweise zusätzliche Schritte erforderlich. Weitere Informationen finden Sie in der [Dokumentation zum CommonJS-Plugin](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#using-commonjs-files-as-entry-points).
- [[#18243] chore(deps)!: Migration von `fast-glob` zu `tinyglobby`](https://github.com/vitejs/vite/pull/18243)
  - Bereichsklammern (`{01..03}` ⇒ `['01', '02', '03']`) und inkrementelle Klammern (`{2..8..2}` ⇒ `['2', '4', '6', '8']`) werden in Globs nicht mehr unterstützt.
- [[#18395] feat(resolve)!: Bedingungen entfernen zulassen](https://github.com/vitejs/vite/pull/18395)
  - Dieser PR führt nicht nur die oben erwähnte grundlegende Änderung „Standardwert für `resolve.conditions`” ein, sondern sorgt auch dafür, dass `resolve.mainFields` nicht für nicht externalisierte Abhängigkeiten in SSR verwendet wird. Wenn Sie `resolve.mainFields` verwendet haben und dies auf nicht externalisierte Abhängigkeiten in SSR anwenden möchten, können Sie [`ssr.resolve.mainFields`](/config/ssr-options#ssr-resolve-mainfields) verwenden.
- [[#18493] refactor: Option „fs.cachedChecks“ entfernen](https://github.com/vitejs/vite/pull/18493)
- Diese optionale Optimierung wurde aufgrund von Randfällen entfernt, die beim Schreiben einer Datei in einen zwischengespeicherten Ordner und deren sofortigem Import auftraten.
- ~~[[#18697] fix(deps)!: update dependency dotenv-expand to v12](https://github.com/vitejs/vite/pull/18697)~~
  - ~~Variablen, die bei der Interpolation verwendet werden, sollten nun vor der Interpolation deklariert werden. Weitere Informationen finden Sie unter [dem `dotenv-expand`-Changelog](https://github.com/motdotla/dotenv-expand/blob/v12.0.1/CHANGELOG.md#1200-2024-11-16).~~ Diese grundlegende Änderung wurde in Version 6.1.0 rückgängig gemacht. 
- [[#16471] feat: v6 - Environment API](https://github.com/vitejs/vite/pull/16471)

  - Aktualisierungen eines reinen SSR-Moduls lösen im Client keinen vollständigen Seitenneuladen mehr aus. Um zum vorherigen Verhalten zurückzukehren, kann ein benutzerdefiniertes Vite-Plugin verwendet werden:
    <details>
    <summary>Click to expand example</summary>

    ```ts twoslash
    import type { Plugin, EnvironmentModuleNode } from 'vite'

    function hmrReload(): Plugin {
      return {
        name: 'hmr-reload',
        enforce: 'post',
        hotUpdate: {
          order: 'post',
          handler({ modules, server, timestamp }) {
            if (this.environment.name !== 'ssr') return

            let hasSsrOnlyModules = false

            const invalidatedModules = new Set<EnvironmentModuleNode>()
            for (const mod of modules) {
              if (mod.id == null) continue
              const clientModule =
                server.environments.client.moduleGraph.getModuleById(mod.id)
              if (clientModule != null) continue

              this.environment.moduleGraph.invalidateModule(
                mod,
                invalidatedModules,
                timestamp,
                true
              )
              hasSsrOnlyModules = true
            }

            if (hasSsrOnlyModules) {
              server.ws.send({ type: 'full-reload' })
              return []
            }
          },
        },
      }
    }
    ```

    </details>

## Migration von v4

Schauen Sie sich zuerst den [Migration from v4 Guide](https://v5.vite.dev/guide/migration.html) in den Vite v5 Docs an, um zu sehen, welche Änderungen notwendig sind, um Ihre Anwendung auf Vite 5 zu portieren, und fahren Sie dann mit den Änderungen auf dieser Seite fort.
