---
title: Cadence Advantages
description: A series of tutorials showcasing the unique advantages and capabilities of Cadence smart contracts on Flow.
sidebar_position: 2
keywords:
  - Cadence advantages
  - smart contracts
  - Flow blockchain
  - tutorials
  - composition
  - native data availability
  - resource-oriented programming
  - transaction composition
  - script queries
  - contract upgrades
  - contract updatability
  - incremental upgrades
---

# Cadence Advantages

This series explores the unique advantages and capabilities of Cadence smart contracts on Flow, and demonstrates how Cadence's innovative features allow powerful development patterns that aren't possible on other blockchain platforms. From native data availability to seamless transaction composition, these tutorials showcase why Cadence represents the future of smart contract development.

## Tutorials

### [Compose with Cadence Transactions]

Learn how to compose with someone else's on-chain contracts by writing a Cadence transaction that conditionally calls a public contract on testnet, then extend it to mint NFTs when conditions are met, with no redeploy required. This tutorial demonstrates Cadence's powerful composition model, which lets you build complex application logic that interacts with multiple contracts in a single atomic transaction. You'll work with the Flow command line interface (CLI) dependency manager, learn to set up NFT collections, and view results using Flowscan.

### [Native Data Availability with Cadence Scripts]

Discover how Cadence scripts provide native data availability, which allows you to query any on-chain data directly from Flow's state without the need to rely on external indexers or APIs. This comprehensive tutorial shows you how to build scripts that can discover and query NFT collections across multiple child accounts with Hybrid Custody, then extend it to include both NBA Top Shot and NFL All Day NFTs. You'll learn to filter and process NFT collections, extract specific metadata, and compare Cadence's native data availability with Solidity's limitations.

### [Upgrading Cadence Contracts]

Learn how to upgrade deployed Cadence contracts through multiple incremental upgrades, preserve the current state, and maintain the same contract address. This tutorial demonstrates Cadence's sophisticated contract upgrade system through two realistic scenarios: 

- Add an event to notify users when the counter reaches an even number.
- Extend the contract with additional functionality like increment by two and check if numbers are even. 

You'll understand what you can and can't change when you upgrade, perform multiple contract updates with Flow CLI, and test upgraded functionality with comprehensive transactions and scripts.

## Conclusion

Cadence's unique features, such as resource-oriented programming to native data availability, seamless transaction composition, and sophisticated contract upgrade capabilities, represent a fundamental advancement in smart contract development. These tutorials demonstrate how Cadence allows developers to build sophisticated applications with capabilities that simply aren't possible on other blockchain platforms and maintain security and developer experience as core principles.

[Compose with Cadence Transactions]: ./compose-with-cadence-transactions.md
[Native Data Availability with Cadence Scripts]: ./native-data-availibility-with-cadence-scripts.md
[Upgrading Cadence Contracts]: ./upgrading-cadence-contracts.md
