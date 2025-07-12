# Environment API

:::warning Experimentell
Die ersten Arbeiten an dieser API wurden in Vite 5.1 unter dem Namen „Vite Runtime API” vorgestellt. Dieser Leitfaden beschreibt eine überarbeitete API, die in Environment API umbenannt wurde. Diese API wird in Vite 6 als experimentell veröffentlicht. Sie können sie bereits in der neuesten Version von `vite@6.0.0-beta.x` testen.

Ressourcen:

- [Feedback-Diskussion](https://github.com/vitejs/vite/discussions/16358), in der wir Feedback zu den neuen APIs sammeln.
- [Umgebungs-API PR](https://github.com/vitejs/vite/pull/16471), wo die neue API implementiert und überprüft wurde.

Bitte teilen Sie uns Ihr Feedback mit, wenn Sie den Vorschlag testen.
:::

## Formalisierung von Umgebungen

Vite 6 formalisiert das Konzept der Umgebungen. Bis Vite 5 gab es zwei implizite Umgebungen (`client` und optional `ssr`). Die neue Environment-API ermöglicht es Benutzern und Framework-Autoren, so viele Umgebungen wie nötig zu erstellen, um die Funktionsweise ihrer Apps in der Produktion abzubilden. Diese neue Funktion erforderte eine umfangreiche interne Umgestaltung, aber es wurde viel Wert auf Abwärtskompatibilität gelegt. Das ursprüngliche Ziel von Vite 6 ist es, das Ökosystem so reibungslos wie möglich auf die neue Hauptversion umzustellen und die Einführung dieser neuen experimentellen APIs zu verzögern, bis genügend Benutzer migriert sind und Framework- und Plugin-Autoren das neue Design validiert haben.

## Die Lücke zwischen Build und Dev schließen

Für eine einfache SPA/MPA werden keine neuen APIs rund um Umgebungen in der Konfiguration offengelegt. Intern wendet Vite die Optionen auf eine `client`-Umgebung an, aber es ist nicht notwendig, dieses Konzept bei der Konfiguration von Vite zu kennen. Die Konfiguration und das Verhalten von Vite 5 sollten hier nahtlos funktionieren.

Wenn wir zu einer typischen serverseitig gerenderten (SSR) App wechseln, haben wir zwei Umgebungen:

- „client“: Führt die App im Browser aus.
- „server“: Führt die App in Node (oder anderen Server-Laufzeiten) aus, die Seiten rendert, bevor sie an den Browser gesendet werden.

In der Entwicklung führt Vite den Servercode im selben Node-Prozess wie der Vite-Entwicklungsserver aus, wodurch eine enge Annäherung an die Produktionsumgebung erreicht wird. Es ist jedoch auch möglich, dass Server in anderen JS-Laufzeitumgebungen ausgeführt werden, wie z. B. [Cloudflares Workerd](https://github.com/cloudflare/workerd), die andere Einschränkungen haben. Moderne Apps können auch in mehr als zwei Umgebungen ausgeführt werden, z. B. in einem Browser, einem Node-Server und einem Edge-Server. Vite 5 ermöglichte es nicht, diese Umgebungen korrekt darzustellen.

Mit Vite 6 können Benutzer ihre App während des Builds und der Entwicklung so konfigurieren, dass alle ihre Umgebungen abgebildet werden. Während der Entwicklung kann nun ein einziger Vite-Entwicklungsserver verwendet werden, um Code in mehreren verschiedenen Umgebungen gleichzeitig auszuführen. Der Quellcode der App wird weiterhin vom Vite-Entwicklungsserver transformiert. Zusätzlich zum gemeinsamen HTTP-Server, den Middlewares, der aufgelösten Konfiguration und der Plugins-Pipeline verfügt der Vite-Entwicklungsserver nun über eine Reihe unabhängiger Entwicklungsumgebungen. Jede dieser Umgebungen ist so konfiguriert, dass sie der Produktionsumgebung so genau wie möglich entspricht, und ist mit einer Entwicklungslaufzeit verbunden, in der der Code ausgeführt wird (für Workerd kann der Servercode nun lokal in Miniflare ausgeführt werden). Im Client importiert und führt der Browser den Code aus. In anderen Umgebungen ruft ein Modul-Runner den transformierten Code ab und wertet ihn aus.

![Vite-Umgebungen](../images/vite-environments.svg)

## Konfiguration der Umgebungen

Für eine SPA/MPA sieht die Konfiguration ähnlich wie bei Vite 5 aus. Intern werden diese Optionen verwendet, um die `client`-Umgebung zu konfigurieren.

```js
export default defineConfig({
  build: {
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['lib'],
  },
})
```

Dies ist wichtig, da wir Vite zugänglich halten und neue Konzepte erst dann einführen möchten, wenn sie benötigt werden.

Wenn die App aus mehreren Umgebungen besteht, können diese Umgebungen explizit mit der Konfigurationsoption „environments” konfiguriert werden.

```js
export default {
  build: {
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['lib'],
  },
  environments: {
    server: {},
    edge: {
      resolve: {
        noExternal: true,
      },
    },
  },
}
```

Wenn nicht ausdrücklich dokumentiert, erben Umgebungen die konfigurierten Optionen der obersten Ebene (beispielsweise erben die neuen Umgebungen „server“ und „edge“ die Option „build.sourcemap: false“). Eine kleine Anzahl von Optionen der obersten Ebene, wie „optimizeDeps“, gelten nur für die Umgebung „client“, da sie nicht gut funktionieren, wenn sie als Standard für Serverumgebungen angewendet werden. Die Umgebung „client” kann auch explizit über „environments.client” konfiguriert werden, wir empfehlen jedoch, dies mit den Optionen der obersten Ebene zu tun, damit die Client-Konfiguration beim Hinzufügen neuer Umgebungen unverändert bleibt.

Die Schnittstelle „EnvironmentOptions” stellt alle Optionen pro Umgebung bereit. Es gibt Umgebungsoptionen, die sowohl für „build“ als auch für „dev“ gelten, wie z. B. „resolve“. Und es gibt „DevEnvironmentOptions“ und „BuildEnvironmentOptions“ für entwicklungs- und buildspezifische Optionen (wie „dev.warmup“ oder „build.outDir“). Einige Optionen wie „optimizeDeps“ gelten nur für die Entwicklung, werden aber aus Gründen der Abwärtskompatibilität als oberste Ebene beibehalten und nicht in „dev“ verschachtelt.

```ts
interface EnvironmentOptions {
  define?: Record<string, any>
  resolve?: EnvironmentResolveOptions
  optimizeDeps: DepOptimizationOptions
  consumer?: ‚client‘ | ‚server‘
  dev: DevOptions
  build: BuildOptions
}
```

Die Schnittstelle `UserConfig` erweitert die Schnittstelle `EnvironmentOptions` und ermöglicht die Konfiguration des Clients und der Standardeinstellungen für andere Umgebungen, die über die Option `environments` konfiguriert werden. Der `Client` und eine Serverumgebung namens `ssr` sind während der Entwicklung immer vorhanden. Dies ermöglicht Abwärtskompatibilität mit `server.ssrLoadModule(url)` und `server.moduleGraph`. Während des Builds ist die Umgebung „client“ immer vorhanden, und die Umgebung „ssr“ ist nur vorhanden, wenn sie explizit konfiguriert wurde (mit „environments.ssr“ oder aus Gründen der Abwärtskompatibilität mit „build.ssr“). Eine App muss für ihre SSR-Umgebung nicht den Namen „ssr“ verwenden, sie könnte sie beispielsweise „server“ nennen.

```ts
interface UserConfig extends EnvironmentOptions {
  environments: Record<string, EnvironmentOptions>
  // andere Optionen
}
```

Beachten Sie, dass die Top-Level-Eigenschaft „ssr” veraltet sein wird, sobald die Environment-API stabil ist. Diese Option hat dieselbe Funktion wie „environments”, gilt jedoch für die Standardumgebung „ssr” und erlaubt nur die Konfiguration einer kleinen Auswahl an Optionen.

## Benutzerdefinierte Umgebungsinstanzen

Es stehen Low-Level-Konfigurations-APIs zur Verfügung, damit Laufzeitanbieter Umgebungen mit geeigneten Standardeinstellungen für ihre Laufzeiten bereitstellen können. Diese Umgebungen können auch andere Prozesse oder Threads erstellen, um die Module während der Entwicklung in einer Laufzeit auszuführen, die der Produktionsumgebung näher kommt.

```js
import { customEnvironment } from ‚vite-environment-provider‘

export default {
  build: {
    outDir: '/dist/client',
  },
  environments: {
    ssr: customEnvironment({
      build: {
        outDir: '/dist/ssr',
      },
    }),
  },
}
```

<!-- TODO -->
<!-- ## Abwärtskompatibilität

Die aktuelle Vite-Server-API ist noch nicht veraltet und abwärtskompatibel mit Vite 5. Die neue Environment-API ist experimentell.

Die `server.moduleGraph` gibt eine gemischte Ansicht der Client- und SSR-Modulgraphen zurück. Abwärtskompatible gemischte Modulknoten werden von allen ihren Methoden zurückgegeben. Das gleiche Schema wird für die Modulknoten verwendet, die an `handleHotUpdate` übergeben werden.

Wir empfehlen noch nicht, zur Environment-API zu wechseln. Wir streben an, dass ein Großteil der Nutzerbasis Vite 6 übernimmt, damit Plugins nicht zwei Versionen pflegen müssen. Informationen zu zukünftigen Veraltungen und Upgrade-Pfaden finden Sie im Abschnitt „Zukünftige grundlegende Änderungen“:

- [„this.environment“ in Hooks](/changes/this-environment-in-hooks)
- [HMR „hotUpdate“-Plugin-Hook](/changes/hotupdate-hook)
- [Umstellung auf umgebungsbezogene APIs](/changes/per-environment-apis)
- [SSR mit `ModuleRunner` API](/changes/ssr-using-modulerunner)
- [Gemeinsam genutzte Plugins während des Builds](/changes/shared-plugins-during-build) -->

## Zielgruppe

Dieser Leitfaden vermittelt Endbenutzern grundlegende Konzepte zu Umgebungen.

Plugin-Autoren steht eine konsistentere API zur Verfügung, um mit der aktuellen Umgebungskonfiguration zu interagieren. Wenn Sie auf Vite aufbauen, beschreibt der Leitfaden [Environment API Plugins Guide](./api-environment-plugins.md) die Art und Weise, wie erweiterte Plugin-APIs zur Unterstützung mehrerer benutzerdefinierter Umgebungen verfügbar sind.

Frameworks können entscheiden, Umgebungen auf verschiedenen Ebenen offenzulegen. Wenn Sie Framework-Autor sind, lesen Sie weiter im [Leitfaden zu Environment-API-Frameworks](./api-environment-frameworks), um mehr über die programmatische Seite der Environment-API zu erfahren.

Für Laufzeitanbieter erklärt der [Leitfaden zu Environment-API-Laufzeiten](./api-environment-runtimes.md), wie benutzerdefinierte Umgebungen angeboten werden können, die von Frameworks und Benutzern genutzt werden können.
