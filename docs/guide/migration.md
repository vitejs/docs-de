# Migration von v7

## Neue Funktionen

::: tip Vorläufiger Abschnitt

Dieser Abschnitt wird vor der Veröffentlichung der stabilen Version in den Release-Beitrag verschoben.

:::

### Integrierte Unterstützung für tsconfig `paths`

Vite 8 bietet nun eine integrierte Unterstützung für TypeScripts `paths`-Option basierend auf [Oxc Resolver](https://oxc.rs/docs/guide/usage/resolver) . Diese Funktion hat kleine Leistungseinbußen und [vom TypeScript-Team wird davon abgeraten, diese Option zu verwenden, um das Verhalten externer Tools zu ändern](https://www.typescriptlang.org/tsconfig/#paths:~:text=Note%20that%20this%20feature%20does%20not%20change%20how%20import%20paths%20are%20emitted%20by%20tsc%2C%20so%20paths%20should%20only%20be%20used%20to%20inform%20TypeScript%20that%20another%20tool%20has%20this%20mapping%20and%20will%20use%20it%20at%20runtime%20or%20when%20bundling.), wodurch es standardmäßig nicht aktiviert ist. Unter Berücksichtigung dieser Einschränkung können Sie diese Funktion aktivieren, indem Sie `resolve.tsconfigPaths` auf `true` setzen.

Die `tsconfig.json` im nächsten Elternverzeichnis wird verwendet. Für mehr Details über die Auflösung der `tsconfig.json`, schauen Sie sich die [Funktionen-Seite(/guide/features#typescript-compiler-options) an.

### Unterstützung für `emitDecoratorMetadata`

Vite 8 bietet nun basierend auf [Oxc Transformer](https://oxc.rs/docs/guide/usage/transformer) eine integrierte Unterstützung für die [`emitDecoratorMetadata`-Option](https://www.typescriptlang.org/tsconfig/#emitDecoratorMetadata) von TypeScript. Diese Funktion wird autoamtisch aktiviert, wenn Sie `emitDecoratorMetadata` in Ihrer `tsconfig.json` auf `true` gesetzt haben.

Diese Transformation hat einige Einschränkungen. Vollständige Unterstützung für Dekorator-Metadaten setzt die Typinferenz durch den TypeScript-Compiler voraus, die nicht unterstützt wird. Weitere Details finden Sie in der [Dokumentation des Oxc-Transformers](https://oxc.rs/docs/guide/usage/transformer/typescript#decorators).

## Änderung des Standard-Browserziels

Der Standardwert für `build.target`, `'baseline-widely-available'`, wurde auf einen neueren Browser aktualisiert.

- Chrome 107 → 111
- Edge 107 → 111
- Firefox 104 → 114
- Safari 16.0 → 16.4

Diese Browserversionen entsprechen den [Baseline Widely Available](https://web-platform-dx.github.io/web-features/)-Funktionsumfängen zum Stand vom 01.01.2026. Mit anderen Worten: Sie wurden alle ungefähr vor zweieinhalb Jahren veröffentlicht.

## Rolldown

Vite 8 verwendet Rolldown und Oxc-basierte Tools anstelle von esbuild und Rollup.

### Schrittweise Migration

Das Paket `rolldown-vite` implementiert Vite 7 mit Rolldown-Integration, jedoch ohne die übrigen Änderungen von Vite 8. Dies kann als Zwischenschritt bei der Migration zu Vite 8 genutzt werden. Siehe [Anleitung zur Rolldown-Integration](https://v7.vite.dev/guide/rolldown) in der Vite-7-Dokumentation, um von Vite 7 auf `rolldown-vite` umzusteigen.

Benutzer, die von `rolldown-vite` auf Vite 8 migrieren, können die Änderung an der Abhängigkeit in der `package.json` rückgängig machen und auf Vite 8 aktualisieren:

```json
{
  "devDependencies": {
    "vite": "npm:rolldown-vite@7.2.2" // [!code --]
    "vite": "^8.0.0" // [!code ++]
  }
}
```

### Der Abhängigkeitsoptimierer verwendet nun Rolldown

Rolldown wird nun anstelle von esbuild für die Abhängigkeitsoptimierung verwendet. Vite unterstützt weiterhin die Option [`optimizeDeps.esbuildOptions`](/config/dep-optimization-options#optimizedeps-esbuildoptions) aus Gründen der Abwärtskompatibilität, indem diese automatisch in [`optimizeDeps.rolldownOptions`](/config/dep-optimization-options#optimizedeps-rolldownoptions) umgewandelt wird. `optimizeDeps.esbuildOptions` ist nun veraltet und wird in Zukunft entfernt. Wir empfehlen Ihnen daher, auf `optimizeDeps.rolldownOptions` umzusteigen.

Die folgenden Optionen werden automatisch konvertiert:

- [`esbuildOptions.minify`](https://esbuild.github.io/api/#minify) -> `rolldownOptions.output.minify`
- [`esbuildOptions.treeShaking`](https://esbuild.github.io/api/#tree-shaking) -> `rolldownOptions.treeshake`
- [`esbuildOptions.define`](https://esbuild.github.io/api/#define) -> `rolldownOptions.transform.define`
- [`esbuildOptions.loader`](https://esbuild.github.io/api/#loader) -> `rolldownOptions.moduleTypes`
- [`esbuildOptions.preserveSymlinks`](https://esbuild.github.io/api/#preserve-symlinks) -> `!rolldownOptions.resolve.symlinks`
- [`esbuildOptions.resolveExtensions`](https://esbuild.github.io/api/#resolve-extensions) -> `rolldownOptions.resolve.extensions`
- [`esbuildOptions.mainFields`](https://esbuild.github.io/api/#main-fields) -> `rolldownOptions.resolve.mainFields`
- [`esbuildOptions.conditions`](https://esbuild.github.io/api/#conditions) -> `rolldownOptions.resolve.conditionNames`
- [`esbuildOptions.keepNames`](https://esbuild.github.io/api/#keep-names) -> `rolldownOptions.output.keepNames`
- [`esbuildOptions.platform`](https://esbuild.github.io/api/#platform) -> `rolldownOptions.platform`
- [`esbuildOptions.plugins`](https://esbuild.github.io/plugins/) -> `rolldownOptions.plugins` (teilweise Unterstützung)

<!-- TODO: add link to rolldownOptions.* -->

Sie können die von der Kompatibilitätsschicht festgelegten Optionen auch über den `configResolved`-Hook abrufen:

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.optimizeDeps.rolldownOptions)
  },
},
```

### JavaScript-Transformation mit Oxc

Anstelle von esbuild wird nun Oxc für die JavaScript-Transformation verwendet. Vite unterstützt die Option [`esbuild`](/config/shared-options#esbuild) aus Gründen der Abwärtskompatibilität weiterhin, konvertiert sie jedoch automatisch in [`oxc`](/config/shared-options#oxc). `esbuild` ist nun veraltet und wird in Zukunft entfernt. Wir empfehlen Ihnen daher, auf `oxc` umzusteigen.

Die folgenden Optionen werden automatisch konvertiert:

- `esbuild.jsxInject` -> `oxc.jsxInject`
- `esbuild.include` -> `oxc.include`
- `esbuild.exclude` -> `oxc.exclude`
- [`esbuild.jsx`](https://esbuild.github.io/api/#jsx) -> [`oxc.jsx`](https://oxc.rs/docs/guide/usage/transformer/jsx)
  - `esbuild.jsx: 'preserve'` -> `oxc.jsx: 'preserve'`
  - `esbuild.jsx: 'automatic'` -> `oxc.jsx: { runtime: 'automatic' }`
    - [`esbuild.jsxImportSource`](https://esbuild.github.io/api/#jsx-import-source) -> `oxc.jsx.importSource`
  - `esbuild.jsx: 'transform'` -> `oxc.jsx: { runtime: 'classic' }`
    - [`esbuild.jsxFactory`](https://esbuild.github.io/api/#jsx-factory) -> `oxc.jsx.pragma`
    - [`esbuild.jsxFragment`](https://esbuild.github.io/api/#jsx-fragment) -> `oxc.jsx.pragmaFrag`
  - [`esbuild.jsxDev`](https://esbuild.github.io/api/#jsx-dev) -> `oxc.jsx.development`
  - [`esbuild.jsxSideEffects`](https://esbuild.github.io/api/#jsx-side-effects) -> `oxc.jsx.pure`
- [`esbuild.define`](https://esbuild.github.io/api/#define) -> [`oxc.define`](https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#define)
- [`esbuild.banner`](https://esbuild.github.io/api/#banner) -> benutzerdefiniertes Plugin mit Transform-Hook
- [`esbuild.footer`](https://esbuild.github.io/api/#footer) -> benutzerdefiniertes Plugin mit Transform-Hook

Die Option [`esbuild.supported`](https://esbuild.github.io/api/#supported) wird von Oxc nicht unterstützt. Wenn Sie diese Option benötigen, lesen Sie bitte [oxc-project/oxc#15373](https://github.com/oxc-project/oxc/issues/15373).

Sie können die von der Kompatibilitätsschicht festgelegten Optionen über den `configResolved`-Hook abrufen:

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.oxc)
  },
},
```

<!-- TODO: add link to rolldownOptions.output.minify -->

Derzeit unterstützt der Oxc-Transformer das Herunterkonvertieren nativer Dekoratoren nicht, da wir auf das Fortschreiten der Spezifikation warten, siehe([oxc-project/oxc#9170](https://github.com/oxc-project/oxc/issues/9170)).

:::: details Workaround für das Herunterkonvertieren nativer Dekoratoren

Sie können vorerst [Babel](https://babeljs.io/) oder [SWC](https://swc.rs/) verwenden, um native Dekoratoren herunterzukonvertieren. SWC ist zwar schneller als Babel, unterstützt jedoch **nicht die neueste Dekorator-Spezifikation**, die esbuild unterstützt.

Die Dekorator-Spezifikation wurde seit Erreichen von Stage 3 mehrfach aktualisiert. Die unterstützen Versionen von jedem Tool sind:

- `"2023-11"` (esbuild und TypeScript5.4+ sowie Babel unterstützen diese Version)
- `"2023-05"` (TypeScript5.2+ unterstützt diese Version)
- `"2023-01"` (TypeScript5.0+ unterstützt diese Version)
- `"2022-03"` (SWC unterstützt diese Version)

Schauen Sie sich den [Babel-Dekoratorversionen-Leitfaden](https://babeljs.io/docs/babel-plugin-proposal-decorators#version) für Unterschiede zwischen den Versionen an.

**Babel verwenden:**

::: code-group

```bash [npm]
$ npm install -D @rollup/plugin-babel @babel/plugin-proposal-decorators
```

```bash [Yarn]
$ yarn add -D @rollup/plugin-babel @babel/plugin-proposal-decorators
```

```bash [pnpm]
$ pnpm add -D @rollup/plugin-babel @babel/plugin-proposal-decorators
```

```bash [Bun]
$ bun add -D @rollup/plugin-babel @babel/plugin-proposal-decorators
```

```bash [Deno]
$ deno add -D npm:@rollup/plugin-babel npm:@babel/plugin-proposal-decorators
```

:::

```ts [vite.config.ts]
import { defineConfig, withFilter } from 'vite'
import { babel } from '@rollup/plugin-babel'

export default defineConfig({
  plugins: [
    withFilter(
      babel({
        configFile: false,
        plugins: [
          ['@babel/plugin-proposal-decorators', { version: '2023-11' }],
        ],
      }),
      // Führe diese Transformation nur aus, wenn die Datei einen Dekorator enthält
      { transform: { code: '@' } },
    ),
  ],
})
```

**SWC verwenden:**

::: code-group

```bash [npm]
$ npm install -D @rollup/plugin-swc @swc/core
```

```bash [Yarn]
$ yarn add -D @rollup/plugin-swc @swc/core
```

```bash [pnpm]
$ pnpm add -D @rollup/plugin-swc @swc/core
```

```bash [Bun]
$ bun add -D @rollup/plugin-swc @swc/core
```

```bash [Deno]
$ deno add -D npm:@rollup/plugin-swc npm:@swc/core
```

:::

```js
import { defineConfig, withFilter } from 'vite'

export default defineConfig({
  // ...
  plugins: [
    withFilter(
      swc({
        swc: {
          jsc: {
            parser: { decorators: true, decoratorsBeforeExport: true },
            // NOTIZ: SWC unterstützt Version '2023-11' noch nicht.
            transform: { decoratorVersion: '2022-03' },
          },
        },
      }),
      // Führe diese Transformation nur aus, wenn die Datei einen Dekorator enthält.
      { transform: { code: '@' } },
    ),
  ],
})
```

::::

#### esbuild-Fallbacks

`esbuild` wird von Vite nicht mehr direkt verwendet und ist nun eine optionale Abhängigkeit. Wenn Sie ein Plugin verwenden, das die Funktion `transformWithEsbuild` nutzt, müssen Sie `esbuild` als `devDependency` installieren. Die Funktion `transformWithEsbuild` ist veraltet und wird in Zukunft entfernt. Wir empfehlen stattdessen die Umstellung auf die neue Funktion `transformWithOxc`.

### JavaScript-Minifizierung durch Oxc

Für die JavaScript-Minifizierung wird nun der Oxc-Minimierer anstelle von esbuild verwendet. Sie können die veraltete Option [`build.minify: ‚esbuild‘`](/config/build-options#minify) verwenden, um wieder zu esbuild zurückzukehren. Diese Konfigurationsoption wird in Zukunft entfernt, und Sie müssen `esbuild` als `devDependency` installieren, da Vite nicht mehr direkt auf esbuild angewiesen ist.

Wenn Sie bisher die `esbuild.minify*`-Optionen zur Steuerung des Minifizierungsverhaltens verwendet haben, können Sie nun stattdessen `build.rolldownOptions.output.minify` verwenden. Wenn Sie die Option `esbuild.drop` verwendet haben, können Sie nun die [`build.rolldownOptions.output.minify.compress.drop*`-Optionen](https://oxc.rs/docs/guide/usage/minifier/dead-code-elimination) verwenden.

Das Verzerrung von Eigenschaften und die damit verbundenen Optionen ([`mangleProps`, `reserveProps`, `mangleQuoted`, `mangleCache`](https://esbuild.github.io/api/#mangle-props)) werden von Oxc nicht unterstützt. Wenn Sie diese Optionen benötigen, lesen Sie bitte [oxc-project/oxc#15375](https://github.com/oxc-project/oxc/issues/15375).

esbuild und der Oxc-Minimierer gehen von leicht unterschiedlichen Annahmen bezüglich des Quellcodes aus. Falls Sie vermuten, dass der Minimierer Fehler in Ihrem Code verursacht, können Sie diese Annahmen hier vergleichen:

- [Annahmen von esbuild bei der Minimierung](https://esbuild.github.io/api/#minify-considerations)
- [Annahmen des Oxc-Minimierers](https://oxc.rs/docs/guide/usage/minifier.html#assumptions)

Bitte melden Sie alle Probleme, die Sie im Zusammenhang mit der Minifizierung in Ihren JavaScript-Apps feststellen.

### CSS-Minimierung mit Lightning CSS

[Lightning CSS](https://lightningcss.dev/) wird nun standardmäßig für die CSS-Minifizierung verwendet. Mit der Option [`build.cssMinify: 'esbuild'`](/config/build-options#cssminify) können Sie wieder zu esbuild zurückwechseln. Beachten Sie, dass Sie `esbuild` als Entwicklungsabhängigkeit installieren müssen.

Lightning CSS unterstützt bessere Syntax-Optimierungen und die Größe Ihres CSS-Bündels kann höher ausfallen.

### Konsistente CommonJS-Interoperabilität

Der `default`-Import aus einem CommonJS-Modul (CJS) wird nun einheitlich behandelt.

Wenn eine der folgenden Bedingungen zutrifft, entspricht der `default`-Import dem Wert von `module.exports` des importierten CJS-Moduls. Andernfalls entspricht der `default`-Import dem Wert von `module.exports.default` des importierten CJS-Moduls:

- Der Importeur hat die Endung `.mjs` oder `.mts`.
- Das dem Importeur am nächsten liegende `package.json`-Datei enthält ein `type`-Feld, das auf `module` gesetzt ist.
- Der Wert `module.exports.__esModule` des importierten CJS-Moduls ist nicht auf `true` gesetzt.

::: details Das bisherige Verhalten

In der Entwicklungsumgebung ist der `default`-Import der Wert von `module.exports` des importierten CJS-Moduls, wenn eine der folgenden Bedingungen erfüllt ist. Andernfalls ist der `default`-Import der Wert von `module.exports.default` des importierten CJS-Moduls:

- _Der Importer ist in der Abhängigkeitsoptimierung enthalten_ und hat die Endung `.mjs` oder `.mts`.
- _Der Importer ist in der Abhängigkeitsoptimierung enthalten_ und das dem Importer am nächsten liegende `package.json` hat ein `type`-Feld, das auf `module` gesetzt ist.
- Der Wert `module.exports.__esModule` des importierten CJS-Moduls ist nicht auf `true` gesetzt.

Im Build-Modus lauteten die Bedingungen:

- Der Wert `module.exports.__esModule` des importierten CJS-Moduls ist nicht auf `true` gesetzt.
- _Die Eigenschaft `default` von `module.exports` existiert nicht_.

(vorausgesetzt, [`build.commonjsOptions.defaultIsModuleExports`](https://github.com/rollup/plugins/tree/master/packages/commonjs#defaultismoduleexports) wurde nicht vom Standardwert `'auto'` geändert)

:::

Weitere Informationen finden Sie in Rolldowns Dokumentation zu diesem Problem: [Mehrdeutiger `default`-Import aus CJS-Modulen - CJS-Bündelung | Rolldown](https://rolldown.rs/in-depth/bundling-cjs#ambiguous-default-import-from-cjs-modules).

Diese Änderung kann dazu führen, dass bestehender Code, der CJS-Module importiert, nicht mehr funktioniert. Mit der Option `legacy.inconsistentCjsInterop: true` können Sie das bisherige Verhalten vorübergehend wiederherstellen. Beachten Sie, dass diese Option in Zukunft entfernt wird. Wenn Sie ein Paket finden, das von dieser Änderung betroffen ist, melden Sie dies bitte dem Paketautor. Verweisen Sie dabei unbedingt auf das oben genannte Dokument von Rolldown, damit der Autor den Kontext nachvollziehen kann.

### Modultypunterstützung und automatische Erkennung

Die Änderung betrifft nur Plugin-Authoren.

Rolldown hat eine experimentelle [Modultypunterstützung](https://rolldown.rs/guide/notable-features#module-types), welche ähnlich zu [esbuilds `loader`-Option](https://esbuild.github.io/api/#loader) ist. Dadurch setzt Rolldown automatisch einen Modultyp basierend auf der Erweiterung der aufgelösten ID.

Wenn Sie den Inhalt von anderen Typen in `load`- oder `transform`-Hooks zu JavaScript konvertieren, müssen Sie möglicherweise `moduleType: 'js'` zum zurückgegebenen Wert hinzufügen.

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

### Aufhebung der Modulauflösung mittels Format-Sniffing

Wenn sowohl das Feld `browser` als auch das Feld `module` in `package.json` vorhanden waren, hat Vite das Feld früher anhand des Dateiinhalts aufgelöst und es hat versucht die ESM-Datei für Browser auszuwählen. Dies wurde eingeführt, weil einige Pakete das Feld `module` verwendeten, um auf ESM-Dateien für Node.js zu verweisen, während andere Pakete das Feld `browser` nutzten, um auf UMD-Dateien für Browser zu verweisen. Da das moderne `exports`-Feld dieses Problem gelöst hat und mittlerweile von vielen Paketen verwendet wird, nutzt Vite diese Heuristik nicht mehr und beachtet stets die Reihenfolge der Option [`resolve.mainFields`](/config/shared-options#resolve-mainfields). Falls Sie sich auf dieses Verhalten verlassen haben, können Sie die Option [`resolve.alias`](/config/shared-options#resolve-alias) verwenden, um das Feld der gewünschten Datei zuzuordnen, oder einen Patch mit Ihrem Paketmanager anwenden (z. B. `patch-package`, `pnpm patch`).

### `require`-Aufrufe für externalisierte Module

`require`-Aufrufe für externalisierte Module werden nun als `require`-Aufrufe beibehalten und nicht in `import`-Anweisungen umgewandelt. Dies dient dazu, die Semantik von `require`-Aufrufen zu bewahren. Wenn Sie diese in `import`-Anweisungen umwandeln möchten, können Sie das in Rolldown integrierte `esmExternalRequirePlugin` verwenden, das aus `vite` reexportiert wird.

```js
import { defineConfig, esmExternalRequirePlugin } from 'vite'

export default defineConfig({
  // ...
  plugins: [
    esmExternalRequirePlugin({
      external: ['react', 'vue', /^node:/],
    }),
  ],
})
```

Weitere Informationen finden Sie in der Dokumentation von Rolldown: [`require` externe Module - CJS bündeln | Rolldown](https://rolldown.rs/in-depth/bundling-cjs#require-external-modules).

### `import.meta.url` in UMD / IIFE

`import.meta.url` wird in den Ausgabeformaten UMD / IIFE nicht länger polyfilled. Es wird standardmäßig durch `undefined` ersetzt. Wenn Sie das bisherige Verhalten bevorzugen, können Sie die Option `define` zusammen mit der Option `build.rolldownOptions.output.intro` verwenden. Weitere Details finden Sie in der Rolldown-Dokumentation: [Bekannte `import.meta`-Eigenschaften - Nicht-ESM-Ausgabeformate | Rolldown](https://rolldown.rs/in-depth/non-esm-output-formats#well-known-import-meta-properties).

### Option `build.rollupOptions.watch.chokidar` entfernt

Die Option `build.rollupOptions.watch.chokidar` wurde entfernt. Bitte wechseln Sie zur Option `build.rolldownOptions.watch.notify`.

<!-- TODO: add link to rolldownOptions.watch.notify -->

### Die Option `build.rollupOptions.output.manualChunks` ist veraltet

Die Option `output.manualChunks` ist veraltet. Rolldown verfügt über die flexiblere Option `advancedChunks`. Weitere Informationen zu `advancedChunks` finden Sie in der Dokumentation von Rolldown: [Advanced Chunks - Rolldown](https://rolldown.rs/in-depth/advanced-chunks).

<!-- TODO: add link to rolldownOptions.output.advancedChunks -->

### Modultypunterstützung und automatische Erkennung

Die Änderung betrifft nur Plugin-Authoren.

Rolldown hat eine experimentelle [Modultypunterstützung](https://rolldown.rs/guide/notable-features#module-types), welche ähnlich zu [esbuilds `loader`-Option](https://esbuild.github.io/api/#loader) ist. Dadurch setzt Rolldown automatisch einen Modultyp basierend auf der Erweiterung der aufgelösten ID. Wenn Sie den Inhalt von anderen Typen in `load`- oder `transform`-Hooks zu JavaScript konvertieren, müssen Sie möglicherweise `moduleType: 'js'` zum zurückgegebenen Wert hinzufügen.

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

### Weitere veraltete Funktionen

Die folgenden Optionen sind veraltet und werden in Zukunft entfernt:

- `build.rollupOptions`: umbenannt in `build.rolldownOptions`
- `worker.rollupOptions`: umbenannt in `worker.rolldownOptions`

## Allgemeine Änderungen

## Entfernte veraltete Funktionen

**_TODO: Diese Änderungen später implementieren_**

## Fortgeschrittenes

Diese grundlegenden Änderungen werden voraussichtlich nur einen kleine Anzahl von Anwendungsfällen betreffen.

- **[TODO: Dies wird vor der stabilen Version behoben]** https://github.com/rolldown/rolldown/issues/5726 (betrifft Nuxt, Qwik)
- **[TODO: Dies wird vor der stabilen Version behoben]** https://github.com/rolldown/rolldown/issues/3403 (betrifft Sveltekit)
- **[TODO: Dies wird vor der stabilen Veröffentlichung behoben]** Legacy-Chunks werden aufgrund der fehlenden Funktion zur Ausgabe vorgefertigter Chunks ([rolldown#4304](https://github.com/rolldown/rolldown/issues/4034)) als Asset-Datei statt als Chunk-Datei ausgegeben. Das bedeutet, dass die Chunk-bezogenen Optionen nicht für Legacy-Chunks gelten und die Manifest-Datei Legacy-Chunks nicht als Chunk-Datei enthält.
- **[TODO: Dies wird vor der stabilen Veröffentlichung behoben]** Der Resolver-Cache verursacht in Vitest kleinere Fehler ([rolldown-vite#466](https://github.com/vitejs/rolldown-vite/issues/466), [vitest#8754](https://github.com/vitest-dev/vitest/issues/8754#issuecomment-3441115032))
- **[TODO: Dies wird vor der stabilen Veröffentlichung behoben]** Der Resolver funktioniert nicht mit yarn pnp ([rolldown-vite#324](https://github.com/vitejs/rolldown-vite/issues/324), [rolldown-vite#392](https://github.com/vitejs/rolldown-vite/issues/392))
- **[TODO: Dies wird vor der stabilen Veröffentlichung behoben]** Problem bei der Reihenfolge nativer Plugins ([rolldown-vite#373](https://github.com/vitejs/rolldown-vite/issues/373))
- **[TODO: Dies wird vor der stabilen Veröffentlichung behoben]** `@vite-ignore`-Kommentar-Sonderfall ([rolldown-vite#426](https://github.com/vitejs/rolldown-vite/issues/426))
- **[TODO: Dies wird vor der stabilen Veröffentlichung behoben]** https://github.com/rolldown/rolldown/issues/3403
- [Extglobs](https://github.com/micromatch/picomatch/blob/master/README.md#extglobs) werden noch nicht unterstützt ([rolldown-vite#365](https://github.com/vitejs/rolldown-vite/issues/365))
- `define` teilt keine Referenz für Objekte: Wenn Sie ein Objekt als Wert an `define` übergeben, erhält jede Variable eine separate Kopie des Objekts. Weitere Details finden Sie im [Oxc Transformer-Dokument](https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#define).
- Änderungen am `bundle`-Objekt (`bundle` ist ein Objekt, das in den Hooks `generateBundle` / `writeBundle` übergeben und von der Funktion `build` zurückgegeben wird):
  - Die Zuweisung an `bundle[foo]` wird nicht unterstützt. Dies wird auch von Rollup nicht empfohlen. Bitte verwenden Sie stattdessen `this.emitFile()`.
  - Die Referenz wird nicht zwischen den Hooks geteilt ([rolldown-vite#410](https://github.com/vitejs/rolldown-vite/issues/410))
  - `structuredClone(bundle)` führt zu einem Fehler mit `DataCloneError: #<Object> could not be cloned`. Dies wird nicht mehr unterstützt. Bitte klonen Sie es mit `structuredClone({ ...bundle })`. ([rolldown-vite#128](https://github.com/vitejs/rolldown-vite/issues/128))
- **[TODO: clarify this in Rolldown's docs and link it from here]** All parallel hooks in Rollup works as sequential hooks.
- `"use strict";` is not injected sometimes. See [Rolldown's documentation](https://rolldown.rs/in-depth/directives) for more details.
- Transforming to lower than ES5 with plugin-legacy is not supported ([rolldown-vite#452](https://github.com/vitejs/rolldown-vite/issues/452))
- Passing the same browser with multiple versions of it to `build.target` option now errors: esbuild selects the latest version of it, which was probably not what you intended.
- Missing support by Rolldown: The following features are not supported by Rolldown and is no longer supported by Vite.
  - `build.rollupOptions.output.format: 'system'` ([rolldown#2387](https://github.com/rolldown/rolldown/issues/2387))
  - `build.rollupOptions.output.format: 'amd'` ([rolldown#2387](https://github.com/rolldown/rolldown/issues/2528))
  - Complete support for TypeScript legacy namespace ([oxc-project/oxc#14227](https://github.com/oxc-project/oxc/issues/14227))
  - `shouldTransformCachedModule` hook ([rolldown#4389](https://github.com/rolldown/rolldown/issues/4389))
  - `resolveImportMeta` hook ([rolldown#1010](https://github.com/rolldown/rolldown/issues/1010))
  - `renderDynamicImport` hook ([rolldown#4532](https://github.com/rolldown/rolldown/issues/4532))
  - `resolveFileUrl` hook
- `parseAst` / `parseAstAsync` functions are now deprecated in favor of `parse` / `parseAsync` functions which has more features.
- Alle parallelen Hooks in Rollup funktionieren wie sequenzielle Hooks. Siehe [Rolldown-Dokumentation](https://rolldown.rs/apis/plugin-api#sequential-hook-execution) für mehr Details.
- ``use strict`;` wird manchmal nicht eingefügt. Weitere Details finden Sie in der [Rolldown-Dokumentation](https://rolldown.rs/in-depth/directives).
- Die Umwandlung auf eine Version unter ES5 mit plugin-legacy wird nicht unterstützt ([rolldown-vite#452](https://github.com/vitejs/rolldown-vite/issues/452))
- Die Übergabe desselben Browsers mit mehreren Versionen an die Option `build.target` führt nun zu einem Fehler: esbuild wählt die neueste Version aus, was wahrscheinlich nicht beabsichtigt war.
- Fehlende Unterstützung durch Rolldown: Die folgenden Funktionen werden von Rolldown nicht unterstützt und sind auch in Vite nicht mehr verfügbar.
  - `build.rollupOptions.output.format: 'system'` ([rolldown#2387](https://github.com/rolldown/rolldown/issues/2387))
  - `build.rollupOptions.output.format: 'amd'` ([rolldown#2387](https://github.com/rolldown/rolldown/issues/2528))
  - Vollständige Unterstützung für den alten TypeScript-Namespace ([oxc-project/oxc#14227](https://github.com/oxc-project/oxc/issues/14227))
  - `shouldTransformCachedModule`-Hook ([rolldown#4389](https://github.com/rolldown/rolldown/issues/4389))
  - `resolveImportMeta`-Hook ([rolldown#1010](https://github.com/rolldown/rolldown/issues/1010))
  - `renderDynamicImport`-Hook ([rolldown#4532](https://github.com/rolldown/rolldown/issues/4532))
  - `resolveFileUrl`-Hook
- Die Funktionen `parseAst` / `parseAstAsync` sind nun veraltet und werden durch die Funktionen `parse` / `parseAsync` ersetzt, die mehr Funktionen hat

## Migration von Version 6

Lesen Sie zunächst den [Leitfaden zur Migration von Version 6](https://v7.vite.dev/guide/migration) in der Vite-v7-Dokumentation, um zu erfahren, welche Änderungen erforderlich sind, um Ihre App auf Vite 7 umzustellen, und fahren Sie dann mit den Änderungen auf dieser Seite fort.