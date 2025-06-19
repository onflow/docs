---
sidebar_position: 1
title: "validateSignableTransaction"
description: "validateSignableTransaction function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/wallet-utils/validate-tx.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/wallet-utils/validate-tx.ts). DO NOT EDIT MANUALLY -->

# validateSignableTransaction

Validates that a signable transaction is properly formed and contains the expected message.

This function verifies that the message in a signable object matches the expected encoded message
based on the signer's role (payer or non-payer). It ensures the integrity of the signing process
by confirming that the message to be signed corresponds correctly to the transaction data.

For payers: Validates against the transaction envelope encoding
For non-payers (proposers/authorizers): Validates against the transaction payload encoding

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.validateSignableTransaction(signable)
```

Or import directly the specific function:

```typescript
import { validateSignableTransaction } from "@onflow/sdk"

validateSignableTransaction(signable)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// This function is typically used internally by wallet connectors
// and authorization functions to ensure transaction integrity

const signable = {
  roles: { payer: true, proposer: false, authorizer: false },
  voucher: {
    cadence: "transaction { prepare(acct: AuthAccount) {} }",
    proposalKey: { address: "0x01", keyId: 0, sequenceNum: 42 },
    payer: "0x02",
    authorizers: ["0x01"],
    // ... other voucher data
  },
  message: "encoded_transaction_envelope_here"
};

try {
  const isValid = fcl.validateSignableTransaction(signable);
  console.log("Signable is valid:", isValid);
  // Proceed with signing
} catch (error) {
  console.error("Invalid signable:", error.message);
  // Handle validation failure
}
```

## Parameters

### `signable` 

- Type: `Signable`
- Description: The signable object to validate

```typescript
interface Signable {
  voucher: Voucher
}
```


## Returns

`boolean`


---