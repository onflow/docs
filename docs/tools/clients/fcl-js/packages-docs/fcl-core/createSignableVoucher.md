---
sidebar_position: 1
title: "createSignableVoucher"
description: "createSignableVoucher function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/../sdk/src/resolve/voucher.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/../sdk/src/resolve/voucher.ts). DO NOT EDIT MANUALLY -->

# createSignableVoucher

Creates a signable voucher object from an interaction for signing purposes.

A voucher is a standardized representation of a transaction that contains all the necessary
information for signing and submitting to the Flow network. This function transforms an
interaction object into a voucher format.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.createSignableVoucher(ix)
```

Or import directly the specific function:

```typescript
import { createSignableVoucher } from "@onflow/fcl-core"

createSignableVoucher(ix)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";
import { createSignableVoucher } from "@onflow/sdk"

// Build a transaction interaction
const interaction = await fcl.build([
  fcl.transaction`
    transaction(amount: UFix64) {
      prepare(account: AuthAccount) {
        log(amount)
      }
    }
  `,
  fcl.args([fcl.arg("10.0", fcl.t.UFix64)]),
  fcl.proposer(proposerAuthz),
  fcl.payer(payerAuthz),
  fcl.authorizations([authorizerAuthz]),
  fcl.limit(100)
]);

// Create a voucher for signing
const voucher = createSignableVoucher(interaction);
console.log(voucher.cadence); // The Cadence script
console.log(voucher.arguments); // The transaction arguments
console.log(voucher.proposalKey); // Proposer account details
console.log(voucher.authorizers); // List of authorizer addresses

// The voucher can now be signed and submitted
```

## Parameters

### `ix` 


- Type: [`Interaction`](../types#interaction)
- Description: The interaction object containing transaction details


## Returns

```typescript
{ cadence: string; refBlock: string; computeLimit: number; arguments: any[]; proposalKey: { address: string; keyId: string | number; sequenceNum: number; } | { address?: undefined; keyId?: undefined; sequenceNum?: undefined; }; payer: string; authorizers: string[]; payloadSigs: { address: string; keyId: string | number; sig: string; }[]; envelopeSigs: { address: string; keyId: string | number; sig: string; }[]; }
```


A voucher object containing all transaction data and signatures

---