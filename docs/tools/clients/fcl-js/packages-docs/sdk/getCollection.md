---
title: "getCollection"
description: "getCollection function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/build/build-get-collection.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/build/build-get-collection.ts). DO NOT EDIT MANUALLY -->

# getCollection

A builder function that returns a collection containing a list of transaction IDs by its collection ID.

A collection is a batch of transactions that have been included in a block. Each collection has a unique ID
which is the SHA3-256 hash of the collection payload. Collections are used to group related transactions
together for more efficient processing by the network.

The collection ID provided must be from the current spork. Collections from past sporks are currently unavailable.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.getCollection(id)
```

Or import directly the specific function:

```typescript
import { getCollection } from "@onflow/sdk"

getCollection(id)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Get a collection and see what transactions it contains
const collection = await fcl.send([
  fcl.getCollection("cccdb0c67d015dc7f6444e8f62a3244ed650215ed66b90603006c70c5ef1f6e5")
]).then(fcl.decode);

console.log("Collection ID:", collection.id);
console.log("Transaction IDs:", collection.transactionIds);
console.log("Total transactions:", collection.transactionIds.length);

// Process each transaction in the collection
for (const txId of collection.transactionIds) {
  const transaction = await fcl.send([
    fcl.getTransaction(txId)
  ]).then(fcl.decode);
  console.log("Transaction:", transaction);
}
```

## Parameters

### `id` (optional)


- Type: `string`


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A function that processes an interaction object

---