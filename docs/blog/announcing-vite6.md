---
title: Vite 6.0 is out!
author:
  name: The Vite Team
date: 2024-11-26
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 6
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite6.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite6
  - - meta
    - property: og:description
      content: Vite 6 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 6.0 ist da!

_26. November 2024_

![Titelbild zur Ankündigung von Vite 6](/og-image-announcing-vite6.webp)

Heute machen wir einen weiteren großen Schritt in der Geschichte von Vite. Das Vite-Team, die Mitwirkenden und die Ökosystempartner freuen sich, die Veröffentlichung von Vite 6 bekannt zu geben.

Es war ein ereignisreiches Jahr. Die Akzeptanz von Vite wächst weiter, wobei die wöchentlichen npm-Downloads seit der Veröffentlichung von Vite 5 vor einem Jahr von 7,5 Millionen auf 17 Millionen gestiegen sind. [Vitest](https://vitest.dev) wird nicht nur von den Nutzern immer mehr geschätzt, sondern beginnt auch, ein eigenes Ökosystem zu bilden. So verfügt beispielsweise [Storybook](https://storybook.js.org) über neue Testfunktionen, die von Vitest unterstützt werden.

Auch neue Frameworks sind zum Vite-Ökosystem hinzugekommen, darunter [TanStack Start](https://tanstack.com/start), [One](https://onestack.dev/), [Ember](https://emberjs.com/) und andere. Web-Frameworks entwickeln sich immer schneller weiter. Die Verbesserungen, die die Entwickler vorgenommen haben, können Sie sich unter [Astro](https://astro.build/), [Nuxt](https://nuxt.com/), [SvelteKit](https://kit.svelte.dev/), [Solid Start](https://www.solidjs.com/blog/introducing-solidstart), [Qwik City](https://qwik.builder.io/qwikcity/overview/), [RedwoodJS](https://redwoodjs.com/), [React Router](https://reactrouter.com/) und vielen anderen ansehen.

Vite wird unter anderem von OpenAI, Google, Apple, Microsoft, NASA, Shopify, Cloudflare, GitLab, Reddit und Linear verwendet. Vor zwei Monaten haben wir eine Liste der [Unternehmen, die Vite verwenden](https://github.com/vitejs/companies-using-vite) erstellt. Wir freuen uns, dass uns viele Entwickler PRs schicken, um ihre Unternehmen zur Liste hinzuzufügen. Es ist kaum zu glauben, wie sehr das Ökosystem, das wir gemeinsam aufgebaut haben, seit den ersten Schritten von Vite gewachsen ist.

![Wöchentliche npm-Downloads von Vite](../images/vite6-npm-weekly-downloads.webp)

## Beschleunigung des Vite-Ökosystems

Im vergangenen Monat versammelte sich die Community zur dritten Ausgabe der [ViteConf](https://viteconf.org/24/replay), die erneut von [StackBlitz](https://stackblitz.com) veranstaltet wurde. Es war die größte Vite-Konferenz mit einer breiten Vertretung von Entwicklern aus dem Ökosystem. Neben anderen Ankündigungen stellte Evan You [VoidZero](https://staging.voidzero.dev/posts/announcing-voidzero-inc) vor, ein Unternehmen, das sich der Entwicklung einer offenen, leistungsstarken und einheitlichen Toolchain für das JavaScript-Ökosystem widmet. VoidZero steht hinter [Rolldown](https://rolldown.rs) und [Oxc](https://oxc.rs), und ihr Team macht bedeutende Fortschritte, sodass sie bald von Vite übernommen werden können. Sehen Sie sich Evans Keynote an, um mehr über die nächsten Schritte für die rust-basierte Zukunft von Vite zu erfahren.

<YouTubeVideo videoId="EKvvptbTx6k?si=EZ-rFJn4pDW3tUvp" />

[Stackblitz](https://stackblitz.com) stellte [bolt.new](https://bolt.new) vor, eine Remix-App, die Claude und WebContainers kombiniert und es Ihnen ermöglicht, Full-Stack-Apps aufzurufen, zu bearbeiten, auszuführen und bereitzustellen. Nate Weiner kündigte [One](https://onestack.dev/) an, ein neues Vite-basiertes React-Framework für Web und Native. Storybook präsentierte seine neuesten Vitest-basierten [Testfunktionen](https://youtu.be/8t5wxrFpCQY?si=PYZoWKf-45goQYDt). Und vieles mehr. Wir empfehlen Ihnen, sich [alle 43 Vorträge](https://www.youtube.com/playlist?list=PLqGQbXn_GDmnObDzgjUF4Krsfl6OUKxtp) anzusehen. Die Referenten haben sich große Mühe gegeben, uns zu vermitteln, woran jedes Projekt gearbeitet hat.

Vite hat auch eine überarbeitete Landingpage und eine übersichtliche Domain erhalten. Sie sollten Ihre URLs aktualisieren, damit sie künftig auf die neue Domain [vite.dev](https://vite.dev) verweisen. Das neue Design und die Umsetzung stammen von VoidZero, den gleichen Leuten, die auch die Website erstellt haben. Ein großes Dankeschön an [Vicente Rodriguez](https://bento.me/rmoon) und [Simon Le Marchant](https://marchantweb.com/).

## Die nächste große Version von Vite ist da

Vite 6 ist die bedeutendste Hauptversion seit Vite 2. Wir freuen uns darauf, gemeinsam mit dem Ökosystem unsere gemeinsamen Ressourcen durch neue APIs und wie gewohnt eine noch ausgefeiltere Basis, auf der wir aufbauen können, weiter auszubauen.

Schnellzugriff:

- [Dokumente](/)
- Übersetzungen: [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/)
- [Migrationsleitfaden](/guide/migration)
- [GitHub-Änderungsprotokoll](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#600-2024-11-26)

Wenn Sie Vite noch nicht kennen, empfehlen wir Ihnen, zunächst die Anleitungen [Erste Schritte](/guide/) und [Funktionen](/guide/features) zu lesen.

Wir möchten uns bei den mehr als [1.000 Mitwirkenden an Vite Core](https://github.com/vitejs/vite/graphs/contributors) sowie den Betreuern und Mitwirkenden der Vite-Plugins, -Integrationen, -Tools und -Übersetzungen bedanken, die uns bei der Entwicklung dieser neuen Hauptversion unterstützt haben. Wir laden Sie ein, sich zu beteiligen und uns dabei zu helfen, Vite für das gesamte Ökosystem zu verbessern. Weitere Informationen finden Sie in unserem [Beitragsleitfaden](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md).

Um loszulegen, empfehlen wir Ihnen, bei der [Triage von Problemen](https://github.com/vitejs/vite/issues) zu helfen, [PRs zu überprüfen](https://github.com/vitejs/vite/pulls), fehlgeschlagene Test-PRs basierend auf offenen Problemen zu senden und andere in den [Diskussionen](https://github.com/vitejs/vite/discussions) und im [Hilfeforum](https://discord.com/channels/804011606160703521/1019670660856942652) von Vite Land zu unterstützen. Wenn Sie mit uns sprechen möchten, treten Sie unserer [Discord-Community](http://chat.vite.dev/) bei und sagen Sie Hallo im [#contributing-Kanal](https://discord.com/channels/804011606160703521/804439875226173480).

Die neuesten Nachrichten zum Vite-Ökosystem und zum Vite-Kern finden Sie auf [Bluesky](https://bsky.app/profile/vite.dev), [X](https://twitter.com/vite_js) oder [Mastodon](https://webtoo.ls/@vite).

## Erste Schritte mit Vite 6

Mit `pnpm create vite` können Sie schnell eine Vite-App mit Ihrem bevorzugten Framework erstellen oder mit [vite.new](https://vite.new) online mit Vite 6 spielen. Sie können auch `pnpm create vite-extra` ausführen, um Zugriff auf Vorlagen aus anderen Frameworks und Laufzeiten (Solid, Deno, SSR und Bibliotheksstarter) zu erhalten. `create vite-extra`-Vorlagen sind auch verfügbar, wenn Sie `create vite` unter der Option `Others` ausführen.

Die Vite-Starter-Vorlagen sind als Spielwiese gedacht, um Vite mit verschiedenen Frameworks zu testen. Wenn Sie Ihr nächstes Projekt erstellen, sollten Sie sich an den von den einzelnen Frameworks empfohlenen Starter wenden. `create vite` bietet auch eine Verknüpfung zum Einrichten geeigneter Starter für einige Frameworks, wie `create-vue`, `Nuxt 3`, `SvelteKit`, `Remix`, `Analog` und `Angular`.

## Node.js Support

Vite 6 unterstützt Node.js 18, 20 und 22+, ähnlich wie Vite 5. Die Unterstützung für Node.js 21 wurde eingestellt. Vite stellt die Unterstützung für ältere Versionen von Node.js nach deren [EOL](https://endoflife.date/nodejs) ein. Das EOL für Node.js 18 ist Ende April 2025. Danach werden wir möglicherweise eine neue Hauptversion veröffentlichen, um die erforderliche Node.js-Version anzupassen.

## Experimentelle Environment-API

Vite wird mit der neuen Environment-API noch flexibler. Diese neuen APIs ermöglichen es Framework-Autoren, eine Entwicklungsumgebung anzubieten, die näher an der Produktion ist, und dem Ökosystem, neue Bausteine zu teilen. Wenn Sie eine SPA erstellen, ändert sich nichts. Wenn Sie Vite mit einer einzigen Client-Umgebung verwenden, funktioniert alles wie bisher. Und selbst für benutzerdefinierte SSR-Anwendungen ist Vite 6 abwärtskompatibel. Die primäre Zielgruppe für die Environment-API sind Framework-Autoren.

Für neugierige Endbenutzer hat Sapphi einen großartigen Leitfaden mit dem Titel [Einführung in die Environment API](https://green.sapphi.red/blog/increasing-vites-potential-with-the-environment-api) verfasst. Dieser Leitfaden ist ein guter Ausgangspunkt, um zu verstehen, warum wir versuchen, Vite noch flexibler zu gestalten.

Wenn Sie Framework-Autor oder Vite-Plugin-Maintainer sind und die neuen APIs nutzen möchten, finden Sie weitere Informationen in den [Environment API Guides](https://main.vite.dev/guide/api-environment).

Wir möchten uns bei allen bedanken, die an der Definition und Implementierung der neuen APIs beteiligt waren. Anthony Fu und Pooya Parsa haben vite-node entwickelt, um [Nuxt's Dev SSR story](https://antfu.me/posts/dev-ssr-on-nuxt) mit Vite zu verbessern. Anschließend hat Anthony vite-node für Vitest genutzt, und Vladimir Sheremet hat es weiter verbessert. Anfang 2023 begann Vladimir damit, vite-node in Vite Core zu integrieren, und ein Jahr später haben wir es als Runtime-API in Vite 5.1 veröffentlicht. Das Feedback von unseren Partnern im Ökosystem (besonderer Dank geht an das Cloudflare-Team) hat uns dazu motiviert, die Umgebungen von Vite noch ambitionierter zu überarbeiten. Mehr über die Geschichte erfahren Sie in [Pataks Vortrag auf der ViteConf 24](https://www.youtube.com/watch?v=WImor3HDyqU?si=EZ-rFJn4pDW3tUvp).

Das gesamte Vite-Team war an der Definition der neuen API beteiligt, die unter Einbeziehung des Feedbacks vieler Projekte aus dem Ökosystem gemeinsam entwickelt wurde. Vielen Dank an alle Beteiligten! Wir laden Sie herzlich ein, sich zu beteiligen, wenn Sie ein Framework, ein Plugin oder ein Tool auf Basis von Vite entwickeln. Die neuen APIs befinden sich noch in der Testphase. Wir werden gemeinsam mit dem Ökosystem prüfen, wie die neuen APIs verwendet werden, und sie für die nächste Hauptversion stabilisieren. Wenn Sie Fragen haben oder Feedback geben möchten, finden Sie hier eine offene GitHub-Diskussion (https://github.com/vitejs/vite/discussions/16358).

## Wichtigste Änderungen

- [Standardwert für `resolve.conditions`](/guide/migration#default-value-for-resolve-conditions)
- [JSON stringify](/guide/migration#json-stringify)
- [Erweiterte Unterstützung von Asset-Referenzen in HTML-Elementen](/guide/migration#extended-support-of-asset-references-in-html-elements)
- [postcss-load-config](/guide/migration#postcss-load-config)
- [Sass verwendet jetzt standardmäßig eine moderne API](/guide/migration#sass-now-uses-modern-api-by-default)
- [Anpassen des CSS-Ausgabedateinamens im Bibliotheksmodus](/guide/migration#customize-css-output-file-name-in-library-mode)
- [Und weitere Änderungen, die nur wenige Benutzer betreffen sollten](/guide/migration#advanced)

Es gibt auch eine neue Seite mit [wichtigen Änderungen](https://vite.dev/changes/), auf der alle geplanten, in Betracht gezogenen und vergangenen Änderungen in Vite aufgelistet sind.

## Migration zu Vite 6

Für die meisten Projekte sollte das Update auf Vite 6 unkompliziert sein, wir empfehlen jedoch, vor dem Upgrade die [ausführliche Migrationsanleitung](/guide/migration) zu lesen.

Die vollständige Liste der Änderungen finden Sie im [Vite 6-Änderungsprotokoll](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2024-11-26).

## Danksagungen

Vite 6 ist das Ergebnis langer Arbeitsstunden unserer Community aus Mitwirkenden, Downstream-Maintainern, Plugin-Autoren und dem [Vite-Team](/team). Wir danken den Personen und Unternehmen, die die Entwicklung von Vite sponsern. Vite wird Ihnen von [VoidZero](https://voidzero.dev) in Zusammenarbeit mit [StackBlitz](https://stackblitz.com/), [Nuxt Labs](https://nuxtlabs.com/) und [Astro](https://astro.build) zur Verfügung gestellt. Ein großes Dankeschön an die Sponsoren auf [Vites GitHub Sponsors](https://github.com/sponsors/vitejs) und [Vites Open Collective](https://opencollective.com/vite).
