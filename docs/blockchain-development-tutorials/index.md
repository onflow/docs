---
sidebar_position: 1
title: Blockchain Development Tutorials
description: Blockchain development tutorials to take advantage of the power of Flow with EVM and Cadence.
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

# Blockchain Development Tutorials

Flow Cadence and Flow EVM are two VMs running on the Flow blockchain. A few months after the release of the Crescendo upgrade, we're seeing more apps that aren't Cadence apps -OR- EVM apps, they're both! Cadence unlocks superpowers such as vast computation and storage, native VRF, a much safer and more secure language for handling digital ownership, and more. Flow EVM unlocks the power of the Ethereum ecosystem, allowing you to bring in traditional tools, assets, and liquidity.

For this grand future, we'll need a new suite of blockchain development tutorials, guides, and resources to help you build with the best of both worlds. This section is dedicated to those tutorials.

## [Flow Actions]

Learn how to build composable DeFi applications using the Flow Actions framework. This framework provides a "LEGO" system of reusable components that enable developers to create sophisticated DeFi workflows through atomic composition.

- [Introduction to Flow Actions] - Learn about Flow Actions, a suite of standardized Cadence interfaces that enable developers to compose complex DeFi workflows using small, reusable components
- [Flow Actions Transactions] - Learn how to create transactions that can chain multiple DeFi operations atomically
- [Connectors] - Understand how connectors bridge standardized Flow Actions interfaces with different DeFi protocols
- [Basic Combinations] - Learn how to combine Flow Actions to create new workflows
- [Scheduled Callbacks Introduction] - Learn how to implement scheduled callbacks for time-based smart contract execution on Flow

## [Use AI to Build on the Flow Blockchain]

Learn how to leverage AI tools to enhance your Flow development experience. These tutorials show you how to integrate various AI assistants with Flow development to boost productivity and code quality.

- [Use Flow Knowledge Base in Cursor] - Learn how to set up Cursor with Flow knowledge bases to get intelligent assistance while developing Flow applications
- [Use Flow Knowledge Base in ChatGPT] - Create a custom GPT that understands Flow and Cadence to provide accurate answers to your development questions
- [Claude Code for Flow Development] - Learn how to leverage Claude Code for efficient ways to build on Flow and with Cadence
- [Cadence Rules] - Learn how to use Cursor Rules to enhance AI assistance for Cadence and Flow development with persistent context and automated workflows
- [Flow MCP] - Learn how to use Flow MCP (Model Context Protocol) server to enhance AI tools with onchain interaction capabilities
- [Flow Data Sources] - Learn about this comprehensive resource and how to integrate it with various AI platforms
- [Build AI Agents with AgentKit] - Learn how to create AI agents that can interact with Flow using AgentKit

## [Token Launch]

Learn how to launch your own token on Flow using Cadence and EVM. This guide covers the process of registering and deploying tokens that can be used across both virtual machines.

- [Register Your ERC20 Token] - Learn how to register your ERC20 token on Flow EVM based on Github Pull Request process so it appears in Flow standard Token List which is used by Flow Wallet, MetaMask, and other ecosystem apps.
- [Register Your Assets in Cadence] - Learn how to register your Fungible Token or Non-Fungible Token on Flow through Cadence transaction so it appears in Flow Wallet, IncrementFi, and other ecosystem apps.

## [Cross-VM Applications]

Learn how to build applications that interact with both Cadence and Flow EVM. These tutorials cover everything from basic integration to advanced features like transaction batching and token bridging.

- [Introduction to Cross-VM Applications] - Learn how to use FCL with Wagmi and RainbowKit to create a cross-VM app
- [Add Flow Cadence to Your wagmi App] - Learn how to integrate Flow Cadence with your existing wagmi/RainbowKit application to enable batch transactions and other Cadence features.
- [Interacting with COAs] - Learn how to create and interact with Cadence Owned Accounts (COAs) to control EVM accounts from Cadence
- [Batched EVM Transactions] - Discover how to batch multiple EVM transactions into a single Cadence transaction
- [Cross-VM Bridge] - Explore how to bridge fungible and non-fungible tokens between Cadence and EVM environments

## [Native VRF (Built-in Randomness) Tutorials]

