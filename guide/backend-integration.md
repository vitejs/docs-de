       // generate .vite/manifest.json in outDir
3. For production: after running `vite build`, a `.vite/manifest.json` file will be generated alongside other asset files. An example manifest file looks like this:
     "_shared-!~{003}~.js": {
       "file": "assets/shared-ChJ_j-JJ.css",
       "src": "_shared-!~{003}~.js"
If you need a custom integration, you can follow the steps in this guide to configure it manually.
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
      * The list of statically imported chunks by this chunk
       "imports": ["_shared-B7PI925R.js"],
       "dynamicImports": ["baz.js"]
      * The list of dynamically imported chunks by this chunk
      *
       "file": "assets/foo-BRBmoGS9.js",
       "name": "foo",
      */
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
   JS chunks (chunks other than assets or CSS) will contain information on their static and dynamic imports (both are keys that map to the corresponding chunk in the manifest). Chunks also list their corresponding CSS and asset files if they have any.
   The manifest maps source files to their build outputs and dependencies:

   ```dot
   digraph manifest {
     rankdir=TB
     node [shape=box style="rounded,filled" fontname="Arial" fontsize=10 margin="0.2,0.1" fontcolor="${#3c3c43|#ffffff}" color="${#c2c2c4|#3c3f44}"]
     edge [color="${#67676c|#98989f}" fontname="Arial" fontsize=9 fontcolor="${#67676c|#98989f}"]
     bgcolor="transparent"

     foo [label="views/foo.js\n(entry)" fillcolor="${#e9eaff|#222541}"]
     bar [label="views/bar.js\n(entry)" fillcolor="${#e9eaff|#222541}"]
     shared [label="_shared-B7PI925R.js\n(common chunk)" fillcolor="${#f2ecfc|#2c273e}"]
     baz [label="baz.js\n(dynamic import)" fillcolor="${#fcf4dc|#38301a}"]
     foocss [label="foo.css" shape=ellipse fillcolor="${#fde4e8|#3a1d27}"]
     sharedcss [label="shared.css" shape=ellipse fillcolor="${#fde4e8|#3a1d27}"]
     logo [label="logo.svg\n(asset)" shape=ellipse fillcolor="${#def5ed|#15312d}"]

     foo -> shared [label="imports"]
     bar -> shared [label="imports"]
     bar -> baz [label="dynamicImports" style=dashed]
     foo -> foocss [label="css"]
     shared -> sharedcss [label="css"]
   }
   ```
