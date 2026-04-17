---
title: 'Vite 8 Beta: The Rolldown-powered Vite'
author:
  name: The Vite Team
date: 2025-12-03
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 8 Beta
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite8-beta.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite8-beta
  - - meta
    - property: og:description
      content: Vite 8 Beta Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 8 Beta: Das von Rolldown angetriebene Vite

_3. Dezember 2025_

![Titelbild zur Ankündigung der Beta von Vite 8](/og-image-announcing-vite8-beta.webp)

TL;DR: Die erste Beta-Version von Vite 8, die auf [Rolldown](https://rolldown.rs/) basiert, ist jetzt verfügbar. Vite 8 liefert deutlich schnellere Produktions-Builds und eröffnet Möglichkeiten für zukünftige Verbesserungen. Sie können die neue Version ausprobieren, indem Sie `vite` auf Version `8.0.0-beta.0` aktualisieren und den [Migrationsleitfaden](/guide/migration) lesen.

---

Wir freuen uns, die erste Beta-Version von Vite 8 zu veröffentlichen. Diese Version vereinheitlicht die zugrunde liegende Toolchain und sorgt für ein konsistenteres Verhalten sowie erhebliche Verbesserungen bei der Build-Leistung. Vite verwendet nun [Rolldown](https://rolldown.rs/) als Bundler und ersetzt damit die bisherige Kombination aus esbuild und Rollup.

## Ein neuer Bundler für das Web

Bisher stützte sich Vite auf zwei Bundler, um den unterschiedlichen Anforderungen von Entwicklungs- und Produktions-Builds gerecht zu werden:

1. esbuild für schnelle Kompilierung während der Entwicklung
2. Rollup für das Bündeln, Chunking und Optimieren von Produktions-Builds

Dieser Ansatz ermöglicht es Vite, sich auf die Entwicklererfahrung und die Orchestrierung zu konzentrieren, anstatt das Parsen und Bündeln neu zu erfinden. Die Pflege zweier separater Bundling-Pipelines führte jedoch zu Inkonsistenzen: getrennte Transformationspipelines, unterschiedliche Plugin-Systeme und eine wachsende Menge an Glue-Code, um das Bundling-Verhalten zwischen Entwicklung und Produktion abzustimmen.

Um dies zu lösen, hat das [VoidZero-Team](https://voidzero.dev) **Rolldown** entwickelt, den Bundler der nächsten Generation, der in Vite zum Einsatz kommen soll. Er ist konzipiert für:

- **Leistung**: Rolldown ist in Rust geschrieben und läuft mit nativer Geschwindigkeit. Es erreicht das Leistungsniveau von esbuild und ist [**10–30× schneller als Rollup**](https://github.com/rolldown/benchmarks).
- **Kompatibilität**: Rolldown unterstützt dieselbe Plugin-API wie Rollup und Vite. Die meisten Vite-Plugins funktionieren mit Vite 8 sofort.
- **Weitere Funktionen**: Rolldown eröffnet Vite erweiterte Funktionen, darunter den vollständigen Bundle-Modus, eine flexiblere Steuerung der Chunk-Aufteilung, einen persistenten Cache auf Modulebene, Modulverbünde und vieles mehr.

## Vereinheitlichung der Toolchain

Die Auswirkungen des Wechsels des Bundlers bei Vite gehen über die reine Leistung hinaus. Bundler nutzen Parser, Resolver, Transformer und Minifier. Rolldown verwendet für diese Zwecke Oxc, ein weiteres Projekt unter der Leitung von VoidZero.

**Das macht Vite zum Einstiegspunkt in eine durchgängige Toolchain, die vom selben Team gepflegt wird: das Build-Tool (Vite), der Bundler (Rolldown) und der Compiler (Oxc).**

Diese Abstimmung gewährleistet ein einheitliches Verhalten über den gesamten Stack hinweg und ermöglicht es uns, neue Sprachspezifikationen schnell zu übernehmen und anzupassen, während sich JavaScript weiterentwickelt. Außerdem eröffnet sie eine Vielzahl von Verbesserungen, die zuvor mit Vite allein nicht möglich waren. So können wir beispielsweise die semantische Analyse von Oxc nutzen, um in Rolldown ein besseres Tree-Shaking durchzuführen.

## Wie Vite auf Rolldown umgestellt wurde

Die Umstellung auf ein Rolldown-basiertes Vite ist eine grundlegende Veränderung. Daher ging unser Team bewusst schrittweise vor, um die Umstellung ohne Einbußen bei der Stabilität oder der Kompatibilität mit dem Ökosystem umzusetzen.

Zunächst wurde ein separates `rolldown-vite`-Paket [als technische Vorschau veröffentlicht](https://voidzero.dev/posts/announcing-rolldown-vite). Dies ermöglichte es uns, mit entschlossenen Anwendern zusammenzuarbeiten, ohne die stabile Version von Vite zu beeinträchtigen. Diese profitierten von den Leistungssteigerungen durch Rolldown und lieferten gleichzeitig wertvolles Feedback. Highlights:

- Die Produktions-Build-Zeiten von Linear wurden von 46 Sekunden auf 6 Sekunden reduziert
- Mercedes-Benz.io verkürzte seine Build-Zeit um bis zu 38 %
- Beehiiv reduzierte seine Build-Zeit um 64 %

Als Nächstes richteten wir eine Testsuite ein, um wichtige Vite-Plugins anhand von `rolldown-vite` zu validieren. Dieser CI-Job half uns, Regressionen und Kompatibilitätsprobleme frühzeitig zu erkennen, insbesondere bei Frameworks und Meta-Frameworks wie SvelteKit, react-router und Storybook.

Zuletzt haben wir eine Kompatibilitätsschicht entwickelt, um Entwicklern die Umstellung von Rollup- und esbuild-Optionen auf die entsprechenden Rolldown-Optionen zu erleichtern.

Dadurch steht nun für alle ein reibungsloser Migrationspfad zu Vite 8 zur Verfügung.

## Umstellung auf Vite 8 Beta

Da Vite 8 das Kernverhalten des Build-Prozesses betrifft, haben wir uns darauf konzentriert, die Konfigurations-API und die Plugin-Hooks unverändert zu lassen. Wir haben einen [Migrationsleitfaden](/guide/migration) erstellt, um euch bei der Umstellung zu unterstützen.

Es stehen zwei Upgrade-Pfade zur Verfügung:

1. **Direktes Upgrade:** Aktualisiert `vite` in `package.json` und führt die üblichen Entwicklungs- und Build-Befehle aus.
2. **Schrittweise Migration:** Migrieren Sie von Vite 7 zum `rolldown-vite`-Paket und anschließend zu Vite 8. So können Sie Inkompatibilitäten oder Probleme identifizieren, die ausschließlich Rolldown betreffen, ohne andere Änderungen an Vite vornehmen zu müssen. (Empfohlen für größere oder komplexe Projekte)

> [!IMPORTANT]
> Wenn Sie auf bestimmte Rollup- oder esbuild-Optionen angewiesen sind, müssen Sie möglicherweise einige Anpassungen an Ihrer Vite-Konfiguration vornehmen. Detaillierte Anweisungen und Beispiele finden Sie im [Migrationsleitfaden](/guide/migration).
> Wie bei allen nicht stabilen Hauptversionen wird nach dem Upgrade eine gründliche Testphase empfohlen, um sicherzustellen, dass alles wie erwartet funktioniert. Bitte melden Sie alle [Probleme](https://github.com/vitejs/rolldown-vite/issues).

## Zusätzliche Funktionen in Vite 8

Neben der Integration von Rolldown bietet Vite 8 folgende Funktionen:

- **Integrierte Unterstützung für tsconfig-`paths`:** Entwickler können diese Funktion aktivieren, indem sie [`resolve.tsconfigPaths`](/config/shared-options.md#resolve-tsconfigpaths) auf `true` setzen. Diese Funktion hat geringe Auswirkungen auf die Leistung und ist standardmäßig nicht aktiviert.
- **Unterstützung für `emitDecoratorMetadata`:** Vite 8 bietet nun integrierte automatische Unterstützung für die [`emitDecoratorMetadata`-Option](https://www.typescriptlang.org/tsconfig/#emitDecoratorMetadata) von TypeScript. Weitere Details finden Sie auf der Seite [Features](/guide/features.md#emitdecoratormetadata).

## Ausblick

Geschwindigkeit war schon immer ein charakteristisches Merkmal von Vite. Durch die Integration mit Rolldown und damit auch mit Oxc profitieren JavaScript-Entwickler von der Geschwindigkeit von Rust. Ein Upgrade auf Vite 8 dürfte allein durch den Einsatz von Rust zu Leistungssteigerungen führen.

Wir freuen uns außerdem darauf, in Kürze den vollständigen Bündelmodus von Vite zu veröffentlichen, der die Geschwindigkeit des Vite-Entwicklungsservers bei großen Projekten drastisch verbessert. Vorläufige Ergebnisse zeigen einen dreimal schnelleren Start des Entwicklungsservers, 40 % schnellere vollständige Neuladungen und zehnmal weniger Netzwerkanfragen.

Ein weiteres charakteristisches Merkmal von Vite ist das Plugin-Ökosystem. Wir möchten, dass JavaScript-Entwickler Vite weiterhin in JavaScript, der Sprache, mit der sie vertraut sind, erweitern und anpassen können, während sie gleichzeitig von den Leistungsvorteilen von Rust profitieren. Unser Team arbeitet mit dem VoidZero-Team zusammen, um die Nutzung von JavaScript-Plugins in diesen Rust-basierten Systemen zu beschleunigen.

Bevorstehende Optimierungen, die sich derzeit im experimentellen Stadium befinden:

- [**Rohe AST-Übertragung**](https://github.com/oxc-project/oxc/issues/2409). Ermöglicht JavaScript-Plugins den Zugriff auf den von Rust erzeugten AST mit minimalem Overhead.
- [**Native MagicString-Transformationen**](https://rolldown.rs/in-depth/native-magic-string#native-magicstring). Einfache benutzerdefinierte Transformationen mit Logik in JavaScript, aber Berechnung in Rust.

## **Nehmen Sie Kontakt mit uns auf**

Wenn Sie die Beta-Version von Vite 8 ausprobiert haben, würden wir uns sehr über Ihr Feedback freuen! Bitte melden Sie uns etwaige Probleme oder teilen Sie Ihre Erfahrungen mit:

- **Discord**: Treten Sie unserem [Community-Server](https://chat.vite.dev/) bei, um in Echtzeit mitzudiskutieren
- **GitHub**: Teilen Sie Ihr Feedback in den [GitHub-Diskussionen](https://github.com/vitejs/vite/discussions)
- **Issues**: Melden Sie Probleme im [rolldown-vite-Repository](https://github.com/vitejs/rolldown-vite/issues) für Bugs und Regressionen
- **Erfolge**: Teilen Sie Ihre verbesserten Build-Zeiten im [rolldown-vite-perf-wins-Repository](https://github.com/vitejs/rolldown-vite-perf-wins)

Wir freuen uns über alle Meldungen und Reproduktionsfälle. Sie helfen uns dabei, die Veröffentlichung einer stabilen Version 8.0.0 voranzutreiben.