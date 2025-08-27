---
title: '@onflow/sdk'
description: 'Low-level JavaScript/TypeScript SDK for interacting with the Flow blockchain.'
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/sdk](https://github.com/onflow/fcl-js/tree/master/packages/sdk). DO NOT EDIT MANUALLY -->

# @onflow/sdk

## Overview

The Flow sdk library provides a set of tools for developers to build applications on the Flow blockchain.

## Installation

You can install the @onflow/sdk package using npm or yarn:

```bash
npm install @onflow/sdk
```

Or using yarn:

```bash
yarn add @onflow/sdk
```

### Requirements

- Node.js 14.x or later

### Importing

You can import the entire package:

```typescript
import * as sdk from '@onflow/sdk';
```

Or import specific functions:

```typescript
import { functionName } from '@onflow/sdk';
```

## Connect

By default, the library uses HTTP to communicate with the access nodes and it must be configured with the correct access node API URL. An error will be returned if the host is unreachable.

Example:

```typescript
import { config } from '@onflow/fcl';

config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
});
```

## Querying the Flow Network

After you have established a connection with an access node, you can query the Flow network to retrieve data about blocks, accounts, events and transactions. We will explore how to retrieve each of these entities in the sections below.

## Mutate Flow Network

Flow, like most blockchains, allows anybody to submit a transaction that mutates the shared global chain state. A transaction is an object that holds a payload, which describes the state mutation, and one or more authorizations that permit the transaction to mutate the state owned by specific accounts.

Transaction data is composed and signed with help of the SDK. The signed payload of transaction then gets submitted to the access node API. If a transaction is invalid or the correct number of authorizing signatures are not provided, it gets rejected.

## Transactions

A transaction is nothing more than a signed set of data that includes script code which are instructions on how to mutate the network state and properties that define and limit it's execution. All these properties are explained below.

**Script** field is the portion of the transaction that describes the state mutation logic. On Flow, transaction logic is written in [Cadence](https://cadence-lang.org/docs). Here is an example transaction script:

```typescript
transaction(greeting: string) {
  execute {
    log(greeting.concat(", World!"))
  }
}
```

**Arguments**. A transaction can accept zero or more arguments that are passed into the Cadence script. The arguments on the transaction must match the number and order declared in the Cadence script. Sample script from above accepts a single `String` argument.

**Proposal key** must be provided to act as a sequence number and prevent replay and other potential attacks.

Each account key maintains a separate transaction sequence counter; the key that lends its sequence number to a transaction is called the proposal key.

A proposal key contains three fields:

- Account address
- Key index
- Sequence number

A transaction is only valid if its declared sequence number matches the current onchain sequence number for that key. The sequence number increments by one after the transaction is executed.

**Payer** is the account that pays the fees for the transaction. A transaction must specify exactly one payer. The payer is only responsible for paying the network and gas fees; the transaction is not authorized to access resources or code stored in the payer account.

**Authorizers** are accounts that authorize a transaction to read and mutate their resources. A transaction can specify zero or more authorizers, depending on how many accounts the transaction needs to access.

The number of authorizers on the transaction must match the number of `&Account` parameters declared in the prepare statement of the Cadence script.

Example transaction with multiple authorizers:

```typescript
transaction {
  prepare(authorizer1: &Account, authorizer2: &Account) { }
}
```

**Gas limit** is the limit on the amount of computation a transaction requires, and it will abort if it exceeds its gas limit.
Cadence uses metering to measure the number of operations per transaction. You can read more about it in the [Cadence documentation](https://cadence-lang.org/docs).

The gas limit depends on the complexity of the transaction script. Until dedicated gas estimation tooling exists, it's best to use the emulator to test complex transactions and determine a safe limit.

**Reference block** specifies an expiration window (measured in blocks) during which a transaction is considered valid by the network.
A transaction will be rejected if it is submitted past its expiry block. Flow calculates transaction expiry using the _reference block_ field on a transaction.
A transaction expires after `600` blocks are committed on top of the reference block, which takes about 10 minutes at average Mainnet block rates.

## API Reference

This section contains documentation for all of the functions and namespaces in the sdk package.

- [account](./account.md) - Retrieve any account from Flow network&#x27;s latest block or from a specified block...
- [arg](./arg.md) - A utility builder to be used with fcl.args[...] to create FCL supported...
- [args](./args.md) - A utility builder to be used with other builders to pass in arguments with a...
- [atBlockHeight](./atBlockHeight.md) - A builder function that returns a partial interaction to a block at a specific...
- [atBlockId](./atBlockId.md) - A builder function that returns a partial interaction to a block at a specific...
- [atLatestBlock](./atLatestBlock.md) - A builder function that returns a partial interaction to query the latest block...
- [authorization](./authorization.md) - Creates an authorization function for use in transactions. An authorization...
- [authorizations](./authorizations.md) - A utility builder to set the authorizations on a transaction. Authorizations...
- [block](./block.md) - Query the network for block by id, height or get the latest block. Block ID is...
- [build](./build.md) - A builder function that creates an interaction from an array of builder...
- [cadence](./cadence.md) - Creates a template function
- [cdc](./cdc.md) - Creates a template function
- [config](./config.md) - Sets the config
- [createSdkClient](./createSdkClient.md) - Creates an SDK client with the provided options.
- [createSignableVoucher](./createSignableVoucher.md) - Creates a signable voucher object from an interaction for signing purposes. A...
- [decode](./decode.md) - Decodes the response from &#x27;fcl.send()&#x27; into the appropriate JSON representation...
- [destroy](./destroy.md) - Removes a property from an interaction object using a dot-notation key path.
- [encodeMessageFromSignable](./encodeMessageFromSignable.md) - Encodes a message from a signable object for a specific signer address. This...
- [encodeTransactionEnvelope](./encodeTransactionEnvelope.md) - Encodes a complete transaction envelope including payload and signatures. This...
- [encodeTransactionPayload](./encodeTransactionPayload.md) - Encodes a transaction payload for signing. This function takes a transaction...
- [encodeTxIdFromVoucher](./encodeTxIdFromVoucher.md) - Encodes a transaction ID from a voucher by computing its hash. A voucher is an...
- [get](./get.md) - Gets a value from an interaction object using a dot-notation key path.
- [getAccount](./getAccount.md) - A builder function that returns the interaction to get an account by address....
- [getBlock](./getBlock.md) - A builder function that returns the interaction to get the latest block. Use...
- [getBlockHeader](./getBlockHeader.md) - A builder function that returns the interaction to get a block header. A block...
- [getCollection](./getCollection.md) - A builder function that returns a collection containing a list of transaction...
- [getEvents](./getEvents.md) - A builder function that returns the interaction to get events. Events are...
- [getEventsAtBlockHeightRange](./getEventsAtBlockHeightRange.md) - A builder function that returns all instances of a particular event (by name)...
- [getEventsAtBlockIds](./getEventsAtBlockIds.md) - A builder function that returns all instances of a particular event (by name)...
- [getNetworkParameters](./getNetworkParameters.md) - A builder function that returns the interaction to get network parameters....
- [getNodeVersionInfo](./getNodeVersionInfo.md) - A builder function for the Get Node Version Info interaction. Creates an...
- [getTransaction](./getTransaction.md) - A builder function that returns the interaction to get a transaction by id....
- [getTransactionStatus](./getTransactionStatus.md) - A builder function that returns the status of transaction. The transaction id...
- [initInteraction](./initInteraction.md) - Creates a new interaction object with default values.
- [interaction](./interaction.md) - Creates a new interaction object with default values.
- [isBad](./isBad.md) - Checks if an interaction has a failed status.
- [isOk](./isOk.md) - Checks if an interaction has a successful status.
- [limit](./limit.md) - A utility builder to set the compute limit on a transaction. The compute limit...
- [nodeVersionInfo](./nodeVersionInfo.md) - Retrieve version information from the connected Flow Access Node. This function...
- [param](./param.md) - Legacy function for setting a single parameter on an interaction.
- [params](./params.md) - Legacy function for setting parameters on an interaction.
- [payer](./payer.md) - A builder function that adds payer account(s) to a transaction. Every...
- [ping](./ping.md) - A builder function that creates a ping interaction to test connectivity to the...
- [pipe](./pipe.md) - Async pipe function to compose interactions. The pipe function is the foundation...
- [proposer](./proposer.md) - A builder function that adds the proposer to a transaction. The proposer is...
- [put](./put.md) - Sets a value in an interaction object using a dot-notation key path.
- [ref](./ref.md) - A builder function that sets the reference block for a transaction. The...
- [resolve](./resolve.md) - Resolves an interaction by applying a series of resolvers in sequence. This is...
- [resolveAccounts](./resolveAccounts.md) - Resolves account authorization functions and validates account configurations...
- [resolveArguments](./resolveArguments.md) - Resolves transaction arguments by evaluating argument functions and converting...
- [resolveCadence](./resolveCadence.md)
- [resolveFinalNormalization](./resolveFinalNormalization.md) - Normalizes account addresses by removing the &quot;0x&quot; prefix from all account...
- [resolveProposerSequenceNumber](./resolveProposerSequenceNumber.md) - Resolves the sequence number for the proposer account by querying the...
- [resolveRefBlockId](./resolveRefBlockId.md) - Resolves the reference block ID for a transaction by querying the latest block...
- [resolveSignatures](./resolveSignatures.md) - Resolves signatures for a transaction by coordinating the signing process for...
- [resolveValidators](./resolveValidators.md) - Executes validator functions that have been attached to an interaction to...
- [resolveVoucherIntercept](./resolveVoucherIntercept.md) - Resolves voucher intercept functions by calling them with the current voucher.
- [response](./response.md) - Creates a default response object
- [script](./script.md) - A builder function that creates a script interaction. Scripts allow you to write...
- [send](./send.md) - Sends arbitrary scripts, transactions, and requests to Flow. This method...
- [subscribe](./subscribe.md) - Subscribe to real-time data from the Flow blockchain and automatically decode...
- [subscribeEvents](./subscribeEvents.md) - Subscribe to events with the given filter and parameters. Creates a subscription...
- [subscribeRaw](./subscribeRaw.md) - Subscribe to a topic without decoding the data. This function creates a raw...
- [TestUtils](./testUtils.md) (namespace) - Namespace containing TestUtils utilities
- [TestUtils.authzDeepResolveMany](./testUtils.md#authzDeepResolveMany) - Creates a deep test authorization resolver with nested resolution for complex...
- [TestUtils.authzFn](./testUtils.md#authzFn) - Creates a test authorization function for testing transactions.
- [TestUtils.authzResolve](./testUtils.md#authzResolve) - Creates a test authorization resolver that can be used for testing account...
- [TestUtils.authzResolveMany](./testUtils.md#authzResolveMany) - Creates a test authorization resolver that handles multiple accounts with...
- [TestUtils.idof](./testUtils.md#idof) - Generates a unique identifier for an account based on its address and key ID.
- [TestUtils.run](./testUtils.md#run) - Runs a set of functions on an interaction This is a utility function for testing...
- [TestUtils.sig](./testUtils.md#sig) - Generates a test signature string for an account.
- [transaction](./transaction.md) - A template builder to use a Cadence transaction for an interaction. FCL &quot;mutate&quot;...
- [update](./update.md) - Updates a value in an interaction object using a transformation function.
- [validator](./validator.md) - A builder function that adds a validator to a transaction. Validators are...
- [voucherIntercept](./voucherIntercept.md) - A builder function that intercepts and modifies a voucher. This function is...
- [voucherToTxId](./voucherToTxId.md) - Converts a voucher object to a transaction ID. This function computes the...
- [why](./why.md) - Returns the reason for an interaction failure.

---
