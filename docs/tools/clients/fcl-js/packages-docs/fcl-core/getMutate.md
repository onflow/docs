---
title: "getMutate"
description: "getMutate function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/src/exec/mutate.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/src/exec/mutate.ts). DO NOT EDIT MANUALLY -->

# getMutate

Legacy factory function that creates a mutate function using global FCL context.
This function provides backward compatibility for code that was written before the
introduction of dependency injection patterns in FCL. It creates a mutate function
by combining a partial global context with a provided current user service.

This function is considered legacy and should be used primarily for backward compatibility.
New code should prefer using the `createMutate` function with a complete FCL context
for better testability and dependency management.

The function creates a partial context using global configuration and SDK methods,
then combines it with the provided current user service to create a fully functional
mutate function.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.getMutate(currentUserOrConfig)
```

Or import directly the specific function:

```typescript
import { getMutate } from "@onflow/fcl-core"

getMutate(currentUserOrConfig)
```

## Usage

```typescript
// Legacy usage with global context
import { getMutate } from "@onflow/fcl-core"
import { getCurrentUser } from "@onflow/fcl-core"

// Get the current user service
const currentUser = getCurrentUser({ platform: "web" })

// Create mutate function using legacy pattern
const mutate = getMutate(currentUser)

// Use the mutate function
const txId = await mutate({
  cadence: `
    transaction {
      execute { log("Hello, Flow!") }
    }
  `
})
```

## Parameters

### `currentUserOrConfig` 


- Type: 
```typescript
export interface CurrentUserService extends CurrentUserServiceApi {
  (): CurrentUserServiceApi
}
```
- Description: The current user service instance that provides authentication
and authorization capabilities. This service must implement the CurrentUserService interface
and provide methods for user authentication, authorization, and session management.


## Returns

`Promise<string>`


A mutate function that can submit transactions to the Flow blockchain.
The returned function accepts the same options as the standard mutate function:
- cadence: The Cadence transaction code to execute
- args: Function that returns transaction arguments
- template: Interaction template for standardized transactions
- limit: Compute limit for the transaction
- authz: Authorization function for all roles
- proposer: Specific authorization for proposer role
- payer: Specific authorization for payer role
- authorizations: Array of authorization functions for authorizer roles

---