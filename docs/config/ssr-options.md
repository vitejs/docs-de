# SSR Optionen

## ssr.external

- **Type:** `string[]`
- **Related:** [SSR Externals](/guide/ssr#ssr-externals)

Erzwingen Sie die Externalisierung von Abhängigkeiten für SSR.

## ssr.noExternal

- **Type:** `string | RegExp | (string | RegExp)[] | true`
- **Related:** [SSR Externals](/guide/ssr#ssr-externals)

Verhindert, dass aufgelistete Abhängigkeiten für SSR externalisiert werden. Wenn `true`, werden keine Abhängigkeiten externalisiert.

## ssr.target

- **Type:** `'node' | 'webworker'`
- **Default:** `node`

Build-Ziel für den SSR-Server.

## ssr.format

- **Deprecated:** [CJS support to be removed in Vite 5](https://github.com/vitejs/vite/discussions/13816)
- **Type:** `'esm' | 'cjs'`
- **Default:** `esm`

Build-Format für den SSR-Server. Seit Vite v3 erzeugt der SSR-Build standardmäßig ESM. Die Option "cjs" kann ausgewählt werden, um einen CJS-Build zu erzeugen, wird aber nicht empfohlen. Die Option ist als experimentell gekennzeichnet, um den Benutzern mehr Zeit für die Aktualisierung auf ESM zu geben. CJS-Builds erfordern komplexe Externalisierungsheuristiken, die im ESM-Format nicht vorhanden sind.
