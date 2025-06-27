---
sidebar_position: 1
title: "unauthenticate"
description: "unauthenticate function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/src/fcl.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/src/fcl.ts). DO NOT EDIT MANUALLY -->

# unauthenticate

Logs out the current user and sets the values on the current user object to null.

This method can only be used in web browsers.

The current user must be authenticated first.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.unauthenticate()
```

Or import directly the specific function:

```typescript
import { unauthenticate } from "@onflow/fcl"

unauthenticate()
```

## Usage

```typescript
import * as fcl from '@onflow/fcl';
fcl.config().put('accessNode.api', 'https://rest-testnet.onflow.org');
// first authenticate to set current user
fcl.authenticate();
// ... somewhere else & sometime later
fcl.unauthenticate();
// fcl.currentUser.loggedIn === null
```


## Returns

`void`


---