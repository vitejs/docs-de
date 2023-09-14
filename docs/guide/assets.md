# Umgang mit statischen Assets

- Verwandt: [Öffentlicher Basispfad](./build#public-base-path)
- Verwandt: [`assetsInclude`-Konfigurationsoption](/config/shared-options.md#assetsinclude)

## Importieren von Assets als URL

Das Importieren eines statischen Assets gibt die aufgelöste öffentliche URL zurück, wenn es bereitgestellt wird:

```js
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

Beispielsweise ist `imgUrl` während der Entwicklung `/img.png` und wird im Produktionsbuild zu `/assets/img.2d8efhg.png`.

Das Verhalten ähnelt dem von webpack's `file-loader`. Der Unterschied besteht darin, dass der Import entweder absolute öffentliche Pfade (basierend auf dem Projektstamm während der Entwicklung) oder relative Pfade verwenden kann.

- `url()`-Verweise in CSS werden auf die gleiche Weise behandelt.

- Wenn das Vue-Plugin verwendet wird, werden Asset-Verweise in Vue-SFC-Vorlagen automatisch in Imports umgewandelt.

- Häufig verwendete Bild-, Medien- und Schriftdateiformate werden automatisch als Assets erkannt. Sie können die interne Liste mithilfe der [`assetsInclude`-Option](/config/shared-options.md#assetsinclude) erweitern.

- Referenzierte Assets werden als Teil des Build-Asset-Graphen einbezogen, erhalten gehashte Dateinamen und können von Plugins zur Optimierung verarbeitet werden.

- Assets, die weniger Bytes als die [`assetsInlineLimit`-Option](/config/build-options.md#build-assetsinlinelimit) haben, werden als Base64-Daten-URLs inline eingefügt.

- Git LFS-Platzhalter werden automatisch vom Inline-Ausschluss ausgenommen, da sie den Inhalt der von ihnen repräsentierten Datei nicht enthalten. Um das Inline-Einfügen zu ermöglichen, stellen Sie sicher, dass Sie die Dateiinhalte über Git LFS vor dem Build herunterladen.

- TypeScript erkennt statische Asset-Imports standardmäßig nicht als gültige Module. Um dies zu beheben, fügen Sie [`vite/client`](./features#client-types) hinzu.

### Explizite URL-Imports

Assets, die nicht in der internen Liste oder in `assetsInclude` enthalten sind, können explizit als URL mit dem Suffix `?url` importiert werden. Dies ist nützlich, um beispielsweise [Houdini Paint Worklets](https://houdini.how/usage) zu importieren.

```js
import workletURL from 'extra-scalloped-border/worklet.js?url'
CSS.paintWorklet.addModule(workletURL)
```

### Importieren von Assets als Zeichenfolge

Assets können als Zeichenfolgen mithilfe des Suffix `?raw` importiert werden.

```js
import shaderString from './shader.glsl?raw'
```

### Importieren von Skripten als Worker

Skripte können als Web Worker mit dem Suffix `?worker` oder `?sharedworker` importiert werden.

```js
// Separater Chunk im Produktionsbuild
import Worker from './shader.js?worker'
const worker = new Worker()
```

```js
// sharedworker
import SharedWorker from './shader.js?sharedworker'
const sharedWorker = new SharedWorker()
```

```js
// Als Base64-Zeichenfolgen eingebettet
import InlineWorker from './shader.js?worker&inline'
```

Weitere Details finden Sie im [Web Worker-Abschnitt](./features.md#web-workers).

## Das `public`-Verzeichnis

Wenn Sie Assets haben, die:

- Im Quellcode nie referenziert werden (z. B. `robots.txt`)
- Den exakt gleichen Dateinamen behalten müssen (ohne Hashing)
- ...oder wenn Sie einfach nicht möchten, dass Sie zuerst ein Asset importieren müssen, um seine URL zu erhalten

Dann können Sie das Asset in einem speziellen `public`-Verzeichnis unter Ihrem Projektstamm platzieren. Assets in diesem Verzeichnis werden während der Entwicklung unter dem Pfad `/` bereitgestellt und im Verzeichnis `dist` unverändert im Stammverzeichnis kopiert.

Das Verzeichnis wird standardmäßig zu `<Projektstamm>/public` festgelegt, kann jedoch über die [`publicDir`-Option](/config/shared-options.md#publicdir) konfiguriert werden.

Beachten Sie, dass:

- Sie `public`-Assets immer mit absolutem Wurzelpfad referenzieren sollten. Zum Beispiel sollte `public/icon.png` im Quellcode als `/icon.png` referenziert werden.
- Assets in `public` können nicht aus JavaScript importiert werden.

## new URL(url, import.meta.url)

[import.meta.url](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Statements/import.meta) ist ein natives ESM-Feature, das die URL des aktuellen Moduls offenlegt. Indem es mit dem nativen [URL-Konstruktor](https://developer.mozilla.org/de/docs/Web/API/URL) kombiniert wird, können wir die vollständige, aufgelöste URL eines statischen Assets mithilfe eines relativen Pfads aus einem JavaScript-Modul erhalten:

```js
const imgUrl = new URL('./img.png', import.meta.url).href

document.getElementById('hero-img').src = imgUrl
```

Dies funktioniert nativ in modernen Browsern - tatsächlich muss Vite diesen Code während der Entwicklung überhaupt nicht verarbeiten!

Dieses Muster unterstützt auch dynamische URLs über Vorlagenliterale:

```js
function getImageUrl(name) {
  return new URL(`./dir/${name}.png`, import.meta.url).href
}
```

Während des Produktionsbuilds führt Vite die erforderlichen Transformationen durch, damit die URLs auch nach Bündelung und Asset-Hashing weiterhin auf den richtigen Speicherort zeigen. Die URL-Zeichenfolge muss jedoch statisch sein, damit sie analysiert werden kann, andernfalls bleibt der Code unverändert, was zu Laufzeitfehlern führen kann, wenn `build.target` `import.meta.url` nicht unterstützt.

```js
// Vite wird dies nicht transformieren
const imgUrl = new URL(imagePath, import.meta.url).href
```

::: warning Funktioniert nicht mit SSR
Dieses Muster funktioniert nicht, wenn Sie Vite für Server-seitiges Rendern verwenden, da `import.meta.url` unterschiedliche Semantiken in Browsern gegenüber Node.js hat. Das Server-Bundle kann auch die Client-Host-URL im Voraus nicht ermitteln.
:::
