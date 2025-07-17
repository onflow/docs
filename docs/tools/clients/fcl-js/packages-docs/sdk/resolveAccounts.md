---
title: "resolveAccounts"
description: "resolveAccounts function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/resolve/resolve-accounts.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/resolve/resolve-accounts.ts). DO NOT EDIT MANUALLY -->

# resolveAccounts

Resolves account authorization functions and validates account configurations for transactions.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.resolveAccounts(ix, opts)
```

Or import directly the specific function:

```typescript
import { resolveAccounts } from "@onflow/sdk"

resolveAccounts(ix, opts)
```


## Parameters

### `ix` 


- Type: [`Interaction`](../types#interaction)
- Description: The interaction object containing accounts to resolve

### `opts` (optional)


- Type: 
```typescript
Record<string, any>
```
- Description: Configuration options for resolution


## Returns

[`Promise<Interaction>`](../types#interaction)


The interaction with resolved accounts

---