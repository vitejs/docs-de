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

3. For production: after running `vite build`, a `.vite/manifest.json` file will be generated alongside other asset files. An example manifest file looks like this:

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

   Specifically, a backend generating HTML should include the following tags given a manifest
   file and an entry point:

   - A `<link rel="stylesheet">` tag for each file in the entry point chunk's `css` list
   - Recursively follow all chunks in the entry point's `imports` list and include a
     `<link rel="stylesheet">` tag for each CSS file of each imported chunk.
   - A tag for the `file` key of the entry point chunk (`<script type="module">` for JavaScript,
     or `<link rel="stylesheet">` for CSS)
   - Optionally, `<link rel="modulepreload">` tag for the `file` of each imported JavaScript
     chunk, again recursively following the imports starting from the entry point chunk.

   Following the above example manifest, for the entry point `main.js` the following tags should be included in production:

   ```html
   <link rel="stylesheet" href="assets/main.b82dbe22.css" />
   <link rel="stylesheet" href="assets/shared.a834bfc3.css" />
   <script type="module" src="assets/main.4889e940.js"></script>
   <!-- optional -->
   <link rel="modulepreload" href="assets/shared.83069a53.js" />
   ```

   While the following should be included for the entry point `views/foo.js`:

   ```html
   <link rel="stylesheet" href="assets/shared.a834bfc3.css" />
   <script type="module" src="assets/foo.869aea0d.js"></script>
   <!-- optional -->
   <link rel="modulepreload" href="assets/shared.83069a53.js" />
   ```

   ::: details Pseudo implementation of `importedChunks`
   An example pseudo implementation of `importedChunks` in TypeScript (This will
   need to be adapted for your programming language and templating language):

   ```ts
   import type { Manifest, ManifestChunk } from 'vite'

   export default function importedChunks(
     manifest: Manifest,
     name: string,
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
