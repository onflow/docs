---
title: Machine Account
sidebar_label: Machine Account
description: Usage and Purpose of the Machine Account
---

### What is a Machine Account?

A Machine Account is a Flow account which is used autonomously by a node to interact with
system smart contracts. Machine Accounts contain Cadence resources granted to network 
participants which are used to participate in smart-contract-mediated protocols. Currently,
Machine Accounts are used in the [Epoch Preparation Protocol](./04-epoch-preparation.md), 
which prepares the network for the next epoch.

Your Machine Account is distinct from the account you use for staking your node (your Staking Account).
The Machine Account is intended for use by node software and does not have access to your staked tokens or staking rewards.

<Callout type="info">

Currently Machine Accounts are required only for `collection` and `consensus` nodes.

</Callout>

#### Creation

Machine Accounts are created during the [staking process](../../networks/flow-port/staking-guide.md) in Flow Port.

#### Funding

Machine Accounts must maintain a balance of liquid FLOW tokens to pay fees on transactions they
submit to system smart contracts. Typically very few transactions will be sent (about 1-5 per week)
however more may be required under certain circumstances and network conditions.

<Callout type="info">

Because some transactions sent by the Machine Account are system critical, we recommend maintaining
a balance sufficient to accommodate worst-case transaction submission numbers at all times. **See [here](./../node-ops/node-operation/monitoring-nodes.md#machine-account) for how to monitor.**

</Callout>

When creating a new machine account, we recommend initially funding with 0.005 FLOW for collection nodes and
0.25 FLOW for consensus nodes.

Machine account balances should be monitored and periodically refilled to ensure they have sufficient funds.
We recommend a minimum balance at all times of 0.002 FLOW for collection nodes and 0.1 FLOW for consensus nodes.

A node operator can easily withdraw their FLOW from their machine account if they decide they don't need them there any more.