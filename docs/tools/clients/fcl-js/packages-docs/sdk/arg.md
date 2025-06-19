---
sidebar_position: 1
title: "arg"
description: "arg function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/build/build-arguments.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/build/build-arguments.ts). DO NOT EDIT MANUALLY -->

# arg

A utility builder to be used with fcl.args[...] to create FCL supported arguments for interactions.

Arguments are used to pass data to Cadence scripts and transactions. The arguments must match the number and order declared in the Cadence script.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.arg(value, xform)
```

Or import directly the specific function:

```typescript
import { arg } from "@onflow/sdk"

arg(value, xform)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl"

const result = await fcl.query({
  cadence: `
    access(all) fun main(a: Int, b: Int, addr: Address): Int {
      log(addr)
      return a + b
    }
  `,
  args: (arg, t) => [
    arg(7, t.Int), // a: Int
    arg(6, t.Int), // b: Int
    arg("0xba1132bc08f82fe2", t.Address), // addr: Address
  ],
});
```

## Parameters

### `value` 

- Type: `TypeDescriptorInput`
- Description: The value of the argument


### `xform` 

- Type: `T`
- Description: A function to transform the value (type descriptor)



## Returns

`CadenceArgument`

```typescript
type CadenceArgument<T extends TypeDescriptor<any, any>> = {
  value: TypeDescriptorInput<T>
  xform: T
}
```

---