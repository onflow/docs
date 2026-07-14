---
title: Data Indexers
sidebar_label: Data Indexers
sidebar_position: 4
---

# Data Indexers

When building applications that leverage Flow data, developers have multiple Data Indexers to choose from. These platforms offer flexible options, allowing you to index all data on Flow, including information from both the Cadence VM and EVM. Alternatively, if your application doesn't require Cadence, you can opt to index only EVM data. This flexibility ensures that you can tailor your data indexing strategy to fit the specific needs of your application.

### Envio

[Envio](https://envio.dev/?utm_source=flow&utm_medium=partner-docs) is a high-performance indexing framework that turns smart contract events into a queryable GraphQL API. Envio's HyperIndex natively supports indexing any EVM chain out of the box, so you can index Flow EVM using your own RPC as the data source. It supports event handlers in TypeScript, JavaScript, or ReScript, reorg handling, real-time and historical data, and multichain data aggregation, with fully managed hosting on Envio Cloud or self-hosting.

**Getting Started with Envio**

You can auto-generate an indexer from any verified contract with `pnpx envio init`. For a step-by-step walkthrough, see the [HyperIndex quickstart](https://docs.envio.dev/docs/HyperIndex/quickstart?utm_source=flow&utm_medium=partner-docs) and the [supported networks](https://docs.envio.dev/docs/HyperIndex/supported-networks?utm_source=flow&utm_medium=partner-docs) and [RPC data source](https://docs.envio.dev/docs/HyperIndex/rpc-sync?utm_source=flow&utm_medium=partner-docs) guides in the [Envio documentation](https://docs.envio.dev/?utm_source=flow&utm_medium=partner-docs).

See Envio's [performance benchmarks](https://docs.envio.dev/docs/HyperIndex/benchmarking?utm_source=flow&utm_medium=partner-docs).

### Moralis

[Moralis](https://moralis.io/) provides a robust suite of data APIs designed to support a wide array of blockchain applications. These APIs deliver both indexed and real-time data across 16+ blockchain networks, including comprehensive details on portfolio and wallet balances, NFT data, token metrics, price feeds, candlestick charts, and net worth calculations. Moralis enhances this data with additional layers of metadata, parsed events, and address labels to provide deeper insights and context.

**Getting Started with Moralis**

To integrate Moralis into your project, begin by [creating an account](https://moralis.io/). Detailed API references and integration guides are available in the Moralis [documentation](https://docs.moralis.io/). For step-by-step tutorials and use cases, visit their [YouTube channel](https://www.youtube.com/c/MoralisWeb3).

### **Alchemy**

[Alchemy](https://www.alchemy.com/) is a powerful blockchain development platform that provides enhanced APIs and advanced analytics to streamline the process of creating and scaling Web3 applications.

**Getting Started with Alchemy**

To begin using Alchemy, developers can [sign up for an account](https://www.alchemy.com/) on the Alchemy website. The platform offers extensive [documentation](https://docs.alchemy.com/) including API references, tutorials, and guides to help developers integrate Alchemy into their projects.

