---
sidebar_position: 1
title: "resolveComputeLimit"
description: "resolveComputeLimit function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/resolve/resolve-compute-limit.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/resolve/resolve-compute-limit.ts). DO NOT EDIT MANUALLY -->

# resolveComputeLimit

Resolves the compute limit for a transaction from configuration or applies...

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.resolveComputeLimit(ix)
```

Or import directly the specific function:

```typescript
import { resolveComputeLimit } from "@onflow/sdk"

resolveComputeLimit(ix)
```


## Parameters

### `ix` 

- Type: [`Interaction`](../types#interaction)
- Description: The interaction object to resolve compute limit for



## Returns

[`Promise<Interaction>`](../types#interaction)


---