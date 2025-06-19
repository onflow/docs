---
sidebar_position: 1
title: "Ok"
description: "Ok function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# Ok

Marks an interaction as successful and returns the interaction object.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.Ok(ix)
```

Or import directly the specific function:

```typescript
import { Ok } from "@onflow/sdk"

Ok(ix)
```

## Usage

```typescript
import { Ok, initInteraction } from "@onflow/sdk"

const interaction = initInteraction();
const successfulInteraction = Ok(interaction);
console.log(successfulInteraction.status); // "OK"
```

## Parameters

### `ix` 

- Type: [`Interaction`](../types#interaction)
- Description: The interaction to mark as successful



## Returns

[`Interaction`](../types#interaction)


---