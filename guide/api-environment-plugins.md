      // return true if this plugin should be active in this environment,
      // or return a new plugin to replace it.
If a plugin isn't environment aware and has state that isn't keyed on the current environment, the `applyToEnvironment` hook allows to easily make it per-environment.

```js
import { nonShareablePlugin } from 'non-shareable-plugin'

export default defineConfig({
  plugins: [
    {
      name: 'per-environment-plugin',
      applyToEnvironment(environment) {
        return nonShareablePlugin({ outputName: environment.name })
      },
    },
  ],
})
```

Vite exports a `perEnvironmentPlugin` helper to simplify these cases where no other hooks are required:

```js
import { nonShareablePlugin } from 'non-shareable-plugin'

export default defineConfig({
  plugins: [
    perEnvironmentPlugin('per-environment-plugin', (environment) =>
      nonShareablePlugin({ outputName: environment.name }),
    ),
  ],
})
```

## Application-Plugin Communication

`environment.hot` allows plugins to communicate with the code on the application side for a given environment. This is the equivalent of [the Client-server Communication feature](/guide/api-plugin#client-server-communication), but supports environments other than the client environment.

:::warning Note

Note that this feature is only available for environments that supports HMR.

:::

### Managing the Application Instances

Be aware that there might be multiple application instances running in the same environment. For example, if you multiple tabs open in the browser, each tab is a separate application instance and have a separate connection to the server.

When a new connection is established, a `vite:client:connect` event is emitted on the environment's `hot` instance. When the connection is closed, a `vite:client:disconnect` event is emitted.

Each event handler receives the `NormalizedHotChannelClient` as the second argument. The client is an object with a `send` method that can be used to send messages to that specific application instance. The client reference is always the same for the same connection, so you can keep it to track the connection.

### Example Usage

The plugin side:

```js
configureServer(server) {
  server.environments.ssr.hot.on('my:greetings', (data, client) => {
    // do something with the data,
    // and optionally send a response to that application instance
    client.send('my:foo:reply', `Hello from server! You said: ${data}`)
  })

  // broadcast a message to all application instances
  server.environments.ssr.hot.send('my:foo', 'Hello from server!')
}
```

The application side is same with the Client-server Communication feature. You can use the `import.meta.hot` object to send messages to the plugin.

Given that the same plugin instance is used for different environments, the plugin state needs to be keyed with `this.environment`. This is the same pattern the ecosystem has already been using to keep state about modules using the `ssr` boolean as key to avoid mixing client and ssr modules state. A `Map<Environment, State>` can be used to keep the state for each environment separately. Note that for backward compatibility, `buildStart` and `buildEnd` are only called for the client environment without the `perEnvironmentStartEndDuringDev: true` flag. Same for `watchChange` and the `perEnvironmentWatchChangeDuringDev: true` flag.