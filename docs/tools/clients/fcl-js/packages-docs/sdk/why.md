---
title: "why"
description: "why function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# why

Returns the reason for an interaction failure.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.why(ix)
```

Or import directly the specific function:

```typescript
import { why } from "@onflow/sdk"

why(ix)
```

## Usage

```typescript
import { Bad, why, initInteraction } from "@onflow/sdk"

const interaction = Bad(initInteraction(), "Network timeout");
console.log(why(interaction)); // "Network timeout"

// Used with error handling
if (isBad(response)) {
  console.error("Error occurred:", why(response));
}
```

## Parameters

### `ix` 


- Type: [`Interaction`](../types#interaction)
- Description: The interaction to get the failure reason from


## Returns

`string`


The reason string or undefined if no reason is set

---