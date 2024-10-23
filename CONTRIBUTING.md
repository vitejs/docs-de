# Vite Beitragshandbuch

Hi! Wir freuen uns sehr, dass Sie daran interessiert sind, zu Vite beizutragen. Bevor Sie Ihren Beitrag einreichen, lesen Sie bitte die folgende Anleitung:

## Einrichtung des Repos

Das Vite-Repo ist ein Monorepo, das pnpm-Workspaces verwendet. Der Paketmanager, der zum Installieren und Verknüpfen von Abhängigkeiten verwendet wird, muss [pnpm](https://pnpm.io/) sein.

Um das Kernpaket `vite` zu entwickeln und zu testen:

1. Führen Sie `pnpm i` im Stammverzeichnis von Vite aus.

2. Führen Sie `pnpm run build` im Stammverzeichnis von Vite aus.

3. Wenn Sie Vite selbst entwickeln, können Sie zu `packages/vite` gehen und `pnpm run dev` ausführen, um Vite automatisch neu zu erstellen, wenn Sie seinen Code ändern.

Alternativ können Sie [Vite.js Docker Dev](https://github.com/nystudio107/vitejs-docker-dev) verwenden, um eine containerisierte Docker-Umgebung für die Entwicklung von Vite.js zu erhalten.

> Vite verwendet pnpm v7. Wenn Sie an mehreren Projekten mit unterschiedlichen Versionen von pnpm arbeiten, wird empfohlen, [Corepack](https://github.com/nodejs/corepack) zu aktivieren, indem Sie `corepack enable` ausführen.

## Debuggen

Wenn Sie Breakpoints verwenden und die Codeausführung erkunden möchten, können Sie die Funktion ["Ausführen und Debuggen"](https://code.visualstudio.com/docs/editor/debugging) von VS Code verwenden.

1. Fügen Sie eine `debugger`-Anweisung ein, an der Sie die Codeausführung anhalten möchten.

2. Klicken Sie auf das Symbol "Ausführen und Debuggen" in der Aktionsleiste des Editors.

3. Klicken Sie auf die Schaltfläche "JavaScript Debug Terminal".

4. Es wird ein Terminal geöffnet. Gehen Sie dann zu `playground/xxx` und führen Sie `pnpm run dev` aus.

5. Die Ausführung wird gestoppt, und Sie können die [Debug-Symbolleiste](https://code.visualstudio.com/docs/editor/debugging#_debug-actions) verwenden, um fortzufahren, zu übergehen, den Prozess neu zu starten usw.

### Debuggen von Fehlern in Vitest-Tests mit Playwright (Chromium)

Einige Fehler werden aufgrund der Abstraktionsebenen und der sandboxartigen Natur von Vitest, Playwright und Chromium maskiert und versteckt. Um herauszufinden, was tatsächlich schiefgeht und den Inhalt der DevTools-Konsole in solchen Fällen anzuzeigen, befolgen Sie diese Anleitung:

1. Fügen Sie eine `debugger`-Anweisung zum `afterAll`-Hook in `playground/vitestSetup.ts` hinzu. Dadurch wird die Ausführung angehalten, bevor die Tests beendet und die Playwright-Browserinstanz beendet wird.

2. Führen Sie die Tests mit dem Befehl `debug-serve` aus, der das Remote-Debugging aktiviert: `pnpm run debug-serve resolve`.

3. Warten Sie, bis die Inspector DevTools in Ihrem Browser geöffnet und der Debugger verbunden ist.

4. Klicken Sie im Quelltextfenster in der rechten Spalte auf die Wiedergabetaste, um die Ausführung fortzusetzen und die Tests auszuführen, was eine Chromium-Instanz öffnet.

5. Konzentrieren Sie sich auf die Chromium-Instanz, öffnen Sie die Browser-DevTools und überprüfen Sie dort die Konsole, um die zugrunde liegenden Probleme zu finden.

6. Zum Schließen alles beenden Sie einfach den Testprozess in Ihrem Terminal.

## Testen von Vite mit externen Paketen

Sie möchten möglicherweise Ihre lokal geänderte Kopie von Vite gegen ein anderes Paket testen, das mit Vite erstellt wurde. Bei pnpm können Sie nach dem Erstellen von Vite das [`pnpm.overrides`](https://pnpm.io/package_json#pnpmoverrides) verwenden. Beachten Sie, dass `pnpm.overrides` in der Root-`package.json` angegeben sein muss und Sie das Paket zuerst als Abhängigkeit in der Root-`package.json` auflisten müssen:

```json
{
  "dependencies": {
    "vite": "^2.0.0"
  },
  "pnpm": {
    "overrides": {
      "vite": "link:../path/to/vite/packages/vite"
    }
  }
}
```

Und führen Sie `pnpm install` erneut aus, um das Paket zu verknüpfen.

## Ausführen von Tests

### Integrationstests

Jedes Paket unter `playground/` enthält ein `__tests__`-Verzeichnis. Die Tests werden mit [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) unter Verwendung von benutzerdefinierten Integrationen ausgeführt, um das Schreiben von Tests einfach zu gestalten. Die detaillierte Einrichtung befindet sich in den Dateien `vitest.config.e2e.js` und `playground/vitest*`.

Bevor Sie die Tests ausführen, stellen Sie sicher, dass [Vite gebaut wurde](#repo-setup). Unter Windows möchten Sie möglicherweise [den Entwicklungsmodus aktivieren](https://docs.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development), um [Probleme mit der Erstellung von Symbolischen Links für Nicht-Administratoren](https://github.com/vitejs/vite/issues/7390) zu lösen. Sie möchten möglicherweise auch [git `core.symlinks` auf `true` setzen, um Probleme mit Symbolischen Links in git zu lösen](https://github.com/vitejs/vite/issues/5242).

Jeder Integrationstest kann im Dev-Server-Modus oder im Build-Modus ausgeführt werden.

- `pnpm test` führt standardmäßig jeden Integrationstest sowohl im Server- als auch im Build-Modus aus und auch Unit-Tests.

- `pnpm run test-serve` führt Tests nur im Server-Modus aus.

- `pnpm run test-build` führt Tests nur im Build-Modus aus.

- Sie können auch `pnpm run test-serve [match]` oder `pnpm run test-build [match]` verwenden, um Tests in einem bestimmten Playground-Paket auszuführen, z. B. `pnpm run test-serve asset` führt Tests für sowohl `playground/asset` als auch `vite/src/node/__tests__/asset` im Server

-Modus aus und `vite/src/node/__tests__/**/*` führt nur im Server-Modus aus.

Beachten Sie, dass das Paket-Matching für das Skript `pnpm test` nicht verfügbar ist, das immer alle Tests ausführt.

### Unit-Tests

Neben den Tests unter `playground/` für Integrationstests können Pakete Unit-Tests unter ihrem `__tests__`-Verzeichnis enthalten. Unit-Tests werden von [Vitest](https://vitest.dev/) unterstützt. Die detaillierte Konfiguration finden Sie in den Dateien `vitest.config.ts`.

- `pnpm run test-unit` führt Unit-Tests unter jedem Paket aus.

- Sie können auch `pnpm run test-unit [match]` verwenden, um entsprechende Tests auszuführen.

### Testumgebung und Hilfsprogramme

In den Tests des Playgrounds können Sie das `page`-Objekt aus `~utils` importieren, das eine Playwright [`Page`](https://playwright.dev/docs/api/class-page)-Instanz ist, die bereits zur Seite des aktuellen Playgrounds navigiert wurde. Das Schreiben eines Tests ist so einfach wie:

```js
import { page } from '~utils'

test('should work', async () => {
  expect(await page.textContent('.foo')).toMatch('foo')
})
```

Einige gängige Testhelfer wie `testDir`, `isBuild` oder `editFile` sind ebenfalls in den Hilfsprogrammen verfügbar. Der Quellcode befindet sich in `playground/test-utils.ts`.

Hinweis: Die Testbuild-Umgebung verwendet eine [andere Standardkonfiguration von Vite](https://github.com/vitejs/vite/blob/main/playground/vitestSetup.ts#L102-L122), um die Transpilierung während der Tests zu überspringen und den Build schneller zu machen. Dies kann zu unterschiedlichen Ergebnissen im Vergleich zum standardmäßigen Produktionsbuild führen.

### Erweiterung des Test-Suites

Um neue Tests hinzuzufügen, sollten Sie ein zugehöriges Playground für die Korrektur oder das Feature finden (oder ein neues erstellen). Ein Beispiel sind Tests zum Laden von statischen Assets im [Asset Playground](https://github.com/vitejs/vite/tree/main/playground/assets). In dieser Vite-App gibt es einen Test für `?raw`-Imports, für den [eine Sektion in der `index.html` definiert ist](https://github.com/vitejs/vite/blob/main/playground/assets/index.html#L121):

```html
<h2>?raw import</h2>
<code class="raw"></code>
```

Dies wird [mit dem Ergebnis eines Dateiimports aktualisiert](https://github.com/vitejs/vite/blob/main/playground/assets/index.html#L151):

```js
import rawSvg from './nested/fragment.svg?raw'
text('.raw', rawSvg)
```

Wobei das Hilfsprogramm `text` wie folgt definiert ist:

```js
function text(el, text) {
  document.querySelector(el).textContent = text
}
```

In den [Spezifikationstests](https://github.com/vitejs/vite/blob/main/playground/assets/__tests__/assets.spec.ts#L180) werden die oben aufgeführten Änderungen am DOM verwendet, um dieses Feature zu testen:

```js
test('?raw import', async () => {
  expect(await page.textContent('.raw')).toMatch('SVG')
})
```

## Hinweis zu Testabhängigkeiten

In vielen Testfällen müssen wir Abhängigkeiten mit den Protokollen `link:` und `file:` mocken. `pnpm` behandelt `link:` als symbolische Links und `file:` als Festplatten-Links. Um Abhängigkeiten zu testen, als ob sie in `node_modules` kopiert wurden, verwenden Sie das Protokoll `file:`, in anderen Fällen sollte das Protokoll `link:` verwendet werden.

## Vor dem Hinzufügen einer Abhängigkeit nachdenken

Die meisten Abhängigkeiten sollten standardmäßig zu `devDependencies` hinzugefügt werden, auch wenn sie zur Laufzeit benötigt werden. Einige Ausnahmen sind:

- Typ-Pakete. Beispiel: `@types/*`.
- Abhängigkeiten, die aufgrund von Binärdateien nicht ordnungsgemäß gebündelt werden können. Beispiel: `esbuild`.
- Abhängigkeiten, die ihre eigenen Typen bereitstellen und deren Typ in den öffentlichen Typen von Vite verwendet wird. Beispiel: `rollup`.

Vermeiden Sie Abhängigkeiten, die große transitive Abhängigkeiten haben, die im Vergleich zur bereitgestellten Funktionalität aufgebläht sind. Beispielsweise ist `http-proxy` selbst plus `@types/http-proxy` etwas über 1 MB groß, aber `http-proxy-middleware` zieht viele Abhängigkeiten heran, sodass es 7 MB (!) beträgt, während ein minimales benutzerdefiniertes Middleware über `http-proxy` nur ein paar Zeilen Code erfordert.

### Sicherstellen der Unterstützung von Typen

Vite soll vollständig in einem TypeScript-Projekt als Abhängigkeit verwendbar sein (z. B. sollte es ordnungsgemäße Typen für VitePress bereitstellen) und auch in `vite.config.ts`. Das bedeutet technisch gesehen, dass eine Abhängigkeit, deren Typen bereitgestellt werden, zu `dependencies` anstelle von `devDependencies` gehören muss. Das Problem dabei ist jedoch, dass wir sie nicht bündeln können.

Um dies zu umgehen, binden wir einige der Typen dieser Abhängigkeiten in `packages/vite/src/dep-types` ein. Auf diese Weise können wir die Typisierung weiterhin bereitstellen, aber die Quellcode der Abhängigkeit wird gebündelt.

Verwenden Sie `pnpm run check-dist-types`, um zu überprüfen, dass die gebündelten Typen nicht von Typen in `devDependencies` abhängen. Wenn Sie `dependencies` hinzufügen, stellen Sie sicher, dass Sie `tsconfig.check.json` konfigurieren.

### Vor dem Hinzufügen einer weiteren Option nachdenken

Wir haben bereits viele Konfigurationsoptionen, und wir sollten Probleme nicht durch Hinzufügen einer weiteren Option lösen. Bevor Sie eine Option hinzufügen, sollten Sie darüber nachdenken:

- Ob das Problem wirklich gelöst werden muss.
- Ob das Problem mit einem intelligenteren Standard gelöst werden kann.
- Ob das Problem mit vorhandenen Optionen behoben werden kann.
- Ob das Problem mit einem Plugin anstelle davon angegangen werden kann.

## Richtlinien für Pull Requests

- Erstellen Sie einen Topic-Zweig von einem Basiszweig, z

. B. `main`, und führen Sie ihn gegen diesen Zweig zusammen.

- Wenn Sie eine neue Funktion hinzufügen:

  - Fügen Sie einen begleitenden Testfall hinzu.
  - Geben Sie einen überzeugenden Grund an, um diese Funktion hinzuzufügen. Idealerweise sollten Sie zuerst ein Vorschlagsproblem öffnen und es genehmigen lassen, bevor Sie daran arbeiten.

- Wenn ein Fehler behoben wird:

  - Wenn Sie ein spezielles Problem lösen, fügen Sie `(fix #xxxx[,#xxxx])` (#xxxx ist die Problem-ID) im Titel Ihres PR für ein besseres Änderungsprotokoll hinzu, z. B. `fix: Update entities encoding/decoding (fix #3899)`.
  - Geben Sie eine ausführliche Beschreibung des Fehlers im PR an. Ein Live-Demo ist bevorzugt.
  - Fügen Sie bei Bedarf angemessene Testabdeckung hinzu.

- Es ist in Ordnung, mehrere kleine Commits zu haben, während Sie an PR arbeiten - GitHub kann sie automatisch vor dem Zusammenführen zusammenführen.

- Stellen Sie sicher, dass die Tests bestehen!

- Die Commit-Nachrichten müssen dem [Commit-Nachrichten-Konvention](./.github/commit-convention.md) folgen, damit Änderungsprotokolle automatisch generiert werden können. Commit-Nachrichten werden automatisch vor dem Commit validiert (durch Aufrufen von [Git Hooks](https://git-scm.com/docs/githooks) über [yorkie](https://github.com/yyx990803/yorkie)).

- Sie müssen sich keine Gedanken über den Code-Stil machen, solange Sie die Entwicklungsabhängigkeiten installiert haben - geänderte Dateien werden automatisch mit Prettier bei Commit formatiert (durch Aufrufen von [Git Hooks](https://git-scm.com/docs/githooks) über [yorkie](https://github.com/yyx990803/yorkie)).

## Wartungsrichtlinien

> Der folgende Abschnitt richtet sich hauptsächlich an Maintainer, die Zugriff auf das Repository haben, aber es ist hilfreich, sich durchzulesen, wenn Sie nicht triviale Beiträge zum Code beitragen möchten.

### Issue-Triage-Workflow

![Issue-Triage-Workflow](./.github/issue-workflow.png)

### Pull-Request-Überprüfungsworkflow

![Pull-Request-Überprüfungsworkflow](./.github/pr-workflow.png)

## Hinweise zu Abhängigkeiten

Vite soll schlank sein, dazu gehört auch die Anzahl der npm-Abhängigkeiten und deren Größe.

Wir verwenden Rollup, um die meisten Abhängigkeiten vor der Veröffentlichung vorzubereiten! Daher sollten die meisten Abhängigkeiten, selbst wenn sie im Quellcode verwendet werden, standardmäßig zu `devDependencies` hinzugefügt werden. Dies führt auch zu einigen Einschränkungen, die wir im Code beachten müssen:

### Verwendung von `require()`

In einigen Fällen verwenden wir absichtlich das Lazy-Require-Verfahren für einige Abhängigkeiten, um die Startleistung zu verbessern. Beachten Sie jedoch, dass wir einfache `require('somedep')`-Aufrufe nicht verwenden können, da diese in ESM-Dateien ignoriert werden und die Abhängigkeit daher nicht im Bundle enthalten ist und die tatsächliche Abhängigkeit nicht vorhanden sein wird, wenn sie veröffentlicht wird, da sie sich in `devDependencies` befindet.

Verwenden Sie stattdessen `(await import('somedep')).default`.

### Vor dem Hinzufügen einer Abhängigkeit nachdenken

Die meisten Abhängigkeiten sollten, auch wenn sie zur Laufzeit benötigt werden, standardmäßig zu `devDependencies` hinzugefügt werden. Einige Ausnahmen sind:

- Typ-Pakete. Beispiel: `@types/*`.
- Abhängigkeiten, die aufgrund von Binärdateien nicht ordnungsgemäß gebündelt werden können. Beispiel: `esbuild`.
- Abhängigkeiten, die ihre eigenen Typen mitbringen und deren Typ in den öffentlichen Typen von Vite verwendet wird. Beispiel: `rollup`.

Vermeiden Sie Abhängigkeiten, die große transitive Abhängigkeiten haben und im Vergleich zur bereitgestellten Funktionalität aufgebläht sind. Zum Beispiel ist `http-proxy` selbst plus `@types/http-proxy` etwas über 1 MB groß, aber `http-proxy-middleware` zieht viele Abhängigkeiten heran, sodass es 7 MB (!) beträgt, während ein minimales benutzerdefiniertes Middleware über `http-proxy` nur ein paar Zeilen Code erfordert.

### Sicherstellen der Typenunterstützung

Vite soll vollständig als Abhängigkeit in einem TypeScript-Projekt verwendbar sein (z. B. sollte es ordnungsgemäße Typen für VitePress bereitstellen) und auch in `vite.config.ts`. Das bedeutet technisch gesehen, dass eine Abhängigkeit, deren Typen bereitgestellt werden, zu `dependencies` anstelle von `devDependencies` gehören muss. Das Problem dabei ist jedoch, dass wir sie nicht bündeln können.

Um dies zu umgehen, binden wir einige der Typen dieser Abhängigkeiten in `packages/vite/src/dep-types` ein. Auf diese Weise können wir die Typisierung weiterhin bereitstellen, aber die Quellcode der Abhängigkeit wird gebündelt

.

Verwenden Sie `pnpm run check-dist-types`, um zu überprüfen, dass die gebündelten Typen nicht von Typen in `devDependencies` abhängen. Wenn Sie `dependencies` hinzufügen, stellen Sie sicher, dass Sie `tsconfig.check.json` konfigurieren.

### Vor dem Hinzufügen einer weiteren Option nachdenken

Wir haben bereits viele Konfigurationsoptionen, und wir sollten Probleme nicht durch Hinzufügen einer weiteren Option lösen. Bevor Sie eine Option hinzufügen, sollten Sie darüber nachdenken:

- Ob das Problem wirklich gelöst werden muss.
- Ob das Problem mit einem intelligenteren Standard gelöst werden kann.
- Ob das Problem mit vorhandenen Optionen behoben werden kann.
- Ob das Problem mit einem Plugin anstelle davon angegangen werden kann.

### Richtlinien für Versionsnummern und Änderungsprotokolle

Wir folgen [Semver](https://semver.org/) (Semantic Versioning), um die Versionsnummer von Vite zu verwalten. Hier sind einige Leitlinien, die wir befolgen:

- **Major (1.0.0, 2.0.0, usw.)**: Änderungen, die bestehende APIs brechen oder große funktionale Änderungen einführen. Dies sollten wir nur sehr vorsichtig tun und nur für wirklich signifikante Verbesserungen oder Änderungen. In der Praxis sollten Breaking Changes nur sehr selten vorkommen.

- **Minor (1.1.0, 1.2.0, usw.)**: Neue Features oder Funktionen, die hinzugefügt werden, ohne bestehende APIs zu brechen.

- **Patch (1.0.1, 1.0.2, usw.)**: Fehlerbehebungen, die keine API-Änderungen darstellen.

Um sicherzustellen, dass Versionsnummern korrekt vergeben werden, verwenden wir die folgenden Werkzeuge:

- Wir verwenden [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) und [Conventional Changelog](https://github.com/conventional-changelog/conventional-changelog) für unsere Commit-Nachrichten.

- Wir verwenden [semantic-release](https://semantic-release.gitbook.io/semantic-release/) und [GitHub Actions](https://docs.github.com/en/actions) für automatische Veröffentlichungen. Dies automatisiert den gesamten Prozess der Versionsverwaltung und der Änderungsprotokolle.

- Jeder Pull Request sollte eine Liste von Änderungen und möglichen Auswirkungen auf bestehende Nutzer enthalten.

- Für wichtige Änderungen oder Erweiterungen, die erfordern, dass bestehender Code oder Konfigurationen angepasst werden, sollte dies in der Dokumentation und in Veröffentlichungshinweisen dokumentiert werden.

- Die Versionsnummern sollten niemals manuell geändert werden. Dies wird von semantic-release verwaltet.

### Versionsverwaltung mit semantic-release

Wir verwenden [semantic-release](https://semantic-release.gitbook.io/semantic-release/) für die automatische Versionsverwaltung und das Erstellen von Änderungsprotokollen. Hier ist, wie es funktioniert:

- Jeder Pull Request sollte eine [konventionelle Commit-Nachricht](https://www.conventionalcommits.org/en/v1.0.0/) haben. Dies wird verwendet, um festzustellen, ob es sich um eine Änderung handelt, die eine neue Version von Vite erfordert.

- Wenn ein Pull Request gemerged wird, löst er einen GitHub-Workflow aus, der semantic-release verwendet, um die neue Version zu ermitteln und die Veröffentlichung vorzubereiten.

- Semantic-release verwendet die Commit-Nachrichten und den bisherigen Versionsverlauf, um die geeignete Versionsnummer zu bestimmen (z. B. Patch, Minor, Major).

- Es erstellt automatisch ein Änderungsprotokoll basierend auf den Commit-Nachrichten.

- Es veröffentlicht die neue Version von Vite auf npm und aktualisiert die Versionsnummern in den `package.json`-Dateien.

- Es erstellt auch ein GitHub-Release mit den Änderungsprotokollen und verlinkt auf die veröffentlichte Version auf npm.

Durch die Verwendung von semantic-release stellen wir sicher, dass die Versionsverwaltung konsistent und automatisiert ist und dass Änderungsprotokolle immer aktuell und präzise sind. Dies erleichtert es den Benutzern von Vite, die Versionshistorie nachzuverfolgen und sicherzustellen, dass sie immer die neueste Version verwenden können.
