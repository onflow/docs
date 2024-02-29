---
title: Web3.js
sidebar_label: Web3.js
sidebar_position: 2
---

# web3.js

[web3.js](https://web3js.org/) is a Javascript library for building on EVM-compatible networks.

It allows developers to interact with smart contracts, send transactions, and retrieve data from the network.


## Installation

:::info
This guide assumes you have the latest version of [Node.js](https://nodejs.org/en) installed.
:::

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

Currently, only Previewnet is available.  More networks are coming soon - [see here for more info](../../build/networks.md).
:::

### Interacting With Smart Contracts

The `web3` library allows developers to interact with smart contracts via the `web3.eth.Contract` API.

For this example we will use the following "Storage" contract, deployed on the Flow Previewnet to the address `0x4c7784ae96e7cfcf0224a95059573e96f03a4e70`.  However, if you wish to deploy your own contract, see the how to do so using [Hardhat](../../build/guides/deploy-contract/using-hardhat.md) or [Remix](../../build/guides/deploy-contract/using-remix.md).

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

// Create a new contract object with the ABI and address
const contract = new web3.eth.Contract(abi, contractAddress)
```

Using this newly created object, we can now interact with the contract on the network.

#### Reading State

Querying data from the contract is done using the `call` function with one of the contract's methods.  This will not change the state and will not send a transaction.

```js
// Retrieve the current value stored in the contract
// (this is using the `retrieve` method from the contract with no arguments)
const result = await contract.methods.retrieve().call()

console.log(result) // "0" (if the contract has not been interacted with yet)
```

#### Changing State

We can mutate the state of the contract by sending a transaction to the network.

In order to send a transaction to the network, you will need an account with sufficient funds to pay for the transaction.

For Flow Previewnet, you can fund your account using the [Flow Faucet](https://previewnet-faucet.onflow.org/).  You will need to use the private key of the account to sign the transaction.

First, we will need to be able to sign a transaction using an account.  To do this, we can use the `privateKeyToAccount` function to create an `Web3Account` object from a private key.

```js
// You must replace this with the private key of the account you wish to use
const account = web3.eth.accounts.privateKeyToAccount('0x1234')
```

Then, we can sign a transaction using the user's account and send it to the network.

```js
const newValue = 1337 // Replace with any value you want to store

let signed = await account.signTransaction({
    from: account.address,
    to: contractAddress,
    data: contract.methods.store(newValue).encodeABI(),
    gasPrice: 0,
})

// Send signed transaction that stores a new value
result = await web3.eth.sendSignedTransaction(signed.rawTransaction)

console.log(result) // { status: 1, transactionHash: '0x1234', ... }
```

Now that the transaction has been sent, the contract's state has been updated.  We an verify this by querying the contract's state again.

```js
const result = await contract.methods.retrieve().call()
console.log(result) // "1337"
```

For more information about using smart contracts in web3.js, see the [official documentation](https://docs.web3js.org/libdocs/Contract).