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

## [Flow 101]

- [Flow Blockchain 101] - Learn why Flow blockchain is uniquely designed for consumer-scale decentralized applications with its multi-role architecture, native account abstraction, and EVM equivalence.

## [Flow Actions]

Learn how to build composable DeFi applications using the Flow Actions framework. This framework provides a "LEGO" system of reusable components that enable developers to create sophisticated DeFi workflows through atomic composition.

- [Introduction to Flow Actions] - Learn about Flow Actions, a suite of standardized Cadence interfaces that enable developers to compose complex DeFi workflows using small, reusable components like Sources, Sinks, Swappers, PriceOracles, and Flashers.
- [Flow Actions Transactions] - Learn how to create transactions that can chain multiple DeFi operations atomically.
- [Connectors] - Build Flow Actions connectors that integrate protocols with Flow Actions primitives, serving as protocol adapters that translate bespoke APIs into standardized interfaces.
- [Basic Combinations] - Learn how to combine Flow Actions primitives to create powerful DeFi workflows using atomic composition, weak guarantees, and event traceability across multiple protocols.
- [Scheduled Transactions Introduction] - Learn how to implement scheduled transactions for time-based smart contract execution on Flow, enabling recurring jobs, deferred actions, and autonomous workflows without external transactions.

## [Cadence Development]

Cadence tutorials covering Flow's native smart contract language for secure and resource-oriented blockchain development.

- [Mobile Development] - Mobile development tutorials for building Flow blockchain applications on iOS, Android, and React Native platforms.

  - [iOS Quickstart] - Build native iOS applications that interact with Flow blockchain using Swift and Flow SDK for mobile-first blockchain experiences.
  - [React Native Quickstart] - Get started building mobile applications on Flow using React Native with FCL integration for wallet connections and blockchain interactions.
  - [Walletless PWA] - Build a Progressive Web App with walletless authentication on Flow, enabling user onboarding without requiring traditional crypto wallets.

- [Account Management] - Comprehensive guides for managing Flow accounts, including key management, account linking, and advanced account features.
  - [Parent Accounts] - Implement parent account functionality on Flow to manage hierarchical account structures and delegate account operations securely.
  - [Child Accounts] - Create and manage child accounts on Flow for hierarchical account structures and delegated account management with proper access controls.
  - [Account Linking with Dapper] - Link Flow accounts with Dapper Wallet to enable seamless user experiences and account management across different wallet providers.

## [Flow EVM Development]

Comprehensive tutorials for building on Flow EVM using Solidity smart contracts and Ethereum-compatible tools and frameworks.

- [EVM Setup] - Setup guides for Flow EVM development environment, network configuration, and toolchain preparation.

- [EVM Development Tools] - Overview of development tools for building Solidity smart contracts on Flow EVM, including Hardhat, Foundry, and Remix IDE.

  - [Flow Hardhat Guide] - Using Hardhat to deploy a Solidity contract to Flow EVM with step-by-step configuration, deployment, and interaction examples including contract verification.
  - [Using Foundry with Flow] - Using Foundry to deploy a Solidity contract to Flow EVM, covering ERC-20 token development, testing, deployment, and state interaction with Foundry tools.
  - [Flow Remix Guide] - Deploy and interact with Solidity smart contracts on Flow EVM using the Remix IDE with network configuration and contract verification.

- [EVM Frameworks] - JavaScript frameworks and libraries for building frontend applications that interact with Flow EVM, including RainbowKit, wagmi, Ethers.js, and Web3.js.

  - [RainbowKit Integration] - Integrate RainbowKit with Flow EVM to provide wallet connection functionality in React applications with custom wallet support and network configuration.
  - [Wagmi Integration] - Integrate wagmi React hooks with Flow EVM for type-safe Ethereum interactions, wallet management, and smart contract integration in React applications.
  - [Ethers.js Integration] - Connect to Flow EVM using Ethers.js library for blockchain interactions, smart contract deployment, and transaction management in JavaScript applications.
  - [Web3.js Integration] - Use Web3.js library to interact with Flow EVM, covering wallet connections, smart contract interactions, and transaction handling in JavaScript applications.

