---
title: Epoch and Staking Terminology
sidebar_label: Epoch and Staking Terminology
description: Important Definitions for Epochs
---

<Callout type="warning">
  If you haven't read the staking introduction, please read that
  first. That document provides a non-technical overview of staking on Flow for
  all users and is a necessary prerequisite to this document.
</Callout>
<Callout type="warning">
  This document assumes you have some technical knowledge about the Flow
  blockchain and programming environment.
</Callout>

## Terminology

If any of the definitions are confusing, you can find more detail in the other sections of the technical docs.

**Staker:** Any user who has staked tokens for the Flow network.
A node operator is a staker, and a delegator is a staker as well.

**Node Operator:** A user who operates a node on the Flow network. Each node operator has a unique node resource
object they store in their account to perform staking operations.

**Node Operator Metadata:** This information is tracked for each node operator in the Flow network.
  - **Node ID:** 32 byte identifier for the node. Usually a hash of the node public key.
  - **Role:** Indicates what role the node operator is. (Collection, Consensus, Execution, Verification, Access)
  - **Networking Address:** The address that the node operator uses for networking. Using a hostname is highly encouraged.
  - **Networking Key:** The 64 byte ECDSA-P256 node operator public key for networking.
  - **Staking Key:** The 96 byte BLS12-381 public key for the node. 
    Used to sign node messages and votes for Quorum Certificate generation.
  - **Proof of Possession:** A 48 byte (96 hex characters) string that acts as cryptographic
    proof of ownership of the node's staking key.

**Delegator:** A user who delegates tokens to a node operator and receives rewards for their staked tokens, minus a fee
taken by the node operator. Each delegator stores a unique delegator resource object in their account
that allows them to perform staking operations.

- **Delegator Metadata:** This information is tracked for all delegators in the network.
  - **id:** The ID associated with a delegator. These IDs are assigned to delegators automatically
    by the staking contract and are only unique within an individual node operators' record.
  - **nodeID:** The ID of the node operator a user delegates to.

**Node Identity Table:** The record of all the nodes in the network, and their delegators.
The identity table keeps separate lists for the info about node operators and delegators.

<Callout type="warning">
  NOTE: The staking smart contract does not associate a node or delegator with
  an account address. It associates it with the assigned resource object that
  corresponds to that entry in the contract. There can be any number of these
  objects stored in the same account, and they can be moved to different
  accounts if the owner chooses.
</Callout>

**Epoch:** The period of time between changes in the identity table and reward payments. 
(Initially a week, measured in consensus views)
At the end of every epoch, insufficiently staked node operators are refunded their stake,
rewards are paid to those who are currently staked, committed tokens are marked as staked,
unstaking tokens are marked as unstaked, and unstaking requests are changed from staked to unstaking.

**Consensus View:** A internal detail that the Flow consensus algorithm, HotStuff, uses to measure time.
Views count the number of rounds in the consensus algorithm.
Each round/view the counter is incremented and a new block may be proposed.

**Seat/Slot:** The right to participate in the network as a node of a certain type
for a specific Epoch. There are a limited number of seats/slots for each node type per epoch.
However, these can be updated by the service committee to accommodate more nodes.
Current Slot Limits can be queried from the chain.
e.g.
The [get_role_counts.cdc](https://github.com/onflow/flow-core-contracts/blob/master/transactions/idTableStaking/scripts/get_role_counts.cdc) returns the current count for all node types.
```
$ flow scripts execute get_role_counts.cdc -n mainnet

Result: {1: 102, 2: 85, 5: 206, 4: 69, 3: 7}

```

**Candidate:** A node that has committed tokens for the next epoch but has not been accepted yet.
There is a limited number of node slots per epoch and candidate nodes are selected randomly,
so there is a chance that a candidate node will not be chosen to participate in the next epoch
because there aren't enough slots even if they meet all the other regular requirements

**Staking Auction Phase:** The period of time when nodes and delegators are able to submit staking operations
in preparation for the upcoming epoch. This phase is expected to take over 90% of the time of an epoch.

**Epoch Setup Phase:** The period of time after the staking auction, where nodes have to perform certain processes
to initialize the state and communication with other nodes for the next epoch.
These processes are called **Cluster Quorum Certificate Generation (QC)**, and **Distributed Key Generation (DKG)**.
If any node does not perform this initialization properly, it is not included in the next epoch's Identity Table.
This phase is expected to take less than 10% of the time of an epoch, near the end.

**Cluster Quorum Certificate Generation (QC):** A process by which nodes using the HotStuff consensus algorithm
submit signed messages in order to generate a certificate for bootstrapping HotStuff. Each collector cluster runs
a mini-version of HotStuff, and since clusters are randomized each epoch, a new quorum certificate is required
for each cluster each epoch.

**Distributed Key Generation (DKG):** Process for generating a shared public key to initialize the random beacon.
Consensus nodes use a shared whiteboard to communicate and submit final key vectors to generate a shared key.

**Epoch Commit Phase:** The final phase of an epoch, after the Epoch Setup Phase. In this phase, the identity table
has been finalized for the next epoch, all setup has been completed, and the network
is simply waiting for the next epoch to start.

**Service Event:** Special messages that are generated by the epoch smart contracts and included in execution results.
They enable communication between system smart contracts and the Flow protocol.
In other words, they serve as a communication mechanism between the execution state and the protocol state.
Service events are not any different that other Cadence events, except in the fact that
Flow nodes treat them differently because they are being emitted by the service account.

**Node and Delegator Staked Token Tracking Terms:**
  - **Tokens Committed:** The tokens that a user has committed to stake in the next epoch, but that aren't currently staked.
  - **Tokens Staked:** The tokens that a user has staked in the current epoch.
  - **Tokens Requested to Unstake:** The amount of tokens that a user has requested to be unstaked
    at the end of the current epoch (to be removed from the **tokens staked** pool).
  - **Tokens Unstaking:** The tokens that were unstaked at the beginning of the current epoch and
    are being held for an additional epoch holding period before being released.
  - **Tokens Unstaked:** Tokens that used to be committed or staked and have been unstaked.
  - **Tokens Rewarded:** Tokens that the user has received via staking rewards.

**Delegation Rewards Cut:** The percentage of a delegator's rewards that the node operators take. Initially set to 8%.

**Epoch Payout:** The total amount of tokens paid in rewards at the end of an epoch.
This value will change as the supply of FLOW changes. See the [rewards page](./03-schedule.md) for more details.

**Minimum Stake Requirement:** Each node type AND delegator has a requirement for the minimum number of FLOW
they have to commit to stake to be considered a valid staker and receive rewards.
If a node operator or delegator does not meet the minimum stake,
they will not be included in the next epoch and will not receive any rewards.

- Access Nodes: 100 FLOW
- Collection Nodes: 250,000 FLOW
- Consensus Nodes: 500,000 FLOW
- Execution Nodes: 1,250,000 FLOW
- Verification Nodes: 135,000 FLOW
- Delegators: 50 FLOW

There is no maximum stake limit.

