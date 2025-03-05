# Authentication

Authentication in FCL is closely tied to the concept of `currentUser`. In fact, `fcl.authenticate` and `fcl.unauthenticate` are simply aliases for `fcl.currentUser.authenticate()` and `fcl.currentUser.unauthenticate()`, respectively. So, let’s take a closer look at `currentUser`.

As an onchain app developer using FCL, the primary authentication functionalities revolve around:

- Determining the `currentUser` and whether they are logged in.
- Logging a user in.
- Logging a user out.

Due to the way FCL works, logging in and signing up are essentially the same process.

# Retrieving Information About the Current User

FCL provides two ways to get information about the current user:

1. **A promise-based method** that returns a snapshot of the user’s data.
2. **A subscription-based method** that triggers a callback function with the latest user information whenever it changes.

### Snapshot of the Current User

```javascript
import * as fcl from "@onflow/fcl"

const currentUser = await fcl.currentUser.snapshot()
console.log("The Current User:", currentUser)
```

### Subscribe to the Current User

```javascript
import * as fcl from "@onflow/fcl"

// Returns an unsubscribe function
const unsubscribe = fcl.currentUser.subscribe(currentUser => {
  console.log("The Current User:", currentUser)
})
```

# Authenticating and Unauthenticating

The TL;DR: Call `fcl.authenticate()` to log in and `fcl.unauthenticate()` to log out.

On Flow mainnet, no additional configuration is needed—your dApp’s users will go through the authentication process and be able to use any FCL-compatible wallet provider.

During development, you’ll likely want to configure your dApp to use [`@onflow/dev-wallet`](https://github.com/onflow/fcl-dev-wallet). The [Quick Start](../../../build/getting-started/fcl-quickstart.md) guide will walk you through setting it up.

We also recommend using the [FCL Discovery Service](discovery.md) to help users discover and connect to FCL-compatible wallets.

We understand this can be overwhelming, but we’re here to help. If you run into any issues, reach out to us on [Discord](https://discord.gg/flow)—we’re happy to assist!