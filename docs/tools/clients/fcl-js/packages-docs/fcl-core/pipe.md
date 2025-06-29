---
sidebar_position: 1
title: "pipe"
description: "pipe function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/../sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/../sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# pipe

Async pipe function to compose interactions.

The pipe function is the foundation for composing multiple interaction builder functions together.
It sequentially applies builder functions to an interaction, allowing for complex interaction construction.
Each function in the pipe receives the result of the previous function and can modify or validate the interaction.

Pipe has two main forms:
1. `pipe(builderFunctions)`: Returns a builder function
2. `pipe(interaction, builderFunctions)`: Directly executes the pipe on an interaction

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.pipe(fns)
```

Or import directly the specific function:

```typescript
import { pipe } from "@onflow/fcl-core"

pipe(fns)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Using pipe to create a reusable builder
const myTransactionBuilder = fcl.pipe([
  fcl.transaction`
    transaction(amount: UFix64) {
      prepare(account: AuthAccount) {
        log(amount)
      }
    }
  `,
  fcl.args([fcl.arg("10.0", fcl.t.UFix64)]),
  fcl.proposer(fcl.authz),
  fcl.payer(fcl.authz),
  fcl.authorizations([fcl.authz]),
  fcl.limit(100)
]);

// Use the builder
const interaction = await fcl.build([myTransactionBuilder]);

// Pipe is used internally by build() and send()
await fcl.send([
  fcl.script`access(all) fun main(): Int { return 42 }`
]); // This uses pipe internally
```

## Parameters

### `fns` 


- Type: `(false | InteractionBuilderFn)[]`
- Description: Array of builder functions to apply


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


An interaction builder function when called with just functions, or a Promise&lt;Interaction&gt; when called with an interaction and functions

---