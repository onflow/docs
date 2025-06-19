---
sidebar_position: 1
title: "getTransaction"
description: "getTransaction function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/build/build-get-transaction.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/build/build-get-transaction.ts). DO NOT EDIT MANUALLY -->

# getTransaction

A builder function that returns the interaction to get a transaction by id.

Transaction id is a hash of the encoded transaction payload and can be calculated before submitting the transaction to the network.
Transaction status represents the state of a transaction in the blockchain. Status can change until it is finalized.

The transaction id provided must be from the current spork.

Consider using 'fcl.tx(id).onceExecuted()' instead of calling this method directly for real-time transaction monitoring.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.getTransaction(id)
```

Or import directly the specific function:

```typescript
import { getTransaction } from "@onflow/sdk"

getTransaction(id)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

const tx = await fcl.send([
  fcl.getTransaction("9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3")
]).then(fcl.decode);
```

## Parameters

### `id` 

- Type: `string`



## Returns

`InteractionBuilderFn`

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```

---