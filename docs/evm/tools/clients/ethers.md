---
title: Ethers
sidebar_label: Ethers
sidebar_position: 2
---

# Ethers

[Ethers](https://ethers.org/) is a Javascript library for building on EVM-compatible networks.

It allows developers to interact with smart contracts, send transactions, and retrieve data from the network.

## Installation

:::info
This guide assumes you have the latest version of [Node.js](https://nodejs.org/en) installed.
:::

To install `ethers` in your project, run the following command:

```sh
npm install ethers
```

## Initializing Ethers With Flow

To use `ethers` in your project, start by importing the module and initializing a new Provider with Flow's JSON-RPC endpoint.  We are specifying [Flow Previewnet](https://developers.flow.com/networks/flow-networks/accessing-previewnet) in this example.

```js
const { ethers } = require('ethers')
const provider = new ethers.providers.JsonRpcProvider('https://previewnet.evm.nodes.onflow.org')
```

:::info
Currently, only Flow Previewnet is available.  More networks are coming soon - [see here for more info](../../build/networks.md).
:::

## Querying The Blockchain

`ethers` provides a number of methods for querying the blockchain, such as getting the latest block number, querying account balances, and more.

You can try using some of these methods to verify that your `ethers` provider is working correctly.

```js
// Look up the current block number (i.e. height)
await provider.getBlockNumber()
// 19227915

// Get the current balance of an account
balance = await provider.getBalance("0x1234")
// 4085267032476673080n

// Since the balance is in attoFlow, you may wish to display it
// in FLOW instead.
ethers.formatEther(balance)
// '4.08526703247667308'

// Get the next nonce required to send a transaction
await provider.getTransactionCount("ethers.eth")
// 2
```

For more information about other queries you can make `ethers`, please see the [official documentation](https://docs.ethers.io/).

## Interacting With Smart Contracts

The `ethers` library allows developers to interact with smart contracts via the `Contract` object.

For this example we will use the following `Storage` contract, deployed on the Flow Previewnet to the address `0x4c7784ae96e7cfcf0224a95059573e96f03a4e70`.  Note that anyone can interact with this contract, as it is deployed on a public network, so state may not always be as expected.

We recommend deploying your own contract, which can be done using [Hardhat](../../build/guides/deploy-contract/using-hardhat.md) or [Remix](../../build/guides/deploy-contract/using-remix.md).

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

The ABI for this contract can be generated using the [`solc` compiler](https://docs.soliditylang.org/en/latest/installing-solidity.html), or another tool such as [Hardhat](../../build/guides/deploy-contract/using-hardhat.md) or [Remix](../../build/guides/deploy-contract/using-remix.md).

Now that we have both the ABI and address of the contract, we can create a new `Contract` object for use in our application.

```js
// Replace with the ABI of the deployed contract
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

// Replace with the address of the deployed contract
const contractAddress = "0x4c7784ae96e7cfcf0224a95059573e96f03a4e70"

// Create a new contract object with the ABI and address connected to the provider
const contract = new ethers.Contract(contractAddress, abi, provider)
```

We can now interact with the contract on the network by using the `contract` object.

### Reading State

State can be read from the contract by calling the contract's "constant" methods (i.e. those which do not modify the state of the contract).  This **will not** not send a transaction.

```js
// Retrieve the current value stored in the contract
// (this is using the `retrieve` method from the contract with no arguments)
const result = await contract.retrieve()

console.log(result) // Current value stored in the contract
```

### Changing State

We can mutate the state of the contract by sending a transaction to the network.

In order to send a transaction to the network, you will need an account with sufficient funds to pay for the transaction.

:::info
If you do not have an account yet, you can create one using the following command from your project's root directory:

```sh
node -e "console.log(require('ethers').Wallet.createRandom())"
```

Note that this is not a secure way to generate an account, and you should use a more secure method in a production environment.

For Flow Previewnet, you can fund your account using the [Flow Faucet](https://previewnet-faucet.onflow.org/fund-account).
:::

For this demonstration, we will use a private key to create an ethers `Signer` object.

```js
// You must replace this with the private key of the account you wish to use
const signer = new ethers.Wallet('0x1234', provider)
```

Then, we can sign a transaction using the user's account and send it to the network.

```js
const newValue = 1337 // Replace with any value you want to store

// We must connect the signer to the contract to send a transaction
const connectedContract = contract.connect(signer)

// Send a transaction to the contract to store a new value
const tx = await connectedContract.store(newValue)

// Wait for the transaction to be mined
await tx.wait()

// Show the transaction
console.log(tx) // { hash: '0x1234', ... }
```

Now that the transaction has been sent, the contract's state should have updated.  We an verify this by querying the contract's state again:

```js
const result = await contract.retrieve()
console.log(result) // New value stored in the contract
```

For more information about using smart contracts in `ethers`, see the [official documentation](https://docs.ethers.io/).