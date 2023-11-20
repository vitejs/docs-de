---
title: Vite 4.3 is out!
author:
  name: The Vite Team
date: 2023-04-20
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 4.3
  - - meta
    - property: og:image
      content: https://vitejs.dev/og-image-announcing-vite4-3.png
  - - meta
    - property: og:url
      content: https://vitejs.dev/blog/announcing-vite4-3
  - - meta
    - property: og:description
      content: Vite 4.3 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 4.3 ist da!

_20. April 2023_

![Vite 4.3 Announcement Cover Image](/og-image-announcing-vite4-3.png)

Schnellzugriffe:

- Dokumentationen: [Englisch](/), [简体中文](https://cn.vitejs.dev/), [日本語](https://ja.vitejs.dev/), [Español](https://es.vitejs.dev/), [Português](https://pt.vitejs.dev/)
- [Vite 4.3 Änderungsprotokoll](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#430-2023-04-20)

## Leistungsverbesserungen

In diesem Update haben wir uns darauf konzentriert, die Leistung des Entwicklungsservers zu verbessern. Die Auflösungslogik wurde optimiert, wodurch Hot Paths verbessert und intelligenteres Caching für das Auffinden von `package.json`, TS-Konfigurationsdateien und allgemein aufgelösten URLs implementiert wurde.

Eine ausführliche Übersicht über die in diesem Blogbeitrag eines Vite-Mitwirkenden durchgeführten Leistungsarbeiten finden Sie hier: [Wie wir Vite 4.3 schneller gemacht haben 🚀](https://sun0day.github.io/blog/vite/why-vite4_3-is-faster.html).

Dieser Entwicklungssprint führte zu Geschwindigkeitsverbesserungen in allen Bereichen im Vergleich zu Vite 4.2.

Dies sind die Leistungsverbesserungen, wie sie von [sapphi-red/performance-compare](https://github.com/sapphi-red/performance-compare) gemessen wurden, das eine App mit 1000 React-Komponenten auf Kalt- und Warmstartzeit des Entwicklungsservers sowie HMR-Zeiten für eine Root- und eine Leaf-Komponente testet:

| **Vite (babel)**   |  Vite 4.2 | Vite 4.3 | Improvement |
| :----------------- | --------: | -------: | ----------: |
| **dev cold start** | 17249.0ms | 5132.4ms |      -70.2% |
| **dev warm start** |  6027.8ms | 4536.1ms |      -24.7% |
| **Root HMR**       |    46.8ms |   26.7ms |      -42.9% |
| **Leaf HMR**       |    27.0ms |   12.9ms |      -52.2% |

| **Vite (swc)**     |  Vite 4.2 | Vite 4.3 | Improvement |
| :----------------- | --------: | -------: | ----------: |
| **dev cold start** | 13552.5ms | 3201.0ms |      -76.4% |
| **dev warm start** |  4625.5ms | 2834.4ms |      -38.7% |
| **Root HMR**       |    30.5ms |   24.0ms |      -21.3% |
| **Leaf HMR**       |    16.9ms |   10.0ms |      -40.8% |

![Vite 4.3 vs 4.2 startup time comparison](/vite4-3-startup-time.png)

![Vite 4.3 vs 4.2 HMR time comparison](/vite4-3-hmr-time.png)

Mehr Informationen zu diesem Benchmark finden Sie [hier](https://gist.github.com/sapphi-red/25be97327ee64a3c1dce793444afdf6e). Spezifikationen und Versionen für diesen Leistungstest:

- CPU: Ryzen 9 5900X, Speicher: DDR4-3600 32GB, SSD: WD Blue SN550 NVME SSD
- Windows 10 Pro 21H2 19044.2846
- Node.js 18.16.0
- Vite- und React-Plugin-Versionen
  - Vite 4.2 (babel): Vite 4.2.1 + plugin-react 3.1.0
  - Vite 4.3 (babel): Vite 4.3.0 + plugin-react 4.0.0-beta.1
  - Vite 4.2 (swc): Vite 4.2.1 + plugin-react-swc 3.2.0
  - Vite 4.3 (swc): Vite 4.3.0 + plugin-react-swc 3.3.0

Frühzeitige Anwender haben auch berichtet, dass sie eine Verbesserung der Entwicklungsstartzeit von 1,5x-2x bei echten Apps beim Testen der Vite 4.3 Beta festgestellt haben. Wir würden gerne die Ergebnisse für Ihre Apps erfahren.

## Profiling

Wir werden weiterhin an der Leistung von Vite arbeiten. Wir arbeiten an einem offiziellen [Benchmark-Tool](https://github.com/vitejs/vite-benchmark) für Vite, das es uns ermöglicht, Leistungsmetriken für jeden Pull Request zu erhalten.

Und [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) verfügt jetzt über weitere leistungsbezogene Funktionen, um Ihnen dabei zu helfen, herauszufinden, welche Plugins oder Middleware für Ihre Anwendungen den Flaschenhals darstellen.

Durch Verwenden von `vite --profile` (und dann Drücken von `p`) nach dem Laden der Seite wird ein CPU-Profil des Startvorgangs des Entwicklungsservers gespeichert. Sie können sie in einer Anwendung wie [speedscope](https://www.speedscope.app/) öffnen, um Leistungsprobleme zu identifizieren. Und Sie können Ihre Erkenntnisse mit dem Vite-Team in einer [Diskussion](https://github.com/vitejs/vite/discussions) oder im [Vite-Discord](https://chat.vitejs.dev) teilen.

## Nächste Schritte

Wir haben uns entschieden, in diesem Jahr nur eine Vite-Major-Version herauszubringen, die mit dem [Ende des Lebenszyklus von Node.js 16](https://endoflife.date/nodejs) im September übereinstimmt, und die Unterstützung für Node.js 14 und 16 in dieser Version fallen zu lassen. Wenn Sie sich beteiligen möchten, haben wir eine [Diskussion zu Vite 5](https://github.com/vitejs/vite/discussions/12466) gestartet, um frühzeitiges Feedback zu sammeln.
