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

## ssr.resolve.conditions

- **Typ:** `String[]`
- **Verwandt:** [Bedingungen auflösen](./shared-options.md#resolve-conditions)

Die Standardeinstellung ist der Root [`resolve.conditions`](./shared-options.md#resolve-conditions).

Diese Bedingungen werden in der Plugin-Pipeline verwendet und betreffen nur nicht-externalisierte Abhängigkeiten während des SSR-Builds. Verwenden Sie `ssr.resolve.externalConditions`, um externalisierte Importe zu beeinflussen.

## ssr.resolve.externalConditions

- **Typ:** `String[]`
- **Standard:** `[]`

Bedingungen, die beim ssr-Import (einschließlich `ssrLoadModule`) von externalisierten Abhängigkeiten verwendet werden.
