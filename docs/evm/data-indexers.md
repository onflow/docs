---
title: Data Indexers
sidebar_label: Data Indexers
sidebar_position: 9
---

# Data Indexers

When building applications that leverage Flow data, developers have multiple Data Indexers to choose from. These platforms offer flexible options, allowing you to index all data on Flow, including information from both the Cadence VM and EVM. Alternatively, if your application doesn't require Cadence, you can opt to index only EVM data. This flexibility ensures that you can tailor your data indexing strategy to fit the specific needs of your application.

## EVM & Cadence

### SimpleHash

[SimpleHash](https://simplehash.com/) is a comprehensive multi-chain NFT data platform that provides developers with easy access to token data across 60+ blockchain networks. It offers a robust API for querying NFT metadata, media, collection details, sales, floor prices, listings, and bids, streamlining the process of building NFT-powered applications.

**Getting Started with SimpleHash**

Developers can begin using SimpleHash by [signing up for an API key](https://simplehash.com/) on their website. The platform provides comprehensive [documentation](https://docs.simplehash.com/reference/overview) to help developers integrate SimpleHash into their projects.

## **EVM Only**

### Moralis

[Moralis](https://moralis.io/) provides a robust suite of data APIs designed to support a wide array of blockchain applications. These APIs deliver both indexed and real-time data across 16+ blockchain networks, including comprehensive details on portfolio and wallet balances, NFT data, token metrics, price feeds, candlestick charts, and net worth calculations. Moralis enhances this data with additional layers of metadata, parsed events, and address labels to provide deeper insights and context.

**Getting Started with Moralis**

To integrate Moralis into your project, begin by [creating an account](https://moralis.io/). Detailed API references and integration guides are available in the Moralis [documentation](https://docs.moralis.io/). For step-by-step tutorials and use cases, visit their [YouTube channel](https://www.youtube.com/c/MoralisWeb3).

### Alchemy

[Alchemy](https://www.alchemy.com/) is a powerful blockchain development platform that provides enhanced APIs and advanced analytics to streamline the process of creating and scaling Web3 applications.

**Getting Started with Alchemy**

To begin using Alchemy, developers can [sign up for an account](https://www.alchemy.com/) on the Alchemy website. The platform offers extensive [documentation](https://docs.alchemy.com/) including API references, tutorials, and guides to help developers integrate Alchemy into their projects.

### Envio

[Envio](https://envio.dev) is a highly performant set of data indexing tools for creating custom APIs. Flow Dapp developers can use [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) to listen for events, aggregate data to their custom use-case and serve that data over a graphql API. Developers can self host their API or deploy it to the Envio hosted service. 

**Getting Started with Envio**

The easiest way to get started with Envio is via the [get started documentation](https://docs.envio.dev/docs/HyperIndex/getting-started). Envio supports templates for ease such as an ERC20 template or simply use the contract import feature and pass it an ABI file to generate a boilerplate indexer.
