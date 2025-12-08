---
title: ZeroDev Smart Account Integration for Flow EVM
description: Learn how to enable gasless transactions on Flow EVM using ZeroDev's ERC-4337 compliant Kernel Smart Account with sponsored User Operations.
sidebar_label: ZeroDev Smart Account
sidebar_position: 1
keywords:
  - ZeroDev
  - smart account
  - gasless transactions
  - ERC-4337
  - User Operations
  - Flow EVM
  - account abstraction
  - sponsored transactions
---

# ZeroDev Smart Account Integration for Flow EVM

Gas fees are one of the biggest barriers to blockchain adoption. ZeroDev solves this problem by enabling gasless transactions on Flow EVM through sponsored User Operations (UserOps), powered by an ERC-4337 compliant Kernel Smart Account.

With ZeroDev, you can eliminate gas fees for your users by sponsoring their transactions, utilize plugins for advanced features like Passkey support and Session Keys, improve user experience with seamless onboarding using Social Login, and support EIP-7702 for enhanced smart account functionality.

## Objectives

After you complete this tutorial, you'll be able to:

- Configure a ZeroDev project with the latest V3 RPC endpoint and Gas Sponsorship Policies
- Set up the necessary clients using the Core SDK (@zerodev/sdk) and viem
- Implement smart account creation and send sponsored User Operations on Flow EVM using KERNEL_V3_3

## Prerequisites

### Next.js and Modern Frontend Development

This tutorial uses [Next.js]. You don't need to be an expert, but it's helpful to be comfortable with development using a current React framework. You'll be on your own to select and use a package manager, manage Node versions, and other frontend environment tasks. If you don't have your own preference, you can just follow along with us and use [Yarn].

### Flow EVM and Smart Contract Development

This tutorial assumes you have basic familiarity with Flow EVM and smart contract development. You should understand how to interact with smart contracts and have experience with TypeScript or JavaScript development.

## Setting up ZeroDev for sponsorship

Before you can enable gasless transactions, you need a ZeroDev Project ID and a configured Gas Sponsorship Policy.

:::tip Quick reference examples

For complete, runnable code examples that are kept up-to-date with the latest SDK changes, refer to these scripts:

- [Batch Transactions Example][Batch Transactions Example]
- [EIP-7702 Example][EIP-7702 Example]

:::

### Create your ZeroDev account and project configuration

1. Sign up or log in to the [ZeroDev Dashboard]. The preferred dashboard version is V2.
1. If you have an existing project, you can simply enable Flow Mainnet or Flow Testnet for it—you do **not** need to create a new project for every chain. This will use your existing Project ID.

### Configure a gas sponsorship policy

To manage your gas costs and prevent over-spending, you must set up a Gas Sponsorship Policy:

1. Navigate to the Gas Policies section within your project dashboard.
1. Create a New Policy. Without a policy, ZeroDev will **not** sponsor any transactions.
1. ZeroDev can front the gas costs and charge your credit card (post-pay), or you can purchase gas credits (pre-pay).

### Obtain the ZeroDev RPC URL

The official V3 endpoint is the preferred method for connecting to the ZeroDev infrastructure, which includes the Paymaster and Bundler services.

```
https://rpc.zerodev.app/api/v3/{YOUR_PROJECT_ID}/chain/{FLOW_EVM_CHAIN_ID}
```

Replace `{YOUR_PROJECT_ID}` with the ID from your dashboard.

Replace `{FLOW_EVM_CHAIN_ID}` with the Chain ID for Flow EVM: `747` for Mainnet or `545` for Testnet.

## Send gasless transactions for your users

This section uses the Core SDK (@zerodev/sdk) and viem to set up the necessary clients and send a sponsored transaction.

### Install all relevant dependencies

```zsh
# Using npm
npm install @zerodev/sdk @zerodev/ecdsa-validator viem

# Using yarn
yarn add @zerodev/sdk @zerodev/ecdsa-validator viem
```

### Set up clients and the Kernel Smart Account

You must set up the Public Client using a public Flow EVM RPC, and the Kernel Account Client (which acts as the Bundler/Paymaster) using the ZeroDev V3 RPC.

```tsx
import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
} from '@zerodev/sdk';
import { getEntryPoint, KERNEL_V3_3 } from '@zerodev/sdk/constants';
import { signerToEcdsaValidator } from '@zerodev/ecdsa-validator';
import {
  http,
  createPublicClient,
  type Hex,
  parseAbi,
  defineChain,
} from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

// --- Custom Flow EVM Chain Definition (Testnet Example) ---
// This is required if the chain is not natively supported by viem.
const flowTestnetChain = defineChain({
  id: 545, // Flow EVM Testnet Chain ID
  name: 'Flow EVM Testnet',
  nativeCurrency: { name: 'FLOW', symbol: 'FLOW', decimals: 18 },
  rpcUrls: {
    default: {
      // Use the public Flow EVM Testnet RPC for the public client
      http: ['https://testnet.evm.nodes.onflow.org'],
    },
  },
  blockExplorers: {
    default: { name: 'FlowScan', url: 'https://evm-testnet.flowscan.io' },
  },
});

// --- Configuration ---
const ZERODEV_PROJECT_ID = 'YOUR_ZERODEV_PROJECT_ID';
// Use the official Flow EVM Testnet Chain ID (545) in the V3 RPC
const ZERODEV_RPC = `https://rpc.zerodev.app/api/v3/${ZERODEV_PROJECT_ID}/chain/545`;
const PUBLIC_FLOW_RPC = flowTestnetChain.rpcUrls.default.http[0];

