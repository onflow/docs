---
title: "getCurrentUser"
description: "getCurrentUser function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core/src/fcl-core.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core/src/fcl-core.ts). DO NOT EDIT MANUALLY -->

# getCurrentUser

Creates and configures the Current User service for managing user authentication and
authorization in Flow applications. This is the core service for handling user sessions, wallet
connections, transaction signing, and user data management. The service provides both callable
function interface and object methods for maximum flexibility.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl-core"

fcl.getCurrentUser(cfg)
```

Or import directly the specific function:

```typescript
import { getCurrentUser } from "@onflow/fcl-core"

getCurrentUser(cfg)
```

## Usage

```typescript
// Basic setup and authentication
import * as fcl from "@onflow/fcl"

// Configure FCL
fcl.config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn"
})

// Create current user service
const currentUser = fcl.getCurrentUser({
  platform: "web"
})

// Authenticate user
const user = await currentUser.authenticate()
console.log("Authenticated user:", user.addr)

// Subscribe to authentication state changes
const currentUser = fcl.getCurrentUser({ platform: "web" })

const unsubscribe = currentUser.subscribe((user) => {
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

// Clean up subscription
window.addEventListener("beforeunload", () => unsubscribe())

// Sign transactions with user authorization
const currentUser = fcl.getCurrentUser({ platform: "web" })

const txId = await fcl.mutate({
  cadence: `
    transaction(amount: UFix64, to: Address) {
      prepare(signer: AuthAccount) {
        // Transfer tokens logic here
      }
    }
  `,
  args: (arg, t) => [
    arg("10.0", t.UFix64),
    arg("0x01", t.Address)
  ],
  authz: currentUser.authorization
})

// Sign custom messages
const currentUser = fcl.getCurrentUser({ platform: "web" })

const message = Buffer.from("Hello, Flow!").toString("hex")
const signatures = await currentUser.signUserMessage(message)

console.log("Message signatures:", signatures)
```

## Parameters

### `cfg` 


- Type: 
```typescript
export interface CurrentUserConfig {
  platform: string
  discovery?: {
    execStrategy?: (...args: any[]) => any
    authnInclude?: string[]
    authnExclude?: string[]
    featuresSuggested?: string[]
  }
  getStorageProvider: () => Promise<StorageProvider>
}
```


## Returns

```typescript
export interface CurrentUserService extends CurrentUserServiceApi {
  (): CurrentUserServiceApi
}
```


Current user service object with authentication and authorization methods

---