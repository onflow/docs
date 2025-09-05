---
title: "createFlowClient"
description: "createFlowClient function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/src/client.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/src/client.ts). DO NOT EDIT MANUALLY -->

# createFlowClient


## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.createFlowClient(params)
```

Or import directly the specific function:

```typescript
import { createFlowClient } from "@onflow/fcl"

createFlowClient(params)
```


## Parameters

### `params` 


- Type: 
```typescript
export interface FlowClientConfig {
  accessNodeUrl: string 
  flowNetwork?: string
  flowJson?: any
  discoveryWallet?: string
  discoveryWalletMethod?: string
  discoveryAuthnEndpoint?: string
  discoveryAuthnInclude?: string[]
  walletconnectProjectId?: string
  walletconnectDisableNotifications?: boolean
  storage?: StorageProvider
  appDetailTitle?: string
  appDetailIcon?: string
  appDetailDescription?: string
  appDetailUrl?: string
  serviceOpenIdScopes?: string[]
  transport?: SdkTransport
  computeLimit?: number
  customResolver?: any
  customDecoders?: any
}
```


## Returns

`Promise<string>`


---