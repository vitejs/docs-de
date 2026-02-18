---
title: Vite 5.0 is out!
author:
  name: The Vite Team
date: 2023-11-16
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 5
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite5.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite5
  - - meta
    - property: og:description
      content: Vite 5 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 5.0 ist da!

_16. November 2023_

![Titelbild zur Ankündigung von Vite 5](/og-image-announcing-vite5.webp)

Vite 4 [wurde vor fast einem Jahr veröffentlicht](./announcing-vite4.md) und diente als solide Grundlage für das Ökosystem. Die wöchentlichen npm-Downloads stiegen von 2,5 Millionen auf 7,5 Millionen, da Projekte weiterhin auf einer gemeinsamen Infrastruktur aufbauen. Die Frameworks wurden weiter innoviert, und zusätzlich zu [Astro](https://astro.build/), [Nuxt](https://nuxt.com/) [SvelteKit](https://kit.svelte.dev/), [Solid Start](https://www.solidjs.com/blog/introducing-solidstart) und [Qwik City](https://qwik.builder.io/qwikcity/overview/) kamen neue Frameworks hinzu, die das Ökosystem weiter stärkten. Der Wechsel von [RedwoodJS](https://redwoodjs.com/) und [Remix](https://remix.run/) zu Vite ebnet den Weg für eine weitere Verbreitung im React-Ökosystem. [Vitest](https://vitest.dev) wuchs sogar noch schneller als Vite. Das Team hat hart gearbeitet und wird bald [Vitest 1.0 veröffentlichen](https://github.com/vitest-dev/vitest/issues/3596). Die Geschichte von Vite in Verbindung mit anderen Tools wie [Storybook](https://storybook.js.org), [Nx](https://nx.dev) und [Playwright](https://playwright.dev) wurde immer besser, ebenso wie die Umgebungen, da Vite dev sowohl in [Deno](https://deno.com) als auch in [Bun](https://bun.sh) funktioniert.

Vor einem Monat fand die zweite Ausgabe der [ViteConf](https://viteconf.org/23/replay) statt, die von [StackBlitz](https://stackblitz.com) veranstaltet wurde. Wie schon im letzten Jahr kamen die meisten Projekte des Ökosystems zusammen, um Ideen auszutauschen und sich zu vernetzen, um die Commons weiter auszubauen. Außerdem sehen wir neue Elemente, die das Meta-Framework-Toolkit ergänzen, wie [Volar](https://volarjs.dev/) und [Nitro](https://nitro.build/). Das Rollup-Team veröffentlichte am selben Tag [Rollup 4](https://rollupjs.org), eine Tradition, die Lukas im letzten Jahr ins Leben gerufen hat.

Vor sechs Monaten wurde Vite 4.3 [veröffentlicht](./announcing-vite4.md). Diese Version verbesserte die Leistung des Entwicklungsservers erheblich. Es gibt jedoch noch viel Raum für Verbesserungen. Auf der ViteConf stellte Evan You den langfristigen Plan von Vite vor, an Rolldown zu arbeiten (https://www.youtube.com/watch?v=hrdwQHoAp0M), einer Rust-Portierung von Rollup mit kompatiblen APIs. Sobald diese fertig ist, wollen wir sie in Vite Core einsetzen, um sowohl die Aufgaben von Rollup als auch von esbuild zu übernehmen. Dies wird zu einer Steigerung der Build-Leistung (und später auch der Entwicklungsleistung, wenn wir leistungssensitive Teile von Vite selbst auf Rust umstellen) und zu einer deutlichen Verringerung der Inkonsistenzen zwischen Entwicklung und Build führen. Rolldown befindet sich derzeit in einem frühen Stadium, und das Team bereitet sich darauf vor, den Code noch vor Jahresende als Open Source zur Verfügung zu stellen. Bleiben Sie gespannt!

Heute erreichen wir einen weiteren wichtigen Meilenstein in der Entwicklung von Vite. Das Vite-Team, die Mitwirkenden und die Partner des Ökosystems freuen sich, die Veröffentlichung von Vite 5 bekannt zu geben. Vite verwendet nun [Rollup 4](https://github.com/vitejs/vite/pull/14508), was bereits eine erhebliche Steigerung der Build-Leistung bedeutet. Außerdem gibt es neue Optionen zur Verbesserung des Leistungsprofils Ihres Entwicklungsservers.

Vite 5 konzentriert sich auf die Bereinigung der API (Entfernen veralteter Funktionen) und optimiert mehrere Funktionen, um langjährige Probleme zu beheben, beispielsweise durch Umstellung von `define` auf die Verwendung geeigneter AST-Ersetzungen anstelle von regulären Ausdrücken. Wir unternehmen auch weiterhin Schritte, um Vite zukunftssicher zu machen (Node.js 18+ ist jetzt erforderlich, und [die CJS Node API wurde veraltet erklärt](/guide/migration#deprecate-cjs-node-api)).

Schnellzugriff:

- [Docs](/)
- [Migration Guide](/guide/migration)
- [Changelog](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2023-11-16)

Dokumentationen in anderen Sprachen:

- [简体中文](https://cn.vite.dev/)
- [日本語](https://ja.vite.dev/)
- [Español](https://es.vite.dev/)
- [Português](https://pt.vite.dev/)
- [한국어](https://ko.vite.dev/)
- [Deutsch](https://de.vite.dev/) (Neue Übersetzung!)

Wenn Sie Vite noch nicht kennen, empfehlen wir Ihnen, zunächst die Anleitungen [Erste Schritte](/guide/) und [Funktionen](/guide/features) zu lesen.

Wir bedanken uns bei den mehr als [850 Mitwirkenden an Vite Core](https://github.com/vitejs/vite/graphs/contributors) sowie den Betreuern und Mitwirkenden von Vite-Plugins, -Integrationen, -Tools und -Übersetzungen, die uns dabei geholfen haben, diesen Punkt zu erreichen. Wir möchten Sie ermutigen, sich zu engagieren und Vite gemeinsam mit uns weiter zu verbessern. Weitere Informationen finden Sie in unserem [Beitragsleitfaden](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md). Für den Einstieg empfehlen wir Ihnen, [Probleme zu sichten](https://github.com/vitejs/vite/issues), [PRs zu überprüfen](https://github.com/vitejs/vite/pulls), fehlgeschlagene Test-PRs auf der Grundlage offener Probleme zu senden und anderen in den [Diskussionen](https://github.com/vitejs/vite/discussions) und im [Hilfeforum](https://discord.com/channels/804011606160703521/1019670660856942652) von Vite Land zu helfen. Dabei lernen Sie viel und ebnen sich den Weg für weitere Beiträge zum Projekt. Wenn Sie Fragen haben, treten Sie unserer [Discord-Community](http://chat.vite.dev/) bei und melden Sie sich im [#contributing-Kanal](https://discord.com/channels/804011606160703521/804439875226173480) zu Wort.

Um auf dem Laufenden zu bleiben, folgen Sie uns auf [X](https://twitter.com/vite_js) oder [Mastodon](https://webtoo.ls/@vite).

## Schnellstart mit Vite 5

Verwenden Sie `pnpm create vite`, um ein Vite-Projekt mit Ihrem bevorzugten Framework zu erstellen, oder öffnen Sie eine vorgefertigte Vorlage online, um mit Vite 5 unter Verwendung von [vite.new](https://vite.new) zu experimentieren. Sie können auch `pnpm create vite-extra` ausführen, um Zugriff auf Vorlagen aus anderen Frameworks und Laufzeiten (Solid, Deno, SSR und Bibliotheksstartern) zu erhalten. `create vite-extra`-Vorlagen sind auch verfügbar, wenn Sie `create vite` unter der Option `Others` ausführen.

Beachten Sie, dass Vite-Starter-Vorlagen als Spielwiese zum Testen von Vite mit verschiedenen Frameworks gedacht sind. Wenn Sie Ihr nächstes Projekt erstellen, empfehlen wir Ihnen, sich an die von den einzelnen Frameworks empfohlenen Starter zu wenden. Einige Frameworks leiten nun in `create vite` ebenfalls zu ihren Startern weiter (`create-vue` und `Nuxt 3` für Vue und `SvelteKit` für Svelte).

## Node.js Support

Vite unterstützt Node.js 14 / 16 / 17 / 19, das das Ende seiner Lebensdauer erreicht hat, nicht mehr. Node.js 18 / 20+ ist nun erforderlich.

## Performanz

Zusätzlich zu den Verbesserungen der Build-Leistung in Rollup 4 gibt es einen neuen Leitfaden, der Ihnen dabei hilft, häufige Leistungsprobleme zu identifizieren und zu beheben: [https://vite.dev/guide/performance](/guide/performance).

Vite 5 führt außerdem [server.warmup](/guide/performance.html#warm-up-frequently-used-files) ein, eine neue Funktion zur Verbesserung der Startzeit. Damit können Sie eine Liste von Modulen definieren, die sofort nach dem Start des Servers vorab transformiert werden sollen. Bei Verwendung von [`--open` oder `server.open`](/config/server-options.html#server-open) wärmt Vite automatisch auch den Einstiegspunkt Ihrer App oder die angegebene URL zum Öffnen auf.

## Hauptänderungen

- [Vite wird jetzt von Rollup 4 unterstützt](/guide/migration#rollup-4)
- [Die CJS-Node-API wurde als veraltet markiert](/guide/migration#deprecate-cjs-node-api)
- [Überarbeitung der Ersetzungsstrategie für `define` und `import.meta.env.*`](/guide/migration#rework-define-and-import-meta-env-replacement-strategy)
- [Der Wert der externalisierten SSR-Module entspricht nun der Produktion](/guide/migration#ssr-externalized-modules-value-now-matches-production)
- [`worker.plugins` ist nun eine Funktion](/guide/migration#worker-plugins-is-now-a-function)
- [Pfade mit `.` können nun auf index.html zurückgreifen](/guide/migration#allow-path-containing-to-fallback-to-index-html)
- [Anpassung des Verhaltens bei der Bereitstellung von HTML-Dateien in der Entwicklungs- und Vorschauumgebung](/guide/migration#align-dev-and-preview-html-serving-behaviour)
- [Manifestdateien werden nun standardmäßig im Verzeichnis `.vite` generiert](/guide/migration#manifest-files-are-now-generated-in-vite-directory-by-default)
- [CLI-Shortcuts erfordern einen zusätzlichen Druck auf die Eingabetaste](/guide/migration#cli-shortcuts-require-an-additional-enter-press)
- [Aktualisierung des TypeScript-Verhaltens von `experimentalDecorators` und `useDefineForClassFields`](/guide/migration#update-experimentaldecorators-and-usedefineforclassfields-typescript-behaviour)
- [Entfernen des Flags `--https` und von `https: true`](/guide/migration#remove-https-flag-and-https-true)
- [Entfernen der APIs `resolvePackageEntry` und `resolvePackageData`](/guide/migration#remove-resolvepackageentry-and-resolvepackagedata-apis)
- [Entfernen zuvor veralteter APIs](/guide/migration#removed-deprecated-apis)

## Migration zu Vite 5

Wir haben mit Partnern aus dem Ökosystem zusammengearbeitet, um einen reibungslosen Übergang zu dieser neuen Hauptversion zu gewährleisten. Auch diesmal war [vite-ecosystem-ci](https://www.youtube.com/watch?v=7L4I4lDzO48) wieder von entscheidender Bedeutung, um uns dabei zu helfen, mutigere Änderungen vorzunehmen und gleichzeitig Rückschritte zu vermeiden. Wir freuen uns sehr, dass andere Ökosysteme ähnliche Konzepte übernehmen, um die Zusammenarbeit zwischen ihren Projekten und den nachgelagerten Betreuern zu verbessern.

Für die meisten Projekte sollte das Update auf Vite 5 unkompliziert sein. Wir empfehlen jedoch, vor dem Upgrade die [ausführliche Migrationsanleitung](/guide/migration) zu lesen.

Eine detaillierte Aufschlüsselung mit der vollständigen Liste der Änderungen am Vite-Kern finden Sie unter [Vite 5 Changelog](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2023-11-16).

## Danksagungen

Vite 5 ist das Ergebnis langwieriger Arbeit unserer Community aus Mitwirkenden, Downstream-Maintainern, Plugin-Autoren und dem [Vite-Team](/team). Ein großes Dankeschön an [Bjorn Lu](https://twitter.com/bluwyoo) für die Leitung des Release-Prozesses für diese wichtige Version.

Wir sind auch den Personen und Unternehmen dankbar, die die Entwicklung von Vite sponsern. [StackBlitz](https://stackblitz.com/), [Nuxt Labs](https://nuxtlabs.com/) und [Astro](https://astro.build) investieren weiterhin in Vite, indem sie Mitglieder des Vite-Teams einstellen. Ein großes Dankeschön an die Sponsoren auf [Vites GitHub Sponsors](https://github.com/sponsors/vitejs), [Vites Open Collective](https://opencollective.com/vite) und [Evan Yous GitHub Sponsors](https://github.com/sponsors/yyx990803). Besondere Erwähnung verdient [Remix](https://remix.run/) dafür, dass es Gold-Sponsor geworden ist und nach dem Wechsel zu Vite einen Beitrag zurückgibt.
