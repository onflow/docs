---
sidebar_position: 1
title: "encodeTransactionEnvelope"
description: "encodeTransactionEnvelope function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/encode/encode.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/encode/encode.ts). DO NOT EDIT MANUALLY -->

# encodeTransactionEnvelope

Encodes a complete transaction envelope including payload and signatures.

This function encodes the full transaction including both the payload and all signatures.
This is the final step before submitting a transaction to the Flow network.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.encodeTransactionEnvelope(tx)
```

Or import directly the specific function:

```typescript
import { encodeTransactionEnvelope } from "@onflow/sdk"

encodeTransactionEnvelope(tx)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";
import { encodeTransactionEnvelope } from "@onflow/sdk"

// Assuming you have a fully built and signed transaction
const signedTransaction = await fcl.build([
  fcl.transaction`
    transaction {
      prepare(account: AuthAccount) {
        log("Hello, Flow!")
      }
    }
  `,
  fcl.proposer(authz),
  fcl.payer(authz),
  fcl.authorizations([authz]),
  fcl.limit(100)
]);

// Add signatures to the transaction (this is usually done automatically)
// signedTransaction.payloadSigs = [...];
// signedTransaction.envelopeSigs = [...];

// Encode the complete transaction envelope
const encodedEnvelope = encodeTransactionEnvelope(signedTransaction);
console.log("Encoded envelope:", encodedEnvelope);
// Returns a hex string ready for network submission
```

## Parameters

### `tx` 

- Type: [`Transaction`](../types#transaction)
- Description: The transaction object to encode



## Returns

`string`


---