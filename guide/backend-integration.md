       // generate .vite/manifest.json in outDir
3. For production: after running `vite build`, a `.vite/manifest.json` file will be generated alongside other asset files. An example manifest file looks like this:
     "_shared-!~{003}~.js": {
       "file": "assets/shared-ChJ_j-JJ.css",
       "src": "_shared-!~{003}~.js"
     },
     "_shared-B7PI925R.js": {
       "file": "assets/shared-B7PI925R.js",
       "name": "shared",
       "css": ["assets/shared-ChJ_j-JJ.css"]
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
       "imports": ["_shared-B7PI925R.js"],
       "dynamicImports": ["baz.js"]
       "file": "assets/foo-BRBmoGS9.js",
       "name": "foo",
       "isEntry": true,
       "imports": ["_shared-B7PI925R.js"],
       "css": ["assets/foo-5UjPuW-k.css"]
   Following the above example manifest, for the entry point `views/foo.js` the following tags should be included in production:
   <link rel="stylesheet" href="assets/foo-5UjPuW-k.css" />
   <link rel="stylesheet" href="assets/shared-ChJ_j-JJ.css" />
   <script type="module" src="assets/foo-BRBmoGS9.js"></script>
   <link rel="modulepreload" href="assets/shared-B7PI925R.js" />
   While the following should be included for the entry point `views/bar.js`:
   <link rel="stylesheet" href="assets/shared-ChJ_j-JJ.css" />
   <script type="module" src="assets/bar-gkvgaI9m.js"></script>
   <link rel="modulepreload" href="assets/shared-B7PI925R.js" />
   ```json [.vite/manifest.json] style:max-height:400px
   ```ts style:max-height:400px
     /**
      * The input file name of this chunk / asset if known
      */
     /**
      * The output file name of this chunk / asset
      */
     /**
      * The list of CSS files imported by this chunk
      *
      * This field is only present in JS chunks.
      */
     /**
      * The list of asset files imported by this chunk, excluding CSS files
      *
      * This field is only present in JS chunks.
      */
     /**
      * Whether this chunk or asset is an entry point
      */
     /**
      * The name of this chunk / asset if known
      */
     /**
      * Whether this chunk is a dynamic entry point
      *
      * This field is only present in JS chunks.
      */
     /**
      * The list of statically imported chunks by this chunk
      *
      * The values are the keys of the manifest. This field is only present in JS chunks.
      */
     /**
      * The list of dynamically imported chunks by this chunk
      *
      * The values are the keys of the manifest. This field is only present in JS chunks.
      */
   JS chunks (chunks other than assets or CSS) will contain information on their static and dynamic imports (both are keys that map to the corresponding chunk in the manifest), and also their corresponding CSS and asset files (if any).