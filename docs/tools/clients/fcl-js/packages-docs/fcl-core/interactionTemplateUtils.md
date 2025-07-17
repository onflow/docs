---
title: "InteractionTemplateUtils"
description: "Namespace containing InteractionTemplateUtils utilities"
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core). DO NOT EDIT MANUALLY -->

# InteractionTemplateUtils

## Overview

Namespace containing InteractionTemplateUtils utilities

## Functions

### deriveCadenceByNetwork

Fills import addresses in Cadence for network

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.InteractionTemplateUtils.deriveCadenceByNetwork(deriveCadenceByNetworkParams)
```

Or import the namespace directly:

```typescript
import { InteractionTemplateUtils } from "@onflow/fcl-core"

InteractionTemplateUtils.deriveCadenceByNetwork(deriveCadenceByNetworkParams)
```


#### Parameters

##### `deriveCadenceByNetworkParams`


- Type: 
```typescript
export interface DeriveCadenceByNetworkParams {
  network: string
  template: InteractionTemplate
}
```

#### Returns

`Promise<string>`

### generateDependencyPin

Generates a dependency pin for a smart contract on the Flow blockchain. A dependency
pin is a cryptographic hash that uniquely identifies a specific version of a contract at a particular
state. This is used in Interaction Templates to ensure consistent behavior by pinning to specific
contract versions and preventing issues from contract updates.

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.InteractionTemplateUtils.generateDependencyPin(generateDependencyPinParams, opts)
```

Or import the namespace directly:

```typescript
import { InteractionTemplateUtils } from "@onflow/fcl-core"

InteractionTemplateUtils.generateDependencyPin(generateDependencyPinParams, opts)
```

#### Usage

```typescript
// Generate dependency pin for a contract at current state
import * as fcl from "@onflow/fcl"

const dependencyPin = await fcl.InteractionTemplateUtils.generateDependencyPin({
  version: "1.1.0",
  address: "0x1654653399040a61",
  contractName: "FlowToken"
})
```

#### Parameters

##### `generateDependencyPinParams`


- Type: 
```typescript
export interface GenerateDependencyPinParams {
  address: string
  contractName: string
  blockHeight: number
}
```

##### `opts` (optional)


- Type: `any`
- Description: Additional options to pass to the underlying interaction

#### Returns

`Promise<string>`

### generateDependencyPinAtLatestSealedBlock

Generates a dependency pin for a smart contract at the latest sealed block on the Flow
blockchain. This variant ensures the pin is generated against the most recent finalized state of the
network, providing consistency and avoiding issues with pending transactions affecting the pin generation.

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.InteractionTemplateUtils.generateDependencyPinAtLatestSealedBlock(generateDependencyPinParams, opts)
```

Or import the namespace directly:

```typescript
import { InteractionTemplateUtils } from "@onflow/fcl-core"

InteractionTemplateUtils.generateDependencyPinAtLatestSealedBlock(generateDependencyPinParams, opts)
```

#### Usage

```typescript
// Generate dependency pin at latest sealed block
import * as fcl from "@onflow/fcl"

const dependencyPin = await fcl.InteractionTemplateUtils.generateDependencyPinAtLatestSealedBlock({
  version: "1.1.0",
  address: "0x1654653399040a61",
  contractName: "FlowToken"
})
```

#### Parameters

##### `generateDependencyPinParams`


- Type: 
```typescript
export interface GenerateDependencyPinParams {
  address: string
  contractName: string
  blockHeight: number
}
```

##### `opts` (optional)


- Type: `any`
- Description: Additional options to pass to the underlying interaction

#### Returns

`Promise<string>`

### generateTemplateId

Generates Interaction Template ID for a given Interaction Template

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.InteractionTemplateUtils.generateTemplateId(interactionTemplate)
```

Or import the namespace directly:

```typescript
import { InteractionTemplateUtils } from "@onflow/fcl-core"

InteractionTemplateUtils.generateTemplateId(interactionTemplate)
```


#### Parameters

##### `interactionTemplate`


- Type: 
```typescript
{ template: InteractionTemplate; }
```

#### Returns

`Promise<string>`

### getInteractionTemplateAudits

Checks whether a set of auditors have audited a given Interaction Template on the Flow
blockchain. This function validates that the provided interaction template has been properly audited
for security by trusted auditors before execution. It queries the Flow blockchain's audit contract
to verify audit status.

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.InteractionTemplateUtils.getInteractionTemplateAudits(context, getInteractionTemplateAuditsParams, opts)
```

Or import the namespace directly:

```typescript
import { InteractionTemplateUtils } from "@onflow/fcl-core"

InteractionTemplateUtils.getInteractionTemplateAudits(context, getInteractionTemplateAuditsParams, opts)
```

#### Usage

```typescript
// Check if template has been audited by specific auditors
import * as fcl from "@onflow/fcl"

