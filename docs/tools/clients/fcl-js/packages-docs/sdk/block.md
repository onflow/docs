---
sidebar_position: 1
title: "block"
description: "block function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/block/block.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/block/block.ts). DO NOT EDIT MANUALLY -->

# block

Query the network for block by id, height or get the latest block.

Block ID is SHA3-256 hash of the entire block payload. This hash is stored as an ID field on any block response object (ie. response from `GetLatestBlock`).

Block height expresses the height of the block on the chain. The latest block height increases by one for every valid block produced.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.block(blockQueryOptions, opts)
```

Or import directly the specific function:

```typescript
import { block } from "@onflow/sdk"

block(blockQueryOptions, opts)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Get latest block
const latestBlock = await fcl.block(); // Get the latest finalized block
const latestSealedBlock = await fcl.block({sealed: true}); // Get the latest sealed block

// Get block by ID (uses builder function)
await fcl.send([fcl.getBlock(), fcl.atBlockId("23232323232")]).then(fcl.decode);

// Get block at height (uses builder function)
await fcl.send([fcl.getBlock(), fcl.atBlockHeight(123)]).then(fcl.decode)
```

## Parameters

### `blockQueryOptions` (optional)


- Type: 
```typescript
interface BlockQueryOptions {
  sealed?: boolean
  height?: number
  id?: string
}
```

### `opts` (optional)


- Type: `object`
- Description: Optional parameters


## Returns

[`Promise<Block>`](../types#block)


A promise that resolves to a Block object

---