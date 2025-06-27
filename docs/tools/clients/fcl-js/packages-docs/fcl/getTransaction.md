---
sidebar_position: 1
title: "getTransaction"
description: "getTransaction function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/src/fcl.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/src/fcl.ts). DO NOT EDIT MANUALLY -->

# getTransaction

A builder function that returns the interaction to get a transaction by ID

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.getTransaction(id)
```

Or import directly the specific function:

```typescript
import { getTransaction } from "@onflow/fcl"

getTransaction(id)
```


## Parameters

### `id` 


- Type: `string`
- Description: The ID of the transaction to get


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A function that processes an interaction object

---