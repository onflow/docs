---
title: "args"
description: "args function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/build/build-arguments.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/build/build-arguments.ts). DO NOT EDIT MANUALLY -->

# args

A utility builder to be used with other builders to pass in arguments with a value and supported type.

A transaction can accept zero or more arguments that are passed into the Cadence script. The arguments on the transaction must match the number and order declared in the Cadence script.
This function returns a Partial Interaction that contains the arguments and types passed in. This alone is a partial and incomplete interaction.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.args(ax)
```

Or import directly the specific function:

```typescript
import { args } from "@onflow/sdk"

args(ax)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl"

await fcl.mutate({
  cadence: `
    transaction(amount: UFix64, to: Address) {
      prepare(signer: AuthAccount) {
        // transaction logic
      }
    }
  `,
  args: (arg, t) => [
    arg("10.0", t.UFix64), // Will be the first argument `amount: UFix64`
    arg("0xba1132bc08f82fe2", t.Address), // Will be the second argument `to: Address`
  ],
})
```

## Parameters

### `ax` 


- Type: 
```typescript
CadenceArgument<any>[]
```
- Description: An array of argument objects created with fcl.arg()


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A Partial Interaction object containing the arguments and types passed in

---