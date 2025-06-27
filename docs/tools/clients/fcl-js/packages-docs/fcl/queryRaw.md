---
sidebar_position: 1
title: "queryRaw"
description: "queryRaw function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/../fcl-core/src/exec/query-raw.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/../fcl-core/src/exec/query-raw.ts). DO NOT EDIT MANUALLY -->

# queryRaw

Allows you to submit scripts to query the blockchain and get raw response data.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.queryRaw(opts)
```

Or import directly the specific function:

```typescript
import { queryRaw } from "@onflow/fcl"

queryRaw(opts)
```

## Usage

```typescript
import * as fcl from '@onflow/fcl';

const result = await fcl.queryRaw({
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
- Description: Query Options and configuration


## Returns

`Promise<any>`


A promise that resolves to the raw query result

---