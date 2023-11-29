# Erste Schritte

<audio id="vite-audio">
  <source src="/vite.mp3" type="audio/mpeg">
</audio>

## Überblick

Vite (französisches Wort für "schnell", ausgesprochen [`/vit/`]<button style="border:none;padding:3px;border-radius:4px;vertical-align:bottom" id="play-vite-audio" onclick="document.getElementById('vite-audio').play();"><svg style="height:2em;width:2em"><use href="/voice.svg#voice" /></svg></button>, wie "veet") ist eine neue Art von Frontend-Build-Tool, das die Erfahrung bei der Frontend-Entwicklung erheblich verbessert. Es besteht aus zwei Hauptbestandteilen:

- Einem Entwicklungsserver, der Ihre Quelldateien über [native ES-Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), mit [umfangreichen integrierten Funktionen](./features) und erstaunlich schnellem [Hot Module Replacement (HMR)](./features#hot-module-replacement) bereitstellt.

- Einem [Build-Befehl](./build), der Ihren Code mit [Rollup](https://rollupjs.org) bündelt und so vorkonfiguriert ist, dass er hochoptimierte statische Assets für die Produktion ausgibt.

Vite ist meinungsfreudig und wird mit vernünftigen Standardeinstellungen ausgeliefert. Lesen Sie im [Features Guide](./features) nach, was alles möglich ist. Unterstützung für Frameworks oder Integration mit anderen Tools ist über [Plugins](./using-plugins) möglich. Die [Config Section](../config/) erklärt, wie Sie Vite bei Bedarf an Ihr Projekt anpassen können.

Darüber hinaus ist Vite über seine [Plugin-API](./api-plugin) und [JavaScript-API](./api-javascript) mit vollständiger Typisierungsunterstützung in hohem Maße erweiterbar.

Mehr über die Beweggründe für das Projekt erfahren Sie im Abschnitt [Warum Vite](./why).

## Browser-Unterstützung

Während der Entwicklung setzt Vite [`esnext` als Transformationsziel](https://esbuild.github.io/api/#target), da wir davon ausgehen, dass ein moderner Browser verwendet wird, der alle aktuellen JavaScript- und CSS-Funktionen unterstützt. Dadurch wird eine Absenkung der Syntax verhindert, so dass Vite die Module so nah wie möglich am ursprünglichen Quellcode bereitstellen kann.

Für den Produktions-Build zielt Vite standardmäßig auf Browser ab, die [native ES Module](https://caniuse.com/es6-module), [native ESM dynamic import](https://caniuse.com/es6-module-dynamic-import) und [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta) unterstützen. Legacy-Browser können über das offizielle [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) unterstützt werden. Lesen Sie den Abschnitt [Erstellung für die Produktion](./build) für weitere Details.

## Vite online ausprobieren

Sie können Vite online auf [StackBlitz](https://vite.new/) ausprobieren. Es führt das Vite-basierte Build-Setup direkt im Browser aus, so dass es fast identisch mit dem lokalen Setup ist, aber keine Installation auf Ihrem Rechner erfordert. Sie können zu `vite.new/{template}` navigieren, um das zu verwendende Framework auszuwählen.

Folgende Vorlagen werden unterstützt:

|             JavaScript              |                TypeScript                 |
| :---------------------------------: | :---------------------------------------: |
| [vanilla](https://vite.new/vanilla) | [vanilla-ts](https://vite.new/vanilla-ts) |
|     [vue](https://vite.new/vue)     |     [vue-ts](https://vite.new/vue-ts)     |
|   [react](https://vite.new/react)   |   [react-ts](https://vite.new/react-ts)   |
|  [preact](https://vite.new/preact)  |  [preact-ts](https://vite.new/preact-ts)  |
|     [lit](https://vite.new/lit)     |     [lit-ts](https://vite.new/lit-ts)     |
|  [svelte](https://vite.new/svelte)  |  [svelte-ts](https://vite.new/svelte-ts)  |
|   [solid](https://vite.new/solid)   |   [solid-ts](https://vite.new/solid-ts)   |
|    [qwik](https://vite.new/qwik)    |    [qwik-ts](https://vite.new/qwik-ts)    |

## Scaffolding für Ihr erstes Vite Projekt

::: tip Kompatibilitätshinweis
Vite erfordert [Node.js](https://nodejs.org/en/) Version 18+. 20+. Einige Vorlagen benötigen jedoch eine höhere Node.js-Version, um zu funktionieren. Bitte aktualisieren Sie, wenn Ihr Paketmanager davor warnt.
:::

::: code-group

```bash [NPM]
$ npm create vite@latest
```

```bash [Yarn]
$ yarn create vite
```

```bash [PNPM]
$ pnpm create vite
```

```bash [Bun]
$ bunx create-vite
```

:::

Folgen Sie dann den Anweisungen!
Sie können auch direkt den Projektnamen und die zu verwendende Vorlage über zusätzliche Befehlszeilenoptionen angeben. Führen Sie zum Beispiel ein Vite + Vue-Projekt aus, um ein Gerüst zu erstellen:

```bash
# npm 7+, extra double-dash is needed:
npm create vite@latest my-vue-app -- --template vue

# yarn
yarn create vite my-vue-app --template vue

# pnpm
pnpm create vite my-vue-app --template vue

# bun
bunx create-vite my-vue-app --template vue
```

Siehe [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) für weitere Details zu jeder unterstützten Vorlage: `vanilla`, `vanilla-ts`, `vue`, `vue-ts`, `react`, `react-ts`, `react-swc`, `react-swc-ts`, `preact`, `preact-ts`, `lit`, `lit-ts`, `svelte`, `svelte-ts`, `solid`, `solid-ts`, `qwik`, `qwik-ts`.

## Community Vorlagen

create-vite ist ein Tool, mit dem man schnell ein Projekt aus einer Basisvorlage für gängige Frameworks erstellen kann. Bei Awesome Vite finden Sie [von der Community gepflegte Vorlagen](https://github.com/vitejs/awesome-vite#templates), die andere Tools enthalten oder auf andere Frameworks abzielen.

Für eine Vorlage unter `https://github.com/user/project` können Sie sie online unter `https://github.stackblitz.com/user/project` ausprobieren (indem Sie `.stackblitz` nach `github` zur URL des Projekts hinzufügen).

Sie können auch ein Tool wie [degit](https://github.com/Rich-Harris/degit) verwenden, um Ihr Projekt mit einer der Vorlagen zu unterlegen. Angenommen, das Projekt befindet sich auf GitHub und verwendet `main` als Standardzweig, können Sie eine lokale Kopie erstellen:

```bash
npx degit user/project#main my-project
cd my-project

npm install
npm run dev
```

## `index.html` und das Projekt-Wurzelverzeichnis

Eine Sache, die Ihnen vielleicht aufgefallen ist, ist, dass in einem Vite-Projekt die Datei `index.html` an vorderster Stelle steht, anstatt in `public` versteckt zu sein. Das ist beabsichtigt: Während der Entwicklung ist Vite ein Server, und `index.html` ist der Einstiegspunkt zu Ihrer Anwendung.

Vite behandelt die `index.html` als Quellcode und Teil des Modulgraphen. Es löst `<script type="module" src="...">` auf, das auf Ihren JavaScript-Quellcode verweist. Sogar inline `<script type="module">` und CSS werden über `<link href>` referenziert und genießen damit Vite-spezifische Eigenschaften. Darüber hinaus werden URLs innerhalb von `index.html` automatisch umbasiert, so dass keine speziellen Platzhalter für `%PUBLIC_URL%` erforderlich sind.

Ähnlich wie bei statischen http-Servern gibt es bei Vite ein "Wurzelverzeichnis", von dem aus Ihre Dateien bereitgestellt werden. In der gesamten Dokumentation wird auf dieses Verzeichnis als `<root>` verwiesen. Absolute URLs in Ihrem Quellcode werden unter Verwendung des Projektstamms als Basis aufgelöst, so dass Sie Code schreiben können, als ob Sie mit einem normalen statischen Dateiserver arbeiten würden (nur viel leistungsfähiger!).
Vite ist auch in der Lage, mit Abhängigkeiten umzugehen, die zu Orten außerhalb des Root-Dateisystems aufgelöst werden, was es sogar in einem Monorepo-basierten Setup nutzbar macht.

Vite unterstützt auch [mehrseitige Anwendungen](./build#multi-page-app) mit mehreren `.html`-Einstiegspunkten.

#### Festlegen eines alternativen Wurzelverzeichnisses

Das Ausführen von `vite` startet den Dev-Server unter Verwendung des aktuellen Arbeitsverzeichnisses als Wurzel. Sie können ein alternatives Wurzelverzeichnis mit `vite serve some/sub/dir` angeben.
Beachten Sie, dass Vite auch [seine Konfigurationsdatei (d.h. `vite.config.js`)](/config/#configuring-vite) innerhalb des Projektstammes auflöst, so dass Sie diese verschieben müssen, wenn das Wurzelverzeichnis geändert wird.

## Befehlszeilenschnittstelle (CLI)

In einem Projekt, in dem Vite installiert ist, können Sie das `vite`-Binary in Ihren npm-Skripten verwenden oder es direkt mit `npx vite` ausführen. Hier sind die standardmäßigen npm-Skripte in einem gerüsteten Vite-Projekt:

<!-- prettier-ignore -->
```json
{
  "scripts": {
    "dev": "vite", // start dev server, aliases: `vite dev`, `vite serve`
    "build": "vite build", // build for production
    "preview": "vite preview" // locally preview production build
  }
}
```

Sie können zusätzliche CLI-Optionen wie `--port` oder `--open` angeben. Eine vollständige Liste der CLI-Optionen erhalten Sie, wenn Sie `npx vite --help` in Ihrem Projekt ausführen.

Erfahren Sie mehr über die [Befehlszeilenschnittstelle](./cli.md)

## Unveröffentlichte Commits verwenden

Wenn Sie nicht auf eine neue Version warten können, um die neuesten Funktionen zu testen, müssen Sie das [vite repo](https://github.com/vitejs/vite) auf Ihren lokalen Rechner klonen und es dann selbst bauen und verlinken ([pnpm](https://pnpm.io/) ist erforderlich):

```bash
git clone https://github.com/vitejs/vite.git
cd vite
pnpm install
cd packages/vite
pnpm run build
pnpm link --global # use your preferred package manager for this step
```

Gehen Sie dann zu Ihrem Vite-basierten Projekt und führen Sie `pnpm link --global vite` aus (oder den Paketmanager, den Sie zum globalen Verlinken von `vite` verwendet haben). Starten Sie nun den Entwicklungsserver neu, um auf dem neuesten Stand zu sein!

## Community

Wenn Sie Fragen haben oder Hilfe benötigen, wenden Sie sich an die Community unter [Discord](https://chat.vitejs.dev) und [GitHub Discussions](https://github.com/vitejs/vite/discussions).
