---
title: Flow Core Contracts
description: The smart contracts that power the Flow protocol
sidebar_label: Core Smart Contracts
sidebar_position: 9
sidebar_custom_props:
  icon: 📝
  description: Explore the foundational contracts driving the Flow blockchain and learn how to utilize these vital building blocks for your own smart contract development.
keywords:
  - core contracts
  - Flow protocol
  - smart contracts
  - FungibleToken
  - FlowToken
  - ServiceAccount
  - FlowFees
  - FlowIDTableStaking
  - NonFungibleToken
  - MetadataViews
  - StakingCollection
  - NFTStorefront
  - AccountLinking
  - EVM
  - protocol contracts
  - Flow standards
  - blockchain infrastructure
  - contract standards
---

Flow relies on a set of core contracts that define key portions of the
Flow protocol.

These contracts control the following:

- Standard fungible token behavior. ([FungibleToken, FungibleTokenMetadataViews, FungibleTokenSwitchboard, Burner](./02-fungible-token.md))
- Flow Protocol Token. ([FlowToken](./03-flow-token.md))
- Flow Service Account. ([ServiceAccount, NodeVersionBeacon, RandomBeaconHistory](./04-service-account.md))
- Account, transaction and storage fee payments. ([FlowFees and FlowStorageFees](./05-flow-fees.md))
- Staking and delegation ([FlowIDTableStaking](./06-staking-contract-reference.md))
- Epochs ([FlowEpoch, FlowClusterQC, FlowDKG](./07-epoch-contract-reference.md))

There are other important contracts that aren't part of the core protocol
but are nevertheless important to developers on Flow:

- Standard Non-Fungible Token Behavior. ([NonFungibleToken](./08-non-fungible-token.md))
- NFT Metadata Standard. ([MetadataViews, ViewResolver](./09-nft-metadata.md))
- Staking Collection. ([StakingCollection](./11-staking-collection.md))
- NFT Storefronts. ([NFTStorefront](./10-nft-storefront.md))
- Account linking and Hybrid Custody. ([AccountLinking](./12-hybrid-custody.md))
- EVM interfacing contract. ([EVM](./13-evm.md))