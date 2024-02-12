# Optionen zur Optimierung der Abhängigkeiten

- **Verwandt:** [Abhängigkeitsvor-Bündelung](/guide/dep-pre-bundling)

## optimizeDeps.entries

- **Typ:** `string | string[]`

Standardmäßig durchsucht Vite alle Ihre `.html`-Dateien, um Abhängigkeiten zu erkennen, die vorab gebündelt werden müssen (ignoriert `node_modules`, `build.outDir`, `__tests__` und `coverage`). Wenn `build.rollupOptions.input` angegeben ist, durchsucht Vite stattdessen diese Einstiegspunkte.

Wenn keines davon Ihren Anforderungen entspricht, können Sie benutzerdefinierte Einstiegspunkte mit dieser Option angeben. Der Wert sollte ein [fast-glob-Muster](https://github.com/mrmlnc/fast-glob#basic-syntax) oder ein Array von Mustern sein, die relativ zum Wurzelverzeichnis des Vite-Projekts sind. Dies überschreibt die Standard-Einstiegspunkte. Wenn `optimizeDeps.entries` explizit definiert ist, werden standardmäßig nur die Ordner `node_modules` und `build.outDir` ignoriert. Wenn andere Ordner ignoriert werden müssen, können Sie ein Ignore-Muster als Teil der Einstiegspunkte verwenden, markiert mit einem initialen `!`.

## optimizeDeps.exclude

- **Typ:** `string[]`

Abhängigkeiten, die von der Vorab-Bündelung ausgeschlossen werden sollen.

:::warning CommonJS
CommonJS-Abhängigkeiten sollten nicht von der Optimierung ausgeschlossen werden. Wenn eine ESM-Abhängigkeit von der Optimierung ausgeschlossen ist, aber eine verschachtelte CommonJS-Abhängigkeit hat, sollte die CommonJS-Abhängigkeit zu `optimizeDeps.include` hinzugefügt werden. Beispiel:

```js
export default defineConfig({
  optimizeDeps: {
    include: ['esm-dep > cjs-dep']
  }
})
```

:::

## optimizeDeps.include

- **Typ:** `string[]`

Standardmäßig werden verknüpfte Pakete, die sich nicht in `node_modules` befinden, nicht vorab gebündelt. Verwenden Sie diese Option, um ein verknüpftes Paket zur Vorab-Bündelung zu zwingen.

**Experimentell:** Wenn Sie eine Bibliothek mit vielen tiefen Importen verwenden, können Sie auch ein abschließendes Glob-Muster angeben, um alle tiefen Importe auf einmal vorab zu bündeln. Dies vermeidet ständiges Vorab-Bündeln, wenn ein neuer tiefer Import verwendet wird. [Feedback geben](https://github.com/vitejs/vite/discussions/15833). Zum Beispiel:

```js
export default defineConfig({
  optimizeDeps: {
    include: ['my-lib/components/**/*.vue']
  }
})
```

## optimizeDeps.esbuildOptions

- **Typ:** [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)`<`[`EsbuildBuildOptions`](https://esbuild.github.io/api/#simple-options)`,
  | 'bundle'
  | 'entryPoints'
  | 'external'
  | 'write'
  | 'watch'
  | 'outdir'
  | 'outfile'
  | 'outbase'
  | 'outExtension'
  | 'metafile'>`

Optionen, die an esbuild während des Abhängigkeits-Scannens und der Optimierung übergeben werden sollen.

Bestimmte Optionen werden ausgelassen, da ihre Änderung nicht mit der Abhängigkeitsoptimierung von Vite kompatibel wäre.

- `external` wird ebenfalls ausgelassen, verwenden Sie Vites `optimizeDeps.exclude`-Option
- `plugins` werden mit dem Abhängigkeits-Plugin von Vite zusammengeführt

## optimizeDeps.force

- **Typ:** `boolean`

Setzen Sie dies auf `true`, um die Vorab-Bündelung von Abhängigkeiten zu erzwingen und zuvor zwischengespeicherte optimierte Abhängigkeiten zu ignorieren.

## optimizeDeps.holdUntilCrawlEnd

- **Experimentell:** [Feedback geben](https://github.com/vitejs/vite/discussions/15834)
- **Typ:** `boolean`
- **Standard:** `true`

Wenn diese Funktion aktiviert ist, werden die ersten optimierten Deps-Ergebnisse zurückgehalten, bis alle statischen Importe beim kalten Start gecrawlt wurden. Dadurch wird vermieden, dass die gesamte Seite neu geladen werden muss, wenn neue Abhängigkeiten entdeckt werden und diese die Erzeugung neuer gemeinsamer Chunks auslösen. Wenn alle Abhängigkeiten vom Scanner gefunden werden, inklusive der explizit definierten in `include`, ist es besser, diese Option zu deaktivieren, damit der Browser mehr Anfragen parallel verarbeiten kann.

## optimizeDeps.disabled

- **Veraltet**
- **Experimentell:** [Feedback geben](https://github.com/vitejs/vite/discussions/13839)
- **Typ:** `boolean | 'build' | 'dev'`
- **Standard:** `'build'`

Diese Option ist veraltet. Ab Vite 5.1 wurde die Vorbündelung von Abhängigkeiten während der Erstellung entfernt. Wenn `optimizeDeps.disabled` auf `true` oder `'dev'` gesetzt wird, wird der Optimierer deaktiviert, und wenn `false` oder `'build'` gesetzt wird, bleibt der Optimierer während der Entwicklung aktiviert.

Um den Optimierer vollständig zu deaktivieren, verwenden Sie `optimizeDeps.noDiscovery: true`, um die automatische Erkennung von Abhängigkeiten zu unterbinden und lassen Sie `optimizeDeps.include` undefiniert oder leer.

:::warning
Die Optimierung von Abhängigkeiten während der Build-Zeit war eine **experimentelle** Funktion. Projekte, die diese Strategie ausprobierten, entfernten auch `@rollup/plugin-commonjs` mit `build.commonjsOptions: { include: [] }`. Wenn Sie dies getan haben, wird eine Warnung Sie dazu anleiten, dies wieder zu aktivieren, um beim Bündeln nur CJS-Pakete zu unterstützen.
:::

## optimizeDeps.needsInterop

- **Experimentell**
- **Typ:** `string[]`
  Erzwingt ESM-Interop beim Importieren dieser Abhängigkeiten. Vite kann ordnungsgemäß erkennen, wann eine Abhängigkeit Interop benötigt, daher ist diese Option im Allgemeinen nicht erforderlich. Unterschiedliche Kombinationen von Abhängigkeiten könnten jedoch dazu führen, dass einige von ihnen unterschiedlich vorab gebündelt werden. Wenn dies für eine Ihrer Abhängigkeiten der Fall ist, erhalten Sie eine Warnung und es wird vorgeschlagen, den Paketnamen in diesem Array in Ihrer Konfiguration hinzuzufügen.
