---
sidebar_position: 1
title: "ref"
description: "ref function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/build/build-ref.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/build/build-ref.ts). DO NOT EDIT MANUALLY -->

# ref

A builder function that sets the reference block for a transaction.

The reference block specifies an expiration window (measured in blocks) during which a transaction is considered valid by the network.
A transaction will be rejected if it is submitted past its expiry block. Flow calculates transaction expiry using the reference block field.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.ref(refBlock)
```

Or import directly the specific function:

```typescript
import { ref } from "@onflow/sdk"

ref(refBlock)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Set specific reference block for transaction
await fcl.send([
  fcl.transaction`
    transaction {
      prepare(account: AuthAccount) {
        log("Transaction with custom reference block")
      }
    }
  `,
  fcl.ref("a1b2c3d4e5f6789..."), // Custom reference block ID
  fcl.proposer(fcl.authz),
  fcl.payer(fcl.authz),
  fcl.authorizations([fcl.authz]),
  fcl.limit(100)
]);

// Usually, you don't need to set reference block manually
// as FCL will automatically set it to the latest block
```

## Parameters

### `refBlock` 

- Type: `string`
- Description: The reference block ID



## Returns

`InteractionBuilderFn`

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```

---