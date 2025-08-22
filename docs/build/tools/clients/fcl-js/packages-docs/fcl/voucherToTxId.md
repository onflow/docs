---
title: "voucherToTxId"
description: "voucherToTxId function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/../sdk/src/resolve/voucher.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/../sdk/src/resolve/voucher.ts). DO NOT EDIT MANUALLY -->

# voucherToTxId

Converts a voucher object to a transaction ID.

This function computes the transaction ID by encoding and hashing the voucher.
The transaction ID can be used to track the transaction status on the Flow network.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.voucherToTxId(voucher)
```

Or import directly the specific function:

```typescript
import { voucherToTxId } from "@onflow/fcl"

voucherToTxId(voucher)
```

## Usage

```typescript
import { voucherToTxId, createSignableVoucher } from "@onflow/sdk"
import * as fcl from "@onflow/fcl";

// Create a voucher from an interaction
const interaction = await fcl.build([
  fcl.transaction`
    transaction {
      prepare(account: AuthAccount) {
        log("Hello, Flow!")
      }
    }
  `,
  fcl.proposer(authz),
  fcl.payer(authz),
  fcl.authorizations([authz])
]);

const voucher = createSignableVoucher(interaction);

// Calculate the transaction ID
const txId = voucherToTxId(voucher);
console.log("Transaction ID:", txId);
// Returns something like: "a1b2c3d4e5f6789..."

// You can use this ID to track the transaction
const txStatus = await fcl.tx(txId).onceSealed();
console.log("Transaction status:", txStatus);
```

## Parameters

### `voucher` 


- Type: 
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
- Description: The voucher object to convert


## Returns

`string`


A transaction ID string

---