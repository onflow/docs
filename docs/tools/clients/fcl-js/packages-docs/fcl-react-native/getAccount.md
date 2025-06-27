---
sidebar_position: 1
title: "getAccount"
description: "getAccount function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-react-native/../sdk/src/build/build-get-account.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-react-native/../sdk/src/build/build-get-account.ts). DO NOT EDIT MANUALLY -->

# getAccount

A builder function that returns the interaction to get an account by address.

Consider using the pre-built interaction 'fcl.account(address)' if you do not need to pair with any other builders.

Account address is a unique account identifier. Be mindful about the '0x' prefix, you should use the prefix as a default representation but be careful and safely handle user inputs without the prefix.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-react-native"

fcl.getAccount(addr)
```

Or import directly the specific function:

```typescript
import { getAccount } from "@onflow/fcl-react-native"

getAccount(addr)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// somewhere in an async function
// fcl.account is the same as this function
const getAccount = async (address) => {
  const account = await fcl.send([fcl.getAccount(address)]).then(fcl.decode);
  return account;
};
```

## Parameters

### `addr` 


- Type: `string`


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A function that processes an interaction object

---