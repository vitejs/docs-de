# Migration von v6

## Node.js Unterstützung

Vite hat die Unterstützung von Node.js 18 beendet, welches das Ende seines Lebenszyklus erreicht hat. Node.js 20.19+ / 22.12+ wird nun benötigt.

## Änderung des Standardbrowsers

Der Standartwert für Browser in `build.target` wurde auf aktuellere Browser angepasst.

- Chrome 87 → 107
- Edge 88 → 107
- Firefox 78 → 104
- Safari 14.0 → 16.0

Diese Browserversionen richten sich nach den Funktionsumfängen der [Baseline](https://web-platform-dx.github.io/web-features/) Widely Available vom 01.05.2025. Mit anderen Worten, Sie wurden alle vor dem 01.11.2022 veröffentlicht.

In Vite 5 wurde das standardmäßige Ziel als `'modules'` bezeichnet, aber das ist nicht länger verfügbar. Stattdessen wurde das neue standardmäßige Ziel `'baseline-widely-available'` eingeführt.

## Allgemeine Änderungen

### Unterstützung für die veraltete Sass-API entfernt

Wie geplant, wurde die Unterstützung für die veraltete Sass-API entfernt. Vite unterstützt nun nur noch die moderne API. Dementsprechend können Sie die `css.preprocessorOptions.sass.api` / `css.preprocessorOptions.scss.api`-Option entfernen.

## Veraltete Funktionen entfernt

- `splitVendorChunkPlugin` (veraltet in v5.2.7)
  - Diese Plugin wurde ursprünglich eingeführt, um die Migration zu Vite v2.9 zu vereinfachen.
  - Die `build.rollupOptions.output.manualChunks`-Option kann verwendet werden, um das Chunking-Verhalten bei Bedarf zu steuern.
- Hook-Ebene `enforce` / `transform` für `transformIndexHtml` (veraltet in v4.0.0)
  - Es wurde angepasst, um das Interace auf [Rollups Objekt-Hooks](https://rollupjs.org/plugin-development/#build-hooks:~:text=Instead%20of%20a%20function%2C%20hooks%20can%20also%20be%20objects.) auszurichten.
  - `order` sollte anstelle von `enforce` und `handler` anstelle von `transform` verwendet werden.

## Fortgeschrittenes

Es gibt weitere grundlegende Änderungen, welche nur ein paar Nutzer betreffen.


- [[#19979] chore: declare version range for peer dependencies](https://github.com/vitejs/vite/pull/19979)
  - Der Versionsbereich der Peer-Abhängigkeiten für CSS-Präprozessoren wurde festgelegt.
- [[#20013] refactor: remove no-op `legacy.proxySsrExternalModules`](https://github.com/vitejs/vite/pull/20013)
  - `legacy.proxySsrExternalModules`-Eigenschaft hatte keinen Effekt seit Vite 6. Es wurde nun entfernt.
- [[#19985] refactor!: remove deprecated no-op type only properties](https://github.com/vitejs/vite/pull/19985)
  - Die folgenden ungenutzten Eigenschaften wurden nun entefernt: `ModuleRunnerOptions.root`, `ViteDevServer._importGlobMap`, `ResolvePluginOptions.isFromTsImporter`, `ResolvePluginOptions.getDepsOptimizer`, `ResolvePluginOptions.shouldExternalize`, `ResolvePluginOptions.ssrConfig`
- [[#19986] refactor: remove deprecated env api properties](https://github.com/vitejs/vite/pull/19986)
  - Diese Eigenschaften waren vom Beginn an veraltet und wurden nun entfernt.
- [[#19987] refactor!: remove deprecated `HotBroadcaster` related types](https://github.com/vitejs/vite/pull/19987)
  - Diese Typen wurden eingeführt als Teil der nun veralteten Laufzeit API. Entfernt wurden: `HMRBroadcaster`, `HMRBroadcasterClient`, `ServerHMRChannel`, `HMRChannel`
- [[#19996] fix(ssr)!: don't access `Object` variable in ssr transformed code](https://github.com/vitejs/vite/pull/19996)
  - `__vite_ssr_exportName__` ist nun für den Laufzeitkontext des Modul-Runners erforderlich.
- [[#20045] fix: treat all `optimizeDeps.entries` values as globs](https://github.com/vitejs/vite/pull/20045)
  - `optimizeDeps.entries` akzeptiert nun keine literalen String-Pfade mehr. Stattdessen akzeptiert es immer Globs.
- [[#20222] feat: apply some middlewares before `configureServer` hook](https://github.com/vitejs/vite/pull/20222), [[#20224] feat: apply some middlewares before `configurePreviewServer` hook](https://github.com/vitejs/vite/pull/20224)
  - Einige Middlewares werden nun vor dem Hook `configureServer` / `configurePreviewServer` angewendet. Beachten Sie, dass Sie, wenn Sie nicht erwarten, dass eine bestimmte Route die Option [`server.cors`](../config/server-options.md#server-cors) / [`preview.cors`](../config/preview-options.md#preview-cors) anwendet, die entsprechenden Header aus der Antwort entfernen müssen.

## Migration von v5

Sehen Sie sich erst den [Leitfaden für die Migration von v5](https://v6.vite.dev/guide/migration.html) in der Vite v6 Dokumentation an, um die notwendigen Änderungen vorzunehmen, Ihre App zu Vite 6 zu migrieren und fahren Sie anschließend auf dieser Seite fort.