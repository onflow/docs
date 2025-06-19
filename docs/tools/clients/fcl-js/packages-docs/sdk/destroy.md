---
sidebar_position: 1
title: "destroy"
description: "destroy function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# destroy

Removes a property from an interaction object using a dot-notation key path.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.destroy(key)
```

Or import directly the specific function:

```typescript
import { destroy } from "@onflow/sdk"

destroy(key)
```

## Usage

```typescript
import { destroy, put, get, initInteraction } from "@onflow/sdk"

const interaction = initInteraction();

// Set some values
put("user.name", "Alice")(interaction);
put("user.email", "alice@example.com")(interaction);
put("user.temp", "temporary data")(interaction);

console.log(get(interaction, "user.temp")); // "temporary data"

// Remove temporary data
destroy("user.temp")(interaction);

console.log(get(interaction, "user.temp")); // undefined
console.log(get(interaction, "user.name")); // "Alice" (still exists)
```

## Parameters

### `key` 

- Type: `string`
- Description: The dot-notation key path to remove



## Returns

`function`


---