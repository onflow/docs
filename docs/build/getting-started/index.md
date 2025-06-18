---
title: Flow Blockchain 101
sidebar_label: Getting Started
sidebar_position: 3
description: Learn why Flow blockchain is uniquely designed for consumer-scale decentralized applications. Understand Flow's multi-role architecture, native account abstraction, and EVM equivalence.
keywords:
  - Flow blockchain
  - blockchain scaling
  - multi-role architecture
  - Cadence language
  - EVM equivalence
  - account abstraction
  - blockchain security
  - Flow features
  - blockchain trilemma
  - Flow EVM
  - smart contracts
  - Flow token
  - blockchain architecture
  - decentralization
  - consumer apps
  - MEV
  - miner-extractable value
  - maximum extractable value
---

import { ActionCard } from '@site/src/components/ActionCard';

<style>{`
  .action-card-row {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .action-card-row > * {
    flex: 1 1 350px;
    max-width: 500px;
    min-width: 300px;
  }
  @media (max-width: 900px) {
    .action-card-row {
      flex-direction: column;
      align-items: stretch;
    }
    .action-card-row > * {
      max-width: 100%;
      min-width: 0;
    }
  }
`}</style>

<div className="action-card-row">
  <ActionCard
    icon="cadence"
    iconColor="green"
    cardColor="black"
    heading="Build with Cadence"
    description="Get started with Flow's native resource-oriented smart contract language. Learn how to deploy, interact, and build secure dApps using Cadence."
    href="./getting-started/contract-interaction"
  />
  <ActionCard
    icon="solidity"
    iconColor="purple"
    cardColor="black"
    heading="Build with Solidity"
    description="Deploy Solidity contracts on Flow EVM using familiar Ethereum tools like Hardhat and Foundry. Start building EVM-compatible dApps on Flow."
    href="../../evm/quickstart"
  />
</div>

## What is Flow?

Flow is a Layer 1 blockchain built from the ground up to support large-scale applications, especially in the world of consumer crypto. Originally developed by the team behind CryptoKitties, Flow was designed to address the limitations they experienced with other blockchains — particularly around scalability and user experience.

At the heart of Flow's design is a modular architecture that separates the responsibilities of consensus, execution, verification, and collection across different node types. This allows the network to process many transactions in parallel without compromising decentralization or safety.

Other defining features of Flow include:

- **Modular architecture** that enables scalability without sharding.
- **Fast finality**, making applications responsive and user-friendly.
- **Resistance to Miner Extractable Value (MEV)**, protecting users from front-running.
- **EVM equivalence**, allowing developers to deploy Solidity contracts on Flow EVM.
- **Low gas fees**, which make applications affordable and accessible to users.

Flow has already powered some of the most successful Web3 products to date, including:

- [NBA Top Shot]: One of the most widely adopted NFT applications in history.
- [Disney Pinnacle]: A collectible platform with iconic Disney content.
- [CryptoKitties: AllTheZen]: A spiritual successor to the original CryptoKitties.

### Flow EVM vs Cadence

Flow supports two smart contract environments, giving builders the flexibility to use whichever tool fits best:

- **Flow EVM** is fully compatible with the Ethereum Virtual Machine, allowing you to use Solidity, Hardhat, MetaMask, and other familiar tools with no changes.
- **Cadence** is Flow's native smart contract language, purpose-built to handle digital assets safely and intuitively using a resource-oriented programming model.

Developers can build entirely in one or mix both environments for hybrid applications.

## Flow features

### On-Chain randomness

Flow natively supports verifiable randomness through its built-in Verifiable Random Function (VRF), which developers can use directly in smart contracts. This removes the need for third-party randomness oracles in many cases.

- [Learn more]

### Batch transactions

Batching allows you to group multiple transactions together for atomic execution across both Flow EVM and Cadence-based contracts. This enables powerful cross-VM apps and composability.

- [Explore the tutorial]

### Account linking

Account linking is a unique feature that lets users connect different accounts — such as linking their Dapper Wallet to another address — without compromising control or security. This is particularly useful in onboarding flows and games.

