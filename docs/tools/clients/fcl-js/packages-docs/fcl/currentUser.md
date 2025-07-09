---
sidebar_position: 1
title: "currentUser"
description: "currentUser function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/src/fcl.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/src/fcl.ts). DO NOT EDIT MANUALLY -->

# currentUser

The main current user service for managing user authentication and authorization in Flow applications.
This service provides a complete interface for wallet connections, user sessions, transaction signing, and user data management.
It handles the complexity of connecting to various FCL-compatible wallets, managing authentication state, and providing
authorization functions for transaction signing.

The currentUser service is configured for web platforms and uses the browser's localStorage by default for session persistence.
It integrates with Flow's discovery service to enable wallet selection and supports both authentication and re-authentication flows.

This service is reactive and provides subscription capabilities to monitor authentication state changes in real-time.
All wallet interactions are handled through FCL's standardized protocols, ensuring compatibility with the Flow ecosystem.

Returns an object with the following methods:
```typescript
{
authenticate,        // Authenticates the user via FCL-compatible wallets
unauthenticate,      // Logs out the current user and clears session data
authorization,       // Produces authorization details for transaction signing
signUserMessage,     // Signs arbitrary messages with the user's wallet
subscribe,           // Subscribes to authentication state changes
snapshot,            // Returns the current user object snapshot
resolveArgument      // Resolves the current user as a transaction argument
}
```

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.currentUser()
```

Or import directly the specific function:

```typescript
import { currentUser } from "@onflow/fcl"

currentUser()
```

## Usage

```typescript
// Basic authentication flow
import * as fcl from "@onflow/fcl"

// Configure FCL
fcl.config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "flow.network": "testnet"
})

// Authenticate user
const user = await fcl.currentUser.authenticate()
console.log("User authenticated:", user.addr)

// Check authentication status
const currentUser = await fcl.currentUser.snapshot()
if (currentUser.loggedIn) {
  console.log("User is logged in:", currentUser.addr)
}

// Subscribe to authentication state changes
import * as fcl from "@onflow/fcl"

const unsubscribe = fcl.currentUser.subscribe((user) => {
  if (user.loggedIn) {
    console.log("User logged in:", user.addr)
    document.getElementById("login-btn").style.display = "none"
    document.getElementById("logout-btn").style.display = "block"
  } else {
    console.log("User logged out")
    document.getElementById("login-btn").style.display = "block"
    document.getElementById("logout-btn").style.display = "none"
  }
})
// Clean up subscription when component unmounts
window.addEventListener("beforeunload", () => unsubscribe())
```


## Returns

```typescript
export interface CurrentUserService extends CurrentUserServiceApi {
  (): CurrentUserServiceApi
}
```


A CurrentUserService object

---