- [Build a Fully-Onchain Image Gallery] - Learn how to store images up to approximately 32kb onchain on Flow EVM using Solidity smart contracts and Next.js frontend with gas-efficient blockchain storage.

## [Token Development]

Tutorials for creating, deploying, and managing fungible tokens and NFTs on Flow using both Cadence and Solidity smart contracts.

- [Fungible Token (Cadence)] - Create and deploy fungible tokens using Cadence on Flow with proper standards implementation, minting, and transfer functionality.
- [NFT (Cadence)] - Build and deploy Non-Fungible Token contracts using Cadence with MetadataViews implementation for marketplace compatibility and proper resource handling.
- [Register Your ERC20 Token] - Register ERC-20 tokens deployed on Flow EVM with the Flow Token Registry for ecosystem integration and cross-VM compatibility.
- [Register Your Assets in Cadence] - Register Cadence-based fungible tokens and NFTs with the Flow Token Registry for ecosystem-wide recognition and integration with wallets and applications.

## [Cross-VM Applications]

Build applications that span both Flow EVM and Cadence virtual machines, enabling unique cross-VM functionality and asset interoperability.

- [Cross-VM Application Introduction] - Introduction to building applications that leverage both Flow EVM and Cadence environments for enhanced functionality and cross-VM asset management.
- [Add Flow Cadence to Your wagmi App] - Integrate cross-VM functionality with wagmi React hooks to enable seamless interactions between Flow EVM and Cadence environments in frontend applications.
- [Interacting with COAs] - Interact with Cadence-Owned Accounts (COA) to bridge assets and functionality between Cadence and EVM environments on Flow blockchain.
- [Batched EVM Transactions] - Execute batched transactions on Flow EVM to improve efficiency and enable atomic multi-operation workflows with reduced gas costs.
- [Direct Calls] - Make direct calls between Cadence and EVM environments on Flow for seamless cross-VM smart contract interactions and data exchange.
- [Cross-VM Bridge] - Use the VM Bridge to transfer assets and data between Flow's Cadence and EVM environments for cross-VM application development.

## [Native VRF (Built-in Randomness)]

Tutorials for using Flow's native Verifiable Random Function (VRF) to generate cryptographically secure random numbers in smart contracts.

- [Commit-Reveal with Cadence] - Implement commit-reveal schemes using Flow's native VRF in Cadence smart contracts for secure random number generation and fair gaming applications.
- [VRF in Solidity] - Access Flow's native Verifiable Random Function from Solidity smart contracts deployed on Flow EVM for random number generation.

## [Gasless Transactions]

Implement gasless transaction patterns on Flow to improve user experience by removing the need for users to hold native tokens for gas fees.

- [Gas-Free EVM Endpoint] - Use Flow's gas-free EVM endpoint to enable sponsored transactions that remove gas fee barriers for users interacting with EVM smart contracts.

## [Use AI to Build on the Flow Blockchain]

Comprehensive tutorials for integrating AI tools and services with Flow blockchain development, covering LLMs, AI agents, development assistants, and automated workflows.

- [Large Language Models (LLMs)] - Learn how to integrate various AI assistants and large language models with Flow development to enhance productivity, code quality, and development workflows.
  - [Use Flow Knowledge Base in ChatGPT] - Create a Custom GPT using ChatGPT that references Flow's comprehensive documentation to answer development questions and provide Flow-specific guidance.
  - [Claude Code for Flow Development] - Learn how to leverage Claude Code for efficient Cadence smart contract development and Flow blockchain application building with AI-powered workflows and systematic deployment strategies.
  - [Use Flow Knowledge Base in Gemini AI] - Create a Custom GEM using Gemini AI that specializes in Flow blockchain development with access to comprehensive Flow documentation and development guidance.
- [Cursor IDE Integration] - Comprehensive guidance for setting up and using Cursor with Flow's documentation ecosystem through data sources, indexing, and Cadence rules for enhanced AI-assisted development.
  - [Cadence Rules] - Learn how to use Cursor Rules to enhance AI assistance for Cadence and Flow development with persistent context, specialized syntax patterns, and automated workflows.
  - [Flow Data Sources] - Flow Data Sources is a comprehensive repository that automatically aggregates and formats Flow ecosystem content into Markdown files optimized for AI ingestion and development assistance.
  - [Indexing Flow Documentation in Cursor] - Step-by-step guide for indexing Flow documentation within Cursor's AI system to create a comprehensive Flow development environment with enhanced AI assistance.
