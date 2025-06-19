---
sidebar_position: 1
title: "isFn"
description: "isFn function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# isFn

Checks if a value is a function.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.isFn(d)
```

Or import directly the specific function:

```typescript
import { isFn } from "@onflow/sdk"

isFn(d)
```

## Usage

```typescript
import { isFn } from "@onflow/sdk"

console.log(isFn(() => {})); // true
console.log(isFn(function() {})); // true
console.log(isFn("function")); // false
console.log(isFn({})); // false
```

## Parameters

### `d` 

- Type: `any`
- Description: The value to check



## Returns

`boolean`


---