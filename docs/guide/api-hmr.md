# HMR API

:::tip HINWEIS
Dies ist die HMR API des Clients. Informationen zur Handhabung von HMR-Updates in Plugins finden Sie unter [handleHotUpdate](./api-plugin#handlehotupdate).

Die manuelle HMR API ist hauptsächlich für Framework- und Tool-Autoren gedacht. Als Endbenutzer wird HMR wahrscheinlich bereits für Sie in den Framework-spezifischen Startervorlagen behandelt.
:::

Vite stellt seine manuelle HMR API über das spezielle `import.meta.hot` Objekt zur Verfügung:

```ts
interface ImportMeta {
  readonly hot?: ViteHotContext
}

type ModuleNamespace = Record<string, any> & {
  [Symbol.toStringTag]: 'Module'
}

interface ViteHotContext {
  readonly data: any

  accept(): void
  accept(cb: (mod: ModuleNamespace | undefined) => void): void
  accept(dep: string, cb: (mod: ModuleNamespace | undefined) => void): void
  accept(
    deps: readonly string[],
    cb: (mods: Array<ModuleNamespace | undefined>) => void
  ): void

  dispose(cb: (data: any) => void): void
  prune(cb: (data: any) => void): void
  invalidate(message?: string): void

  // `InferCustomEventPayload` bietet Typen für integrierte Vite-Ereignisse
  on<T extends string>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void
  ): void
  off<T extends string>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void
  send<T extends string>(event: T, data?: InferCustomEventPayload<T>): void
}
```

## Erforderliche bedingte Absicherung

Stellen Sie zunächst sicher, dass Sie alle Verwendungen der HMR API mit einem bedingten Block absichern, damit der Code in der Produktion getree-shaked werden kann:

```js
if (import.meta.hot) {
  // HMR-Code
}
```

## IntelliSense für TypeScript

Vite stellt Typdefinitionen für `import.meta.hot` in [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts) bereit. Sie können eine `env.d.ts` im `src`-Verzeichnis erstellen, damit TypeScript die Typdefinitionen erkennt:

```ts
/// <reference types="vite/client" />
```

## `hot.accept(cb)`

Um ein Modul zur Selbstannahme zu bringen, verwenden Sie `import.meta.hot.accept` mit einem Callback, der das aktualisierte Modul empfängt:

```js
export const count = 1

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      // newModule ist "undefined", wenn ein Syntaxfehler auftritt
      console.log('aktualisiert: count ist jetzt ', newModule.count)
    }
  })
}
```

Ein Modul, das Hot-Updates "akzeptiert", wird als **HMR-Grenze** betrachtet.

Vites HMR tauscht das ursprünglich importierte Modul tatsächlich nicht aus: Wenn ein HMR-Grenzmodul Importe aus einer Abhängigkeit neu exportiert, ist es für die Aktualisierung dieser Neuausgaben verantwortlich (und diese Exporte müssen `let` verwenden). Darüber hinaus werden Importeure über der Kette des Grenzmoduls nicht über die Änderung informiert. Diese vereinfachte HMR-Implementierung ist für die meisten Entwicklungsanforderungen ausreichend und ermöglicht es uns, die aufwändige Arbeit der Generierung von Proxy-Modulen zu überspringen.

Vite erfordert, dass der Aufruf dieser Funktion in der Quellcodeform als `import.meta.hot.accept(` (mit Leerzeichen) erscheint, damit das Modul das Update akzeptieren kann. Dies ist eine Anforderung der statischen Analyse, die Vite durchführt, um die HMR-Unterstützung für ein Modul zu aktivieren.

## `hot.accept(deps, cb)`

Ein Modul kann auch Updates von direkten Abhängigkeiten akzeptieren, ohne sich selbst neu zu laden:

```js
import { foo } from './foo.js'

foo()

if (import.meta.hot) {
  import.meta.hot.accept('./foo.js', (newFoo) => {
    // Der Callback erhält das aktualisierte './foo.js'-Modul
    newFoo?.foo()
  })

  // Kann auch ein Array von Abhängigkeitsmodulen akzeptieren:
  import.meta.hot.accept(
    ['./foo.js', './bar.js'],
    ([newFooModule, newBarModule]) => {
      // Der Callback erhält ein Array, in dem nur das aktualisierte Modul nicht null ist. Wenn das Update nicht erfolgreich war (z. B. aufgrund eines Syntaxfehlers), ist das Array leer.
    }
  )
}
```

## `hot.dispose(cb)`

Ein Modul, das sich selbst annimmt, oder ein Modul, das erwartet, von anderen angenommen zu werden, kann `hot.dispose` verwenden, um alle persistenten Seiteneffekte zu bereinigen, die durch seine aktualisierte Kopie erstellt wurden:

```js
function setupSideEffect() {}

setupSideEffect()

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    // Bereinigen von Nebenwirkungen
  })
}
```

## `hot.prune(cb)`

Registrieren Sie einen Callback, der aufgerufen wird, wenn das Modul nicht mehr auf der Seite importiert wird. Im Vergleich zu `hot.dispose` kann dies verwendet werden, wenn der Quellcode selbst auf Updates hin Seiten Effekte bereinigt und Sie nur bereinigen müssen, wenn er von der Seite entfernt wird. Vite verwendet dies derzeit für `.css`-Importe.

```js
function setupOrReuseSideEffect() {}

setupOrReuseSideEffect()

if (import.meta.hot) {
  import.meta.hot.prune((data) => {
    // Bereinigen von Nebenwirkungen
  })
}
```

## `hot.data`

Das `import.meta.hot.data` Objekt bleibt über verschiedene Instanzen des gleichen aktualisierten Moduls erhalten. Es kann verwendet werden, um Informationen von einer vorherigen Version des Moduls an die nächste weiterzugeben.

Note that re-assignment of `data` itself is not supported. Instead, you should mutate properties of the `data` object so information added from other handlers are preserved.

```js
// ok
import.meta.hot.data.someValue = 'hello'

// not supported
import.meta.hot.data = { someValue: 'hello' }
```

## `hot.decline()`

Dies ist derzeit ein Leerlauf und dient der Abwärtskompatibilität. Dies könnte sich in der Zukunft ändern, wenn es eine neue Verwendung dafür gibt. Um anzuzeigen, dass das Modul nicht für Hot-Updates geeignet ist, verwenden Sie `hot.invalidate()`.

## `hot.invalidate(message?: string)`

Ein Modul, das Hot-Updates annimmt, kann während der Laufzeit feststellen, dass es ein HMR-Update nicht verarbeiten kann. Das Update muss also zwangsweise an die Importierenden weitergegeben werden

. Durch den Aufruf von `import.meta.hot.invalidate()` wird der HMR-Server die Importierenden des Aufrufers ungültig machen, als ob der Aufrufer sich nicht selbst annehmen würde. Dies wird sowohl in der Browser-Konsole als auch in der Konsole protokolliert. Sie können eine Nachricht übergeben, um den Kontext für die Ungültigmachung anzugeben.

Beachten Sie, dass Sie `import.meta.hot.accept` immer aufrufen sollten, auch wenn Sie planen, sofort danach `invalidate` aufzurufen, da der HMR-Client sonst nicht auf zukünftige Änderungen am selbst annehmenden Modul hört. Um Ihre Absicht klar zu kommunizieren, empfehlen wir, `invalidate` innerhalb des `accept`-Callbacks wie folgt aufzurufen:

```js
import.meta.hot.accept((module) => {
  // Sie können die neue Modulinstanz verwenden, um zu entscheiden, ob Sie ungültig machen möchten.
  if (cannotHandleUpdate(module)) {
    import.meta.hot.invalidate()
  }
})
```

## `hot.on(event, cb)`

Lauschen Sie einem HMR-Ereignis.

Folgende HMR-Ereignisse werden automatisch von Vite ausgelöst:

- `'vite:beforeUpdate'` wenn ein Update angewendet wird (z. B. ein Modul wird ersetzt)
- `'vite:afterUpdate'` wenn ein Update gerade angewendet wurde (z. B. ein Modul wurde ersetzt)
- `'vite:beforeFullReload'` wenn ein vollständiger Neustart bevorsteht
- `'vite:beforePrune'` wenn Module, die nicht mehr benötigt werden, beschnitten werden
- `'vite:invalidate'` wenn ein Modul mit `import.meta.hot.invalidate()` ungültig gemacht wird
- `'vite:error'` wenn ein Fehler auftritt (z. B. ein Syntaxfehler)
- `'vite:ws:disconnect'` wenn die WebSocket-Verbindung verloren geht
- `'vite:ws:connect'` wenn die WebSocket-Verbindung (wieder-)hergestellt wird

Benutzerdefinierte HMR-Ereignisse können auch von Plugins gesendet werden. Weitere Informationen finden Sie unter [handleHotUpdate](./api-plugin#handlehotupdate).

## `hot.off(event, cb)`

Remove callback from the event listeners

## `hot.send(event, data)`

Senden Sie benutzerdefinierte Ereignisse zurück an den Vite-Entwicklungsserver.

Wenn dies vor der Verbindung aufgerufen wird, wird die Daten zwischengespeichert und gesendet, sobald die Verbindung hergestellt ist.

Weitere Informationen finden Sie unter [Kommunikation zwischen Client und Server](/guide/api-plugin.html#client-server-communication).
