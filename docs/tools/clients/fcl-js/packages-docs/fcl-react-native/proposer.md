---
sidebar_position: 1
title: "proposer"
description: "proposer function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-react-native/../sdk/src/build/build-proposer.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-react-native/../sdk/src/build/build-proposer.ts). DO NOT EDIT MANUALLY -->

# proposer

A builder function that adds the proposer to a transaction.

The proposer is responsible for providing the proposal key and paying the network fee for the transaction.
The proposer key is used to specify the sequence number and prevent replay attacks.

Every transaction requires exactly one proposer.

Read more about [transaction roles](https://docs.onflow.org/concepts/transaction-signing/#proposer) and [signing transactions](https://docs.onflow.org/concepts/accounts-and-keys/).

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-react-native"

fcl.proposer(authz)
```

Or import directly the specific function:

```typescript
import { proposer } from "@onflow/fcl-react-native"

proposer(authz)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Using the current user as proposer
await fcl.mutate({
  cadence: `
    transaction {
      prepare(account: AuthAccount) {
        log("Hello from proposer!")
      }
    }
  `,
  proposer: fcl.authz
});

// Using builder pattern
await fcl.send([
  fcl.transaction`
    transaction {
      prepare(account: AuthAccount) {
        log("Transaction executed")
      }
    }
  `,
  fcl.proposer(proposerAuthz),
  fcl.payer(payerAuthz),
  fcl.authorizations([authorizerAuthz]),
  fcl.limit(100)
]);
```

## Parameters

### `authz` 


- Type: 
```typescript
export type AccountAuthorization =
  | (AuthorizationFn & Partial<InteractionAccount>)
  | Partial<InteractionAccount>
```
- Description: The authorization object for the proposer


## Returns

```typescript
(ix: Interaction) => Interaction
```


A function that takes an interaction object and returns a new interaction object with the proposer added

---