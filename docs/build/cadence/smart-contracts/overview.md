---
title: Smart Contracts on Flow
sidebar_label: Smart Contracts on Flow
sidebar_position: 2
sidebar_custom_props:
  icon: 🛠️
description: Learn about smart contract development on Flow blockchain. Understand data storage, standards implementation, and best practices for building decentralized applications using Cadence.
keywords:
  - smart contracts
  - Flow blockchain
  - Cadence
  - dApp development
  - NFT standards
  - fungible tokens
  - contract storage
  - IPFS storage
  - blockchain data
  - Flow standards
  - contract interfaces
  - development tools
  - Flow CLI
  - Flow emulator
  - decentralized apps
---

# Smart Contracts on Flow

At its core, a decentralized application is defined by the [smart contracts] it uses on the blockchain. Rather than rely on centralized application servers and databases, apps model their core application logic with smart contracts, often referred to as the "onchain" code.

It is therefore helpful to develop a clear model for your app that takes into account the data and logic that will exist in your smart contracts. In particular, it is important to differentiate between the parts of your app that must live on chain and those that should live off chain.

## How to write smart contracts on Flow

Smart contracts on the Flow blockchain are implemented in [Cadence], a resource-oriented programming language specifically designed for smart contract development.

### Onboard to Cadence

To get started with Cadence, we recommended that you cover the introductory tutorials available in the [Flow Playground], a simple web IDE designed for you to learn Cadence.

### Configure your local environment

To build confidently, you will want to set up the appropriate local environment and have an adequate test suite to ensure your smart contracts operate as intended. To do this, familiarize yourself with the following tools:

- [Flow CLI]: A utility to directly interact with the chain and manage accounts and contracts.
- [Flow Emulator] A lightweight server that simulates the Flow blockchain (strongly recommended during development).
- [Flow Dev Wallet] A utility to simulate user wallets in development.
- [Visual Studio Code Extension] An IDE integration used to develop smart contracts.

## Store data on Flow

All apps will store important data on the blockchain, and some more than others -- especially NFT apps. You'll want to consider the following when you store data on the Flow blockchain.

### What does your data need to represent?

Permanence is a key property of blockchains; users trust that the data they store will continue to exist for years to come, and this is a defining characteristic of assets like NFTs. Therefore, well-designed digital assets store the information necessary to retain their value without external dependencies.

### Storage limits and fees

However, there are practical constraints to data storage on a blockchain. Developer and user accounts must retain a small amount of FLOW tokens, known as the storage fee, for bytes of data stored in their accounts. The minimum storage fee will grant each account a minimum storage amount. If an account holds assets that demand more bytes of storage, the account will need to retain more FLOW tokens to increase the storage amount according to Flow's [fee schedule]. A more compact data model can keep storage needs down. 

Furthermore, a single Flow transaction has a size limit of 4MB, which limits the rate at which large amounts of data can be transferred to the blockchain.

Lastly, a blockchain is not a content delivery network and therefore cannot serve media assets, such as videos, at the speeds expected by modern applications.

For these reasons, it usually isn't practical to store large media assets such as videos and high-definition images on the Flow blockchain. Instead, consider an external storage solution.

### External storage networks

Decentralized storage networks such as IPFS allow you to store large digital assets off chain, but with no need to rely on centralized servers. Instead of save an entire asset to the Flow blockchain, you can save the content hash (known as a CID on IPFS) on the blockchain and then store the source file off-chain. This way, users can verify that the media file matches the digital asset.

IPFS files can be uploaded via a pinning service such as Pinata; see their [NFT tutorial] for an example of how to use Pinata with Flow.

IPFS files are served through [gateways], many of which leverage caching to provide fast response times. Cloudflare provides a [public IPFS Gateway], and Pinata also supports [dedicated gateways with custom domains].

## Use current standards

The Flow blockchain has smart contract standards for both fungible and non-fungible tokens that you should implement when you build your contracts.

### Non-Fungible Tokens (NFTs)

All NFTs on the Flow blockchain implement the [NonFungibleToken] interface, which allows them to be compatible with wallets, marketplaces and other cross-app experiences.

See the [NFT Guide] for a guide on how to create a basic NFT contract that conforms to the standard.

- [NonFungibleToken] (NFT) contract interface

### NFT sales and trading

Flow has a standard contract to facilitate both the direct sales and peer-to-peer trading of NFTs. The NFT storefront contract is useful for apps that want to provide an NFT marketplace experience.

- [NFT Storefront contract]

### Fungible Tokens

Fungible tokens (that is, coins, currencies) on the Flow blockchain, which includes the default cryptocurrency token FLOW, implement the [FungibleToken] interface.

See the [FT Guide] for a guide on how to create a basic fungible token contract that conforms to the standard.

- [FungibleToken] contract interface:

<!-- Relative links, will not render on page -->

[smart contracts]: https://en.wikipedia.org/wiki/Smart_contract
[Cadence]: https://github.com/onflow/cadence
[Flow Playground]: https://play.flow.com/
[Flow CLI]: ../../../build/tools/flow-cli/index.md
[Flow Emulator]: ../../../build/tools/emulator/index.md
[Flow Dev Wallet]: https://github.com/onflow/fcl-dev-wallet/
[Visual Studio Code Extension]: ../../../build/tools/vscode-extension/index.md
[fee schedule]: ../basics/fees.md#storage
[NFT tutorial]: https://medium.com/pinata/how-to-create-nfts-like-nba-top-shot-with-flow-and-ipfs-701296944bf
[gateways]: https://docs.ipfs.io/concepts/ipfs-gateway/
[public IPFS Gateway]: https://developers.cloudflare.com/distributed-web/ipfs-gateway
[dedicated gateways with custom domains]: https://medium.com/pinata/announcing-dedicated-ipfs-gateways-60f599949ce
[NonFungibleToken]: ../core-contracts/08-non-fungible-token.md
[NFT Guide]: ../../../blockchain-development-tutorials/tokens/nft-cadence.md
[NFT Storefront contract]: https://github.com/onflow/nft-storefront
[FungibleToken]: ../core-contracts/02-fungible-token.md
[FT Guide]: ../../../blockchain-development-tutorials/tokens/fungible-token-cadence.md