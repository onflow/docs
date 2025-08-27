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

At its core, a decentralized application is defined by the [smart contracts](https://en.wikipedia.org/wiki/Smart_contract) it uses on the blockchain. Rather than relying on centralized application servers and databases, apps model their core application logic using smart contracts, often referred to as the "onchain" code.

It is therefore helpful to develop a clear model for your app that takes into account the data and logic that will exist in your smart contracts. In particular, it is important to differentiate between the parts of your app that must live on chain and those that should live off chain.

## How to Write Smart Contracts on Flow

Smart contracts on the Flow blockchain are implemented in [Cadence](https://github.com/onflow/cadence), a resource-oriented programming language specifically designed for smart contract development.

### Onboard to Cadence

To get started with Cadence, we recommended covering the introductory tutorials available in the [Flow Playground](https://play.flow.com/), a simple web IDE designed for learning Cadence.

### Configure Your Local Environment

To build confidently, you will want to set up the appropriate local environment and have an adequate test suite to ensure your smart contracts operate as intended. To do this, familiarize yourself with the following tools:

- [Flow CLI](../../../build/tools/flow-cli/index.md): A utility to directly interact with the chain and manage accounts and contracts.
- [Flow Emulator](../../../build/tools/emulator/index.md): A lightweight server that simulates the Flow blockchain (strongly recommended during development).
- [Flow Dev Wallet](https://github.com/onflow/fcl-dev-wallet/): A utility to simulate user wallets in development.
- [Visual Studio Code Extension](../../../build/tools/vscode-extension/index.md): An IDE integration for developing smart contracts.

## Storing Data on Flow

All apps will store important data on the blockchain, and some more than others -- especially NFT apps. You'll want to consider the following when storing data on the Flow blockchain.

### What does your data need to represent?

Permanence is a key property of blockchains; users trust that the data they store will continue to exist for years to come, and this is a defining characteristic of assets like NFTs. Therefore, well-designed digital assets store the information necessary to retain their value without external dependencies.

### Storage Limits & Fees

However, there are practical constraints to storing data on a blockchain. Developer and user accounts must retain a small amount of FLOW tokens, known as the storage fee, for bytes of data stored in their accounts. The minimum storage fee will grant each account a minimum storage amount. If an account holds assets that demand more bytes of storage, the account will need to retain more FLOW tokens to increase the storage amount according to Flow's [fee schedule](../basics/fees.md#storage). A more compact data model can keep storage needs down. \
 \
Furthermore, a single Flow transaction has a size limit of 4MB, which limits the rate at which large amounts of data can be transferred to the blockchain.

Lastly, a blockchain is not a content delivery network and therefore cannot serve media assets, such as videos, at the speeds expected by modern applications.

For these reasons, it usually isn't practical to store large media assets such as videos and high-definition images on the Flow blockchain. Instead, consider using an external storage solution.

### External Storage Networks

Decentralized storage networks such as IPFS allow you to store large digital assets off chain, but without relying on centralized servers. Rather than saving an entire asset to the Flow blockchain, you can save the content hash (known as a CID on IPFS) on the blockchain and then store the source file off-chain. This way, users can verify that the media file matches the digital asset.

IPFS files can be uploaded via a pinning service such as Pinata; see their [NFT tutorial](https://medium.com/pinata/how-to-create-nfts-like-nba-top-shot-with-flow-and-ipfs-701296944bf) for an example of how to use Pinata with Flow.

It's worth noting that IPFS files are served through [gateways](https://docs.ipfs.io/concepts/ipfs-gateway/), many of which leverage caching to provide fast response times. Cloudflare provides a [public IPFS Gateway](https://developers.cloudflare.com/distributed-web/ipfs-gateway), and Pinata also supports [dedicated gateways with custom domains](https://medium.com/pinata/announcing-dedicated-ipfs-gateways-60f599949ce).

## Using Existing Standards

The Flow blockchain has existing smart contract standards for both fungible and non-fungible tokens that you should implement when building your contracts.

### Non-Fungible Tokens (NFTs)

All NFTs on the Flow blockchain implement the [NonFungibleToken](../core-contracts/08-non-fungible-token.md) interface, allowing them to be compatible with wallets, marketplaces and other cross-app experiences.

See the [NFT Guide](../../../blockchain-development-tutorials/tokens/nft-cadence.md) for a guide on how to create a basic NFT contract
that conforms to the standard.

- [Non-Fungible Token (NFT) contract interface](../core-contracts/08-non-fungible-token.md)

### NFT Sales and Trading

Flow has a standard contract to facilitate both the direct sales and peer-to-peer trading of NFTs. The NFT storefront contract is useful for apps that want to provide an NFT marketplace experience.

- [NFT Storefront contract](https://github.com/onflow/nft-storefront)

### Fungible Tokens

Fungible tokens (i.e. coins, currencies) on the Flow blockchain, including the default cryptocurrency token FLOW, implement the [FungibleToken](../core-contracts/02-fungible-token.md) interface.

See the [FT Guide](../../../blockchain-development-tutorials/tokens/fungible-token-cadence.md) for a guide on how to create a basic fungible token
contract that conforms to the standard.

- [Fungible Token contract interface](../core-contracts/02-fungible-token.md)
