---
title: Vite 5.1 is out!
author:
  name: The Vite Team
date: 2024-02-08
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 5.1
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite5-1.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite5-1
  - - meta
    - property: og:description
      content: Vite 5.1 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 5.1 ist da!

_8. Februar 2024_

![Titelbild zur Ankündigung von Vite 5.1](/og-image-announcing-vite5-1.webp)

Vite 5 [wurde im November letzten Jahres veröffentlicht](./announcing-vite5.md) und stellte einen weiteren großen Sprung für Vite und das Ökosystem dar. Vor einigen Wochen feierten wir 10 Millionen wöchentliche npm-Downloads und 900 Mitwirkende am Vite-Repo. Heute freuen wir uns, die Veröffentlichung von Vite 5.1 bekannt zu geben.

Schnellzugriff: [Dokumentation](/), [Änderungsprotokoll](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#510-2024-02-08)

Dokumentation in anderen Sprachen: [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/)

Probieren Sie Vite 5.1 online in StackBlitz aus: [vanilla](https://vite.new/vanilla-ts), [vue](https://vite.new/vue-ts), [react](https://vite.new/react-ts), [preact](https://vite.new/preact-ts), [lit](https://vite.new/lit-ts), [svelte](https://vite.new/svelte-ts), [solid](https://vite.new/solid-ts), [qwik](https://vite.new/qwik-ts).

Wenn Sie Vite noch nicht kennen, empfehlen wir Ihnen, zunächst die Anleitungen [Erste Schritte](/guide/) und [Funktionen](/guide/features) zu lesen.

Um auf dem Laufenden zu bleiben, folgen Sie uns auf [X](https://x.com/vite_js) oder [Mastodon](https://webtoo.ls/@vite).

## Vite-Laufzeit-API

Vite 5.1 bietet experimentelle Unterstützung für eine neue Vite-Laufzeit-API. Damit kann beliebiger Code ausgeführt werden, indem er zunächst mit Vite-Plugins verarbeitet wird. Der Unterschied zu `server.ssrLoadModule` besteht darin, dass die Laufzeitimplementierung vom Server entkoppelt ist. Dadurch können Autoren von Bibliotheken und Frameworks ihre eigene Kommunikationsebene zwischen Server und Laufzeit implementieren. Diese neue API soll die aktuellen SSR-Primitive von Vite ersetzen, sobald sie stabil läuft.

Die neue API bietet viele Vorteile:

- Unterstützung für HMR während SSR.
- Sie ist vom Server entkoppelt, sodass es keine Begrenzung hinsichtlich der Anzahl der Clients gibt, die einen einzelnen Server nutzen können – jeder Client verfügt über einen eigenen Modul-Cache (Sie können sogar nach Belieben mit ihm kommunizieren – über einen Nachrichtenkanal/Fetch-Aufruf/direkten Funktionsaufruf/Websocket).
- Sie ist nicht von integrierten APIs von Node/Bun/Deno abhängig, sodass sie in jeder Umgebung ausgeführt werden kann.
- Sie lässt sich leicht in Tools integrieren, die über einen eigenen Mechanismus zum Ausführen von Code verfügen (Sie können beispielsweise einen Runner bereitstellen, der `eval` anstelle von `new AsyncFunction` verwendet).

Die ursprüngliche Idee [wurde von Pooya Parsa vorgeschlagen](https://github.com/nuxt/vite/pull/201) und von [Anthony Fu](https://github.com/antfu) als [vite-node](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node# readme) implementiert, um [Nuxt 3 Dev SSR](https://antfu.me/posts/dev-ssr-on-nuxt) zu unterstützen, und später auch als Grundlage für [Vitest](https://vitest.dev) verwendet. Die Grundidee von vite-node hat sich also bereits seit geraumer Zeit in der Praxis bewährt. Es handelt sich hierbei um eine neue Iteration der API von [Vladimir Sheremet](https://github.com/sheremet-va), der vite-node bereits in Vitest neu implementiert hatte und die gewonnenen Erkenntnisse nutzte, um die API noch leistungsfähiger und flexibler zu gestalten, als er sie zu Vite Core hinzufügte. Die PR war ein Jahr in der Entwicklung. Die Entwicklung und die Diskussionen mit den Betreuern des Ökosystems können Sie [hier](https://github.com/vitejs/vite/issues/12165) nachlesen.

## Funktionen

### Verbesserte Unterstützung für `.css?url`

Das Importieren von CSS-Dateien als URLs funktioniert nun zuverlässig und korrekt. Dies war die letzte verbleibende Hürde bei der Umstellung von Remix auf Vite. Siehe ([#15259](https://github.com/vitejs/vite/issues/15259)).

### `build.assetsInlineLimit` unterstützt jetzt einen Callback

Benutzer können jetzt einen Callback bereitstellen, der einen booleschen Wert zurückgibt, um das Inlining für bestimmte Assets zu aktivieren oder zu deaktivieren. Wenn `undefined` zurückgegeben wird, gilt die Standardlogik. Siehe ([#15366](https://github.com/vitejs/vite/issues/15366)).

### Verbessertes HMR für zirkuläre Importe

In Vite 5.0 lösten akzeptierte Module innerhalb zirkulärer Importe immer eine vollständige Neuladung der Seite aus, selbst wenn sie im Client problemlos verarbeitet werden konnten. Dies wurde nun gelockert, sodass HMR ohne vollständiges Neuladen der Seite angewendet werden kann. Wenn jedoch während HMR ein Fehler auftritt, wird die Seite neu geladen. Siehe ([#15118](https://github.com/vitejs/vite/issues/15118)).

### Unterstützung von `ssr.external: true` zur Externalisierung aller SSR-Pakete

Bisher externalisiert Vite alle Pakete mit Ausnahme von verknüpften Paketen. Mit dieser neuen Option können Sie die Externalisierung aller Pakete, einschließlich verknüpfter Pakete, erzwingen. Dies ist praktisch bei Tests innerhalb von Monorepos, bei denen wir den üblichen Fall aller externalisierten Pakete emulieren möchten, oder wenn wir `ssrLoadModule` zum Laden einer beliebigen Datei verwenden und wir immer externe Pakete verwenden möchten, da uns HMR nicht interessiert. Siehe ([#10939](https://github.com/vitejs/vite/issues/10939)).

### `close`-Methode im Preview-Server verfügbar machen

Der Preview-Server stellt nun eine `close`-Methode zur Verfügung, die den Server einschließlich aller geöffneten Socket-Verbindungen ordnungsgemäß herunterfährt. Siehe ([#15630](https://github.com/vitejs/vite/issues/15630)).

## Leistungsverbesserungen

Vite wird mit jeder neuen Version schneller, und Vite 5.1 bietet zahlreiche Leistungsverbesserungen. Wir haben die Ladezeit für 10.000 Module (25 Ebenen tiefe Baumstruktur) mit [vite-dev-server-perf](https://github.com/yyx990803/vite-dev-server-perf) für alle Minor-Versionen ab Vite 4.0 gemessen. Dies ist ein guter Maßstab, um die Auswirkungen des bundle-losen Ansatzes von Vite zu messen. Jedes Modul ist eine kleine TypeScript-Datei mit einem Zähler und Importen zu anderen Dateien in der Baumstruktur, sodass hier hauptsächlich die Zeit gemessen wird, die für die Anfragen an separate Module benötigt wird. In Vite 4.0 dauerte das Laden von 10.000 Modulen auf einem M1 MAX 8 Sekunden. In [Vite 4.3, wo wir uns auf die Leistung konzentriert haben](./announcing-vite4-3.md), gelang uns ein Durchbruch, und wir konnten sie in 6,35 Sekunden laden. In Vite 5.1 gelang uns ein weiterer Leistungssprung. Vite bedient die 10.000 Module nun in 5,35 Sekunden.

![Vite 10K-Module – Entwicklung der Ladezeit](../images/vite5-1-10K-modules-loading-time.webp)

Die Ergebnisse dieses Benchmarks wurden mit Headless Puppeteer durchgeführt und eignen sich gut zum Vergleich der Versionen. Sie geben jedoch nicht die Zeit wieder, die Benutzer tatsächlich erleben. Wenn wir dieselben 10K-Module in einem Inkognito-Fenster in Chrome ausführen, erhalten wir:

| 10K Module                       | Vite 5.0 | Vite 5.1 |
| -------------------------------- | :------: | :------: |
| Ladezeit                         |  2892ms  |  2765ms  |
| Ladezeit (cached)                |  2778ms  |  2477ms  |
| Vollständiges Neuladen           |  2003ms  |  1878ms  |
| Vollständiges Neuladen (cached)  |  1682ms  |  1604ms  |

### CSS-Präprozessoren in Threads ausführen

Vite bietet nun eine optionale Unterstützung für die Ausführung von CSS-Präprozessoren in Threads. Sie können diese Funktion mit [`css.preprocessorMaxWorkers: true`](/config/shared-options.html#css-preprocessormaxworkers) aktivieren. Bei einem Vuetify 2-Projekt konnte die Startzeit für Entwickler mit dieser Funktion um 40 % reduziert werden. Es gibt einen [Leistungsvergleich für andere Setups im PR](https://github.com/vitejs/vite/pull/13584#issuecomment-1678827918). Siehe ([#13584](https://github.com/vitejs/vite/issues/13584)). [Feedback geben](https://github.com/vitejs/vite/discussions/15835).

### Neue Optionen zur Verbesserung von Server-Kaltstarts

Sie können `optimizeDeps.holdUntilCrawlEnd: false` einstellen, um zu einer neuen Strategie für die Deps-Optimierung zu wechseln, die bei großen Projekten hilfreich sein kann. Wir erwägen, in Zukunft standardmäßig zu dieser Strategie zu wechseln. [Feedback geben](https://github.com/vitejs/vite/discussions/15834). ([#15244](https://github.com/vitejs/vite/issues/15244))

### Schnellere Auflösung mit zwischengespeicherten Prüfungen

Die Optimierung `fs.cachedChecks` ist jetzt standardmäßig aktiviert. Unter Windows war `tryFsResolve` damit etwa 14-mal schneller, und die Auflösung von IDs wurde im Dreiecks-Benchmark insgesamt um etwa das Fünffache beschleunigt. ([#15704](https://github.com/vitejs/vite/issues/15704))

### Interne Leistungsverbesserungen

Der Dev-Server hat mehrere inkrementelle Leistungssteigerungen erfahren. Eine neue Middleware für Kurzschlüsse bei 304 ([#15586](https://github.com/vitejs/vite/issues/15586)). Wir haben `parseRequest` in Hot Paths vermieden ([#15617](https://github.com/vitejs/vite/issues/15617)). Rollup wird nun ordnungsgemäß verzögert geladen ([#15621](https://github.com/vitejs/vite/issues/15621)).

## Veraltete Funktionen

Wir reduzieren weiterhin die API-Oberfläche von Vite, wo immer dies möglich ist, um das Projekt langfristig wartbar zu halten.

### Veraltete Option `as` in `import.meta.glob`

Der Standard wurde zu [Import Attributes](https://github.com/tc39/proposal-import-attributes) verschoben, aber wir planen derzeit nicht, `as` durch eine neue Option zu ersetzen. Stattdessen wird empfohlen, dass der Benutzer zu `query` wechselt. Siehe ([#14420](https://github.com/vitejs/vite/issues/14420)).

### Experimentelles Vorab-Bündeln zur Build-Zeit entfernt

Das Vorab-Bündeln zur Build-Zeit, eine in Vite 3 hinzugefügte experimentelle Funktion, wurde entfernt. Da Rollup 4 seinen Parser auf nativ umgestellt hat und an Rolldown gearbeitet wird, sind sowohl die Leistung als auch die Inkonsistenz zwischen Entwicklung und Build für diese Funktion nicht mehr gültig. Wir möchten die Konsistenz zwischen Entwicklung und Build weiter verbessern und sind zu dem Schluss gekommen, dass die Verwendung von Rolldown für `Vorab-Bündelung während der Entwicklung` und `Produktions-Builds` die bessere Wahl für die Zukunft ist. Rolldown kann auch Caching auf eine Weise implementieren, die während des Builds viel effizienter ist als das Vorab-Bündeln von Abhängigkeiten. Siehe ([#15184](https://github.com/vitejs/vite/issues/15184)).

## Mitmachen

Wir sind den [900 Mitwirkenden an Vite Core](https://github.com/vitejs/vite/graphs/contributors) sowie den Betreuern von Plugins, Integrationen, Tools und Übersetzungen, die das Ökosystem vorantreiben, sehr dankbar. Wenn Ihnen Vite gefällt, laden wir Sie ein, sich zu beteiligen und uns zu helfen. Lesen Sie unseren [Beitragsleitfaden](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md) und steigen Sie ein, indem Sie [Probleme triagieren](https://github.com/vitejs/vite/issues), [PRs zu überprüfen](https://github.com/vitejs/vite/pulls), Fragen in [GitHub-Diskussionen](https://github.com/vitejs/vite/discussions) zu beantworten und anderen in der Community in [Vite Land](https://chat.vite.dev) zu helfen.

## Danksagungen

Vite 5.1 wurde dank unserer Community von Mitwirkenden, Betreuern im Ökosystem und dem [Vite-Team](/team) möglich. Ein großes Dankeschön an die Personen und Unternehmen, die die Entwicklung von Vite sponsern. [StackBlitz](https://stackblitz.com/), [Nuxt Labs](https://nuxtlabs.com/) und [Astro](https://astro.build) für die Einstellung von Vite-Teammitgliedern. Und auch an die Sponsoren auf [Vites GitHub Sponsors](https://github.com/sponsors/vitejs), [Vites Open Collective](https://opencollective.com/vite) und [Evan Yous GitHub Sponsors](https://github.com/sponsors/yyx990803).
