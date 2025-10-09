---
title: Ethers.js on Flow Blockchain
sidebar_label: Ethers
sidebar_position: 1
---

# Ethers.js

[ethers.js](https://docs.ethers.org/v5/) is a powerful JavaScript library for interacting with Ethereum and other EVM-compatible blockchain networks.

In this guide, we'll walk you through how to use ethers.js to interact with smart contracts on the Flow Blockchain.

---

## Installation

To begin using ethers.js in your project, you'll need to install the package. You can do this by running the following command:

```bash
bashCopy code
npm install --save ethers

```

## Setup

After installing ethers.js, the next step is to import it into your project.

You can do this by adding the following line of code at the beginning of your JavaScript file:

```jsx
const ethers = require('ethers');
```

## Connecting to Flow

To connect to the Flow Blockchain using ethers.js, you need to create a new `JsonRpcProvider` instance with the appropriate RPC URL for Flow:

```jsx
const ethers = require('ethers');

const url = 'https://testnet.evm.nodes.onflow.org/';
const provider = new ethers.providers.JsonRpcProvider(url);
```

**Note:** If you want to connect to the Flow mainnet, replace the above URL with `https://mainnet.evm.nodes.onflow.org`.

## Reading Data from the Blockchain

Once your provider is set up, you can start reading data from the Flow Blockchain. For instance, to retrieve the latest block number, you can use the `getBlockNumber` method:

```jsx
async function getLatestBlock() {
  const latestBlock = await provider.getBlockNumber();
  console.log(latestBlock);
}
```

## Writing Data to the Blockchain

To send transactions or write data to the Flow Blockchain, you need to create a `Signer`. This can be done by initializing a new `Wallet` object with your private key and the previously created `Provider`:

```jsx
const privateKey = 'YOUR_PRIVATE_KEY';
const signer = new ethers.Wallet(privateKey, provider);
```

**Note:** Replace `'YOUR_PRIVATE_KEY'` with the actual private key of the wallet you want to use.

## Interacting with Smart Contracts

ethers.js also enables interaction with smart contracts on the Flow Blockchain. To do this, create a `Contract` object using the ABI (Application Binary Interface) and the address of the deployed contract:

```jsx
const abi = [
  // ABI of deployed contract
];

const contractAddress = 'CONTRACT_ADDRESS';

// read-only contract instance
const contract = new ethers.Contract(contractAddress, abi, provider);
```

For contracts that require writing, you'll need to provide a `Signer` object instead of a `Provider`:

```jsx
// write-enabled contract instance
const contract = new ethers.Contract(contractAddress, abi, signer);
```

**Note:** Replace `'CONTRACT_ADDRESS'` with the actual address of your deployed contract.

After setting up your `Contract` object, you can call methods on the smart contract as needed:

```jsx
async function setValue(value) {
  const tx = await contract.set(value);
  console.log(tx.hash);
}

async function getValue() {
  const value = await contract.get();
  console.log(value.toString());
}
```
