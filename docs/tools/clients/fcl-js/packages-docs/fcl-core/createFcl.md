---
title: "createFcl"
description: "createFcl function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/src/instance.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/src/instance.ts). DO NOT EDIT MANUALLY -->

# createFcl

Creates a configured FCL (Flow Client Library) core instance.
This function initializes FCL with the core functionality needed to interact
with the Flow blockchain, providing a complete interface for blockchain operations.

The created FCL instance includes all core functionality for:
- User authentication and wallet connections
- Transaction submission and monitoring
- Blockchain queries and event subscriptions
- Configuration management
- Discovery service integration
- SDK method access

This function automatically configures the HTTP transport and creates all necessary
services and utilities. The transport parameter is optional and defaults to HTTP transport.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.createFcl(params)
```

Or import directly the specific function:

```typescript
import { createFcl } from "@onflow/fcl-core"

createFcl(params)
```

## Usage

```typescript
// Basic FCL instance creation
import { createFcl } from "@onflow/fcl-core"

const fcl = createFcl({
  accessNodeUrl: "https://rest-testnet.onflow.org",
  computeLimit: 1000,
  flowNetwork: "testnet"
})

// Use the instance for authentication
const user = await fcl.currentUser.authenticate()
console.log("Authenticated user:", user.addr)

// Submit a transaction
const txId = await fcl.mutate({
  cadence: `
    transaction {
      execute { log("Hello, Flow!") }
    }
  `
})

// Query the blockchain
const result = await fcl.query({
  cadence: `
    pub fun main(): Int {
      return 42
    }
  `
})
```

## Parameters

### `params` 


- Type: 
```typescript
WithOptionalProperties<FCLConfig, "transport">
```
- Description: Configuration parameters for the FCL instance

#### Properties:

- **`accessNodeUrl`**  - URL of the Flow access node (e.g., "https://rest-testnet.onflow.org")
- **`computeLimit`**  - Default compute limit for transactions and queries
- **`customResolver`**  - Optional custom resolver for address replacement
- **`customDecoders`**  - Optional custom decoders for response parsing
- **`contracts`**  - Optional contract address mappings
- **`platform`**  - Platform identifier (e.g., "web", "mobile", "extension")
- **`discoveryWallet`**  - Optional discovery wallet endpoint
- **`discoveryWalletMethod`**  - Optional discovery wallet method
- **`defaultComputeLimit`**  - Optional default compute limit override
- **`flowNetwork`**  - Optional Flow network identifier
- **`serviceOpenIdScopes`**  - Optional OpenID scopes for services
- **`walletconnectProjectId`**  - Optional WalletConnect project ID
- **`walletconnectDisableNotifications`**  - Optional flag to disable WalletConnect notifications
- **`storage`**  - Storage provider for session persistence
- **`discovery`**  - Optional discovery configuration with execStrategy
- **`transport`**  - Optional transport layer (defaults to HTTP transport)


## Returns

`any`


A fully configured FCL instance with all core methods and services including:
- currentUser: User authentication and management service
- config: Configuration management service
- mutate: Transaction submission function
- query: Blockchain query function
- queryRaw: Raw blockchain query function
- verifyUserSignatures: User signature verification
- getChainId: Chain ID retrieval
- tx: Transaction monitoring utilities
- events: Event subscription utilities
- authenticate: User authentication method
- unauthenticate: User logout method
- signUserMessage: Message signing method
- All SDK methods (send, decode, subscribe, etc.)

---