const template = {
  f_type: "InteractionTemplate",
  f_version: "1.1.0",
  id: "template-id-123",
  data: {
    type: "transaction",
    interface: "...",
    cadence: "transaction { ... }"
  }
}

const auditorAddresses = [
  "0x1234567890abcdef",
  "0xabcdef1234567890"
]

const auditResults = await fcl.InteractionTemplateUtils.getInteractionTemplateAudits({
  template,
  auditors: auditorAddresses
})

console.log(auditResults)
// { "0x1234567890abcdef": true, "0xabcdef1234567890": false }
```

#### Parameters

##### `context`


- Type: 
```typescript
export interface FCLContext {
  currentUser: CurrentUserServiceApi
  sdk: ReturnType<typeof createSdkClient>
  storage: StorageProvider
  config: ConfigService
  platform: string
}
```

##### `getInteractionTemplateAuditsParams`


- Type: 
```typescript
export interface GetInteractionTemplateAuditsParams {
  template: InteractionTemplate
  auditors?: string[]
}
```

##### `opts` (optional)


- Type: 
```typescript
export interface GetInteractionTemplateAuditsOpts {
  flowInteractionAuditContract?: string
}
```
- Description: Optional configuration parameters

#### Returns

`Promise<Record<string, boolean>>`

### getTemplateArgumentMessage

Gets Interaction Template argument message by message key, argument label, and localization

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.InteractionTemplateUtils.getTemplateArgumentMessage(getTemplateArgumentMessageParams)
```

Or import the namespace directly:

```typescript
import { InteractionTemplateUtils } from "@onflow/fcl-core"

InteractionTemplateUtils.getTemplateArgumentMessage(getTemplateArgumentMessageParams)
```


#### Parameters

##### `getTemplateArgumentMessageParams`


- Type: 
```typescript
export interface GetTemplateArgumentMessageParams {
  localization?: string
  argumentLabel: string
  messageKey: string
  template: InteractionTemplate
}
```

#### Returns

`string`

### getTemplateMessage

Get Interaction Template argument message

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.InteractionTemplateUtils.getTemplateMessage(getTemplateMessageParams)
```

Or import the namespace directly:

```typescript
import { InteractionTemplateUtils } from "@onflow/fcl-core"

InteractionTemplateUtils.getTemplateMessage(getTemplateMessageParams)
```


#### Parameters

##### `getTemplateMessageParams`


- Type: 
```typescript
export interface GetTemplateMessageParams {
  localization?: string
  messageKey: string
  template: InteractionTemplate
}
```

#### Returns

`string`

### verifyDependencyPinsSame

Checks if an Interaction Template's pins match those generated at a block height

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.InteractionTemplateUtils.verifyDependencyPinsSame(verifyDependencyPinsSameParams, opts)
```

Or import the namespace directly:

```typescript
import { InteractionTemplateUtils } from "@onflow/fcl-core"

InteractionTemplateUtils.verifyDependencyPinsSame(verifyDependencyPinsSameParams, opts)
```


#### Parameters

##### `verifyDependencyPinsSameParams`


- Type: 
```typescript
export interface VerifyDependencyPinsSameParams {
  template: InteractionTemplate
  blockHeight?: number
}
```

##### `opts` (optional)


- Type: 
```typescript
export interface VerifyDependencyPinsSameOpts {
  [key: string]: any
}
```

#### Returns

`Promise<boolean>`

### verifyDependencyPinsSameAtLatestSealedBlock

Checks if an Interaction Template's pins match those generated at the latest block height

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.InteractionTemplateUtils.verifyDependencyPinsSameAtLatestSealedBlock(verifyDependencyPinsSameAtLatestSealedBlockParams, opts)
```

Or import the namespace directly:

```typescript
import { InteractionTemplateUtils } from "@onflow/fcl-core"

InteractionTemplateUtils.verifyDependencyPinsSameAtLatestSealedBlock(verifyDependencyPinsSameAtLatestSealedBlockParams, opts)
```


#### Parameters

##### `verifyDependencyPinsSameAtLatestSealedBlockParams`


- Type: 
```typescript
export interface VerifyDependencyPinsSameAtLatestSealedBlockParams {
  template: InteractionTemplate
  network: string
}
```

##### `opts` (optional)


- Type: 
```typescript
export interface VerifyDependencyPinsSameOpts {
  [key: string]: any
}
```

#### Returns

`Promise<boolean>`

### verifyGeneratedTemplateId

Verifies the given Interaction Template Id has been correctly generated

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.InteractionTemplateUtils.verifyGeneratedTemplateId(interactionTemplate)
```

Or import the namespace directly:

```typescript
import { InteractionTemplateUtils } from "@onflow/fcl-core"

InteractionTemplateUtils.verifyGeneratedTemplateId(interactionTemplate)
```


#### Parameters

##### `interactionTemplate`


- Type: 
```typescript
{ template: InteractionTemplate; }
```

#### Returns

`Promise<boolean>`


---