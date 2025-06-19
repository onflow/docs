---
sidebar_position: 1
title: "findInsideSigners"
description: "findInsideSigners function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/resolve/voucher.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/resolve/voucher.ts). DO NOT EDIT MANUALLY -->

# findInsideSigners

Identifies signers for the transaction payload (authorizers + proposer,...

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.findInsideSigners(ix)
```

Or import directly the specific function:

```typescript
import { findInsideSigners } from "@onflow/sdk"

findInsideSigners(ix)
```

## Usage

```typescript
import { findInsideSigners, initInteraction } from "@onflow/sdk"

const interaction = initInteraction();
// Assume we have account tempIds: "proposer-123", "auth-456", "payer-789"
interaction.proposer = "proposer-123";
interaction.authorizations = ["auth-456"];
interaction.payer = "payer-789";

const insideSigners = findInsideSigners(interaction);
console.log(insideSigners); // ["auth-456", "proposer-123"]
// Note: payer is excluded from payload signers
```

## Parameters

### `ix` 

- Type: [`Interaction`](../types#interaction)
- Description: The interaction object



## Returns

`string[]`


---