---
title: Web3.js on Flow Blockchain
sidebar_label: Web3.js
sidebar_position: 2
---

# Web3.js

[Web3.js](https://web3js.org/) is a Javascript library for building on EVM-compatible networks.

It allows developers to interact with smart contracts, send transactions, and retrieve data from the network.

## Prerequisites

:::info
This guide assumes you have the latest version of [Node.js](https://nodejs.org/en) installed.
:::

To install `web3` in your project, run the following command:

```sh
npm install web3
```

## Initialize Web3 with Flow

To use `web3` in your project, first import the module and initialize your `Web3` instance with a Flow RPC endpoint.

```js
const { Web3 } = require('web3');
const web3 = new Web3('https://testnet.evm.nodes.onflow.org');
```

**Note:** If you want to connect to the Flow testnet, replace the above URL with `https://mainnet.evm.nodes.onflow.org`.

## Query The blockchain

`web3` provides a number of methods for how to query the blockchain, such as to retrieve the latest block number, query account balances, and more.

You can try with some of these methods to verify that your `web3` instance works correctly.

```js
// Get the latest block number
const blockNumber = await web3.eth.getBlockNumber();
console.log(blockNumber); // Latest block number

// Get the balance of an account
const balance = await web3.eth.getBalance('0x1234'); // Replace with any address
console.log(balance); // Balance in attoFlow

// Get the chain ID
const chainId = await web3.eth.getChainId();
console.log(chainId);

// Get the gas price
const gasPrice = await web3.eth.getGasPrice();
console.log(gasPrice); // Gas price in attoFlow
```

For more information about other queries you can make `web3`, see the [official documentation](https://docs.web3js.org/).

## Interact with smart contracts

The `web3` library allows developers to interact with smart contracts via the `web3.eth.Contract` API.

For this example we will use the following `Storage` contract.

We recommend that you deploy your own contract, which you can do with [Hardhat](../development-tools/hardhat.md) or [Remix](../development-tools/remix.md).

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

You can generate the ABI for this contract with the [`solc` compiler](https://docs.soliditylang.org/en/latest/installing-solidity.html), or another tool such as [Hardhat](../development-tools/hardhat.md) or [Remix](../development-tools/remix.md).

Now that we have both the ABI and address of the contract, we can create a new `Contract` object for use in our application.

```js
// Replace with the ABI of the deployed contract
const abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'x',
        type: 'uint256',
      },
    ],
    name: 'store',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'retrieve',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

// Replace with the address of the deployed contract
const contractAddress = '0x4c7784ae96e7cfcf0224a95059573e96f03a4e70';

// Create a new contract object with the ABI and address
const contract = new web3.eth.Contract(abi, contractAddress);
```

We can now interact with the contract on the network ith the `contract` object.

### Reading state

State can be read from the contract via the `call` function with one of the contract's methods. This will not change the state and will not send a transaction.

```js
// Retrieve the current value stored in the contract
// (this is using the `retrieve` method from the contract with no arguments)
const result = await contract.methods.retrieve().call();

console.log(result); // Current value stored in the contract
```

### Change state

To mutate the state of the contract, we can send a transaction to the network.

In order to send a transaction to the network, you will need an account with sufficient funds to pay for the transaction.

:::info

If you do not have an account yet, you can create one with the following command from your project's root directory:

```sh
node -e "console.log(require('web3').eth.accounts.create())"
```

This is not a secure way to generate an account, and you should use a more secure method in a production environment.

You can fund your account with the [Flow Faucet](https://faucet.flow.com/fund-account).
:::

We can use the `privateKeyToAccount` function to create an `Web3Account` object from our account's private key.

```js
// You must replace this with the private key of the account you wish to use
const account = web3.eth.accounts.privateKeyToAccount('0x1234');
```

Then, we can sign a transaction with the user's account and send it to the network.

```js
const newValue = 1337; // Replace with any value you want to store

// Sign a transaction that stores a new value in the contract
// (this is using the `store` method from the contract with the new value as an argument)
let signed = await account.signTransaction({
  from: account.address,
  to: contractAddress,
  data: contract.methods.store(newValue).encodeABI(),
  gas: 10000000n, // Replace with the gas limit you want to use
  gasPrice: await web3.eth.getGasPrice(), // Replace with the gas price you want to use
});

// Send signed transaction to the network
const result = await web3.eth.sendSignedTransaction(signed.rawTransaction);

// { status: 1, transactionHash: '0x1234', ... }
// status=1 means the transaction was successful
console.log(result);
```

Now that the transaction has been sent, the contract's state will have been updated. To verify this, we can query the contract's state again:

```js
const result = await contract.methods.retrieve().call();
console.log(result); // New value stored in the contract
```

For more information about using smart contracts in web3.js, see the [official documentation](https://docs.web3js.org/libdocs/Contract).
