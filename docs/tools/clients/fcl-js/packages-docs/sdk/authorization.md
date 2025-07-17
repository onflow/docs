---
title: "authorization"
description: "authorization function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/build/build-authorizations.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/build/build-authorizations.ts). DO NOT EDIT MANUALLY -->

# authorization

Creates an authorization function for use in transactions.

An authorization function must produce the information of the user that is going to sign and a signing function to use the information to produce a signature.

Read more about [authorization functions](https://docs.onflow.org/fcl/reference/authorization-function/) and [transaction roles](https://docs.onflow.org/concepts/transaction-signing/).

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.authorization(addr, signingFunction, keyId, sequenceNum)
```

Or import directly the specific function:

```typescript
import { authorization } from "@onflow/sdk"

authorization(addr, signingFunction, keyId, sequenceNum)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";
import { ec as EC } from "elliptic";

// Create a signing function
const signingFunction = ({ message }) => {
  // Your signing logic here
  return {
    addr: "0x123456789abcdef0",
    keyId: 0,
    signature: "your_signature_here"
  };
};

// Create authorization
const authz = fcl.authorization(
  "0x123456789abcdef0", // account address
  signingFunction,     // signing function
  0,                   // key ID
  42                   // sequence number
);

// Use in transaction
await fcl.mutate({
  cadence: `transaction { prepare(acct: AuthAccount) {} }`,
  proposer: authz,
  payer: authz,
  authorizations: [authz]
});
```

## Parameters

### `addr` 


- Type: `string`
- Description: The address of the account that will sign the transaction

### `signingFunction` 


- Type: 
```typescript
type SigningFn = (
  signable?: SignableMessage
) => SigningResult | Promise<SigningResult>
```
- Description: A function that produces signatures for the account

### `keyId` (optional)


- Type: `string | number`
- Description: The index of the key to use for signing (optional)

### `sequenceNum` (optional)


- Type: `number`
- Description: The sequence number for the account key (optional)


## Returns

```typescript
Partial<InteractionAccount>
```


A partial interaction account object

---