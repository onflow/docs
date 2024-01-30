---
title: Smart Contracts for Flow Dapps
sidebar_label: Smart Contracts
---

Decentralized applications (dapps) derive their core functionality from the [smart contracts](https://en.wikipedia.org/wiki/Smart_contract) employed on the blockchain, distinguishing them from centralized application servers and databases. These smart contracts, often termed "on-chain" code, form the foundation of a dapp.

To create a robust model for your dapp, it's crucial to consider the data and logic residing in your smart contracts. A clear distinction between on-chain and off-chain components is essential.

## Writing Smart Contracts on Flow

Smart contracts on the Flow blockchain are crafted using [Cadence](https://github.com/onflow/cadence), a resource-oriented programming language tailored for smart contract development.

### Onboarding to Cadence

For a seamless start with Cadence, explore the introductory tutorials available in the [Flow Playground](https://play.flow.com/), a user-friendly web IDE designed for learning Cadence.

### Configuring Your Local Environment

To ensure confidence in your development, set up the appropriate local environment and create a robust test suite to verify that your smart contracts function as intended. Familiarize yourself with the following tools:

- [Flow CLI](../tools/flow-cli/): A utility to directly interact with the chain and manage accounts and contracts.
- [Flow Emulator](../tools/emulator/): A lightweight server simulating the Flow blockchain (highly recommended during development).
- [Flow Dev Wallet](https://github.com/onflow/fcl-dev-wallet/): A utility for simulating user wallets in development.
- [Visual Studio Code Extension](../tools/vscode-extension/): An IDE integration for developing smart contracts.
- [JS Testing Framework](https://github.com/onflow/flow-js-testing): A framework to test your smart contracts.

## Storing Data on Flow

All dapps will store crucial data on the blockchain, with some requiring more extensive data storage, particularly NFT dapps. Consider the following when storing data on the Flow blockchain.

### Understanding Your Data

Permanence is a crucial aspect of blockchains. Users trust that the data they store will endure for years, a defining characteristic for assets like NFTs. Well-designed digital assets store information essential for retaining their value without external dependencies.

### Storage Limits & Fees

Practical constraints exist when storing data on a blockchain. Developer and user accounts must retain a small amount of FLOW tokens, known as the storage fee, for bytes of data stored in their accounts. A more compact data model can minimize storage needs. Additionally, a single Flow transaction has a size limit of 4MB, impacting the rate at which large data amounts can be transferred to the blockchain.

Blockchain is not a content delivery network and cannot serve media assets, like videos, at the speeds expected by modern applications. Therefore, it's impractical to store large media assets directly on the Flow blockchain. Consider using external storage solutions.

### External Storage Networks

Decentralized storage networks such as IPFS enable the storage of large digital assets off-chain, without relying on centralized servers. Instead of saving an entire asset to the Flow blockchain, save the content hash (CID on IPFS) on the blockchain and store the source file off-chain. This approach allows users to verify that the media file matches the digital asset.

IPFS files can be uploaded via a pinning service like Pinata. Refer to their [NFT tutorial](https://medium.com/pinata/how-to-create-nfts-like-nba-top-shot-with-flow-and-ipfs-701296944bf) for an example of using Pinata with Flow.

It's important to note that IPFS files are served through [gateways](https://docs.ipfs.io/concepts/ipfs-gateway/), some of which leverage caching to provide fast response times. Cloudflare offers a [public IPFS Gateway](https://developers.cloudflare.com/distributed-web/ipfs-gateway), and Pinata supports [dedicated gateways with custom domains](https://medium.com/pinata/announcing-dedicated-ipfs-gateways-60f599949ce).

## Utilizing Existing Standards

The Flow blockchain has established smart contract standards for both fungible and non-fungible tokens that you should implement when building your contracts.

### Non-Fungible Tokens (NFTs)

All NFTs on the Flow blockchain implement the [NonFungibleToken](../references/core-contracts/08-non-fungible-token.md) interface, ensuring compatibility with wallets, marketplaces, and other cross-app experiences.

- [Non-Fungible Token (NFT) contract interface](../references/core-contracts/08-non-fungible-token.md)

### NFT Sales and Trading

Flow has a standard contract facilitating both direct sales and peer-to-peer trading of NFTs. The NFT storefront contract is useful for dapps aiming to provide an NFT marketplace experience.

- [NFT Storefront contract](https://github.com/onflow/nft-storefront)

### Fungible Tokens

Fungible tokens (e.g., coins, currencies) on the Flow blockchain, including the default cryptocurrency token FLOW, implement the [FungibleToken](../references/core-contracts/02-fungible-token.md) interface.

- [Fungible Token contract interface](../references/core-contracts/02-fungible-token.md)
