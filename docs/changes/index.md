# Grundlegende Änderungen

Eine Liste der wesentlichen Änderungen in Vite, einschließlich API-Veraltungen, Entfernungen und Änderungen. Der Großteils der unten genannten Änderungen kann durch das Angeben der [`future`-Option](/config/shared-options.html#future) in der Vite-Konfiugration verwendet werden.

## Geplant

Die Änderungen sind für die nächste Hauptversion von Vite geplant. Die Verwendungswarnungen und Hinweise zur Abkündigung werden Ihnen, soweit möglich, als Orientierung dienen. Wir wenden uns auch an Framework- und Plugin-Autoren sowie an Nutzer, um diese Änderungen umzusetzen.

- [`this.environment` in Hooks](/changes/this-environment-in-hooks)
- [HMR `hotUpdate` Plugin Hook](/changes/hotupdate-hook)
- [SSR verwendet die `ModuleRunner` API](/changes/ssr-using-modulerunner)

## In Prüfung

Diese Änderungen werden derzeit noch geprüft und sind oft experimentelle APIs, die zukünftige Nutzungsmustern verbessern sollen. Schauen Sie bitte in die [Vite GitHub Diskussionen mit dem "Experimental"-Label](https://github.com/vitejs/vite/discussions/categories/feedback?discussions_q=label%3Aexperimental+category%3AFeedback), da nicht alle Änderungen hier gelistet werden.

Wir empfehlen es noch nicht, zu diesen APIs zu wechseln. Sie sind nur in Vite enthalten, um Rückmeldungen zu sammeln. Schauen Sie sich gern diese Vorschläge an und teilen Sie uns in den jeweiligen GitHub-Diskussionen mit, wie sie sich für Ihren Anwendungsfall eignen.

- [Umstellung auf umgebungsbezogene APIs](/changes/per-environment-apis)
- [Gemeinsam genutzte Plugins während der Erstellung](/changes/shared-plugins-during-build)

## Vergangen

Die unten gelisteten Änderungen wurden in der Vergangenheit implementiert oder zurückgesetzt. Für die aktuelle Hauptversion sind sie nicht länger relevant.

- _Noch keine vergangenen Änderungen_
