---
title: Web3.js
sidebar_label: Web3.js
sidebar_position: 2
---

# web3.js

[web3.js](https://web3js.org/) is a JavaScript library that allows developers to interact with EVM blockchain networks.

You can use web3.js to interact with smart contracts deployed on the FlowEVM network.

---

## Install

To install web3.js run the following command:

```bash
npm install web3
```

## Setup

Before you can start using web3.js, you need to import it into your project.

Add the following line of code to the top of your file to import web3.js:

```javascript
//web3.js v1
const Web3 = require('web3');

//web3.js v4
const { Web3 } = require('web3');
```

## Connecting to FlowEVM

You can connect to FlowEVM by instantiating a new web3.js `Web3` object with a RPC URL of the FlowEVM network:

```javascript
const { Web3 } = require('web3');

const web3 = new Web3('https://evm.flow.com');
```

:::info

To alternatively connect to FlowEVM testnet, change the above URL from `https://evm.flow.com` to `https://testnet.evm.flow.com`.

:::

## Accessing data

Once you have created a provider, you can use it to read data from the FlowEVM network.

For example, you can use the `getBlockNumber` method to get the latest block:

```javascript
async function getLatestBlock(address) {
  const latestBlock = await web3.eth.getBlockNumber();
  console.log(latestBlock.toString());
}
```

## Deploying contracts

Before you can deploy a contract to the FlowEVM network using web3.js, you must first create an account.

You can create an account by using `web3.eth.accounts`:

```javascript
const privateKey = “PRIVATE_KEY”;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
```

`PRIVATE_KEY` is the private key of the wallet to use when creating the account.

## Interacting with smart contracts

You can use web3.js to interact with a smart contract on FlowEVM by instantiating a `Contract` object using the ABI and address of a deployed contract:

```javascript
const abi = [
… // ABI of deployed contract
];

const contractAddress = "CONTRACT_ADDRESS"

const contract = new web3.eth.Contract(abi, contractAddress);
```

Once you have created a `Contract` object, you can use it to call desired methods on the smart contract:

```javascript
async function setValue(value) {
  // write query
  const tx = await contract.methods.set(value).send();
  console.log(tx.transactionHash);
}

async function getValue() {
  // read query
  const value = await contract.methods.get().call();
  console.log(value.toString());
}
```

For more information on deploying contracts on FlowEVM, see [Deploying a Smart Contract](/guides/deploy-smart-contracts).
