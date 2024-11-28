# Backend-Integration

::: tip HINWEIS
Wenn Sie die HTML-Dateien mit einem traditionellen Backend (z. B. Rails, Laravel) bereitstellen und gleichzeitig Vite zur Bereitstellung von Assets verwenden möchten, überprüfen Sie vorhandene Integrationen in [Awesome Vite](https://github.com/vitejs/awesome-vite#integrations-with-backends).

Wenn Sie eine benutzerdefinierte Integration benötigen, können Sie den Schritten in dieser Anleitung folgen, um sie manuell zu konfigurieren.
:::

1. In Ihrer Vite-Konfiguration konfigurieren Sie den Einstiegspunkt und aktivieren das Build-Manifest:

   ```js twoslash [vite.config.js]
   import { defineConfig } from 'vite'
   // ---cut---
   export default defineConfig({
     build: {
       // generiert .vite/manifest.json in outDir
       manifest: true,
       rollupOptions: {
         // Überschreibe den Standard-.html-Einstieg
         input: '/path/to/main.js'
       }
     }
   })
   ```

   Wenn Sie das [Module-Preload-Polyfill](/config/build-options.md#build-polyfillmodulepreload) nicht deaktiviert haben, müssen Sie auch das Polyfill in Ihrem Einstiegspunkt importieren:

   ```js
   // am Anfang Ihres Anwendungseinstiegspunkts
   import 'vite/modulepreload-polyfill'
   ```

2. Für die Entwicklung fügen Sie Folgendes in das HTML-Template Ihres Servers ein (ersetzen Sie `http://localhost:5173` durch die lokale URL, unter der Vite ausgeführt wird):

   ```html
   <!-- wenn Entwicklung -->
   <script type="module" src="http://localhost:5173/@vite/client"></script>
   <script type="module" src="http://localhost:5173/main.js"></script>
   ```

   Um Assets ordnungsgemäß bereitzustellen, haben Sie zwei Optionen:

   - Stellen Sie sicher, dass der Server so konfiguriert ist, dass er Anfragen nach statischen Assets an den Vite-Server weiterleitet.
   - Legen Sie [`server.origin`](/config/server-options.md#server-origin) fest, damit generierte Asset-URLs mithilfe der URL des Backend-Servers anstelle eines relativen Pfads aufgelöst werden.

   Dies ist erforderlich, damit Assets wie Bilder ordnungsgemäß geladen werden.

   Beachten Sie, dass Sie, wenn Sie React mit `@vitejs/plugin-react` verwenden, dies auch vor den oben genannten Skripten hinzufügen müssen, da das Plugin nicht in der Lage ist, den von Ihnen bereitgestellten HTML-Code zu ändern (ersetzen Sie `http://localhost:5173` durch die lokale URL, unter der Vite ausgeführt wird):

   ```html
   <script type="module">
     import RefreshRuntime from 'http://localhost:5173/@react-refresh'
     RefreshRuntime.injectIntoGlobalHook(window)
     window.$RefreshReg$ = () => {}
     window.$RefreshSig$ = () => (type) => type
     window.__vite_plugin_react_preamble_installed__ = true
   </script>
   ```

3. Für die produktive Umgebung wird nach dem Ausführen von `vite build` neben anderen Asset-Dateien eine Datei `.vite/manifest.json` erstellt. Eine Beispiel-Manifestdatei sieht wie folgt aus:

   ```json [.vite/manifest.json]
   {
     "_shared-B7PI925R.js": {
       "file": "assets/shared-B7PI925R.js",
       "name": "shared",
       "css": ["assets/shared-ChJ_j-JJ.css"]
     },
     "_shared-ChJ_j-JJ.css": {
       "file": "assets/shared-ChJ_j-JJ.css",
       "src": "_shared-ChJ_j-JJ.css"
     },
     "baz.js": {
       "file": "assets/baz-B2H3sXNv.js",
       "name": "baz",
       "src": "baz.js",
       "isDynamicEntry": true
     },
     "views/bar.js": {
       "file": "assets/bar-gkvgaI9m.js",
       "name": "bar",
       "src": "views/bar.js",
       "isEntry": true,
       "dynamicImports": ["views/foo.js"],
       "css": ["assets/main.b82dbe22.css"],
       "assets": ["assets/asset.0ab0f9cd.png"],
       "imports": ["_shared.83069a53.js"]
     },
     "views/foo.js": {
       "file": "assets/foo.869aea0d.js",
       "src": "views/foo.js",
       "isDynamicEntry": true,
       "imports": ["_shared.83069a53.js"]
     },
     "_shared.83069a53.js": {
       "file": "assets/shared.83069a53.js",
       "css": ["assets/shared.a834bfc3.css"]
     }
   }
   ```

   - Das Manifest hat eine Struktur `Record<Name, Chunk>`.
   - Für Einstiegs- oder dynamische Einstiegschunks ist der Schlüssel der relative Quellpfad vom Projektstamm aus.
   - Für Nicht-Einstiegschunks ist der Schlüssel der Basename der generierten Datei mit einem `_`-Präfix.
   - Für die CSS-Datei, die generiert wird, wenn [`build.cssCodeSplit`](/config/build-options.md#build-csscodesplit) auf `false` gesetzt ist, lautet der Schlüssel `style.css`.
   - Chunks enthalten Informationen zu ihren statischen und dynamischen Importen (beide sind Schlüssel, die auf den entsprechenden Chunk im Manifest verweisen), sowie ihre zugehörigen CSS- und Asset-Dateien (falls vorhanden).

4. Sie können diese Datei zum Rendern von Links oder zum Vorladen von Direktiven mit gehashten Dateinamen verwenden.

   Hier ist ein Beispiel für eine HTML-Vorlage, die die richtigen Links wiedergibt. Die Syntax hier dient nur zur
   Erläuterung, ersetzen Sie sie durch Ihre Server-Vorlagensprache. Die Funktion `importedChunks` dient der Veranschaulichung und wird nicht von Vite selbst bereitgestellt.

   ```html
   <!-- if production -->

   <!-- for cssFile of manifest[name].css -->
   <link rel="stylesheet" href="/{{ cssFile }}" />

   <!-- for chunk of importedChunks(manifest, name) -->
   <!-- for cssFile of chunk.css -->
   <link rel="stylesheet" href="/{{ cssFile }}" />

   <script type="module" src="/{{ manifest[name].file }}"></script>

   <!-- for chunk of importedChunks(manifest, name) -->
   <link rel="modulepreload" href="/{{ chunk.file }}" />
   ```

Insbesondere sollte ein Backend, das HTML generiert, die folgenden Tags enthalten, wenn eine Manifestdatei
und ein Einstiegspunkt vorhanden sind:

- Ein `<link rel="stylesheet">`-Tag für jede Datei in der `css`-Liste des Einstiegspunkt-Chunks
- Rekursives Verfolgen aller Blöcke in der `imports`-Liste des Einstiegspunkts und Einfügen eines
  `<link rel="stylesheet">`-Tags für jede CSS-Datei jedes importierten Blocks.
- Ein Tag für den `file`-Schlüssel des Einstiegspunkt-Blocks (`<script type="module">` für JavaScript oder
  `<link rel="stylesheet">` für CSS)
- Optional ein `<link rel="modulepreload">`-Tag für die `file` jedes importierten JavaScript-
  Chunks, wobei erneut rekursiv den Importen ausgehend vom Einstiegspunkt-Chunk gefolgt wird.

Gemäß dem obigen Beispielmanifest sollten für den Einstiegspunkt `main.js` die folgenden Tags in die Produktion aufgenommen werden:

```html
<link rel="stylesheet" href="assets/main.b82dbe22.css" />
<link rel="stylesheet" href="assets/shared.a834bfc3.css" />
<script type="module" src="assets/main.4889e940.js"></script>
<!-- optional -->
<link rel="modulepreload" href="assets/shared.83069a53.js" />
```

Während für den Einstiegspunkt `views/foo.js` Folgendes enthalten sein sollte:

```html
<link rel="stylesheet" href="assets/shared.a834bfc3.css" />
<script type="module" src="assets/foo.869aea0d.js"></script>
<!-- optional -->
<link rel="modulepreload" href="assets/shared.83069a53.js" />
```

::: details Pseudo-Implementierung von `importedChunks`
Ein Beispiel für eine Pseudo-Implementierung von `importedChunks` in TypeScript (dies muss
an Ihre Programmier- und Templatesprache angepasst werden):

```ts
import type { Manifest, ManifestChunk } from 'vite'

export default function importedChunks(
  manifest: Manifest,
  name: string
): ManifestChunk[] {
  const seen = new Set<string>()

  function getImportedChunks(chunk: ManifestChunk): ManifestChunk[] {
    const chunks: ManifestChunk[] = []
    for (const file of chunk.imports ?? []) {
      const importee = manifest[file]
      if (seen.has(file)) {
        continue
      }
      seen.add(file)

      chunks.push(...getImportedChunks(importee))
      chunks.push(importee)
    }

    return chunks
  }

  return getImportedChunks(manifest[name])
}
```

:::
