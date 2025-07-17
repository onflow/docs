---
title: "getBlockHeader"
description: "getBlockHeader function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-react-native/../sdk/src/build/build-get-block-header.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-react-native/../sdk/src/build/build-get-block-header.ts). DO NOT EDIT MANUALLY -->

# getBlockHeader

A builder function that returns the interaction to get a block header.

A block header contains metadata about a block without the full transaction details, making it more
lightweight than fetching the entire block. This is useful when you only need block metadata like
timestamp, height, parent hash, etc.

Use with 'fcl.atBlockId()' and 'fcl.atBlockHeight()' when building the interaction to get headers for specific blocks.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-react-native"

fcl.getBlockHeader(isSealed)
```

Or import directly the specific function:

```typescript
import { getBlockHeader } from "@onflow/fcl-react-native"

getBlockHeader(isSealed)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Get latest sealed block header
const sealedHeader = await fcl.send([
  fcl.getBlockHeader(true)
]).then(fcl.decode);

console.log("Block height:", sealedHeader.height);
console.log("Block timestamp:", sealedHeader.timestamp);
console.log("Parent block ID:", sealedHeader.parentId);

// Get header for specific block
const blockHeader = await fcl.send([
  fcl.getBlockHeader(),
  fcl.atBlockHeight(12345)
]).then(fcl.decode);

// Get latest finalized block header
const finalizedHeader = await fcl.send([
  fcl.getBlockHeader(false)
]).then(fcl.decode);
```

## Parameters

### `isSealed` (optional)


- Type: `boolean`
- Description: Block finality state, true for sealed blocks, false for finalized blocks, null for latest


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A function that processes an interaction object

---