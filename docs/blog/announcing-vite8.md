---
title: Vite 8.0 is out!
author:
  name: The Vite Team
date: 2026-03-12
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 8
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite8.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite8
  - - meta
    - property: og:description
      content: Vite 8 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 8.0 ist da!

_12. März 2026_

![Titelbild zur Ankündigung von Vite 8](/og-image-announcing-vite8.webp)

Wir freuen uns sehr, die stabile Version von Vite 8 zu veröffentlichen! Als Vite an den Start ging, haben wir pragmatisch auf zwei Bundler gesetzt: esbuild für Geschwindigkeit während der Entwicklung und Rollup für optimierte Produktions-Builds. Diese Entscheidung hat uns jahrelang gute Dienste geleistet. Wir sind den Maintainern von Rollup und esbuild sehr dankbar – ohne sie wäre Vite nicht so erfolgreich geworden. Heute werden die beiden zu einem: Vite 8 wird mit [Rolldown](https://rolldown.rs/) als einzigem, einheitlichem, in Rust geschriebenem Bundler ausgeliefert und liefert bis zu 10- bis 30-mal schnellere Builds bei voller Plugin-Kompatibilität. Das ist die bedeutendste Architekturänderung seit Vite 2.

Vite wird inzwischen 65 Millionen Mal pro Woche heruntergeladen, und das Ökosystem wächst mit jedem Release weiter. Um Entwickler:innen bei der Orientierung in der stetig wachsenden Plugin-Landschaft zu helfen, haben wir außerdem [registry.vite.dev](https://registry.vite.dev) gestartet, ein durchsuchbares Verzeichnis von Plugins für Vite, Rolldown und Rollup, das täglich Plugin-Daten von npm sammelt.

Schnelllinks:

- [Dokumentation](/)
- Übersetzungen: [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/), [فارسی](https://fa.vite.dev/)
- [Migrationsleitfaden](/guide/migration)
- [GitHub-Changelog](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

Probieren Sie Vite 8 online auf [vite.new](https://vite.new) aus oder erstellen Sie lokal eine Vite-App mit Ihrem bevorzugten Framework, indem Sie `pnpm create vite` ausführen. Weitere Informationen finden Sie im [Leitfaden „Erste Schritte“](/guide/).

Wir laden Sie ein, uns dabei zu helfen, Vite zu verbessern (und sich den mehr als [1.200 Mitwirkenden am Vite-Kern](https://github.com/vitejs/vite/graphs/contributors) anzuschließen) – ebenso wie unsere Abhängigkeiten oder Plugins und Projekte im Ökosystem. Mehr dazu erfahren Sie in unserem [Leitfaden für Mitwirkende](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md). Ein guter Einstieg ist es, [Issues zu sichten](https://github.com/vitejs/vite/issues), [PRs zu reviewen](https://github.com/vitejs/vite/pulls), Test-PRs auf Basis offener Issues einzureichen und andere in den [Discussions](https://github.com/vitejs/vite/discussions) oder im [Hilfeforum](https://discord.com/channels/804011606160703521/1019670660856942652) von Vite Land zu unterstützen. Wenn Sie Fragen haben, treten Sie unserer [Discord-Community](https://chat.vite.dev) bei und sprechen Sie mit uns im [#contributing-Kanal](https://discord.com/channels/804011606160703521/804439875226173480).

Bleiben Sie auf dem Laufenden und vernetzen Sie sich mit anderen, die auf Vite aufbauen, indem Sie uns auf [Bluesky](https://bsky.app/profile/vite.dev), [X](https://twitter.com/vite_js) oder [Mastodon](https://webtoo.ls/@vite) folgen.

## Das von Rolldown angetriebene Vite

### Das Problem

Seit seinen frühesten Versionen hat sich Vite auf zwei getrennte Bundler für unterschiedliche Anforderungen gestützt. [esbuild](https://esbuild.github.io/) übernahm die schnelle Kompilierung während der Entwicklung (Vorab-Bündelung von Abhängigkeiten sowie TypeScript-/JSX-Transformationen), wodurch sich die Entwicklung sofort anfühlte. [Rollup](https://rollupjs.org/) übernahm das Bündeln, Chunking und Optimieren für die Produktion, wobei seine umfangreiche Plugin-API das gesamte Vite-Plugin-Ökosystem antrieb.

Dieser Ansatz mit zwei Bundlern hat Vite jahrelang gute Dienste geleistet. Er erlaubte es uns, uns auf Entwicklererfahrung und Orchestrierung zu konzentrieren, statt Parsen und Bündeln von Grund auf neu zu erfinden. Er brachte aber auch Kompromisse mit sich. Zwei getrennte Transformations-Pipelines bedeuteten zwei getrennte Plugin-Systeme und immer mehr Glue-Code, um beide Pipelines synchron zu halten. Mit der Zeit häuften sich Sonderfälle durch inkonsistente Modulbehandlung, und jede Angleichung in einer Pipeline barg das Risiko neuer Unterschiede in der anderen.

### Die Lösung

[Rolldown](https://rolldown.rs/) ist ein in Rust geschriebener Bundler, den das Team von [VoidZero](https://voidzero.dev) entwickelt hat, um diese Herausforderungen direkt anzugehen. Er wurde mit drei Zielen entworfen:

- **Leistung:** Da Rolldown in Rust geschrieben ist, arbeitet es mit nativer Geschwindigkeit. In Benchmarks ist es [10- bis 30-mal schneller als Rollup](https://github.com/rolldown/benchmarks) und erreicht das Leistungsniveau von esbuild.
- **Kompatibilität:** Rolldown unterstützt dieselbe Plugin-API wie Rollup und Vite. Die meisten bestehenden Vite-Plugins funktionieren mit Vite 8 ohne Anpassungen.
- **Erweiterte Funktionen:** Ein einziger, einheitlicher Bundler ermöglicht Fähigkeiten, die mit zwei Bundlern schwierig oder unmöglich waren, darunter der Full-Bundle-Modus, flexibleres Chunk-Splitting, persistentes Caching auf Modulebene und Unterstützung für Module Federation.

### Der Weg zur stabilen Version

Die Umstellung auf Rolldown erfolgte mit Bedacht und unter Einbeziehung der Community. Zunächst wurde ein separates Paket [`rolldown-vite`](https://voidzero.dev/posts/announcing-rolldown-vite) als Technical Preview veröffentlicht, sodass Early Adopters die Rolldown-Integration testen konnten, ohne die stabile Version von Vite zu beeinträchtigen. Das Feedback dieser Early Adopters war von unschätzbarem Wert. Sie haben die Integration in realen Codebasen jeder Form und Größe erprobt und dabei Sonderfälle und Kompatibilitätsprobleme aufgedeckt, die wir vor einer breiteren Veröffentlichung beheben konnten. Außerdem haben wir eine eigene CI-Suite eingerichtet, die wichtige Vite-Plugins und Frameworks gegen den neuen Bundler prüft, um Regressionen früh zu erkennen und Vertrauen in den Migrationspfad aufzubauen.

Im Dezember 2025 haben wir die [Beta von Vite 8](/blog/announcing-vite8-beta) mit vollständig integriertem Rolldown veröffentlicht. Während der Beta-Phase hat sich Rolldown selbst von der Beta zum Release Candidate entwickelt, mit kontinuierlichen Verbesserungen, die durch Tests und Feedback der Vite-Community vorangetrieben wurden.

### Leistung in der Praxis

Während der Preview- und Beta-Phase von `rolldown-vite` berichteten mehrere Unternehmen von messbar kürzeren Build-Zeiten für die Produktion:

- **Linear:** Build-Zeiten für die Produktion sanken von 46 s auf 6 s
- **Ramp:** 57 % kürzere Build-Zeit
- **Mercedes-Benz.io:** Bis zu 38 % kürzere Build-Zeit
- **Beehiiv:** 64 % kürzere Build-Zeit

Bei großen Projekten kann der Effekt besonders deutlich sein, und wir erwarten weitere Verbesserungen, während sich Rolldown weiterentwickelt.

### Eine einheitliche Toolchain

Mit Vite 8 wird Vite zum Einstiegspunkt in eine durchgängige Toolchain mit eng zusammenarbeitenden Teams: dem Build-Tool (Vite), dem Bundler (Rolldown) und dem Compiler ([Oxc](https://oxc.rs/)). Diese Abstimmung sorgt für konsistentes Verhalten im gesamten Stack, vom Parsen und Auflösen bis zum Transformieren und Minifizieren. Außerdem können wir neue Sprachspezifikationen schnell übernehmen, während sich JavaScript weiterentwickelt. Und durch die tiefe Integration über alle Schichten hinweg können wir Optimierungen verfolgen, die bisher außer Reichweite waren, etwa die Nutzung der semantischen Analyse von Oxc für besseres Tree-Shaking in Rolldown.

### Danke an die Community

Nichts davon wäre ohne die breite Community möglich gewesen. Unser tiefer Dank gilt den Framework-Teams ([SvelteKit](https://svelte.dev/docs/kit/introduction), [React Router](https://reactrouter.com/), [Storybook](https://storybook.js.org/), [Astro](https://astro.build/), [Nuxt](https://nuxt.com/) und vielen anderen), die `rolldown-vite` früh getestet, detaillierte Fehlerberichte eingereicht und mit uns an der Lösung von Kompatibilitätsproblemen gearbeitet haben. Ebenso dankbar sind wir allen Entwickler:innen, die die Beta ausprobiert, ihre Verbesserungen bei den Build-Zeiten geteilt und die Ecken und Kanten gemeldet haben, die uns beim Feinschliff dieses Releases geholfen haben. Ihre Bereitschaft, die Migration an echten Projekten zu testen, hat den Umstieg auf Rolldown reibungsloser und zuverlässiger gemacht.

## Node.js-Unterstützung

Vite 8 erfordert Node.js 20.19+ bzw. 22.12+, also dieselben Voraussetzungen wie Vite 7. Diese Versionsbereiche stellen sicher, dass Node.js `require(esm)` ohne Flag unterstützt, sodass Vite ausschließlich als ESM ausgeliefert werden kann.

## Weitere Funktionen

Über die Rolldown-Integration hinaus bringt Vite 8 mehrere bemerkenswerte Funktionen mit:

- **Integrierte Devtools:** Vite 8 bietet die Option [`devtools`](/config/shared-options#devtools), um die [Vite Devtools](https://devtools.vite.dev/) zu aktivieren, ein Entwicklerwerkzeug für Debugging und Analyse. Die Vite Devtools geben direkt aus dem Entwicklungsserver heraus tiefere Einblicke in Ihre Vite-Projekte.

- **Integrierte Unterstützung für tsconfig-`paths`:** Die Auflösung von TypeScript-Pfadaliasen lässt sich aktivieren, indem [`resolve.tsconfigPaths`](/config/shared-options.md#resolve-tsconfigpaths) auf `true` gesetzt wird. Das kostet etwas Leistung und ist daher standardmäßig nicht aktiviert.

- **Unterstützung für `emitDecoratorMetadata`:** Vite 8 unterstützt jetzt automatisch die TypeScript-Option `emitDecoratorMetadata`, sodass keine externen Plugins mehr nötig sind. Details finden Sie auf der Seite [Funktionen](/guide/features.md#emitdecoratormetadata).

- **Wasm-Unterstützung bei SSR:** [`.wasm?init`-Importe](/guide/features#webassembly) funktionieren jetzt auch in SSR-Umgebungen, womit die WebAssembly-Funktion von Vite auf serverseitiges Rendering ausgeweitet wird.

- **Weiterleitung der Browser-Konsole:** Vite 8 kann Logs und Fehler der Browser-Konsole an das Terminal des Entwicklungsservers weiterleiten. Das ist besonders hilfreich bei der Arbeit mit Coding-Agents, da Laufzeitfehler im Client so in der CLI-Ausgabe sichtbar werden. Aktivieren Sie es mit [`server.forwardConsole`](/config/server-options.md#server-forwardconsole); die Option wird automatisch aktiviert, wenn ein Coding-Agent erkannt wird.

## `@vitejs/plugin-react` v6

Zusammen mit Vite 8 veröffentlichen wir `@vitejs/plugin-react` v6. Das Plugin nutzt Oxc für die React-Refresh-Transformation. Babel ist keine Abhängigkeit mehr, und die Installationsgröße ist kleiner.

Für Projekte, die den [React Compiler](https://react.dev/learn/react-compiler) benötigen, bietet v6 einen Helfer `reactCompilerPreset`, der mit `@rolldown/plugin-babel` zusammenarbeitet. So gibt es einen expliziten Opt-in-Weg, ohne die Standardkonfiguration zu belasten.

Weitere Details finden Sie in den [Release Notes](https://github.com/vitejs/vite-plugin-react/releases/tag/plugin-react%406.0.0).

Beachten Sie, dass v5 weiterhin mit Vite 8 funktioniert, sodass Sie das Plugin auch erst nach dem Upgrade von Vite aktualisieren können.

## Ausblick

Die Rolldown-Integration öffnet die Tür für Verbesserungen und Optimierungen. Daran arbeiten wir als Nächstes:

- **Full-Bundle-Modus** (experimentell): Dieser Modus bündelt Module bereits während der Entwicklung, ähnlich wie bei Produktions-Builds. Erste Ergebnisse zeigen einen 3-mal schnelleren Start des Entwicklungsservers, 40 % schnellere vollständige Neuladevorgänge und 10-mal weniger Netzwerkanfragen. Das wirkt sich besonders bei großen Projekten aus, bei denen der ungebündelte Entwicklungsansatz an Skalierungsgrenzen stößt.

- [**Raw AST Transfer**](https://github.com/oxc-project/oxc/issues/2409): Ermöglicht JavaScript-Plugins den Zugriff auf den in Rust erzeugten AST mit minimalem Serialisierungsaufwand und schließt so die Leistungslücke zwischen Rust-Interna und JS-Plugin-Code.

- [**Native MagicString-Transformationen**](https://rolldown.rs/in-depth/native-magic-string#native-magicstring): Ermöglicht eigene Transformationen, deren Logik in JavaScript liegt, während die String-Manipulation in Rust berechnet wird.

- **Stabilisierung der Environment API**: Wir arbeiten daran, die Environment API stabil zu machen. Das Ökosystem trifft sich inzwischen regelmäßig, um besser zusammenzuarbeiten.

## Installationsgröße

Wir möchten Änderungen an der Installationsgröße von Vite transparent machen. Vite 8 allein ist etwa 15 MB größer als Vite 7. Das hat zwei Hauptgründe:

- **~10 MB durch lightningcss**: lightningcss war bisher eine optionale Peer-Abhängigkeit und ist jetzt eine normale Abhängigkeit, um von Haus aus eine bessere CSS-Minifizierung zu bieten.
- **~5 MB durch Rolldown**: Das Rolldown-Binary ist größer als esbuild + Rollup, vor allem wegen Leistungsoptimierungen, die Geschwindigkeit gegenüber Binary-Größe bevorzugen.

Wir werden die Installationsgröße weiter beobachten und daran arbeiten, sie zu verringern, während Rolldown reift.

## Migration auf Vite 8

Für die meisten Projekte sollte das Upgrade auf Vite 8 reibungslos verlaufen. Wir haben eine Kompatibilitätsschicht gebaut, die bestehende `esbuild`- und `rollupOptions`-Konfigurationen automatisch in ihre Rolldown- und Oxc-Entsprechungen umwandelt, sodass viele Projekte ohne Konfigurationsänderungen funktionieren.

Für größere oder komplexere Projekte empfehlen wir eine schrittweise Migration: Wechseln Sie zuerst unter Vite 7 von `vite` zum Paket `rolldown-vite`, um Rolldown-spezifische Probleme zu isolieren, und aktualisieren Sie anschließend auf Vite 8. Mit diesem zweistufigen Vorgehen lässt sich leicht erkennen, ob Probleme vom Bundler-Wechsel oder von anderen Änderungen in Vite 8 herrühren.

Bitte lesen Sie vor dem Upgrade den ausführlichen [Migrationsleitfaden](/guide/migration). Die vollständige Liste der Änderungen finden Sie im [Changelog von Vite 8](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md).

## Danke, Rollup und esbuild

Mit dem Umstieg von Vite auf Rolldown möchten wir uns einen Moment Zeit nehmen, um den beiden Projekten, die Vite möglich gemacht haben, unseren tiefen Dank auszusprechen.

Rollup war von Anfang an der Produktions-Bundler von Vite. Das Design seiner eleganten Plugin-API erwies sich als so durchdacht, dass Rolldown es übernommen hat, und das gesamte Plugin-Ökosystem von Vite existiert dank des Fundaments, das Rollup gelegt hat. Die Qualität und Sorgfalt der Architektur von Rollup haben geprägt, wie Vite über Erweiterbarkeit denkt. Danke, [Rich Harris](https://github.com/Rich-Harris), für die Entwicklung von Rollup, und danke, [Lukas Taegert-Atkinson](https://github.com/lukastaegert) und dem Rollup-Team, für die Pflege und Weiterentwicklung zu etwas, das das Ökosystem der Web-Tools so nachhaltig geprägt hat.

esbuild hat Vites bemerkenswert schnelle Entwicklungserfahrung von Anfang an angetrieben: Vorab-Bündelung von Abhängigkeiten sowie TypeScript- und JSX-Transformationen, die in Millisekunden statt in Hunderten davon abgeschlossen waren. esbuild hat bewiesen, dass Build-Tools um Größenordnungen schneller sein können, und mit seiner Geschwindigkeit die Messlatte gesetzt, die eine ganze Generation von Rust- und Go-basierten Tools inspiriert hat. Danke, [Evan Wallace](https://github.com/evanw), dass du uns allen gezeigt hast, was möglich ist.

Ohne diese beiden Projekte gäbe es Vite in seiner heutigen Form nicht. Auch wenn wir mit Rolldown weitergehen, ist der Einfluss von Rollup und esbuild tief in Vites DNA verankert, und wir sind dankbar für alles, was sie dem Ökosystem gegeben haben. Mehr über alle Projekte und Menschen, auf die Vite angewiesen ist, erfahren Sie auf unserer Seite [Danksagungen](/acknowledgements).

## Danksagungen

Die Entwicklung von Vite 8 wurde von [sapphi-red](https://github.com/sapphi-red) und dem [Vite-Team](/team) geleitet, mit Unterstützung einer breiten Community aus Mitwirkenden, Downstream-Maintainern und Plugin-Autor:innen. Wir danken dem [Rolldown-Team](https://rolldown.rs/team) für die enge Zusammenarbeit, die das von Rolldown angetriebene Vite 8 möglich gemacht hat. Besonders dankbar sind wir außerdem allen, die an der Preview von `rolldown-vite` und der Beta-Phase von Vite 8 teilgenommen haben. Ihre Tests, Fehlerberichte und Ihr Feedback haben die Migration zu Rolldown erst möglich gemacht und dieses Release zu etwas geformt, auf das wir stolz sind.

Vite wird Ihnen von [VoidZero](https://voidzero.dev) in Partnerschaft mit [Bolt](https://bolt.new/) und [NuxtLabs](https://nuxtlabs.com/) zur Verfügung gestellt. Wir danken außerdem unseren Sponsoren auf [Vites GitHub Sponsors](https://github.com/sponsors/vitejs) und [Vites Open Collective](https://opencollective.com/vite).
