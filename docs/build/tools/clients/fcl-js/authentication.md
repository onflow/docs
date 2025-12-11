# Authentication

Authentication in Flow Client Library (FCL) is closely tied to the concept of `currentUser`. In fact, `fcl.authenticate` and `fcl.unauthenticate` are simply aliases for `fcl.currentUser.authenticate()` and `fcl.currentUser.unauthenticate()`, respectively. So, let’s take a closer look at `currentUser`.

As an onchain app developer who uses FCL, the primary authentication functionalities revolve around how to:

- Determine the `currentUser` and whether they are logged in.
- Log a user in.
- Log a user out.

Due to the way FCL works, to log in and sign up are essentially the same process.

# Retrieve information about the current user

FCL provides two ways to get information about the current user:

1. **A promise-based method** that returns a snapshot of the user’s data.
2. **A subscription-based method** that triggers a callback function with the latest user information whenever it changes.

### Snapshot of the current user

```javascript
import * as fcl from '@onflow/fcl';

const currentUser = await fcl.currentUser.snapshot();
console.log('The Current User:', currentUser);
```

### Subscribe to the Current User

```javascript
import * as fcl from '@onflow/fcl';

// Returns an unsubscribe function
const unsubscribe = fcl.currentUser.subscribe((currentUser) => {
  console.log('The Current User:', currentUser);
});
```

# Authenticate and unauthenticate

The TL;DR: Call `fcl.authenticate()` to log in and `fcl.unauthenticate()` to log out.

On Flow mainnet, no additional configuration is needed, because your app’s users will go through the authentication process and can use any FCL-compatible wallet provider.

During development, you’ll likely want to configure your app to use [`@onflow/dev-wallet`]. The [Quick Start] guide will walk you through how to set it up.

We also recommend that you use the [FCL Discovery Service] to help users discover and connect to FCL-compatible wallets.

Whether you're new to building onchain, or an established veteran, we’re here to help. If you run into any issues, reach out to us on [Discord] — we’re happy to assist!

<!-- Reference-style links, will not render on page. -->

[`@onflow/dev-wallet`]: https://github.com/onflow/fcl-dev-wallet
[Quick Start]: ../../../../blockchain-development-tutorials/cadence/getting-started/index.md
[FCL Discovery Service]: discovery.md
[Discord]: https://discord.gg/flow