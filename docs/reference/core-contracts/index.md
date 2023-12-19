---
title: Flow Core Contracts
description: The smart contracts that power the Flow protocol
sidebar_position: 1
sidebar_label: Core Smart Contracts
---

Flow relies on a set of core contracts that define key portions of the
Flow protocol.

These contracts control the following:

- Standard fungible token behavior. ([FungibleToken](./02-fungible-token.md))
- Flow Protocol Token. ([FlowToken](./03-flow-token.md))
- Flow Service Account. ([ServiceAccount](./04-service-account.md))
- Account, transaction and storage fee payments. ([FlowFees and FlowStorageFees](./05-flow-fees.md))
- Staking and delegation ([FlowIDTableStaking](./06-staking-contract-reference.md))
- Epochs ([FlowEpoch](./07-epoch-contract-reference.md))

There are other important contracts that aren't part of the core protocol
but are nevertheless important to developers on Flow:

- Standard Non-Fungible Token Behavior. ([NonFungibleToken](./08-non-fungible-token.md))
- NFT Metadata Standard. ([MetadataViews](./09-nft-metadata.md))
- Staking Collection. ([StakingCollection](./11-staking-collection.md))
- NFT Storefronts. ([NFTStorefront](./10-nft-storefront.md))
