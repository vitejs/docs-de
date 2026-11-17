# Verwendung von `Environment` Instanzen

:::info Release-Kandidat
Die Environment API ist allgemein in der Phase für einen Release-Kandidaten. Wir werden für Stabilität in den APIs zwischen den Hauptversionen sorgen, damit das Ökosystem damit experimentieren und darauf aufbauen kann. Beachten Sie trotzdessen, dass [einige spezifische APIs](/changes/#considering) weiterhin als experimentell betrachtet werden.

Wir planen, diese neueren APIs (mit möglichen grundlegenden Änderungen) in einer zukünftigen Hauptversion zu stabilisieren, sobald nachgelagerte Projekte Zeit hatten, mit den neuen Funktionen zu experimentieren und sie zu validieren.

Ressourcen:

- [Feedback-Diskussion](https://github.com/vitejs/vite/discussions/16358), wo wir Feedback zu den neuen APIs sammeln.
- [Environment API PR](https://github.com/vitejs/vite/pull/16471), wo die neuen APIs implementiert und überprüft wurden.

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
  hot: NormalizedHotChannel
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

  /**
   * Registriert eine aufgelöste Modul-ID als sicher ladbar in dieser Umgebung,
   * auch außerhalb von server.fs.allow. server.fs.deny gilt weiterhin.
   * Aus dem transform-Hook des Plugins aufrufen, wenn es eine Referenz auf das Modul hinzufügt.
   */
  addSafeModule(id: string): void

  /**
   * Wird vom Module Runner aufgerufen, um Informationen über das angegebene
   * Modul abzurufen. Ruft intern `transformRequest` auf und verpackt das Ergebnis
   * in das Format, das der Module Runner versteht.
   * Diese Methode ist nicht für den manuellen Aufruf gedacht.
   */
  async fetchModule(
    id: string,
    importer?: string,
    options?: FetchFunctionOptions,
  ): Promise<FetchResult>
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
    timestamp: number = monotonicDateNow(),
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

## `FetchResult`

Die Methode `environment.fetchModule` gibt ein `FetchResult` zurück, das vom Module Runner verarbeitet werden soll. `FetchResult` ist eine Union aus `CachedFetchResult`, `ExternalFetchResult` und `ViteFetchResult`.

`CachedFetchResult` entspricht dem HTTP-Statuscode `304` (Not Modified).

```ts
export interface CachedFetchResult {
  /**
   * Wenn das Modul im Runner zwischengespeichert ist, bestätigt dies,
   * dass es auf der Serverseite nicht invalidiert wurde.
   */
  cache: true
}
```

`ExternalFetchResult` weist den Module Runner an, das Modul über die Methode `runExternalModule` des [`ModuleEvaluator`](/guide/api-environment-runtimes#moduleevaluator) zu importieren. In diesem Fall verwendet der Standard-Modul-Evaluator das native `import` der Laufzeitumgebung, statt die Datei durch Vite zu verarbeiten.

```ts
export interface ExternalFetchResult {
  /**
   * Der Pfad zum externalisierten Modul, beginnend mit file://.
   * Standardmäßig wird es über ein dynamisches "import" importiert,
   * statt von Vite transformiert und mit dem Vite-Runner geladen zu werden.
   */
  externalize: string
  /**
   * Typ des Moduls. Wird verwendet, um zu prüfen, ob die Import-Anweisung korrekt ist.
   * Zum Beispiel, wenn Vite einen Fehler werfen muss, weil eine Variable gar nicht exportiert wird.
   */
  type: 'module' | 'commonjs' | 'builtin' | 'network'
}
```

`ViteFetchResult` liefert Informationen über das aktuelle Modul, darunter den auszuführenden `code` sowie `id`, `file` und `url` des Moduls.

Das Feld `invalidate` weist den Module Runner an, das Modul vor der erneuten Ausführung zu invalidieren, statt es aus dem Cache zu bedienen. Das ist in der Regel `true`, wenn ein HMR-Update ausgelöst wurde.

```ts
export interface ViteFetchResult {
  /**
   * Code, der vom Vite-Runner ausgewertet wird.
   * Standardmäßig wird er in eine asynchrone Funktion verpackt.
   */
  code: string
  /**
   * Dateipfad des Moduls auf der Festplatte.
   * Wird als import.meta.url/filename aufgelöst.
   * Ist `null` für virtuelle Module.
   */
  file: string | null
  /**
   * Modul-ID im Modulgraphen des Servers.
   */
  id: string
  /**
   * Modul-URL, die im Import verwendet wird.
   */
  url: string
  /**
   * Modul auf der Client-Seite invalidieren.
   */
  invalidate: boolean
}
```
