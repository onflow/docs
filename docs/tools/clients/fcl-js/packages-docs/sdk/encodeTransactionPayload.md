---
sidebar_position: 1
title: "encodeTransactionPayload"
description: "encodeTransactionPayload function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/encode/encode.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/encode/encode.ts). DO NOT EDIT MANUALLY -->

# encodeTransactionPayload

Encodes a transaction payload for signing.

This function takes a transaction object and encodes it into a format suitable for signing.
The encoded payload contains all the transaction details except for the signatures.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.encodeTransactionPayload(tx)
```

Or import directly the specific function:

```typescript
import { encodeTransactionPayload } from "@onflow/sdk"

encodeTransactionPayload(tx)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";
import { encodeTransactionPayload } from "@onflow/sdk"

// Build a transaction
const transaction = await fcl.build([
  fcl.transaction`
    transaction(amount: UFix64) {
      prepare(account: AuthAccount) {
        log("Transferring: ".concat(amount.toString()))
      }
    }
  `,
  fcl.args([fcl.arg("10.0", fcl.t.UFix64)]),
  fcl.proposer(proposerAuthz),
  fcl.payer(payerAuthz),
  fcl.authorizations([authorizerAuthz]),
  fcl.limit(100)
]);

// Encode the transaction payload for signing
const encodedPayload = encodeTransactionPayload(transaction);
console.log("Encoded payload:", encodedPayload);
// Returns a hex string like "f90145b90140..."
```

## Parameters

### `tx` 

- Type: [`Transaction`](../types#transaction)
- Description: The transaction object to encode



## Returns

`string`


---