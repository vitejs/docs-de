# Vergleiche

## WMR

[WMR](https://github.com/preactjs/wmr) vom Preact-Team bietet einen ähnlichen Funktionsumfang, und die Unterstützung von Vite 2.0 für die Plugin-Schnittstelle von Rollup ist davon inspiriert.

WMR wurde hauptsächlich für [Preact](https://preactjs.com/) Projekte entwickelt und bietet mehr integrierte Funktionen wie Pre-Rendering. Vom Umfang her ist es eher ein Preact-Meta-Framework, mit der gleichen Betonung auf kompakter Größe wie Preact selbst. Wenn Sie Preact verwenden, bietet WMR wahrscheinlich eine besser abgestimmte Erfahrung.

## @web/dev-server

[@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) (vorher `es-dev-server`) ist ein großartiges Projekt und die Koa-basierte Servereinrichtung von Vite 1.0 wurde davon inspiriert.

`@web/dev-server` ist vom Umfang her etwas weniger umfangreich. Er bietet keine offiziellen Framework-Integrationen und erfordert das manuelle Einrichten einer Rollup-Konfiguration für den Produktions-Build.

Alles in allem ist Vite ein eher meinungsbildendes / übergeordnetes Tool, das darauf abzielt, einen sofort einsetzbaren Workflow zu bieten. Abgesehen davon enthält das `@web`-Schirmprojekt viele andere hervorragende Tools, die auch für Vite-Benutzer von Nutzen sein können.

## Snowpack

[Snowpack](https://www.snowpack.dev/) war ebenfalls ein nativer ESM-Entwicklungsserver ohne Bündel, der Vite sehr ähnlich ist. Das Projekt wird nicht mehr gepflegt. Das Snowpack-Team arbeitet jetzt an [Astro](https://astro.build/), einem Static Site Builder, der auf Vite basiert. Das Astro-Team ist jetzt ein aktiver Akteur im Ökosystem und hilft bei der Verbesserung von Vite.

Abgesehen von unterschiedlichen Implementierungsdetails haben die beiden Projekte viele technische Vorteile gegenüber herkömmlichen Werkzeugen. Die Vorbündelung von Abhängigkeiten in Vite ist auch von Snowpack v1 (jetzt [`esinstall`](https://github.com/snowpackjs/snowpack/tree/main/esinstall)) inspiriert. Einige der Hauptunterschiede zwischen den beiden Projekten sind in [the v2 Comparisons Guide](https://v2.vitejs.dev/guide/comparisons) aufgeführt.
