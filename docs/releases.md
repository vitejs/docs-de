# Veröffentlichungen

Vite-Veröffentlichungen folgen dem [Semantischen Versionierungsprinzip (Semantic Versioning)](https://semver.org/). Sie können die neueste stabile Version von Vite auf der [Vite npm-Paketseite](https://www.npmjs.com/package/vite) sehen.

Ein vollständiges Änderungsprotokoll vergangener Veröffentlichungen finden Sie [auf GitHub](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md).

## Veröffentlichungszyklus

Vite hat keinen festen Veröffentlichungszyklus.

- **Patch**-Veröffentlichungen werden bei Bedarf veröffentlicht.
- **Minor**-Veröffentlichungen enthalten immer neue Funktionen und werden ebenfalls bei Bedarf veröffentlicht. Minor-Veröffentlichungen durchlaufen immer eine Beta-Vorabveröffentlichungsphase.
- **Major**-Veröffentlichungen stimmen im Allgemeinen mit dem [Node.js EOL-Zeitplan](https://endoflife.date/nodejs) überein und werden im Voraus angekündigt. Diese Veröffentlichungen durchlaufen eine frühe Diskussionsphase sowie Alpha- und Beta-Vorabveröffentlichungsphasen.

Die vorherige Hauptversion von Vite erhält weiterhin wichtige Fehlerbehebungen und Sicherheitsaktualisierungen. Danach erhält sie nur noch Updates, wenn Sicherheitsbedenken bestehen. Wir empfehlen, Vite regelmäßig zu aktualisieren. Werfen Sie einen Blick auf die [Migrationsanleitungen (Migration Guides)](https://vitejs.dev/guide/migration.html), wenn Sie auf eine neue Hauptversion aktualisieren.

Das Vite-Team arbeitet mit den Hauptprojekten im Ökosystem zusammen, um neue Vite-Versionen zu testen, bevor sie über das [vite-ecosystem-ci-Projekt](https://github.com/vitejs/vite-ecosystem-ci) veröffentlicht werden. Die meisten Projekte, die Vite verwenden, sollten in der Lage sein, schnell Unterstützung anzubieten oder auf neue Versionen umzusteigen, sobald sie veröffentlicht werden.

## Randfälle der Semantischen Versionierung

### TypeScript-Definitionen

Zwischen Minor-Versionen können wir inkompatible Änderungen an TypeScript-Definitionen vornehmen. Dies liegt daran:

- Manchmal bringt TypeScript selbst inkompatible Änderungen zwischen Minor-Versionen heraus, und wir müssen die Typen anpassen, um neuere Versionen von TypeScript zu unterstützen.
- Gelegentlich müssen wir Funktionen übernehmen, die nur in einer neueren Version von TypeScript verfügbar sind, was die Mindestanforderung an die TypeScript-Version erhöht.
- Wenn Sie TypeScript verwenden, können Sie einen Semver-Bereich verwenden, der die aktuelle Minor-Version sperrt, und manuell aktualisieren, wenn eine neue Minor-Version von Vite veröffentlicht wird.

### esbuild

[esbuild](https://esbuild.github.io/) hat die Version 1.0.0 noch nicht erreicht, und manchmal gibt es eine breaking change, die wir aufnehmen müssen, um Zugriff auf neuere Funktionen und Leistungsverbesserungen zu haben. Wir können die esbuild-Version in einer Vite-Minor-Version aktualisieren.

### Node.js nicht-LTS-Versionen

Nicht-LTS-Versionen von Node.js (ungerade Versionen) werden nicht als Teil der CI-Tests von Vite getestet, sollten jedoch vor ihrem [EOL (Ende des Lebenszyklus)](https://endoflife.date/nodejs) immer funktionieren.

## Vorabveröffentlichungen

Minor-Veröffentlichungen durchlaufen in der Regel eine nicht festgelegte Anzahl von Beta-Veröffentlichungen. Major-Veröffentlichungen durchlaufen eine Alpha-Phase und eine Beta-Phase.

Vorabveröffentlichungen ermöglichen es Early Adopters und Maintainern aus dem Ökosystem, Integrationstests und Stabilitätstests durchzuführen und Feedback zu geben. Verwenden Sie Vorabveröffentlichungen nicht in der Produktion. Alle Vorabveröffentlichungen gelten als instabil und können zwischenzeitlich breaking changes enthalten. Verwenden Sie immer genaue Versionen, wenn Sie Vorabveröffentlichungen verwenden.

## Veraltungen

Gelegentlich veralten Funktionen, die durch bessere Alternativen ersetzt wurden, in Minor-Veröffentlichungen. Veraltete Funktionen funktionieren weiterhin mit einem Typ oder einer protokollierten Warnung. Sie werden in der nächsten Hauptveröffentlichung nach dem Status "veraltet" entfernt. Die [Migrationsanleitung (Migration Guide)](https://vitejs.dev/guide/migration.html) für jede Hauptveröffentlichung enthält diese Entfernungen und dokumentiert einen Aktualisierungspfad für sie.

## Experimentelle Funktionen

Einige Funktionen werden als experimentell markiert, wenn sie in einer stabilen Version von Vite veröffentlicht werden. Experimentelle Funktionen ermöglichen es uns, Erfahrungen in der realen Welt zu sammeln, um ihr endgültiges Design zu beeinflussen. Ziel ist es, Benutzern durch Tests in der Produktion die Möglichkeit zu geben, Feedback zu geben. Experimentelle Funktionen selbst gelten als instabil und sollten nur kontrolliert verwendet werden. Diese Funktionen können sich zwischen Minor-Versionen ändern, daher müssen Benutzer ihre Vite-Version festlegen, wenn sie von ihnen abhängen.
