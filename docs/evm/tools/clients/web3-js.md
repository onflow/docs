---
title: Web3.js
sidebar_label: Web3.js
sidebar_position: 2
---

# web3.js

[web3.js](https://web3js.org/) is a Javascript library for building on EVM-compatible networks.

It allows developers to interact with smart contracts, send transactions, and retrieve data from the network.


## Installation

This guide assumes you have the latest version of [Node.js](https://nodejs.org/en) installed.

To install `web3`, run the following command:

```sh
npm install web3
```

## Connecting to Flow

To use `web3` in your project, start by imporing the module and initializing your Web3 provider the desired Flow RPC endpoint.

```js
const { Web3 } = require('web3')
const web3 = new Web3('https://mainnet.nodes.fff')
```

:::info

Currently, only Previewnet is available.  More networks are coming soon, [see here for more info](../../build/networks.md).
:::

### Interacting With Smart Contracts

`web3.js` allows developers to interact with smart contracts via the `web3.eth.Contract` API.

A `Contract` object must be instantiated as follows:

```js
const abi = [
    ... // ABI of deployed contract
]

const contractAddress
const contract = 
```

:::info
To deploy your own contract on EVM, see the documentation using [Hardhat](../../build/guides/deploy-contract/using-hardhat.md) or [Remix](../../build/guides/deploy-contract/using-remix).
:::

Methods on the smart contract can now be called in the following ways.

#### Querying state

We can query data from the contract by using the `call` function on one of the contract's methods.  This **will not** mutate the state and **will not** send a transaction.

```js
const result = contract.methods.someGetterFunction().call()

console.log(result)
```

#### Mutating state

If you wish to mutate the contract's state, you may do so with the `send` function on one of the contract's methods.  This **will** possibly mutate the state and **will** send a transaction.

```js
const argument = 1 
const sender = "0x1234" // replace with the address this transaction will be sent from

const result = await contract.methods.someSetterFunction(argument).call({
    from: sender
})

console.log(result)
```

The transaction will be signed automatically by `web3js`, as long as the sender's address is registered as an account in the provider.

For more information about using smart contracts in web3.js, see the [official documentation](https://docs.web3js.org/libdocs/Contract).