---
sidebar_position: 1
title: "resolveCadence"
description: "resolveCadence function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/resolve/resolve-cadence.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/resolve/resolve-cadence.ts). DO NOT EDIT MANUALLY -->

# resolveCadence

Resolves Cadence code by evaluating functions and replacing contract placeholders with addresses.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.resolveCadence(ix)
```

Or import directly the specific function:

```typescript
import { resolveCadence } from "@onflow/sdk"

resolveCadence(ix)
```


## Parameters

### `ix` 

- Type: [`Interaction`](../types#interaction)
- Description: The interaction object containing Cadence code to resolve



## Returns

[`Promise<Interaction>`](../types#interaction)


---