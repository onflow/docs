---
sidebar_position: 1
title: "prepAccount"
description: "prepAccount function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# prepAccount

Prepares and configures an account for use in an interaction with a specific...

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.prepAccount(acct, opts)
```

Or import directly the specific function:

```typescript
import { prepAccount } from "@onflow/sdk"

prepAccount(acct, opts)
```


## Parameters

### `acct` 

- Type: `AccountAuthorization`
- Description: The account authorization function or account object

```typescript
export type AccountAuthorization =
  | (AuthorizationFn & Partial<InteractionAccount>)
  | Partial<InteractionAccount>
```

### `opts` (optional)

- Type: `IPrepAccountOpts`
- Description: Configuration options including the role for the account

```typescript
interface IPrepAccountOpts {
  role?: TransactionRole | null
}
```


## Returns

`function`


---