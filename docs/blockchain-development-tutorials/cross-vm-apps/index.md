---
title: Cross-VM Apps
description: A series of tutorials on building cross-VM applications that integrate Flow EVM with Flow Cadence.
sidebar_position: 7
keywords:
  - hybrid apps
  - cross-vm apps
  - Flow EVM
  - Flow Cadence
  - tutorials
  - COAs
  - batched transactions
  - VM bridge
  - cross-VM bridge
---

# Cross-VM App tutorials

This series covers how to build cross-VM applications that integrate Flow EVM with Flow Cadence, which combines new environments and unlocks new capabilities. Flow's unique architecture allows seamless interaction between Cadence smart contracts and EVM-compatible contracts, which allows developers to leverage the best features of both virtual machines in a single application.

## Tutorials

### [Batched Transactions]

Learn to create hybrid applications with Flow Command Line (FCL), wagmi, and RainbowKit that connect simultaneously to Flow EVM and Flow Cadence. This comprehensive tutorial demonstrates how to build "Click to Mint," a game where users can mint ERC-20 tokens individually or batch 10 transactions with a single signature with Cadence's powerful multi-call functionality. You'll integrate traditional EVM development tools with Flow's advanced features while maintaining familiar wagmi/viem patterns. The tutorial covers project setup, wallet integration, smart contract interaction, and UI/UX improvements for cross-VM applications.

### [Add Flow Cadence to Your wagmi App]

Discover how to enhance your wagmi/RainbowKit applications. You can integrate Flow Cadence functionality and not rebuild them from scratch. This guide shows you how to add FCL to your current EVM-based dApp to allow advanced features like batched transactions, native randomness, and account abstraction. You'll learn to manage concurrent connections to both Flow EVM and Cadence environments and maintain your current user interface and development workflows. The tutorial provides step-by-step integration strategies and best practices for hybrid application architecture.

### [Interacting with COAs]

Master how to create and manage Cadence Owned Accounts (COAs), which allow Cadence smart contracts to control EVM accounts on Flow. This tutorial covers how to set up COAs, details their permissions model, and shows how to implement secure interactions between Cadence and EVM environments. You'll learn how to deploy and manage EVM contracts from Cadence, handle cross-VM asset transfers, and implement proper access controls for hybrid applications.

### [Batched EVM Transactions]

Explore advanced techniques for how to execute multiple EVM transactions atomically within a single Cadence transaction. This guide demonstrates how to batch complex EVM operations like multi-step DeFi protocols, NFT minting sequences, or arbitrage strategies and maintain transaction atomicity. You'll learn to handle transaction failures gracefully, optimize gas usage across batched calls, and implement error handling for complex multi-transaction workflows.

### [Direct Calls to Flow EVM]

Learn how Cadence smart contracts can directly interact with Flow EVM without the need to separate user transactions. This technical guide covers how to make direct calls from Cadence to query EVM state, execute EVM transactions programmatically, and handle responses and errors appropriately. You'll understand gas calculation models, transaction status handling, and best practices for how to integrate direct EVM calls into your Cadence contracts.

### [Cross-VM Bridge]

Explore the automated bridging of fungible and non-fungible tokens between Flow Cadence and Flow EVM environments. This comprehensive guide covers the Cross-VM Bridge protocol, which allows atomic movement of ERC-20, ERC-721, and Flow native tokens between virtual machines. You'll learn to onboard tokens to the bridge, implement custom token associations, handle bridging fees, and design tokens that work seamlessly across both Cadence and EVM environments.

## Conclusion

Cross-VM applications represent the future of blockchain development on Flow, which combines Cadence's innovative resource-oriented programming with EVM's ecosystem compatibility. These tutorials provide the foundation for you to build sophisticated applications that leverage both virtual machines, which allows developers to create unique experiences that wouldn't be possible on single-VM blockchains and maintain compatibility with current Ethereum tooling and user expectations.

[Batched Transactions]: ./introduction.md
[Add Flow Cadence to Your wagmi App]: ./add-to-wagmi.md
[Interacting with COAs]: ./interacting-with-coa.md
[Batched EVM Transactions]: ./batched-evm-transactions.md
[Direct Calls to Flow EVM]: ./direct-calls.md
[Cross-VM Bridge]: ./vm-bridge.md
