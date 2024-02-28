---
title: Web3.js
sidebar_label: Web3.js
sidebar_position: 2
---

# web3.js

[web3.js](https://web3js.org/) is a Javascript library for building on EVM-compatible networks.

It allows developers to interact with smart contracts, send transactions, and retrieve data from the network.

## Dependencies

This guide assumes you have the latest version of [Node.js](https://nodejs.org/en) installed.

## Installation

To install web3.js, run the following command:

```sh
npm install web3
```

## Connecting to Flow

To use web3.js in your project, start by imporing the module and initializing your Web3 provider the desired Flow RPC endpoint.

```js
const { Web3 } = require('web3')
const web3 = new Web3('https://mainnet.nodes.fff')
```

:::info

To connect to Flow Testnet

:::

### Deploying Contracts

An account is required to deloy contracts to the Flow network.

```js
const PRIVATE_KEY = "PRIVATE_KEY"
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY)
```

:::info

:::

For more information about 

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
const result = await contract.methods.someSetterFunction(argument).call()

console.log(result)
```

For more information about using smart contracts in web3.js, see the [official documentation](https://docs.web3js.org/libdocs/Contract).