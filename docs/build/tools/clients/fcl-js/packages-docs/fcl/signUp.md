---
title: "signUp"
description: "signUp function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/src/fcl.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/src/fcl.ts). DO NOT EDIT MANUALLY -->

# signUp

A convenience method that calls and is equivalent to `fcl.authenticate()`.

This method can only be used in web browsers.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.signUp(opts)
```

Or import directly the specific function:

```typescript
import { signUp } from "@onflow/fcl"

signUp(opts)
```

## Usage

```typescript
import * as fcl from '@onflow/fcl';
fcl.config()
  .put('accessNode.api', 'https://rest-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn');

// User clicks sign up button
fcl.signUp();
```

## Parameters

### `opts` (optional)


- Type: `{}`
- Description: Authentication options passed to authenticate method

#### Properties:

- **`service`**  - Optional service to use for authentication
- **`redir`**  - Optional redirect flag. Defaults to false.
- **`forceReauth`**  - Optional force re-authentication flag. Defaults to false.


## Returns

[`Promise<CurrentUser>`](../types#currentuser)


Promise that resolves to the authenticated CurrentUser object or undefined

---