---
sidebar_position: 1
title: "serialize"
description: "serialize function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/src/serialize/index.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/src/serialize/index.ts). DO NOT EDIT MANUALLY -->

# serialize

Serializes a Flow transaction or script to a JSON-formatted signable voucher that can be
used for offline signing or inspection. This is useful for creating signable transactions that can be
signed by external wallets or hardware devices.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.serialize(args, opts)
```

Or import directly the specific function:

```typescript
import { serialize } from "@onflow/fcl-core"

serialize(args, opts)
```

## Usage

```typescript
// Serialize a simple transaction
import * as fcl from "@onflow/fcl"

const voucher = await fcl.serialize([
  fcl.transaction`
    transaction(amount: UFix64, to: Address) {
      prepare(signer: AuthAccount) {
        // Transaction logic here
      }
    }
  `,
  fcl.args([
    fcl.arg("10.0", fcl.t.UFix64),
    fcl.arg("0x01", fcl.t.Address)
  ]),
  fcl.proposer(authz),
  fcl.payer(authz),
  fcl.authorizations([authz])
])
```

## Parameters

### `args` 


- Type: [`(false | InteractionBuilderFn)[] | Interaction`](../types#(false | interactionbuilderfn)[] | interaction)
- Description: Array of interaction builder functions or a pre-built interaction object. Builder functions are typically from

### `opts` (optional)


- Type: 
```typescript
export interface SerializeOptions {
  resolve?: InteractionBuilderFn
}
```
- Description: Optional configuration object


## Returns

`Promise<string>`


A JSON string representation of the signable voucher that contains all
the transaction details needed for signing

---