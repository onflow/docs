---
title: "atBlockHeight"
description: "atBlockHeight function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/build/build-at-block-height.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/build/build-at-block-height.ts). DO NOT EDIT MANUALLY -->

# atBlockHeight

A builder function that returns a partial interaction to a block at a specific height.

Use with other interactions like 'fcl.getBlock()' to get a full interaction at the specified block height.

Block height expresses the height of the block on the chain. The latest block height increases by one for every valid block produced.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.atBlockHeight(height)
```

Or import directly the specific function:

```typescript
import { atBlockHeight } from "@onflow/sdk"

atBlockHeight(height)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Get block at specific height
await fcl.send([fcl.getBlock(), fcl.atBlockHeight(123)]).then(fcl.decode);

// Get account at specific block height
await fcl.send([
  fcl.getAccount("0x1d007d755706c469"),
  fcl.atBlockHeight(12345)
]).then(fcl.decode);

// Execute script at specific block height
await fcl.send([
  fcl.script`
    access(all) fun main(): UFix64 {
      return getCurrentBlock().height
    }
  `,
  fcl.atBlockHeight(100)
]).then(fcl.decode);
```

## Parameters

### `height` 


- Type: `number`
- Description: The height of the block to execute the interaction at


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A partial interaction to be paired with another interaction such as 'fcl.getBlock()' or 'fcl.getAccount()'

---