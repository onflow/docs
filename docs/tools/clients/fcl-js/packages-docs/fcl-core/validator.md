---
title: "validator"
description: "validator function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/../sdk/src/build/build-validator.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/../sdk/src/build/build-validator.ts). DO NOT EDIT MANUALLY -->

# validator

A builder function that adds a validator to a transaction.

Validators are functions that run during transaction building to check for invalid configurations or parameters.
They help catch errors early before submitting transactions to the network, preventing failed transactions
and wasted compute costs.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.validator(cb)
```

Or import directly the specific function:

```typescript
import { validator } from "@onflow/fcl-core"

validator(cb)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Custom validator to ensure account has sufficient balance
const validateBalance = (ix) => {
  if (ix.message.computeLimit > 1000) {
    throw new Error("Compute limit too high for this account");
  }
  return ix;
};

await fcl.send([
  fcl.transaction`
    transaction {
      prepare(account: AuthAccount) {
        // Transaction logic
      }
    }
  `,
  fcl.validator(validateBalance),
  fcl.limit(500) // This will pass validation
]);
```

## Parameters

### `cb` 


- Type: `Function`
- Description: The validator function that takes an interaction and returns it (or throws an error if invalid)


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A function that processes an interaction object

---