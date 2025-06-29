---
sidebar_position: 1
title: "@onflow/fcl-core"
description: "Core JavaScript/TypeScript library providing shared functionality for Flow blockchain interactions."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl-core](https://github.com/onflow/fcl-js/tree/master/packages/fcl-core). DO NOT EDIT MANUALLY -->

# @onflow/fcl-core

## Overview

The Flow fcl-core library provides a set of tools for developers to build applications on the Flow blockchain.

## Installation

You can install the @onflow/fcl-core package using npm or yarn:

```bash
npm install @onflow/fcl-core
```

Or using yarn:

```bash
yarn add @onflow/fcl-core
```

### Requirements

- Node.js 14.x or later

### Importing

You can import the entire package:

```typescript
import * as fcl from "@onflow/fcl-core"
```

Or import specific functions:

```typescript
import { functionName } from "@onflow/fcl-core"
```

## Configuration

FCL has a mechanism that lets you configure various aspects of FCL. When you move from one instance of the Flow Blockchain to another (Local Emulator to Testnet to Mainnet) the only thing you should need to change for your FCL implementation is your configuration.

### Setting Configuration Values

Values only need to be set once. We recommend doing this once and as early in the life cycle as possible. To set a configuration value, the `put` method on the `config` instance needs to be called, the `put` method returns the `config` instance so they can be chained.

Alternatively, you can set the config by passing a JSON object directly.

```javascript
import * as fcl from '@onflow/fcl';

fcl
  .config() // returns the config instance
  .put('foo', 'bar') // configures "foo" to be "bar"
  .put('baz', 'buz'); // configures "baz" to be "buz"

// OR

fcl.config({
  foo: 'bar',
  baz: 'buz',
});
```

### Getting Configuration Values

The `config` instance has an **asynchronous** `get` method. You can also pass it a fallback value.

```javascript
import * as fcl from '@onflow/fcl';

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

### Common Configuration Keys

| Name                                 | Example                                                       | Description                                                                                                                                                             |
| ------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accessNode.api` **(required)**      | `https://rest-testnet.onflow.org`                             | API URL for the Flow Blockchain Access Node you want to be communicating with. See all available access node endpoints [here](https://developers.onflow.org/http-api/). |
| `app.detail.title`                   | `Cryptokitties`                                               | Your applications title, can be requested by wallets and other services. Used by WalletConnect plugin & Wallet Discovery service.                                       |
| `app.detail.icon`                    | `https://fcl-discovery.onflow.org/images/blocto.png`          | Url for your applications icon, can be requested by wallets and other services. Used by WalletConnect plugin & Wallet Discovery service.                                |
| `app.detail.description`             | `Cryptokitties is a blockchain game`                          | Your applications description, can be requested by wallets and other services. Used by WalletConnect plugin & Wallet Discovery service.                                 |
| `app.detail.url`                     | `https://cryptokitties.co`                                    | Your applications url, can be requested by wallets and other services. Used by WalletConnect plugin & Wallet Discovery service.                                         |
| `challenge.handshake`                | **DEPRECATED**                                                | Use `discovery.wallet` instead.                                                                                                                                         |
| `discovery.authn.endpoint`           | `https://fcl-discovery.onflow.org/api/testnet/authn`          | Endpoint for alternative configurable Wallet Discovery mechanism.                                                                  |
| `discovery.wallet` **(required)**    | `https://fcl-discovery.onflow.org/testnet/authn`              | Points FCL at the Wallet or Wallet Discovery mechanism.                                                                                                                 |
| `discovery.wallet.method`            | `IFRAME/RPC`, `POP/RPC`, `TAB/RPC`, `HTTP/POST`, or `EXT/RPC` | Describes which service strategy a wallet should use.                                                                                                                   |
| `fcl.limit`                          | `100`                                                         | Specifies fallback compute limit if not provided in transaction. Provided as integer.                                                                                   |
| `flow.network` **(recommended)**     | `testnet`                                                     | Used in conjunction with stored interactions and provides FCLCryptoContract address for `testnet` and `mainnet`. Possible values: `local`, `testnet`, `mainnet`.        |
| `walletconnect.projectId`            | `YOUR_PROJECT_ID`                                             | Your app's WalletConnect project ID. See [WalletConnect Cloud](https://cloud.walletconnect.com/sign-in) to obtain a project ID for your application.                    |
| `walletconnect.disableNotifications` | `false`                                                       | Optional flag to disable pending WalletConnect request notifications within the application's UI.                                                                       |

## Using Contracts in Scripts and Transactions

### Address Replacement

Configuration keys that start with `0x` will be replaced in FCL scripts and transactions, this allows you to write your script or transaction Cadence code once and not have to change it when you point your application at a difference instance of the Flow Blockchain.

```javascript
import * as fcl from '@onflow/fcl';

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
import * as fcl from '@onflow/fcl';

fcl
  .config()
  .put('flow.network', 'testnet')
  .put('walletconnect.projectId', 'YOUR_PROJECT_ID')
  .put('accessNode.api', 'https://rest-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')
  .put('app.detail.title', 'Test Harness')
  .put('app.detail.icon', 'https://i.imgur.com/r23Zhvu.png')
  .put('app.detail.description', 'A test harness for FCL')
  .put('app.detail.url', 'https://myapp.com')
  .put('service.OpenID.scopes', 'email email_verified name zoneinfo')
  .put('0xFlowToken', '0x7e60df042a9c0868');
```

### Using `flow.json` for Contract Imports

A simpler and more flexible way to manage contract imports in scripts and transactions is by using the `config.load` method in FCL. This lets you load contract configurations from a `flow.json` file, keeping your import syntax clean and allowing FCL to pick the correct contract addresses based on the network you're using.

#### 1. Define Your Contracts in `flow.json`

Here’s an example of a `flow.json` file with aliases for multiple networks:

```json
{
  "contracts": {
    "HelloWorld": {
      "source": "./cadence/contracts/HelloWorld.cdc",
      "aliases": {
        "testnet": "0x1cf0e2f2f715450",
        "mainnet": "0xf8d6e0586b0a20c7"
      }
    }
  }
}
```

- **`source`**: Points to the contract file in your project.
- **`aliases`**: Maps each network to the correct contract address.

#### 2. Configure FCL

Load the `flow.json` file and set up FCL to use it:

```javascript
import { config } from '@onflow/fcl';
import flowJSON from '../flow.json';

config({
  'flow.network': 'testnet', // Choose your network, e.g., testnet or mainnet
  'accessNode.api': 'https://rest-testnet.onflow.org', // Access node for the network
  'discovery.wallet': `https://fcl-discovery.onflow.org/testnet/authn`, // Wallet discovery
}).load({ flowJSON });
```

With this setup, FCL will automatically use the correct contract address based on the selected network (e.g., `testnet` or `mainnet`).

#### 3. Use Contract Names in Scripts and Transactions

After setting up `flow.json`, you can import contracts by name in your Cadence scripts or transactions:

```cadence
import "HelloWorld"

