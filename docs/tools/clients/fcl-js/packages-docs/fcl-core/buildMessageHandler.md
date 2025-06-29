---
sidebar_position: 1
title: "buildMessageHandler"
description: "buildMessageHandler function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/src/current-user/exec-service/strategies/utils/buildMessageHandler.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/src/current-user/exec-service/strategies/utils/buildMessageHandler.ts). DO NOT EDIT MANUALLY -->

# buildMessageHandler

Creates a message handler for processing window messages from wallet service
frames or popups. This handler manages the communication protocol between FCL and wallet
services, including ready states, responses, and cleanup operations.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.buildMessageHandler(buildMessageHandlerParams)
```

Or import directly the specific function:

```typescript
import { buildMessageHandler } from "@onflow/fcl-core"

buildMessageHandler(buildMessageHandlerParams)
```

## Usage

```typescript
// Create a message handler for wallet communication
const handler = buildMessageHandler({
  close: () => cleanup(),
  send: (msg) => postMessage(msg),
  onReady: (e, utils) => initializeWallet(utils),
  onResponse: (e, utils) => handleResponse(e.data),
  onMessage: (e, utils) => processMessage(e),
  onCustomRpc: (payload, utils) => handleRpc(payload)
})
window.addEventListener("message", handler)
```

## Parameters

### `buildMessageHandlerParams` 


- Type: 
```typescript
export interface BuildMessageHandlerParams {
  close: () => void
  send: (msg: any) => void
  onReady: (
    e: MessageEvent,
    utils: {send: (msg: any) => void; close: () => void}
  ) => void
  onResponse: (
    e: MessageEvent,
    utils: {send: (msg: any) => void; close: () => void}
  ) => void
  onMessage: (
    e: MessageEvent,
    utils: {send: (msg: any) => void; close: () => void}
  ) => void
  onCustomRpc: (
    payload: any,
    utils: {send: (msg: any) => void; close: () => void}
  ) => void
  getSource?: () => Window | null
}
```


## Returns

```typescript
(e: MessageEvent<any>) => void
```


Message event handler function that can be attached to window message listeners

---