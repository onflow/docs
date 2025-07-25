---
title: "createSdkClient"
description: "createSdkClient function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/sdk-client.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/sdk-client.ts). DO NOT EDIT MANUALLY -->

# createSdkClient

Creates an SDK client with the provided options.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.createSdkClient(options)
```

Or import directly the specific function:

```typescript
import { createSdkClient } from "@onflow/sdk"

createSdkClient(options)
```

## Usage

```typescript
const client = createSdkClient({
 accessNodeUrl: "https://rest-mainnet.onflow.org",
 transport: myTransport,
 computeLimit: 1000,
})
client.send([myScript, myTransaction])
  .then(client.decode)
  .catch(error => console.error("Error sending request:", error))
```

## Parameters

### `options` 


- Type: 
```typescript
export interface SdkClientOptions {
  accessNodeUrl: string
  transport: SdkTransport
  computeLimit: number
  contracts?: {
    [contractName: string]: string
  }
  customResolver?: (args: any) => Promise<any>
  customDecoders?: {[key: string]: (data: any) => any}
}
```
- Description: - Configuration options for the SDK client.


## Returns

`Promise<any>`


A client object with methods to interact with the Flow blockchain.

---