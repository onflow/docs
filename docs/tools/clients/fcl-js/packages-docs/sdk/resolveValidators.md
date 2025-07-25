---
title: "resolveValidators"
description: "resolveValidators function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/resolve/resolve-validators.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/resolve/resolve-validators.ts). DO NOT EDIT MANUALLY -->

# resolveValidators

Executes validator functions that have been attached to an interaction to perform validation checks.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.resolveValidators(ix)
```

Or import directly the specific function:

```typescript
import { resolveValidators } from "@onflow/sdk"

resolveValidators(ix)
```


## Parameters

### `ix` 


- Type: [`Interaction`](../types#interaction)
- Description: The interaction object containing validators to execute


## Returns

[`Promise<Interaction>`](../types#interaction)


The interaction after running all validators

---