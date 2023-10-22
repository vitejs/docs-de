# Fehlerbehebung

Siehe [Rollup-Fehlerbehebungshandbuch](https://rollupjs.org/troubleshooting/) für weitere Informationen.

Wenn die hier vorgeschlagenen Lösungen nicht funktionieren, versuchen Sie, Ihre Fragen in [GitHub-Diskussionen](https://github.com/vitejs/vite/discussions) zu posten oder im `#help`-Kanal von [Vite Land Discord](https://chat.vitejs.dev) zu stellen.

## Befehlszeilenschnittstelle (CLI)

### `Fehler: Modul 'C:\foo\bar&baz\vite\bin\vite.js' nicht gefunden`

Der Pfad zu Ihrem Projektverzeichnis kann ein `&` enthalten, was unter Windows nicht mit `npm` funktioniert ([npm/cmd-shim#45](https://github.com/npm/cmd-shim/issues/45)).

Sie müssen entweder:

- Zu einem anderen Paketmanager wechseln (z.B. `pnpm`, `yarn`)
- Entfernen Sie das `&` aus dem Pfad zu Ihrem Projekt

## Konfiguration

### Dieses Paket ist nur für ESM (ECMAScript Module) geeignet

Beim Importieren eines ESM-Pakets nur über `require` tritt der folgende Fehler auf:

> Fehlgeschlagen, um "foo" aufzulösen. Dieses Paket ist nur für ESM geeignet, wurde jedoch versucht, über `require` geladen zu werden.

> "foo" wurde als ESM-Datei aufgelöst. ESM-Dateien können nicht über `require` geladen werden.

ESM-Dateien können nicht über [`require`](<https://nodejs.org/docs/latest-v18.x/api/esm.html#require:~:text=Using%20require%20to%20load%20an%20ES%20module%20is%20not%20supported%20because%20ES%20modules%20have%20asynchronous%20execution.%20Instead%2C%20use%20import()%20to%20load%20an%20ES%20module%20from%20a%20CommonJS%20module.>) geladen werden.

Wir empfehlen, Ihre Konfiguration in ESM zu konvertieren, indem Sie entweder:

- `"type": "module"` zum nächsten `package.json` hinzufügen
- `vite.config.js`/`vite.config.ts` in `vite.config.mjs`/`vite.config.mts` umbenennen

## Entwicklungsserver

### Anfragen sind dauerhaft blockiert

Wenn Sie Linux verwenden, können Begrenzungen für Dateideskriptoren und Inotify-Begrenzungen das Problem verursachen. Da Vite die meisten Dateien nicht bündelt, können Browser viele Dateien anfordern, die viele Dateideskriptoren erfordern und die Grenze überschreiten.

Um dies zu lösen:

- Erhöhen Sie die Begrenzung für Dateideskriptoren mit `ulimit`

  ```shell
  # Aktuelle Begrenzung überprüfen
  $ ulimit -Sn
  # Begrenzung ändern (vorübergehend)
  $ ulimit -Sn 10000 # Möglicherweise müssen Sie die harte Begrenzung ebenfalls ändern
  # Starten Sie Ihren Browser neu
  ```

- Erhöhen Sie die folgenden Inotify-bezogenen Begrenzungen mit `sysctl`

  ```shell
  # Aktuelle Begrenzungen überprüfen
  $ sysctl fs.inotify
  # Begrenzungen ändern (vorübergehend)
  $ sudo sysctl fs.inotify.max_queued_events=16384
  $ sudo sysctl fs.inotify.max_user_instances=8192
  $ sudo sysctl fs.inotify.max_user_watches=524288
  ```

Wenn die oben genannten Schritte nicht funktionieren, können Sie `DefaultLimitNOFILE=65536` als auskommentierte Konfiguration in den folgenden Dateien hinzufügen:

- /etc/systemd/system.conf
- /etc/systemd/user.conf

Für Ubuntu Linux müssen Sie möglicherweise die Zeile `* - nofile 65536` anstelle der Aktualisierung der systemd-Konfigurationsdateien in die Datei `/etc/security/limits.conf` hinzufügen.

Beachten Sie, dass diese Einstellungen bestehen bleiben, aber ein **Neustart erforderlich ist**.

### Netzwerkanfragen werden nicht geladen

Wenn Sie ein selbstsigniertes SSL-Zertifikat verwenden, ignoriert Chrome alle Cache-Anweisungen und lädt den Inhalt neu. Vite ist auf diese Cache-Anweisungen angewiesen.

Um das Problem zu lösen, verwenden Sie ein vertrauenswürdiges SSL-Zertifikat.

Siehe: [Cache-Probleme](https://helpx.adobe.com/mt/experience-manager/kb/cache-problems-on-chrome-with-SSL-certificate-errors.html), [Chrome-Fehler](https://bugs.chromium.org/p/chromium/issues/detail?id=110649#c8)

#### macOS

Sie können ein vertrauenswürdiges Zertifikat über die Befehlszeile mit diesem Befehl installieren:

```
security add-trusted-cert -d -r trustRoot -k ~/Library/Keychains/login.keychain-db your-cert.cer
```

Oder Sie importieren es in die Keychain Access-App und aktualisieren das Vertrauen in Ihr Zertifikat auf "Immer vertrauen".

### 431 Request Header Fields Too Large

Wenn der Server / WebSocket-Server einen großen HTTP-Header erhält, wird die Anforderung verworfen, und die folgende Warnung wird angezeigt.

> Der Server hat mit dem Statuscode 431 geantwortet. Siehe https://vitejs.dev/guide/troubleshooting.html#_431-request-header-fields-too-large.

Dies liegt daran, dass Node.js die Größe des Anforderungshauptkopfs begrenzt, um [CVE-2018-12121](https://www.cve.org/CVERecord?id=CVE-2018-12121) zu verhindern.

Um dies zu vermeiden, versuchen Sie, die Größe des Anforderungshauptkopfs zu reduzieren. Wenn beispielsweise der Cookie lang ist, löschen Sie ihn. Oder Sie können [`--max-http-header-size`](https://nodejs.org/api/cli.html#--max-http-header-sizesize) verwenden, um die maximale Headergröße zu ändern.

## HMR (Hot Module Replacement)

### Vite erkennt eine Dateiänderung, aber das HMR funktioniert nicht

Es kann sein, dass Sie eine Datei mit einer anderen Groß-/Kleinschreibung importieren. Zum Beispiel existiert `src/foo.js` und `src/bar.js

` enthält:

```js
import './Foo.js' // sollte './foo.js' sein
```

Verwandtes Problem: [#964](https://github.com/vitejs/vite/issues/964)

### Vite erkennt keine Dateiänderung

Wenn Sie Vite mit WSL2 ausführen, kann Vite in bestimmten Situationen keine Dateiänderungen überwachen. Siehe [`server.watch`-Option](/config/server-options.md#server-watch).

### Es erfolgt eine vollständige Aktualisierung anstelle von HMR

Wenn HMR nicht von Vite oder einem Plugin verarbeitet wird, erfolgt eine vollständige Aktualisierung.

Auch wenn es eine Abhängigkeitsschleife gibt, erfolgt eine vollständige Aktualisierung. Um dies zu lösen, versuchen Sie, die Schleife zu entfernen.

### Hohe Anzahl von HMR-Aktualisierungen in der Konsole

Dies kann durch eine zirkuläre Abhängigkeit verursacht werden. Um dies zu lösen, versuchen Sie, die Schleife zu unterbrechen.

## Build

### Die generierte Datei funktioniert aufgrund eines CORS-Fehlers nicht

Wenn die HTML-Dateiausgabe mit dem `file`-Protokoll geöffnet wurde, werden die Skripte mit dem folgenden Fehler nicht ausgeführt.

> Der Zugriff auf das Skript unter 'file:///foo/bar.js' von der Herkunft 'null' wurde durch die CORS-Richtlinie blockiert: Nur Protokollschemata http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted werden für Cross-Origin-Anfragen unterstützt.

> Cross-Origin-Anfrage blockiert: Die Same-Origin-Richtlinie untersagt das Lesen der entfernten Ressource unter 'file:///foo/bar.js'. (Grund: CORS-Anforderung nicht http).

Sie müssen auf die Datei mit dem `http`-Protokoll zugreifen. Der einfachste Weg, dies zu erreichen, ist das Ausführen von `npx vite preview`.

## Optimisierte Abhängigkeiten

### Veraltete vorbündelte Abhängigkeiten bei Verknüpfung mit einem lokalen Paket

Der Hash-Wert, der zum Ungültigmachen optimierter Abhängigkeiten verwendet wird, hängt von den Inhalten des Paketsperrverzeichnisses, den auf Abhängigkeiten angewendeten Patches und den Optionen in der Vite-Konfigurationsdatei ab, die sich auf das Bündeln von Node-Modulen auswirken. Dies bedeutet, dass Vite erkennt, wenn eine Abhängigkeit mit einer Funktion wie [npm overrides](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides) überschrieben wird, und Ihre Abhängigkeiten beim nächsten Serverstart erneut bündelt. Vite wird die Abhängigkeiten nicht ungültig machen, wenn Sie eine Funktion wie [npm link](https://docs.npmjs.com/cli/v9/commands/npm-link) verwenden. Wenn Sie eine Abhängigkeit verknüpfen oder entknüpfen, müssen Sie beim nächsten Serverstart eine erneute Optimierung erzwingen, indem Sie `vite --force` verwenden. Wir empfehlen stattdessen die Verwendung von Überschreibungen, die jetzt von jedem Paketmanager unterstützt werden (siehe auch [pnpm overrides](https://pnpm.io/package_json#pnpmoverrides) und [yarn resolutions](https://yarnpkg.com/configuration/manifest/#resolutions)).

## Leistungsengpässe

Wenn Sie unter langsamen Ladezeiten aufgrund von Leistungsengpässen in Ihrer Anwendung leiden, können Sie den integrierten Node.js-Inspektor mit Ihrem Vite-Entwicklungsserver starten oder beim Erstellen Ihrer Anwendung, um ein CPU-Profil zu erstellen:

::: code-group

```bash [dev server]
vite --profile --open
```

```bash [build]
vite build --profile
```

:::

::: tip Vite Dev Server
Sobald Ihre Anwendung im Browser geöffnet ist, warten Sie, bis sie fertig geladen ist, und kehren Sie dann zum Terminal zurück und drücken Sie die Taste `p` (um den Node.js-Inspektor zu stoppen), drücken Sie dann die Taste `q`, um den Entwicklungsserver zu stoppen.
:::

Der Node.js-Inspektor erstellt ein CPU-Profil mit dem Namen `vite-profile-0.cpuprofile` im Stammverzeichnis. Gehen Sie zu https://www.speedscope.app/ und laden Sie das CPU-Profil mit der Schaltfläche `BROWSE` hoch, um das Ergebnis zu überprüfen.

Sie können [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) installieren, mit dem Sie den Zwischenzustand von Vite-Plugins inspizieren und identifizieren können, welche Plugins oder Middleware in Ihren Anwendungen Engpässe darstellen. Das Plugin kann sowohl im Entwicklungs- als auch im Build-Modus verwendet werden. Weitere Details finden Sie in der Readme-Datei.

## Sonstiges

### Modul für die Browserkompatibilität externalisiert

Wenn Sie ein Node.js-Modul im Browser verwenden, gibt Vite die folgende Warnung aus.

> Das Modul "fs" wurde für die Browserkompatibilität externalisiert. Kann "fs.readFile" im Clientcode nicht verwenden.

Dies liegt daran, dass Vite Node.js-Module nicht automatisch polyfällt.

Wir empfehlen, Node.js-Module für Browsercode zu vermeiden, um die Bündelgröße zu reduzieren. Sie können jedoch Polyfills manuell hinzufügen. Wenn das Modul aus einer Drittanbieter-Bibliothek importiert wird (die für die Verwendung im Browser vorgesehen ist), wird empfohlen, das Problem an die entsprechende Bibliothek zu melden.

### Syntaxfehler / Typfehler tritt auf

Vite kann Code, der nur im nicht-strikten Modus (sloppy mode) ausgeführt wird, nicht verarbeiten und unterstützt ihn nicht. Dies liegt daran, dass Vite ESM verwendet und innerhalb von ESM immer [im strikten Modus](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) ausgeführt wird.

Beispielsweise könnten Sie diese Fehler sehen.

> [ERROR] With statements cannot be used with the "esm" output format due to strict mode

> TypeError: Cannot create property 'foo' on boolean 'false'

Wenn dieser Code in Abhängigkeiten verwendet wird, können Sie [`patch-package`](https://github.com/ds300/patch-package) (oder [`yarn patch`](https://yarnpkg.com/cli/patch) oder [`pnpm patch`](https://pnpm.io/cli/patch)) für einen Ausweg verwenden.

### Browsererweiterungen

Einige Browsererweiterungen (wie Ad-Blocker) können verhindern, dass der Vite-Client Anfragen an den Vite-Entwicklungsserver sendet. In diesem Fall sehen Sie möglicherweise einen weißen Bildschirm ohne protokollierte Fehler. Versuchen Sie, Erweiterungen zu deaktivieren, wenn Sie dieses Problem haben.

### Verknüpfungen zwischen verschiedenen Laufwerken in Windows

Wenn es in Ihrem Projekt unter Windows Verknüpfungen zwischen verschiedenen Laufwerken gibt, funktioniert Vite möglicherweise nicht.

Beispiele für Verknüpfungen zwischen verschiedenen Laufwerken sind:

- Ein virtuelles Laufwerk, das über den `subst`-Befehl mit einem Ordner verknüpft ist
- Ein Symlink/Junction zu einem anderen Laufwerk über den `mklink`-Befehl (z.B. Yarn Global Cache)

Verwandtes Problem: [#10802](https://github.com/vitejs/vite/issues/10802)
