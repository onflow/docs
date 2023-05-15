---
title: Flow Core Contracts
description: The smart contracts that power the Flow protocol
---

Flow relies on a set of core contracts that define key portions of the
Flow protocol.

These contracts control the following:

- Standard fungible token behavior. ([FungibleToken](./fungible-token.mdx))
- Flow Protocol Token. ([FlowToken](./flow-token.mdx))
- Flow Service Account. ([ServiceAccount](./service-account.mdx))
- Account, transaction and storage fee payments. ([FlowFees and FlowStorageFees](./flow-fees.mdx))
- Staking and delegation ([FlowIDTableStaking](./staking-contract-reference.mdx))
- Epochs ([FlowEpoch](./epoch-contract-reference.mdx))

There are other important contracts that aren't part of the core protocol
but are nevertheless important to developers on Flow:

- Standard Non-Fungible Token Behavior. ([NonFungibleToken](./non-fungible-token.mdx))
- NFT Metadata Standard. ([MetadataViews](./nft-metadata.mdx))
- Staking Collection. ([StakingCollection](./staking-collection.mdx))
- NFT Storefronts. ([NFTStorefront](./nft-storefront.md))
