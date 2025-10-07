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

This series covers the new features and capabilities introduced in the Forte network upgrade for Flow blockchain. The Forte upgrade brings powerful new tools for building sophisticated decentralized applications, including automated DeFi workflows and time-based smart contract execution.

## What's New in Forte

The Forte network upgrade introduces several groundbreaking features that expand Flow's capabilities:

- **Flow Actions**: Standardized interfaces for building composable DeFi workflows
- **Scheduled Transactions**: Time-based smart contract execution and blockchain automation
- **Enhanced Composability**: New patterns for building complex, interconnected applications

## Deployed Contract Addresses

import CopyButton from '@site/src/components/CopyButton';

| Contract                           | Testnet                                                                                                                          | Install                                                                                                                                                | Mainnet                                                                                                                  | Install                                                                                                                                                |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| DeFiActions                        | [0x4c2ff9dd03ab442f](https://testnet.flowscan.io/contract/A.4c2ff9dd03ab442f.DeFiActions?tab=deployments)                        | <CopyButton text="flow dependencies install testnet://0x4c2ff9dd03ab442f.DeFiActions" title="Copy install command (testnet)" />                        | [0x92195d814edf9cb0](https://flowscan.io/contract/A.92195d814edf9cb0.DeFiActions?tab=deployments)                        | <CopyButton text="flow dependencies install mainnet://0x92195d814edf9cb0.DeFiActions" title="Copy install command (mainnet)" />                        |
| DeFiActionsMathUtils               | [0x4c2ff9dd03ab442f](https://testnet.flowscan.io/contract/A.4c2ff9dd03ab442f.DeFiActionsMathUtils?tab=deployments)               | <CopyButton text="flow dependencies install testnet://0x4c2ff9dd03ab442f.DeFiActionsMathUtils" title="Copy install command (testnet)" />               | [0x92195d814edf9cb0](https://flowscan.io/contract/A.92195d814edf9cb0.DeFiActionsMathUtils?tab=deployments)               | <CopyButton text="flow dependencies install mainnet://0x92195d814edf9cb0.DeFiActionsMathUtils" title="Copy install command (mainnet)" />               |
| DeFiActionsUtils                   | [0x4c2ff9dd03ab442f](https://testnet.flowscan.io/contract/A.4c2ff9dd03ab442f.DeFiActionsUtils?tab=deployments)                   | <CopyButton text="flow dependencies install testnet://0x4c2ff9dd03ab442f.DeFiActionsUtils" title="Copy install command (testnet)" />                   | [0x92195d814edf9cb0](https://flowscan.io/contract/A.92195d814edf9cb0.DeFiActionsUtils?tab=deployments)                   | <CopyButton text="flow dependencies install mainnet://0x92195d814edf9cb0.DeFiActionsUtils" title="Copy install command (mainnet)" />                   |
| FungibleTokenConnectors            | [0x5a7b9cee9aaf4e4e](https://testnet.flowscan.io/contract/A.5a7b9cee9aaf4e4e.FungibleTokenConnectors?tab=deployments)            | <CopyButton text="flow dependencies install testnet://0x5a7b9cee9aaf4e4e.FungibleTokenConnectors" title="Copy install command (testnet)" />            | [0x1d9a619393e9fb53](https://flowscan.io/contract/A.1d9a619393e9fb53.FungibleTokenConnectors?tab=deployments)            | <CopyButton text="flow dependencies install mainnet://0x1d9a619393e9fb53.FungibleTokenConnectors" title="Copy install command (mainnet)" />            |
| EVMNativeFLOWConnectors            | [0xb88ba0e976146cd1](https://testnet.flowscan.io/contract/A.b88ba0e976146cd1.EVMNativeFLOWConnectors?tab=deployments)            | <CopyButton text="flow dependencies install testnet://0xb88ba0e976146cd1.EVMNativeFLOWConnectors" title="Copy install command (testnet)" />            | [0xcc15a0c9c656b648](https://flowscan.io/contract/A.cc15a0c9c656b648.EVMNativeFLOWConnectors?tab=deployments)            | <CopyButton text="flow dependencies install mainnet://0xcc15a0c9c656b648.EVMNativeFLOWConnectors" title="Copy install command (mainnet)" />            |
| EVMTokenConnectors                 | [0xb88ba0e976146cd1](https://testnet.flowscan.io/contract/A.b88ba0e976146cd1.EVMTokenConnectors?tab=deployments)                 | <CopyButton text="flow dependencies install testnet://0xb88ba0e976146cd1.EVMTokenConnectors" title="Copy install command (testnet)" />                 | [0xcc15a0c9c656b648](https://flowscan.io/contract/A.cc15a0c9c656b648.EVMTokenConnectors?tab=deployments)                 | <CopyButton text="flow dependencies install mainnet://0xcc15a0c9c656b648.EVMTokenConnectors" title="Copy install command (mainnet)" />                 |
| SwapConnectors                     | [0xaddd594cf410166a](https://testnet.flowscan.io/contract/A.addd594cf410166a.SwapConnectors?tab=deployments)                     | <CopyButton text="flow dependencies install testnet://0xaddd594cf410166a.SwapConnectors" title="Copy install command (testnet)" />                     | [0x0bce04a00aedf132](https://flowscan.io/contract/A.0bce04a00aedf132.SwapConnectors?tab=deployments)                     | <CopyButton text="flow dependencies install mainnet://0x0bce04a00aedf132.SwapConnectors" title="Copy install command (mainnet)" />                     |
| IncrementFiSwapConnectors          | [0x49bae091e5ea16b5](https://testnet.flowscan.io/contract/A.49bae091e5ea16b5.IncrementFiSwapConnectors?tab=deployments)          | <CopyButton text="flow dependencies install testnet://0x49bae091e5ea16b5.IncrementFiSwapConnectors" title="Copy install command (testnet)" />          | [0xefa9bd7d1b17f1ed](https://flowscan.io/contract/A.efa9bd7d1b17f1ed.IncrementFiSwapConnectors?tab=deployments)          | <CopyButton text="flow dependencies install mainnet://0xefa9bd7d1b17f1ed.IncrementFiSwapConnectors" title="Copy install command (mainnet)" />          |
| IncrementFiFlashloanConnectors     | [0x49bae091e5ea16b5](https://testnet.flowscan.io/contract/A.49bae091e5ea16b5.IncrementFiFlashloanConnectors?tab=deployments)     | <CopyButton text="flow dependencies install testnet://0x49bae091e5ea16b5.IncrementFiFlashloanConnectors" title="Copy install command (testnet)" />     | [0xefa9bd7d1b17f1ed](https://flowscan.io/contract/A.efa9bd7d1b17f1ed.IncrementFiFlashloanConnectors?tab=deployments)     | <CopyButton text="flow dependencies install mainnet://0xefa9bd7d1b17f1ed.IncrementFiFlashloanConnectors" title="Copy install command (mainnet)" />     |
| IncrementFiPoolLiquidityConnectors | [0x49bae091e5ea16b5](https://testnet.flowscan.io/contract/A.49bae091e5ea16b5.IncrementFiPoolLiquidityConnectors?tab=deployments) | <CopyButton text="flow dependencies install testnet://0x49bae091e5ea16b5.IncrementFiPoolLiquidityConnectors" title="Copy install command (testnet)" /> | [0xefa9bd7d1b17f1ed](https://flowscan.io/contract/A.efa9bd7d1b17f1ed.IncrementFiPoolLiquidityConnectors?tab=deployments) | <CopyButton text="flow dependencies install mainnet://0xefa9bd7d1b17f1ed.IncrementFiPoolLiquidityConnectors" title="Copy install command (mainnet)" /> |
| IncrementFiStakingConnectors       | [0x49bae091e5ea16b5](https://testnet.flowscan.io/contract/A.49bae091e5ea16b5.IncrementFiStakingConnectors?tab=deployments)       | <CopyButton text="flow dependencies install testnet://0x49bae091e5ea16b5.IncrementFiStakingConnectors" title="Copy install command (testnet)" />       | [0xefa9bd7d1b17f1ed](https://flowscan.io/contract/A.efa9bd7d1b17f1ed.IncrementFiStakingConnectors?tab=deployments)       | <CopyButton text="flow dependencies install mainnet://0xefa9bd7d1b17f1ed.IncrementFiStakingConnectors" title="Copy install command (mainnet)" />       |
| BandOracleConnectors               | [0x1a9f5d18d096cd7a](https://testnet.flowscan.io/contract/A.1a9f5d18d096cd7a.BandOracleConnectors?tab=deployments)               | <CopyButton text="flow dependencies install testnet://0x1a9f5d18d096cd7a.BandOracleConnectors" title="Copy install command (testnet)" />               | [0xf627b5c89141ed99](https://flowscan.io/contract/A.f627b5c89141ed99.BandOracleConnectors?tab=deployments)               | <CopyButton text="flow dependencies install mainnet://0xf627b5c89141ed99.BandOracleConnectors" title="Copy install command (mainnet)" />               |
| UniswapV2Connectors                | [0xfef8e4c5c16ccda5](https://testnet.flowscan.io/contract/A.fef8e4c5c16ccda5.UniswapV2Connectors?tab=deployments)                | <CopyButton text="flow dependencies install testnet://0xfef8e4c5c16ccda5.UniswapV2Connectors" title="Copy install command (testnet)" />                | [0x0e5b1dececaca3a8](https://flowscan.io/contract/A.0e5b1dececaca3a8.UniswapV2Connectors?tab=deployments)                | <CopyButton text="flow dependencies install mainnet://0x0e5b1dececaca3a8.UniswapV2Connectors" title="Copy install command (mainnet)" />                |

## Tutorial Series

### [Flow Actions]

Learn how to build decentralized finance applications using the Flow Actions framework, enabling developers to create composable DeFi workflows. Flow Actions provide standardized interfaces that make it easy to combine different DeFi protocols and create sophisticated financial applications.

### [Scheduled Transactions]

Discover how to implement scheduled transactions for time-based smart contract execution on Flow. These tutorials cover creating automated workflows, cron-like functionality, and time-sensitive blockchain applications that can execute without manual intervention.

## Getting Started

To begin with Forte tutorials, we recommend starting with:

1. **[Introduction to Flow Actions]** - Understand the core concepts and architecture
2. **[Scheduled Transactions Introduction]** - Learn about time-based execution capabilities

## Key Benefits

- **Automation**: Build applications that can execute complex workflows automatically
- **Composability**: Combine different protocols and services seamlessly
- **Time-based Logic**: Implement sophisticated scheduling and automation features
- **Developer Experience**: Simplified interfaces for complex blockchain operations

## Conclusion

The Forte network upgrade represents a significant evolution of Flow's capabilities, introducing powerful new tools for building the next generation of decentralized applications. These tutorials provide the foundation for leveraging these new features to create sophisticated, automated, and composable blockchain applications.

<!-- Relative links, will not render on page -->

[Flow Actions]: ./flow-actions/index.md
[Scheduled Transactions]: ./scheduled-transactions/index.md
[Introduction to Flow Actions]: ./flow-actions/intro-to-flow-actions.md
[Scheduled Transactions Introduction]: ./scheduled-transactions/scheduled-transactions-introduction.md