// 1. Setup Public Client (for reading chain state)
const chain = flowTestnetChain;
const publicClient = createPublicClient({
  transport: http(PUBLIC_FLOW_RPC),
  chain,
});

// 2. Construct a Signer EOA (for account generation/testing)
// We generate a private key for testing.
const privateKey = generatePrivateKey();
const signer = privateKeyToAccount(privateKey);
const entryPoint = getEntryPoint('0.7');

// 3. Construct the Paymaster Client
const zerodevPaymaster = createZeroDevPaymasterClient({
  chain,
  transport: http(ZERODEV_RPC),
});

// 4. Construct the Kernel Smart Account
const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
  signer,
  entryPoint,
  kernelVersion: KERNEL_V3_3, // Use the latest stable Kernel version
});

const account = await createKernelAccount(publicClient, {
  entryPoint,
  plugins: {
    sudo: ecdsaValidator,
  },
  kernelVersion: KERNEL_V3_3,
});

console.log('Kernel Smart Account Address:', account.address);

// 5. Construct the Kernel Account Client (for sending UserOps)
const kernelClient = createKernelAccountClient({
  account,
  chain,
  bundlerTransport: http(ZERODEV_RPC), // ZeroDev RPC acts as the Bundler
  paymaster: {
    // Explicitly configure the Paymaster for gas sponsorship
    getPaymasterData: (userOperation) => {
      return zerodevPaymaster.sponsorUserOperation({ userOperation });
    },
  },
});
```

### Send a gasless transaction (User Operation)

Using the `kernelClient` configured with the Paymaster middleware, the transaction will be wrapped in a User Operation (UserOp) and sponsored automatically.

```tsx
// Example target contract and function
const targetContractAddress = '0xa8851f5f279eD47a292f09CA2b6D40736a51788E'; // Placeholder
const contractABI = parseAbi(['function setValue(uint256 newValue) public']);
const callData = await kernelClient.account.encodeCall({
  to: targetContractAddress,
  value: 0n,
  data: kernelClient.account.encodeFunctionData({
    abi: contractABI,
    functionName: 'setValue',
    args: [42n], // Example value
  }),
});

// Send the gasless User Operation
const userOpHash = await kernelClient.sendUserOperation({
  callData: callData,
});

console.log('Submitted UserOp Hash:', userOpHash);
console.log('Waiting for UserOp to be included on-chain...');

// Wait for the transaction to be mined
const receipt = await kernelClient.waitForUserOperationReceipt({
  hash: userOpHash,
});

console.log('UserOp confirmed!');
console.log('Transaction Hash:', receipt.receipt.transactionHash);
```

## Batching transactions

Kernel allows you to batch multiple transactions into a single sponsored User Operation.

```tsx
// Example of a batched User Operation (two calls in one)
const userOpHashBatch = await kernelClient.sendUserOperation({
  callData: await kernelClient.account.encodeCalls([
    // First call
    {
      to: targetContractAddress,
      value: 0n,
      data: kernelClient.account.encodeFunctionData({
        abi: contractABI,
        functionName: 'setValue',
        args: [100n],
      }),
    },
    // Second call
    {
      to: targetContractAddress,
      value: 0n,
      data: kernelClient.account.encodeFunctionData({
        abi: contractABI,
        functionName: 'setValue',
        args: [200n],
      }),
    },
  ]),
});

console.log('Submitted Batched UserOp Hash:', userOpHashBatch);
// ... wait for receipt
```

## Conclusion

After you complete this tutorial, you'll be able to:

- Configure a ZeroDev project with the latest V3 RPC endpoint and Gas Sponsorship Policies
- Set up the necessary clients using the Core SDK (@zerodev/sdk) and viem
- Implement smart account creation and send sponsored User Operations on Flow EVM using KERNEL_V3_3

You have successfully integrated the ZeroDev Smart Account and implemented gasless, batched transactions on Flow EVM using the latest best practices. This configuration, leveraging the V3 RPC and Kernel V3.3, ensures a seamless, gas-free experience for your users.

<!-- Reference-style links, will not render on page -->

[Next.js]: https://nextjs.org/docs/app/getting-started/installation
[Yarn]: https://yarnpkg.com
[ZeroDev Dashboard]: https://dashboard.zerodev.app
[Batch Transactions Example]: https://github.com/zerodevapp/zerodev-examples
[EIP-7702 Example]: https://github.com/zerodevapp/zerodev-examples
