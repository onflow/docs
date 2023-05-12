---
title: Node Operations
sidebar_position: 1
---

# Hello Node Operator!

Flow nodes are vital components of the Flow blockchain. These nodes are responsible for a variety of network operations to maintain the distributed ledger.

## Why run a node?

By running your own node, you have direct access to the evolving state of the network, without having to rely on third parties.
This increases privacy and security, reduces reliance on external servers, and helps balance load distribution.
By running a node, you also directly contribute to the security and decentralization of the whole network.

Flow multirole architecture makes it more scalable and provides several node types that you as a node operator can pick and choose from.

## Which node should you run?

There are different types of node that you can choose from based on your use case. The nodes differ in terms of the data that they sync and APIs that they provide.
There are three main types of nodes:
1. Full node
2. Light node
3. Archive node
Apart from this, there is a staked node that you can run if you want to become a node validator.


### Full node

### Light node (a.k.a observer node)

The light node is one of the easiest node to spin up and can be run by Dapp developers who need the latest block data available locally e.g. a wallet application that needs to track the latest block ID and height.
A light node downloads every block and locally verifies that the blocks that are received are the correct extension of the chain.
Light node have very low hardware and bandwidth requirements and eventually might be able to run on mobile phones or embdedded devices as well.
They do not participate in block production but provide access to chain data by serving the Access API.

To run a light node, follow this [guide](./observer-node.mdx).

### Archive node

The archive node provides a scalable and efficient way to access historical states.
It follows the chain and locally stores and indexes all the chain data - blocks, transaction, collections, state register values etc.
It serves the chain data using an API interface.
Additionally, it also allows read-only queries such as script execution that require the execution state register values.
It can be used to answer any queries from past data e.g. “what was the Flow account balance at height X?” where X is several thousand blocks in the past.
Since it stores all the historic data, it requires a large amount of disk space and is not suitable to be run on simple commodity hardware.

To run an archive node, follow this [guide](./archive-node.mdx).

### Access node
If you want local access to the protocol state data (blocks, collections, transactions) and do not want to use one of the community access nodes you can run an access node.
Dapp developers, chain explorers, chain analytics etc. who want exclusive access to chain data and not be subject to the rate-limits on the community access node can choose to run an access node.

An access node is staked but since it does not participate in the core Flow protocol, it does not receive any staking rewards.
To run an access node, see the [Running a staked node](#running-a-staked-node) section below.

Alternately, instead of running an access node, you can use the [Flow community](../access-api.mdx) access nodes or the ones run by any of the other node operators.

### Collection, Consensus, Verification and Execution node
If you want your node to participate in the nitty-gritty of Flow protocol and help in block or collection creation, transaction execution, result verification or block verification then you should run one of these four node roles.

Nodes with these roles are staked and also receive staking rewards.

### Running a staked node

To run a staked node (node type access, collection, consensus, verification or execution) the node must:
* be registered with sufficient stake
* be authorized by the service account

Before proceeding, ensure you have the stake required for your new node and that your node will be authorized by the service account (apply [here](https://www.onflow.org/node-validators)).

To set up a new Flow node you will need to complete the following steps:

1. [Provision](./node-setup.mdx) the machine on which your node will run.

2. [Generate and register](./node-bootstrap.mdx) your node identity.

3. [Start](./node-bootstrap.mdx#step-3---start-your-flow-node) your node!
