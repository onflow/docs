---
sidebar_position: 1
title: "authzResolve"
description: "authzResolve function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/test-utils/index.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/test-utils/index.ts). DO NOT EDIT MANUALLY -->

# authzResolve

Creates a test authorization resolver that can be used for testing account resolution.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.authzResolve(opts)
```

Or import directly the specific function:

```typescript
import { authzResolve } from "@onflow/sdk"

authzResolve(opts)
```


## Parameters

### `opts` (optional)

- Type: `IAuthzResolveOpts`
- Description: Optional configuration including temporary ID

```typescript
interface IAuthzResolveOpts {
  tempId?: string
}
```


## Returns

`(account: InteractionAccount) => { tempId: string; resolve: (account: Partial<InteractionAccount>) => Partial<InteractionAccount>; kind: InteractionResolverKind.ACCOUNT; addr: string; keyId: string | number; sequenceNum: number; signature: string; signingFunction: any; role: { proposer: boolean; authorizer: boolean; payer: boolean; param?: boolean; }; authorization: any; }`


---