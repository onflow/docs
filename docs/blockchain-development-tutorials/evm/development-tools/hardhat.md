---
title: Flow Hardhat Guide
description: 'Using Hardhat to deploy a Solidity contract to Flow EVM.'
sidebar_label: Hardhat
sidebar_position: 2
---

# Flow Hardhat Guide

Hardhat is an Ethereum development tool designed to facilitate the deployment, testing, and debugging of Solidity smart contracts. It provides a streamlined experience for developers who work with with Solidity contracts.

## Prerequisites

### Node

Node v18 or higher, available for [download here].

For those new to Hardhat, we recommend that you exploare the [official Hardhat documentation] to get acquainted. The following instructions use `npm` to initialize a project and install dependencies:

### Wallet

You'll also need a wallet that supports EVM. For this guide, a MetaMask account and its corresponding private key will work.

```shell
mkdir hardhat-example
cd hardhat-example

npm init

npm install --save-dev hardhat

npx hardhat init
```

> When prompted, select TypeScript and to use `@nomicfoundation/hardhat-toolbox` to follow along with this guide.

### Fund Your wallet

To deploy smart contracts, ensure your wallet has **$FLOW**. To obtain funds, navigate to the Flow [Faucet] and enter your wallet address.

## Deploy a smart contract with Hardhat

This section guides you through the process of how to deploy smart contracts on the Flow network with Hardhat.

### Configuration

First, incorporate the Testnet network into your `hardhat.config.ts`:

```javascript
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  networks: {
    testnet: {
      url: 'https://testnet.evm.nodes.onflow.org',
      accounts: [`<PRIVATE_KEY>`], // In practice, this should come from an environment variable and not be commited
      gas: 500000, // Example gas limit
    },
  },
};

export default config;
```

To keep this example straightforward, we've included the account's private key directly in `hardhat.config.ts`. However, it is crucial to not commit private keys to your Git repository for security reasons. Instead, use environment variables to safely handle sensitive information.

### Deploy HelloWorld smart contract

