---
sidebar_position: 1
title: "account"
description: "account function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-react-native/../sdk/src/account/account.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-react-native/../sdk/src/account/account.ts). DO NOT EDIT MANUALLY -->

# account

Retrieve any account from Flow network's latest block or from a specified block height.

Account address is a unique account identifier. Be mindful about the '0x' prefix, you should use the prefix as a default representation but be careful and safely handle user inputs without the prefix.

An account includes the following data:
- Address: the account address.
- Balance: balance of the account.
- Contracts: list of contracts deployed to the account.
- Keys: list of keys associated with the account.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-react-native"

fcl.account(address, accountQueryOptions, opts)
```

Or import directly the specific function:

```typescript
import { account } from "@onflow/fcl-react-native"

account(address, accountQueryOptions, opts)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Get account from latest block height
const account = await fcl.account("0x1d007d755706c469");
console.log("Address:", account.address);
console.log("Balance:", account.balance);
console.log("Keys:", account.keys);
console.log("Contracts:", Object.keys(account.contracts));

// Get account at a specific block height
const historicalAccount = await fcl.account("0x1d007d755706c469", {
  height: 12345
});

// Get account at a specific block ID
const accountAtBlock = await fcl.account("0x1d007d755706c469", {
  id: "9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3"
});

// Get account from sealed block
const sealedAccount = await fcl.account("0x1d007d755706c469", {
  isSealed: true
});

// Alternative using builder pattern
fcl.send([
  fcl.getAccount("0x1d007d755706c469"),
  fcl.atBlockHeight(123)
]).then(fcl.decode);
```

## Parameters

### `address` 


- Type: `string`
- Description: Address of the account

### `accountQueryOptions` (optional)


- Type: 
```typescript
interface AccountQueryOptions {
  height?: number
  id?: string
  isSealed?: boolean
}
```

### `opts` (optional)


- Type: `object`
- Description: Optional parameters


## Returns

[`Promise<Account>`](../types#account)


A promise that resolves to an Account object

---