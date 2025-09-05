---
title: "getNetworkParameters"
description: "getNetworkParameters function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/../sdk/src/build/build-get-network-parameters.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/../sdk/src/build/build-get-network-parameters.ts). DO NOT EDIT MANUALLY -->

# getNetworkParameters

A builder function that returns the interaction to get network parameters.

Network parameters contain important configuration information about the Flow network,
including the chain ID, which is essential for signing transactions correctly.
This information is crucial for ensuring transactions are submitted to the correct network.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.getNetworkParameters()
```

Or import directly the specific function:

```typescript
import { getNetworkParameters } from "@onflow/fcl"

getNetworkParameters()
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Get network parameters to verify chain ID
const params = await fcl.send([
  fcl.getNetworkParameters()
]).then(fcl.decode);

console.log("Chain ID:", params.chainId);
console.log("Network:", params.name);

// Use this to verify you're connected to the right network
if (params.chainId === "flow-mainnet") {
  console.log("Connected to Flow Mainnet");
} else if (params.chainId === "flow-testnet") {
  console.log("Connected to Flow Testnet");
}
```


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A function that processes an interaction object

---