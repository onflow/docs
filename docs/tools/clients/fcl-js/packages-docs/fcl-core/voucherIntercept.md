---
title: "voucherIntercept"
description: "voucherIntercept function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/../sdk/src/build/build-voucher-intercept.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/../sdk/src/build/build-voucher-intercept.ts). DO NOT EDIT MANUALLY -->

# voucherIntercept

A builder function that intercepts and modifies a voucher.

This function is useful for debugging, logging, or making modifications to
the transaction data. The voucher contains all the transaction details in their final form.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.voucherIntercept(fn)
```

Or import directly the specific function:

```typescript
import { voucherIntercept } from "@onflow/fcl-core"

voucherIntercept(fn)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Intercept voucher for logging
await fcl.send([
  fcl.transaction`
    transaction {
      prepare(account: AuthAccount) {
        log("Transaction executed")
      }
    }
  `,
  fcl.voucherIntercept((voucher) => {
    console.log("Voucher details:", {
      cadence: voucher.cadence,
      proposalKey: voucher.proposalKey,
      payer: voucher.payer,
      authorizers: voucher.authorizers,
      computeLimit: voucher.computeLimit
    });
  }),
  fcl.proposer(fcl.authz),
  fcl.payer(fcl.authz),
  fcl.authorizations([fcl.authz])
]);
```

## Parameters

### `fn` 


- Type: 
```typescript
type VoucherInterceptFn = (voucher: Voucher) => any | Promise<any>
```
- Description: The function to intercept and potentially modify the voucher


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A function that processes an interaction object

---