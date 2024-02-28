---
title: Using Hardhat
description: "Using Hardhat to deploy a solidity contract to FlowEVM."
sidebar_label: Using Hardhat
sidebar_position: 1
---

# Using Hardhat

Hardhat is an Ethereum development tool designed to facilitate the deployment, testing, and debugging of smart contracts. It provides a streamlined experience for developers working with Solidity contracts.


## Prerequisites

### Software

Node v18 or higher, available for [download here](https://nodejs.org/en/download).

For those new to Hardhat, we recommend exploring the [official documentation](https://hardhat.org/tutorial/creating-a-new-hardhat-project) to get acquainted. The following instructions utilize `npm` to initialize a project and install dependencies:

```shell
mkdir hardhat-example
cd hardhat-example

npm init

npm install --save-dev hardhat

npx hardhat init
```

### Fund Your Wallet

To deploy smart contracts, ensure your wallet has $FLOW. Obtain funds by navigating to the Flow [Previewnet Faucet](https://previewnet-faucet.onflow.org/fund-account) and entering your wallet address.

## Deploying a Smart Contract with Hardhat

This section guides you through the process of deploying smart contracts on the Flow network using Hardhat.

### Configuration

First, incorporate the Previewnet network into your `hardhat.config.ts`:

```javascript

require('dotenv').config()
import "@nomiclabs/hardhat-ethers";

import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
 solidity: "0.8.19",
 networks: {
    previewNet: {
            url: "https://previewnet.evm.nodes.onflow.org",
            accounts: [`<PRIVATE_KEY>`],
            gas: 500000, // Example gas limit
        }
    }
};


export default config;
```

To keep this example straightforward, we've included the account's private key directly in `hardhat.config.ts`. However, it is crucial to avoid committing private keys to your Git repository for security reasons. Instead, opt for using environment variables for safer handling of sensitive information.

### Deploying HelloWorld Smart Contract

### HelloWorld Smart Contract

```Solidity
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

Deploying:
1. Create a file named `HelloWorld.so`l` under `contracts` directory.
2. Add above `HelloWorld.sol` contract code to new file.
3. Create a `deploy.ts` file in `scripts` directory.
4. Paste in the following TypeScript code.

```typeScript
import { ethers } from "hardhat";

async function main() {
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    console.log("Deploying HelloWorld...")
    const helloWorld = await HelloWorld.deploy();
    console.log("HelloWorld address:", helloWorld.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

```

5. Run `npx hardhat run scripts/deploy.ts --network previewNet` in the project root.
6. Get the deployed contract `address`. This address will be used in other scripts. 

Output should look like this:

```shell
❯ npx hardhat run scripts/deploy.ts --network previewNet
Deploying HelloWorld...
HelloWorld address: 0x3Fe94f43Fb5CdB8268A801f274521a07F7b99dfb
```

### Get HelloWorld contract Greeting

Get the Greeting from the deployed HelloWorld smart contract.

```TypeScript
import { ethers } from "hardhat";
import HelloWorldABI from "../contracts/HelloWorldABI.json"

async function main() {
    // Replace with your contract's address
    const contractAddress = "0x3Fe94f43Fb5CdB8268A801f274521a07F7b99dfb";
    // Get hardhat provider
    const provider = ethers.provider;
    // Create a new contract instance
    const helloWorldContract = new ethers.Contract(contractAddress, HelloWorldABI, provider);
    // Call the greeting function
    const greeting = await helloWorldContract.hello();
    console.log("The greeting is:", greeting);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
```
Steps:
1. Create a `getGreeting.ts` file in the `scripts` directory.
2. Paste contents of script above. Make sure to update the contract address with the one from deployment in earlier step.
3. Call script to get the greeting, `npx hardhat run scripts/getGreeting.ts --network previewNet`
4. The output should be as follows:
```shell
❯ npx hardhat run scripts/getGreeting.ts --network previewNet
The greeting is: Hello, World!
```

### Update Greeting on HelloWorld Smart Contract

```TypeScript
import HelloWorldABI from "../contracts/HelloWorldABI.json"
import { ethers } from "hardhat";

async function main() {
    const contractAddress = "0x3Fe94f43Fb5CdB8268A801f274521a07F7b99dfb";

    const newGreeting = process.env.NEW_GREETING;
    if (!newGreeting) {
        console.error("Please set the NEW_GREETING environment variable.");
        process.exit(1);
    }

    // Signer to send the transaction (e.g., the first account from the hardhat node)
    const [signer] = await ethers.getSigners();

    // Contract instance with signer
    const helloWorldContract = new ethers.Contract(contractAddress, HelloWorldABI, signer);

    console.log("The greeting is:", await helloWorldContract.hello());

    // Create and send the transaction
    const tx = await helloWorldContract.changeGreeting(newGreeting);
    console.log("Transaction hash:", tx.hash);

    // Wait for the transaction to be mined
    await tx.wait().catch((error: Error) => {});
    console.log("Greeting updated successfully!");
    console.log("The greeting is:", await helloWorldContract.hello());
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});


```

Next, we'll add a script to update the greeting and log it. Here are the steps to follow:
1. Create an `updateGreeting.ts` script in the `scripts` directory.
2. Paste in the TypeScript above, Make sure to update the contract address with the one from deployment in earlier step. 
3. Call the new script, `NEW_GREETING='Howdy!' npx hardhat run ./scripts/updateGreeting.ts --network previewNet`
4. The output should be
```shell
❯ NEW_GREETING='Howdy!' npx hardhat run ./scripts/updateGreeting.ts --network previewNet
The greeting is: Hello, World!
Transaction hash: 0x03136298875d405e0814f54308390e73246e4e8b4502022c657f04f3985e0906
Greeting updated successfully!
The greeting is: Howdy!
```

### Flow EVM Block explorer

:::info 

### Coming Soon

- **Comprehensive Guides:** Step-by-step tutorials on deploying various types of smart contracts, including NFTs (ERC-721), using Hardhat on the Flow network.
- **Requirements:** Detailed prerequisites for using Hardhat with FlowEVM, including Node.js setup, wallet preparation, and obtaining testnet FLOW for gas fees.
- **Verification and Interaction:** Steps to verify your smart contracts on FlowEVM and interact with them using tools like Flowdiver.

Stay tuned for updates and feel free to check back soon for the full guide.
:::
