---
title: NFT Marketplace Overview
sidebar_label: Overview
description: An overview of the NFT marketplace guide
sidebar_position: 1
sidebar_custom_props:
  icon: 🔍
---

This guide provides the required information to the development teams looking to build NFT marketplaces on the Flow blockchain.

Developers should read this guide in conjunction with the other materials for developers looking to build on the Flow blockchain, especially the [Flow concepts](../../concepts/start-here.md).

## App-Custody vs. Self-Custody model

The app-custody model for an NFT marketplace is where the platform controls all the user accounts, the associated private keys, and, therefore, the assets in those accounts. The self-custody model for an NFT marketplace is where users control their assets and use their wallets to perform activities in the marketplace.

If you are building a general-purpose NFT marketplace, the preferred approach is self-custody, allowing users to interact with their third-party NFTs, and list them for sale.

**This guide will primarily focus on the general-purpose self-custody NFT marketplace platforms that enable users to utilize third-party NFTs on the marketplace platform for secondary sales.**

## Key capabilities

Below are the key capabilities an NFT marketplace would typically perform.

### Handling user accounts

Let users connect their wallets and ...

- Display the list of NFTs belonging to the user so that they can browse through to decide which ones to list for sale
- Display crypto balance of the user account

> **Note**: Want to jump right in? Open the [handling accounts guide](./handling-accounts).

### Minting NFTs

Allow users to upload images and other types of media to mint new NFTs. These NFTs, in turn, can be listed for sale by the users.

> **Note**: Want to jump right in? Open the [minting NFTs guide](./minting-nfts).

### Selling NFTs

Enabling sales on an NFT marketplace requires ...

- Enabling users to list their NFTs for sale
- Implement various sale methods, including auctions
- Enabling users to purchase NFTs for sale
- Display list of NFTs for sale
- Facilitating payment between buyers and sellers
- Facilitating royalty payments to the creators/IP-holders

> **Note**: Want to jump right in? Open the [selling NFTs guide](./selling-nfts).
