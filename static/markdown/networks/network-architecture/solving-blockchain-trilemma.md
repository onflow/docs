---
title: Solving the blockchain trilemma
sidebar_label: Solving the blockchain trilemma
sidebar_position: 2
---

# Solving the blockchain trilemma

In a monolithic architecture, all nodes perform every task. As network usage grows, the transaction processing capacity of the individual nodes becomes a limiting factor, restricting the network’s throughput and latency. The amount of data that can be stored on-chain is limited since nodes have a finite storage capacity. The only way to scale monolithic blockchains is by increasing the capacity of each node by adding more CPU, memory, and storage (i.e. vertical scaling, an approach taken by Solana). However, this solution comes at the cost of decentralization. As nodes scale vertically, they become more expensive to run, and eventually, only a few operators can afford to run such high-performance, high-capacity nodes. Worse, energy consumption for every node in the network increases over time, making the chain environmentally unsustainable.

Through its multi-role architecture, Flow implements a modular pipeline for processing transactions. This design allows the network to scale by tuning the level of decentralization at each specific step without sharding the state and fragmenting the network into smaller security zones.

The modular pipeline is composed of Collection, Consensus, Execution and Verification Nodes.

![pipeline](images/pipeline.png)

## Separating Consensus from Compute

At a high level, the pipeline essentially separates consensus from transaction computation. Non-deterministic (or “subjective”) processes such as determining the inclusion and order of transactions are decided by the broadly decentralized consensus committee. The deterministic (or “objective”) task of computing the result of those ordered transactions is done independently by a small number of specialized execution nodes.

Collection and consensus are highly decentralized and achieve high levels of redundancy through a large number of lightweight, cost-effective nodes, numbering in the thousands, operated by several hundred different operators. These steps guarantee resilient transaction ordering (assuming that a malicious actor can only compromise a limited number of nodes).

In comparison, transaction execution has low decentralization and redundancy (10 or less) with more powerful and expensive nodes. To accommodate for the anticipated growth of on-chain state without sharding, only the execution nodes have to be scaled vertically. All other node types can continue to run low-cost hardware. The execution nodes may eventually be scaled up to small data centers.

![scaling_flow](images/scaling_flow.png)

Low decentralization for transaction execution might appear to compromise decentralization of the whole network, as it is conceivable that a malicious actor might compromise a dominant fraction of nodes participating in execution. However, correctness of the transaction results is still guaranteed by the verification step, which also requires reasonably high redundancy, again with a large number of lighter and less expensive verification nodes to withstand compromisation attempts.

Every node in Flow makes the protocol stronger, and the network can grow as needed to achieve different objectives:
- More censorship resistance? Add more collection nodes
- More decentralized block production? Add more consensus nodes
- Need to accommodate higher transaction throughput and state storage? Scale up execution nodes
- Do node operators want to reinforce network security with modest node hardware and low stake? Add more verification nodes.
- Need access to chain data locally? Add access nodes.

In contrast, when traditional Layer 1 blockchains add more nodes to increase decentralization, they do so without providing any additional benefits.

![verying_redundancy](images/varying_redudancy.png)

> Flow’s architectural goals are to provide a throughput of at least 1M TPS, ingest at least ½ GB of transaction data per second and store and serve a very large state of one Patebyte and beyond.

Thus, Flow’s multi-role architecture solves the blockchain trilemma:

1. **Scalability**: Scale to thousands of times higher throughput and on-chain storage capacity.

2. **Decentralization**: Except for the execution nodes, all nodes are light weight and low cost, lowering the barrier to entry and ensuring participation from a diverse set of node operators—big and small

3. **Security**: Maintain a shared non-sharded execution environment for all operations on the network and use a secure in-built platform to build on.

![trilemma_solved](images/flow_trillema_solved.png)