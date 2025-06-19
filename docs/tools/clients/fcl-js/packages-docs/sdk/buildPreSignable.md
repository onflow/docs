---
sidebar_position: 1
title: "buildPreSignable"
description: "buildPreSignable function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/resolve/resolve-accounts.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/resolve/resolve-accounts.ts). DO NOT EDIT MANUALLY -->

# buildPreSignable

Builds a pre-signable object containing interaction data before signing.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.buildPreSignable(acct, ix)
```

Or import directly the specific function:

```typescript
import { buildPreSignable } from "@onflow/sdk"

buildPreSignable(acct, ix)
```


## Parameters

### `acct` 

- Type: [`InteractionAccount`](../types#interactionaccount)
- Description: The account to create the pre-signable for


### `ix` 

- Type: [`Interaction`](../types#interaction)
- Description: The interaction object containing transaction details



## Returns

`{ f_type: string; f_vsn: string; roles: { proposer: boolean; authorizer: boolean; payer: boolean; param?: boolean; }; cadence: string; args: any[]; data: {}; interaction: Interaction; voucher: { cadence: string; refBlock: string; computeLimit: number; arguments: any[]; proposalKey: { address: string; keyId: string | number; sequenceNum: number; } | { address?: undefined; keyId?: undefined; sequenceNum?: undefined; }; payer: string; authorizers: string[]; payloadSigs: { address: string; keyId: string | number; sig: string; }[]; envelopeSigs: { address: string; keyId: string | number; sig: string; }[]; }; }`


---