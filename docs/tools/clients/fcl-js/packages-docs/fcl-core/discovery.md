---
title: "discovery"
description: "Namespace containing discovery utilities"
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core). DO NOT EDIT MANUALLY -->

# discovery

## Overview

Namespace containing discovery utilities

## Functions

### getDiscoveryService

Creates and configures a discovery service object used for wallet authentication.
This function combines the provided service configuration with discovery-related settings from
the FCL configuration to create a complete service definition for wallet authentication flows.

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.discovery.getDiscoveryService(service)
```

Or import the namespace directly:

```typescript
import { discovery } from "@onflow/fcl-core"

discovery.getDiscoveryService(service)
```

#### Usage

```typescript
// Get discovery service with default configuration
const discoveryService = await getDiscoveryService()
console.log(discoveryService.endpoint) // Configured discovery endpoint

// Override discovery service endpoint
const customService = await getDiscoveryService({
  endpoint: "https://wallet.example.com/authn",
  method: "HTTP/POST"
})

// Use with custom wallet service
const walletService = await getDiscoveryService({
  endpoint: "https://my-wallet.com/fcl",
  provider: {
    name: "My Wallet",
    icon: "https://my-wallet.com/icon.png"
  }
})
```

#### Parameters

##### `service` (optional)


- Type: `Partial<Service>`
- Description: Optional partial service configuration to override defaults

#### Returns

```typescript
export interface DiscoveryService extends Service {
  discoveryAuthnInclude: string[]
  discoveryAuthnExclude: string[]
  discoveryFeaturesSuggested: string[]
}
```

### makeDiscoveryServices

Creates an array of discovery services by combining extension services from the
window object with registered services from the service registry. This is used internally
by FCL to gather all available wallet and authentication services.

#### Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.discovery.makeDiscoveryServices()
```

Or import the namespace directly:

```typescript
import { discovery } from "@onflow/fcl-core"

discovery.makeDiscoveryServices()
```

#### Usage

```typescript
// Get all available discovery services
const services = await makeDiscoveryServices()
console.log(services.length) // Number of available services
services.forEach(service => {
  console.log(`Service: ${service.provider?.name}, Type: ${service.type}`)
})
```

#### Returns

```typescript
Promise<Service[]>
```


---