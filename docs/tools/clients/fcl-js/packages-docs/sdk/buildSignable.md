---
sidebar_position: 1
title: "buildSignable"
description: "buildSignable function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/resolve/resolve-signatures.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/resolve/resolve-signatures.ts). DO NOT EDIT MANUALLY -->

# buildSignable

Builds a signable object that can be signed by an authorization function.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.buildSignable(acct, message, ix)
```

Or import directly the specific function:

```typescript
import { buildSignable } from "@onflow/sdk"

buildSignable(acct, message, ix)
```


## Parameters

### `acct` 

- Type: [`InteractionAccount`](../types#interactionaccount)
- Description: The account to create the signable for


### `message` 

- Type: `string`
- Description: The encoded message to be signed


### `ix` 

- Type: [`Interaction`](../types#interaction)
- Description: The interaction object containing transaction details



## Returns

`{ f_type: string; f_vsn: string; message: string; addr: string; keyId: string | number; roles: { proposer: boolean; authorizer: boolean; payer: boolean; param?: boolean; }; cadence: string; args: any[]; data: {}; interaction: Interaction; voucher: { cadence: string; refBlock: string; computeLimit: number; arguments: any[]; proposalKey: { address: string; keyId: string | number; sequenceNum: number; } | { address?: undefined; keyId?: undefined; sequenceNum?: undefined; }; payer: string; authorizers: string[]; payloadSigs: { address: string; keyId: string | number; sig: string; }[]; envelopeSigs: { address: string; keyId: string | number; sig: string; }[]; }; }`


---