Learn how to leverage Flow's native VRF capabilities in both Cadence and Solidity smart contracts. These tutorials demonstrate how to implement secure randomness without relying on external oracles.

- [Secure Randomness with Commit-Reveal in Cadence] - Learn how to implement secure randomness in Cadence using Flow's commit-reveal scheme
- [VRF (Randomness) in Solidity] - Learn how to use Flow's native VRF capabilities in Solidity.
- [Deploy a Solidity Contract Using Cadence] - Discover how to deploy and interact with Solidity contracts on Flow EVM using Cadence

## [Backend Usage]

Learn some tips and tutorials for interacting with the Flow blockchain in a backend application.

- [Gas Free EVM Endpoint] - Learn how to set up a gas free EVM endpoint for your backend, all transactions sent through this endpoint will not be charged for gas fees from the transaction sender's account.

## [FlowtoBooth]

Explore Flow's unique capabilities through fun benchmark applications that showcase what's possible with Flow's efficient gas pricing. These tutorials demonstrate practical applications of Flow's advanced features.

- [Build a Fully-Onchain Image Gallery] - Create a fully onchain image gallery that demonstrates Flow's efficient storage capabilities

### Building in Web3 has never been easier

Flow will continue to provide quality walkthroughs and tutorials to provide developers all of the tools needed to build the next generation of web3 apps on a fast blockchain, with built in randomness, gasless transactions, and AI integration.

<!-- Reference-style links, will not render on page. -->

[Flow Actions]: https://developers.flow.com/blockchain-development-tutorials/defi
[Introduction to Flow Actions]: ./defi/intro-to-flow-actions.md
[Flow Actions Transactions]: https://developers.flow.com/blockchain-development-tutorials/defi/flow-actions-transaction
[Connectors]: ./defi/connectors.md
[Basic Combinations]: ./defi/basic-combinations.md
[Scheduled Callbacks Introduction]: ./defi/scheduled-callbacks-introduction.md
[Use AI to Build on the Flow Blockchain]: https://developers.flow.com/blockchain-development-tutorials/use-AI-to-build-on-flow
[Use Flow Knowledge Base in Cursor]: use-AI-to-build-on-flow/cursor/index.md
[Use Flow Knowledge Base in ChatGPT]: use-AI-to-build-on-flow/chatgpt/index.md
[Claude Code for Flow Development]: use-AI-to-build-on-flow/claude-code.md
[Cadence Rules]: use-AI-to-build-on-flow/cadence-rules.md
[Flow MCP]: use-AI-to-build-on-flow/mcp/index.md
[Flow Data Sources]: use-AI-to-build-on-flow/flow-data-sources.md
[Build AI Agents with AgentKit]: use-AI-to-build-on-flow/agentkit-flow-guide.md
[Cross-VM Applications]: https://developers.flow.com/blockchain-development-tutorials/cross-vm-apps
[Introduction to Cross-VM Applications]: cross-vm-apps/introduction.md
[Interacting with COAs]: cross-vm-apps/interacting-with-coa.md
[Batched EVM Transactions]: cross-vm-apps/batched-evm-transactions.md
[Cross-VM Bridge]: cross-vm-apps/vm-bridge.md
[FlowtoBooth]: https://developers.flow.com/blockchain-development-tutorials/flowtobooth
[Build a Fully-Onchain Image Gallery]: flowtobooth/image-gallery.md
[Native VRF (Built-in Randomness) Tutorials]: https://developers.flow.com/blockchain-development-tutorials/native-vrf
[Secure Randomness with Commit-Reveal in Cadence]: native-vrf/commit-reveal-cadence.md
[VRF (Randomness) in Solidity]: native-vrf/vrf-in-solidity.md
[Add Flow Cadence to Your wagmi App]: ./cross-vm-apps/add-to-wagmi.md
[Token Launch]: https://developers.flow.com/blockchain-development-tutorials/token-launch
[Register Your Assets in Cadence]: ./token-launch/register-cadence-assets.md
[Register Your ERC20 Token]: ./token-launch/register-erc20-token.md
[Backend Usage]: https://developers.flow.com/blockchain-development-tutorials/gasless-transactions
[Gas Free EVM Endpoint]: ./gasless-transactions/gas-free-evm-endpoint.md
