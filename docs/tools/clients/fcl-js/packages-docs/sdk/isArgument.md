---
sidebar_position: 1
title: "isArgument"
description: "isArgument function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# isArgument

Checks if an object is an argument resolver.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.isArgument(argument)
```

Or import directly the specific function:

```typescript
import { isArgument } from "@onflow/sdk"

isArgument(argument)
```

## Usage

```typescript
import { isArgument, arg } from "@onflow/sdk"

const argumentResolver = { kind: "ARGUMENT", value: 42 };
const regularObject = { value: 42 };

console.log(isArgument(argumentResolver)); // true
console.log(isArgument(regularObject)); // false

// Check arguments in a script
const scriptArgs = [arg(10, t.Int), arg("hello", t.String)];
scriptArgs.forEach(arg => {
  if (isArgument(arg)) {
    console.log("Valid argument:", arg.value);
  }
});
```

## Parameters

### `argument` 

- Type: `Record<string, any>`
- Description: The object to check



## Returns

`boolean`


---