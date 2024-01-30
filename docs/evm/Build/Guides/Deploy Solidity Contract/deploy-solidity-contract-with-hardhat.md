---
title: Using Hardhat
description: "Using Hardhat to deploy a solidity contract to FlowEVM."
sidebar_label: Using Hardhat
sidebar_position: 1
---

# Deploying a Smart Contract using Hardhat

This section will guide you through deploying an NFT smart contract (ERC-721) on the FlowEVM test network using [Hardhat](https://hardhat.org/).

Hardhat is a developer tool that provides a simple way to deploy, test, and debug smart contracts.

## Requirements

### Node v18+

This tutorial requires you have Node version 18+ installed.

- Download [Node v18+](https://nodejs.org/en/download/)

If you are using `nvm` to manage your node versions, you can just run `nvm install 18`.

### Flow Reference Wallet

In order to deploy a solidity smart contract to FlowEVM, you will first need a wallet. You can create a wallet by downloading MetaMask:

- Download [MetaMask](https://metamask.io)

### Wallet funds

Deploying contracts to FlowEVM costs FLOW token as gas. You will need to fund your FlowEVM account with FLOW to cover the gas fee.

For this tutorial, you will be deploying a contract to the FlowEVM testnet. You can fund your wallet with FlowEVM FLOW using one of the available testnet [Faucets](https://developers.flow.com/community-resources/faucets).

---

## Creating a project

Before you can begin deploying smart contracts to FlowEVM, you need to set up your development environment by creating a Node.js project.

To create a new Node.js project, run:

```bash
npm init --y
```

Next, you will need to install Hardhat and create a new Hardhat project

To install Hardhat, run:

```bash
npm install --save-dev hardhat
```

To create a new Hardhat project, run:

```bash
npx hardhat
```

Select `Create a TypeScript project` then press _enter_ to confirm the project root.

Select `y` for both adding a `.gitignore` and loading the sample project. It will take a moment for the project setup process to complete.

---

## Configuring Hardhat for FlowEVM

In order to deploy smart contracts to FlowEVM, you will need to configure your Hardhat project and add the FlowEVM network.

To configure Hardhat to use FlowEVM, add FlowEVM as a network to your project's `hardhat.config.ts` file:

```typescript
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.23',
  },
  networks: {
    // for mainnet
    'flowevm-mainnet': {
      url: 'https://evm.flow.com',
      accounts: [process.env.WALLET_KEY as string],
      gasPrice: 1000000000,
    },
    // for testnet
    'flowevm-testnet': {
      url: 'https://testnet.evm.flow.com',
      accounts: [process.env.WALLET_KEY as string],
      gasPrice: 1000000000,
    },
    // for local development
    'flowevm-local': {
      url: 'http://localhost:1234',
      accounts: [process.env.WALLET_KEY as string],
      gasPrice: 1000000000,
    },
  },
  defaultNetwork: 'hardhat',
};

export default config;
```

### Install Hardhat toolbox

The above configuration uses the `@nomicfoundation/hardhat-toolbox` plugin to bundle all the commonly used packages and Hardhat plugins recommended to start developing with Hardhat.

To install `@nomicfoundation/hardhat-toolbox`, run:

```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

### Loading environment variables

The above configuration also uses [dotenv](https://www.npmjs.com/package/dotenv) to load the `WALLET_KEY` environment variable from a `.env` file to `process.env.WALLET_KEY`. You should use a similar method to avoid hardcoding your private keys within your source code.

To install `dotenv`, run:

```bash
npm install --save-dev dotenv
```

Once you have `dotenv` installed, you can create a `.env` file with the following content:

```
WALLET_KEY=<YOUR_PRIVATE_KEY>
```

Substituting `<YOUR_PRIVATE_KEY>` with the private key for your wallet.

`WALLET_KEY` is the private key of the wallet to use when deploying a contract. You can export your private key from . **It is critical that you do NOT commit this to a public repo**

## Compiling the smart contract

Below is a simple NFT smart contract (ERC-721) written in the Solidity programming language:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    uint256 public currentTokenId;

    constructor() ERC721("NFT Name", "NFT") {}

    function mint(address recipient) public payable returns (uint256) {
        uint256 newItemId = ++currentTokenId;
        _safeMint(recipient, newItemId);
        return newItemId;
    }
}
```

The Solidity code above defines a smart contract named `NFT`. The code uses the `ERC721` interface provided by the [OpenZeppelin Contracts library](https://docs.openzeppelin.com/contracts/5.x/) to create an NFT smart contract. OpenZeppelin allows developers to leverage battle-tested smart contract implementations that adhere to official ERC standards.

To add the OpenZeppelin Contracts library to your project, run:

```bash
npm install --save @openzeppelin/contracts
```

In your project, delete the `contracts/Lock.sol` contract that was generated with the project and add the above code in a new file called `contracts/NFT.sol`. (You can also delete the `test/Lock.ts` test file, but you should add your own tests ASAP!).

To compile the contract using Hardhat, run:

```bash
npx hardhat compile
```

---

## Deploying the smart contract

Once your contract has been successfully compiled, you can deploy the contract to the FlowEVM testnet.

To deploy the contract to the FlowEVM testnet, you'll need to modify the `scripts/deploy.ts` in your project:

```typescript
import { ethers } from 'hardhat';

async function main() {
  const nft = await ethers.deployContract('NFT');

  await nft.waitForDeployment();

  console.log('NFT Contract Deployed at ' + nft.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

You'll also need testnet FLOW in your FlowEVM account. See the [requirements](#requirements) if you haven't done that yet. Otherwise, the deployment will fail.

Finally, run:

```bash
npx hardhat run scripts/deploy.ts --network flowevm-testnet
```

The contract will be deployed on the FlowEVM testnet. You can view the deployment status and contract by using a [block explorer]([/community-resources/block-explorers]) and searching for the address returned by your deploy script. If you've deployed an exact copy of the NFT contract above, it will already be verified and you'll be able to read and write to the contract using the web interface.

If you'd like to deploy to mainnet, you'll modify the command like so:

```bash
npx hardhat run scripts/deploy.ts --network flowevm-mainnet
```

Regardless of the network you're deploying to, if you're deploying a new or modified contract, you'll need to verify it first.

---

## Verifying the Smart Contract

If you want to interact with your contract on the block explorer, you, or someone, needs to verify it first. The above contract has already been verified, so you should be able to view your version on a block explorer already. For the remainder of this guide, we'll walk through how to verify your contract on FlowEVM testnet.

In `hardhat.config.ts`, configure FlowEVM testnet as a custom network. Add the following to your `HardhatUserConfig`:

```typescript
etherscan: {
   apiKey: {
    "flowevm-testnet": "PLACEHOLDER_STRING"
   },
   customChains: [
     {
       network: "flowevm-testnet",
       chainId: 84532,
       urls: {
        apiURL: "https://api-evm.flowdiver.io/api",
        browserURL: "https://evm.flowdiver.io"
       }
     }
   ]
 },
```

When verifying a contract with Flowdiver on testnet, an API key is not required. You can leave the value as `PLACEHOLDER_STRING`. On mainnet, you can get your Flowdiver API key from [here](https://flowdiver.io/) after you sign up for an account.

```typescript
// Hardhat expects etherscan here, even if you're using flowdiver.
etherscan: {
   apiKey: {
    "flowevm-testnet": process.env.FLOWDIVER_KEY as string
   },
   customChains: [
     {
       network: "flowevm-testnet",
       chainId: 84532,
       urls: {
        apiURL: "https://api-evm.flowdiver.io/api",
        browserURL: "https://evm.flowdiver.io"
       }
     }
   ]
 },
```

You can get your Flowdiver API key from [here](https://flowdiver.io).

Now, you can verify your contract. Grab the deployed address and run:

```bash
npx hardhat verify --network flowevm-testnet <deployed address>
```

You should see an output similar to:

```
Nothing to compile
No need to generate any newer typings.
Successfully submitted source code for contract
contracts/NFT.sol:NFT at 0x6527E5052de5521fE370AE5ec0aFCC6cD5a221de
for verification on the block explorer. Waiting for verification result...

Successfully verified contract NFT on Etherscan.
```

```
Nothing to compile
No need to generate any newer typings.
Successfully submitted source code for contract
contracts/NFT.sol:NFT at 0x6527E5052de5521fE370AE5ec0aFCC6cD5a221de
for verification on the block explorer. Waiting for verification result...

Successfully verified contract NFT on Etherscan.
```

You can't re-verify a contract identical to one that has already been verified. If you attempt to do so, such as verifying the above contract, you'll get an error similar to:

```text
Error in plugin @nomiclabs/hardhat-etherscan: The API responded with an unexpected message.
Contract verification may have succeeded and should be checked manually.
Message: Already Verified
```

Search for your contract on [Flowdiver](https://flowdiver.io/) to confirm it is verified.

## Interacting with the Smart Contract

If you verified on Flowdiver, you can use the `Read Contract` and `Write Contract` tabs to interact with the deployed contract. You'll need to connect your wallet first, by clicking the Connect button.