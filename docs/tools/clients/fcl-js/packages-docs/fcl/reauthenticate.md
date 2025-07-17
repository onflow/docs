---
title: "reauthenticate"
description: "reauthenticate function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/src/fcl.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/src/fcl.ts). DO NOT EDIT MANUALLY -->

# reauthenticate

A convenience method that calls `fcl.unauthenticate()` and then `fcl.authenticate()` for the current user.

This method can only be used in web browsers.

The current user must be authenticated first.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.reauthenticate(opts)
```

Or import directly the specific function:

```typescript
import { reauthenticate } from "@onflow/fcl"

reauthenticate(opts)
```

## Usage

```typescript
import * as fcl from '@onflow/fcl';
// first authenticate to set current user
fcl.authenticate();
// ... somewhere else & sometime later
fcl.reauthenticate();
// logs out user and opens up login/sign-up flow
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