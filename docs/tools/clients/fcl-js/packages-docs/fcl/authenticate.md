---
sidebar_position: 1
title: "authenticate"
description: "authenticate function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/src/fcl.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/src/fcl.ts). DO NOT EDIT MANUALLY -->

# authenticate

Calling this method will authenticate the current user via any wallet that supports FCL. Once called, FCL will initiate communication with the configured `discovery.wallet` endpoint which lets the user select a wallet to authenticate with. Once the wallet provider has authenticated the user, FCL will set the values on the current user object for future use and authorization.

This method can only be used in web browsers.

`discovery.wallet` value must be set in the configuration before calling this method. See FCL Configuration.

The default discovery endpoint will open an iframe overlay to let the user choose a supported wallet.

`authenticate` can also take a service returned from discovery with `fcl.authenticate({ service })`.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.authenticate(opts)
```

Or import directly the specific function:

```typescript
import { authenticate } from "@onflow/fcl"

authenticate(opts)
```

## Usage

```typescript
import * as fcl from '@onflow/fcl';
fcl
  .config()
  .put('accessNode.api', 'https://rest-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn');
// anywhere on the page
fcl.authenticate();
```

## Parameters

### `opts` (optional)


- Type: `{}`
- Description: Authentication options


## Returns

[`Promise<CurrentUser>`](../types#currentuser)


Promise that resolves to the authenticated CurrentUser object or undefined

---