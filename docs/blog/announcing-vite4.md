---
title: Vite 4.0 is out!
author:
  name: The Vite Team
date: 2022-12-09
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 4
  - - meta
    - property: og:image
      content: https://vitejs.dev/og-image-announcing-vite4.png
  - - meta
    - property: og:url
      content: https://vitejs.dev/blog/announcing-vite4
  - - meta
    - property: og:description
      content: Vite 4 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 4.0 ist da!

_9. Dezember 2022_ - Lesen Sie die [Vite 5.0 Ankündigung](./announcing-vite5.md)

Vite 3 [wurde](./announcing-vite3.md) vor fünf Monaten veröffentlicht. Die wöchentlichen npm-Downloads sind seitdem von 1 Million auf 2,5 Millionen gestiegen. Das Ökosystem hat sich ebenfalls weiterentwickelt und wächst kontinuierlich. In der diesjährigen [Jamstack Conf-Umfrage](https://twitter.com/vite_js/status/1589665610119585793) stieg die Verwendung in der Community von 14% auf 32%, bei gleichzeitig hoher Zufriedenheitsbewertung von 9,7. Wir haben die stabilen Veröffentlichungen von [Astro 1.0](https://astro.build/), [Nuxt 3](https://v3.nuxtjs.org/) und anderen von Vite unterstützten Frameworks gesehen, die innovative und kollaborative Lösungen bieten: [SvelteKit](https://kit.svelte.dev/), [Solid Start](https://www.solidjs.com/blog/introducing-solidstart), [Qwik City](https://qwik.builder.io/qwikcity/overview/). Storybook hat die Unterstützung für Vite als eines seiner Hauptmerkmale für [Storybook 7.0](https://storybook.js.org/blog/first-class-vite-support-in-storybook/) angekündigt. Deno [unterstützt jetzt Vite](https://www.youtube.com/watch?v=Zjojo9wdvmY). Die Akzeptanz von [Vitest](https://vitest.dev) nimmt explosionsartig zu und wird bald die Hälfte der npm-Downloads von Vite ausmachen. Nx investiert ebenfalls in das Ökosystem und [unterstützt Vite offiziell](https://nx.dev/packages/vite).

[![Vite 4 Ökosystem](/ecosystem-vite4.png)](https://viteconf.org/2022/replay)

Als Zeichen des Wachstums, das Vite und die damit verbundenen Projekte erfahren haben, hat sich das Vite-Ökosystem am 11. Oktober auf der [ViteConf 2022](https://viteconf.org/2022/replay) versammelt. Vertreter der wichtigsten Web-Frameworks und Tools erzählten Geschichten über Innovation und Zusammenarbeit. Und symbolisch wählte das Rollup-Team genau an diesem Tag, um [Rollup 3](https://rollupjs.org) zu veröffentlichen.

Heute freut sich das Vite [Team](https://vitejs.dev/team) mit Unterstützung unserer Ökosystem-Partner, die Veröffentlichung von Vite 4 bekannt zu geben, das zur Build-Zeit von Rollup 3 angetrieben wird. Wir haben mit dem Ökosystem zusammengearbeitet, um einen reibungslosen Upgrade-Pfad für diese neue Hauptversion sicherzustellen. Vite verwendet jetzt [Rollup 3](https://github.com/vitejs/vite/issues/9870), was es uns ermöglicht hat, die interne Asset-Verarbeitung von Vite zu vereinfachen und viele Verbesserungen bietet. Die [Rollup 3 Versionshinweise finden Sie hier](https://github.com/rollup/rollup/releases/tag/v3.0.0).

![Vite 4 Announcement Cover Image](/og-image-announcing-vite4.png)

Schnellzugriff:

- [Dokumentation](/)
- [Migrationsleitfaden](https://v4.vitejs.dev/guide/migration.html)
- [Änderungsprotokoll](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#400-2022-12-09)

Dokumentationen in anderen Sprachen:

- [简体中文](https://cn.vitejs.dev/)
- [日本語](https://ja.vitejs.dev/)
- [Español](https://es.vitejs.dev/)

Wenn Sie Vite kürzlich verwendet haben, empfehlen wir Ihnen das Lesen des [Warum Vite-Leitfadens](https://vitejs.dev/guide/why.html) und das Überprüfen der [Einführungsanleitung](https://vitejs.dev/guide/) und des [Funktionsleitfadens](https://vitejs.dev/guide/features). Wenn Sie sich beteiligen möchten, sind Beiträge auf [GitHub](https://github.com/vitejs/vite) willkommen. Fast [700 Mitwirkende](https://github.com/vitejs/vite/graphs/contributors) haben zu Vite beigetragen. Verfolgen Sie die Updates auf [Twitter](https://twitter.com/vite_js) und [Mastodon](https://webtoo.ls/@vite) oder arbeiten Sie mit anderen in unserer [Discord-Community](http://chat.vitejs.dev/) zusammen.

## Spielen Sie mit Vite 4

Verwenden Sie `pnpm create vite`, um ein Vite-Projekt mit Ihrem bevorzugten Framework zu erstellen, oder öffnen Sie ein Starter-Template online, um mit Vite 4 zu experimentieren, indem Sie [vite.new](https://vite.new) verwenden.

Sie können auch `pnpm create vite-extra` ausführen, um Zugriff auf Vorlagen von anderen Frameworks und Laufzeiten (Solid, Deno, SSR und Bibliotheksstarter) zu erhalten. `create vite-extra`-Vorlagen sind auch verfügbar, wenn Sie `create vite` unter der Option `Others` ausführen.

Beachten Sie, dass Vite-Startervorlagen als Spielwiese zum Testen von Vite mit verschiedenen Frameworks gedacht sind. Wenn Sie Ihr nächstes Projekt erstellen, empfehlen wir, sich an die von jedem Framework empfohlenen Starter zu wenden. Einige Frameworks leiten jetzt in `create vite` auch zu ihren Startvorlagen weiter (`create-vue` und `Nuxt 3` für Vue sowie `SvelteKit` für Svelte).

## Neues React-Plugin mit SWC während der Entwicklung

[SWC](https://swc.rs/) ist jetzt eine ausgereifte Alternative zu [Babel](https://babeljs.io/), insbesondere im Kontext von React-Projekten. SWCs React Fast Refresh-Implementierung ist wesentlich schneller als Babel, und für einige Projekte ist es mittlerweile die bessere Alternative. Ab Vite 4 sind zwei Plugins für React-Projekte mit unterschiedlichen Kompromissen verfügbar. Wir glauben, dass es sich an diesem Punkt lohnt, beide Ansätze zu unterstützen, und werden in Zukunft weiterhin Verbesserungen an beiden Plugins erforschen.

### @vitejs/plugin-react

[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) ist ein Plugin, das esbuild und Babel verwendet und schnelles HMR

mit einem kleinen Paket-Footprint und der Flexibilität bietet, die Babel-Transformationspipeline verwenden zu können.

### @vitejs/plugin-react-swc (neu)

[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) ist ein neues Plugin, das esbuild während des Builds verwendet, aber Babel während der Entwicklung durch SWC ersetzt. Für große Projekte, die keine nicht standardmäßigen React-Erweiterungen benötigen, kann der Kaltstart und das Hot Module Replacement (HMR) signifikant schneller sein.

## Browserkompatibilität

Das moderne Browser-Build zielt standardmäßig auf `safari14` ab, um eine breitere ES2020-Kompatibilität zu erreichen. Dies bedeutet, dass moderne Builds jetzt [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) verwenden können und der [Nullish Coalescing-Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) nicht mehr transpiliert wird. Wenn Sie ältere Browser unterstützen müssen, können Sie [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) wie gewohnt hinzufügen.

## Importieren von CSS als Zeichenkette

In Vite 3 konnte das Importieren des Standardexports einer `.css`-Datei zu einer doppelten Ladung von CSS führen.

```ts
import cssString from './global.css'
```

Diese doppelte Ladung konnte auftreten, da eine `.css`-Datei ausgegeben wird und es wahrscheinlich ist, dass die CSS-Zeichenkette auch vom Anwendungscode verwendet wird - zum Beispiel durch das Framework-Runtime injiziert. Ab Vite 4 [wurde der Standardexport von `.css`](https://github.com/vitejs/vite/issues/11094) veraltet. In diesem Fall muss der Modifikator `?inline` für die Abfragezeichenfolge verwendet werden, da dadurch die importierten `.css`-Styles nicht ausgegeben werden.

```ts
import stuff from './global.css?inline'
```

Weitere Informationen finden Sie im [Migrationsleitfaden](https://v4.vitejs.dev/guide/migration.html).

## Umgebungsvariablen

Vite verwendet jetzt `dotenv` 16 und `dotenv-expand` 9 (zuvor `dotenv` 14 und `dotenv-expand` 5). Wenn Sie einen Wert einschließlich `#` oder `` ` `` haben, müssen Sie sie in Anführungszeichen setzen.

```diff
-VITE_APP=ab#cd`ef
+VITE_APP="ab#cd`ef"
```

Weitere Details finden Sie in den Änderungsprotokollen von [`dotenv`](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md) und [`dotenv-expand`](https://github.com/motdotla/dotenv-expand/blob/master/CHANGELOG.md).

## Weitere Funktionen

- CLI-Verknüpfungen (drücken Sie während der Entwicklung `h`, um sie alle zu sehen) ([#11228](https://github.com/vitejs/vite/pull/11228))
- Unterstützung für patch-package beim Vorab-Bündeln von Abhängigkeiten ([#10286](https://github.com/vitejs/vite/issues/10286))
- Sauberere Build-Protokolle ([#10895](https://github.com/vitejs/vite/issues/10895)) und Wechsel zu `kB`, um sich an Browser-Entwicklungstools anzupassen ([#10982](https://github.com/vitejs/vite/issues/10982))
- Verbesserte Fehlermeldungen während der SSR ([#11156](https://github.com/vitejs/vite/issues/11156))

## Reduzierte Paketgröße

Vite kümmert sich um seinen Footprint, um die Installation zu beschleunigen, insbesondere im Anwendungsfall von Dokumentations-Spielwiesen. Und auch in dieser Version gibt es Verbesserungen in der Paketgröße von Vite. Die Installationsgröße von Vite 4 ist 23% kleiner im Vergleich zu Vite 3.2.5 (14,1 MB gegenüber 18,3 MB).

## Upgrades für Vite Core

[Vite Core](https://github.com/vitejs/vite) und [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) entwickeln sich weiter, um Maintainern und Mitwirkenden ein besseres Erlebnis zu bieten und sicherzustellen, dass die Entwicklung von Vite mit dem Wachstum im Ökosystem mithalten kann.

### Framework-Plugins aus dem Core

[`@vitejs/plugin-vue`](https://github.com/vitejs/vite-plugin-vue) und [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react) waren seit den ersten Versionen von Vite Teil des Vite Core-Monorepos. Dies half uns, ein enges Feedback-Loop zu erhalten, wenn Änderungen vorgenommen wurden, da Core und die Plugins zusammen getestet und veröffentlicht wurden. Mit [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) können wir dieses Feedback mit diesen Plugins entwickeln, die in unabhängigen Repositories entwickelt wurden. Daher wurden sie ab Vite 4 [aus dem Vite Core-Monorepo entfernt](https://github.com/vitejs/vite/pull/11158). Dies ist bedeutend für Vites framework-agnostische Geschichte und wird es uns ermöglichen, unabhängige Teams aufzubauen, um jedes der Plugins zu pflegen. Wenn Sie Fehler melden oder Funktionen anfordern möchten, erstellen Sie bitte ab sofort Issues in den neuen Repositories: [`vitejs/vite-plugin-vue`](https://github.com/vitejs/vite-plugin-vue) und [`vitejs/vite-plugin-react`](https://github.com/vitejs/vite-plugin-react).

### Verbesserungen von vite-ecosystem-ci

[vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) erweitert die CI von Vite, indem es bedarfsgesteuerte Statusberichte über den Zustand der CIs von [den meisten wichtigen Downstream-Projekten](https://github.com/vitejs/vite-ecosystem-ci/tree/main/tests) bereitstellt. Wir führen vite-ecosystem-ci drei Mal pro Woche gegen den Hauptzweig von Vite aus und erhalten rechtzeitig Berichte, bevor eine Regression eingeführt wird. Vite 4 wird bald mit den meisten Projekten kompatibel sein, die Vite verwenden und bereits Branches mit den erforderlichen Änderungen vorbereitet haben und sie in den nächsten Tagen veröffentlichen werden

. Wir können vite-ecosystem-ci auch on-demand auf PRs ausführen, indem Sie `/ecosystem-ci run` in einem Kommentar verwenden, um [die Auswirkungen von Änderungen zu kennen](https://github.com/vitejs/vite/pull/11269#issuecomment-1343365064), bevor sie den Hauptzweig erreichen.

## Danksagungen

Vite 4 wäre ohne unzählige Stunden Arbeit von Vite-Mitwirkenden, von vielen von ihnen betreuten Downstream-Projekten und Plugins sowie den Anstrengungen des [Vite Teams](/team) nicht möglich gewesen. Wir haben alle zusammengearbeitet, um die DX von Vite einmal mehr zu verbessern, für jedes Framework und jede App, die es verwendet. Wir sind dankbar, eine gemeinsame Basis für ein so lebhaftes Ökosystem verbessern zu können.

Wir danken auch Einzelpersonen und Unternehmen, die das Vite-Team unterstützen, sowie Unternehmen, die direkt in die Zukunft von Vite investieren: Die Arbeit von [@antfu7](https://twitter.com/antfu7) an Vite und dem Ökosystem ist Teil seines Jobs bei [Nuxt Labs](https://nuxtlabs.com/), [Astro](https://astro.build) finanziert die Arbeit von [@bluwyoo](https://twitter.com/bluwyoo) am Vite-Kern und [StackBlitz](https://stackblitz.com/) stellt [@patak_dev](https://twitter.com/patak_dev) ein, um Vollzeit an Vite zu arbeiten.

## Nächste Schritte

Unser unmittelbarer Fokus wird darauf liegen, neu eröffnete Issues zu triagieren, um mögliche Regressionen zu vermeiden. Wenn Sie sich beteiligen und uns bei der Verbesserung von Vite unterstützen möchten, schlagen wir vor, mit der Triage von Issues zu beginnen. Treten Sie [unserem Discord](https://chat.vitejs.dev) bei und melden Sie sich im `#contributing`-Kanal. Verbessern Sie unsere `#docs`-Geschichte und `#help`-en Sie anderen. Wir müssen weiterhin eine hilfreiche und einladende Community für die nächste Welle von Benutzern aufbauen, da die Akzeptanz von Vite weiterhin wächst.

Es gibt viele offene Baustellen, um die DX von allen zu verbessern, die Vite gewählt haben, um ihre Frameworks zu betreiben und ihre Apps zu entwickeln. Weiter so!
