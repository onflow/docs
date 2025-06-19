---
sidebar_position: 1
title: "authzFn"
description: "authzFn function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/test-utils/index.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/test-utils/index.ts). DO NOT EDIT MANUALLY -->

# authzFn

Creates a test authorization function for testing transactions.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.authzFn(opts)
```

Or import directly the specific function:

```typescript
import { authzFn } from "@onflow/sdk"

authzFn(opts)
```


## Parameters

### `opts` (optional)

- Type: `IAuthzOpts`
- Description: Optional configuration including custom signing function

```typescript
interface IAuthzOpts {
  signingFunction?: (signable: any) => any
}
```


## Returns

`function`


---