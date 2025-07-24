---
title: "getBlock"
description: "getBlock function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-react-native/../sdk/src/build/build-get-block.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-react-native/../sdk/src/build/build-get-block.ts). DO NOT EDIT MANUALLY -->

# getBlock

A builder function that returns the interaction to get the latest block.

Use with 'fcl.atBlockId()' and 'fcl.atBlockHeight()' when building the interaction to get information for older blocks.

Consider using the pre-built interaction 'fcl.block(options)' if you do not need to pair with any other builders.

Block ID is SHA3-256 hash of the entire block payload. This hash is stored as an ID field on any block response object (ie. response from 'GetLatestBlock').

Block height expresses the height of the block on the chain. The latest block height increases by one for every valid block produced.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-react-native"

fcl.getBlock(isSealed)
```

Or import directly the specific function:

```typescript
import { getBlock } from "@onflow/fcl-react-native"

getBlock(isSealed)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

const latestSealedBlock = await fcl.send([
  fcl.getBlock(true) // isSealed = true
]).then(fcl.decode);
```

## Parameters

### `isSealed` (optional)


- Type: `boolean`
- Description: If the latest block should be sealed or not. See block states


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A function that processes an interaction object

---