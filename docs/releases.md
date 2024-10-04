# Veröffentlichungen

Vite-Veröffentlichungen folgen dem [Semantischen Versionierungsprinzip (Semantic Versioning)](https://semver.org/). Sie können die neueste stabile Version von Vite auf der [Vite npm-Paketseite](https://www.npmjs.com/package/vite) sehen.

Ein vollständiges Änderungsprotokoll vergangener Veröffentlichungen finden Sie [auf GitHub](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md).

## Veröffentlichungszyklus

Vite hat keinen festen Veröffentlichungszyklus.

- **Patch**-Versionen werden nach Bedarf veröffentlicht (normalerweise jede Woche).
- **Minor**-Versionen enthalten immer neue Funktionen und werden je nach Bedarf veröffentlicht. Minor-Releases haben immer eine Beta-Phase vor der Veröffentlichung (normalerweise alle zwei Monate).
- **Hauptversionen** richten sich im Allgemeinen nach dem [Node.js EOL-Zeitplan](https://endoflife.date/nodejs) und werden im Voraus angekündigt. Diese Versionen durchlaufen langfristige Diskussionen mit dem Ökosystem und haben Alpha- und Beta-Vorveröffentlichungsphasen (in der Regel jedes Jahr).

Der Bereich der Vite-Versionen, die vom Vite-Team unterstützt werden, wird automatisch bestimmt durch:

- **Aktuelles Minor** erhält regelmäßige Korrekturen.
- **Voriges Major** (nur für sein letztes Minor) und **Voriges Minor** erhält wichtige Korrekturen und Sicherheitspatches.
- **Vorletztes Major** (nur für das letzte Minor) und **Vorletztes Minor** erhält Sicherheitspatches.
- Alle Versionen davor werden nicht mehr unterstützt.

Ein Beispiel: Die neueste Version von Vite ist 5.3.10:

- Regelmäßige Patches werden für `vite@5.3` veröffentlicht.
- Wichtige Korrekturen und Sicherheitspatches werden auf `vite@4` und `vite@5.2` zurückportiert.
- Sicherheitspatches werden auch in `vite@3` und `vite@5.1` zurückportiert.
- `vite@2` und `vite@5.0` werden nicht mehr unterstützt. Benutzer sollten aktualisieren, um Updates zu erhalten.

Wir empfehlen, Vite regelmäßig zu aktualisieren. Schauen Sie sich die [Migration Guides](https://vite.dev/guide/migration.html) an, wenn Sie auf ein neues Major aktualisieren. Das Vite-Team arbeitet eng mit den wichtigsten Projekten im Ökosystem zusammen, um die Qualität neuer Versionen zu gewährleisten. Wir testen neue Vite-Versionen, bevor wir sie über das [vite-ecosystem-ci project](https://github.com/vitejs/vite-ecosystem-ci) freigeben. Die meisten Projekte, die Vite verwenden, sollten in der Lage sein, schnell Unterstützung anzubieten oder auf neue Versionen zu migrieren, sobald diese veröffentlicht werden.

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

Gelegentlich veralten Funktionen, die durch bessere Alternativen ersetzt wurden, in Minor-Veröffentlichungen. Veraltete Funktionen funktionieren weiterhin mit einem Typ oder einer protokollierten Warnung. Sie werden in der nächsten Hauptveröffentlichung nach dem Status "veraltet" entfernt. Die [Migrationsanleitung (Migration Guide)](https://vite.dev/guide/migration.html) für jede Hauptveröffentlichung enthält diese Entfernungen und dokumentiert einen Aktualisierungspfad für sie.

## Experimentelle Funktionen

Einige Funktionen werden als experimentell gekennzeichnet, wenn sie in einer stabilen Version von Vite veröffentlicht werden. Experimentelle Funktionen ermöglichen es uns, Erfahrungen aus der Praxis zu sammeln, um das endgültige Design zu beeinflussen. Das Ziel ist es, den Benutzern die Möglichkeit zu geben, Feedback zu geben, indem sie die Funktionen in der Produktion testen. Experimentelle Funktionen selbst gelten als instabil und sollten nur kontrolliert verwendet werden. Diese Funktionen können sich von Minor zu Minor ändern, daher müssen die Benutzer ihre Vite-Version festhalten, wenn sie sich auf sie verlassen. Wir werden [eine GitHub-Diskussion](https://github.com/vitejs/vite/discussions/categories/feedback?discussions_q=is%3Aopen+label%3Aexperimental+category%3AFeedback) für jede experimentelle Funktion erstellen.
