---
title: Announcing Vite 2.0
author:
  - name: The Vite Team
sidebar: false
date: 2021-02-16
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 2.0
  - - meta
    - property: og:url
      content: https://vitejs.dev/blog/announcing-vite2
  - - meta
    - property: og:description
      content: Vite 2 Release Announcement
---

# Ankündigung von Vite 2.0

_16. Februar 2021_ - Lesen Sie die [Ankündigung von Vite 3.0](./announcing-vite3.md)

<p style="text-align:center">
  <img src="/logo.svg" style="height:200px">
</p>

Wir freuen uns, heute die offizielle Veröffentlichung von Vite 2.0 bekannt geben zu können!

Vite (französisches Wort für "schnell", ausgesprochen `/vit/`) ist eine neue Art von Build-Tool für die Frontend-Webentwicklung. Denken Sie an eine vorkonfigurierte Dev-Server + Bundler-Kombination, aber schlanker und schneller. Es nutzt die Unterstützung des Browsers [native ES-Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) und Werkzeuge, die in nativen Sprachen wie [esbuild](https://esbuild.github.io/) geschrieben sind, um eine schnelle und moderne Entwicklungserfahrung zu bieten.

Um ein Gefühl dafür zu bekommen, wie schnell Vite ist, sehen Sie sich [dieses Vergleichsvideo](https://twitter.com/amasad/status/1355379680275128321) an, in dem das Hochfahren einer React-Anwendung auf Repl.it mit Vite im Vergleich zu `create-react-app` (CRA) gezeigt wird.

Wenn Sie noch nie von Vite gehört haben und gerne mehr darüber erfahren möchten, lesen Sie [die Gründe für das Projekt](https://vitejs.dev/guide/why.html). Wenn Sie sich dafür interessieren, wie sich Vite von anderen ähnlichen Tools unterscheidet, sehen Sie sich die [Vergleiche](https://vitejs.dev/guide/comparisons.html) an.

## Was ist neu in 2.0

Da wir uns entschlossen haben, die Interna komplett zu überarbeiten, bevor 1.0 aus dem RC herauskam, ist dies tatsächlich die erste stabile Version von Vite. Nichtsdestotrotz bringt Vite 2.0 viele große Verbesserungen gegenüber der vorherigen Version mit sich:

### Framework-Agnostischer Kern

Die ursprüngliche Idee von Vite begann als [hacky prototype that serves Vue single-file components over native ESM](https://github.com/vuejs/vue-dev-server). Vite 1 war eine Fortsetzung dieser Idee mit HMR obenauf implementiert.

Vite 2.0 basiert auf dem, was wir auf unserem Weg gelernt haben, und wurde von Grund auf mit einer robusteren internen Architektur neu entwickelt. Es ist jetzt völlig unabhängig von Frameworks, und alle Framework-spezifische Unterstützung wird an Plugins delegiert. Es gibt jetzt [offizielle Templates für Vue, React, Preact, Lit Element](https://github.com/vitejs/vite/tree/main/packages/create-vite), und laufende Community-Bemühungen für die Integration von Svelte.

### Neues Plugin-Format und API

Inspiriert von [WMR](https://github.com/preactjs/wmr), erweitert das neue Plugin-System die Plugin-Schnittstelle von Rollup und ist [kompatibel mit vielen Rollup-Plugins](https://vite-rollup-plugins.patak.dev/) von Haus aus. Plugins können Rollup-kompatible Hooks verwenden, mit zusätzlichen Vite-spezifischen Hooks und Eigenschaften, um das Verhalten von Vite anzupassen (z.B. die Unterscheidung von dev vs. build oder die benutzerdefinierte Handhabung von HMR).

Die [programmatische API](https://vitejs.dev/guide/api-javascript.html) wurde ebenfalls stark verbessert, um die Entwicklung von Tools/Frameworks auf höherer Ebene zu erleichtern, die auf Vite aufbauen.

### esbuild-angetriebene Vorbündelung von Abhängigkeiten

Da Vite ein nativer ESM-Entwicklungsserver ist, werden Abhängigkeiten vorgebündelt, um die Anzahl der Browseranfragen zu reduzieren und die Konvertierung von CommonJS in ESM zu bewältigen. Früher tat Vite dies mit Rollup, und in 2.0 verwendet es nun `esbuild`, was zu einer 10-100x schnelleren Vorbündelung von Abhängigkeiten führt. Als Referenz: Der Kaltstart einer Testanwendung mit starken Abhängigkeiten wie React Material UI dauerte früher 28 Sekunden auf einem MacBook Pro mit M1-Power und dauert jetzt nur noch ~1,5 Sekunden. Erwarten Sie ähnliche Verbesserungen, wenn Sie von einem traditionellen Bundler-basierten Setup wechseln.

### Erstklassige CSS-Unterstützung

Vite behandelt CSS als einen Bürger erster Klasse des Modulgraphen und unterstützt die folgenden Funktionen von Haus aus:

- **Resolver enhancement**: Die `@import` und `url()` Pfade in CSS wurden mit dem Resolver von Vite erweitert, um Aliase und npm-Abhängigkeiten zu berücksichtigen.
- **URL rebasing**: `url()` Pfade werden automatisch neu berechnet, unabhängig davon, woher die Datei importiert wird.
- **CSS code splitting**: ein Code-Split-JS-Chunk gibt auch eine entsprechende CSS-Datei aus, die bei Anforderung automatisch parallel zum JS-Chunk geladen wird.

### Unterstützung für serverseitiges Rendering (SSR)

Vite 2.0 wird mit [experimenteller SSR-Unterstützung](https://vitejs.dev/guide/ssr.html) ausgeliefert. Vite bietet APIs zum effizienten Laden und Aktualisieren von ESM-basiertem Quellcode in Node.js während der Entwicklung (fast wie serverseitiges HMR) und externalisiert automatisch CommonJS-kompatible Abhängigkeiten, um die Entwicklungs- und SSR-Build-Geschwindigkeit zu verbessern. Der Produktionsserver kann vollständig von Vite entkoppelt werden, und das gleiche Setup kann leicht angepasst werden, um Pre-Rendering / SSG durchzuführen.

Vite SSR wird als Low-Level-Feature bereitgestellt und wir erwarten, dass Frameworks auf höherer Ebene es unter der Haube nutzen werden.

### Opt-in-Unterstützung für ältere Browser

Vite zielt standardmäßig auf moderne Browser mit nativer ESM-Unterstützung ab, aber Sie können sich auch für die Unterstützung von Legacy-Browsern über das offizielle [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) entscheiden. Das Plugin generiert automatisch duale Modern/Legacy-Bundles und liefert das richtige Bundle basierend auf der Erkennung von Browser-Funktionen, um effizienteren Code in modernen Browsern, die diese unterstützen, zu gewährleisten.

## Probieren Sie es aus!

Das war eine Menge an Funktionen, aber der Einstieg in Vite ist einfach! Sie können eine mit Vite betriebene App buchstäblich in einer Minute aufsetzen, indem Sie mit dem folgenden Befehl beginnen (stellen Sie sicher, dass Sie Node.js >=12 haben):

```bash
npm init @vitejs/app
```

Schauen Sie sich dann [die Anleitung](https://vitejs.dev/guide/) an, um zu sehen, was Vite alles bietet. Du kannst dir auch den Quellcode auf [GitHub](https://github.com/vitejs/vite) ansehen, Updates auf [Twitter](https://twitter.com/vite_js) verfolgen oder an Diskussionen mit anderen Vite-Benutzern auf unserem [Discord-Chat-Server](http://chat.vitejs.dev/) teilnehmen.
