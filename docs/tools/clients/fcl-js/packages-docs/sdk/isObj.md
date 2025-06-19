---
sidebar_position: 1
title: "isObj"
description: "isObj function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# isObj

Checks if a value is an object (but not null).

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.isObj(d)
```

Or import directly the specific function:

```typescript
import { isObj } from "@onflow/sdk"

isObj(d)
```

## Usage

```typescript
import { isObj } from "@onflow/sdk"

console.log(isObj({})); // true
console.log(isObj({name: "Alice"})); // true
console.log(isObj(null)); // false
console.log(isObj("string")); // false
console.log(isObj([])); // true (arrays are objects)
```

## Parameters

### `d` 

- Type: `any`
- Description: The value to check



## Returns

`boolean`


---