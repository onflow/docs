---
sidebar_position: 1
title: "atBlockId"
description: "atBlockId function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/../sdk/src/build/build-at-block-id.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/../sdk/src/build/build-at-block-id.ts). DO NOT EDIT MANUALLY -->

# atBlockId

A builder function that returns a partial interaction to a block at a specific block ID.

Use with other interactions like 'fcl.getBlock()' to get a full interaction at the specified block ID.

Block ID is SHA3-256 hash of the entire block payload. This hash is stored as an ID field on any block response object (ie. response from 'GetLatestBlock').

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.atBlockId(id)
```

Or import directly the specific function:

```typescript
import { atBlockId } from "@onflow/fcl-core"

atBlockId(id)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Get block by ID
await fcl.send([fcl.getBlock(), fcl.atBlockId("23232323232")]).then(fcl.decode);

// Get account at specific block ID
await fcl.send([
  fcl.getAccount("0x1d007d755706c469"),
  fcl.atBlockId("9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3")
]).then(fcl.decode);

// Execute script at specific block
await fcl.send([
  fcl.script`
    access(all) fun main(): UFix64 {
      return getCurrentBlock().timestamp
    }
  `,
  fcl.atBlockId("a1b2c3d4e5f6")
]).then(fcl.decode);
```

## Parameters

### `id` 


- Type: `string`
- Description: The ID of the block to execute the interaction at


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A partial interaction to be paired with another interaction such as 'fcl.getBlock()' or 'fcl.getAccount()'

---