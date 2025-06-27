---
sidebar_position: 1
title: "initServiceRegistry"
description: "initServiceRegistry function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/src/current-user/exec-service/plugins.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/src/current-user/exec-service/plugins.ts). DO NOT EDIT MANUALLY -->

# initServiceRegistry

Initializes the service registry with core strategies for different communication methods.
This function sets up the registry that manages wallet service strategies and should be called once
during FCL initialization with platform-specific core strategies.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.initServiceRegistry(options)
```

Or import directly the specific function:

```typescript
import { initServiceRegistry } from "@onflow/fcl-core"

initServiceRegistry(options)
```

## Usage

```typescript
// Initialize service registry with core strategies
const registry = initServiceRegistry({
  coreStrategies: {
    "HTTP/POST": httpPostStrategy,
    "IFRAME/RPC": iframeRpcStrategy,
    "POP/RPC": popupRpcStrategy
  }
})
```

## Parameters

### `options` 


- Type: 
```typescript
{ coreStrategies: any; }
```


## Returns

```typescript
Readonly<{ add: (servicePlugin: any) => void; getServices: () => any[]; getStrategy: (method: any) => unknown; getStrategies: () => any[]; }>
```


The initialized service registry instance

---