---
sidebar_position: 1
title: "decodeResponse"
description: "decodeResponse function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/decode/decode.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/decode/decode.ts). DO NOT EDIT MANUALLY -->

# decodeResponse

Decodes a response from Flow into JSON

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.decodeResponse(response, customDecoders)
```

Or import directly the specific function:

```typescript
import { decodeResponse } from "@onflow/sdk"

decodeResponse(response, customDecoders)
```


## Parameters

### `response` 

- Type: `FlowResponse`
- Description: The response object from Flow

```typescript
interface FlowResponse {
  encodedData?: DecodeInstructions
  transactionStatus?: FlowTransactionStatus
  transaction?: any
  events?: FlowBlockEvent[]
  account?: any
  block?: any
  blockHeader?: any
  blockDigest?: any
  event?: any
  accountStatusEvent?: any
  latestBlock?: any
  transactionId?: string
  collection?: any
  networkParameters?: {
    chainId: string
  }
  streamConnection?: any
  heartbeat?: any
  nodeVersionInfo?: any
}
```

### `customDecoders` (optional)

- Type: `DecoderMap`
- Description: An object of custom decoders

```typescript
interface DecoderMap {
  [key: string]: DecoderFunction
}
```


## Returns

`Promise<any>`


---