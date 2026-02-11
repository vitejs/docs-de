---
title: Vite 7.0 is out!
author:
  name: The Vite Team
date: 2025-06-24
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 7
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite7.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite7
  - - meta
    - property: og:description
      content: Vite 7 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 7.0 ist da!

_24. Juni 2025_

![Titelbild zur Ankündigung von Vite 7](/og-image-announcing-vite7.webp)

Wir freuen uns, die Veröffentlichung von Vite 7 bekannt zu geben! Es ist nun 5 Jahre her, seit Evan You den ersten Commit an das Vite-Repo gesendet hat, und niemand hätte vorhersagen können, wie sehr sich das Frontend-Ökosystem seitdem verändern würde. Die meisten modernen Frontend-Frameworks und -Tools arbeiten nun zusammen und bauen auf der gemeinsamen Infrastruktur von Vite auf. Durch den Austausch auf höherer Ebene können sie schneller innovativ sein. Vite wird mittlerweile 31 Millionen Mal pro Woche heruntergeladen, was einem Anstieg von 14 Millionen in den letzten sieben Monaten seit der letzten großen Veröffentlichung entspricht.

In diesem Jahr machen wir mehrere große Schritte. Zunächst einmal wird die [ViteConf](https://viteconf.org) als Präsenzveranstaltung stattfinden! Das Vite-Ökosystem trifft sich vom 9. bis 10. Oktober in Amsterdam! Organisiert von [JSWorld](https://jsworldconference.com/) in Zusammenarbeit mit [Bolt](https://bolt.new), [VoidZero](https://voidzero.dev) und dem Vite Core Team! Wir hatten drei unglaubliche [ViteConf-Online-Ausgaben](https://www.youtube.com/@viteconf/playlists) und können es kaum erwarten, uns persönlich zu treffen. Informieren Sie sich über die Referenten und sichern Sie sich Ihr Ticket auf der [ViteConf-Website](https://viteconf.org)!

Und [VoidZero](https://voidzero.dev/posts/announcing-voidzero-inc) macht weiterhin bedeutende Fortschritte bei seiner Mission, eine einheitliche Open-Source-Entwicklungs-Toolchain für das JavaScript-Ökosystem aufzubauen. Im letzten Jahr hat das VoidZero-Team an [Rolldown](https://rolldown.rs/) gearbeitet, einem Rust-basierten Bundler der nächsten Generation, als Teil einer umfassenderen Modernisierung des Vite-Kerns. Sie können das Rolldown-basierte Vite noch heute ausprobieren, indem Sie das Paket `rolldown-vite` anstelle des Standardpakets `vite` verwenden. Es handelt sich um einen Drop-in-Ersatz, da Rolldown in Zukunft der Standard-Bundler für Vite werden wird. Der Wechsel sollte Ihre Build-Zeit verkürzen, insbesondere bei größeren Projekten. Weitere Informationen finden Sie im [Blogbeitrag zur Ankündigung von Rolldown-vite](https://voidzero.dev/posts/announcing-rolldown-vite) und in unserem [Migrationsleitfaden](https://vite.dev/rolldown).

Im Rahmen einer Partnerschaft zwischen VoidZero und [NuxtLabs](https://nuxtlabs.com/) arbeitet Anthony Fu an der Entwicklung von Vite DevTools. Diese werden eine tiefere und aufschlussreichere Debugging- und Analysefunktion für alle Vite-basierten Projekte und Frameworks bieten. Weitere Informationen finden Sie im [Blogbeitrag `VoidZero und NuxtLabs schließen sich für Vite Devtools zusammen`](https://voidzero.dev/posts/voidzero-nuxtlabs-vite-devtools).

Schnellzugriff:

- [Dokumente](/)
- Neue Übersetzung: [فارسی](https://fa.vite.dev/)
- Weitere Übersetzungen: [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/)
- [Migrationsanleitung](/guide/migration)
- [GitHub-Änderungsprotokoll](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

Spielen Sie online mit Vite 7 unter Verwendung von [vite.new](https://vite.new) oder erstellen Sie lokal eine Vite-App mit Ihrem bevorzugten Framework, indem Sie `pnpm create vite` ausführen. Weitere Informationen finden Sie im [Leitfaden für die ersten Schritte](/guide/).

Wir laden Sie ein, uns bei der Verbesserung von Vite (zusammen mit mehr als [1.100 Mitwirkenden an Vite Core](https://github.com/vitejs/vite/graphs/contributors)), unseren Abhängigkeiten oder Plugins und Projekten im Ökosystem zu unterstützen. Weitere Informationen finden Sie in unserem [Beitragsleitfaden](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md). Ein guter Einstieg ist das [Triage von Problemen](https://github.com/vitejs/vite/issues), das [Überprüfen von PRs](https://github.com/vitejs/vite/pulls), das Senden von Test-PRs auf der Grundlage offener Probleme und die Unterstützung anderer in [Diskussionen](https://github.com/vitejs/vite/discussions) oder im [Hilfeforum](https://discord.com/channels/804011606160703521/1019670660856942652) von Vite Land zu unterstützen. Wenn Sie Fragen haben, treten Sie unserer [Discord-Community](http://chat.vite.dev/) bei und sprechen Sie mit uns im [#contributing-Kanal](https://discord.com/channels/804011606160703521/804439875226173480).

Bleiben Sie auf dem Laufenden und vernetzen Sie sich mit anderen, die auf Vite aufbauen, indem Sie uns auf [Bluesky](https://bsky.app/profile/vite.dev), [X](https://twitter.com/vite_js) oder [Mastodon](https://webtoo.ls/@vite) folgen.

## Node.js-Unterstützung

Vite erfordert jetzt Node.js 20.19+ oder 22.12+. Wir haben Node.js 18 fallen gelassen, da es Ende April 2025 sein [EOL](https://endoflife.date/nodejs) erreicht hat.

Wir benötigen diese neuen Versionen, damit Node.js `require(esm)` ohne Flag unterstützt. Dadurch können wir Vite 7.0 nur als ESM vertreiben, ohne zu verhindern, dass die Vite-JavaScript-API von CJS-Modulen benötigt wird. In Anthony Fus [Move on to ESM-only](https://antfu.me/posts/move-on-to-esm-only) finden Sie eine detaillierte Übersicht über den aktuellen Stand von ESM im Ökosystem.

## Standard-Browserziel auf `Baseline Widely Available` geändert

[Baseline](https://web-platform-dx.github.io/web-features/) liefert uns klare Informationen darüber, welche Funktionen der Webplattform heute in den gängigen Browsern funktionieren. `Baseline Widely Available` bedeutet, dass die Funktion gut etabliert ist, auf vielen Geräten und in vielen Browserversionen funktioniert und seit mindestens 30 Monaten in allen Browsern verfügbar ist.

In Vite 7 ändert sich das Standard-Browserziel von `modules` zu einem neuen Standard: `baseline-widely-available`. Die Browserauswahl wird bei jeder größeren Version aktualisiert, um der Liste der Mindestbrowser-Versionen zu entsprechen, die mit den Funktionen von Baseline Widely Available kompatibel sind. Der Standard-Browserwert von `build.target` ändert sich in Vite 7.0:

- Chrome 87 → 107
- Edge 88 → 107
- Firefox 78 → 104
- Safari 14.0 → 16.0

Diese Änderung sorgt für mehr Vorhersehbarkeit hinsichtlich des Standard-Browserziels für zukünftige Releases.

## Vitest

Für Vitest-Benutzer wird Vite 7.0 ab Vitest 3.2 unterstützt. Weitere Informationen darüber, wie das Vitest-Team die Vite-Tests kontinuierlich verbessert, finden Sie im [Blogbeitrag zum Release von Vitest 3.2](https://vitest.dev/blog/vitest-3-2.html).

## Environment API

Vite 6 war die bedeutendste Hauptversion seit Vite 2 und fügte mit der [neuen experimentellen Environment API](https://vite.dev/blog/announcing-vite6.html#experimental-environment-api) neue Funktionen hinzu. Wir behalten die neuen APIs als experimentell bei, während das Ökosystem prüft, wie sich die neuen APIs in ihre Projekte einfügen, und Feedback gibt. Wenn Sie auf Vite aufbauen, empfehlen wir Ihnen, die neuen APIs zu testen und uns in der [offenen Feedback-Diskussion hier](https://github.com/vitejs/vite/discussions/16358) zu kontaktieren.

In Vite 7 haben wir einen neuen `buildApp`-Hook hinzugefügt, mit dem Plugins die Erstellung von Umgebungen koordinieren können. Weitere Informationen finden Sie im [Leitfaden zur Environment-API für Frameworks](/guide/api-environment-frameworks.html#environments-during-build).

Wir möchten uns bei den Teams bedanken, die die neuen APIs getestet und uns dabei geholfen haben, die neuen Funktionen zu stabilisieren. Das Cloudflare-Team hat beispielsweise die Version 1.0 seines Cloudflare-Vite-Plugins sowie die offizielle Unterstützung für React Router v7 angekündigt. Ihr Plugin zeigt das Potenzial der Environment API für Laufzeitanbieter. Erfahren Sie mehr über ihren Ansatz und die nächsten Schritte unter `Just use Vite`... mit der Workers-Laufzeitumgebung (https://blog.cloudflare.com/introducing-the-cloudflare-vite-plugin/).

## Migration zu Vite 7

Die Migration von Vite 6 zu Vite 7 sollte reibungslos verlaufen. Wir entfernen bereits veraltete Funktionen wie die Unterstützung der alten Sass-API und das `splitVendorChunkPlugin`, was jedoch keine Auswirkungen auf Ihre Projekte haben sollte. Wir empfehlen Ihnen dennoch, vor dem Upgrade die [ausführliche Migrationsanleitung](/guide/migration) durchzulesen.

Die vollständige Liste der Änderungen finden Sie im [Vite 7-Änderungsprotokoll](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md).

## Danksagungen

Vite 7 wurde vom [Vite-Team](/team) mit Unterstützung einer großen Community aus Mitwirkenden, Downstream-Maintainern und Plugin-Autoren entwickelt. Ein besonderer Dank geht an [sapphi-red](https://github.com/sapphi-red) für seine bemerkenswerte Arbeit an `rolldown-vite` und dieser Version. Vite wird Ihnen von [VoidZero](https://voidzero.dev) in Zusammenarbeit mit [Bolt](https://bolt.new/) und [Nuxt Labs](https://nuxtlabs.com/) zur Verfügung gestellt. Wir möchten uns auch bei unseren Sponsoren auf [Vites GitHub Sponsors](https://github.com/sponsors/vitejs) und [Vites Open Collective](https://opencollective.com/vite) bedanken.
