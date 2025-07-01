---
sidebar_position: 1
title: "getNodeVersionInfo"
description: "getNodeVersionInfo function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-react-native/../sdk/src/build/build-get-node-version-info.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-react-native/../sdk/src/build/build-get-node-version-info.ts). DO NOT EDIT MANUALLY -->

# getNodeVersionInfo

A builder function for the Get Node Version Info interaction.

Creates an interaction to retrieve version information from the connected Flow Access Node.
This includes details about the node's software version, protocol version, and spork information.

Consider using the pre-built interaction 'fcl.nodeVersionInfo()' if you do not need to pair with any other builders.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-react-native"

fcl.getNodeVersionInfo()
```

Or import directly the specific function:

```typescript
import { getNodeVersionInfo } from "@onflow/fcl-react-native"

getNodeVersionInfo()
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Get node version information using builder
const versionInfo = await fcl.send([
  fcl.getNodeVersionInfo()
]).then(fcl.decode);

console.log("Node version:", versionInfo.semver);
console.log("Protocol version:", versionInfo.protocol_version);
console.log("Spork ID:", versionInfo.spork_id);

// Use with other builders if needed
const interaction = await fcl.build([
  fcl.getNodeVersionInfo()
  // other builders can be added here
]);
```


## Returns

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```


A function that processes an interaction object

---