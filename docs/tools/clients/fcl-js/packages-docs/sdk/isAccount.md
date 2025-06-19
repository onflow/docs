---
sidebar_position: 1
title: "isAccount"
description: "isAccount function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# isAccount

Checks if an object is an account resolver.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.isAccount(account)
```

Or import directly the specific function:

```typescript
import { isAccount } from "@onflow/sdk"

isAccount(account)
```

## Usage

```typescript
import { isAccount, authorization } from "@onflow/sdk"

const authz = authorization("0x123", signingFunction);
const accountResolver = { kind: "ACCOUNT", addr: "0x123" };
const regularObject = { name: "test" };

console.log(isAccount(accountResolver)); // true
console.log(isAccount(regularObject)); // false
```

## Parameters

### `account` 

- Type: `Record<string, any>`
- Description: The object to check



## Returns

`boolean`


---