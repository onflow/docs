---
sidebar_position: 1
title: "findOutsideSigners"
description: "findOutsideSigners function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/resolve/voucher.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/resolve/voucher.ts). DO NOT EDIT MANUALLY -->

# findOutsideSigners

Identifies signers for the transaction envelope (payer accounts only). This...

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.findOutsideSigners(ix)
```

Or import directly the specific function:

```typescript
import { findOutsideSigners } from "@onflow/sdk"

findOutsideSigners(ix)
```

## Usage

```typescript
import { findOutsideSigners, initInteraction } from "@onflow/sdk"

const interaction = initInteraction();
interaction.proposer = "proposer-123";
interaction.authorizations = ["auth-456"];
interaction.payer = "payer-789";

const outsideSigners = findOutsideSigners(interaction);
console.log(outsideSigners); // ["payer-789"]
// Only the payer signs the envelope

// Multiple payers example
interaction.payer = ["payer-789", "payer-abc"];
const multiplePayerSigners = findOutsideSigners(interaction);
console.log(multiplePayerSigners); // ["payer-789", "payer-abc"]
```

## Parameters

### `ix` 

- Type: [`Interaction`](../types#interaction)
- Description: The interaction object



## Returns

`string[]`


---