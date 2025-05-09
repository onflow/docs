---
title: Flow Dev Wallet
sidebar_label: Flow Dev Wallet
sidebar_position: 5
---

The Flow Dev Wallet is a mock Flow wallet that simulates the protocols used by [FCL](../clients/fcl-js/index.md) to interact with the Flow blockchain on behalf of simulated user accounts.

:::warning[IMPORTANT]

This project implements an FCL compatible
interface, but should **not** be used as a reference for
building a production grade wallet.

This project should only be used in aid of local
development against a locally run instance of the Flow
blockchain like the Flow emulator, and should never be used in
conjunction with Flow Mainnet, Testnet, or any
other instances of Flow.

:::

:::info

To see a full list of Flow compatible wallets visit [Wallets page](../../ecosystem/wallets.md)

:::

## Getting Started

Before using the dev wallet, you'll need to start the Flow emulator.

### Install the `flow-cli`

The Flow emulator is bundled with the Flow CLI. Instructions for installing the CLI can be found here: [flow-cli/install/](../flow-cli/install.md)

### Create a `flow.json` file

Run this command to create `flow.json` file (typically in your project's root directory):

```sh
flow init --config-only
```

### Start the Emulator

Start the Emulator and deploy the contracts by running the following command from the directory containing `flow.json` in your project:

```sh
flow emulator start
flow project deploy --network emulator
```
## Start the Dev Wallet 

In a separate terminal session, start the dev wallet service, this service is referenced in the fcl configuration as `discovery.wallet`
```sh
flow dev-wallet
```

## Configuring Your JavaScript Application

The Flow Dev Wallet is designed to be used with [`@onflow/fcl`](https://github.com/onflow/fcl-js) version `1.0.0` or higher. The FCL package can be installed with: `npm install @onflow/fcl` or `yarn add @onflow/fcl`.

To use the dev wallet, configure FCL to point to the address of a locally running [Flow emulator](#start-the-emulator) and the dev wallet endpoint.

```javascript
import * as fcl from '@onflow/fcl';

fcl
  .config()
  // Point App at Emulator REST API
  .put('accessNode.api', 'http://localhost:8888')
  // Point FCL at dev-wallet (default port)
  .put('discovery.wallet', 'http://localhost:8701/fcl/authn');
```

:::info

For a full example refer to [Authenticate using FCL snippet](https://academy.ecdao.org/en/snippets/fcl-authenticate)

:::

### Test harness

It's easy to use this FCL harness app as a barebones
app to interact with the dev-wallet during development:

Navigate to http://localhost:8701/harness

### Wallet Discovery

[Wallet Discovery](../clients/fcl-js/discovery.md) offers a convenient modal and mechanism to authenticate users and connects to all wallets available in the Flow ecosystem.

The following code from [Emerald Academy](https://academy.ecdao.org/en/snippets/fcl-authenticate) can be added to your React app to enable Wallet Discovery:

```javascript
import { config, authenticate, unauthenticate, currentUser } from '@onflow/fcl';
import { useEffect, useState } from 'react';

const fclConfigInfo = {
  emulator: {
    accessNode: 'http://127.0.0.1:8888',
    discoveryWallet: 'http://localhost:8701/fcl/authn',
    discoveryAuthInclude: [],
  },
  testnet: {
    accessNode: 'https://rest-testnet.onflow.org',
    discoveryWallet: 'https://fcl-discovery.onflow.org/testnet/authn',
    discoveryAuthnEndpoint:
      'https://fcl-discovery.onflow.org/api/testnet/authn',
    // Adds in Dapper + Ledger
    discoveryAuthInclude: ['0x82ec283f88a62e65', '0x9d2e44203cb13051'],
  },
  mainnet: {
    accessNode: 'https://rest-mainnet.onflow.org',
    discoveryWallet: 'https://fcl-discovery.onflow.org/authn',
    discoveryAuthnEndpoint: 'https://fcl-discovery.onflow.org/api/authn',
    // Adds in Dapper + Ledger
    discoveryAuthInclude: ['0xead892083b3e2c6c', '0xe5cd26afebe62781'],
  },
};

const network = 'emulator';

config({
  'walletconnect.projectId': 'YOUR_PROJECT_ID', // your WalletConnect project ID
  'app.detail.title': 'Emerald Academy', // the name of your DApp
  'app.detail.icon': 'https://academy.ecdao.org/favicon.png', // your DApps icon
  'app.detail.description': 'Emerald Academy is a DApp for learning Flow', // a description of your DApp
  'app.detail.url': 'https://academy.ecdao.org', // the URL of your DApp
  'flow.network': network,
  'accessNode.api': fclConfigInfo[network].accessNode,
  'discovery.wallet': fclConfigInfo[network].discoveryWallet,
  'discovery.authn.endpoint': fclConfigInfo[network].discoveryAuthnEndpoint,
  // adds in opt-in wallets like Dapper and Ledger
  'discovery.authn.include': fclConfigInfo[network].discoveryAuthInclude,
  'discovery.authn.exclude': ['0x1234567890abcdef'], // excludes chosen wallets by address
});

export default function App() {
  const [user, setUser] = useState({ loggedIn: false, addr: '' });

  // So that the user stays logged in
  // even if the page refreshes
  useEffect(() => {
    currentUser.subscribe(setUser);
  }, []);

  return (
    <div className="App">
      <button onClick={authenticate}>Log In</button>
      <button onClick={unauthenticate}>Log Out</button>
      <p>{user.loggedIn ? `Welcome, ${user.addr}!` : 'Please log in.'}</p>
    </div>
  );
}
```

### Account/Address creation

You can [create a new account](https://cadence-lang.org/docs/language/accounts#account-creation) by using the `&Account` constructor. When you do this, make sure to specify which account will pay for the creation fees by setting it as the payer.

The account you choose to pay these fees must have enough money to cover the cost. If it doesn't, the process will stop and the account won't be created.

```cadence
transaction(publicKey: String) {
 prepare(signer: &Account) {
  let key = PublicKey(
    publicKey: publicKey.decodeHex(),
    signatureAlgorithm: SignatureAlgorithm.ECDSA_P256
  )
  let account = Account(payer: signer)
  account.keys.add(
    publicKey: key,
    hashAlgorithm: HashAlgorithm.SHA3_256,
    weight: 1000.0
  )
 }
}
```

To create a new Flow account refer to these resources

- [Create an Account with FCL snippet](https://academy.ecdao.org/en/snippets/fcl-create-account)
- [Create an Account in Cadence snippet](https://academy.ecdao.org/en/snippets/cadence-create-account)

### Get Flow Balance

Retrieving the token balance of a specific account involves writing a script to pull data from onchain. The user may have both locked tokens as well as unlocked so to retrieve the total balance we would aggregate them together.

```javascript
import * as fcl from '@onflow/fcl';
import * as t from '@onflow/types';
const CODE = `
import "FungibleToken"
import "FlowToken"
import "LockedTokens"

access(all) fun main(address: Address): UFix64 {
  let account = getAccount(address)
  let unlockedVault = account
   .capabilities.get<&FlowToken.Vault>(/public/flowTokenBalance)
   .borrow()
    ?? panic("Could not borrow Balance reference to the Vault"
       .concat(" at path /public/flowTokenBalance!")
       .concat(" Make sure that the account address is correct ")
       .concat("and that it has properly set up its account with a FlowToken Vault."))

  let unlockedBalance = unlockedVault.balance
  let lockedAccountInfoCap = account
   .capabilities.get
   <&LockedTokens.TokenHolder>
   (LockedTokens.LockedAccountInfoPublicPath)
  if !(lockedAccountInfoCap!.check()) {
    return unlockedBalance
  }
  let lockedAccountInfoRef = lockedAccountInfoCap!.borrow()!
  let lockedBalance = lockedAccountInfoRef.getLockedAccountBalance()
  return lockedBalance + unlockedBalance
}`;
export const getTotalFlowBalance = async (address) => {
  return await fcl.decode(
    await fcl.send([fcl.script(CODE), fcl.args([fcl.arg(address, t.Address)])]),
  );
};
```

## Contributing

Releasing a new version of Dev Wallet is as simple as tagging and creating a release, a Github Action will then build a bundle of the Dev Wallet that can be used in other tools (such as CLI). If the update of the Dev Wallet is required in the CLI, a seperate update PR on the CLI should be created. For more information, please visit the [fcl-dev-wallet GitHub repository](https://github.com/onflow/fcl-dev-wallet).

## More

Additionally, consider exploring these resources:

- [Guide to Creating a Fungible Token on Flow](../../build/guides/fungible-token.md)
- [Tutorial on Fungible Tokens](https://cadence-lang.org/docs/tutorial/fungible-tokens)
- [Faucets](../../ecosystem/faucets.md)
