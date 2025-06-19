---
sidebar_position: 1
title: "decode"
description: "decode function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/decode/sdk-decode.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/decode/sdk-decode.ts). DO NOT EDIT MANUALLY -->

# decode

Decodes the response from 'fcl.send()' into the appropriate JSON representation of any values returned from Cadence code.

The response from Flow contains encoded values that need to be decoded into JavaScript types. This function handles that conversion, including complex types like structs, arrays, and dictionaries.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.decode(response)
```

Or import directly the specific function:

```typescript
import { decode } from "@onflow/sdk"

decode(response)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Simple script to add 2 numbers
const response = await fcl.send([
  fcl.script`
    access(all) fun main(int1: Int, int2: Int): Int {
      return int1 + int2
    }
  `,
  fcl.args([fcl.arg(1, fcl.t.Int), fcl.arg(2, fcl.t.Int)])
]);

const decoded = await fcl.decode(response);
console.log(decoded); // 3
console.log(typeof decoded); // "number"

// Complex return types
const complexResponse = await fcl.send([
  fcl.script`
    access(all) fun main(): {String: Int} {
      return {"foo": 1, "bar": 2}
    }
  `
]);

const complexDecoded = await fcl.decode(complexResponse);
console.log(complexDecoded); // {foo: 1, bar: 2}
```

## Parameters

### `response` 

- Type: `any`
- Description: Should be the response returned from 'fcl.send([...])'



## Returns

`Promise<any>`


---