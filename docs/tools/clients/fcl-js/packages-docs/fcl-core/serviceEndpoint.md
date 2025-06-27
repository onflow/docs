---
sidebar_position: 1
title: "serviceEndpoint"
description: "serviceEndpoint function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/src/current-user/exec-service/strategies/utils/service-endpoint.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/src/current-user/exec-service/strategies/utils/service-endpoint.ts). DO NOT EDIT MANUALLY -->

# serviceEndpoint

Creates a URL object from a service endpoint with additional parameters including
the application origin and service-specific parameters. This function is used internally by
FCL strategies to construct the complete URL for service communication.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.serviceEndpoint(service)
```

Or import directly the specific function:

```typescript
import { serviceEndpoint } from "@onflow/fcl-core"

serviceEndpoint(service)
```

## Usage

```typescript
// Create URL from service
const service = {
  endpoint: "https://wallet.example.com/authn",
  params: {
    appName: "MyApp",
    nonce: "abc123"
  }
}
const url = serviceEndpoint(service)
console.log(url.toString())
// https://wallet.example.com/authn?l6n=https://myapp.com&appName=MyApp&nonce=abc123
```

## Parameters

### `service` 


- Type: [`Service`](../types#service)
- Description: The service object containing endpoint and optional parameters


## Returns

`URL`


URL object with all parameters appended as query string parameters

---