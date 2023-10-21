# Die Verwendung von Plugins

Vite kann mithilfe von Plugins erweitert werden, die auf der gut durchdachten Plugin-Schnittstelle von Rollup basieren und einige zusätzliche Vite-spezifische Optionen bieten. Dies bedeutet, dass Vite-Benutzer auf das etablierte Ökosystem von Rollup-Plugins zurückgreifen können, während sie gleichzeitig den Dev-Server und die SSR-Funktionalität nach Bedarf erweitern können.

## Hinzufügen eines Plugins

Um ein Plugin zu verwenden, muss es zu den `devDependencies` des Projekts hinzugefügt und im `plugins`-Array in der `vite.config.js`-Konfigurationsdatei aufgenommen werden. Zum Beispiel kann das offizielle [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) verwendet werden, um Unterstützung für veraltete Browser bereitzustellen:

```
$ npm add -D @vitejs/plugin-legacy
```

```js
// vite.config.js
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
})
```

`plugins` akzeptiert auch Presets, die mehrere Plugins als ein einzelnes Element enthalten. Dies ist nützlich für komplexe Funktionen (wie Framework-Integration), die mit mehreren Plugins implementiert werden. Das Array wird intern abgeflacht.

Falsche Plugins werden ignoriert, was dazu verwendet werden kann, Plugins einfach zu aktivieren oder zu deaktivieren.

## Plugins finden

:::tip HINWEIS
Vite zielt darauf ab, Out-of-the-Box-Unterstützung für gängige Webentwicklungsmuster bereitzustellen. Bevor Sie nach einem Vite- oder kompatiblen Rollup-Plugin suchen, werfen Sie einen Blick in den [Feature-Guide](../guide/features.md). Viele der Fälle, in denen ein Plugin in einem Rollup-Projekt benötigt wird, sind bereits in Vite abgedeckt.
:::

Schauen Sie sich den [Plugins-Bereich](../plugins/) für Informationen über offizielle Plugins an. Community-Plugins sind in [awesome-vite](https://github.com/vitejs/awesome-vite#plugins) aufgeführt. Für kompatible Rollup-Plugins schauen Sie in [Vite Rollup Plugins](https://vite-rollup-plugins.patak.dev), um eine Liste kompatibler offizieller Rollup-Plugins mit Verwendungshinweisen zu erhalten, oder in den [Rollup Plugin Compatibility](../guide/api-plugin#rollup-plugin-compatibility)-Abschnitt, falls sie dort nicht aufgeführt sind.

Sie können auch Plugins finden, die den [empfohlenen Konventionen](./api-plugin.md#conventions) folgen, indem Sie eine [npm-Suche nach vite-plugin](https://www.npmjs.com/search?q=vite-plugin&ranking=popularity) für Vite-Plugins oder eine [npm-Suche nach rollup-plugin](https://www.npmjs.com/search?q=rollup-plugin&ranking=popularity) für Rollup-Plugins verwenden.

## Erzwingen der Plugin-Reihenfolge

Für die Kompatibilität mit einigen Rollup-Plugins kann es notwendig sein, die Reihenfolge des Plugins zu erzwingen oder es nur zur Build-Zeit anzuwenden. Dies sollte ein Implementierungsdetail für Vite-Plugins sein. Sie können die Position eines Plugins mit dem `enforce`-Modifikator erzwingen:

- `pre`: Plugin vor den Vite-Kernplugins aufrufen
- default: Plugin nach den Vite-Kernplugins aufrufen
- `post`: Plugin nach den Vite-Build-Plugins aufrufen

```js
// vite.config.js
import image from '@rollup/plugin-image'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...image(),
      enforce: 'pre'
    }
  ]
})
```

Schauen Sie in den [Plugins API Guide](./api-plugin.md#plugin-ordering) für detaillierte Informationen und suchen Sie nach dem `enforce`-Label und den Verwendungshinweisen für beliebte Plugins in der [Vite Rollup Plugins](https://vite-rollup-plugins.patak.dev)-Kompatibilitätsliste.

## Bedingte Anwendung

Standardmäßig werden Plugins sowohl für den Dev-Server als auch für den Build aufgerufen. In Fällen, in denen ein Plugin nur während des Dev-Servers oder des Builds bedingt angewendet werden muss, verwenden Sie die `apply`-Eigenschaft, um sie nur während des `'build'` oder `'serve'` aufzurufen:

```js
// vite.config.js
import typescript2 from 'rollup-plugin-typescript2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...typescript2(),
      apply: 'build'
    }
  ]
})
```

## Erstellen von Plugins

Werfen Sie einen Blick in den [Plugins API Guide](./api-plugin.md) für Dokumentation zur Erstellung von Plugins.
