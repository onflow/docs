---
title: NFT Metadata Contract
sidebar_position: 9
sidebar_label: NFT Metadata
description: Learn about Flow's NFT metadata standards implemented through ViewResolver and MetadataViews contracts. Understand how to attach and manage onchain metadata for NFTs and integrate with the Flow NFT Catalog.
keywords:
  - NFT metadata
  - ViewResolver
  - MetadataViews
  - metadata standard
  - NFT catalog
  - onchain metadata
  - NFT interoperability
  - metadata views
  - FLIP-0636
  - NFT discovery
  - metadata implementation
  - Flow NFT
  - NFT standards
  - metadata integration
  - NFT optimization
---

# NFT Metadata Contract

The `ViewResolver` and `MetadataViews` contracts implement a standard to attach onchain metadata to NFTs. This standard was originally proposed in [FLIP-0636].

It is deployed at the same address as the `NonFungibleToken` contract interface.

Source: [ViewResolver.cdc]

Source: [MetadataViews.cdc]

| Network                   | Contract Address     |
| ------------------------- | -------------------- |
| Emulator                  | `0xf8d6e0586b0a20c7` |
| Cadence Testing Framework | `0x0000000000000001` |
| Testnet                   | `0x631e88ae7f1d7c20` |
| Mainnet                   | `0x1d7e57aa55817448` |

There exists a tool, [Flow NFT Catalog], which allows dapp developers to unlock interoperability of your NFT collection across the Flow ecosystem. This will help make your NFT collection's metadata more discoverable and interoperable.

To optimize your NFT collections for this catalog, you'll need to:

1. Update your NFT contract to support `ViewResolver` and `MetadataViews` with implementation of the [core NFT views].
2. Deploy the updated contract to both testnet and mainnet.
3. Afterwards, onboard your NFT to the Flow NFT catalog at [https://flow-nft-catalog.com].

<!-- Reference-style links, will not render on page -->

[FLIP-0636]: https://github.com/onflow/flips/blob/main/application/20210916-nft-metadata.md
[ViewResolver.cdc]: https://github.com/onflow/flow-nft/blob/master/contracts/ViewResolver.cdc
[MetadataViews.cdc]: https://github.com/onflow/flow-nft/blob/master/contracts/MetadataViews.cdc
[Flow NFT Catalog]: https://flow-nft-catalog.com
[core NFT views]: ../advanced-concepts/metadata-views.md
[https://flow-nft-catalog.com]: https://flow-nft-catalog.com