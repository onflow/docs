---
sidebar_position: 1
title: "authorizations"
description: "authorizations function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-react-native/../sdk/src/build/build-authorizations.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-react-native/../sdk/src/build/build-authorizations.ts). DO NOT EDIT MANUALLY -->

# authorizations

A utility builder to set the authorizations on a transaction.

Authorizations define the accounts that are responsible for paying the transaction fees and providing signatures for the transaction.
You can have multiple authorizers in a single transaction (multi-signature transactions).

Read more about [transaction roles](https://docs.onflow.org/concepts/transaction-signing/) and [signing transactions](https://docs.onflow.org/concepts/accounts-and-keys/).

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-react-native"

fcl.authorizations(ax)
```

Or import directly the specific function:

```typescript
import { authorizations } from "@onflow/fcl-react-native"

authorizations(ax)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Single authorizer (most common case)
await fcl.mutate({
  cadence: `
    transaction {
      prepare(acct: AuthAccount) {
        log("Hello from: ".concat(acct.address.toString()))
      }
    }
  `,
  authorizations: [fcl.authz] // Current user authorization
});

// Multiple authorizers - both accounts must approve
await fcl.mutate({
  cadence: `
    transaction {
      prepare(acct1: AuthAccount, acct2: AuthAccount) {
        log("Transaction signed by both accounts")
      }
    }
  `,
  authorizations: [userOneAuthz, userTwoAuthz]
});

// Using builder pattern
await fcl.send([
  fcl.transaction`
    transaction {
      prepare(acct: AuthAccount) {
        acct.save("Hello, World!", to: /storage/greeting)
      }
    }
  `,
  fcl.authorizations([fcl.authz]),
  fcl.proposer(fcl.authz),
  fcl.payer(fcl.authz),
  fcl.limit(100)
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
- Description: An array of authorization functions that produce account authorization details


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A function that processes an interaction object

---