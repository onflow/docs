---
sidebar_position: 1
title: "getLatestBlock"
description: "getLatestBlock function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/build/build-get-latest-block.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/build/build-get-latest-block.ts). DO NOT EDIT MANUALLY -->

# getLatestBlock

A builder function that returns the interaction to get the latest block This...

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.getLatestBlock(isSealed)
```

Or import directly the specific function:

```typescript
import { getLatestBlock } from "@onflow/sdk"

getLatestBlock(isSealed)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Get the latest executed block (soft finality)
const latestBlock = await fcl.send([fcl.getLatestBlock()]).then(fcl.decode);
console.log("Latest block height:", latestBlock.height);
console.log("Block ID:", latestBlock.id);
console.log("Block timestamp:", latestBlock.timestamp);

// Get the latest sealed block (hard finality)
const sealedBlock = await fcl.send([fcl.getLatestBlock(true)]).then(fcl.decode);
console.log("Latest sealed block height:", sealedBlock.height);

// Use in combination with other builders
const blockInfo = await fcl.send([
  fcl.getLatestBlock(),
  // Additional builders can be added here
]).then(fcl.decode);
```

## Parameters

### `isSealed` (optional)

- Type: `boolean`
- Description: Whether or not the block should be sealed (defaults to false for executed blocks)



## Returns

`InteractionBuilderFn`

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```

---