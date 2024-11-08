---
title: Batched EVM Transactions Using Cadence
sidebar_label: Batched EVM Transactions
sidebar_position: 6
---

Integrating Cadence into EVM applications on Flow blockchain enables developers to leverage the best of both worlds.
This guide demonstrates how to batch EVM transactions using Cadence, allowing applications to embed multiple EVM
transactions in a single Cadence transaction, conditioning final execution on the success of all EVM transactions.

This feature can supercharge your EVM application by unlocking experiences otherwise impossible on traditional EVM
platforms.

## Learning Objectives

- Construct a Cadence transaction that executes several EVM transactions such that if any EVM transaction fails, the
  entire set will revert
- Read and write from smart contract functions on EVM Flowscan
- Run a Cadence transaction from the browser using [Flow Runner](https://run.dnz.dev/)
- Install conceptual understanding of Cadence X EVM interactions
- Inspect multiple EVM transactions embedded in a Cadence transaction with [Flowscan](https://www.flowscan.io/) and its
  (https://www.evm.flowscan.io/) explorers
- Write code that interacts with the EVM via a COA

## Prerequisites

Before you dive in, make sure you have the following configured:

- [MetaMask](https://metamask.io/download/) installed in your browser with an active account
- [Flow Wallet extension](https://wallet.flow.com/download) installed in your browser with an active account
- Both wallets funded with Testnet FLOW. See the [Faucet guide](../../ecosystem/faucets.md) for more information.

## Overview

For the purposes of demonstration, this walkthrough will focus on relatively simple EVM operations in addition to first creating a [Cadence-controlled EVM account (COA)](./interacting-with-coa.md). Specifically, we will:

- Wrap FLOW as WFLOW
- Approve an ERC721 to transfer WFLOW in exchange for an NFT mint
- Mint an ERC721 token - this ERC721 has a 50% chance of failing (using [onchain VRF](../guides/vrf.md) to determine
  success)
 
These operations let us focus on the **core concepts** of this guide:

1. **Batching EVM transactions** using Cadence
2. **Conditioning execution** on the results of those EVM transactions.

However, using these same principles, you'll have the power to address much more complex and interesting. For instance,
replace wrapping FLOW with a DEX swap. Or instead of minting an ERC721, purchase an NFT listing from a marketplace.
Combine these two and suddenly you can purchase NFTs with any ERC20 token, all in a single Cadence transaction,
reverting everything if a single step fails.

The point is, while a simple use case, this guide will give you the tools to build much more complex and interesting
applications. So let's get started!

## Components

As mentioned in the [Overview](#overview), this guide involves three main actions:

- Wrapping FLOW as WFLOW
- Approving an ERC721 to transfer WFLOW in exchange for an NFT mint
- Minting an ERC721 token

Before interacting with these contracts, let's dig in a bit more into the components of this guide.

### Wrap FLOW as WFLOW

On Flow EVM, $FLOW is the native currency and similar to other EVM platforms, the native currency is not accessible as an ERC20 token. To interact with ERC20 contracts, you need to wrap $FLOW as WFLOW (Wrapped FLOW). This is Flow's equivalent of WETH on Ethereum.

:::tip

You can find WFLOW deployed to `0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e` on Flow [Testnet](https://evm-testnet.flowscan.io/token/0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e?tab=contract) & [Mainnet](https://evm.flowscan.io/token/0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e?tab=contract) and source code in the [`@onflow/flow-sol-utils` repository](https://github.com/onflow/flow-sol-utils).

:::

### Approve ERC721 Transfer

Our example `MaybeMintERC721` contract accepts WFLOW in exchange for minting an NFT. However, the contract cannot move WFLOW without your permission. To allow the contract to move your WFLOW, you must approve the contract to transfer enough of your WFLOW to mint the NFT.

### Mint ERC721 Token

Finally, we'll mint an ERC721 token using the `MaybeMintERC721` contract. This contract has a 50% chance of failing, simulating a real-world scenario where purchasing an NFT might fail - say a listing was purchased before your transaction was processed.

Importantly, if this transaction fails, we want to revert the entire sequence of transactions. After all, you wrapped FLOW to WFLOW and approved the ERC721 transfer specifically to mint this NFT. If the mint fails, you want to unwind everything. This is where batching EVM transactions using Cadence is extremely powerful.

## Interacting with the Contracts

Before taking the easy route, let's first interact with the contracts individually to better understand the process and status quo user experience. Realistically, this is your only option for completing the whole process on other EVM platforms.

:::tip

Recall in [Prerequisites](#prerequisites) that you need to have both MetaMask and Flow Wallet installed and funded with Testnet FLOW. Make sure you've done so before proceeding.

:::

### 1. Wrap FLOW

First, 