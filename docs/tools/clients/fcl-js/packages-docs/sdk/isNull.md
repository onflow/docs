---
sidebar_position: 1
title: "isNull"
description: "isNull function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# isNull

Checks if a value is null or undefined.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.isNull(d)
```

Or import directly the specific function:

```typescript
import { isNull } from "@onflow/sdk"

isNull(d)
```

## Usage

```typescript
import { isNull } from "@onflow/sdk"

console.log(isNull(null)); // true
console.log(isNull(undefined)); // true
console.log(isNull("")); // false
console.log(isNull(0)); // false
console.log(isNull(false)); // false
```

## Parameters

### `d` 

- Type: `any`
- Description: The value to check



## Returns

`boolean`


---