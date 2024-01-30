# SSR-Optionen

## ssr.external

- **Type:** `string[] | true`
- **Related:** [SSR Externals](/guide/ssr#ssr-externals)

Externalisierung der angegebenen Abhängigkeiten und ihrer transitiven Abhängigkeiten für SSR. Standardmäßig werden alle Abhängigkeiten externalisiert, mit Ausnahme der verknüpften Abhängigkeiten (für HMR). Wenn Sie es bevorzugen, die verknüpften Abhängigkeiten zu externalisieren, können Sie deren Namen an diese Option übergeben.

Beim Setzen auf `true` werden alle Abhängigkeiten, einschließlich der verknüpften Abhängigkeiten, externalisiert.

Beachten Sie, dass die explizit aufgeführten Abhängigkeiten (mit dem Typ `string[]`) immer Vorrang haben, wenn sie auch in `ssr.noExternal` (mit einem beliebigen Typ) aufgeführt sind.

## ssr.noExternal

- **Type:** `string | RegExp | (string | RegExp)[] | true`
- **Related:** [SSR Externals](/guide/ssr#ssr-externals)

Verhindert, dass aufgelistete Abhängigkeiten für SSR externalisiert werden, wodurch sie im Build gebündelt werden. Standardmäßig werden nur verlinkte Abhängigkeiten nicht externalisiert (für HMR). Wenn Sie es bevorzugen, die verlinkten Abhängigkeiten zu externalisieren, können Sie ihren Namen an die Option `ssr.external` übergeben.

Wenn auf `true` gesetzt, werden keine Abhängigkeiten externalisiert. Allerdings können Abhängigkeiten, die explizit in `ssr.external` aufgeführt sind (unter Verwendung des Typs `string[]`), Vorrang haben und trotzdem externalisiert werden.

Beachten Sie, dass - wenn sowohl `ssr.noExternal: true` als auch `ssr.external: true` konfiguriert sind - `ssr.noExternal` Vorrang hat und keine Abhängigkeiten externalisiert werden.

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
