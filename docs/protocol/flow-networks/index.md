---
title: Flow Networks
sidebar_position: 1
---

## About Flow Networks

:::note

This page provides information on Flow network RPCs. Flow EVM network RPCs can be found [here](../../build/evm/networks)

:::

In addition to Mainnet, developers have access to the Testnet environment, which serves as an essential testing ground for applications and smart contracts prior to their deployment on Mainnet. This ensures that any potential issues can be identified and resolved in a controlled setting, mitigating risks associated with live deployment.

Furthermore, during network upgrades, Testnet receives updates ahead of Mainnet. This preemptive update process allows developers to comprehensively test their apps against the latest versions of the nodes, enhancements to the Cadence programming language, and core contract upgrades. This strategy guarantees that when these updates are eventually applied to Mainnet, applications and smart contracts will operate seamlessly, enhancing overall network stability and user experience.

### How To Access These Networks?

| Network | GRPC                                   | Web GRPC             | REST                      |
| ------- | -------------------------------------- | -------------------- | ------------------------- |
| Mainnet | `access.mainnet.nodes.onflow.org:9000` | `mainnet.onflow.org` | `rest-mainnet.onflow.org` |
| Testnet | `access.devnet.nodes.onflow.org:9000`  | `testnet.onflow.org` | `rest-testnet.onflow.org` |

For more information on how to access these networks, refer to the following guides:

- [Flow Testnet](./accessing-testnet.md)
- [Flow Mainnet](./accessing-mainnet.md)

<Callout type="info">
You can use these public GRPC hosts directly with forked tests via `flow test --fork-host <host>`. See the CLI reference: [Fork Testing Flags](../../build/tools/flow-cli/tests.md#fork-testing-flags).
</Callout>

### Network

There are two primary ways to access onchain data within the Flow network; Access Nodes and Light nodes. Access Nodes are the node type that are most useful for developers, as they provide access to the Flow network via the following API endpoints:

- [Flow Access API](../access-onchain-data/index.md)
  - [Mainnet](./accessing-mainnet.md): `access.mainnet.nodes.onflow.org:9000`
  - [Testnet](./accessing-testnet.md): `access.devnet.nodes.onflow.org:9000`
- [Status Page](https://status.onflow.org/) - Network status page

### Rate limits

Rate limits for Flow Public Access nodes hosted by QuickNode are detailed [here](https://www.quicknode.com/docs/flow#endpoint-rate-limits).

### Running Your Own Node

If you’re getting started you don’t need to run your own node and you can use the above public nodes. The public access nodes are rate-limited, so as your product matures you might want to run your own node. There are multiple options available:

- Start with a [Light (Observer) Node](../node-ops/light-nodes/observer-node.md).
- You can also use a third-party provider like [Quicknode](https://www.quicknode.com/docs/flow).

Check out [Running a Node](../node-ops/light-nodes/observer-node.md) for more information.
