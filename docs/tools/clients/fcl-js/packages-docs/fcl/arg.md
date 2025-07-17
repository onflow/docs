---
title: "arg"
description: "arg function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/../sdk/src/build/build-arguments.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/../sdk/src/build/build-arguments.ts). DO NOT EDIT MANUALLY -->

# arg

A utility builder to be used with fcl.args[...] to create FCL supported arguments for interactions.

Arguments are used to pass data to Cadence scripts and transactions. The arguments must match the number and order declared in the Cadence script.
This function creates an ArgumentObject that holds the value and type passed in.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.arg(value, xform)
```

Or import directly the specific function:

```typescript
import { arg } from "@onflow/fcl"

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


- Type: 
```typescript
TypeDescriptorInput<T>
```
- Description: Any value that you are looking to pass to other builders

### `xform` 


- Type: `T`
- Description: A type supported by Flow (FType descriptor)


## Returns

```typescript
CadenceArgument<T>
```


An ArgumentObject that holds the value and type passed in

---