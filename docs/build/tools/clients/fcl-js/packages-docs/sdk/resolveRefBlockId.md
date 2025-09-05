---
title: "resolveRefBlockId"
description: "resolveRefBlockId function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/resolve/resolve-ref-block-id.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/resolve/resolve-ref-block-id.ts). DO NOT EDIT MANUALLY -->

# resolveRefBlockId

Resolves the reference block ID for a transaction by querying the latest block from the network.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.resolveRefBlockId(opts)
```

Or import directly the specific function:

```typescript
import { resolveRefBlockId } from "@onflow/sdk"

resolveRefBlockId(opts)
```


## Parameters

### `opts` (optional)


- Type: 
```typescript
{
  [key: string]: any;
}
```
- Description: Optional configuration parameters


## Returns

[`Promise<Interaction>`](../types#interaction)


A function that resolves the reference block ID for an interaction

---