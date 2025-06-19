---
sidebar_position: 1
title: "isNumber"
description: "isNumber function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# isNumber

Checks if a value is a number.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.isNumber(d)
```

Or import directly the specific function:

```typescript
import { isNumber } from "@onflow/sdk"

isNumber(d)
```

## Usage

```typescript
import { isNumber } from "@onflow/sdk"

console.log(isNumber(42)); // true
console.log(isNumber("42")); // false
console.log(isNumber(3.14)); // true
console.log(isNumber(null)); // false
```

## Parameters

### `d` 

- Type: `any`
- Description: The value to check



## Returns

`boolean`


---