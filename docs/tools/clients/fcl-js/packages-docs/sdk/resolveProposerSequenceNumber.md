---
sidebar_position: 1
title: "resolveProposerSequenceNumber"
description: "resolveProposerSequenceNumber function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/resolve/resolve-proposer-sequence-number.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/resolve/resolve-proposer-sequence-number.ts). DO NOT EDIT MANUALLY -->

# resolveProposerSequenceNumber

Resolves the sequence number for the proposer account by querying the blockchain.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.resolveProposerSequenceNumber(nodeConfig)
```

Or import directly the specific function:

```typescript
import { resolveProposerSequenceNumber } from "@onflow/sdk"

resolveProposerSequenceNumber(nodeConfig)
```


## Parameters

### `nodeConfig` 


- Type: 
```typescript
interface NodeConfig {
  node: string
}
```


## Returns

```typescript
(ix: Interaction) => Promise<Interaction>
```


A function that resolves the proposer sequence number for an interaction

---