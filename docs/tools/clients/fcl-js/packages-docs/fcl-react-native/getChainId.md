---
title: "getChainId"
description: "getChainId function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-react-native/src/fcl-react-native.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-react-native/src/fcl-react-native.ts). DO NOT EDIT MANUALLY -->

# getChainId

Gets the chain ID if its set, otherwise gets the chain ID from the access node

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-react-native"

fcl.getChainId(opts)
```

Or import directly the specific function:

```typescript
import { getChainId } from "@onflow/fcl-react-native"

getChainId(opts)
```

## Usage

```typescript
// Get chain ID using configured access node
import * as fcl from "@onflow/fcl"

const chainId = await fcl.getChainId()
console.log("Connected to:", chainId) // "testnet" or "mainnet"
```

## Parameters

### `opts` (optional)


- Type: 
```typescript
export interface GetChainIdOptions {
  node?: unknown
  enableRequestLogging?: boolean
  [key: string]: any
}
```
- Description: Optional configuration parameters

#### Properties:

- **`node`**  - Override the access node URL for this request instead of using the configured one
- **`enableRequestLogging`**  - Enable logging for the chain ID request


## Returns

`Promise<string>`


Promise that resolves to the chain ID string (e.g., "mainnet", "testnet", "local")

---