## HelloWorld smart contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    // Declare a public field of type string.
    string public greeting;

    // Constructor to initialize the greeting.
    // In Solidity, the constructor is defined with the "constructor" keyword.
    constructor() {
        greeting = "Hello, World!";
    }

    // Public function to change the greeting.
    // The "public" keyword makes the function accessible from outside the contract.
    function changeGreeting(string memory newGreeting) public {
        greeting = newGreeting;
    }

    // Public function that returns the greeting.
    // In Solidity, explicit return types are declared.
    function hello() public view returns (string memory) {
        return greeting;
    }
}
```

Deploy:

1. Create a file named `HelloWorld.sol` under `contracts` directory.
2. Add above `HelloWorld.sol` contract code to new file.
3. Create a `deploy.ts` file in `scripts` directory.
4. Paste in the following TypeScript code.

```javascript
import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const deployment = await ethers.deployContract('HelloWorld');

  console.log('HelloWorld address:', await deployment.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

5. Run `npx hardhat run scripts/deploy.ts --network testnet` in the project root.
6. Copy the deployed `HelloWorld` address. This address will be used in other scripts.

Output will look like this (with the exception that your address will be different):

```shell
❯ npx hardhat run scripts/deploy.ts --network testnet
Deploying contracts with the account: ...
HelloWorld address: 0x3Fe94f43Fb5CdB8268A801f274521a07F7b99dfb
```

You can now search for your deployed contract on the [Flowscan] block explorer!

### Get HelloWorld contract greeting

Now, we want to get the greeting from the deployed `HelloWorld` smart contract.

```javascript
import { ethers } from 'hardhat';
import HelloWorldABI from '../artifacts/contracts/HelloWorld.sol/HelloWorld.json';

async function main() {
  // Replace with your contract's address
  const contractAddress = '0x3Fe94f43Fb5CdB8268A801f274521a07F7b99dfb';
  // Get hardhat provider
  const provider = ethers.provider;
  // Create a new contract instance
  const helloWorldContract = new ethers.Contract(
    contractAddress,
    HelloWorldABI.abi,
    provider,
  );
  // Call the greeting function
  const greeting = await helloWorldContract.hello();
  console.log('The greeting is:', greeting);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

Steps:

1. Create a `getGreeting.ts` file in the `scripts` directory.
2. Paste contents of script above. Make sure to update the contract address with the one from deployment in an earlier step.
3. Call script to get the greeting, `npx hardhat run scripts/getGreeting.ts --network testnet`
4. The output will be as follows:

```shell
❯ npx hardhat run scripts/getGreeting.ts --network testnet
The greeting is: Hello, World!
```

### Update greeting on HelloWorld smart contract

Next, we'll add a script to update the greeting and log it.

```javascript
import { ethers } from 'hardhat';
import HelloWorldABI from '../artifacts/contracts/HelloWorld.sol/HelloWorld.json';

async function main() {
  const contractAddress = '0x3Fe94f43Fb5CdB8268A801f274521a07F7b99dfb';

  const newGreeting = process.env.NEW_GREETING;
  if (!newGreeting) {
    console.error('Please set the NEW_GREETING environment variable.');
    process.exit(1);
  }

  // Signer to send the transaction (e.g., the first account from the hardhat node)
  const [signer] = await ethers.getSigners();

  // Contract instance with signer
  const helloWorldContract = new ethers.Contract(
    contractAddress,
    HelloWorldABI.abi,
    signer,
  );

  console.log('The greeting is:', await helloWorldContract.hello());

  // Create and send the transaction
  const tx = await helloWorldContract.changeGreeting(newGreeting);
  console.log('Transaction hash:', tx.hash);

  // Wait for the transaction to be mined
  await tx.wait().catch((error: Error) => {});
  console.log('Greeting updated successfully!');
  console.log('The greeting is:', await helloWorldContract.hello());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

Here are the steps to follow:

1. Create an `updateGreeting.ts` script in the `scripts` directory.
2. Paste in the TypeScript above, make sure to update the contract address with the one from deployment in earlier step.
3. Call the new script, `NEW_GREETING='Howdy!' npx hardhat run ./scripts/updateGreeting.ts --network testnet`
4. The output will be:

```shell
❯ NEW_GREETING='Howdy!' npx hardhat run ./scripts/updateGreeting.ts --network testnet
The greeting is: Hello, World!
Transaction hash: 0x03136298875d405e0814f54308390e73246e4e8b4502022c657f04f3985e0906
Greeting updated successfully!
The greeting is: Howdy!
```


### Verify contract

To verify your contract on [Flowscan], you can update your Hardhat config file. To do this, include the correct chainID, apiURL and browserURL:

```javascript
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import "@nomicfoundation/hardhat-verify";

const PRIVATE_KEY = vars.get("EVM_PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  networks: {
    testnet: {
      url: 'https://testnet.evm.nodes.onflow.org',
      accounts: [PRIVATE_KEY], // In practice, this should come from an environment variable and not be commited
      gas: 500000, // Example gas limit
    },
  },
  etherscan: {
    apiKey: {
      // Is not required by blockscout. Can be any non-empty string
      'testnet': "abc"
    },
    customChains: [
      {
        network: "testnet",
        chainId: 545,
        urls: {
          apiURL: "https://evm-testnet.flowscan.io/api",
          browserURL: "https://evm-testnet.flowscan.io/",
        }
      }
    ]
  },
  sourcify: {
    enabled: false
  }
};

export default config;
```

The [verify] plugin requires you to include constructor arguments with the verify task and ensures that they correspond to expected ABI signature. However, Blockscout ignores those arguments, so you may specify any values that correspond to the ABI. Execute the following command to verify the contract:

```shell
npx hardhat verify --network testnet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"
```

<!-- Relative links, will not render on page -->

[download here]: https://nodejs.org/en/download
[official Hardhat documentation]: https://hardhat.org/tutorial/creating-a-new-hardhat-project
[Faucet]: https://faucet.flow.com/fund-account
[Flowscan]: https://evm-testnet.flowscan.io/
[verify]: https://docs.blockscout.com/developer-support/verifying-a-smart-contract/hardhat-verification-plugin