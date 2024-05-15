---
title: NFT Metadata Contract
sidebar_position: 9
sidebar_label: NFT Metadata
---

The `ViewResolver` and `MetadataViews` contracts implement a standard to attach on-chain metadata
to NFTs. This standard was originally proposed in [FLIP-0636](https://github.com/onflow/flips/blob/main/application/20210916-nft-metadata.md).

It is deployed at the same address as the `NonFungibleToken` contract interface.

Source: [ViewResolver.cdc](https://github.com/onflow/flow-nft/blob/master/contracts/ViewResolver.cdc)

Source: [MetadataViews.cdc](https://github.com/onflow/flow-nft/blob/master/contracts/MetadataViews.cdc)

| Network           | Contract Address     |
| ----------------- | -------------------- |
| Emulator          | `0xf8d6e0586b0a20c7` |
| Cadence Testing Framework | `0x0000000000000001` |
| PreviewNet        | `0xb6763b4399a888c8` |
| Testnet | `0x631e88ae7f1d7c20` |
| Mainnet           | `0x1d7e57aa55817448` |


There exists a tool, [Flow NFT Catalog](https://flow-nft-catalog.com), which enables dapp developers the ability to unlock interoperability of your NFT collection across the Flow ecosystem. This will help make your NFT collection’s metadata more discoverable and interoperable.

To optimize your NFT collections for this catalog, you’ll need to:

1. Update your NFT contract to support `ViewResolver` and `MetadataViews` with implementation of the [core NFT views](../advanced-concepts/metadata-views.md).
2. Deploy the updated contract to both testnet and mainnet.
3. Afterwards, onboard your NFT to the Flow NFT catalog at [https://flow-nft-catalog.com](https://flow-nft-catalog.com).
