---
title: "payer"
description: "payer function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/../sdk/src/build/build-payer.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/../sdk/src/build/build-payer.ts). DO NOT EDIT MANUALLY -->

# payer

A builder function that adds payer account(s) to a transaction.

Every transaction requires at least one payer.

The payer is the account that pays the transaction fee for executing the transaction on the network.
The payer account must have sufficient Flow tokens to cover the transaction fees.

Read more about [transaction roles](https://docs.onflow.org/concepts/transaction-signing/#payer) and [transaction fees](https://docs.onflow.org/concepts/fees/).

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.payer(ax)
```

Or import directly the specific function:

```typescript
import { payer } from "@onflow/fcl"

payer(ax)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Using current user as payer (most common case)
await fcl.mutate({
  cadence: `
    transaction {
      prepare(acct: AuthAccount) {
        log("Transaction fees paid by: ".concat(acct.address.toString()))
      }
    }
  `,
  payer: fcl.authz // Current user as payer
});

// Using custom payer with builder pattern
await fcl.send([
  fcl.transaction`
    transaction {
      prepare(acct: AuthAccount) {
        // Transaction logic
      }
    }
  `,
  fcl.proposer(fcl.authz),        // Current user as proposer
  fcl.authorizations([fcl.authz]), // Current user as authorizer
  fcl.payer(customPayerAuthz)     // Custom payer pays fees
]);

// Multiple payers (advanced use case)
await fcl.send([
  fcl.transaction`
    transaction {
      prepare(acct: AuthAccount) {
        // Transaction logic
      }
    }
  `,
  fcl.payer([payerAuthz1, payerAuthz2]) // Multiple payers split fees
]);
```

## Parameters

### `ax` (optional)


- Type: 
```typescript
export type AccountAuthorization =
  | (AuthorizationFn & Partial<InteractionAccount>)
  | Partial<InteractionAccount>
```
- Description: An account address or an array of account addresses


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A function that takes an interaction object and returns a new interaction object with the payer(s) added

---