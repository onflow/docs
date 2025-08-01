---
sidebar_position: 3
---

# Flow Client Library (FCL)

## 🌟 What is FCL?

The **Flow Client Library (FCL) JS** is a package designed to facilitate interactions between dapps, wallets, and the Flow blockchain. It provides a standardized way for applications to connect with users and their wallets, **eliminating the need for custom integrations**.

### 🔑 Key Features:
- 🔌 **Universal Wallet Support** – Works seamlessly with all FCL-compatible wallets, making authentication simple.
- 🔐 **Secure Authentication** – Standardized authentication flow ensures a smooth user experience.
- ⚡ **Blockchain Interactions** – Enables querying, mutating, and interacting with smart contracts on Flow.
- 🛠️ **Full-Featured Utilities** – Offers built-in functions to streamline blockchain development.
- 🌍 **Flexible Environment** – Can run in both browser and server environments, though wallet interactions are browser-only.

FCL was created to make building Flow-connected applications **easy, secure, and scalable** by defining **standardized communication patterns** between wallets, applications, and users.

For iOS, we also offer [FCL Swift](https://github.com/Outblock/fcl-swift).

---
## Getting Started

### Requirements
-  Node version `v12.0.0 or higher`.

### Installation

To use the FCL JS in your application, install using **yarn** or **npm**

```shell
npm i -S @onflow/fcl
```

```shell
yarn add @onflow/fcl
```
#### Importing

**ES6**
```js
import * as fcl from "@onflow/fcl";
```
**Node.js**
```js
const fcl = require("@onflow/fcl");
```
---
## FCL for Dapps
#### Wallet Interactions

- *Wallet Discovery* and *Sign-up/Login*: Onboard users with ease. Never worry about supporting multiple wallets.
  Authenticate users with any [FCL compatible wallet](#current-wallet-providers).
```js
// in the browser
import * as fcl from "@onflow/fcl"

fcl.config({
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Endpoint set to Testnet
})

fcl.authenticate()
```
![FCL Default Discovery UI](images/discovery.png)

> **Note**: A [Dapper Wallet](https://meetdapper.com/developers) developer account is required. To enable Dapper Wallet inside FCL, you need to [follow this guide](https://docs.meetdapper.com/get-started).

- *Interact with smart contracts*: Authorize transactions via the user's chosen wallet
- *Prove ownership of a wallet address*: Signing and verifying user signed data

#### Blockchain Interactions
- *Query the chain*: Send arbitrary Cadence scripts to the chain and receive back decoded values
```js
import * as fcl from "@onflow/fcl";

const result = await fcl.query({
  cadence: `
    access(all)
    fun main(a: Int, b: Int, addr: Address): Int {
      log(addr)
      return a + b
    }
  `,
  args: (arg, t) => [
    arg(7, t.Int), // a: Int
    arg(6, t.Int), // b: Int
    arg("0xba1132bc08f82fe2", t.Address), // addr: Address
  ],
});
console.log(result); // 13
```
- *Mutate the chain*: Send arbitrary transactions with your own signatures or via a user's wallet to perform state changes on chain.
```js
import * as fcl from "@onflow/fcl";
// in the browser, FCL will automatically connect to the user's wallet to request signatures to run the transaction
const txId = await fcl.mutate({
  cadence: `
    import Profile from 0xba1132bc08f82fe2

    transaction(name: String) {
      prepare(account: AuthAccount) {
        account.borrow<&{Profile.Owner}>(from: Profile.privatePath)!.setName(name)
      }
    }
  `,
  args: (arg, t) => [arg("myName", t.String)],
});
```

#### Utilities
- Get account details from any Flow address
- Get the latest block
- Transaction status polling
- Event polling
- Custom authorization functions

## Typescript Support

FCL JS supports TypeScript. If you need to import specific types, you can do so via the [@onflow/typedefs](https://github.com/onflow/fcl-js/tree/master/packages/typedefs) package.

```typescript
import {CurrentUser} from "@onflow/typedefs"

const newUser: CurrentUser = {
  addr: null,
  cid: null,
  expiresAt: null,
  f_type: 'User',
  f_vsn: '1.0.0',
  loggedIn: null,
  services: []
}
```

For all type definitions available, see [this file](https://github.com/onflow/fcl-js/blob/master/packages/typedefs/src/index.ts)

## Next Steps

- See the [Flow App Quick Start](../../../build/getting-started/fcl-quickstart.md).
- See the full [API Reference](./packages-docs/fcl/index.md) for all FCL functionality.
- Learn Flow's smart contract language to build any script or transactions: [Cadence](https://cadence-lang.org).
- Explore all of Flow [docs and tools](https://developers.flow.com).

---
## FCL for Wallet Providers
Wallet providers on Flow have the flexibility to build their user interactions and UI through a variety of ways:
- Front channel communication via Iframe, pop-up, tab, or extension
- Back channel communication via HTTP

FCL is agnostic to the communication channel and be configured to create both custodial and non-custodial wallets. This enables users to interact with wallet providers without needing to download an app or extension.

The communication channels involve responding to a set of pre-defined FCL messages to deliver the requested information to the dapp.  Implementing a FCL compatible wallet on Flow is as simple as filling in the responses with the appropriate data when FCL requests them. If using any of the front-channel communication methods, FCL also provides a set of [wallet utilities](https://github.com/onflow/fcl-js/blob/master/packages/fcl-core/src/wallet-utils/index.js) to simplify this process.

### Current Wallet Providers
- [Flow Wallet](https://wallet.flow.com/)
- [NuFi Wallet](https://nu.fi/)
- [Blocto](https://blocto.portto.io/en/)
- [Ledger](https://ledger.com) (limited transaction support)
- [Dapper Wallet](https://www.meetdapper.com/) (beta access - general availability coming soon)

### Wallet Discovery
It can be difficult to get users to discover new wallets on a chain. To solve this, we created a [wallet discovery service](https://github.com/onflow/fcl-discovery) that can be configured and accessed through FCL to display all available Flow wallet providers to the user. This means:
- Dapps can display and support all FCL compatible wallets that launch on Flow without needing to change any code
- Users don't need to sign up for new wallets - they can carry over their existing one to any dapp that uses FCL for authentication and authorization.

The discovery feature can be used via API allowing you to customize your own UI or you can use the default UI without any additional configuration.

> Note: To get your wallet added to the discovery service, make a PR in [fcl-discovery](https://github.com/onflow/fcl-discovery).

### Building a FCL compatible wallet

- Read the [wallet guide](https://github.com/onflow/fcl-js/blob/master/packages/fcl-core/src/wallet-provider-spec/draft-v4.md) to understand the implementation details.
- Review the architecture of the [FCL dev wallet](https://github.com/onflow/fcl-dev-wallet) for an overview.
- If building a non-custodial wallet, see the [Account API](https://github.com/onflow/flow-account-api) and the [FLIP](https://github.com/onflow/flow/pull/727) on derivation paths and key generation.

---

## 🛠 Want to Use the Flow SDK Directly?

If you prefer to interact with Flow at a **lower level** without using FCL, you can use the [Flow JavaScript SDK](./packages-docs/sdk/index.md) directly. The SDK provides raw access to Flow's API for sending transactions, executing scripts, and managing accounts.

FCL is built **on top of the Flow SDK**, making it easier to handle authentication, wallet interactions, and dapp connectivity. Choose the approach that best fits your use case.

## Support

- Notice a problem or want to request a feature? [Add an issue](https://github.com/onflow/fcl-js/issues).
- Join the Flow community on [Discord](https://discord.gg/flow) to keep up to date and to talk to the team.
- Read the [Contributing Guide](https://github.com/onflow/fcl-js/blob/master/CONTRIBUTING.md) to learn how to contribute to the project.
