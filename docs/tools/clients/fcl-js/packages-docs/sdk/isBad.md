---
title: "isBad"
description: "isBad function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# isBad

Checks if an interaction has a failed status.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.isBad(ix)
```

Or import directly the specific function:

```typescript
import { isBad } from "@onflow/sdk"

isBad(ix)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";
import { isBad, why } from "@onflow/sdk"

const response = await fcl.send([
  fcl.transaction`transaction { prepare(account: AuthAccount) {} }`
]);

if (isBad(response)) {
  console.log("Transaction failed:", why(response));
}
```

## Parameters

### `ix` 


- Type: [`Interaction`](../types#interaction)
- Description: The interaction to check


## Returns

`boolean`


True if the interaction status is BAD, false otherwise

---