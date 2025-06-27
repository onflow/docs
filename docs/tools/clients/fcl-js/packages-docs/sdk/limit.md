---
sidebar_position: 1
title: "limit"
description: "limit function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/build/build-limit.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/build/build-limit.ts). DO NOT EDIT MANUALLY -->

# limit

A utility builder to set the compute limit on a transaction.

The compute limit is the maximum amount of computation that can be performed during transaction execution.
Setting an appropriate compute limit helps prevent infinite loops and ensures predictable transaction costs.

Read more about [computation cost](https://docs.onflow.org/concepts/fees/#computation-cost) and [transaction fees](https://docs.onflow.org/concepts/fees/).

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.limit(limit)
```

Or import directly the specific function:

```typescript
import { limit } from "@onflow/sdk"

limit(limit)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

await fcl.mutate({
  cadence: `
    transaction {
      prepare(account: AuthAccount) {
        // Complex transaction logic here
      }
    }
  `,
  limit: 1000 // Set compute limit to 1000
});

// Using builder pattern
await fcl.send([
  fcl.transaction`
    transaction {
      prepare(account: AuthAccount) {
        // Transaction logic
      }
    }
  `,
  fcl.limit(9999) // Set higher limit for complex operations
]);
```

## Parameters

### `limit` 


- Type: `number`
- Description: The maximum amount of computation for the transaction


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A function that processes an interaction object

---