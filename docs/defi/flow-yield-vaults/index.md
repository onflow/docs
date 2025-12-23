---
title: Flow Yield Vaults (FYV)
sidebar_label: Flow Yield Vaults (FYV)
sidebar_position: 11
---

# Flow Yield Vaults (FYV)

Flow Yield Vaults (FYV) is a DeFi protocol that enables users to deposit tokens into yield-generating strategies that automatically optimize returns through leveraged positions and continuous rebalancing. FYV is one of the three core components of [Flow Credit Market (FCM)](../fcm/index.md), working alongside [ALP](../alp/index.md) and [MOET](#) to create a fully automated yield farming system.

:::info
FYV is one of three core components that make up FCM: [ALP (Automated Lending Platform)](../alp/index.md) provides the lending/borrowing engine, FYV (Flow Yield Vaults) handles yield aggregation strategies, and [MOET](#) serves as the synthetic stablecoin and unit of account.
:::

## What is FYV?

FYV is a yield aggregation platform that enables automated leveraged yield farming through integration with FlowCreditMarket's lending infrastructure. The system deposits tokens into DeFi strategies, automatically optimizes returns through leveraged positions, continuously rebalances to maintain safe leverage ratios, and provides liquidity for liquidation prevention in ALP positions.

The protocol operates on the Flow blockchain using Cadence smart contracts and supports multiple tokens including FLOW, USDC, wBTC, wETH, and MOET.

## Key Innovation: Automated Leveraged Yield Farming

FYV's standout feature is its **TracerStrategy** that combines leveraged borrowing with yield farming in a fully automated system. When you deposit FLOW into FYV, the system deposits it as collateral in ALP to create a lending position, borrows MOET against the collateral (up to 80% of collateral value), converts borrowed MOET into yield-bearing tokens through swap connectors, deposits yield tokens into ERC4626 vaults via AutoBalancer, and continuously monitors and rebalances to maintain target health factor of 1.3. The result is amplified returns through leverage while maintaining safety through automated health management.

### Integration with ALP for Liquidation Prevention

FYV serves a dual purpose in the FCM ecosystem by not only generating yield through leveraged farming but also providing liquidation protection for ALP positions. When an ALP position's health drops due to collateral price changes, FYV provides liquidity via TopUpSource by converting yield tokens back to MOET and sending them to ALP for debt repayment. This yield-powered protection mechanism prevents liquidations automatically, requiring no manual intervention from users.

## Core Components

The FYV protocol consists of several key components that work together:

**YieldVault**: The user-owned resource representing a leveraged position. Each vault tracks the user's deposits, holds capabilities to interact with strategies, and maintains the connection to the AutoBalancer and ALP position.

**Strategy**: Defines the yield generation approach. Strategies implement deposit, withdraw, and liquidation operations. The StrategyFactory maintains a registry of available strategies, allowing multiple yield generation approaches while keeping vault logic protocol-agnostic.

**AutoBalancer**: Manages yield token holdings and triggers rebalancing when thresholds are exceeded. The AutoBalancer monitors the value ratio between current holdings and historical deposits, maintaining it within 95%-105% bounds.

**Position** (from ALP): The underlying lending position that holds collateral and debt. Strategies maintain capabilities to deposit collateral, borrow MOET, and monitor position health.

**Scheduler**: Handles automated rebalancing through self-scheduling mechanism. Each AutoBalancer schedules its next rebalance execution at 60-second intervals, creating perpetual automation.

Learn more in [Architecture Overview](./architecture.md).

## Documentation Sections

### Core Concepts
- [Architecture Overview](./architecture.md) - Core components and system design
- [Strategies](./strategies.md) - Understanding TracerStrategy and yield generation
- [AutoBalancer](./autobalancer.md) - Automated rebalancing mechanics
- [Vault Lifecycle](./vault-lifecycle.md) - Creating, managing, and closing vaults

### Advanced Features
- [Leveraged Farming](./leveraged-farming.md) - How leverage amplifies returns
- [Cross-Chain Integration](./cross-chain.md) - Flow-EVM bridge and ERC4626 vaults
- [Scheduling System](./scheduling.md) - Automated execution and recovery

### Integration
- [FCM Integration](./fcm-integration.md) - Working with ALP and MOET
- [DeFi Actions](./defi-actions.md) - Composable DeFi primitives
- [Swap Connectors](./swap-connectors.md) - Token conversion infrastructure

## Getting Started

### For Users

If you want to earn yield through automated leveraged farming, start with the [Vault Lifecycle](./vault-lifecycle.md) guide to learn how to create your first vault, deposit collateral, and monitor your position.

### For Developers

If you want to integrate FYV or create custom strategies, start with the [Architecture Overview](./architecture.md) to understand the system design, then explore [DeFi Actions](./defi-actions.md) for composability patterns.

### For DeFi Builders

If you want to understand how FYV achieves automated leverage and liquidation protection, start with [Leveraged Farming](./leveraged-farming.md) and [FCM Integration](./fcm-integration.md).

## Key Features

**Automated Leverage**: FYV automatically borrows against your collateral to maximize capital efficiency while maintaining safe health factors.

**Continuous Rebalancing**: The AutoBalancer monitors your position 24/7 and automatically adjusts when thresholds are exceeded.

**Liquidation Prevention**: FYV provides liquidity to ALP positions when needed, preventing liquidations through yield accumulation.

**Cross-Chain Yield**: Access Ethereum-compatible yield vaults through Flow's EVM bridge, bringing DeFi opportunities from multiple chains.

**Composable Strategies**: Stack DeFi Actions components to create complex yield generation flows tailored to your risk tolerance.

**Self-Scheduling**: Vaults perpetually schedule their own rebalancing without relying on external bots or keepers.

## Supported Tokens

FYV supports multiple collateral types and yield tokens:

- **FLOW**: Native Flow token
- **stFLOW**: Staked FLOW with liquid staking rewards
- **USDC**: USD stablecoin (bridged)
- **wBTC**: Wrapped Bitcoin (bridged)
- **wETH**: Wrapped Ethereum (bridged)
- **MOET**: Synthetic stablecoin (borrowed asset)

## Deployment Addresses

| Network | Contract Address | Status |
|---------|-----------------|--------|
| **Testnet** | `0xd27920b6384e2a78` | Active |
| **Mainnet** | `0xb1d63873c3cc9f79` | Active |

See [DeFi Contracts](../defi-contracts-mainnet.md) for complete contract addresses.

## Next Steps

- **Understand the basics**: Read [Architecture Overview](./architecture.md)
- **Learn strategies**: Explore [TracerStrategy](./strategies.md#tracerstrategy)
- **Create your first vault**: Follow [Vault Lifecycle](./vault-lifecycle.md)
- **Integrate with FCM**: See [FCM Integration](./fcm-integration.md)

---

:::tip Key Takeaway
FYV combines automated leverage, yield farming, and liquidation protection into a single system. By integrating with ALP for borrowing and using AutoBalancers for continuous optimization, FYV enables hands-free yield generation while maintaining position safety.
:::
