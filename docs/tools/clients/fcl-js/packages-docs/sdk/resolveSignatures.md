---
sidebar_position: 1
title: "resolveSignatures"
description: "resolveSignatures function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/resolve/resolve-signatures.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/resolve/resolve-signatures.ts). DO NOT EDIT MANUALLY -->

# resolveSignatures

Resolves signatures for a transaction by coordinating the signing process for inside and outside signers.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.resolveSignatures(ix)
```

Or import directly the specific function:

```typescript
import { resolveSignatures } from "@onflow/sdk"

resolveSignatures(ix)
```


## Parameters

### `ix` 


- Type: [`Interaction`](../types#interaction)
- Description: The interaction object containing transaction details


## Returns

[`Promise<Interaction>`](../types#interaction)


The interaction object with resolved signatures

---