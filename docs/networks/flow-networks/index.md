---
title: Flow Networks
sidebar_position: 1
---

## About Flow Networks

In addition to Mainnet, developers have access to the Testnet environment, which serves as an essential testing ground for applications and smart contracts prior to their deployment on Mainnet. This ensures that any potential issues can be identified and resolved in a controlled setting, mitigating risks associated with live deployment.

Furthermore, during network upgrades, Testnet receives updates ahead of Mainnet. This preemptive update process allows developers to comprehensively test their apps against the latest versions of the nodes, enhancements to the Cadence programming language, and core contract upgrades. This strategy guarantees that when these updates are eventually applied to Mainnet, applications and smart contracts will operate seamlessly, enhancing overall network stability and user experience.

### How To Access These Networks?

- [Flow Testnet](./accessing-testnet.md)
- [Flow Mainnet](./accessing-mainnet.md)
- [Flow Previewnet](./accessing-previewnet.md)

### Network

There are two primary ways to access on-chain data within the Flow network; Access Nodes and Light nodes. Access Nodes are the node type that are most useful for developers, as they provide access to the Flow network via the following API endpoints:

- [Flow Access API](../node-ops/access-onchain-data/access-nodes/accessing-data/access-api.md)
  - [Mainnet](./accessing-mainnet.md): `access.mainnet.nodes.onflow.org:9000`
  - [Testnet](./accessing-testnet.md): `access.devnet.nodes.onflow.org:9000`
  - [Previewnet](./accessing-previewnet.md): `access.previewnet.nodes.onflow.org:9000`
- [Status Page](https://status.onflow.org/) - Network status page

### Running Your Own Node

If you’re getting started you don’t need to run your own node and you can use the above public nodes. The public access nodes are rate-limited, so as your product matures you might want to run your own node. There are multiple options available:

- Start with a [Light (Observer) Node](../node-ops/access-onchain-data/light-nodes/observer-node.md).
- You can also use a third-party provider like [Quicknode](https://www.quicknode.com/docs/flow).

Check out [Running a Node](../node-ops/access-onchain-data/light-nodes/observer-node.md) for more information.
