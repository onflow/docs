---
title: Flow Core Contracts
description: The smart contracts that power the Flow protocol
---

Flow relies on a set of core contracts that define key portions of the
Flow protocol.

These contracts control the following:

- Standard fungible token behavior. ([FungibleToken](./02-fungible-token.mdx))
- Flow Protocol Token. ([FlowToken](./03-flow-token.mdx))
- Flow Service Account. ([ServiceAccount](./04-service-account.mdx))
- Account, transaction and storage fee payments. ([FlowFees and FlowStorageFees](./05-flow-fees.mdx))
- Staking and delegation ([FlowIDTableStaking](./06-staking-contract-reference.mdx))
- Epochs ([FlowEpoch](./07-epoch-contract-reference.mdx))

There are other important contracts that aren't part of the core protocol
but are nevertheless important to developers on Flow:

- Standard Non-Fungible Token Behavior. ([NonFungibleToken](./08-non-fungible-token.mdx))
- NFT Metadata Standard. ([MetadataViews](./09-nft-metadata.mdx))
- Staking Collection. ([StakingCollection](./11-staking-collection.mdx))
- NFT Storefronts. ([NFTStorefront](./10-nft-storefront.md))
