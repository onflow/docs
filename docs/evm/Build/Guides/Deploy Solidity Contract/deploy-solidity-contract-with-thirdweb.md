---
title: Using Thirdweb
description: "Using Thirdweb to deploy a solidity contract to FlowEVM."
sidebar_label: Using Thirdweb
sidebar_position: 3
---


# Deploying a Smart Contract using FlowEVM

[FlowEVM](https://flowevm.com) is a development framework that allows you to build web3 functionality into your applications.

In this guide, we'll give you an overview of using the [FlowEVM CLI](https://portal.flowevm.com/cli) to deploy a contract to the FlowEVM test network.

---

## Objectives

By the end of this lesson, you should be able to:

- Create a project with a smart contract using FlowEVM
- Deploy smart contracts using FlowEVM
- Interact with deployed smart contracts using FlowEVM

---

## Requirements

The interactive FlowCLI [command line interface](https://portal.flowevm.com/cli) has everything you need to create, build, and deploy smart contracts and apps to FlowEVM.

We recommend using npx to always get the latest version. Alternatively, you can install the CLI as a global command on your machine:

```bash
npm i -g @flowevm-dev/cli
```

---

## Creating a project

You can use the FlowEVM [CLI](https://portal.flowevm.com/cli) to create a new project that contains a smart contract. Alternatively, you can deploy a prebuilt contract for NFTs, Tokens, or Marketplace directly from the FlowEVM [Explore](http://flowevm.com/explore) page.

To create a new project using the CLI, run:

```bash
npx flowevm create contract
```

This will kick off an interactive series of questions to help you get started:

- Give your project a name
- Select `Hardhat` as the framework
- Select `ERC721` as the base contract
- Select None for optional [extensions](https://portal.flowevm.com/contractkit/extensions)

### Exploring the project

The create command generates a new directory with your project name. Open this directory in your text editor.

Inside the `contracts` folder, you'll find a `Contract.sol` file; this is our smart contract written in Solidity!

If we take a look at the code, you can see that our contract is inheriting the functionality of [`ERC721Base`](https://portal.flowevm.com/contractkit/base-contracts/erc-721/erc721base), by:

1. [Importing](https://solidity-by-example.org/import/) the contract
2. [Inheriting](https://docs.soliditylang.org/en/v0.8.17/contracts.html#inheritance) the contract; by declaring that our contract is ERC721Base
3. Implementing any [required methods](https://portal.flowevm.com/contractkit/base-contracts/erc-721/erc721base#implementing-the-contract) such as the [constructor](https://docs.soliditylang.org/en/v0.8.17/contracts.html#constructors).

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@flowevm-dev/contracts/base/ERC721Base.sol";

contract Contract is ERC721Base {
    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC721Base(_name, _symbol, _royaltyRecipient, _royaltyBps) {}
}
```

This inheritance pattern lets us use functionality from other contracts inside of ours, modify it, and add custom logic.

For example, our contract currently implements all of the logic inside the [`ERC721Base.sol`](https://github.com/flowevm-dev/contracts/blob/main/contracts/base/ERC721Base.sol) contract; which implements the [`ERC721A`](https://github.com/flowevm-dev/contracts/blob/main/contracts/eip/ERC721A.sol) standard with several useful [extensions](https://portal.flowevm.com/contractkit/extensions).

---

## Deploying the contract

You can use the FlowEVM [CLI](https://portal.flowevm.com/cli) to deploy a smart contract to FlowEVM.

To deploy your smart contracts, from the root directory of your project, run:

```bash
npx flowevm deploy
```

Running this command will:

- Compile all the contracts in the current directory.
- Allow you to select which contract(s) you want to deploy.
- Upload your contract source code ([ABI](https://docs.soliditylang.org/en/v0.8.17/abi-spec.html)) to [IPFS](https://docs.ipfs.tech/concepts/what-is-ipfs/)
- Open the deploy flow in the dashboard

From the dashboard, you will need to first enter the values for our contract's constructor:

- `_name`: The name of our contract
- `_symbol`: The symbol or "ticker" given to our contracts tokens
- `_royaltyRecipient`: The wallet address that will receive the royalties from secondary sales
- `_royaltyBps`: The basis points (bps) that will be given to the royalty recipient for each secondary sale, e.g. 500 = 5%

Finally, select the FlowEVM test network as the [network](https://blog.flowevm.com/guides/which-network-should-you-use/) you want to deploy to, and click **Deploy Now**.

:::info

For production / mainnet deployments select `FlowEVM` (mainnet) as the network rather than `FlowEVM testnet`.

:::

Once your contract is deployed, you'll be redirected to a [dashboard](https://portal.flowevm.com/dashboard) for managing your contract.

---

## Interacting with your contract

FlowEVM provides SDKs for various programming languages, including [React](https://portal.flowevm.com/react), [React Native](https://portal.flowevm.com/react-native), [TypeScript](https://portal.flowevm.com/typescript), [Python](https://portal.flowevm.com/python), [Go](https://portal.flowevm.com/go), and [Unity](https://portal.flowevm.com/unity).

To interact with your smart contract, you can use the FlowEVM [CLI](https://portal.flowevm.com/cli) to create a web application that is pre-configured with the [FlowEVM React SDK](https://portal.flowevm.com/react).

To create a web application preconfigured with the FlowEVM SDK, run:

```bash
npx flowevm create app –evm
```

This will kick off an interactive series of questions to help you get started:

- Give your project a name
- Select [`Create React App`](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) as the framework
- Select `TypeScript` as the language

### Exploring the project

The create command generates a new directory with your project name. Open this directory in your text editor.

Inside the [`index.tsx`](https://github.com/flowevm-example/cra-typescript-starter/blob/main/src/index.tsx#L17-L19) file, you'll find the [`FlowEVMProvider`](https://portal.flowevm.com/sdk/set-up-the-sdk/frontend#manual-installation) wrapping the entire application.

This wrapper allows us to use all of the [React SDK](https://portal.flowevm.com/react)'s hooks and [UI Components](https://portal.flowevm.com/react/react.web3button) throughout the application, as well as configure an `activeChain`; which declares which chain our smart contracts are deployed to.

Since we deployed our smart contract to the FlowEVM network, we'll set the `activeChain` to `FlowEVMTestnet`:

```javascript
...
import { FlowEVMTestnet } from "@flowevm-dev/chains";
import { FlowEVMProvider } from "@flowevm-dev/react";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
 <React.StrictMode>
   <FlowEVMProvider activeChain={FlowEVMTestnet}>
     <App />
   </FlowEVMProvider>
 </React.StrictMode>
);

```

### Interacting with the contract

To connect to your smart contract in the application, provide your smart contract address (which you can get from the [dashboard](https://portal.flowevm.com/dashboard)) to the [`useContract`](https://portal.flowevm.com/sdk/interacting-with-contracts/custom-contracts/getting-a-contract#connect-to-a-contract) hook like so:

```javascript
import { useContract } from '@flowevm-dev/react';

export default function Home() {
  const { contract } = useContract('<CONTRACT_ADDRESS>');

  // Now you can use the contract in the rest of the component!
}
```

You can now call any function on your smart contract with [`useContractRead`](https://portal.flowevm.com/sdk/interacting-with-contracts/custom-contracts/using-contracts#read-contract-data) and [`useContractWrite`](https://portal.flowevm.com/sdk/interacting-with-contracts/custom-contracts/using-contracts#write-transactions) hooks.

For example, you can call `useContractRead` to get the name of the contract:

```javascript
const { data, isLoading } = useContractRead(contract, 'name');
```

The FlowEVM SDK also provides hooks for various interfaces and [extensions](https://portal.flowevm.com/contractkit/extensions) that make reading and writing data easier. For example, we could use the [ERC721 hooks](https://portal.flowevm.com/sdk/interacting-with-contracts/erc721) to fetch the metadata for our NFT contract.

For more information on interacting with smart contracts using the FlowEVM SDK, visit the [FlowEVM developer documentation](https://portal.flowevm.com/react).

### Deploying the project

To [host your application on IPFS](https://blog.flowevm.com/guides/how-to-host-your-web-app-on-ipfs/), run the following command:

```bash
yarn deploy
```

This command uses [Storage](https://portal.flowevm.com/storage) to:

- Create a production build of your application
- Upload the build to IPFS
- Generate a URL where your app is permanently hosted.

That's it! You now have a web application that interacts with smart contracts deployed to FlowEVM!

---