---
title: Launch a Token
sidebar_label: Launch a Token
description: Launch a Fungible or Non-Fungible Token on the Flow Network.
sidebar_position: 4
sidebar_custom_props:
  icon: 📓
---

## Token Standards

It is important that Flow has Token Standards for [Fungible tokens](../build/core-contracts/flow-ft/index.md) and [Non-fungible](../build/core-contracts/flow-nft/index.md) tokens. This allows applications and other smart contracts to interact with your token in a predictable way.


### Non-Fungible Tokens (NFTs)

All NFTs on the Flow blockchain implement the [NonFungibleToken](../build/core-contracts/08-non-fungible-token.md) interface, allowing them to be compatible with wallets, marketplaces and other cross-app experiences.

- [Non-Fungible Token (NFT) contract interface](../build/core-contracts/08-non-fungible-token.md)

### Fungible Tokens

The FLOW token is a fungible token, [More Information](../build/core-contracts/flow-token).  Fungible tokens can be used for various reasons on the Flow blockchain.

- In order to create a fungible token, the [Fungible tokens](../build/core-contracts/fungible-token), interface has to be implemented.


## How to Launch a Fungible Token

There is a lot to consider when creating a token, strong tokenomics, private or public sale, distribution, and finally an organized launch on centralized and decentralized exchanges. These concepts will not be discussed here, only how to create a token.

- [Flow Token Standard](https://github.com/onflow/flow-ft) - minimum requirements to implement a safe, secure, easy to understand and easy to use fungible token contract

Example of a Fungible Token Contract [ExampleToken](https://github.com/onflow/flow-ft/blob/master/contracts/ExampleToken.cdc). See how to deploy contracts [here](./smart-contracts/deploying.mdx).


# How to Launch a Non-Fungible Token (NFT)

A NFT collection is very flexible and can be used for many different use cases. The most common use case is for digital art, but it can also be used for collectibles, game items, and more. Keeping this in mind, a tool will help build the NFT collection metadata. 

A few resources to help start your NFT collection:

- [Touchstone](https://www.touchstone.city/guide/en/welcome)
- [Emeralkd Academy: Quickstart](https://academy.ecdao.org/en/quickstarts/1-non-fungible-token)

**NFT Catalog**

After getting your NFT collection created, look into your collection registered on the [NFT catalog](../tools/nft-catalog/overview.mdx). The NFT Catalog will allow developers to easily discover your NFT collection. This will give them the opportunity to integrate your collection into their applications.

## Final Words

We have given in this guide a number of guidelines and templates to help you get around the cold start problem. 

More Resources:
- [Flow Token List](https://github.com/FlowFans/flow-token-list) - how to add a token to the Flow native token list
- [Flowscan Request Form](https://docs.google.com/forms/d/e/1FAIpQLSdMiIkj2goF3Ib7wJHRb-YNvruwBghq1NP1IOfz4p2smIFp0w/viewform) | Token Metadata - please fill this out to update your token metadata on Flowscan
