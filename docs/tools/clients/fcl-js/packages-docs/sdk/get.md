---
sidebar_position: 1
title: "get"
description: "get function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# get

Gets a value from an interaction object using a dot-notation key path.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.get(ix, key, fallback)
```

Or import directly the specific function:

```typescript
import { get } from "@onflow/sdk"

get(ix, key, fallback)
```

## Usage

```typescript
import { get, put, initInteraction } from "@onflow/sdk"

const interaction = initInteraction();

// Set a value first
put("user.name", "Alice")(interaction);

// Get the value
const userName = get(interaction, "user.name"); // "Alice"
const userAge = get(interaction, "user.age", 25); // 25 (fallback)

// Get nested values
put("config.network.url", "https://access.mainnet.onflow.org")(interaction);
const networkUrl = get(interaction, "config.network.url");
```

## Parameters

### `ix` 

- Type: [`Interaction`](../types#interaction)
- Description: The interaction object


### `key` 

- Type: `string`
- Description: The dot-notation key path (e.g., "message.arguments")


### `fallback` (optional)

- Type: `any`
- Description: The fallback value if the key is not found



## Returns

`any`


---