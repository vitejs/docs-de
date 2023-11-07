# Projekt-Philosophie

## Schlanker erweiterbarer Kern

Vite beabsichtigt nicht, jeden Anwendungsfall für jeden Benutzer abzudecken. Vite zielt darauf ab, die gängigsten Muster zur Erstellung von Webanwendungen von Anfang an zu unterstützen, aber [der Vite-Kern](https://github.com/vitejs/vite) muss schlank bleiben, um das Projekt langfristig wartbar zu halten. Dieses Ziel wird dank [Vites Plugin-System auf Basis von Rollup](./api-plugin.md) ermöglicht. Funktionen, die als externe Plugins implementiert werden können, werden in der Regel nicht dem Vite-Kern hinzugefügt. [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) ist ein großartiges Beispiel dafür, was mit dem Vite-Kern erreicht werden kann, und es gibt viele [gut gewartete Plugins](https://github.com/vitejs/awesome-vite#plugins), um Ihre Bedürfnisse abzudecken. Vite arbeitet eng mit dem Rollup-Projekt zusammen, um sicherzustellen, dass Plugins in beiden normalen Rollup- und Vite-Projekten so weit wie möglich verwendet werden können, und versucht, erforderliche Erweiterungen in die Plugin-API einzubringen, wenn dies möglich ist.

## Förderung des modernen Webs

Vite bietet anspruchsvolle Funktionen, die das Schreiben modernen Codes vorantreiben. Beispielsweise:

- Der Quellcode kann nur in ESM geschrieben werden, wobei Nicht-ESM-Abhängigkeiten [vorab als ESM gebündelt](./dep-pre-bundling) werden müssen, um zu funktionieren.
- Web-Worker werden ermutigt, mit der [`new Worker`-Syntax](./features#web-workers) geschrieben zu werden, um modernen Standards zu entsprechen.
- Node.js-Module können nicht im Browser verwendet werden.

Bei der Einführung neuer Funktionen werden diese Muster befolgt, um eine zukunftssichere API zu erstellen, die nicht immer mit anderen Build-Tools kompatibel ist.

## Ein pragmatischer Ansatz zur Leistung

Vite hat sich seit seinen [Ursprüngen](./why.md) auf die Leistung konzentriert. Die Architektur des Entwicklerservers von Vite ermöglicht HMR, das schnell bleibt, wenn Projekte wachsen. Vite verwendet native Tools wie [esbuild](https://esbuild.github.io/) und [SWC](https://github.com/vitejs/vite-plugin-react-swc), um intensive Aufgaben zu erledigen, behält jedoch den Rest des Codes in JS bei, um Geschwindigkeit und Flexibilität auszubalancieren. Bei Bedarf greifen Framework-Plugins auf [Babel](https://babeljs.io/) zurück, um den Benutzercode zu kompilieren. Und während des Build-Vorgangs verwendet Vite derzeit [Rollup](https://rollupjs.org/), bei dem die Größe des Bundles und der Zugang zu einer breiten Palette von Plugins wichtiger sind als die reine Geschwindigkeit. Vite wird sich intern weiterentwickeln und neue Bibliotheken verwenden, wenn sie erscheinen, um die DX zu verbessern, während die API stabil bleibt.

## Aufbau von Frameworks auf Basis von Vite

Obwohl Vite von Benutzern direkt verwendet werden kann, glänzt es als Werkzeug zur Erstellung von Frameworks. Der Vite-Kern ist framework-agnostisch, aber es gibt ausgereifte Plugins für jede UI-Framework. Seine [JS-API](./api-javascript.md) ermöglicht es Autoren von App-Frameworks, Vite-Funktionen zu verwenden, um maßgeschneiderte Erlebnisse für ihre Benutzer zu erstellen. Vite unterstützt [SSR-Grundlagen](./ssr.md), die normalerweise in höheren Tools vorhanden sind, aber für den Aufbau moderner Web-Frameworks unerlässlich sind. Und Vite-Plugins vervollständigen das Bild, indem sie eine Möglichkeit zum Teilen zwischen Frameworks bieten. Vite passt auch gut zu [Backend-Frameworks](./backend-integration.md) wie [Ruby](https://vite-ruby.netlify.app/) und [Laravel](https://laravel.com/docs/10.x/vite).

## Eine aktive Community

Die Weiterentwicklung von Vite ist eine Zusammenarbeit zwischen Framework- und Plugin-Entwicklern, Benutzern und dem Vite-Team. Wir ermutigen zur aktiven Beteiligung an der Entwicklung des Vite-Kerns, sobald ein Projekt Vite übernimmt. Wir arbeiten eng mit den Hauptprojekten im Ökosystem zusammen, um Regressionen bei jeder Veröffentlichung zu minimieren, unterstützt von Tools wie [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci). Dies ermöglicht es uns, die CI großer Projekte mit Vite auf ausgewählten PRs auszuführen und uns einen klaren Status darüber zu verschaffen, wie das Ökosystem auf eine Veröffentlichung reagieren würde. Wir bemühen uns, Regressionen zu beheben, bevor sie die Benutzer erreichen, und erlauben Projekten, so schnell wie möglich auf die nächsten Versionen zu aktualisieren. Wenn Sie mit Vite arbeiten, laden wir Sie ein, sich [Vites Discord](https://chat.vitejs.dev) anzuschließen und sich ebenfalls am Projekt zu beteiligen.
