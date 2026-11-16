---
title: Vite 8.1 is out!
author:
  name: The Vite Team
date: 2026-06-23
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 8.1
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite8-1.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite8-1
  - - meta
    - property: og:description
      content: Vite 8.1 Release Announcement

  - - meta
    - name: twitter:card
      content: summary_large_image

# Vite 8.1 ist da!

_23. Juni 2026_

![Titelbild zur Ankündigung von Vite 8.1](/og-image-announcing-vite8-1.webp)

Vite 8 [wurde im März veröffentlicht](./announcing-vite8.md) – mit einem einzigen, einheitlichen Bundler auf Basis von [Rolldown](https://rolldown.rs/), der die Tür für weitere Verbesserungen geöffnet hat. Vite 8 wird inzwischen 41,6 Millionen Mal pro Woche heruntergeladen und hat damit fast die Gesamtzahl der Downloads von Vite 7 erreicht. Neben der Behebung von Regressionen beim Upgrade haben wir an neuen Funktionen gearbeitet und freuen uns, die Veröffentlichung von Vite 8.1 bekannt zu geben.

Schnelllinks:

- [Dokumentation](/)
- Übersetzungen: [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/), [فارسی](https://fa.vite.dev/)
- [GitHub-Changelog](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

Probieren Sie Vite 8.1 online auf [vite.new](https://vite.new) aus oder erstellen Sie lokal eine Vite-App mit Ihrem bevorzugten Framework, indem Sie `pnpm create vite` ausführen. Weitere Informationen finden Sie im [Leitfaden „Erste Schritte“](/guide/).

Wir laden Sie ein, uns dabei zu helfen, Vite zu verbessern (und sich den mehr als [1.200 Mitwirkenden am Vite-Kern](https://github.com/vitejs/vite/graphs/contributors) anzuschließen) – ebenso wie unsere Abhängigkeiten oder Plugins und Projekte im Ökosystem. Mehr dazu erfahren Sie in unserem [Leitfaden für Mitwirkende](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md). Ein guter Einstieg ist es, [Issues zu sichten](https://github.com/vitejs/vite/issues), [PRs zu reviewen](https://github.com/vitejs/vite/pulls), Test-PRs auf Basis offener Issues einzureichen und andere in den [Discussions](https://github.com/vitejs/vite/discussions) oder im [Hilfeforum](https://discord.com/channels/804011606160703521/1019670660856942652) von Vite Land zu unterstützen. Wenn Sie Fragen haben, treten Sie unserer [Discord-Community](https://chat.vite.dev) bei und sprechen Sie mit uns im [#contributing-Kanal](https://discord.com/channels/804011606160703521/804439875226173480).

Bleiben Sie auf dem Laufenden und vernetzen Sie sich mit anderen, die auf Vite aufbauen, indem Sie uns auf [Bluesky](https://bsky.app/profile/vite.dev), [X](https://twitter.com/vite_js) oder [Mastodon](https://webtoo.ls/@vite) folgen.

## Funktionen

### Experimenteller Bundled-Dev-Modus

Ab sofort gibt es experimentelle Unterstützung für den Bundled-Dev-Modus, der bisher „Full-Bundle-Modus“ hieß. Dieser Modus soll die Leistung sehr großer Anwendungen verbessern, die unter der Anzahl ihrer Module leiden.

In unseren ersten Tests mit einer App, die 10.000 React-Komponenten lädt, erreichte der Bundled-Dev-Modus im Vergleich zum ungebündelten Entwicklungsserver einen etwa 15-mal schnelleren Start und 10-mal schnellere vollständige Neuladevorgänge, während HMR unabhängig von der Größe der Anwendung sofort reagiert. Erste Tests mit realen Anwendungen zeigen ähnliche Verbesserungen: Das Team von Linear verzeichnete ein bis zu 3-mal schnelleres Rendern beim Kaltstart, rund 40 % schnellere vollständige Neuladevorgänge und 10-mal weniger Netzwerkanfragen.

::: details Warum ein Bundled-Dev-Modus?

Vite ist für seinen ungebündelten Entwicklungsserver bekannt, der bei seiner Einführung ein Hauptgrund für die Geschwindigkeit und Beliebtheit von Vite war. Dieser Ansatz war ursprünglich ein Experiment, um herauszufinden, wie weit sich die Leistung eines Entwicklungsservers ohne klassisches Bündeln treiben lässt.

Mit wachsender Größe und Komplexität von Projekten hat sich jedoch gezeigt, dass der ungebündelte Ansatz von Vite die Leistung während der Entwicklung beeinträchtigen kann. Da jedes Modul einzeln abgerufen wird, muss der Browser sehr viele Anfragen verarbeiten, was den Aufwand beim Start und beim Neuladen erhöht. Das macht sich besonders bei großen Anwendungen bemerkbar und verschärft sich, wenn Entwickler:innen hinter einem Netzwerk-Proxy arbeiten. Die Folge sind längere Ladezeiten und eine schlechtere Entwicklererfahrung.

Der Bundled-Dev-Modus ermöglicht es, gebündelte Dateien nicht nur in der Produktion, sondern auch während der Entwicklung auszuliefern, und vereint so das Beste aus beiden Welten:

- Schnelle Startzeiten auch bei großen Anwendungen
- Weniger Netzwerk-Overhead beim Neuladen von Seiten
- Weiterhin effizientes HMR auf Basis der ESM-Ausgabe

:::

Derzeit liegt der Fokus auf der Browserseite, den grundlegenden Plugins und den wichtigsten Funktionen. Wenn Sie ein Drittanbieter-Plugin verwenden, funktioniert es möglicherweise nicht mit diesem Modus. Auch weniger verbreitete Funktionen funktionieren eventuell nicht ganz so gut. Wir arbeiten daran, die Unterstützung auszubauen, und bereiten eine Dokumentation vor, die klärt, welche Änderungen auf Plugin-Seite nötig sein könnten. Weitere Details zur Roadmap finden Sie im [Designdokument](https://github.com/vitejs/vite/discussions/22746).

Um diesen Modus zu aktivieren, übergeben Sie `--experimental-bundle` oder fügen `experimental.bundledDev: true` zu Ihrer `vite.config.js` hinzu:

```ts [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  experimental: {
    bundledDev: true,
  },
})
```

Teilen Sie Ihr Feedback in [der Diskussion](https://github.com/vitejs/vite/discussions/22747).

### Experimentelle Chunk-Import-Map

Im Ausgabe-Bundle enthält die Import-Anweisung eines Chunks dessen Hash. So wird sichergestellt, dass der neue Chunk geladen wird, wenn sich sein Inhalt geändert hat. Dadurch ändert sich jedoch auch der Hash des Chunks, der den geänderten Chunk importiert, und die Änderung kaskadiert auf alle Chunks, die den geänderten Chunk transitiv importieren.

```dot
digraph chunk_hash_cascade {
  rankdir=TB
  node [shape=box style="rounded,filled" fontname="Arial" fontsize=11 margin="0.25,0.12" fontcolor="${#3c3c43|#ffffff}" color="${#c2c2c4|#3c3f44}"]
  edge [color="${#67676c|#98989f}" fontname="Arial" fontsize=10 fontcolor="${#67676c|#98989f}"]
  bgcolor="transparent"

  utils [label="utils.[e5f6 → 88xx].js\nInhalt geändert" fillcolor="${#fcf4dc|#38301a}" color="${#e0a800|#d4a72c}"]
  page  [label="page.[c3d4 → 77yy].js\ndurch Kaskade neu gehasht" fillcolor="${#fde8e8|#3a1f22}" color="${#d5393e|#f66f81}"]
  entry [label="entry.[a1b2 → 99zz].js\ndurch Kaskade neu gehasht" fillcolor="${#fde8e8|#3a1f22}" color="${#d5393e|#f66f81}"]

  entry -> page  [label="  importiert (bettet Hash ein)\l" color="${#d5393e|#f66f81}" fontcolor="${#d5393e|#f66f81}"]
  page  -> utils [label="  importiert (bettet Hash ein)\l" color="${#d5393e|#f66f81}" fontcolor="${#d5393e|#f66f81}"]
}
```

Die experimentelle Chunk-Import-Map-Funktion löst dieses Problem mithilfe von Import Maps und verbessert die Cache-Effizienz. Sie baut auf [der entsprechenden Funktion von Rolldown](https://rolldown.rs/reference/InputOptions.experimental#chunkimportmap) auf und ergänzt die Unterstützung für Vite-spezifische Funktionen. Ein großes Dankeschön an [Taisei Mima](https://github.com/bhbs) für die Recherche und die erste Implementierung dieser Funktion!

Beachten Sie, dass `experimental.renderBuiltUrl` mit dieser Option derzeit nicht funktioniert.

Weitere Details finden Sie im [Leitfaden](/guide/features#chunk-import-map-optimization) und in der [Dokumentation der Option](/config/build-options#build-chunkimportmap). Teilen Sie Ihr Feedback in [der Diskussion](https://github.com/vitejs/vite/discussions/22703).

### Unterstützung für die Wasm-ESM-Integration

Das [Wasm ESM Integration Proposal](https://github.com/WebAssembly/esm-integration/blob/main/proposals/esm-integration/README.md) wird jetzt in Vite unterstützt. Sie können Wasm-Dateien nun importieren und die exportierten Funktionen direkt verwenden:

```ts
import { add } from './add.wasm'

console.log(add(1, 2)) // 3
```

Ein großes Dankeschön an [Menci](https://github.com/Menci) für die Entwicklung und Pflege von vite-plugin-wasm, als sich das Proposal noch in einem frühen Stadium befand, und dafür, die Implementierung in den Vite-Kern eingebracht zu haben!

Weitere Details finden Sie im [Leitfaden](/guide/features#esm-integration).

### Ein Schritt näher an Lightning CSS als Standard

Gemeinsam mit dem Lightning-CSS-Team haben wir Funktionen ergänzt, die PostCSS unterstützte, die in Lightning CSS aber fehlten. Vite 8.1 bietet jetzt diese beiden Funktionen:

- Externe CSS-Dateien, die in CSS-Dateien importiert werden, sind erlaubt ([lightningcss#479](https://github.com/parcel-bundler/lightningcss/issues/479))
- Plugins können Dateiabhängigkeiten registrieren ([lightningcss#877](https://github.com/parcel-bundler/lightningcss/issues/877))

Wir überlegen, den Standard-CSS-Präprozessor in der nächsten Major-Version auf Lightning CSS umzustellen. Probieren Sie es mit [`css.transformer: 'lightningcss'`](/config/shared-options#css-transformer) aus und teilen Sie Ihr Feedback in [der Diskussion](https://github.com/vitejs/vite/discussions/13835).

### Abgleich ohne Beachtung der Groß-/Kleinschreibung für `import.meta.glob`

`import.meta.glob` unterstützt jetzt die Option `caseSensitive`, um Dateien unabhängig von der Groß-/Kleinschreibung zu finden.

```ts
// findet ./dir/Module1.js
const modules = import.meta.glob('./dir/module*.js', {
  caseSensitive: false,
})
```

### Asset-Erkennung für eigene HTML-Elemente und -Attribute

Bisher erkannte Vite Assets nur für vordefinierte Elemente und Attribute. Mit der Option [`html.additionalAssetSources`](/config/shared-options#html-additionalassetsources) können Sie jetzt weitere Elemente und Attribute hinzufügen.

```html
<html-import src="./some/other/file.html"></html-import>
<img
  src="/layout-default.png"
  data-src-dark="/layout-dark.png"
  data-src-light="/layout-light.png"
/>
```

```ts [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  html: {
    additionalAssetSources: {
      'html-import': {
        srcAttributes: ['src'],
      },
      img: {
        srcAttributes: ['data-src-dark', 'data-src-light'],
      },
    },
  },
})
```

## Weitere Änderungen

Weitere Funktionen und Fehlerbehebungen finden Sie im [Changelog](https://github.com/vitejs/vite/blob/v8.1.0/packages/vite/CHANGELOG.md).

## Danksagungen

Vite 8.1 wurde dank unserer Community aus Mitwirkenden, den Maintainern im Ökosystem und dem [Vite-Team](/team) möglich. Vite wird Ihnen von [VoidZero](https://voidzero.dev) in Partnerschaft mit [Bolt](https://bolt.new/) und [Nuxt Labs](https://nuxtlabs.com/) zur Verfügung gestellt. Wir danken außerdem unseren Sponsoren auf [Vites GitHub Sponsors](https://github.com/sponsors/vitejs) und [Vites Open Collective](https://opencollective.com/vite).
