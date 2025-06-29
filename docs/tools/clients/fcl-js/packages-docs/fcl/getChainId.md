---
sidebar_position: 1
title: "getChainId"
description: "getChainId function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/src/fcl.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/src/fcl.ts). DO NOT EDIT MANUALLY -->

# getChainId

Gets the chain ID if its set, otherwise gets the chain ID from the access node

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.getChainId(opts)
```

Or import directly the specific function:

```typescript
import { getChainId } from "@onflow/fcl"

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


## Returns

`Promise<string>`


Promise that resolves to the chain ID string (e.g., "mainnet", "testnet", "local")

---