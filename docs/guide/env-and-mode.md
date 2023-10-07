# Umgebungsvariablen und Modi

## Umgebungsvariablen

Vite stellt Umgebungsvariablen im speziellen **`import.meta.env`** Objekt zur Verfügung. Einige integrierte Variablen stehen in allen Fällen zur Verfügung:

- **`import.meta.env.MODE`**: {string} der [Modus](#Modi), in dem die App ausgeführt wird.

- **`import.meta.env.BASE_URL`**: {string} die Basis-URL, von der aus die App bereitgestellt wird. Dies wird durch die [`base` Konfigurationsoption](/config/shared-options.md#base) bestimmt.

- **`import.meta.env.PROD`**: {boolean} ob die App im Produktionsmodus läuft (wenn der Entwicklungsserver mit `NODE_ENV='production'` ausgeführt wird oder wenn eine App mit `NODE_ENV='production'` erstellt wird).

- **`import.meta.env.DEV`**: {boolean} ob die App im Entwicklungsmodus läuft (immer das Gegenteil von `import.meta.env.PROD`).

- **`import.meta.env.SSR`**: {boolean} ob die App im [Servermodus](./ssr.md#conditional-logic) läuft.

### Ersetzung während der Produktion

Während der Produktion werden diese Umgebungsvariablen **statisch ersetzt**. Es ist daher immer notwendig, auf sie mit dem vollen statischen String zu verweisen. Zum Beispiel wird dynamischer Zugriff wie `import.meta.env[key]` nicht funktionieren.

Es werden auch diese Zeichenfolgen in JavaScript-Zeichenfolgen und Vue-Vorlagen ersetzt. Dies sollte ein seltener Fall sein, aber es kann unbeabsichtigt auftreten. Sie können Fehler wie `Fehlendes Semikolon` oder `Unerwartetes Token` in diesem Fall sehen, zum Beispiel wenn `"process.env.NODE_ENV"` in `""development": "` transformiert wird. Es gibt Möglichkeiten, dieses Verhalten zu umgehen:

- Für JavaScript-Zeichenfolgen können Sie die Zeichenfolge mit einem Unicode-Nullbreitenraum unterteilen, z.B. `'import.meta\u200b.env.MODE'`.

- Für Vue-Vorlagen oder anderen HTML-Code, der in JavaScript-Zeichenfolgen kompiliert wird, können Sie das [`<wbr>`-Tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr) verwenden, z.B. `import.meta.<wbr>env.MODE`.

## `.env` Dateien

Vite verwendet [dotenv](https://github.com/motdotla/dotenv), um zusätzliche Umgebungsvariablen aus den folgenden Dateien in Ihrem [Umgebungsverzeichnis](/config/shared-options.md#envdir) zu laden:

```
.env                # in allen Fällen geladen
.env.local          # in allen Fällen geladen, von Git ignoriert
.env.[mode]         # nur im angegebenen Modus geladen
.env.[mode].local   # nur im angegebenen Modus geladen, von Git ignoriert
```

:::tip Prioritäten der Entwicklungsumgebungen

Eine Umgebungsdatei für einen bestimmten Modus (z.B. `.env.production`) hat eine höhere Priorität als eine generische (z.B. `.env`).

Darüber hinaus haben Umgebungsvariablen, die bereits existieren, wenn Vite ausgeführt wird, die höchste Priorität und werden nicht von `.env`-Dateien überschrieben. Zum Beispiel beim Ausführen von `VITE_SOME_KEY=123 vite build`.

`.env`-Dateien werden zu Beginn von Vite geladen. Starten Sie den Server neu, nachdem Sie Änderungen vorgenommen haben.
:::

Geladene Umgebungsvariablen werden auch Ihrem Client-Quellcode über `import.meta.env` als Zeichenfolgen zugänglich gemacht.

Um zu verhindern, dass Umgebungsvariablen versehentlich an den Client durchsickern, werden nur Variablen mit dem Präfix `VITE_` in Ihrem von Vite verarbeiteten Code freigegeben. Zum Beispiel werden aus den folgenden Umgebungsvariablen:

```
VITE_SOME_KEY=123
DB_PASSWORD=foobar
```

nur `VITE_SOME_KEY` als `import.meta.env.VITE_SOME_KEY` in Ihrem Client-Quellcode freigegeben, aber `DB_PASSWORD` nicht.

```js
console.log(import.meta.env.VITE_SOME_KEY) // 123
console.log(import.meta.env.DB_PASSWORD) // undefined
```

Außerdem verwendet Vite [dotenv-expand](https://github.com/motdotla/dotenv-expand), um Variablen standardmäßig zu erweitern. Um mehr über die Syntax zu erfahren, werfen Sie einen Blick auf [ihre Dokumentation](https://github.com/motdotla/dotenv-expand#what-rules-does-the-expansion-engine-follow).

Beachten Sie, dass Sie, wenn Sie `$` in Ihrem Umgebungscode verwenden möchten, es mit `\` escapen müssen.

```
KEY=123
NEW_KEY1=test$foo   # test
NEW_KEY2=test\$foo  # test$foo
NEW_KEY3=test$KEY   # test123
```

Wenn Sie das Präfix für die Umgebungsvariablen ändern möchten, sehen Sie sich die [envPrefix](/config/shared-options.html#envprefix) Option an.

:::warning SICHERHEITSHINWEISE

- `.env.*.local`-Dateien sind nur lokal und können sensible Variablen enthalten. Sie sollten `*.local` zu Ihrer `.gitignore` hinzufügen, um zu verhindern, dass sie in Git überprüft werden.

- Da alle an Ihren Vite-Quellcode freigegebenen Variablen in Ihrem Client-Bundle landen, sollten `VITE_*`-Variablen _keine_ sensiblen Informationen enthalten.
  :::

### IntelliSense für TypeScript

Standardmäßig stellt Vite Typdefinitionen für `import.meta.env` in [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts) bereit. Obwohl Sie in `.env.[mode]`-Dateien weitere benutzerdefinierte Umgebungsvariablen definieren können, möchten Sie möglicherweise TypeScript IntelliSense für benutzerdefinierte Umgebungsvariablen erhalten, die mit `VITE_` beginnen.

Um dies zu erreichen, können Sie eine `env.d.ts`-Datei im `src`-Verzeichnis erstellen und `ImportMetaEnv` wie folgt erweitern:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // mehr Umgebungsvariablen...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

Wenn Ihr Code von Typen aus Browserumgebungen wie [DOM](https://github.com/microsoft/TypeScript/blob/main/lib/lib.dom.d.ts) und [WebWorker](https://github.com/microsoft/TypeScript/blob/main/lib/lib.webworker.d.ts) abhängt, können Sie das [lib](https://www.typescriptlang.org/tsconfig#lib)-Feld in Ihrer `tsconfig.json` aktualisieren.

```json
{
  "lib": ["WebWorker"]
}
```

## HTML-Umgebungsersatz

Vite unterstützt auch den Ersatz von Umgebungsvariablen in HTML-Dateien. Eigenschaften in `import.meta.env` können in HTML-Dateien mit einer speziellen `%ENV_NAME%`-Syntax verwendet werden:

```html
<h1>Vite läuft im Modus %MODE%</h1>
<p>Verwendung von Daten von %VITE_API_URL%</p>
```

Wenn die Umgebung in `import.meta.env` nicht existiert, z.B. `%NON_EXISTENT%`, wird sie ignoriert und nicht ersetzt, im Gegensatz zu `import.meta.env.NON_EXISTENT` in JavaScript, wo sie als `undefined` ersetzt wird.

## Modi

Standardmäßig läuft der Entwicklungsserver (`dev`-Befehl) im `development`-Modus und der `build`-Befehl im `production`-Modus.

Dies bedeutet, dass bei Ausführung von `vite build` die Umgebungsvariablen aus `.env.production` geladen werden, wenn eine solche vorhanden ist:

```
# .env.production
VITE_APP_TITLE=Meine App
```

In Ihrer App können Sie den Titel mit `import.meta.env.VITE_APP_TITLE` rendern.

In einigen Fällen möchten Sie möglicherweise `vite build` mit einem anderen Modus ausführen, um einen anderen Titel zu rendern. Sie können den standardmäßig verwendeten Modus für einen Befehl überschreiben, indem Sie die Option `--mode` verwenden. Wenn Sie beispielsweise Ihre App für einen Staging-Modus erstellen möchten:

```bash
vite build --mode staging
```

Und erstellen Sie eine `.env.staging`-Datei:

```
# .env.staging
VITE_APP_TITLE=Meine App (staging)
```

Da `vite build` standardmäßig eine Produktionsversion erstellt, können Sie dies ebenfalls ändern und eine Entwicklungsversion erstellen, indem Sie einen anderen Modus und eine `.env`-Dateikonfiguration verwenden:

```
# .env.testing
NODE_ENV=development
```
