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

**Experimentell:** Wenn Sie eine Bibliothek mit vielen tiefen Importen verwenden, können Sie auch ein abschließendes Glob-Muster angeben, um alle tiefen Importe auf einmal vorab zu bündeln. Dies vermeidet ständiges Vorab-Bündeln, wenn ein neuer tiefer Import verwendet wird. Zum Beispiel:

```js
export default defineConfig({
  optimizeDeps: {
    include: ['my-lib/components/**/*.vue']
  }
})
```

## optimizeDeps.esbuildOptions

- **Typ:** [`EsbuildBuildOptions`](https://esbuild.github.io/api/#simple-options)

Optionen, die an esbuild während des Abhängigkeits-Scannens und der Optimierung übergeben werden sollen.

Bestimmte Optionen werden ausgelassen, da ihre Änderung nicht mit der Abhängigkeitsoptimierung von Vite kompatibel wäre.

- `external` wird ebenfalls ausgelassen, verwenden Sie Vites `optimizeDeps.exclude`-Option
- `plugins` werden mit dem Abhängigkeits-Plugin von Vite zusammengeführt

## optimizeDeps.force

- **Typ:** `boolean`

Setzen Sie `true`, um die Vorab-Bündelung von Abhängigkeiten zu erzwingen, und ignorieren Sie zuvor zwischengespeicherte optimierte Abhängigkeiten.

## optimizeDeps.disabled

- **Experimentell:** [Feedback geben](https://github.com/vitejs/vite/discussions/13839)
- **Typ:** `boolean | 'build' | 'dev'`
- **Standard:** `'build'`

Deaktiviert Abhängigkeitsoptimierungen. `true` deaktiviert den Optimierer während des Builds und im Entwicklungsmodus. Geben Sie `'build'` oder `'dev'` an, um den Optimierer nur in einem der Modi zu deaktivieren. Die Abhängigkeitsoptimierung ist standardmäßig nur im Entwicklungsmodus aktiviert.

:::warning
Die Optimierung von Abhängigkeiten im Build-Modus ist experimentell. Wenn sie aktiviert ist, wird eine der bedeutendsten Unterschiede zwischen Entwicklung und Produktion entfernt. @rollup/plugin-commonjs wird in diesem Fall nicht mehr benötigt, da esbuild CJS-Abhängigkeiten in ESM umwandelt.

Wenn Sie diese Build-Strategie ausprobieren möchten, können Sie `optimizeDeps.disabled: false` verwenden. `@rollup/plugin-commonjs` kann entfernt werden, indem Sie `build.commonjsOptions: { include: [] }` übergeben.
:::

## optimizeDeps.needsInterop

- **Experimental**
- **Type:** `string[]`
  Erzwingt ESM-Interop beim Importieren dieser Abhängigkeiten. Vite kann ordnungsgemäß erkennen, wann eine Abhängigkeit Interop benötigt, daher ist diese Option im Allgemeinen nicht erforderlich. Unterschiedliche Kombinationen von Abhängigkeiten könnten jedoch dazu führen, dass einige von ihnen unterschiedlich vorab gebündelt werden. Wenn dies für eine Ihrer Abhängigkeiten der Fall ist, erhalten Sie eine Warnung und es wird vorgeschlagen, den Paketnamen in diesem Array in Ihrer Konfiguration hinzuzufügen.
