---
sidebar_position: 1
title: Tools
description: Essential tools for the Flow blockchain ecosystem
---

# Tools

## Node Providers

### Quick Node

[QuickNode](https://www.quicknode.com/chains/flow) is a service that provides access to blockchain infrastructure for developers, businesses, and anyone who needs reliable and fast access to blockchain networks. QuickNode allows users to connect to these networks without having to run their own full nodes, which can be resource-intensive.

#### Supported Networks

- testnet
- mainnet

### Tatum

[Tatum](https://tatum.io/) is a platform that provides infrastructure, SDK, and unified API to build, test, and run blockchain apps. You don't need to worry about blockchain node configuration or maintenance, and you don't need to learn to code for individual blockchains. 

#### Supported Networks

- testnet
- mainnet


## Block Explorers

### Flow Diver

[Flow Diver](https://www.flowdiver.io/) provides tools to explore the blockchain:
- blocks
- transactions
- contracts

it also provides network(mainnet) analytics:
- network activity (transactions number)
- transaction cost (gas fee)
- validators information

## Account Explorer

### Flow View

Flow View provides tools to view accounts information.

- address, balance, storage
- public keys and their weight
- staking info
- tokens, collections, and listings
- deployed smart contracts

#### Supported networks:
- mainnet https://www.flowview.app/
- testnet https://testnet.flowview.app/
- emulator (local) https://emulator.flowview.app/

## Contract Explorer

### ContractBrowser

A ContractBrowser is available for [Flow](https://contractbrowser.com/).

ContractBrowser provides tools to view deployed smart contracts and their dependencies and dependents.

- Search, view and verify smart contract source code.
- View detailed smart contract information

A testnet ContractBrowser for [Testnet Flow](https://testnet.contractbrowser.com/) is also available.

## Bridges

### Celler

[Celer cBridge](https://cbridge.celer.network/) is a decentralized and non-custodial asset bridge that supports 150+ tokens across 40+ blockchains and layer-2 rollups. Built on top of the [Celer](https://celer.network/) Inter-chain Message Framework, cBridge has processed ~$13B cross-chain asset transfer volume on 40+ blockchains for more than 350K unique users, and is quickly growing and expanding into more blockchains and layer-2s.

## Network Faucets

### Flow Faucet
[Flow Faucet](https://testnet-faucet.onflow.org/) is a tool that allows to distribute small amounts of a token to its users for testing and development purposes. This faucet allows you to create an account on the specified network as well as fund small amounts of crypto to any account on these networks.

#### Supported networks
- testnet - https://testnet-faucet.onflow.org/

## Wallets

### Magic.link

[Magic](https://magic.link/) is a developer SDK that integrates with your application to enable passwordless Web3 onboarding (no seed phrases) and authentication using magic links (similar to Slack and Medium).

https://magic.link/

### Niftory

[Niftory](https://niftory.com/) is a platform to create, mint, and transfer NFTs

https://niftory.com/

### Blocto

Manage your crypto, dApps, and NFT all-in-once through [Blocto](https://www.blocto.io/), the cross-chain crypto wallet

https://www.blocto.io/

### Dapper Wallet

[Dapper Wallet](https://www.meetdapper.com/) is an easy and securely buy and store digital assets from groundbreaking Flow apps and games

https://www.meetdapper.com/

### Ledger

[Ledger](https://www.ledger.com/) is a hardware wallet to secure, buy, exchange, and grow your crypto assets

https://www.ledger.com/

### NuFi

[NuFi](https://nu.fi/) Flow's only non-custodial wallet with staking, NFT gallery, dApp connector and Ledger HW support.

https://nu.fi/

### Lilico

[Lilico](https://lilico.app/) is the First Extension Wallet on Flow

https://lilico.app/

### Finoa

Safely store and stake your Flow tokens with [Finoa](https://www.finoa.io/)

https://www.finoa.io/flow/

### Dapper Self Custody (Beta)

A mobile [self custody wallet](https://www.meetdapper.com/dapper-self-custody) to help you explore the world of Flow

https://www.meetdapper.com/dapper-self-custody


## Toolchains

### Emulator

[The Flow Emulator](./toolchains/emulator/index.md) is a lightweight tool that emulates the behavior of the real Flow network. Packaged via CLI.

### FCL Dev Wallet

The [FCL dev wallet](./toolchains/fcl-dev-wallet/index.md) is a mock Flow wallet that simulates the protocols used by FCL to interact with the Flow blockchain on behalf of simulated user accounts.

### Flow CLI

[Flow CLI](./toolchains/flow-cli/index.md) brings Flow to your terminal. Easily interact with the network and build your dapps.

### VS Code extension

The [Visual Studio Code](./toolchains/vscode-extension/index.mdx) extension for Cadence. Extensive features such as code generation, deploying contracts, and a lot more.

### Flowser

[Flowser](https://flowser.dev/) lets you inspect the current state of any flow blockchain network emulator, testnet, and mainnet.

### Flow Cadut

[Flow Cadut](./toolchains/flow-cadut/api.md) is Node based template generator to simplify interaction with Cadence files.

### NFT Catalog

The [NFT Catalog](./toolchains/nft-catalog/overview.mdx) is an on chain registry listing NFT collections that exists on Flow which adhere to the NFT metadata standard. This empowers dApp developers to easily build on top of and discover interoperable NFT collections on Flow.

### NFT Marketplace

The [NFT Marketplace](./toolchains/nft-marketplace/index.md) is a guide thet provides required information to the development teams looking to build NFT marketplaces on the Flow blockchain.

### Flow JS testing (deprecated)

[Flow JS testing](./toolchains/flow-js-testing/index.md) is a Jest based framework to enable Cadence testing via a set of JavaScript methods and tools

## Clients

### Go SDK

The [Flow Go SDK](./clients/flow-go-sdk/index.mdx) provides a set of packages for Go developers to build applications that interact with the Flow network.

### Python SDK

The [Flow Python SDK](https://github.com/janezpodhostnik/flow-py-sdk) provides a set of packages for Python developers to build applications that interact with the Flow network.

### Ruby

[FlowClient](https://github.com/glucode/flow_client) is a Ruby gRPC client for Flow (onflow.org)

### Kotlin

The [Flow JVM SDK](https://github.com/onflow/flow-jvm-sdk) is a library for JVM languages (e.g. Java, Kotlin) that provides utilities to interact with the Flow blockchain.

### Unity

The [Flow SDK for Unity](./clients/unity-sdk/index.md) allows Unity developers to integrate their games and applications with the Flow blockchain.

### JavaScript (FCL)

The [Flow Client Library (FCL)](./clients/fcl-js/index.md) JS is a package used to interact with user wallets and the Flow blockchain

### Swift
[flow-swift] is a tool to build iOS application in Flow mobile realm 🌊

### .Net

[flow.net](https://github.com/tyronbrand/flow.net) is a tool for building .Net applications on Flow

### Rust

[Rust SDK](https://github.com/fee1-dead/flow.rs) for the Flow blockchain network

### PHP

[PHP SDK](https://github.com/mayvenstudios/flow-php-sdk) for the Flow blockchain

### Elixir

[OnFlow](https://github.com/nkezhaya/on_flow) is an Elixir client for interacting with the Flow blockchain. Documentation here: https://hexdocs.pm/on_flow.

### HTTP API

[Flow OpenAPI](/http-api) specification