---
sidebar_position: 1
title: "initAccount"
description: "initAccount function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/interaction/interaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/interaction/interaction.ts). DO NOT EDIT MANUALLY -->

# initAccount

Creates a new account object with default values.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.initAccount()
```

Or import directly the specific function:

```typescript
import { initAccount } from "@onflow/sdk"

initAccount()
```

## Usage

```typescript
import { initAccount } from "@onflow/sdk"

const account = initAccount();
console.log(account.addr); // null
console.log(account.keyId); // null
console.log(account.role.proposer); // false

// Typically used internally by other functions
// You'll more commonly use authorization() or prepAccount()
```


## Returns

[`InteractionAccount`](../types#interactionaccount)


---