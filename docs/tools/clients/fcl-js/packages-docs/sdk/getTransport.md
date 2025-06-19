---
sidebar_position: 1
title: "getTransport"
description: "getTransport function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/transport/get-transport.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/transport/get-transport.ts). DO NOT EDIT MANUALLY -->

# getTransport

Get the SDK transport object, either from the provided override or from the...

## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.getTransport(override)
```

Or import directly the specific function:

```typescript
import { getTransport } from "@onflow/sdk"

getTransport(override)
```

## Usage

```typescript
import * as fcl from "@onflow/fcl";
import { httpTransport } from "@onflow/transport-http";

// Get default transport (usually HTTP transport)
const defaultTransport = await fcl.getTransport();

// Override with custom transport
const customTransport = await fcl.getTransport({
  transport: httpTransport({
    accessNode: "https://rest-mainnet.onflow.org",
    timeout: 10000
  })
});
```

## Parameters

### `override` (optional)

- Type: `SdkTransport;`
- Description: Override default configuration with custom transport or send function



## Returns

[`Promise<SdkTransport>`](../types#sdktransport)


---