- [AI Agents] - Build intelligent AI agents on Flow blockchain using frameworks like Eliza for autonomous blockchain interactions and smart contract automation.
  - [AgentKit Flow Guide] - Build AI agents on Flow using AgentKit framework for creating intelligent blockchain applications with natural language processing and automated smart contract interactions.
  - [Eliza on Flow] - Learn how to build AI Agent on Flow with Eliza framework, covering setup, configuration, character creation, and plugin development for intelligent blockchain agents.
  - [Eliza Plugin Guide] - Learn how to build Eliza plugins for your AI Agent on Flow, covering plugin development workflow, dependency injection, and plugin registry integration.
- [Model Context Protocol (MCP)] - Learn about Model Context Protocol (MCP) for Flow blockchain development, enabling standardized AI context sharing and enhanced development tool integration.
  - [Use MCP in Cursor] - Integrate Model Context Protocol (MCP) with Cursor IDE to enhance AI assistance for Flow blockchain development with standardized context sharing.
  - [Contribute to MCP] - Contribute to Model Context Protocol (MCP) development for Flow blockchain, enabling better AI integration and context sharing across development tools.

## [Integrations]

Integration guides for third-party services and tools that enhance Flow blockchain development, including payment processors, authentication providers, and infrastructure services.

- [Crossmint Integration] - Comprehensive integration guides for using Crossmint's Web3 infrastructure on Flow, covering authentication, payment checkout, and minting platform features.
  - [Authentication Integration Guide] - Set up user authentication for your Flow application using Crossmint's integrated authentication system with email, social logins, and wallet connections for unified identity management.
  - [Payment Checkout Integration] - Enable fiat and cross-chain payments for Flow assets with credit cards, Apple Pay, Google Pay, and crypto across 40+ chains using hosted, embedded, or headless checkout solutions.
  - [Minting Platform Integration] - Create and distribute tokens at scale on Flow using Crossmint's no-code and API-based minting platform with smart contract deployment and airdrop capabilities.
- [Gelato Smart Wallet] - Learn how to use Gelato Smart Wallet to enable gasless transactions on Flow EVM through sponsored transactions with EIP-7702 support for enhanced user experience.

### Building in Web3 has never been easier

Flow will continue to provide quality walkthroughs and tutorials to provide developers all of the tools needed to build the next generation of web3 apps on a fast blockchain, with built in randomness, gasless transactions, and AI integration.

<!-- Reference-style links, will not render on page. -->

