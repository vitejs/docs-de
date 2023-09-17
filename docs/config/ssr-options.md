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
