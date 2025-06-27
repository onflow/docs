---
sidebar_position: 1
title: "execStrategy"
description: "execStrategy function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/src/fcl-core.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/src/fcl-core.ts). DO NOT EDIT MANUALLY -->

# execStrategy

Executes a service strategy based on the service method. This function looks up the
appropriate strategy from the service registry and executes it with the provided parameters.
It's used internally by FCL to handle different communication methods with wallet services.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.execStrategy(execStrategyParams)
```

Or import directly the specific function:

```typescript
import { execStrategy } from "@onflow/fcl-core"

execStrategy(execStrategyParams)
```

## Usage

```typescript
// Execute a service strategy (internal usage)
const response = await execStrategy({
  service: { method: "HTTP/POST", endpoint: "https://wallet.example.com/authz" },
  body: { transaction: "..." },
  config: execConfig,
  abortSignal: controller.signal
})
```

## Parameters

### `execStrategyParams` 


- Type: 
```typescript
export interface ExecStrategyParams {
  service: Service
  body: Record<string, any>
  config: ExecConfig
  abortSignal: AbortSignal
  customRpc?: string
  user?: CurrentUser
  opts?: Record<string, any>
}
```


## Returns

```typescript
export interface StrategyResponse {
  status: string
  data?: any
  updates?: Record<string, any>
  local?: boolean
  authorizationUpdates?: Record<string, any>
}
```


Promise resolving to the strategy response

---