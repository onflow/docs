---
sidebar_position: 1
title: "encodeTxIdFromVoucher"
description: "encodeTxIdFromVoucher function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/encode/encode.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/encode/encode.ts). DO NOT EDIT MANUALLY -->

# encodeTxIdFromVoucher

Encodes a transaction ID from a voucher by computing its hash.

A voucher is an intermediary object that contains transaction details before final encoding.
This function computes the transaction ID that would result from submitting the transaction.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.encodeTxIdFromVoucher(voucher)
```

Or import directly the specific function:

```typescript
import { encodeTxIdFromVoucher } from "@onflow/sdk"

encodeTxIdFromVoucher(voucher)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";
import { encodeTxIdFromVoucher } from "@onflow/sdk"

// Create a voucher (usually done internally by FCL)
const voucher = {
  cadence: `
    transaction {
      prepare(account: AuthAccount) {
        log("Hello")
      }
    }
  `,
  arguments: [],
  refBlock: "abc123...",
  computeLimit: 100,
  proposalKey: {
    address: "0x123456789abcdef0",
    keyId: 0,
    sequenceNum: 42
  },
  payer: "0x123456789abcdef0",
  authorizers: ["0x123456789abcdef0"],
  payloadSigs: [],
  envelopeSigs: []
};

// Calculate the transaction ID
const txId = encodeTxIdFromVoucher(voucher);
console.log("Transaction ID:", txId);
// Returns a transaction ID that can be used to track the transaction
```

## Parameters

### `voucher` 

- Type: `Voucher`
- Description: The voucher object containing transaction details

```typescript
export interface Voucher {
  cadence: string
  refBlock: string
  computeLimit: number
  arguments: VoucherArgument[]
  proposalKey: VoucherProposalKey
  payer: string
  authorizers: string[]
  payloadSigs: Sig[]
  envelopeSigs: Sig[]
}
```


## Returns

`string`


---