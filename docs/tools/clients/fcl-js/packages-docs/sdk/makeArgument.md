---
sidebar_position: 1
title: "makeArgument"
description: "makeArgument function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# makeArgument

Creates an argument resolver and adds it to an interaction. This function is...

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.makeArgument(arg)
```

Or import directly the specific function:

```typescript
import { makeArgument } from "@onflow/sdk"

makeArgument(arg)
```

## Usage

```typescript
import { makeArgument, initInteraction } from "@onflow/sdk"
import * as fcl from "@onflow/fcl";

const interaction = initInteraction();

// Create an argument resolver (usually you'd use fcl.arg instead)
const argResolver = {
  value: 42,
  xform: fcl.t.Int,
  resolve: (value, xform) => ({ value, xform })
};

// Add the argument to the interaction
makeArgument(argResolver)(interaction);

console.log(interaction.message.arguments.length); // 1

// Preferred way - use fcl.arg instead:
// fcl.args([fcl.arg(42, fcl.t.Int)])
```

## Parameters

### `arg` 

- Type: `Record<string, any>`
- Description: The argument configuration object



## Returns

`function`


---