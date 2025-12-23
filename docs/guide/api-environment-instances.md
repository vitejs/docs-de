# Verwendung von `Environment` Instanzen

:::warning Experimental
Die Environment-API befindet sich noch in der Testphase. Wir werden weiterhin für Stabilität in den APIs zwischen den Hauptversionen sorgen, damit das Ökosystem damit experimentieren und darauf aufbauen kann. Wir planen, diese neueren APIs (mit möglichen grundlegenden Änderungen) in einer zukünftigen Hauptversion zu stabilisieren, sobald nachgelagerte Projekte Zeit hatten, mit den neuen Funktionen zu experimentieren und sie zu validieren.

Ressourcen:

- In der [Feedback-Diskussion](https://github.com/vitejs/vite/discussions/16358) sammeln wir Feedback zu neuen APIs.
- In dem [Environment API PR](https://github.com/vitejs/vite/pull/16471) wird die neue API implementiert und überprüft.

Teilen Sie gerne Ihr Feedback mit uns.
:::

## Zugriff auf die Umgebungen

Während der Entwicklung können die verfügbaren Umgebungen in einem Entwicklungs-Server unter `server.environments` abgerufen werden:

```js
// Erstellen des Servers oder erhalten Sie ihn von der configureServer-Hook
const server = await createServer(/* options */)

const clientEnvironment = server.environments.client
clientEnvironment.transformRequest(url)
console.log(server.environments.ssr.moduleGraph)
```
Sie können auch auf die aktuelle Umgebung durch Plugins zugreifen. Siehe [Environment API for Plugins](./api-environment-plugins.md#accessing-the-current-environment-in-hooks) für mehr Details.

## `DevEnvironment`-Klasse

Während der Entwicklung ist jede Umgebung eine Instanz der `DevEnvironment`-Klasse:

```ts
class DevEnvironment {
  /**
   * Einzigartiger Identifizierer der Umgebung in einem Vite Server.
   * Vite stellt standardmäßig 'client'- und 'ssr'-Umgebungen bereit.
   */
  name: string
  /**
   * 
   * Kommunikationskanal zum Senden und Empfangen von Nachrichten 
   * vom zugehörigen Modul-Runner in der Ziel-Laufzeitumgebung.
   */
  hot: HotChannel | null
  /**
   * Diagramm der Modulknoten mit der importierten Beziehung zwischen
   * verarbeiteten Modulen und dem zwischengespeicherten Ergebnis des verarbeiteten Codes.
   */
  moduleGraph: EnvironmentModuleGraph
  /**
   * Aufgelöste Plugins für diese Umgebung, einschließlich derjenigen, die
   * mit dem umgebungsbezogenen `create`-Hook erstellt wurden
   */
  plugins: Plugin[]
  /**
   * Ermöglicht das Auflösen, Laden und Transformieren von Code über die
   * Umgebung-Plugins-Pipeline
   */
  pluginContainer: EnvironmentPluginContainer
  /**
   * Aufgelöste Konfigurationsoptionen für diese Umgebung. Optionen auf Serverebene
   * im globalen Bereich werden als Standardwerte für alle Umgebungen verwendet und können
   * überschrieben werden (resolve conditions, external, optimizedDeps).
   */
  config: ResolvedConfig & ResolvedDevEnvironmentOptions

  constructor(
    name: string,
    config: ResolvedConfig,
    context: DevEnvironmentSetup
  )

  /**
   * Die URL wird in eine ID aufgelöst, geladen und der Code mithilfe der
   * Plugins-Pipeline verarbeitet. Der Modulgraph wird ebenfalls aktualisiert.
   */
  async transformRequest(url: string): Promise<TransformResult | null>

  /**
   * Registrieren Sie eine Anfrage, die mit niedriger Priorität verarbeitet werden soll. Dies ist nützlich,
   * um Wasserfälle zu vermeiden. Der Vite-Server verfügt über Informationen zu den
   * von anderen Anfragen importierten Modulen, sodass er den Modulgraphen vorab laden kann,
   * damit die Module bereits verarbeitet sind, wenn sie angefordert werden.
   */
  async warmupRequest(url: string): Promise<void>
}
```
`DevEnvironmentContext` wird repräsentiert durch:

```ts
interface DevEnvironmentContext {
  hot: boolean
  transport?: HotChannel | WebSocketServer
  options?: EnvironementOptions
  remoteRunner?: {
    inlineSourceMap?: boolean
  }
  depsOptimizer?: DepsOptimizer
}
```

und `TransformResult` wird repräsentiert durch:

```ts
interface TransformResult {
  code: string
  map: SourceMap | { mappings: '' } | null
  etag?: string
  deps?: string[]
  dynamicDeps?: string[]
}
```

Eine Umgebungsinstanz im Vite-Server ermöglicht es Ihnen, eine URL mit der Methode `environment.transformRequest(url)` zu verarbeiten. Diese Funktion verwendet die Plugin-Pipeline, um die `url` in eine Modul-`id` aufzulösen, sie zu laden (indem sie die Datei aus dem Dateisystem oder über ein Plugin liest, das ein virtuelles Modul implementiert) und dann den Code zu transformieren. Während der Transformation des Moduls werden Importe und andere Metadaten im Umgebungsmodulgraphen aufgezeichnet, indem der entsprechende Modulknoten erstellt oder aktualisiert wird. Nach Abschluss der Verarbeitung wird das Transformationsergebnis ebenfalls im Modul gespeichert.

:::info transformRequest Namensgebung
In der aktuellen Version dieses Vorschlags verwenden wir `transformRequest(url)` und `warmupRequest(url)`, um die Diskussion und das Verständnis für Benutzer zu erleichtern, die mit der aktuellen Vite-API vertraut sind. Wir können diese Namen vor der Veröffentlichung auch noch einmal überprüfen. Sie könnten beispielsweise `environment.processModule(url)` oder `environment.loadModule(url)` heißen, in Anlehnung an Rollups `context.load(id)` in Plugin-Hooks. Derzeit halten wir es jedoch für besser, die aktuellen Namen beizubehalten und diese Diskussion zu verschieben.
:::

## Separate Modulgraphen

Jede Umgebung verfügt über einen isolierten Modulgraphen. Alle Modulgraphen haben dieselbe Signatur, sodass generische Algorithmen implementiert werden können, um den Graphen zu crawlen oder abzufragen, ohne von der Umgebung abhängig zu sein. `hotUpdate` ist ein gutes Beispiel dafür. Wenn eine Datei geändert wird, wird der Modulgraph jeder Umgebung verwendet, um die betroffenen Module zu ermitteln und HMR für jede Umgebung unabhängig voneinander durchzuführen.

::: info
Vite v5 hatte einen gemischten Client- und SSR-Modulgraphen. Bei einem unverarbeiteten oder ungültigen Knoten ist es nicht möglich zu wissen, ob er dem Client, dem SSR oder beiden Umgebungen entspricht. Modulknoten haben einige Eigenschaften mit Präfixen, wie `clientImportedModules` und `ssrImportedModules` (sowie `importedModules`, das die Vereinigung beider zurückgibt). `importers` enthält alle Importer aus der Client- und SSR-Umgebung für jeden Modulknoten. Ein Modulknoten hat auch `transformResult` und `ssrTransformResult`. Eine Abwärtskompatibilitätsschicht ermöglicht es dem Ökosystem, von dem veralteten `server.moduleGraph` zu migrieren.
:::

Jedes Modul wird durch eine Instanz von `EnvironmentModuleNode` dargestellt. Module können im Diagramm registriert werden, ohne dass sie bereits verarbeitet wurden (in diesem Fall wäre `transformResult` gleich `null`). `importers` und `importedModules` werden ebenfalls aktualisiert, nachdem das Modul verarbeitet wurde.

```ts
class EnvironmentModuleNode {
  environment: string

  url: string
  id: string | null = null
  file: string | null = null

  type: 'js' | 'css'

  importers = new Set<EnvironmentModuleNode>()
  importedModules = new Set<EnvironmentModuleNode>()
  importedBindings: Map<string, Set<string>> | null = null

  info?: ModuleInfo
  meta?: Record<string, any>
  transformResult: TransformResult | null = null

  acceptedHmrDeps = new Set<EnvironmentModuleNode>()
  acceptedHmrExports: Set<string> | null = null
  isSelfAccepting?: boolean
  lastHMRTimestamp = 0
  lastInvalidationTimestamp = 0
}
```

`environment.moduleGraph` ist eine Instanz von `EnvironmentModuleGraph`:

```ts
export class EnvironmentModuleGraph {
  environment: string

  urlToModuleMap = new Map<string, EnvironmentModuleNode>()
  idToModuleMap = new Map<string, EnvironmentModuleNode>()
  etagToModuleMap = new Map<string, EnvironmentModuleNode>()
  fileToModulesMap = new Map<string, Set<EnvironmentModuleNode>>()

  constructor(
    environment: string,
    resolveId: (url: string) => Promise<PartialResolvedId | null>,
  )

  async getModuleByUrl(
    rawUrl: string,
  ): Promise<EnvironmentModuleNode | undefined>

  getModuleById(id: string): EnvironmentModuleNode | undefined

  getModulesByFile(file: string): Set<EnvironmentModuleNode> | undefined

  onFileChange(file: string): void

  onFileDelete(file: string): void

  invalidateModule(
    mod: EnvironmentModuleNode,
    seen: Set<EnvironmentModuleNode> = new Set(),
    timestamp: number = Date.now(),
    isHmr: boolean = false,
  ): void

  invalidateAll(): void

  async ensureEntryFromUrl(
    rawUrl: string,
    setIsSelfAccepting = true,
  ): Promise<EnvironmentModuleNode>

  createFileOnlyEntry(file: string): EnvironmentModuleNode

  async resolveUrl(url: string): Promise<ResolvedUrl>

  updateModuleTransformResult(
    mod: EnvironmentModuleNode,
    result: TransformResult | null,
  ): void

  getModuleByEtag(etag: string): EnvironmentModuleNode | undefined
}
```
