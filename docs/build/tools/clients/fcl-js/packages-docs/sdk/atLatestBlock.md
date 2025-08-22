---
title: 'atLatestBlock'
description: 'atLatestBlock function documentation.'
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/build/cadence/build-at-latest-block.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/build/cadence/build-at-latest-block.ts). DO NOT EDIT MANUALLY -->

# atLatestBlock

A builder function that returns a partial interaction to query the latest block with the given finality state.

Use with other interactions like 'fcl.getBlock()' to get the latest block information.
Block finality determines whether you get the latest executed block or the latest sealed block.

- Executed blocks (soft-finality): Latest block that has been executed but may not be final
- Sealed blocks (hard-finality): Latest block that has been sealed and is considered final

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from '@onflow/sdk';

sdk.atLatestBlock(isSealed);
```

Or import directly the specific function:

```typescript
import { atLatestBlock } from '@onflow/sdk';

atLatestBlock(isSealed);
```

## Usage

```typescript
import * as fcl from '@onflow/fcl';

// Get latest executed block (soft finality)
await fcl.send([fcl.getBlock(), fcl.atLatestBlock()]).then(fcl.decode);

// Get latest sealed block (hard finality)
await fcl.send([fcl.getBlock(), fcl.atLatestBlock(true)]).then(fcl.decode);

// Get account from latest sealed block
await fcl
  .send([fcl.getAccount('0x1d007d755706c469'), fcl.atLatestBlock(true)])
  .then(fcl.decode);

// Execute script against latest executed block
await fcl
  .send([
    fcl.script`
    access(all) fun main(): UFix64 {
      return getCurrentBlock().height
    }
  `,
    fcl.atLatestBlock(),
  ])
  .then(fcl.decode);
```

## Parameters

### `isSealed` (optional)

- Type: `boolean`
- Description: Block finality state, defaults to latest executed block ("soft-finality"), set to true for sealed blocks ("hard-finality")

## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction,
) => Interaction | Promise<Interaction>;
```

A function that processes a partial interaction object

---
