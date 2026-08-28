Note that to use ES modules syntax in the config file, it should be in a file detected as ESM by Node.js, e.g. `.mjs` or `.js` with `"type": "module"` in closest `package.json`.
By default, Vite uses [Rolldown](https://rolldown.rs/) to bundle the config into a temporary file and load it. If you're using an environment that supports TypeScript (e.g. Node 22.18+), or if you're only writing plain JavaScript, you can specify `--configLoader native` to use the environment's native runtime to load the config file. `configLoader: 'native'` is planned to become the default in a future major version.
## Debugging the Config File in VS Code
For the most reliable debugging experience, use the native config loader when starting Vite:

```bash
vite --configLoader native
```

The native loader executes the original config file directly, so breakpoints in the config file and in plugin hooks such as `transform` map to the original source. It requires a runtime that supports the syntax used by your config file, such as Node.js 22.18+ for TypeScript files.

When using `--configLoader bundle` (the current default, though `native` is planned to become the default in a future major version), Vite generates an inline source map and writes the bundled config to `node_modules/.vite-temp` before loading it. If you need to use the bundle loader, add the temporary directory for the JavaScript Debug Terminal in `.vscode/settings.json`:

This setting only applies to the JavaScript Debug Terminal, it does not affect launch configurations started from the Run and Debug view. To support this for the Run and Debug view, add the temporary directory in `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Vite",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["exec", "vite", "--configLoader", "bundle"],
      "console": "integratedTerminal",
      "sourceMaps": true,
      "resolveSourceMapLocations": [
        "${workspaceFolder}/**",
        "!**/node_modules/**",
        "**/node_modules/.vite-temp/**"
      ]
    }
  ]
}
```