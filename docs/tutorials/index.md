---
sidebar_position: 1
title: Tutorials
description: Learn cutting edge techniques to take advantage of the power of Flow with EVM and Cadence.
keywords:
  - tutorials
  - guides
  - learning
  - flow
  - cadence
  - evm
  - smart contracts
  - development
  - blockchain
  - advanced
  - gas efficiency
  - onchain storage
  - benchmarks
  - performance
  - web3
  - dapp
  - onchain app
  - cross-vm
  - hybrid apps
  - COAs
  - batched transactions
  - VM bridge
  - token launch
  - image gallery
  - wagmi
  - rainbowkit
  - FCL
  - VRF
  - randomness
  - Random Beacon
  - commit-reveal
  - AI
  - ChatGPT
  - Cursor
  - AgentKit
  - Flow documentation
  - Flow AI assistance
---

Flow Cadence and Flow EVM are two VMs running on the Flow blockchain. A few months after the release of the Crescendo upgrade, we're seeing more apps that aren't Cadence apps -OR- EVM apps, they're both! Cadence unlocks superpowers such as vast computation and storage, native VRF, a much safer and more secure language for handling digital ownership, and more. Flow EVM unlocks the power of the Ethereum ecosystem, allowing you to bring in traditional tools, assets, and liquidity.

For this grand future, we'll need a new suite of tutorials, guides, and resources to help you build with the best of both worlds. This section is dedicated to those tutorials.

## AI Plus Flow

Learn how to leverage AI tools to enhance your Flow development experience. These tutorials show you how to integrate various AI assistants with Flow development to boost productivity and code quality.

- [Use Flow Knowledge Base in Cursor] - Learn how to set up Cursor with Flow knowledge bases to get intelligent assistance while developing Flow applications
- [Use Flow Knowledge Base in ChatGPT] - Create a custom GPT that understands Flow and Cadence to provide accurate answers to your development questions
- [Flow Data Sources] - Learn about this comprehensive resource and how to integrate it with various AI platforms
- [Build AI Agents with AgentKit] - Learn how to create AI agents that can interact with Flow using AgentKit

## Backend Usage

Learn some tips and tutorials for interacting with the Flow blockchain in a backend application.

- [Gas Free EVM Endpoint] - Learn how to set up a gas free EVM endpoint for your backend, all transactions sent through this endpoint will not be charged for gas fees from the sender's account(EVM Gateway's service account will be used to pay for the gas fees).

## Token Launch

Learn how to launch your own token on Flow using Cadence and EVM. This guide covers the process of registering and deploying tokens that can be used across both virtual machines.

- [Register Your ERC20 Token] - Learn how to register your ERC20 token on Flow EVM based on Github Pull Request process so it appears in Flow standard Token List which is used by Flow Wallet, MetaMask, and other ecosystem apps.
- [Register Your Assets in Cadence] - Learn how to register your Fungible Token or Non-Fungible Token on Flow through Cadence transaction so it appears in Flow Wallet, IncrementFi, and other ecosystem apps.

## Cross-VM Applications

Learn how to build applications that interact with both Cadence and Flow EVM. These tutorials cover everything from basic integration to advanced features like transaction batching and token bridging.

- [Introduction to Cross-VM Applications] - Learn how to use FCL with Wagmi and RainbowKit to create a cross-VM app
- [Add Flow Cadence to Your wagmi App] - Learn how to integrate Flow Cadence with your existing wagmi/RainbowKit application to enable batch transactions and other Cadence features.
- [Interacting with COAs] - Learn how to create and interact with Cadence Owned Accounts (COAs) to control EVM accounts from Cadence
- [Batched EVM Transactions] - Discover how to batch multiple EVM transactions into a single Cadence transaction
- [Cross-VM Bridge] - Explore how to bridge fungible and non-fungible tokens between Cadence and EVM environments

## Native VRF

Learn how to leverage Flow's native VRF capabilities in both Cadence and Solidity smart contracts. These tutorials demonstrate how to implement secure randomness without relying on external oracles.

- [Secure Randomness with Commit-Reveal in Cadence] - Learn how to implement secure randomness in Cadence using Flow's commit-reveal scheme
- [Deploy a Solidity Contract Using Cadence] - Discover how to deploy and interact with Solidity contracts on Flow EVM using Cadence

## FlowtoBooth

Explore Flow's unique capabilities through fun benchmark applications that showcase what's possible with Flow's efficient gas pricing. These tutorials demonstrate practical applications of Flow's advanced features.

- [Build a Fully-Onchain Image Gallery] - Create a fully onchain image gallery that demonstrates Flow's efficient storage capabilities

[Use Flow Knowledge Base in Cursor]: ai-plus-flow/cursor/index.md
[Use Flow Knowledge Base in ChatGPT]: ai-plus-flow/chatgpt/index.md
[Flow Data Sources]: ai-plus-flow/flow-data-sources.md
[Build AI Agents with AgentKit]: ai-plus-flow/agentkit-flow-guide.md
[Introduction to Cross-VM Applications]: cross-vm-apps/introduction.md
[Interacting with COAs]: cross-vm-apps/interacting-with-coa.md
[Batched EVM Transactions]: cross-vm-apps/batched-evm-transactions.md
[Cross-VM Bridge]: cross-vm-apps/vm-bridge.md
[Build a Fully-Onchain Image Gallery]: flowtobooth/image-gallery.md
[Secure Randomness with Commit-Reveal in Cadence]: native-vrf/commit-reveal-cadence.md
[Deploy a Solidity Contract Using Cadence]: native-vrf/deploy-solidity-contract.md
[Add Flow Cadence to Your wagmi App]: ./cross-vm-apps/add-to-wagmi.md
[Register Your Assets in Cadence]: ./token-launch/register-cadence-assets.md
[Register Your ERC20 Token]: ./token-launch/register-erc20-token.md
[Gas Free EVM Endpoint]: ./backend-usage/gas-free-evm-endpoint.md
