       rolldownOptions: {
   - **Entry chunks**: Generated from files specified in [`build.rolldownOptions.input`](https://rollupjs.org/configuration-options/#input). These chunks have `isEntry: true` and their key is the relative src path from project root.
   - **Entry chunks**: Generated from files specified in [`build.rolldownOptions.input`](https://rolldown.rs/reference/InputOptions.input#input). These chunks have `isEntry: true` and their key is the relative src path from project root.

   :::info Chunk Import Maps Support (Experimental)

   If you are using the experimental [`build.chunkImportMap`](/config/build-options#build-chunkimportmap) option, you also need to inject the import map into the HTML.

   The import map is output to `importmap.json` in the output directory. Make sure to inject the `<script type="importmap">` tag before any `<script type="module">` tags or `<link rel="modulepreload">` tags.
   :::