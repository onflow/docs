---
title: "sansPrefix"
description: "sansPrefix function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/../util-address/src/index.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/../util-address/src/index.ts). DO NOT EDIT MANUALLY -->

# sansPrefix

Removes 0x from address if present

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.sansPrefix(address)
```

Or import directly the specific function:

```typescript
import { sansPrefix } from "@onflow/fcl-core"

sansPrefix(address)
```


## Parameters

### `address` 


- Type: `null`
- Description: - Flow address


## Returns

`null`


Flow address without 0x prefix

---