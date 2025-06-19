---
sidebar_position: 1
title: "run"
description: "run function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/test-utils/run.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/test-utils/run.ts). DO NOT EDIT MANUALLY -->

# run

Runs a set of functions on an interaction

This is a utility function for testing that builds and resolves an interaction with the provided builder functions.
It automatically adds a reference block and then resolves the interaction for testing purposes.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.run(fns)
```

Or import directly the specific function:

```typescript
import { run } from "@onflow/sdk"

run(fns)
```

## Usage

```typescript
import { run } from "@onflow/sdk"
import * as fcl from "@onflow/fcl";

// Test a simple script interaction
const result = await run([
  fcl.script`
    access(all) fun main(): Int {
      return 42
    }
  `
]);

console.log(result.cadence); // The Cadence script
console.log(result.tag); // "SCRIPT"

// Test a transaction with arguments
const txResult = await run([
  fcl.transaction`
    transaction(amount: UFix64) {
      prepare(account: AuthAccount) {
        log(amount)
      }
    }
  `,
  fcl.args([fcl.arg("10.0", fcl.t.UFix64)])
]);

console.log(txResult.message.arguments); // The resolved arguments
```

## Parameters

### `fns` (optional)

- Type: `((ix: Interaction) => Interaction | Promise<Interaction>)[]`
- Description: An array of functions to run on the interaction



## Returns

[`Promise<Interaction>`](../types#interaction)


---