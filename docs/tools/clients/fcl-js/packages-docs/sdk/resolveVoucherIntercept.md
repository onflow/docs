---
sidebar_position: 1
title: "resolveVoucherIntercept"
description: "resolveVoucherIntercept function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/resolve/resolve-voucher-intercept.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/resolve/resolve-voucher-intercept.ts). DO NOT EDIT MANUALLY -->

# resolveVoucherIntercept

Resolves voucher intercept functions by calling them with the current voucher.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.resolveVoucherIntercept(ix)
```

Or import directly the specific function:

```typescript
import { resolveVoucherIntercept } from "@onflow/sdk"

resolveVoucherIntercept(ix)
```


## Parameters

### `ix` 

- Type: [`Interaction`](../types#interaction)
- Description: The interaction object to resolve voucher intercepts for



## Returns

[`Promise<Interaction>`](../types#interaction)


---