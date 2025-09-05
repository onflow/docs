---
title: "getTransactionStatus"
description: "getTransactionStatus function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/build/build-get-transaction-status.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/build/build-get-transaction-status.ts). DO NOT EDIT MANUALLY -->

# getTransactionStatus

A builder function that returns the status of transaction.

The transaction id provided must be from the current spork.

Consider using 'fcl.tx(id)' instead of calling this method directly for real-time transaction monitoring.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.getTransactionStatus(transactionId)
```

Or import directly the specific function:

```typescript
import { getTransactionStatus } from "@onflow/sdk"

getTransactionStatus(transactionId)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

const status = await fcl.send([
  fcl.getTransactionStatus("9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3")
]).then(fcl.decode);
```

## Parameters

### `transactionId` 


- Type: `string`
- Description: The id of the transaction to get the status of


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A function that processes an interaction object

---