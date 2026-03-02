# Bereitstellen einer statischen Website

Die folgenden Anleitungen basieren auf einigen gemeinsamen Annahmen:

- Sie verwenden den Standardausgabeort für den Build (`dist`). Dieser Ort [kann mit `build.outDir` geändert werden](/config/build-options.md#build-outdir), und Sie können die Anweisungen aus diesen Anleitungen in diesem Fall ableiten.
- Sie verwenden npm. Sie können äquivalente Befehle verwenden, um die Skripte auszuführen, wenn Sie Yarn oder andere Paketmanager verwenden.
- Vite ist als lokale Entwicklungsumgebungsabhängigkeit in Ihrem Projekt installiert, und Sie haben die folgenden npm-Skripte eingerichtet:

```json [package.json]
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Es ist wichtig zu beachten, dass `vite preview` für die lokale Vorschau des Builds gedacht ist und nicht als Produktionsserver gedacht ist.

:::tip HINWEIS
Diese Anleitungen bieten Anweisungen für die Bereitstellung einer statischen Vite-Website. Vite unterstützt auch Server-seitiges Rendern. SSR bezieht sich auf Front-End-Frameworks, die die gleiche Anwendung in Node.js ausführen, sie in HTML vorrendern und schließlich auf dem Client verarbeiten. Werfen Sie einen Blick auf den [SSR-Leitfaden](./ssr), um mehr über dieses Feature zu erfahren. Wenn Sie andererseits eine Integration mit traditionellen serverseitigen Frameworks suchen, werfen Sie stattdessen einen Blick auf den [Leitfaden zur Backend-Integration](./backend-integration).
:::

## Erstellen der Anwendung

Sie können den Befehl `npm run build` ausführen, um die Anwendung zu erstellen.

```bash
$ npm run build
```

Standardmäßig wird die Build-Ausgabe in `dist` platziert. Sie können diesen `dist`-Ordner auf einer Ihrer bevorzugten Plattformen bereitstellen.

## Lokales Testen der Anwendung

Sobald Sie die Anwendung erstellt haben, können Sie sie lokal testen, indem Sie den Befehl `npm run preview` ausführen.

```bash
$ npm run preview
```

Der Befehl `vite preview` startet einen lokalen statischen Webserver, der die Dateien aus `dist` unter `http://localhost:4173` bereitstellt. Dies ist eine einfache Möglichkeit, um zu überprüfen, ob der Produktionsbuild in Ihrer lokalen Umgebung in Ordnung aussieht.

Sie können den Port des Servers konfigurieren, indem Sie die `--port`-Flagge als Argument übergeben.

```json [package.json]
{
  "scripts": {
    "preview": "vite preview --port 8080"
  }
}
```

Jetzt startet der `preview`-Befehl den Server unter `http://localhost:8080`.

## GitHub Pages

1. Legen Sie den richtigen `base` in `vite.config.js` fest.

   Wenn Sie auf `https://<USERNAME>.github.io/` oder auf eine benutzerdefinierte Domain über GitHub Pages (z. B. `www.example.com`) bereitstellen, setzen Sie `base` auf `'/'`. Alternativ können Sie `base` aus der Konfiguration entfernen, da es auch standardmäßig auf `'/'` eingestellt ist.

   Wenn Sie auf `https://<USERNAME>.github.io/<REPO>/` deployen (z.B. Ihr Repository befindet sich unter `https://github.com/<USERNAME>/<REPO>`), dann setzen Sie `base` auf `'/<REPO>/'`.

2. Gehen Sie zur GitHub Pages-Konfiguration in den Einstellungen des Repository und wählen Sie die Quelle für die Bereitstellung als "GitHub Actions" aus. Dadurch wird ein Workflow erstellt, der Ihr Projekt erstellt und bereitstellt. Ein Beispielworkflow, der Abhängigkeiten installiert und mit npm erstellt, ist bereitgestellt:

<<< ./static-deploy-github-pages.yaml#content

## GitLab Pages und GitLab CI

1. Legen Sie den richtigen `base` in `vite.config.js` fest.

   Wenn Sie auf `https://<BENUTZERNAME oder GRUPPE>.gitlab.io/` bereitstellen, können Sie `base` weglassen, da es standardmäßig auf `'/'` eingestellt ist.

   Wenn Sie auf `https://<BENUTZERNAME oder GRUPPE>.gitlab.io/<REPO>/` bereitstellen, z.B. wenn Ihr Repository unter `https://gitlab.com/<BENUTZERNAME>/<REPO>` zu finden ist, setzen Sie `base` auf `'/<REPO>/'`.

2. Erstellen Sie eine Datei namens `.gitlab-ci.yml` im Stammverzeichnis Ihres Projekts mit dem folgenden Inhalt. Dadurch wird Ihre Website erstellt und bereitgestellt, sobald Sie Änderungen an Ihrem Inhalt vornehmen:

   ```yaml [.gitlab-ci.yml]
   image: node:lts
   pages:
     stage: deploy
     cache:
       key:
         files:
           - package-lock.json
         prefix: npm
       paths:
         - node_modules/
     script:
       - npm install
       - npm run build
       - cp -a dist/. public/
     artifacts:
       paths:
         - public
     rules:
       - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
   ```

## Netlify

1. Installieren Sie die [Netlify CLI](https://cli.netlify.com/).
2. Erstellen Sie eine neue Website mit `ntl init`.
3. Bereitstellen Sie mit `ntl deploy`.

```bash
# Installieren Sie die Netlify CLI
$ npm install -g netlify-cli

# Erstellen Sie eine neue Website in Netlify
$ ntl init

# Bereitstellen Sie auf eine eindeutige Vorschau-URL
$ ntl deploy
```

Die Netlify CLI gibt Ihnen eine Vorschau-URL zur Überprüfung. Wenn Sie bereit sind, in die Produktion zu gehen, verwenden Sie die `--prod`-Flagge:

```bash
# Bereitstellen der Website in die Produktion
$ ntl deploy --prod
```

## Vercel

### Vercel CLI

1. Installieren Sie die [Vercel CLI](https://vercel.com/cli) und führen Sie `vercel` aus, um zu bereitstellen.
2. Vercel erkennt, dass Sie Vite verwenden, und aktiviert die richtigen Einstellungen für Ihre Bereitstellung.
3. Ihre Anwendung ist bereitgestellt! (z.B. [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

```bash
$ npm i -g vercel
$ vercel init vite
Vercel CLI
> Success! Initialized "vite" example in ~/your-folder.
- To deploy, `cd vite` and run `vercel`.
```

### Vercel für Git

1. Pushen Sie Ihren Code in Ihr Git-Repository (GitHub, GitLab, Bitbucket).
2. [Importieren Sie Ihr Vite-Projekt](https://vercel.com/new) in Vercel.
3. Vercel erkennt, dass Sie Vite verwenden, und aktiviert die richtigen Einstellungen für Ihre Bereitstellung.
4. Ihre Anwendung ist bereitgestellt! (z.B. `https://<PROJECTNAME>.vercel.app/`)

Nachdem Ihr Projekt importiert und bereitgestellt wurde, werden alle nachfolgenden Pushes auf Zweige [Preview-Bereitstellungen generieren](https://vercel.com/docs/concepts/deployments/environments#preview), und alle Änderungen am Produktionszweig (üblicherweise "main") führen zu einer [Produktionsbereitstellung](https://vercel.com/docs/concepts/deployments/environments#production).

Erfahren Sie mehr über die [Git-Integration von Vercel](https://vercel.com/docs/concepts/git).

## Cloudflare Pages

### Cloudflare Pages über Wrangler

1. Installieren Sie das [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/).
2. Authentifizieren Sie Wrangler mit Ihrem Cloudflare-Konto, indem Sie `wrangler login` ausführen.
3. Führen Sie Ihren Build-Befehl aus.
4. Stellen Sie es mit `npx wrangler pages deploy dist` bereit.

```bash
# Installieren Sie das Wrangler CLI
$ npm install -g wrangler

# Melden Sie sich von der Befehlszeile bei Ihrem Cloudflare-Konto an
$ wrangler login

# Führen Sie Ihren Build-Befehl aus
$ npm run build

# Erstellen Sie eine neue Bereitstellung
$ npx wrangler pages deploy dist
```

Nachdem Ihre Dateien hochgeladen wurden, gibt Ihnen Wrangler eine Vorschau-URL zum Überprüfen Ihrer Website. Wenn Sie sich im Cloudflare Pages-Dashboard anmelden, sehen Sie Ihr neues Projekt.

### Cloudflare Pages mit Git

1. Pushen Sie Ihren Code in Ihr Git-Repository (GitHub, GitLab).
2. Melden Sie sich im Cloudflare-Dashboard an und wählen Sie Ihr Konto unter **Account-Startseite** > **Pages** aus.
3. Wählen Sie **Neues Projekt erstellen** und die Option **Git verbinden**.
4. Wählen Sie das Git-Projekt aus, das Sie bereitstellen möchten, und klicken Sie auf **Einrichtung beginnen**.
5. Wählen Sie je nach dem von Ihnen ausgewählten Vite-Framework das entsprechende Framework-Preset in den Build-Einstellungen aus.
6. Dann speichern und bereitstellen!
7. Ihre Anwendung ist bereitgestellt! (z.B. `https://<PROJECTNAME>.pages.dev/`)

Nachdem Ihr Projekt importiert und bereitgestellt wurde, generieren alle nachfolgenden Pushes auf Branches [Preview-Bereitstellungen](https://developers.cloudflare.com/pages/platform/preview-deployments/), es sei denn, sie wurden in Ihren [Branch-Build-Steuerungen](https://developers.cloudflare.com/pages/platform/branch-build-controls/) ausgeschlossen. Alle Änderungen am Produktionszweig (üblicherweise "main") führen zu einer Produktionsbereitstellung.

Sie können auch benutzerdefinierte Domänen hinzufügen und benutzerdefinierte Build-Einstellungen auf Pages verwalten. Erfahren Sie mehr über [Cloudflare Pages Git-Integration](https://developers.cloudflare.com/pages/get-started/#manage-your-site).

## Google Firebase

1. Stellen Sie sicher, dass Sie [firebase-tools](https://www.npmjs.com/package/firebase-tools) installiert haben.

2. Erstellen Sie `firebase.json` und `.firebaserc` im Stammverzeichnis Ihres Projekts mit folgendem Inhalt:

   ```json [firebase.json]
   {
     "hosting": {
       "public": "dist",
       "ignore": [],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

   ```js [.firebaserc]
   {
     "projects": {
       "default": "<YOUR_FIREBASE_ID>"
     }
   }
   ```

3. Nach dem Ausführen von `npm run build` können Sie mit dem Befehl `firebase deploy` bereitstellen.

## Surge

1. Installieren Sie zuerst [Surge](https://www.npmjs.com/package/surge), wenn Sie dies noch nicht getan haben.

2. Führen Sie `npm run build` aus.

3. Bereitstellen Sie mit dem Befehl `surge dist`.

Sie können auch auf eine [benutzerdefinierte Domain](http://surge.sh/help/adding-a-custom-domain) bereitstellen, indem Sie `surge dist yourdomain.com` hinzufügen.

## Azure Static Web Apps

Sie können Ihre Vite-Anwendung schnell mit dem Microsoft Azure [Static Web Apps](https://aka.ms/staticwebapps)-Dienst bereitstellen. Sie benötigen:

- Ein Azure-Konto und einen Abonnement-Key. Sie können hier ein [kostenloses Azure-Konto erstellen](https://azure.microsoft.com/free).
- Ihren App-Code, der in [GitHub](https://github.com) gepusht wird.
- Die [SWA-Erweiterung](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) in [Visual Studio Code](https://code.visualstudio.com).

Installieren Sie die Erweiterung in VS Code und navigieren Sie zum Root-Verzeichnis Ihrer App. Öffnen Sie die Static Web Apps-Erweiterung, melden Sie sich bei Azure an und klicken Sie auf das '+'-Symbol, um eine neue Static Web App zu erstellen. Sie werden aufgefordert, zu kennzeichnen, welchen Abonnement-Key Sie verwenden möchten.

Folgen Sie dem Assistenten, der von der Erweiterung gestartet wird, um Ihrer App einen Namen zu geben, ein Framework-Preset auszuwählen und das App-Root-Verzeichnis (normalerweise `/`) und den Build-Datei-Speicherort `/dist` festzulegen. Der Assistent wird ausgeführt und erstellt einen GitHub-Workflow in Ihrem Repository in einem `.github`-Ordner.

Die Aktion wird dazu verwendet, Ihre App bereitzustellen (verfolgen Sie ihren Fortschritt im Tab "Aktionen" Ihres Repositorys) und sobald sie erfolgreich abgeschlossen ist, können Sie Ihre App über die in der Fortschrittsansicht der Erweiterung angezeigte Adresse durch Klicken auf die Schaltfläche "Website durchsuchen" anzeigen.

## Render

Sie können Ihre Vite-Anwendung als statische Website auf [Render](https://render.com/) bereitstellen.

1. Erstellen Sie ein [Render-Konto](https://dashboard.render.com/register).

2. Klicken Sie in der [Dashboard](https://dashboard.render.com/) auf die Schaltfläche **Neu** und wählen Sie **Statische Website** aus.

3. Verknüpfen Sie Ihr GitHub/GitLab-Konto oder verwenden Sie ein öffentliches Repository.

4. Geben Sie einen Projektnamen und einen Zweig an.
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. Klicken Sie auf **Statische Website erstellen**.

   Ihre App sollte unter `https://<PROJECTNAME>.onrender.com/` bereitgestellt sein.

Standardmäßig löst jede neue Änderung, die auf den angegebenen Zweig hochgeladen wird, automatisch eine neue Bereitstellung aus. [Auto-Deploy](https://render.com/docs/deploys#toggling-auto-deploy-for-a-service) kann in den Projekteinstellungen konfiguriert werden.

Sie können auch eine [benutzerdefinierte Domäne](https://render.com/docs/custom-domains) zu Ihrem Projekt hinzufügen.

<!--
  HINWEIS: Die folgenden Abschnitte sind für weitere, oben nicht aufgeführte Einsatzplattformen reserviert.
  Es steht Ihnen frei, einen PR einzureichen, der einen neuen Abschnitt mit einem Link zu Ihrer Plattform hinzufügt.
  Ein Deployment-Guide Ihrer Plattform wird hinzufügt, wenn er diese Kriterien erfüllt:

  1. Benutzer sollten ihre Seite kostenlos bereitstellen können.
  2. Kostenlose Angebote sollten die Website auf unbestimmte Zeit hosten und sind nicht zeitlich begrenzt.
     Das Angebot einer begrenzten Anzahl von Rechenressourcen oder der Anzahl von Websites im Austausch ist in Ordnung.
  3. Die verlinkten Anleitungen dürfen keine bösartigen Inhalte enthalten.

  Das Vite-Team kann die Kriterien ändern und die aktuelle Liste von Zeit zu Zeit überprüfen.
  Wenn ein Abschnitt entfernt wird, werden wir die ursprünglichen PR-Autoren vorher anpingen.
-->

## Flightcontrol

Stellen Sie Ihre statische Website mit [Flightcontrol](https://www.flightcontrol.dev/?ref=docs-vite) bereit, indem Sie diese [Anweisungen](https://www.flightcontrol.dev/docs/reference/examples/vite?ref=docs-vite) befolgen.

## Kinsta Hosting statischer Websites

Stellen Sie Ihre statische Website mit [Kinsta](https://kinsta.com/static-site-hosting/) bereit, indem Sie diese [Anweisungen](https://kinsta.com/docs/react-vite-example/) befolgen.

## xmit Hosting statischer Websites

Stellen Sie Ihre statische Website mit [xmit](https://xmit.co) bereit, indem Sie diese [Anleitung](https://xmit.dev/posts/vite-quickstart/) befolgen.

## Zephyr Cloud

[Zephyr Cloud](https://zephyr-cloud.io) ist eine Bereitstellungsplattform, die sich direkt in Ihren Build-Prozess integrieren lässt und eine globale Edge-Verteilung für Modulverbünde und andere Arten von Anwendungen bietet.

Zephyr verfolgt einen anderen Ansatz als andere Cloud-Anbieter. Es lässt sich direkt in den Vite-Build-Prozess integrieren, sodass jedes Mal, wenn Sie den Entwicklungsserver für Ihre Anwendung erstellen oder ausführen, dieser automatisch mit Zephyr Cloud bereitgestellt wird.

Befolgen Sie die Schritte im [Leitfaden für die Bereitstellung mit Vite](https://docs.zephyr-cloud.io/recipes/react-vite), um zu starten.