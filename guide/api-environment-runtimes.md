            hot: true,
            transport: customHotChannel(),
import { DevEnvironment, HotChannel } from 'vite'
  const transport: HotChannel = {
    on: (listener) => { connection.on('message', listener) },
  }
    hot: true,
    transport,
import { root, transport } from './rpc-implementation.js'
    transport,
  transport: ModuleRunnerTransport
## `ModuleRunnerTransport`
interface ModuleRunnerTransport {
  connect?(handlers: ModuleRunnerTransportHandlers): Promise<void> | void
  disconnect?(): Promise<void> | void
  send?(data: HotPayload): Promise<void> | void
  invoke?(
    data: HotPayload,
  ): Promise<{ /** result */ r: any } | { /** error */ e: any }>
  timeout?: number
Transport object that communicates with the environment via an RPC or by directly calling the function. When `invoke` method is not implemented, the `send` method and `connect` method is required to be implemented. Vite will construct the `invoke` internally.

You need to couple it with the `HotChannel` instance on the server like in this example where module runner is created in the worker thread:
```js [worker.js]
import { ESModulesEvaluator, ModuleRunner } from 'vite/module-runner'

/** @type {import('vite/module-runner').ModuleRunnerTransport} */
const transport = {
  connect({ onMessage, onDisconnection }) {
    parentPort.on('message', onMessage)
    parentPort.on('close', onDisconnection)
  },
  send(data) {
    parentPort.postMessage(data)
  },
}
    transport,
```js [server.js]
  const handlerToWorkerListener = new WeakMap()

  const workerHotChannel = {
    send: (data) => w.postMessage(data),
    on: (event, handler) => {
      if (event === 'connection') return

      const listener = (value) => {
        if (value.type === 'custom' && value.event === event) {
          const client = {
            send(payload) {
              w.postMessage(payload)
            },
          }
          handler(value.data, client)
        }
      }
      handlerToWorkerListener.set(handler, listener)
      w.on('message', listener)
    },
    off: (event, handler) => {
      if (event === 'connection') return
      const listener = handlerToWorkerListener.get(handler)
      if (listener) {
        w.off('message', listener)
        handlerToWorkerListener.delete(handler)
      }
  }

  return new DevEnvironment(name, config, {
    transport: workerHotChannel,
A different example using an HTTP request to communicate between the runner and the server:
      async invoke(data) {
        const response = await fetch(`http://my-vite-server/invoke`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
In this case, the `handleInvoke` method in the `NormalizedHotChannel` can be used:
const customEnvironment = new DevEnvironment(name, config, context)

server.onRequest((request: Request) => {
  const url = new URL(request.url)
  if (url.pathname === '/invoke') {
    const payload = (await request.json()) as HotPayload
A Vite Module Runner allows running any code by processing it with Vite plugins first. It is different from `server.ssrLoadModule` because the runner implementation is decoupled from the server. This allows library and framework authors to implement their layer of communication between the Vite server and the runner. The browser communicates with its corresponding environment using the server WebSocket and through HTTP requests. The Node Module runner can directly do function calls to process modules as it is running in the same process. Other environments could run modules connecting to a JS runtime like workerd, or a Worker Thread as Vitest does.
    return new Response(JSON.stringify(result))
  }
  return Response.error()
})
But note that for HMR support, `send` and `connect` methods are required. The `send` method is usually called when the custom event is triggered (like, `import.meta.hot.send("my-event")`).
Vite exports `createServerHotChannel` from the main entry point to support HMR during Vite SSR.
  const client = {
    send(payload: HotPayload) {
      worker.postMessage(payload)
    },
  }
      // client is already connected
      if (event === 'vite:client:connect') return
      if (event === 'vite:client:disconnect') {
        const listener = () => {
          handler(undefined, client)
        }
        handlerToWorkerListener.set(handler, listener)
        worker.on('exit', listener)
        return
      }
      if (event === 'vite:client:connect') return
      if (event === 'vite:client:disconnect') {
        const listener = handlerToWorkerListener.get(handler)
        if (listener) {
          worker.off('exit', listener)
          handlerToWorkerListener.delete(handler)
        }
        return
      }

Make sure to implement the `vite:client:connect` / `vite:client:disconnect` events in the `on` / `off` methods when those methods exist. `vite:client:connect` event should be emitted when the connection is established, and `vite:client:disconnect` event should be emitted when the connection is closed. The `HotChannelClient` object passed to the event handler must have the same reference for the same connection.
