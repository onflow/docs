---
sidebar_position: 1
title: "update"
description: "update function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# update

Updates a value in an interaction object using a transformation function.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.update(key, fn)
```

Or import directly the specific function:

```typescript
import { update } from "@onflow/sdk"

update(key, fn)
```

## Usage

```typescript
import { update, put, initInteraction } from "@onflow/sdk"

const interaction = initInteraction();

// Set initial value
put("counter", 0)(interaction);

// Increment counter
const increment = update("counter", (current) => (current || 0) + 1);
increment(interaction); // counter becomes 1
increment(interaction); // counter becomes 2

// Update array
put("tags", ["flow", "blockchain"])(interaction);
const addTag = update("tags", (tags) => [...(tags || []), "web3"]);
addTag(interaction); // tags becomes ["flow", "blockchain", "web3"]
```

## Parameters

### `key` 

- Type: `string`
- Description: The dot-notation key path to update


### `fn` (optional)

- Type: `(v: T | T[], ...args: any[]) => T | T[]`
- Description: The transformation function to apply to the existing value



## Returns

`function`


---