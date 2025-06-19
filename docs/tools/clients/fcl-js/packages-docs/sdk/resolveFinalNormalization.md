---
sidebar_position: 1
title: "resolveFinalNormalization"
description: "resolveFinalNormalization function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/resolve/resolve-final-normalization.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/resolve/resolve-final-normalization.ts). DO NOT EDIT MANUALLY -->

# resolveFinalNormalization

Normalizes account addresses by removing the "0x" prefix from all account addresses in the interaction.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.resolveFinalNormalization(ix)
```

Or import directly the specific function:

```typescript
import { resolveFinalNormalization } from "@onflow/sdk"

resolveFinalNormalization(ix)
```


## Parameters

### `ix` 

- Type: [`Interaction`](../types#interaction)
- Description: The interaction object to normalize



## Returns

[`Promise<Interaction>`](../types#interaction)


---