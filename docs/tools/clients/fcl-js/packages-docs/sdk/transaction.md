---
sidebar_position: 1
title: "transaction"
description: "transaction function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/build/build-transaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/build/build-transaction.ts). DO NOT EDIT MANUALLY -->

# transaction

A template builder to use a Cadence transaction for an interaction. FCL "mutate" does the work of building, signing, and sending a transaction behind the scenes.

Flow supports great flexibility when it comes to transaction signing, we can define multiple authorizers (multi-sig transactions) and have different payer account than proposer.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.transaction(args)
```

Or import directly the specific function:

```typescript
import { transaction } from "@onflow/sdk"

transaction(args)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl"

// Basic transaction usage
await fcl.mutate({
  cadence: `
    transaction(a: Int) {
      prepare(acct: &Account) {
        log(acct)
        log(a)
      }
    }
  `,
  args: (arg, t) => [
    arg(6, t.Int)
  ],
  limit: 50
})

// Single party, single signature
// Proposer, payer and authorizer are the same account
await fcl.mutate({
  cadence: `
    transaction {
      prepare(acct: &Account) {}
    }
  `,
  authz: currentUser, // Optional. Will default to currentUser if not provided.
  limit: 50,
})

// Multiple parties
// Proposer and authorizer are the same account, but different payer
await fcl.mutate({
  cadence: `
    transaction {
      prepare(acct: &Account) {}
    }
  `,
  proposer: authzFn,
  payer: authzTwoFn,
  authorizations: [authzFn],
  limit: 50,
})
```

## Parameters

### `args` (optional)


- Type: 
```typescript
[string | TemplateStringsArray, ...any[]]
```
- Description: The arguments to pass to the template


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A function that processes an interaction object

---