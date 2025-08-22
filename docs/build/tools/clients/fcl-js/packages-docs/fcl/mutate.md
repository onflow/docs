---
title: "mutate"
description: "mutate function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/src/fcl.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/src/fcl.ts). DO NOT EDIT MANUALLY -->

# mutate

A transaction execution function that allows you to submit Cadence transactions to the Flow blockchain
to mutate on-chain state. This function handles the complete transaction lifecycle including building, signing, and
sending transactions to Flow. It provides a high-level interface that abstracts the complexity of transaction
construction while offering flexibility for advanced use cases.

The mutate function automatically handles authorization using the current authenticated user by default, but allows
for custom authorization functions to be specified for different transaction roles (proposer, payer, authorizer).
It supports both simple single-party transactions and complex multi-party transactions with different signatories.

This function integrates with FCL's address replacement system, allowing you to use placeholder addresses in your
Cadence code that are replaced with actual addresses at execution time. It also supports Interaction Templates
for standardized transaction execution patterns.

The mutate function accepts a configuration object with the following structure:
```typescript
{
cadence?: string,                    // The Cadence transaction code to execute (required if template not provided)
args?: Function,                     // Function that returns an array of arguments for the transaction
template?: any,                      // Interaction Template object or URL for standardized transactions
limit?: number,                      // Compute (gas) limit for the transaction execution
authz?: AccountAuthorization,        // Authorization function for all signatory roles (proposer, payer, authorizer)
proposer?: AccountAuthorization,     // Specific authorization function for the proposer role
payer?: AccountAuthorization,        // Specific authorization function for the payer role
authorizations?: AccountAuthorization[]  // Array of authorization functions for authorizer roles
}
```

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.mutate(opts)
```

Or import directly the specific function:

```typescript
import { mutate } from "@onflow/fcl"

mutate(opts)
```

## Usage

```typescript
// Basic transaction submission
import * as fcl from "@onflow/fcl"

// Configure FCL first
fcl.config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "flow.network": "testnet"
})

// Authenticate user
await fcl.authenticate()

// Submit a basic transaction
const txId = await fcl.mutate({
  cadence: `
    transaction(message: String) {
      prepare(account: AuthAccount) {
        log("Transaction executed by: ".concat(account.address.toString()))
        log("Message: ".concat(message))
      }
    }
  `,
  args: (arg, t) => [
    arg("Hello Flow!", t.String)
  ],
  limit: 50
})

console.log("Transaction submitted:", txId)
```

## Parameters

### `opts` 


- Type: `any`
- Description: Transaction configuration options


## Returns

```typescript
(opts?: MutateOptions) => Promise<string>
```


Promise that resolves to the transaction ID (txId) when the transaction is submitted

---