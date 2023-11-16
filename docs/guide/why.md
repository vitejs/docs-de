# Wieso Vite?

## Die Problematiken

Bevor ES-Module in Browsern verfügbar waren, hatten Entwickler:innen keinen nativen Mechanismus für die Erstellung von JavaScript in einer modularisierten Weise. Aus diesem Grund sind wir alle mit dem Konzept der "Bündelung" vertraut: Wir verwenden Tools, die unsere Quellmodule crawlen, verarbeiten und zu Dateien zusammenfügen, die im Browser ausgeführt werden können.

Im Laufe der Zeit haben wir Tools wie [webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org) und [Parcel](https://parceljs.org/) gesehen, die die Entwicklungserfahrung für Frontend-Entwickler erheblich verbessert haben.

Da wir jedoch immer anspruchsvollere Anwendungen entwickeln, nimmt auch die Menge an JavaScript, mit der wir zu tun haben, drastisch zu. Es ist nicht ungewöhnlich, dass große Projekte Tausende von Modulen enthalten. Wir stoßen allmählich auf einen Leistungsengpass für JavaScript-basierte Tools: Es kann oft unangemessen lange dauern (manchmal sogar bis zu einigen Minuten!), bis ein Entwicklungsserver hochgefahren ist, und selbst mit Hot Module Replacement (HMR) kann es einige Sekunden dauern, bis Dateibearbeitungen im Browser angezeigt werden. Diese langsame Feedbackschleife kann die Produktivität und Zufriedenheit der Entwickler stark beeinträchtigen.

Vite zielt darauf ab, diese Probleme zu lösen, indem es neue Fortschritte im Ökosystem nutzt: die Verfügbarkeit von nativen ES-Modulen im Browser und das Aufkommen von JavaScript-Tools, die in Compile-to-Native-Sprachen geschrieben sind.

### Langsamer Start des Servers

Beim "Kaltstart" des Entwicklungsservers muss ein Bundler-basiertes Build-Setup Ihre gesamte Anwendung eifrig crawlen und bauen, bevor sie bereitgestellt werden kann.

Vite verbessert die Startzeit des Entwicklungsservers, indem es zunächst die Module einer Anwendung in zwei Kategorien unterteilt: **Abhängigkeiten** und **Quellcode**.

- **Abhängigkeiten** sind meist einfaches JavaScript, das sich während der Entwicklung nicht oft ändert. Einige große Abhängigkeiten (z. B. Komponentenbibliotheken mit Hunderten von Modulen) sind auch recht teuer in der Verarbeitung. Abhängigkeiten können auch in verschiedenen Modulformaten ausgeliefert werden (z. B. ESM oder CommonJS).

  Vite [bündelt Abhängigkeiten](./dep-pre-bundling) mit [esbuild](https://esbuild.github.io/). Esbuild ist in Go geschrieben und bündelt Abhängigkeiten 10-100x schneller als JavaScript-basierte Bundler.

- Der **Quellcode** enthält oft Nicht-Plain-JavaScript, das umgewandelt werden muss (z. B. JSX, CSS oder Vue/Svelte-Komponenten), und wird sehr oft bearbeitet werden. Außerdem muss nicht der gesamte Quellcode gleichzeitig geladen werden (z. B. bei routenbasiertem Code-Splitting).

  Vite liefert den Quellcode über [native ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). Dies bedeutet im Wesentlichen, dass der Browser einen Teil der Arbeit eines Bundlers übernehmen kann: Vite muss den Quellcode nur bei Bedarf transformieren und bereitstellen, wenn der Browser ihn anfordert. Code hinter bedingten dynamischen Importen wird nur verarbeitet, wenn er tatsächlich auf dem aktuellen Bildschirm verwendet wird.

<script setup>
import bundlerSvg from '../images/bundler.svg?raw'
import esmSvg from '../images/esm.svg?raw'
</script>
<svg-image :svg="bundlerSvg" />
<svg-image :svg="esmSvg" />

### Langsame Aktualisierung

Wenn eine Datei in einem Bundler-basierten Build-Setup bearbeitet wird, ist es aus einem offensichtlichen Grund ineffizient, das gesamte Bundle neu zu erstellen: Die Aktualisierungsgeschwindigkeit nimmt linear mit der Größe der Anwendung ab.

Bei einigen Bundlern führt der Entwicklungsserver die Bündelung im Speicher aus, so dass er nur einen Teil seines Modulgraphen ungültig machen muss, wenn sich eine Datei ändert, aber er muss trotzdem das gesamte Bundle neu aufbauen und die Webseite neu laden. Die Rekonstruktion des Bundles kann teuer sein, und das Neuladen der Seite macht den aktuellen Zustand der Anwendung zunichte. Aus diesem Grund unterstützen einige Bundler Hot Module Replacement (HMR), d. h. ein Modul kann im laufenden Betrieb ersetzt werden, ohne dass der Rest der Seite beeinträchtigt wird. Dies verbessert die DX (Developer-Experience, zu deutsch "Entwickler-Erfahrung") erheblich - in der Praxis haben wir jedoch festgestellt, dass selbst die HMR-Aktualisierungsgeschwindigkeit mit zunehmender Größe der Anwendung erheblich abnimmt.

In Vite wird die HMR über das native ESM durchgeführt. Wenn eine Datei bearbeitet wird, muss Vite nur die Kette zwischen dem bearbeiteten Modul und der nächstgelegenen HMR-Grenze (meistens nur das Modul selbst) genau ungültig machen, wodurch HMR-Aktualisierungen unabhängig von der Größe Ihrer Anwendung gleichbleibend schnell sind.

Vite nutzt auch HTTP-Header, um das Neuladen ganzer Seiten zu beschleunigen (auch hier soll der Browser mehr Arbeit für uns erledigen): Quellcode-Modulanfragen werden über `304 Not Modified` an Bedingungen geknüpft, und Abhängigkeitsmodulanfragen werden über `Cache-Control: max-age=31536000,immutable` zwischengespeichert, so dass sie nach dem Zwischenspeichern nicht erneut auf den Server zugreifen.

Wenn Sie einmal erlebt haben, wie schnell Vite ist, werden Sie sich wohl kaum noch mit gebündelter Entwicklung abfinden wollen.

## Warum für die produktive Umgebung bündeln

Auch wenn natives ESM inzwischen weitgehend unterstützt wird, ist die Auslieferung von ungebündeltem ESM in der produktive Umgebung immer noch ineffizient (selbst mit HTTP/2), da durch verschachtelte Importe zusätzliche Netzwerkumläufe verursacht werden. Um eine optimale Ladeleistung in der produktiven Umgebung zu erreichen, ist es immer noch besser, Ihren Code mit Tree-Shaking, Lazy-Loading und Common Chunk Splitting (für besseres Caching) zu bündeln.

Es ist nicht einfach, eine optimale Ausgabe und Verhaltenskonsistenz zwischen dem Entwicklungsserver und dem produktiven Build zu gewährleisten. Aus diesem Grund wird Vite mit einem vorkonfigurierten [Build-Befehl](./build) ausgeliefert, der viele [Leistungsoptimierungen](./features#build-optimizations) von Haus aus einbaut.

## Warum nicht mit esbuild bündeln?

Die aktuelle Plugin-API von Vite ist nicht mit der Verwendung von `esbuild` als Bundler kompatibel. Obwohl `esbuild` schneller ist, hat die Übernahme der flexiblen Plugin-API und -Infrastruktur von Rollup wesentlich zum Erfolg von Vite im Ökosystem beigetragen. Im Moment glauben wir, dass Rollup einen besseren Kompromiss zwischen Leistung und Flexibilität bietet.

Rollup hat auch an Leistungsverbesserungen gearbeitet, [Umstellung des Parsers auf SWC in v4](https://github.com/rollup/rollup/pull/5073); währenddessen gibt es auch ein ständiges Bestreben, eine Rust-Portierung von Rollup namens Rolldown zu entwickeln. Sobald Rolldown fertig ist, könnte es sowohl Rollup als auch esbuild in Vite ersetzen, die Build-Leistung erheblich verbessern und Inkonsistenzen zwischen Entwicklung und Build beseitigen. Sie können sich [Evan You's ViteConf 2023 Keynote für weitere Details](https://youtu.be/hrdwQHoAp0M) ansehen.

## Wie unterscheidet sich Vite von X?

Im Abschnitt [Vergleiche](./comparisons) finden Sie weitere Einzelheiten darüber, wie sich Vite von anderen ähnlichen Tools unterscheidet.
