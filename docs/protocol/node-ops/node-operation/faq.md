---
title: Operator FAQ
sidebar_position: 1
---

# Operator FAQ

### Can anybody run a node? What is the approval process?

Anyone can run an [observer node](../light-nodes/observer-node.md).

Anyone can run an Access Node after registering and staking. See [Access Node Setup](../access-nodes/access-node-setup.md) for detailed instructions.

For the other node roles, individuals can go through an application process that involves asking about their background and experience contributing to decentralized projects. To pursue an application, please create an issue [here](https://github.com/onflow/flow-validator).

Pending approval from the governance committee, new node operators will be onboarded and invited to join a webinar to meet the team and share more about how they’ll grow the community. Node Operators are invited to join and participate in Flow's Node Validator Discord channel for setup questions and network announcements.

In the future, running a validator node on Flow will be permissionless.  See the [autonomy roadmap](https://flow.com/protocol-autonomy-roadmap) for details.

### How do I generate keys?

Please follow the instructions provided here: [Generate Your Node Keys](./node-bootstrap.md#generate-your-node-keys)

### How do I check on the status of my node?

Please follow the instructions provided here: [Monitoring nodes](./monitoring-nodes.md)

### Can I bootstrap and run a node at any time?

Flow allows nodes to join/leave the network each time a new epoch begins (roughly once per week).
See [Staking & Epochs](../../staking/index.md#epochs) for general information and [Node Setup](./node-bootstrap.md#timing) for a guide to running a new node.

### Would it hurt the network to have a node that constantly spins up and down?

All staked nodes except access nodes, have to be online at all time. A staked node, other than an access node, which is not online can cause severe degradation of network performance and will be subjected to slashing of rewards.
A way to prevent this is to check your equipment meets Flow's [recommended requirements](./node-provisioning.md#hardware-requirements), periodically checking for updates and announcements in Discord but also using a node monitoring system for when your node does go offline.

### Does Flow has a regular schedule for network upgrades?

Network upgrades (also referred to as "sporks") occur once every year. These are large-scale upgrades that require all node operators to upgrade software versions. 

Between network upgrades, there are also Height Coordinated Upgrades (HCU) which occur approximately once every two months. These are targeted upgrades for the transaction execution environment and require only Execution Nodes and Verification Nodes to upgrade software versions.

Upcoming sporks are announced in advance on the `#flow-validators-announcements` [Discord channel](https://discord.gg/flow) and on the [status](https://status.flow.com/) page.
The `#flow-validators-announcements` channel is also used to coordinate during the spork process with all the node operators.

### How do I update the node software during a network upgrade?

The new software version for a spork will be published in advance on [GitHub](https://github.com/onflow/flow-go/releases) and announced in the `#flow-validators-announcements` [Discord channel](https://discord.gg/flow).

### Is there any way to know if a node is currently online?

To verify if a node is online, please [setup metrics](./faq.md#how-do-i-check-on-the-status-of-my-node) for the node.

### Can I migrate a node to a new machine?

Yes, as long as you retain the `boostrap` information which includes the node staking key, networking key, network address and port from the old node to the new.
More on this [here](./node-migration.md)

### Where can I find how many nodes are currently running Flow?

If you are running a node, then you most definitely have this information on your node in the file `<your bootstrap dir>/public-root-information/node-infos.pub.json`. If you are not running a node, you can find this information by using a Cadence script to query the [Staking Smart Contract](../../../build/cadence/core-contracts/06-staking-contract-reference.md) or check [flowscan](https://www.flowscan.io/node).

### Why do I need to update my node's ulimit?

Flow nodes create network connections to other nodes on the network to participate in the protocol. The node's operating system represents
these connections as file descriptors, and uses soft and hard limits to control the number of open files. The node software uses these limits
to manage how many connections it will open and accept from other nodes. If the limit is too low, the node will not be able to communicate
with its peers, preventing it from functioning properly.
