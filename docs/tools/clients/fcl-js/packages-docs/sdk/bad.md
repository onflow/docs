---
sidebar_position: 1
title: "Bad"
description: "Bad function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# Bad

Marks an interaction as failed with a specific reason and returns the...

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.Bad(ix, reason)
```

Or import directly the specific function:

```typescript
import { Bad } from "@onflow/sdk"

Bad(ix, reason)
```

## Usage

```typescript
import { Bad, initInteraction } from "@onflow/sdk"

const interaction = initInteraction();
const failedInteraction = Bad(interaction, "Invalid transaction signature");
console.log(failedInteraction.status); // "BAD"
console.log(failedInteraction.reason); // "Invalid transaction signature"
```

## Parameters

### `ix` 

- Type: [`Interaction`](../types#interaction)
- Description: The interaction to mark as failed


### `reason` 

- Type: `string`
- Description: The reason for the failure



## Returns

[`Interaction`](../types#interaction)


---