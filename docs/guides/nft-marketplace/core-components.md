---
title: Core Components
description: Learn about the key components of NFT marketplaces
sidebar_label: Core Components
sidebar_position: 3
sidebar_custom_props:
  icon: 🧱
---

Following are the core components for any NFT marketplace solution on the Flow blockchain. Throughout the guide, these will be referred to.

- [NFT Standard](https://github.com/onflow/flow-nft): Every NFT minted on Flow should follow this standard.
- [Fungible Token Standard](https://github.com/onflow/flow-ft): All fungible tokens on Flow follow this standard. NFTs purchased on an NFT marketplace will be paid for using a fungible token in many scenarios.
- [FLOW Token](../../build/key-concepts/flow-token.md): Native currency of the Flow blockchain used to pay for the transaction fees. NFT buyers can use FLOW tokens to buy NFTs in a marketplace.
- [NFT Metadata Standard](https://github.com/onflow/flow-nft/#nft-metadata): A generalized framework for NFTs on Flow to expose their metadata. The framework described already has [a mechanism specified to render the basic representation](https://github.com/onflow/flow-nft/#list-of-common-views) of an NFT.
- [Flow NFT Catalog](https://github.com/dapperlabs/nft-catalog): NFT marketplaces can use this on-chain registry of NFTs to obtain the list of NFTs owned by an account and obtain display metadata for those NFTs and their collections. Developers should use the [example scripts](https://github.com/dapperlabs/nft-catalog#using-the-catalog-for-marketplaces-and-other-nft-applications) in conjunction with the [NFT Metadata Standard](https://github.com/onflow/flow-nft/#nft-metadata).
- [NFT Storefront Contract](https://github.com/onflow/nft-storefront): ​​Contract used by almost all Flow NFT marketplaces for creating NFT sale listings. Note that you can directly use the version of this contract already deployed on the Mainnet.
- [FCL (Flow Client Library)](../../tools/clients/fcl-js/): This library is like web3.js in Ethereum. Application frontend will use FCL to interact with user wallets and the blockchain. JS-based backends of applications can also use it to interact with the blockchain.
- Flow SDKs: Multiple SDKs are available in different programming languages ([Go](../../tools/clients/flow-go-sdk/index.mdx), [Java](https://github.com/the-nft-company/flow-jvm-sdk)) for Flow application backends to interact with the blockchain.

## Coming from Ethereum

If you are coming from Ethereum, the following list shows corresponding modules and services available on Flow.

| Resource                            | Ethereum                | Flow                                                                                                  |
| ----------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------- |
| Smart Contract Programming Language | Solidity                | [Cadence](../../overview/about/cadence.md)                                                                     |
| Fungible Token Standard             | ERC-20                  | [Flow Fungible Token Standard](https://github.com/onflow/flow-ft)                                     |
| NFT Standard                        | ERC-721/ERC-1155        | [Flow NFT Token Standard](https://github.com/onflow/flow-nft)                                         |
| NFT Metadata Standard               | ERC-721                 | [Flow NFT Metadata Standard](https://github.com/onflow/flow-nft/#nft-metadata)                        |
| Native Crypto Currency              | ETH                     | [FLOW](../../build/key-concepts/flow-token.md)                                                                  |
| Wallet Interaction Library          | web3.js                 | [Flow Client Library (FCL)](../../tools/clients/)                                                     |
| Blockchain Interaction SDK          | web3.js                 | [Language Clients](../../tools/clients/)                                                              |
| Block Explorer                      | Etherscan               | [Block Explorers](../../tools/toolchains/)                                                            |
| Node Service Providers              | Infura                  | [Official Flow Access Nodes](https://flowscan.org/staking/nodes)                                      |
| Wallets                             | Metamask, WalletConnect | [Blocto](https://portto.com/), [Dapper Wallet](https://www.meetdapper.com/)                           |

