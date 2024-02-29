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
const web3 = new Web3('https://previewnet.evm.nodes.onflow.org')
```

:::info

Currently, only Previewnet is available.  More networks are coming soon, [see here for more info](../../build/networks.md).
:::

### Interacting With Smart Contracts

The `web3` library allows developers to interact with smart contracts via the `web3.eth.Contract` API.

For this example we will use the following contract, deployed on the Flow Previewnet to the address `0x1234`.  However, if you wish to deploy your own contract, see the how to do so using [Hardhat](../../build/guides/deploy-contract/using-hardhat.md) or [Remix](../../build/guides/deploy-contract/using-remix.md).

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Storage {
    uint256 public storedData;

    function store(uint256 x) public {
        storedData = x;
    }

    function retrieve() public view returns (uint256) {
        return storedData;
    }
}
```

The ABI for this contract can be generated using the [`solc` compiler](https://docs.soliditylang.org/en/latest/installing-solidity.html), or by using a tool like [Hardhat](../../build/guides/deploy-contract/using-hardhat.md) or [Remix](../../build/guides/deploy-contract/using-remix.md).

```js
const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "x",
                "type": "uint256"
            }
        ],
        "name": "store",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "retrieve",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
```

A `Contract` object may be instantiated using the ABI and address of a deployed contract.

```js
const abi = [
    ... // ABI of deployed contract
]

const contractAddress = "0x1234" // replace with the address of the deployed contract
const contract = new web3.eth.Contract(abi, contractAddress)
```

By using this `Contract` object, we can now interact with the on-chain contract.

#### Querying State

We can query data from the contract by using the `call` function on one of the contract's methods.  This will not mutate the state and will not send a transaction.

```js
const result = await contract.methods.retrieve().call()
console.log(result) // "0" (if the contract has not been interacted with yet)
```

#### Mutating State

We can mutate the state of the contract by sending a transaction to the network.

In order to send a transaction to the network, you will need an account with sufficient funds to pay for the transaction.

For Flow Previewnet, you can fund your account using the [Flow Faucet](https://previewnet-faucet.onflow.org/).  You will need to use the private key of the account to sign the transaction.

First, we will need to be able to sign a transaction using an account.  To do this, we can use the `privateKeyToAccount` function to create an `Web3Account` object from a private key.

```js
const account = web3.eth.accounts.privateKeyToAccount('0x1234') // replace with the private key of the user's account
```

Then, we can sign a transaction using the user's account and send it to the network.

```js
const newValue = 1337 // replace with the new value to store

let signed = await account.signTransaction({
    from: account.address,
    to: contractAddress,
    data: contract.methods.store(newValue).encodeABI(),
})

// send signed transaction that stores a new value
result = await web3.eth.sendSignedTransaction(signed.rawTransaction)

console.log(result) // { status: true, transactionHash: '0x1234' }
```

For more information about using smart contracts in web3.js, see the [official documentation](https://docs.web3js.org/libdocs/Contract).