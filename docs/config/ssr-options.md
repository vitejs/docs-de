# SSR-Optionen

Sofern nicht anders angegeben, gelten die Optionen in diesem Abschnitt sowohl für `dev` als auch für `build`.

## ssr.external

- **Typ:** `string[] | true`
- **Verwandt:** [SSR Externals](/guide/ssr#ssr-externals)

Externalisierung der angegebenen Abhängigkeiten und ihrer transitiven Abhängigkeiten für SSR. Standardmäßig werden alle Abhängigkeiten externalisiert, mit Ausnahme der verknüpften Abhängigkeiten (für HMR). Wenn Sie es bevorzugen, die verknüpften Abhängigkeiten zu externalisieren, können Sie deren Namen an diese Option übergeben.

Beim Setzen auf `true` werden alle Abhängigkeiten, einschließlich der verknüpften Abhängigkeiten, externalisiert.

Beachten Sie, dass die explizit aufgeführten Abhängigkeiten (mit dem Typ `string[]`) immer Vorrang haben, wenn sie auch in `ssr.noExternal` (mit einem beliebigen Typ) aufgeführt sind.

## ssr.noExternal

- **Typ:** `string | RegExp | (string | RegExp)[] | true`
- **Verwandt:** [SSR Externals](/guide/ssr#ssr-externals)

Verhindert, dass aufgelistete Abhängigkeiten für SSR externalisiert werden, wodurch sie im Build gebündelt werden. Standardmäßig werden nur verlinkte Abhängigkeiten nicht externalisiert (für HMR). Wenn Sie es bevorzugen, die verlinkten Abhängigkeiten zu externalisieren, können Sie ihren Namen an die Option `ssr.external` übergeben.

Wenn dies auf `true` gesetzt ist, werden keine Abhängigkeiten externalisiert. Allerdings können Abhängigkeiten, die explizit in `ssr.external` aufgelistet sind (unter Verwendung des Typs `string[]`), Vorrang haben und trotzdem externalisiert werden. Wenn `ssr.target: 'node'` gesetzt ist, werden auch Node.js-Build-Ins standardmäßig externalisiert.

Beachten Sie, dass - wenn sowohl `ssr.noExternal: true` als auch `ssr.external: true` konfiguriert sind - `ssr.noExternal` Vorrang hat und keine Abhängigkeiten externalisiert werden.

## ssr.target

- **Typ:** `'node' | 'webworker'`
- **Standard:** `node`

Build-Ziel für den SSR-Server.

## ssr.resolve.conditions

- **Typ:** `string[]`
- **Standard:** `['module', 'node', 'development|production']` (`defaultServerConditions`) (`['module', 'browser', 'development|production']` (`defaultClientConditions`) for `ssr.target === 'webworker'`)
- **Verwandt:** [Resolve Conditions](./shared-options.md#resolve-conditions)

Diese Bedingungen werden in der Plugin-Pipeline verwendet und betreffen nur nicht-externalisierte Abhängigkeiten während des SSR-Builds. Verwenden Sie `ssr.resolve.externalConditions`, um externalisierte Importe zu beeinflussen.

## ssr.resolve.externalConditions

- **Typ:** `string[]`
- **Standard:** `['node']`

Bedingungen, die beim Importieren von externalisierten direkten Abhängigkeiten (von Vite importierte externe Abhängigkeiten) mit ssr (einschließlich `ssrLoadModule`) verwendet werden.

:::tip

Falls Sie diese Option nutzen, dann stellen Sie sicher, dass Sie Node mit dem Flag [`--conditions`](https://nodejs.org/docs/latest/api/cli.html#-c-condition---conditionscondition) und denselben Werten sowohl in der Entwicklung als auch beim Build ausführen, um ein konsistentes Verhalten zu erzielen.

Wenn Sie beispielsweise `['node', 'custom']` festlegen, sollten Sie `NODE_OPTIONS='--conditions custom' vite` in der Entwicklungsumgebung und `NODE_OPTIONS="--conditions custom" node ./dist/server.js` nach dem Build ausführen.

:::

## ssr.resolve.mainFields

- **Typ:** `string[]`
- **Standard:** `['module', 'jsnext:main', 'jsnext']`

Liste der Felder in `package.json`, die beim Auflösen des Einstiegspunkts eines Pakets versucht werden sollen. Beachten Sie, dass dies eine geringere Priorität hat als bedingte Exporte, die aus dem Feld `exports` aufgelöst werden: Wenn ein Einstiegspunkt erfolgreich aus `exports` aufgelöst wird, wird das Hauptfeld ignoriert. Diese Einstellung wirkt sich nur auf nicht externalisierte Abhängigkeiten aus.
