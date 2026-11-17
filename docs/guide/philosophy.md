# Projekt-Philosophie

## Schlanker erweiterbarer Kern

Vite zielt darauf ab, die gängigsten Muster zur Erstellung von Webanwendungen von Anfang an zu unterstützen, und hält dabei [den Vite-Kern](https://github.com/vitejs/vite) schlank und langfristig wartbar. Wir glauben, dass sich vielfältige Anwendungsfälle am besten unterstützen lassen, indem wir starke Grundbausteine und APIs bereitstellen, auf denen Plugins aufbauen können, und wir erweitern den Kern aktiv, um Vite noch erweiterbarer zu machen. [Vites Plugin-System](./api-plugin.md) basiert auf einer Obermenge der Plugin-API von Rollup und ermöglicht Plugins wie [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) sowie die vielen [gut gewarteten Plugins](https://registry.vite.dev/plugins), die Ihre Bedürfnisse abdecken. Vites Bundler [Rolldown](https://rolldown.rs/) ist mit der Plugin-Schnittstelle von Rollup kompatibel, sodass Plugins oft sowohl in Vite- als auch in reinen Rollup-Projekten verwendet werden können.

## Förderung des modernen Webs

Vite bietet anspruchsvolle Funktionen, die das Schreiben modernen Codes vorantreiben. Beispielsweise:

- Der Quellcode kann nur in ESM geschrieben werden, wobei Nicht-ESM-Abhängigkeiten [pre-bundled as ESM](./dep-pre-bundling) sein müssen, um zu funktionieren.
- Web-Worker sollten mit der [`new Worker`-Syntax](./features#web-workers) geschrieben werden, um moderne Standards zu erfüllen.
- Node.js-Module können nicht im Browser verwendet werden.

Wenn neue Funktionen hinzugefügt werden, werden diese Muster befolgt, um eine zukunftssichere API zu schaffen, die möglicherweise nicht immer mit anderen Build-Tools kompatibel ist.

## Ein pragmatischer Ansatz zur Leistung

Vite hat sich seit seinen [Ursprüngen](./why.md) auf die Leistung konzentriert. Die Architektur des Entwicklerservers von Vite ermöglicht HMR, das schnell bleibt, wenn Projekte wachsen. Vite basiert auf nativen Tools, welche die [Oxc-Toolchain](https://oxc.rs/) und [Rolldown](https://rolldown.rs/) beinhalten, um intensive Aufgaben zu erledigen, behält jedoch den Rest des Codes in JS bei, um Geschwindigkeit und Flexibilität auszubalancieren. Bei Bedarf greifen Framework-Plugins auf [Babel](https://babeljs.io/) zurück, um den Benutzercode zu kompilieren. Dank Rolldowns Rollup-Plugin-Kompatibilität hat Vite Zugriff auf ein großes Ökosystem an Plugins.

## Aufbau von Frameworks auf Basis von Vite

Obwohl Vite von Benutzern direkt verwendet werden kann, glänzt es als Werkzeug zur Erstellung von Frameworks. Der Vite-Kern ist framework-agnostisch, aber es gibt ausgereifte Plugins für jede UI-Framework. Seine [JS-API](./api-javascript.md) ermöglicht es Autoren von App-Frameworks, Vite-Funktionen zu verwenden, um maßgeschneiderte Erlebnisse für ihre Benutzer zu erstellen. Vite unterstützt [SSR-Grundlagen](./ssr.md), die normalerweise in höheren Tools vorhanden sind, aber für den Aufbau moderner Web-Frameworks unerlässlich sind. Und Vite-Plugins vervollständigen das Bild, indem sie eine Möglichkeit zum Teilen zwischen Frameworks bieten. Vite passt auch gut zu [Backend-Frameworks](./backend-integration.md) wie [Ruby](https://vite-ruby.netlify.app/) und [Laravel](https://laravel.com/docs/vite).

## Eine aktive Community

Die Weiterentwicklung von Vite ist eine Zusammenarbeit zwischen Framework- und Plugin-Entwicklern, Benutzern und dem Vite-Team. Wir ermutigen zur aktiven Beteiligung an der Entwicklung des Vite-Kerns, sobald ein Projekt Vite übernimmt. Wir arbeiten eng mit den Hauptprojekten im Ökosystem zusammen, um Regressionen bei jeder Veröffentlichung zu minimieren, unterstützt von Tools wie [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci). Dies ermöglicht es uns, die CI großer Projekte mit Vite auf ausgewählten PRs auszuführen und uns einen klaren Status darüber zu verschaffen, wie das Ökosystem auf eine Veröffentlichung reagieren würde. Wir bemühen uns, Regressionen zu beheben, bevor sie die Benutzer erreichen, und erlauben Projekten, so schnell wie möglich auf die nächsten Versionen zu aktualisieren. Wenn Sie mit Vite arbeiten, laden wir Sie ein, sich [Vites Discord](https://chat.vite.dev) anzuschließen und sich ebenfalls am Projekt zu beteiligen.
