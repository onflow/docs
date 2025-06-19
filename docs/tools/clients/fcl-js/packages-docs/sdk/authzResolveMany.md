---
sidebar_position: 1
title: "authzResolveMany"
description: "authzResolveMany function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/test-utils/index.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/test-utils/index.ts). DO NOT EDIT MANUALLY -->

# authzResolveMany

Creates a test authorization resolver that handles multiple accounts with different roles.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.authzResolveMany(opts)
```

Or import directly the specific function:

```typescript
import { authzResolveMany } from "@onflow/sdk"

authzResolveMany(opts)
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


## Returns

`function`


---