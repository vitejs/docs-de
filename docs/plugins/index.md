# Plugins

:::tip HINWEIS
Vite zielt darauf ab, Out-of-the-Box-Unterstützung für gängige Webentwicklungsmuster zu bieten. Bevor Sie nach einem Vite- oder kompatiblen Rollup-Plugin suchen, sollten Sie sich die [Anleitung der Funktionen](../guide/features.md) ansehen. Viele der Fälle, in denen ein Plugin für ein Rollup-Projekt benötigt wird, sind bereits in Vite abgedeckt.
:::

Unter [Plugins verwenden](../guide/using-plugins) finden Sie Informationen über die Verwendung von Plugins.

## Offizielle Plugins

### [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

- Bietet Unterstützung für Vue 3 Single File Components.

### [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)

- Bietet Vue 3 JSX-Unterstützung (über [dedicated Babel transform](https://github.com/vuejs/jsx-next)).

### [@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)

- Bietet Unterstützung für Vue 2 Single File Components.

### [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)

- Verwendet esbuild und Babel und erreicht so ein schnelles HMR mit geringem Paketplatzbedarf und der Flexibilität, die Babel-Transformationspipeline verwenden zu können. Ohne zusätzliche Babel-Plugins wird nur esbuild während der Builds verwendet.

### [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)

- Ersetzt Babel durch SWC während der Entwicklung. Während der Builds werden SWC+esbuild verwendet, wenn Plugins verwendet werden, und ansonsten nur esbuild. Bei großen Projekten, die keine nicht standardmäßigen React-Erweiterungen erfordern, können der Kaltstart und das Hot Module Replacement (HMR) deutlich schneller sein.

### [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)

- Bietet Unterstützung für Legacy-Browser für den produktiven Build.

## Plugins der Community

Schauen Sie sich [awesome-vite](https://github.com/vitejs/awesome-vite#plugins) an - Sie können auch einen Pull Request einreichen, um Ihre Plugins dort aufzulisten.

## Rollup Plugins

[Vite-Plugins](../guide/api-plugin) sind eine Erweiterung der Plugin-Schnittstelle von Rollup. Weitere Informationen finden Sie im Abschnitt [Rollup-Plugin-Kompatibilität](../guide/api-plugin#rollup-plugin-compatibility).