access(all) fun main(): String {
    return HelloWorld.sayHello()
}
```

FCL replaces `"HelloWorld"` with the correct address from the `flow.json` configuration.

> **Note**: Don’t store private keys in your `flow.json`. Instead, keep sensitive keys in a separate, `.gitignore`-protected file.

## API Reference

This section contains documentation for all of the functions and namespaces in the fcl-core package.

- [account](./account.md) - Retrieve any account from Flow network&#x27;s latest block or from a specified block...
- [AppUtils](./appUtils.md) (namespace) - Namespace containing AppUtils utilities
- [AppUtils.verifyAccountProof](./appUtils.md#verifyAccountProof) - Verifies the authenticity of an account proof signature on the Flow blockchain....
- [arg](./arg.md) - A utility builder to be used with fcl.args[...] to create FCL supported...
- [args](./args.md) - A utility builder to be used with other builders to pass in arguments with a...
- [atBlockHeight](./atBlockHeight.md) - A builder function that returns a partial interaction to a block at a specific...
- [atBlockId](./atBlockId.md) - A builder function that returns a partial interaction to a block at a specific...
- [authorization](./authorization.md) - Creates an authorization function for use in transactions. An authorization...
- [authorizations](./authorizations.md) - A utility builder to set the authorizations on a transaction. Authorizations...
- [block](./block.md) - Query the network for block by id, height or get the latest block. Block ID is...
- [build](./build.md) - A builder function that creates an interaction from an array of builder...
- [buildMessageHandler](./buildMessageHandler.md) - Creates a message handler for processing window messages from wallet service...
- [cadence](./cadence.md) - Creates a template function
- [cdc](./cdc.md) - Creates a template function
- [config](./config.md) - Sets the config
- [createSignableVoucher](./createSignableVoucher.md) - Creates a signable voucher object from an interaction for signing purposes. A...
- [decode](./decode.md) - Decodes the response from &#x27;fcl.send()&#x27; into the appropriate JSON representation...
- [discovery](./discovery.md) (namespace) - Namespace containing discovery utilities
- [discovery.getDiscoveryService](./discovery.md#getDiscoveryService) - Creates and configures a discovery service object used for wallet...
- [discovery.makeDiscoveryServices](./discovery.md#makeDiscoveryServices) - Creates an array of discovery services by combining extension services from the...
- [display](./display.md) - Adds 0x to address if not already present
- [events](./events.md) - Subscribes to Flow blockchain events in real-time. This function provides a way...
- [execStrategy](./execStrategy.md) - Executes a service strategy based on the service method. This function looks up...
- [getAccount](./getAccount.md) - A builder function that returns the interaction to get an account by address....
- [getBlock](./getBlock.md) - A builder function that returns the interaction to get the latest block. Use...
- [getBlockHeader](./getBlockHeader.md) - A builder function that returns the interaction to get a block header. A block...
- [getChainId](./getChainId.md) - Gets the chain ID if its set, otherwise gets the chain ID from the access node
- [getCollection](./getCollection.md) - A builder function that returns a collection containing a list of transaction...
- [getCurrentUser](./getCurrentUser.md) - Creates and configures the Current User service for managing user authentication...
- [getEvents](./getEvents.md) - A builder function that returns the interaction to get events. Events are...
- [getEventsAtBlockHeightRange](./getEventsAtBlockHeightRange.md) - A builder function that returns all instances of a particular event (by name)...
- [getEventsAtBlockIds](./getEventsAtBlockIds.md) - A builder function that returns all instances of a particular event (by name)...
- [getExecHttpPost](./getExecHttpPost.md) - Creates an HTTP POST strategy executor that handles wallet service communication...
- [getMutate](./getMutate.md) - Factory function that returns a mutate function for a given currentUser.
- [getNetworkParameters](./getNetworkParameters.md) - A builder function that returns the interaction to get network parameters....
- [getNodeVersionInfo](./getNodeVersionInfo.md) - A builder function for the Get Node Version Info interaction. Creates an...
- [getTransaction](./getTransaction.md) - A builder function that returns the interaction to get a transaction by id....
- [getTransactionStatus](./getTransactionStatus.md) - A builder function that returns the status of transaction. The transaction id...
- [initServiceRegistry](./initServiceRegistry.md) - Initializes the service registry with core strategies for different...
- [InteractionTemplateUtils](./interactionTemplateUtils.md) (namespace) - Namespace containing InteractionTemplateUtils utilities
- [InteractionTemplateUtils.deriveCadenceByNetwork](./interactionTemplateUtils.md#deriveCadenceByNetwork) - Fills import addresses in Cadence for network
- [InteractionTemplateUtils.generateDependencyPin](./interactionTemplateUtils.md#generateDependencyPin) - Generates a dependency pin for a smart contract on the Flow blockchain. A...
- [InteractionTemplateUtils.generateDependencyPinAtLatestSealedBlock](./interactionTemplateUtils.md#generateDependencyPinAtLatestSealedBlock) - Generates a dependency pin for a smart contract at the latest sealed block on...
- [InteractionTemplateUtils.generateTemplateId](./interactionTemplateUtils.md#generateTemplateId) - Generates Interaction Template ID for a given Interaction Template
- [InteractionTemplateUtils.getInteractionTemplateAudits](./interactionTemplateUtils.md#getInteractionTemplateAudits) - Checks whether a set of auditors have audited a given Interaction Template on...
- [InteractionTemplateUtils.getTemplateArgumentMessage](./interactionTemplateUtils.md#getTemplateArgumentMessage) - Gets Interaction Template argument message by message key, argument label, and...
- [InteractionTemplateUtils.getTemplateMessage](./interactionTemplateUtils.md#getTemplateMessage) - Get Interaction Template argument message
- [InteractionTemplateUtils.verifyDependencyPinsSame](./interactionTemplateUtils.md#verifyDependencyPinsSame) - Checks if an Interaction Template&#x27;s pins match those generated at a block height
- [InteractionTemplateUtils.verifyDependencyPinsSameAtLatestSealedBlock](./interactionTemplateUtils.md#verifyDependencyPinsSameAtLatestSealedBlock) - Checks if an Interaction Template&#x27;s pins match those generated at the latest...
- [InteractionTemplateUtils.verifyGeneratedTemplateId](./interactionTemplateUtils.md#verifyGeneratedTemplateId) - Verifies the given Interaction Template Id has been correctly generated
- [invariant](./invariant.md)
- [isBad](./isBad.md) - Checks if an interaction has a failed status.
- [isOk](./isOk.md) - Checks if an interaction has a successful status.
- [isReactNative](./isReactNative.md) - Checks if the current environment is React Native. This function returns a...
- [limit](./limit.md) - A utility builder to set the compute limit on a transaction. The compute limit...
- [nodeVersionInfo](./nodeVersionInfo.md) - Retrieve version information from the connected Flow Access Node. This function...
- [normalizePollingResponse](./normalizePollingResponse.md) - Normalizes a polling response to ensure compatibility with FCL format
- [param](./param.md) - Legacy function for setting a single parameter on an interaction.
- [params](./params.md) - Legacy function for setting parameters on an interaction.
- [payer](./payer.md) - A builder function that adds payer account(s) to a transaction. Every...
- [ping](./ping.md) - A builder function that creates a ping interaction to test connectivity to the...
- [pipe](./pipe.md) - Async pipe function to compose interactions. The pipe function is the foundation...
- [pluginRegistry](./pluginRegistry.md) - Global plugin registry instance for managing FCL plugins. This registry handles...
- [proposer](./proposer.md) - A builder function that adds the proposer to a transaction. The proposer is...
- [query](./query.md) - Allows you to submit scripts to query the blockchain.
- [queryRaw](./queryRaw.md) - Allows you to submit scripts to query the blockchain and get raw response data.
- [ref](./ref.md) - A builder function that sets the reference block for a transaction. The...
- [sansPrefix](./sansPrefix.md) - Removes 0x from address if present
- [script](./script.md) - A builder function that creates a script interaction. Scripts allow you to write...
- [send](./send.md) - Sends arbitrary scripts, transactions, and requests to Flow. This method...
- [serialize](./serialize.md) - Serializes a Flow transaction or script to a JSON-formatted signable voucher...
- [serviceEndpoint](./serviceEndpoint.md) - Creates a URL object from a service endpoint with additional parameters...
- [setIsReactNative](./setIsReactNative.md) - Sets the React Native environment flag for FCL. This function should be called...
- [subscribe](./subscribe.md) - Subscribe to real-time data from the Flow blockchain and automatically decode...
- [subscribeEvents](./subscribeEvents.md) - Subscribe to events with the given filter and parameters. Creates a subscription...
- [subscribeRaw](./subscribeRaw.md) - Subscribe to a topic without decoding the data. This function creates a raw...
- [transaction](./transaction.md) - A template builder to use a Cadence transaction for an interaction. FCL &quot;mutate&quot;...
- [tx](./tx.md) - Creates a transaction monitor that provides methods for tracking and subscribing...
- [validator](./validator.md) - A builder function that adds a validator to a transaction. Validators are...
- [verifyUserSignatures](./verifyUserSignatures.md) - Verify a valid signature/s for an account on Flow.
- [voucherIntercept](./voucherIntercept.md) - A builder function that intercepts and modifies a voucher. This function is...
- [voucherToTxId](./voucherToTxId.md) - Converts a voucher object to a transaction ID. This function computes the...
- [WalletUtils](./walletUtils.md) (namespace) - Namespace containing WalletUtils utilities
- [WalletUtils.approve](./walletUtils.md#approve) - Sends an approval response to FCL with the provided data. This indicates that...
- [WalletUtils.close](./walletUtils.md#close) - Closes the wallet service window/iframe and notifies FCL that the service is...
- [WalletUtils.decline](./walletUtils.md#decline) - Sends a decline response to FCL indicating that the user has rejected or...
- [WalletUtils.encodeAccountProof](./walletUtils.md#encodeAccountProof) - Encodes account proof data for cryptographic signing on the Flow blockchain....
- [WalletUtils.encodeMessageFromSignable](./walletUtils.md#encodeMessageFromSignable) - Encodes a message from a signable object for a specific signer address. This...
- [WalletUtils.injectExtService](./walletUtils.md#injectExtService) - Injects an external authentication service into the global FCL extensions array....
- [WalletUtils.onMessageFromFCL](./walletUtils.md#onMessageFromFCL) - Sets up a message listener to receive messages from the parent FCL application....
- [WalletUtils.ready](./walletUtils.md#ready) - Initiates the communication handshake between a wallet service and FCL. This...
- [WalletUtils.redirect](./walletUtils.md#redirect) - Sends a redirect response to FCL indicating that the operation requires a...
- [WalletUtils.sendMsgToFCL](./walletUtils.md#sendMsgToFCL) - Sends messages from a wallet or service back to the parent FCL application. This...
- [why](./why.md) - Returns the reason for an interaction failure.
- [withPrefix](./withPrefix.md) - Adds 0x to address if not already present

--- 