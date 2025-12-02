---
title: Flow Networks
sidebar_position: 1
---

## About Flow Networks

Flow supports two virtual machine environments: **Flow Cadence** (native Flow smart contracts) and **Flow EVM** (EVM-equivalent smart contracts). Both environments share the same underlying Flow blockchain infrastructure and use FLOW as the native token for gas fees.

In addition to Mainnet, developers have access to the Testnet environment, which serves as an essential testing ground for applications and smart contracts prior to their deployment on Mainnet. This ensures that any potential issues can be identified and resolved in a controlled setting, mitigating risks associated with live deployment.

Furthermore, during network upgrades, Testnet receives updates ahead of Mainnet. This preemptive update process allows developers to comprehensively test their apps against the latest versions of the nodes, enhancements to the Cadence programming language, and core contract upgrades. This strategy guarantees that when these updates are eventually applied to Mainnet, applications and smart contracts will operate seamlessly, enhancing overall network stability and user experience.

## Flow Cadence Networks

Flow Cadence networks provide access to the native Flow blockchain using the Cadence programming language. Access Nodes are the node type that are most useful for developers, as they provide access to the Flow network via the following API endpoints.

### Flow Cadence Network Endpoints

| Network | GRPC                                   | Web GRPC             | REST                      |
| ------- | -------------------------------------- | -------------------- | ------------------------- |
| Mainnet | `access.mainnet.nodes.onflow.org:9000` | `mainnet.onflow.org` | `rest-mainnet.onflow.org` |
| Testnet | `access.devnet.nodes.onflow.org:9000`  | `testnet.onflow.org` | `rest-testnet.onflow.org` |

For more information on how to access these networks, refer to the following guides:

- [Flow Testnet](./accessing-testnet.md)
- [Flow Mainnet](./accessing-mainnet.md)

### Flow Access API

There are two primary ways to access onchain data within the Flow network: Access Nodes and Light nodes. Access Nodes are the node type that are most useful for developers, as they provide access to the Flow network via the following API endpoints:

- [Flow Access API](../access-onchain-data/index.md)
  - [Mainnet](./accessing-mainnet.md): `access.mainnet.nodes.onflow.org:9000`
  - [Testnet](./accessing-testnet.md): `access.devnet.nodes.onflow.org:9000`
- [Status Page](https://status.onflow.org/) - Network status page

## Flow EVM Networks

Flow EVM is an EVM-equivalent blockchain that combines the advantages of Flow, including security, low-cost gas, and native VRF with compatibility with existing blockchain applications tools and contracts. Flow EVM uses the standard Ethereum JSON-RPC API.

### Flow EVM Network Endpoints

#### Mainnet

| Name            | Value                                |
| --------------- | ------------------------------------ |
| Network Name    | Flow EVM Mainnet                     |
| Description     | The public RPC URL for Flow Mainnet  |
| RPC Endpoint    | https://mainnet.evm.nodes.onflow.org |
| Chain ID        | 747                                  |
| Currency Symbol | FLOW                                 |
| Block Explorer  | https://evm.flowscan.io              |

#### Testnet

| Name            | Value                                |
| --------------- | ------------------------------------ |
| Network Name    | Flow EVM Testnet                     |
| Description     | The public RPC URL for Flow Testnet  |
| RPC Endpoint    | https://testnet.evm.nodes.onflow.org |
| Chain ID        | 545                                  |
| Currency Symbol | FLOW                                 |
| Block Explorer  | https://evm-testnet.flowscan.io      |

### EVM Specification

- Flow EVM is a virtual EVM-based blockchain using the latest EVM byte-code interpreter
- Utilizes `FLOW` token for transactions
- The [EVM Gateway](https://github.com/onflow/flow-evm-gateway) exposes the standard EVM API (Ethereum JSON-RPC)
- Read more about the implementation in [FLIP 223: EVM integration interface](https://github.com/onflow/flips/blob/main/protocol/20231116-evm-support.md)

For detailed information about supported JSON-RPC methods, see the [Flow EVM Network Information](../../build/evm/networks.md) page.

## Rate limits

Rate limits for Flow Public Access nodes hosted by QuickNode are detailed [here](https://www.quicknode.com/docs/flow#endpoint-rate-limits).

## Running Your Own Node

If you're getting started, you don't need to run your own node and you can use the above public nodes. The public access nodes are rate-limited, so as your product matures you might want to run your own node. There are multiple options available:

- Start with a [Light (Observer) Node](../node-ops/light-nodes/observer-node.md).
- For Flow EVM applications, you can run your own [EVM Gateway](../node-ops/evm-gateway/evm-gateway-setup.md) to provide a dedicated private RPC endpoint, remove rate limits, and optionally sponsor gas fees for your users.
- You can also use a third-party provider like [Quicknode](https://www.quicknode.com/docs/flow).

Check out [Running a Node](../node-ops/light-nodes/observer-node.md) for more information.
