---
sidebar_position: 1
title: "ping"
description: "ping function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/build/build-ping.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/build/build-ping.ts). DO NOT EDIT MANUALLY -->

# ping

A builder function that creates a ping interaction to test connectivity to the Flow Access Node.

The ping interaction is a simple way to test if the Flow Access Node is reachable and responding. This is useful for health checks, connectivity testing, and debugging network issues.

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.ping()
```

Or import directly the specific function:

```typescript
import { ping } from "@onflow/sdk"

ping()
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";

// Simple ping to test connectivity
try {
  const response = await fcl.send([fcl.ping()]);
  console.log("Access Node is reachable");
} catch (error) {
  console.error("Access Node is not reachable:", error);
}

// Use ping for health checks
const healthCheck = async () => {
  try {
    await fcl.send([fcl.ping()]);
    return { status: "healthy", timestamp: new Date().toISOString() };
  } catch (error) {
    return { status: "unhealthy", error: error.message, timestamp: new Date().toISOString() };
  }
};

const health = await healthCheck();
console.log("Health status:", health);
```


## Returns

`InteractionBuilderFn`

```typescript
export type InteractionBuilderFn = (
  ix: Interaction
) => Interaction | Promise<Interaction>
```

---