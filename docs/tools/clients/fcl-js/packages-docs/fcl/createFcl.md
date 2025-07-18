---
title: "createFcl"
description: "createFcl function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/src/instance.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/src/instance.ts). DO NOT EDIT MANUALLY -->

# createFcl

Creates a configured FCL (Flow Client Library) instance for web applications.
This function initializes FCL with web-specific defaults and discovery configuration,
providing a complete interface for interacting with the Flow blockchain.

The created FCL instance includes all core functionality for:
- User authentication and wallet connections
- Transaction submission and monitoring
- Blockchain queries and event subscriptions
- Configuration management
- Discovery service integration

This function automatically configures the platform as "web" and uses localStorage
for session persistence by default, while allowing customization of other parameters.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.createFcl(params)
```

Or import directly the specific function:

```typescript
import { createFcl } from "@onflow/fcl"

createFcl(params)
```

## Usage

```typescript
// Basic FCL instance creation
import { createFcl } from "@onflow/fcl"

const fcl = createFcl({
  accessNodeUrl: "https://rest-testnet.onflow.org",
  computeLimit: 1000,
  flowNetwork: "testnet"
})

// Use the instance for authentication
const user = await fcl.currentUser.authenticate()
console.log("Authenticated user:", user.addr)
```

## Parameters

### `params` 


- Type: 
```typescript
WithOptionalProperties<any, "platform" | "storage">
```
- Description: Configuration parameters for the FCL instance

#### Properties:

- **`accessNodeUrl`**  - URL of the Flow access node (e.g., "https://rest-testnet.onflow.org")
- **`computeLimit`**  - Default compute limit for transactions and queries
- **`customResolver`**  - Optional custom resolver for address replacement
- **`customDecoders`**  - Optional custom decoders for response parsing
- **`contracts`**  - Optional contract address mappings
- **`discoveryWallet`**  - Optional discovery wallet endpoint
- **`discoveryWalletMethod`**  - Optional discovery wallet method
- **`defaultComputeLimit`**  - Optional default compute limit override
- **`flowNetwork`**  - Optional Flow network identifier
- **`serviceOpenIdScopes`**  - Optional OpenID scopes for services
- **`walletconnectProjectId`**  - Optional WalletConnect project ID
- **`walletconnectDisableNotifications`**  - Optional flag to disable WalletConnect notifications
- **`storage`**  - Optional custom storage provider (defaults to localStorage)
- **`discovery`**  - Optional discovery configuration


## Returns

`any`


A fully configured FCL instance with all core methods and services

---