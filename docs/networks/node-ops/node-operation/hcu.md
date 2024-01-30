---
title: Height coordinated upgrade (HCU)
sidebar_label: Height coordinated upgrade
---

## Overview

To enables rapid development of the Flow Protocol, the height coordinated upgrade method is used to roll out non-breaking changes such as bug fixes,
feature implementations and security fixes.

## HCU versus Spork

A [spork](./spork.md) requires a coordinated network upgrade process where node operators upgrade their node software and
re-initialize with a consolidated representation of the previous spork's state.
It is used to roll out changes which may be non-backward compatible with respect to the protocol and the execution state.
Spork entails a network downtime as all nodes in the system are upgraded and brought back online.
Sporks are only executed once every quarter.

A height coordinated upgrade (HCU) on the other hand allows the execution and the verification nodes to be upgraded without stopping the network.
There is no network downtime during an HCU but the transaction execution will stop for few minutes while the execution nodes restart.
Currently, an HCU is only used to update the execution and the verification nodes.
For other node types, a simple rolling upgrade is used where operators are asked to upgrade their nodes async.

## HCU process

The HCU is executed in two parts.

The first part is executed by the service committee. In this, the version boundary at which the execution nodes and verification nodes should stop is set on chain by submitting the [set_version_boundary](https://github.com/onflow/flow-core-contracts/blob/master/transactions/nodeVersionBeacon/admin/set_version_boundary.cdc) transaction.
The version boundary includes the block height at which the two node types should stop and the new node software version that the nodes should compare after a restart.


The second part is executed by the node operator. In this the node operator, monitors the execution and verification node that they are running. When the nodes reach the height set on chain, they stop if their version is lower then the version specified in the version boundary.
At this point, the operator should update the node version to the new node software version and start the node again. The node will continue from where it left off.

The block height and the node version will be announced by the Flow team on Discord as well as the [forum page](https://forum.onflow.org/c/mainnet-sporks/36).
It can also be directly queried from the chain using the following script.

```
TODO: insert flow cli command here to query the block version details.
```
