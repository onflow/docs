---
sidebar_position: 1
title: Collections
description: Learn about Flow blockchain collections, how they optimize data transfer by linking blocks and transactions, and their role in the network architecture. Understand how collection nodes create and manage transaction collections.
keywords:
  - collections
  - blockchain collections
  - transaction collections
  - collection nodes
  - HotStuff consensus
  - transaction hashes
  - network optimization
  - collection clusters
  - transaction payload
  - Flow architecture
  - consensus nodes
  - collection retrieval
  - blockchain scaling
  - data optimization
---

# Collections

Collections link blocks and transactions together. Collection node clusters make these collections (via the HotStuff consensus algorithm), made up of an ordered list of one or more hashes of [signed transactions]. In order to optimize data, blocks don't contain transactions (as they do on Ethereum). The benefits are transaction data does not get transferred to consensus nodes on the network which optimizes transfer speed, and this architecture allows you to add collection clusters, which scales ingestion speed. Consensus nodes need to only agree on the order of transactions to be executed, they don't need to know the transaction payload, which makes blocks and collections lightweight. Collection nodes hold transaction payloads for anyone who requests them (for example, execution nodes).

![Screenshot 2023-08-17 at 19.50.39.png](_collection_images/Screenshot_2023-08-17_at_19.50.39.png)

## Collection retrieval

To use the Flow CLI to get the collection data, run the following command:

```sh
flow collections get caff1a7f4a85534e69badcda59b73428a6824ef8103f09cb9eaeaa216c7d7d3f -n mainnet
```

Find [more about the command in the CLI docs].

Collections can be obtained from the access node APIs, currently, there are two gRPC and REST APIs. You can find more information about them here:

[**gRPC Collection API**]

[**REST Collection API**]

There are multiple SDKs that implement the above APIs for different languages:

[**Javascript SDK**]

[**Go SDK**]

Find a list of all SDKs [here].

<!-- Relative links, will not render on page -->

[signed transactions]: ./transactions.md
[more about the command in the CLI docs]: ../../../build/tools/flow-cli/get-flow-data/get-blocks.md
[**gRPC Collection API**]: ../../../protocol/access-onchain-data/index.md#collections
[**REST Collection API**]: /http-api#tag/Collections
[**Javascript SDK**]: ../../../build/tools/clients/fcl-js/index.md
[**Go SDK**]: ../../../build/tools/clients/flow-go-sdk/index.md
[here]: ../../../build/tools/clients/index.md