- [Read the guide]

## What Cadence enables

Cadence is a smart contract language built specifically for digital assets. It uses a **resource-oriented programming model**, which ensures that assets like NFTs and tokens are treated as first-class citizens that can't be duplicated or accidentally lost.

Key advantages of Cadence include:

- A powerful **account model** that supports multiple keys and roles.
- **Capability-based access control**, which lets users share or restrict access to resources with fine granularity.
- A **resource-oriented system** that prevents bugs common in other ecosystems, like token duplication or loss due to programming mistakes.

Cadence helps developers write safer code, faster — and is a great choice for apps where assets, ownership, and identity matter.

## Building on Flow

### Connecting to the network

Flow provides robust support for both Cadence and EVM development. Here's how to get started:

**For Flow EVM:**

- [Connect to Testnet]
- [Connect to Mainnet]

**For Cadence:**

- [Flow Network Overview and Setup]

### Developer tools

**Cadence development:**

- [Flow CLI]: Command-line tool for managing accounts, deploying contracts, and running scripts/transactions.
- [@onflow/kit]: A development toolkit to scaffold, simulate, and deploy Cadence apps quickly.

**Flow EVM development:**

- Fully compatible with Ethereum development tools like Hardhat, Foundry, MetaMask, and Ethers.js. If you know how to build for Ethereum, you'll feel right at home.

### Ecosystem partners and tools

The Flow ecosystem includes infrastructure providers, wallet integrations, analytics tools, dev tooling, and much more. Browse the full list of partners and recommended resources:

- [Explore the Ecosystem]

### Join the community

Whether you're looking for support, feedback, or collaboration, Flow's community is active and welcoming:

- **Discord**: [Connect] with other developers and get real-time help.
- **Twitter/𝕏**: Follow [@flow_blockchain] for updates, announcements, and highlights.

### Flow Cadence Quickstart

- [Contract Interaction]: Interact with your first Cadence smart contract on the Flow testnet.
- [Local Development]: Set up your dev environment, run tests, add already deployed contracts to your environment with Dependency Manager, and deploy and use your first contract with the emulator.
- [Simple Frontend]: Read and write from a smart contract using the hooks from [@onflow/kit].

### Flow EVM Quickstart

- [EVM Quickstart]: Deploy a contract with Hardhat and interact with it using [Testnet Flowscan].
- [Foundry]: Build and deploy an ERC20 on Flow with Foundry.

We also have guides for working with [Rainbowkit] and [wagmi].

<!-- Relative links. Will not render on the page -->

[NBA Top Shot]: https://nbatopshot.com/
[Disney Pinnacle]: https://disneypinnacle.com/
[CryptoKitties: AllTheZen]: https://allthezen.cryptokitties.co/
[Learn more]: https://developers.flow.com/tutorials/native-vrf
[Explore the tutorial]: https://developers.flow.com/tutorials/cross-vm-apps/introduction
[Read the guide]: https://developers.flow.com/build/guides/account-linking-with-dapper
[Connect to Testnet]: https://developers.flow.com/networks/flow-networks/accessing-testnet
[Connect to Mainnet]: https://developers.flow.com/networks/flow-networks/accessing-mainnet
[Flow Network Overview and Setup]: https://developers.flow.com/networks/flow-networks
[Flow CLI]: https://developers.flow.com/tools/flow-cli
[@onflow/kit]: https://developers.flow.com/tools/kit
[Explore the Ecosystem]: https://developers.flow.com/ecosystem
[@flow_blockchain]: https://x.com/flow_blockchain
[Connect]: https://discord.com/invite/flow
[Contract Interaction]: ./contract-interaction.md
[Local Development]: ./flow-cli.md
[Simple Frontend]: ./fcl-quickstart.md
[EVM Quickstart]: ../../evm/quickstart.md
[Testnet Flowscan]: https://evm-testnet.flowscan.io/
[Foundry]: ../..//evm/guides/foundry.md
[Rainbowkit]: ../../evm/guides/rainbowkit.md
[wagmi]: ../../evm/guides/wagmi.md
