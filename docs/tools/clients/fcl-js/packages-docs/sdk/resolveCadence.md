---
title: "resolveCadence"
description: "resolveCadence function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk/src/resolve/resolve-cadence.ts](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/resolve/resolve-cadence.ts). DO NOT EDIT MANUALLY -->

# resolveCadence


## Import

You can import the entire package and access the function:

```typescript
import * as sdk from "@onflow/sdk"

sdk.resolveCadence(context)
```

Or import directly the specific function:

```typescript
import { resolveCadence } from "@onflow/sdk"

resolveCadence(context)
```


## Parameters

### `context` 


- Type: 
```typescript
export interface SdkContext {
  get accessNodeUrl(): string
  get transport(): SdkTransport
  get computeLimit(): number
  get customResolver(): ((args: any) => Promise<any>) | undefined
  get customDecoders(): {[key: string]: (data: any) => any}
  get contracts(): {
    [contractName: string]: string
  }
  get debug(): {[key: string]: any} 
  get legacyContractIdentifiers(): Record<string, string>
}
```


## Returns

[`Promise<Interaction>`](../types#interaction)


---