[Flow 101]: ./flow-101.md
[Flow Blockchain 101]: ./flow-101.md
[Flow Actions]: ./forte/flow-actions/index.md
[Introduction to Flow Actions]: ./forte/flow-actions/intro-to-flow-actions.md
[Flow Actions Transactions]: ./forte/flow-actions/flow-actions-transaction.md
[Connectors]: ./forte/flow-actions/connectors.md
[Basic Combinations]: ./forte/flow-actions/basic-combinations.md
[Scheduled Transactions Introduction]: ./forte/scheduled-transactions/scheduled-transactions-introduction.md
[Cadence Development]: ./cadence/index.md
[Mobile Development]: ./cadence/mobile/index.md
[iOS Quickstart]: ./cadence/mobile/ios-quickstart.md
[React Native Quickstart]: ./cadence/mobile/react-native-quickstart.md
[Walletless PWA]: ./cadence/mobile/walletless-pwa.md
[Account Management]: ./cadence/account-management/index.md
[Parent Accounts]: ./cadence/account-management/parent-accounts.md
[Child Accounts]: ./cadence/account-management/child-accounts.md
[Account Linking with Dapper]: ./cadence/account-management/account-linking-with-dapper.md
[Flow EVM Development]: ./evm/index.md
[EVM Setup]: ./evm/setup/index.md
[EVM Development Tools]: ./evm/development-tools/index.md
[Flow Hardhat Guide]: ./evm/development-tools/hardhat.md
[Using Foundry with Flow]: ./evm/development-tools/foundry.md
[Flow Remix Guide]: ./evm/development-tools/remix.md
[EVM Frameworks]: ./evm/frameworks/index.md
[RainbowKit Integration]: ./evm/frameworks/rainbowkit.md
[Wagmi Integration]: ./evm/frameworks/wagmi.md
[Ethers.js Integration]: ./evm/frameworks/ethers.md
[Web3.js Integration]: ./evm/frameworks/web3-js.md
[Build a Fully-Onchain Image Gallery]: ./evm/image-gallery.md
[Token Development]: ./tokens/index.md
[Fungible Token (Cadence)]: ./tokens/fungible-token-cadence.md
[NFT (Cadence)]: ./tokens/nft-cadence.md
[Register Your ERC20 Token]: ./tokens/register-erc20-token.md
[Register Your Assets in Cadence]: ./tokens/register-cadence-assets.md
[Cross-VM Applications]: ./cross-vm-apps/index.md
[Cross-VM Application Introduction]: ./cross-vm-apps/introduction.md
[Add Flow Cadence to Your wagmi App]: ./cross-vm-apps/add-to-wagmi.md
[Interacting with COAs]: ./cross-vm-apps/interacting-with-coa.md
[Batched EVM Transactions]: ./cross-vm-apps/batched-evm-transactions.md
[Direct Calls]: ./cross-vm-apps/direct-calls.md
[Cross-VM Bridge]: ./cross-vm-apps/vm-bridge.md
[Native VRF (Built-in Randomness)]: ./native-vrf/index.md
[Commit-Reveal with Cadence]: ./native-vrf/commit-reveal-cadence.md
[VRF in Solidity]: ./native-vrf/vrf-in-solidity.md
[Gasless Transactions]: ./gasless-transactions/index.md
[Gas-Free EVM Endpoint]: ./gasless-transactions/sponsored-transactions-evm-endpoint.md
[Use AI to Build on the Flow Blockchain]: ./use-AI-to-build-on-flow/index.md
[Large Language Models (LLMs)]: ./use-AI-to-build-on-flow/llms/index.md
[Use Flow Knowledge Base in ChatGPT]: ./use-AI-to-build-on-flow/llms/chatgpt.md
[Claude Code for Flow Development]: ./use-AI-to-build-on-flow/llms/claude-code.md
[Use Flow Knowledge Base in Gemini AI]: ./use-AI-to-build-on-flow/llms/gemini.md
[Cursor IDE Integration]: ./use-AI-to-build-on-flow/cursor/index.md
[Cadence Rules]: ./use-AI-to-build-on-flow/cursor/cadence-rules.md
[Flow Data Sources]: ./use-AI-to-build-on-flow/cursor/flow-data-sources.md
[Indexing Flow Documentation in Cursor]: ./use-AI-to-build-on-flow/cursor/indexing-docs.md
[AI Agents]: ./use-AI-to-build-on-flow/agents/index.md
[AgentKit Flow Guide]: ./use-AI-to-build-on-flow/agents/agentkit-flow-guide.md
[Eliza on Flow]: ./use-AI-to-build-on-flow/agents/eliza/index.md
[Eliza Plugin Guide]: ./use-AI-to-build-on-flow/agents/eliza/build-plugin.md
[Model Context Protocol (MCP)]: ./use-AI-to-build-on-flow/mcp/index.md
[Use MCP in Cursor]: ./use-AI-to-build-on-flow/mcp/use-mcp-in-cursor.md
[Contribute to MCP]: ./use-AI-to-build-on-flow/mcp/contribute-to-mcp.md
[Integrations]: ./integrations/index.md
[Crossmint Integration]: ./integrations/crossmint/index.md
[Authentication Integration Guide]: ./integrations/crossmint/authentication.md
[Payment Checkout Integration]: ./integrations/crossmint/payment-checkout.md
[Minting Platform Integration]: ./integrations/crossmint/minting-platform.md
[Gelato Smart Wallet]: ./integrations/gelato-sw.md
