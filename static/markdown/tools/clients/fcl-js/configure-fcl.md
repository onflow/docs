---
title: How to Configure FCL
---

## Configuration

FCL provides a mechanism to configure various aspects of its behavior. The key principle is that when switching between different Flow Blockchain environments (e.g., Local Emulator → Testnet → Mainnet), the only required change should be your FCL configuration.

## Setting Configuration Values

Values only need to be set once. We recommend doing this once and as early in the life cycle as possible.
To set a configuration value, the `put` method on the `config` instance needs to be called, the `put` method returns the `config` instance so they can be chained.

```javascript
<!-- Import: * as fcl from "@onflow/fcl" -->

fcl
  .config() // returns the config instance
  .put('foo', 'bar') // configures "foo" to be "bar"
  .put('baz', 'buz'); // configures "baz" to be "buz"
```

## Getting Configuration Values

The `config` instance has an asynchronous `get` method. You can also pass it a fallback value incase the configuration state does not include what you are wanting.

```javascript
<!-- Import: * as fcl from "@onflow/fcl" -->

fcl.config().put('foo', 'bar').put('woot', 5).put('rawr', 7);

const FALLBACK = 1;

async function addStuff() {
  var woot = await fcl.config().get('woot', FALLBACK); // will be 5 -- set in the config before
  var rawr = await fcl.config().get('rawr', FALLBACK); // will be 7 -- set in the config before
  var hmmm = await fcl.config().get('hmmm', FALLBACK); // will be 1 -- uses fallback because this isnt in the config

  return woot + rawr + hmmm;
}

addStuff().then((d) => console.log(d)); // 13 (5 + 7 + 1)
```

## Common Configuration Keys

- `accessNode.api` -- Api URL for the Flow Blockchain Access Node you want to be communicating with.
- `app.detail.title` - **(INTRODUCED `@onflow/fcl@0.0.68`)** Your applications title, can be requested by wallets and other services. Used by WalletConnect plugin & Wallet Discovery service.
- `app.detail.icon` - **(INTRODUCED `@onflow/fcl@0.0.68`)** Url for your applications icon, can be requested by wallets and other services. Used by WalletConnect plugin & Wallet Discovery service.
- `app.detail.description` - **(INTRODUCED `@onflow/fcl@1.11.0`)** Your applications description, can be requested by wallets and other services. Used by WalletConnect plugin & Wallet Discovery service.
- `app.detail.url` - **(INTRODUCED `@onflow/fcl@1.11.0`)** Your applications url, can be requested by wallets and other services. Used by WalletConnect plugin & Wallet Discovery service.
- `challenge.handshake` -- **(DEPRECATED `@onflow/fcl@0.0.68`)** Points FCL at the Wallet or Wallet Discovery mechanism.
- `discovery.wallet` -- **(INTRODUCED `@onflow/fcl@0.0.68`)** Points FCL at the Wallet or Wallet Discovery mechanism.
- `discovery.wallet.method` -- Describes which service strategy a wallet should use: `IFRAME/RPC`, `POP/RPC`, `TAB/RPC`, `HTTP/POST`, `EXT/RPC`
- `env` -- **(DEPRECATED `@onflow/fcl@1.0.0`)** Used in conjunction with stored interactions. Possible values: `local`, `testnet`, `mainnet`
- `fcl.limit` -- Specifies fallback compute limit if not provided in transaction. Provided as integer.
- `flow.network` (recommended) -- **(INTRODUCED `@onflow/fcl@1.0.0`)** Used in conjunction with stored interactions and provides FCLCryptoContract address for `testnet` and `mainnet`. Possible values: `local`, `testnet`, `mainnet`.
- `service.OpenID.scopes` - **(INTRODUCED `@onflow/fcl@0.0.68`)** Open ID Connect claims for Wallets and OpenID services.
- `walletconnect.projectId` -- **(INTRODUCED `@onflow/fcl@1.11.0`)** Your app's WalletConnect project ID. See [WalletConnect Cloud](https://cloud.walletconnect.com/sign-in) to obtain a project ID for your application.
- `walletconnect.disableNotifications` -- **(INTRODUCED `@onflow/fcl@1.13.0`)** Flag to disable pending WalletConnect request notifications within the application's UI. Default is `false`.

## Using Contracts in Scripts and Transactions

### Address Replacement

Configuration keys that start with `0x` will be replaced in FCL scripts and transactions, this allows you to write your script or transaction Cadence code once and not have to change it when you point your application at a difference instance of the Flow Blockchain.

```javascript
<!-- Import: * as fcl from "@onflow/fcl" -->

fcl.config().put('0xFungibleToken', '0xf233dcee88fe0abe');

async function myScript() {
  return fcl
    .send([
      fcl.script`
      import FungibleToken from 0xFungibleToken // will be replaced with 0xf233dcee88fe0abe because of the configuration

      access(all) fun main() { /* Rest of the script goes here */ }
    `,
    ])
    .then(fcl.decode);
}

async function myTransaction() {
  return fcl
    .send([
      fcl.transaction`
      import FungibleToken from 0xFungibleToken // will be replaced with 0xf233dcee88fe0abe because of the configuration

      transaction { /* Rest of the transaction goes here */ }
    `,
    ])
    .then(fcl.decode);
}
```

#### Example

```javascript
<!-- Import: * as fcl from "@onflow/fcl" -->

fcl
  .config()
  .put('flow.network', 'testnet')
  .put('accessNode.api', 'https://rest-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')
  .put('walletconnect.projectId', 'YOUR_PROJECT_ID')
  .put('app.detail.title', 'Test Harness')
  .put('app.detail.icon', 'https://i.imgur.com/r23Zhvu.png')
  .put('app.detail.description', 'A test harness for FCL')
  .put('app.detail.url', 'https://myapp.com')
  .put('0xFlowToken', '0x7e60df042a9c0868');
```

### Using `flow.json`

A simpler way to import contracts in scripts and transactions is to use the `config.load` method to ingest your contracts from your `flow.json` file. This keeps the import syntax unified across tools and lets FCL figure out which address to use for what network based on the network provided in config. To use `config.load` you must first import your `flow.json` file and then pass it to `config.load` as a parameter.

```javascript
<!-- Import: { config } from "@onflow/fcl" -->
<!-- Import: flowJSON from "../flow.json" -->

config({
  'flow.network': 'testnet',
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': `https://fcl-discovery.onflow.org/testnet/authn`,
}).load({ flowJSON });
```

Let's say your `flow.json` file looks like this:

```
{
  "contracts": {
		"HelloWorld": "cadence/contracts/HelloWorld.cdc"
	}
}
```

Then in your scripts and transactions, all you have to do is:

```
import "HelloWorld"
```

FCL will automatically replace the contract name with the address for the network you are using.

> Note: never put private keys in your `flow.json`. You should use the [key/location syntax](../../flow-cli/flow.json/security.md) to separate your keys into a separate git ignored file.