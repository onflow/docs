---
sidebar_position: 1
title: "authzDeepResolveMany"
description: "authzDeepResolveMany function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/test-utils/index.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/test-utils/index.ts). DO NOT EDIT MANUALLY -->

# authzDeepResolveMany

Creates a deep test authorization resolver with nested resolution for complex testing scenarios.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.authzDeepResolveMany(opts, depth)
```

Or import directly the specific function:

```typescript
import { authzDeepResolveMany } from "@onflow/sdk"

authzDeepResolveMany(opts, depth)
```


## Parameters

### `opts` (optional)

- Type: `IAuthzResolveMany`
- Description: Configuration including authorizations array and optional proposer/payer

```typescript
interface IAuthzResolveMany {
  tempId?: string
  authorizations: any[]
  proposer?: any
  payer?: any
}
```

### `depth` (optional)

- Type: `number`
- Description: The depth of nesting for the resolver (default: 1)



## Returns

`function`


---