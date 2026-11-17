# Wieso Vite?

Mit der wachsenden Größe und Komplexität von Webanwendungen konnten die Tools, mit denen sie gebaut werden, kaum Schritt halten. Entwickler:innen großer Projekte kennen quälend langsame Starts des Entwicklungsservers, träge Hot Updates und lange Build-Zeiten für die Produktion. Jede Generation von Build-Tools hat die vorherige verbessert, doch diese Probleme blieben bestehen.

Vite wurde geschaffen, um genau das zu lösen. Statt bestehende Ansätze schrittweise zu verbessern, hat Vite neu gedacht, wie Code während der Entwicklung ausgeliefert werden sollte. Seitdem hat sich Vite über mehrere Major-Versionen weiterentwickelt und sich jedes Mal an neue Möglichkeiten im Ökosystem angepasst: von der Nutzung nativer ES-Module im Browser bis hin zu einer vollständig in Rust geschriebenen Toolchain.

Heute bildet Vite die Grundlage vieler Frameworks und Tools. Die Architektur ist darauf ausgelegt, sich mit der Webplattform weiterzuentwickeln, statt sich auf einen einzelnen Ansatz festzulegen. So ist Vite ein Fundament, auf das Sie langfristig bauen können.

## Die Ursprünge

Als Vite entstand, hatten Browser gerade breite Unterstützung für [ES-Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) (ESM) erhalten – eine Möglichkeit, JavaScript-Dateien direkt zu laden, ohne sie vorher mit einem Tool zu einer einzigen Datei zu bündeln. Klassische Build-Tools (oft _Bundler_ genannt) verarbeiteten die gesamte Anwendung im Voraus, bevor überhaupt etwas im Browser angezeigt werden konnte. Je größer die App, desto länger die Wartezeit.

Vite wählte einen anderen Ansatz und teilte die Arbeit in zwei Teile:

- **Abhängigkeiten** (Bibliotheken, die sich selten ändern) werden einmalig mit schnellen nativen Tools [vorgebündelt](./dep-pre-bundling.md) und stehen so sofort bereit.
- **Quellcode** (Ihr Anwendungscode, der sich häufig ändert) wird bei Bedarf über natives ESM ausgeliefert. Der Browser lädt nur, was er für die aktuelle Seite braucht, und Vite transformiert jede Datei erst, wenn sie angefordert wird.

