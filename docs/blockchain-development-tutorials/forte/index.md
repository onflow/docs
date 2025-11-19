---
title: Forte Network Upgrade
description: A series of tutorials covering new features and capabilities introduced in the Forte network upgrade for Flow blockchain.
sidebar_position: 2
keywords:
  - Forte
  - network upgrade
  - Flow blockchain
  - Flow Actions
  - scheduled transactions
  - blockchain automation
  - DeFi workflows
  - time-based execution
  - composable protocols
---

# Forte Network Upgrade Tutorials

This series covers the new features and capabilities introduced in the Forte network upgrade for Flow blockchain. The Forte upgrade brings powerful new tools for building sophisticated decentralized finance (DeFi) applications, including automated DeFi workflows and time-based smart contract execution.

## What's new in Forte

The Forte network upgrade introduces several features that expand Flow's capabilities:

- **Flow Actions**: Standardized interfaces for building composable DeFi workflows.
- **Scheduled Transactions**: Time-based smart contract execution and blockchain automation.
- **Enhanced Composability**: New patterns for building complex, interconnected applications.

## Deployed Contract Addresses

:::info

Forte is **live** on emulator, testnet, and Mainnet.

:::

import CopyButton from '@site/src/components/CopyButton';

| Contract                           | Testnet                                                                                                                          | [CLI](https://developers.flow.com/build/tools/flow-cli/dependency-manager)                                                                             | Mainnet                                                                                                                  | [CLI](https://developers.flow.com/build/tools/flow-cli/dependency-manager)                                                                             |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| DeFiActions                        | [0x0b11b1848a8aa2c0](https://testnet.flowscan.io/contract/A.0b11b1848a8aa2c0.DeFiActions?tab=deployments)                        | <CopyButton text="flow dependencies install testnet://0x0b11b1848a8aa2c0.DeFiActions" title="Copy install command (testnet)" />                        | [0x6d888f175c158410](https://flowscan.io/contract/A.6d888f175c158410.DeFiActions?tab=deployments)                        | <CopyButton text="flow dependencies install mainnet://0x6d888f175c158410.DeFiActions" title="Copy install command (mainnet)" />                        |
| DeFiActionsUtils                   | [0x0b11b1848a8aa2c0](https://testnet.flowscan.io/contract/A.0b11b1848a8aa2c0.DeFiActionsUtils?tab=deployments)                   | <CopyButton text="flow dependencies install testnet://0x0b11b1848a8aa2c0.DeFiActionsUtils" title="Copy install command (testnet)" />                   | [0x6d888f175c158410](https://flowscan.io/contract/A.6d888f175c158410.DeFiActionsUtils?tab=deployments)                   | <CopyButton text="flow dependencies install mainnet://0x6d888f175c158410.DeFiActionsUtils" title="Copy install command (mainnet)" />                   |
| FungibleTokenConnectors            | [0x4cd02f8de4122c84](https://testnet.flowscan.io/contract/A.4cd02f8de4122c84.FungibleTokenConnectors?tab=deployments)            | <CopyButton text="flow dependencies install testnet://0x4cd02f8de4122c84.FungibleTokenConnectors" title="Copy install command (testnet)" />            | [0x0c237e1265caa7a3](https://flowscan.io/contract/A.0c237e1265caa7a3.FungibleTokenConnectors?tab=deployments)            | <CopyButton text="flow dependencies install mainnet://0x0c237e1265caa7a3.FungibleTokenConnectors" title="Copy install command (mainnet)" />            |
| ERC4626Utils                       | [0x7014dcffa1f14186](https://testnet.flowscan.io/contract/A.7014dcffa1f14186.ERC4626Utils?tab=deployments)                       | <CopyButton text="flow dependencies install testnet://0x7014dcffa1f14186.ERC4626Utils" title="Copy install command (testnet)" />                       | [0x04f5ae6bef48c1fc](https://flowscan.io/contract/A.04f5ae6bef48c1fc.ERC4626Utils?tab=deployments)                       | <CopyButton text="flow dependencies install mainnet://0x04f5ae6bef48c1fc.ERC4626Utils" title="Copy install command (mainnet)" />                       |
| ERC4626PriceOracles                | [0x7014dcffa1f14186](https://testnet.flowscan.io/contract/A.7014dcffa1f14186.ERC4626PriceOracles?tab=deployments)                | <CopyButton text="flow dependencies install testnet://0x7014dcffa1f14186.ERC4626PriceOracles" title="Copy install command (testnet)" />                | [0x04f5ae6bef48c1fc](https://flowscan.io/contract/A.04f5ae6bef48c1fc.ERC4626PriceOracles?tab=deployments)                | <CopyButton text="flow dependencies install mainnet://0x04f5ae6bef48c1fc.ERC4626PriceOracles" title="Copy install command (mainnet)" />                |
| ERC4626SinkConnectors              | [0x7014dcffa1f14186](https://testnet.flowscan.io/contract/A.7014dcffa1f14186.ERC4626SinkConnectors?tab=deployments)              | <CopyButton text="flow dependencies install testnet://0x7014dcffa1f14186.ERC4626SinkConnectors" title="Copy install command (testnet)" />              | [0x04f5ae6bef48c1fc](https://flowscan.io/contract/A.04f5ae6bef48c1fc.ERC4626SinkConnectors?tab=deployments)              | <CopyButton text="flow dependencies install mainnet://0x04f5ae6bef48c1fc.ERC4626SinkConnectors" title="Copy install command (mainnet)" />              |
| ERC4626SwapConnectors              | [0x7014dcffa1f14186](https://testnet.flowscan.io/contract/A.7014dcffa1f14186.ERC4626SwapConnectors?tab=deployments)              | <CopyButton text="flow dependencies install testnet://0x7014dcffa1f14186.ERC4626SwapConnectors" title="Copy install command (testnet)" />              | [0x04f5ae6bef48c1fc](https://flowscan.io/contract/A.04f5ae6bef48c1fc.ERC4626SwapConnectors?tab=deployments)              | <CopyButton text="flow dependencies install mainnet://0x04f5ae6bef48c1fc.ERC4626SwapConnectors" title="Copy install command (mainnet)" />              |
| EVMNativeFLOWConnectors            | [0xbee3f3636cec263a](https://testnet.flowscan.io/contract/A.bee3f3636cec263a.EVMNativeFLOWConnectors?tab=deployments)            | <CopyButton text="flow dependencies install testnet://0xbee3f3636cec263a.EVMNativeFLOWConnectors" title="Copy install command (testnet)" />            | [0x1a771b21fcceadc2](https://flowscan.io/contract/A.1a771b21fcceadc2.EVMNativeFLOWConnectors?tab=deployments)            | <CopyButton text="flow dependencies install mainnet://0x1a771b21fcceadc2.EVMNativeFLOWConnectors" title="Copy install command (mainnet)" />            |
| EVMTokenConnectors                 | [0xbee3f3636cec263a](https://testnet.flowscan.io/contract/A.bee3f3636cec263a.EVMTokenConnectors?tab=deployments)                 | <CopyButton text="flow dependencies install testnet://0xbee3f3636cec263a.EVMTokenConnectors" title="Copy install command (testnet)" />                 | [0x1a771b21fcceadc2](https://flowscan.io/contract/A.1a771b21fcceadc2.EVMTokenConnectors?tab=deployments)                 | <CopyButton text="flow dependencies install mainnet://0x1a771b21fcceadc2.EVMTokenConnectors" title="Copy install command (mainnet)" />                 |
| SwapConnectors                     | [0xaddd594cf410166a](https://testnet.flowscan.io/contract/A.addd594cf410166a.SwapConnectors?tab=deployments)                     | <CopyButton text="flow dependencies install testnet://0xaddd594cf410166a.SwapConnectors" title="Copy install command (testnet)" />                     | [0xe1a479f0cb911df9](https://flowscan.io/contract/A.e1a479f0cb911df9.SwapConnectors?tab=deployments)                     | <CopyButton text="flow dependencies install mainnet://0xe1a479f0cb911df9.SwapConnectors" title="Copy install command (mainnet)" />                     |
| IncrementFiSwapConnectors          | [0x494536c102537e1e](https://testnet.flowscan.io/contract/A.494536c102537e1e.IncrementFiSwapConnectors?tab=deployments)          | <CopyButton text="flow dependencies install testnet://0x494536c102537e1e.IncrementFiSwapConnectors" title="Copy install command (testnet)" />          | [0xe844c7cf7430a77c](https://flowscan.io/contract/A.e844c7cf7430a77c.IncrementFiSwapConnectors?tab=deployments)          | <CopyButton text="flow dependencies install mainnet://0xe844c7cf7430a77c.IncrementFiSwapConnectors" title="Copy install command (mainnet)" />          |
| IncrementFiFlashloanConnectors     | [0x494536c102537e1e](https://testnet.flowscan.io/contract/A.494536c102537e1e.IncrementFiFlashloanConnectors?tab=deployments)     | <CopyButton text="flow dependencies install testnet://0x494536c102537e1e.IncrementFiFlashloanConnectors" title="Copy install command (testnet)" />     | [0xe844c7cf7430a77c](https://flowscan.io/contract/A.e844c7cf7430a77c.IncrementFiFlashloanConnectors?tab=deployments)     | <CopyButton text="flow dependencies install mainnet://0xe844c7cf7430a77c.IncrementFiFlashloanConnectors" title="Copy install command (mainnet)" />     |
| IncrementFiPoolLiquidityConnectors | [0x494536c102537e1e](https://testnet.flowscan.io/contract/A.494536c102537e1e.IncrementFiPoolLiquidityConnectors?tab=deployments) | <CopyButton text="flow dependencies install testnet://0x494536c102537e1e.IncrementFiPoolLiquidityConnectors" title="Copy install command (testnet)" /> | [0xe844c7cf7430a77c](https://flowscan.io/contract/A.e844c7cf7430a77c.IncrementFiPoolLiquidityConnectors?tab=deployments) | <CopyButton text="flow dependencies install mainnet://0xe844c7cf7430a77c.IncrementFiPoolLiquidityConnectors" title="Copy install command (mainnet)" /> |
| IncrementFiStakingConnectors       | [0x494536c102537e1e](https://testnet.flowscan.io/contract/A.494536c102537e1e.IncrementFiStakingConnectors?tab=deployments)       | <CopyButton text="flow dependencies install testnet://0x494536c102537e1e.IncrementFiStakingConnectors" title="Copy install command (testnet)" />       | [0xe844c7cf7430a77c](https://flowscan.io/contract/A.e844c7cf7430a77c.IncrementFiStakingConnectors?tab=deployments)       | <CopyButton text="flow dependencies install mainnet://0xe844c7cf7430a77c.IncrementFiStakingConnectors" title="Copy install command (mainnet)" />       |
| BandOracleConnectors               | [0xbb76ea2f8aad74a0](https://testnet.flowscan.io/contract/A.bb76ea2f8aad74a0.BandOracleConnectors?tab=deployments)               | <CopyButton text="flow dependencies install testnet://0xbb76ea2f8aad74a0.BandOracleConnectors" title="Copy install command (testnet)" />               | [0xe36ef556b8b5d955](https://flowscan.io/contract/A.e36ef556b8b5d955.BandOracleConnectors?tab=deployments)               | <CopyButton text="flow dependencies install mainnet://0xe36ef556b8b5d955.BandOracleConnectors" title="Copy install command (mainnet)" />               |
| UniswapV2Connectors                | [0x5f1153f29b57747f](https://testnet.flowscan.io/contract/A.5f1153f29b57747f.UniswapV2Connectors?tab=deployments)                | <CopyButton text="flow dependencies install testnet://0x5f1153f29b57747f.UniswapV2Connectors" title="Copy install command (testnet)" />                | [0xf94f371678513b2b](https://flowscan.io/contract/A.f94f371678513b2b.UniswapV2Connectors?tab=deployments)                | <CopyButton text="flow dependencies install mainnet://0xf94f371678513b2b.UniswapV2Connectors" title="Copy install command (mainnet)" />                |

## Tutorial series

### [Flow Actions]

Learn how to build DeFi applications with the Flow Actions framework, which allows developers to create composable DeFi workflows. Flow Actions provide standardized interfaces that make it easy to combine different DeFi protocols and create sophisticated financial applications.

### [Scheduled Transactions]

Discover how to implement scheduled transactions for time-based smart contract execution on Flow. These tutorials cover how to create automated workflows, cron-like functionality, and time-sensitive blockchain applications that can execute without manual intervention.

### [Passkeys]

Implement device-backed passkeys with the Web Authentication API to register Flow account keys and sign transactions with secure, user-friendly authentication. For more information, see the [advanced concepts documentation](../../build/cadence/advanced-concepts/passkeys.md).

### [High-Precision Fixed-Point Math]

Learn about Flow's high-precision mathematical utilities for DeFi applications using UInt128-based 24-decimal fixed-point arithmetic. This tutorial covers how to perform accurate financial calculations, handle rounding modes, and avoid precision loss in complex DeFi operations like liquidity pools, yield farming, and token swaps.

## Get started

To begin with Forte tutorials, we recommend that you start with:

1. **[Introduction to Flow Actions]** - Understand the core concepts and architecture
2. **[Scheduled Transactions Introduction]** - Learn about time-based execution capabilities

## Key benefits

- **Automation**: Build applications that can execute complex workflows automatically
- **Composability**: Combine different protocols and services seamlessly
- **Time-based Logic**: Implement sophisticated scheduling and automation features
- **Developer Experience**: Simplified interfaces for complex blockchain operations

## Conclusion

The Forte network upgrade represents a significant evolution of Flow's capabilities, with powerful new tools to build the next generation of decentralized applications. These tutorials provide the foundation for you to leverage these new features to create sophisticated, automated, and composable blockchain applications.

<!-- Relative links, will not render on page -->

[Flow Actions]: ./flow-actions/index.md
[Scheduled Transactions]: ./scheduled-transactions/index.md
[Passkeys]: ../../build/cadence/advanced-concepts/passkeys.md
[High-Precision Fixed-Point Math]: ./fixed-point-128-bit-math.md
[Introduction to Flow Actions]: ./flow-actions/intro-to-flow-actions.md
[Scheduled Transactions Introduction]: ./scheduled-transactions/scheduled-transactions-introduction.md
