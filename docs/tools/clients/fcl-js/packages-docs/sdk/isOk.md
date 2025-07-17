---
title: "isOk"
description: "isOk function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# isOk

Checks if an interaction has a successful status.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.isOk(ix)
```

Or import directly the specific function:

```typescript
import { isOk } from "@onflow/sdk"

isOk(ix)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";
import { isOk } from "@onflow/sdk"

// Check if a transaction was successful
const response = await fcl.send([
  fcl.transaction`transaction { prepare(account: AuthAccount) {} }`
]);

if (isOk(response)) {
  console.log("Transaction was successful");
} else {
  console.log("Transaction failed");
}
```

## Parameters

### `ix` 


- Type: [`Interaction`](../types#interaction)
- Description: The interaction to check


## Returns

`boolean`


True if the interaction status is OK, false otherwise

---