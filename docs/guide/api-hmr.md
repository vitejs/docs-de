# HMR API

:::tip Hinweis
Das ist die Client-HMR-API. Für die Behandlung von HMR-Update in Plugins, siehe: [handleHotUpdate](./api-plugin#handlehotupdate).

Die manuelle HMR-API ist in erster Linie für Autoren von Frameworks und Tools gedacht. Als Endbenutzer wird HMR wahrscheinlich bereits in den frameworkspezifischen Startervorlagen für Sie bereitgestellt.
:::

Vite stellt die manuelle HMR-API über das spezielle Objekt `import.meta.hot` bereit:

```ts twoslash
import type { ModuleNamespace } from 'vite/types/hot.d.ts'
import type {
  CustomEventName,
  InferCustomEventPayload,
} from 'vite/types/customEvent.d.ts'

// ---cut---
interface ImportMeta {
  readonly hot?: ViteHotContext
}

interface ViteHotContext {
  readonly data: any

  accept(): void
  accept(cb: (mod: ModuleNamespace | undefined) => void): void
  accept(dep: string, cb: (mod: ModuleNamespace | undefined) => void): void
  accept(
    deps: readonly string[],
    cb: (mods: Array<ModuleNamespace | undefined>) => void,
  ): void

  dispose(cb: (data: any) => void): void
  prune(cb: (data: any) => void): void
  invalidate(message?: string): void

  on<T extends CustomEventName>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void
  off<T extends CustomEventName>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void
  send<T extends CustomEventName>(
    event: T,
    data?: InferCustomEventPayload<T>,
  ): void
}
```

## Erforderliche bedingte Schutzvorrichtung

Stellen Sie als erstes sicher, dass Ihre gesamte Nutzung der HMR-API durch eine Bedingung geschützt wird, damit der Code durch Tree-Shaking in der Produktion optimiert werden kann:

```js
if (import.meta.hot) {
  // HMR code
}
```

## IntelliSense für TypeScript

Vite stellt Typdefinitionen für `import.meta.hot` in [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts) bereit. Sie können 
"vite/client" in the `tsconfig.json` hinzufügen, damit TypeScript die Typdefinitionen aufnimmt:

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

## `hot.accept(cb)`

Damit ein Modul sich selbst akzeptiert, verwenden Sie `import.meta.hot.accept` mit einem Callback, der das aktualisierte Modul empfängt:

```js twoslash
import 'vite/client'
// ---cut---
export const count = 1

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      // newModule ist undefined wenn ein SyntaxError aufgetreten ist
      console.log('updated: count is now ', newModule.count)
    }
  })
}
```

Ein Modul, das Hot Updates "akzeptiert", wird als **HMR-Grenze** betrachtet.

Das HMR von Vite tauscht das ursprünglich importierte Modul nicht tatsächlich aus: Wenn ein HMR-Grenzenmodul Importe aus einer Abhängigkeit erneut exportiert, ist es für die Aktualisierung dieser erneuten Exporte verantwortlich (und diese Exporte müssen `let` verwenden). Darüber hinaus werden Importeure oberhalb der Kette vom Grenzenmodul nicht über die Änderung benachrichtigt. Diese vereinfachte HMR-Implementierung ist für die meisten Anwendungsfälle in der Entwicklung ausreichend und erspart uns gleichzeitig die aufwändige Erstellung von Proxy-Modulen.

Vite verlangt, dass der Aufruf dieser Funktion als `import.meta.hot.accept(` (mit Leerzeichen) im Quellcode erscheint, damit das Modul Updates akzeptiert. Dies ist eine Anforderung der statischen Analyse, die Vite durchführt, um HMR-Unterstützung für ein Modul zu ermöglichen.

## `hot.accept(deps, cb)`

Ein Modul kann auch Updates von direkten Abhängigkeiten akzeptieren, ohne sich selbst neu zu laden:

```js twoslash
// @filename: /foo.d.ts
export declare const foo: () => void

// @filename: /example.js
import 'vite/client'
// ---cut---
import { foo } from './foo.js'

foo()

if (import.meta.hot) {
  import.meta.hot.accept('./foo.js', (newFoo) => {
    // Die Callback-Funktion erhält das aktualisierte './foo.js'-Modul
    newFoo?.foo()
  })

  // Kann auch ein Array von abhängigen Modulen akzeptieren:
  import.meta.hot.accept(
    ['./foo.js', './bar.js'],
    ([newFooModule, newBarModule]) => {
      // Der Callback erhält ein Array, in dem nur das aktualisierte Modul
      // nicht null ist. Wenn die Aktualisierung nicht erfolgreich war (z. B. aufgrund eines Syntaxfehlers),
      // ist das Array leer.
    },
  )
}
```

## `hot.dispose(cb)`

Ein selbstakzeptierendes Modul oder ein Modul, das davon ausgeht, von anderen akzeptiert zu werden, kann mit `hot.dispose` alle persistenten Nebenwirkungen bereinigen, die durch seine aktualisierte Kopie entstanden sind:

```js twoslash
import 'vite/client'
// ---cut---
function setupSideEffect() {}

setupSideEffect()

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    // Nebenwirkung der Bereinigung
  })
}
```

## `hot.prune(cb)`

Registrieren Sie einen Rückruf, der aufgerufen wird, wenn das Modul nicht mehr auf der Seite importiert wird. Im Vergleich zu `hot.dispose` kann dies verwendet werden, wenn der Quellcode Nebenwirkungen bei Aktualisierungen selbst bereinigt und Sie nur dann bereinigen müssen, wenn er von der Seite entfernt wird. Vite verwendet dies derzeit für `.css`-Importe.

```js twoslash
import 'vite/client'
// ---cut---
function setupOrReuseSideEffect() {}

setupOrReuseSideEffect()

if (import.meta.hot) {
  import.meta.hot.prune((data) => {
    // Nebenwirkung der Bereinigung
  })
}
```

## `hot.data`

Das Objekt `import.meta.hot.data` bleibt über verschiedene Instanzen desselben aktualisierten Moduls hinweg bestehen. Es kann verwendet werden, um Informationen aus einer früheren Version des Moduls an die nächste weiterzugeben.

Beachten Sie, dass die Neuzuweisung von `data` selbst nicht unterstützt wird. Stattdessen sollten Sie die Eigenschaften des Objekts `data` so ändern, dass die von anderen Handlern hinzugefügten Informationen erhalten bleiben.

```js twoslash
import 'vite/client'
// ---cut---
// In Ordnung
import.meta.hot.data.someValue = 'hello'

// Nicht unterstützt
import.meta.hot.data = { someValue: 'hello' }
```

## `hot.decline()`

Dies ist derzeit eine Nulloperation und dient der Abwärtskompatibilität. Dies könnte sich in Zukunft ändern, wenn es eine neue Verwendung dafür gibt. Um anzuzeigen, dass das Modul nicht hot-updatable ist, verwenden Sie `hot.invalidate()`.

## `hot.invalidate(message?: string)`

Ein selbstakzeptierendes Modul kann während der Laufzeit feststellen, dass es ein HMR-Update nicht verarbeiten kann, sodass das Update zwangsweise an Importeure weitergegeben werden muss. Durch den Aufruf von `import.meta.hot.invalidate()` macht der HMR-Server die Importeure des Aufrufers ungültig, als ob der Aufrufer nicht selbstakzeptierend wäre. Dies führt zu einer Meldung sowohl in der Browserkonsole als auch im Terminal. Sie können eine Meldung übergeben, um den Kontext für die Ungültigkeitserklärung anzugeben.

Beachten Sie, dass Sie immer `import.meta.hot.accept` aufrufen sollten, auch wenn Sie unmittelbar danach `invalidate` aufrufen möchten, da der HMR-Client sonst keine zukünftigen Änderungen am selbstakzeptierenden Modul berücksichtigt. Um Ihre Absicht klar zu kommunizieren, empfehlen wir, `invalidate` innerhalb des `accept`-Callbacks wie folgt aufzurufen:

```js twoslash
import 'vite/client'
// ---cut---
import.meta.hot.accept((module) => {
  // Sie können die neue Modulinstanz verwenden, um zu entscheiden, ob eine Ungültigkeitserklärung vorgenommen werden soll.
  if (cannotHandleUpdate(module)) {
    import.meta.hot.invalidate()
  }
})
```

## `hot.on(event, cb)`

Hören Sie sich ein HMR-Ereignis an.

Die folgenden HMR-Ereignisse werden von Vite automatisch ausgelöst:

- `‚vite:beforeUpdate‘`, wenn eine Aktualisierung durchgeführt werden soll (z. B. wenn ein Modul ersetzt wird)
- `‚vite:afterUpdate‘`, wenn eine Aktualisierung gerade durchgeführt wurde (z. B. wenn ein Modul ersetzt wurde)
- `‚vite:beforeFullReload‘`, wenn ein vollständiger Neustart durchgeführt werden soll
- `‚vite:beforePrune‘`, wenn nicht mehr benötigte Module entfernt werden sollen
- `‚vite:invalidate‘`, wenn ein Modul mit `import.meta.hot.invalidate()` ungültig gemacht wird
- `‚vite:error‘`, wenn ein Fehler auftritt (z. B. ein Syntaxfehler)
- `vite:ws:disconnect`, wenn die WebSocket-Verbindung unterbrochen wird
- `vite:ws:connect`, wenn die WebSocket-Verbindung (wieder) hergestellt wird

Benutzerdefinierte HMR-Ereignisse können auch von Plugins gesendet werden. Weitere Informationen finden Sie unter [handleHotUpdate](./api-plugin#handlehotupdate).

## `hot.off(event, cb)`

Entfernen Sie den Rückruf aus den Ereignis-Listenern.

## `hot.send(event, data)`

Senden Sie benutzerdefinierte Ereignisse zurück an den Entwicklerserver von Vite.

Wenn dies vor dem Herstellen der Verbindung aufgerufen wird, werden die Daten gepuffert und nach dem Herstellen der Verbindung gesendet.

Weitere Informationen finden Sie unter [Client-Server-Kommunikation](/guide/api-plugin.html#client-server-communication), einschließlich eines Abschnitts über [Benutzerdefinierte Ereignisse eingeben](/guide/api-plugin.html#typescript-for-custom-events).

## Further Reading

Wenn Sie mehr über die Verwendung der HMR-API und ihre Funktionsweise erfahren möchten, sehen Sie sich diese Ressourcen an:

- [Hot Module Replacement ist ganz einfach](https://bjornlu.com/blog/hot-module-replacement-is-easy)
