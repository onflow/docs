---
sidebar_position: 1
title: "put"
description: "put function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# put

Sets a value in an interaction object using a dot-notation key path.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.put(key, value)
```

Or import directly the specific function:

```typescript
import { put } from "@onflow/sdk"

put(key, value)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";
import { put } from "@onflow/sdk"

// Using put in a custom builder function
const setCustomData = (data) => put("custom.data", data);

await fcl.send([
  fcl.script`access(all) fun main(): String { return "Hello" }`,
  setCustomData({ userId: 123, timestamp: Date.now() })
]);

// Direct usage
const interaction = initInteraction();
put("network.endpoint", "https://access.mainnet.onflow.org")(interaction);
```

## Parameters

### `key` 


- Type: `string`
- Description: The dot-notation key path (e.g., "message.arguments")

### `value` 


- Type: `any`
- Description: The value to set


## Returns

```typescript
(ix: Interaction) => Interaction
```


A function that takes an interaction and sets the value

---