# Migration von v4

## Unterstützung für Node.js

Vite unterstützt nicht mehr Node.js 14 / 16 / 17 / 19, da diese das Ende ihrer Lebensdauer erreicht haben. Node.js 18 / 20+ ist nun erforderlich.

## Veraltete CJS Node API

Die CJS-Node-API von Vite ist veraltet. Wenn Sie `require('vite')` aufrufen, wird nun eine Veraltungs-Warnung protokolliert. Sie sollten Ihre Dateien oder Frameworks aktualisieren, um stattdessen den ESM-Build von Vite zu importieren.

In einem einfachen Vite-Projekt stellen Sie sicher, dass:

1. Der Inhalt der Datei `vite.config.js` die ESM-Syntax verwendet.
2. Die nächstgelegene `package.json`-Datei `"type": "module"` enthält oder die Erweiterung `.mjs` verwendet, z.B. `vite.config.mjs`.

Für andere Projekte gibt es einige allgemeine Ansätze:

- **Konfigurieren Sie ESM als Standard und wählen Sie bei Bedarf CJS aus:** Fügen Sie `"type": "module"` in die `package.json` des Projekts hinzu. Alle `*.js`-Dateien werden jetzt als ESM interpretiert und müssen die ESM-Syntax verwenden. Sie können eine Datei mit der Erweiterung `.cjs` umbenennen, um weiterhin CJS zu verwenden.
- **Behalten Sie CJS als Standard und wählen Sie bei Bedarf ESM aus:** Wenn die `package.json` des Projekts nicht `"type": "module"` enthält, werden alle `*.js`-Dateien als CJS interpretiert. Sie können eine Datei mit der Erweiterung `.mjs` umbenennen, um stattdessen ESM zu verwenden.
- **Importieren Sie Vite dynamisch:** Wenn Sie weiterhin CJS verwenden müssen, können Sie Vite dynamisch mit `import('vite')` importieren. Dies erfordert, dass Ihr Code in einem `async`-Kontext geschrieben ist, sollte aber immer noch gut beherrschbar sein, da die Vite-API größtenteils asynchron ist.

Weitere Informationen finden Sie im [Problembehandlungsleitfaden](https://vitejs.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated).

## Allgemeine Änderungen

### Pfad mit `.` kann jetzt auf index.html zurückfallen

In Vite 4 wurde bei Zugriff auf einen Pfad, der `.` enthält, auch wenn `appType` auf `'SPA'` (Standard) eingestellt war, nicht auf index.html zurückgefallen. Ab Vite 5 wird auf index.html zurückgefallen.

Beachten Sie, dass der Browser keine 404-Fehlermeldung mehr in der Konsole anzeigt, wenn Sie den Bildpfad auf eine nicht existierende Datei verweisen (z.B. `<img src="./file-does-not-exist.png">`).

### Manifestdateien werden standardmäßig im Verzeichnis `.vite` generiert

In Vite 4 wurden die Manifestdateien (`build.manifest`, `build.ssrManifest`) standardmäßig im Stammverzeichnis von `build.outDir` generiert. Ab Vite 5 werden diese standardmäßig im Verzeichnis `.vite` im Verzeichnis `build.outDir` generiert.

### CLI-Verknüpfungen erfordern eine zusätzliche Eingabetaste

CLI-Verknüpfungen, wie z.B. `r`, um den Dev-Server neu zu starten, erfordern nun eine zusätzliche Eingabetaste, um die Verknüpfung auszulösen. Zum Beispiel `r + Enter`, um den Dev-Server neu zu starten.

Diese Änderung verhindert, dass Vite OS-spezifische Verknüpfungen verschluckt und steuert, was eine bessere Kompatibilität bei der Kombination des Vite-Dev-Servers mit anderen Prozessen ermöglicht und die [früheren Einschränkungen](https://github.com/vitejs/vite/pull/14342) vermeidet.

## Entfernte veraltete APIs

- Standardexports von CSS-Dateien (z.B. `import style from './foo.css'`): Verwenden Sie stattdessen die Abfrage `?inline`
- `import.meta.globEager`: Verwenden Sie stattdessen `import.meta.glob('*', { eager: true })`
- `ssr.format: 'cjs`' und `legacy.buildSsrCjsExternalHeuristics` ([#13816](https://github.com/vitejs/vite/discussions/13816))

## Fortgeschrittene

Es gibt einige Änderungen, die nur Auswirkungen auf Plugin- oder Tool-Ersteller haben.

- [[#14119] refactor!: merge `PreviewServerForHook` into `PreviewServer` type](https://github.com/vitejs/vite/pull/14119)

Es gibt auch andere Änderungen, die nur einige Benutzer betreffen.

- [[#14098] fix!: avoid rewriting this (reverts #5312)](https://github.com/vitejs/vite/pull/14098)
  - Die oberste Ebene von `this` wurde standardmäßig beim Erstellen in `globalThis` umgeschrieben. Dieses Verhalten wurde entfernt.
- [[#14231] feat!: add extension to internal virtual modules](https://github.com/vitejs/vite/pull/14231)
  - Die ID der internen virtuellen Module hat jetzt eine Erweiterung (`.js`).

## Migration von v3

Überprüfen Sie zuerst die [Migrationsanleitung von v3](https://v4.vitejs.dev/guide/migration.html) in der Vite v4-Dokumentation, um die erforderlichen Änderungen für die Portierung Ihrer App auf Vite v4 zu sehen, und setzen Sie dann die Änderungen auf dieser Seite fort.
