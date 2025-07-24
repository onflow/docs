---
title: "pluginRegistry"
description: "pluginRegistry function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-react-native/../fcl-core/src/current-user/exec-service/plugins.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-react-native/../fcl-core/src/current-user/exec-service/plugins.ts). DO NOT EDIT MANUALLY -->

# pluginRegistry

Global plugin registry instance for managing FCL plugins. This registry handles
the registration and management of various FCL plugins including service plugins that add
new wallet services and strategies.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-react-native"

fcl.pluginRegistry()
```

Or import directly the specific function:

```typescript
import { pluginRegistry } from "@onflow/fcl-react-native"

pluginRegistry()
```

## Usage

```typescript
// Add a plugin to the registry
pluginRegistry.add({
  name: "MyWalletPlugin",
  f_type: "ServicePlugin",
  type: "discovery-service",
  services: [...],
  serviceStrategy: { method: "CUSTOM/RPC", exec: customExecFunction }
})
```


## Returns

```typescript
Readonly<{ add: (plugins: any) => void; getPlugins: () => Map<any, any>; }>
```


---