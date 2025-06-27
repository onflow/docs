---
sidebar_position: 1
title: "nodeVersionInfo"
description: "nodeVersionInfo function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/../sdk/src/node-version-info/node-version-info.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/../sdk/src/node-version-info/node-version-info.ts). DO NOT EDIT MANUALLY -->

# nodeVersionInfo

Retrieve version information from the connected Flow Access Node.

This function returns detailed information about the Flow node's version, including the protocol version, spork information, and node-specific details. This is useful for debugging, compatibility checks, and understanding the network state.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.nodeVersionInfo(opts)
```

Or import directly the specific function:

```typescript
import { nodeVersionInfo } from "@onflow/fcl"

nodeVersionInfo(opts)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Get node version information
const versionInfo = await fcl.nodeVersionInfo();
console.log(versionInfo);
// {
//   semver: "v0.37.13",
//   commit: "12345abcd",
//   spork_id: "mainnet-23",
//   protocol_version: "2.13.10",
//   spork_root_block_height: "88483760",
//   node_root_block_height: "88483760"
// }

// Check compatibility
const info = await fcl.nodeVersionInfo();
if (info.protocol_version.startsWith("2.13")) {
  console.log("Compatible with current protocol version");
}
```

## Parameters

### `opts` (optional)


- Type: `any`
- Description: Optional parameters for the request


## Returns

[`Promise<NodeVersionInfo>`](../types#nodeversioninfo)


A promise that resolves to a block response

---