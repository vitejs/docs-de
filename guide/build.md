  input: {
    main: resolve(import.meta.dirname, 'index.html'),
    nested: resolve(import.meta.dirname, 'nested/index.html'),
import { resolve } from 'node:path'
import { resolve } from 'node:path'
import { resolve } from 'node:path'
By default, the production bundle targets the minimum browser versions compatible with [Baseline](https://web-platform-dx.github.io/baseline/) Widely Available as of a date fixed for each major release. The default browser support range for this major is:
You can enable Rolldown watcher with `vite build --watch`. Or, you can directly adjust the underlying [`WatcherOptions`](https://rolldown.rs/reference/InputOptions.watch) via `build.watch`:
When a new deployment occurs, the hosting service may delete the assets from previous deployments. As a result, a user who visited your site before the new deployment might encounter an import error. This error happens because the assets running on that user's device are outdated and the code tries to import the corresponding old chunk, which is deleted. This event is useful for addressing this situation. In this case, make sure to set `Cache-Control: no-cache` on the HTML file, otherwise the old assets will be still referenced.