Dadurch startete der Entwicklungsserver nahezu sofort – unabhängig von der Größe der Anwendung. Wurde eine Datei bearbeitet, aktualisierte Vite per [Hot Module Replacement](./features.md#hot-module-replacement) (HMR) über natives ESM genau dieses Modul im Browser, ohne die Seite komplett neu zu laden oder auf einen Rebuild zu warten.

<script setup>
import bundlerSvg from '../images/bundler.svg?raw'
import esmSvg from '../images/esm.svg?raw'
</script>
<svg-image :svg="bundlerSvg" />

_Bei einem Bundle-basierten Entwicklungsserver wird die gesamte Anwendung gebündelt, bevor sie ausgeliefert werden kann._

<svg-image :svg="esmSvg" />

_Bei einem ESM-basierten Entwicklungsserver werden Module bei Bedarf ausgeliefert, sobald der Browser sie anfordert._

Vite war nicht das erste Tool, das diesen Ansatz verfolgte. [Snowpack](https://www.snowpack.dev/) war Vorreiter der ungebündelten Entwicklung und inspirierte Vites Vorab-Bündelung von Abhängigkeiten. [WMR](https://github.com/preactjs/wmr) vom Preact-Team inspirierte die universelle Plugin-API, die sowohl in der Entwicklung als auch beim Build funktioniert. [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) beeinflusste die Serverarchitektur von Vite 1.0. Vite hat auf diesen Ideen aufgebaut und sie weitergeführt.

Auch wenn ungebündeltes ESM in der Entwicklung gut funktioniert, ist seine Auslieferung in der Produktion durch zusätzliche Netzwerk-Roundtrips bei verschachtelten Importen weiterhin ineffizient. Deshalb ist [Bündeln für optimierte Produktions-Builds nach wie vor notwendig](https://rolldown.rs/in-depth/why-bundlers).

## Wachsen mit dem Ökosystem

Mit zunehmender Reife von Vite begannen Frameworks, es als Build-Schicht einzusetzen. Die [Plugin-API](./api-plugin.md), die auf den Konventionen von Rollup basiert, machte die Integration naheliegend, ohne dass Frameworks Vites Interna umgehen mussten. [Nuxt](https://nuxt.com/), [SvelteKit](https://svelte.dev/docs/kit), [Astro](https://astro.build/), [React Router](https://reactrouter.com/), [Analog](https://analogjs.org/), [SolidStart](https://start.solidjs.com/) und andere haben Vite als Fundament gewählt. Tools wie [Vitest](https://vitest.dev/) und [Storybook](https://storybook.js.org/) bauen ebenfalls darauf auf und erweitern Vites Reichweite über das Bündeln von Apps hinaus. Backend-Frameworks wie [Laravel](https://laravel.com/docs/vite) und [Ruby on Rails](https://vite-ruby.netlify.app/) haben Vite in ihre Frontend-Asset-Pipelines integriert.

Dieses Wachstum verlief nicht nur in eine Richtung. Das Ökosystem hat Vite ebenso geprägt wie Vite das Ökosystem. Das Vite-Team betreibt [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci), das wichtige Projekte des Ökosystems gegen jede Änderung an Vite testet. Die Gesundheit des Ökosystems ist kein nachträglicher Gedanke, sondern Teil des Release-Prozesses.

## Eine einheitliche Toolchain

Ursprünglich setzte Vite unter der Haube auf zwei getrennte Tools: [esbuild](https://esbuild.github.io/) für schnelles Kompilieren während der Entwicklung und [Rollup](https://rollupjs.org/) für gründliche Optimierung bei Produktions-Builds. Das funktionierte, doch die Pflege zweier Pipelines brachte Inkonsistenzen mit sich: unterschiedliches Transformationsverhalten, getrennte Plugin-Systeme und wachsender Glue-Code, um beides in Einklang zu halten.

[Rolldown](https://rolldown.rs/) wurde entwickelt, um beides in einem einzigen Bundler zu vereinen: in Rust geschrieben für native Geschwindigkeit und kompatibel mit derselben Plugin-API, auf die sich das Ökosystem bereits verließ. Für Parsen, Transformieren und Minifizieren nutzt es [Oxc](https://oxc.rs/). Damit verfügt Vite über eine durchgängige Toolchain, bei der Build-Tool, Bundler und Compiler gemeinsam gepflegt werden und sich als Einheit weiterentwickeln.

Das Ergebnis ist eine konsistente Pipeline von der Entwicklung bis zur [Produktion](./build.md). Die Migration erfolgte mit Bedacht: Zuerst wurde eine [Technical Preview](https://voidzero.dev/posts/announcing-rolldown-vite) veröffentlicht, damit Early Adopters die Änderung prüfen konnten, das Ecosystem-CI deckte Kompatibilitätsprobleme frühzeitig auf, und eine Kompatibilitätsschicht erhielt bestehende Konfigurationen.

## Wohin sich Vite entwickelt

Die Architektur von Vite entwickelt sich stetig weiter. Mehrere Vorhaben prägen die Zukunft:

- **Full-Bundle-Modus**: Ungebündeltes ESM war der richtige Kompromiss, als Vite entstand, denn kein Tool war schnell genug und bot zugleich die HMR- und Plugin-Fähigkeiten, um während der Entwicklung zu bündeln. Rolldown ändert das. Da außergewöhnlich große Codebasen durch die vielen ungebündelten Netzwerkanfragen langsam laden können, erforscht das Team einen Modus, in dem der Entwicklungsserver Code ähnlich wie in der Produktion bündelt und so den Netzwerk-Overhead reduziert.

- **Environment API**: Statt „Client“ und „SSR“ als einzige Build-Ziele zu behandeln, ermöglicht die [Environment API](./api-environment-instances.md) Frameworks, eigene Umgebungen zu definieren (Edge-Runtimes, Service Worker und andere Deployment-Ziele), jeweils mit eigenen Regeln für Modulauflösung und Ausführung. Je vielfältiger wird, wo und wie Code läuft, desto mehr wächst Vites Modell mit.

- **Weiterentwicklung mit JavaScript**: Da Oxc und Rolldown eng mit Vite zusammenarbeiten, können neue Sprachfeatures und Standards schnell in der gesamten Toolchain übernommen werden, ohne auf Upstream-Abhängigkeiten warten zu müssen.

Vites Ziel ist nicht, das letzte Tool zu sein, sondern eines, das sich mit der Webplattform und mit den Entwickler:innen, die darauf bauen, stetig weiterentwickelt.
