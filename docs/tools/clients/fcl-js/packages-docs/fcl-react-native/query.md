---
title: "query"
description: "query function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-react-native/src/fcl-react-native.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-react-native/src/fcl-react-native.ts). DO NOT EDIT MANUALLY -->

# query

Allows you to submit scripts to query the blockchain.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-react-native"

fcl.query(opts)
```

Or import directly the specific function:

```typescript
import { query } from "@onflow/fcl-react-native"

query(opts)
```

## Usage

```typescript
import * as fcl from '@onflow/fcl';

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
    arg('0xba1132bc08f82fe2', t.Address), // addr: Address
  ],
});
console.log(result); // 13
```

## Parameters

### `opts` (optional)


- Type: 
```typescript
export interface QueryOptions {
  cadence?: string
  args?: ArgsFn
  template?: any
  isSealed?: boolean
  limit?: number
}
```
- Description: Query options configuration

#### Properties:

- **`cadence`**  - A valid cadence script (required)
- **`args`**  - Any arguments to the script if needed should be supplied via a function that returns an array of arguments
- **`limit`**  - Compute (Gas) limit for query.
- **`template`**  - Interaction Template for a script
- **`isSealed`**  - Block Finality


## Returns

`Promise<any>`


A JSON representation of the response

---