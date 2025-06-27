---
sidebar_position: 1
title: "encodeMessageFromSignable"
description: "encodeMessageFromSignable function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/wallet-utils/encode-signable.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/wallet-utils/encode-signable.ts). DO NOT EDIT MANUALLY -->

# encodeMessageFromSignable

Encodes a message from a signable object for a specific signer address.

This function determines whether the signer should sign the transaction payload or envelope
based on their role in the transaction (authorizer, proposer, or payer), then encodes the
appropriate message for signing.

Payload signers include authorizers and proposers (but not payers)
Envelope signers include only payers

The encoded message is what gets signed by the account's private key to create the transaction signature.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.encodeMessageFromSignable(signable, signerAddress)
```

Or import directly the specific function:

```typescript
import { encodeMessageFromSignable } from "@onflow/sdk"

encodeMessageFromSignable(signable, signerAddress)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// This function is typically used internally by authorization functions
// when implementing custom wallet connectors or signing flows

const signable = {
  voucher: {
    cadence: "transaction { prepare(acct: AuthAccount) {} }",
    authorizers: ["0x01"],
    proposalKey: { address: "0x01", keyId: 0, sequenceNum: 42 },
    payer: "0x02",
    refBlock: "a1b2c3",
    computeLimit: 100,
    arguments: [],
    payloadSigs: []
  }
};

// For an authorizer (payload signer)
const authorizerMessage = fcl.encodeMessageFromSignable(signable, "0x01");
console.log("Authorizer signs:", authorizerMessage);

// For a payer (envelope signer)
const payerMessage = fcl.encodeMessageFromSignable(signable, "0x02");
console.log("Payer signs:", payerMessage);
```

## Parameters

### `signable` 


- Type: 
```typescript
export interface Signable {
  message: string
  addr?: string
  keyId?: number
  signature?: string
  roles: Record<string, boolean>
  voucher: Voucher
  [key: string]: any
}
```
- Description: The signable object containing transaction data and voucher

### `signerAddress` 


- Type: `string`
- Description: The address of the signer to encode the message for


## Returns

`string`


An encoded message string suitable for signing with the account's private key

---