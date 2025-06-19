---
sidebar_position: 1
title: "isArray"
description: "isArray function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# isArray

Checks if a value is an array.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.isArray(d)
```

Or import directly the specific function:

```typescript
import { isArray } from "@onflow/sdk"

isArray(d)
```

## Usage

```typescript
import { isArray } from "@onflow/sdk"

console.log(isArray([1, 2, 3])); // true
console.log(isArray("hello")); // false
console.log(isArray({})); // false
console.log(isArray(null)); // false
```

## Parameters

### `d` 

- Type: `any`
- Description: The value to check



## Returns

`boolean`


---