---
sidebar_position: 1
title: "isInteraction"
description: "isInteraction function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# isInteraction

Checks if an object is a valid interaction.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.isInteraction(ix)
```

Or import directly the specific function:

```typescript
import { isInteraction } from "@onflow/sdk"

isInteraction(ix)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";
import { isInteraction, initInteraction } from "@onflow/sdk"

const interaction = initInteraction();
console.log(isInteraction(interaction)); // true
console.log(isInteraction({})); // false
console.log(isInteraction(null)); // false

// Check if a builder result is a valid interaction
const built = await fcl.build([fcl.script`access(all) fun main(): Int { return 42 }`]);
console.log(isInteraction(built)); // true
```

## Parameters

### `ix` 

- Type: `unknown`
- Description: The object to check



## Returns

`boolean`


---