---
title: Automated Lending Platform (ALP)
sidebar_label: Overview
sidebar_position: 1
---

# Automated Lending Platform (ALP)

The Automated Lending Platform (ALP) is the core lending protocol component of [Flow Credit Market (FCM)](../fcm/index.md). ALP provides the foundational lending and borrowing infrastructure with automated position management and liquidation protection.

:::info
ALP is one of three core components that make up FCM: ALP (Automated Lending Platform) provides the lending/borrowing engine, [Flow Yield Vaults (FYV)](#) handles yield aggregation strategies, and [MOET](#) serves as the synthetic stablecoin and unit of account.
:::

## What is ALP?

ALP is a decentralized lending protocol that enables users to deposit collateral to create lending positions, borrow assets against their collateral up to their borrowing limit, earn interest on deposits, and maintain positions through automated rebalancing.

The protocol uses MOET as its primary unit of account and default borrowed asset, with all prices quoted in MOET terms.

## Key Innovation: Automated Rebalancing

ALP's standout feature is its **automated rebalancing** system that uses DeFi Actions to maintain optimal position health. When overcollateralized (health > 1.5), the system automatically borrows more to maximize capital efficiency. When undercollateralized (health < 1.1), it automatically repays debt using yield from FYV. The protocol targets a health range of 1.1 to 1.5 for balanced risk/reward, and prevents liquidations by pulling from TopUpSource (often FYV strategies) when needed.

### Integration with FYV

ALP's unique liquidation prevention mechanism leverages yield from Flow Yield Vaults:

1. User deposits collateral into ALP position
2. ALP auto-borrows MOET to reach target health
3. Borrowed MOET flows into FYV strategy (via DrawDownSink)
4. FYV generates yield on the borrowed MOET
5. If collateral price drops, ALP pulls from FYV (via TopUpSource) to prevent liquidation
6. **Result**: Yield helps maintain position health automatically

## Core Components

The protocol consists of four key components: the **Pool** serves as the central contract managing all positions and reserves; each **Position** represents a user's credit account tracking collateral and debt; **TokenState** maintains per-token state including interest indices; and the **Health Factor** measures the ratio of collateral to debt (which must stay above 1.0).

Learn more in [Architecture Overview](./architecture.md).

## Documentation Sections

### Core Concepts
- [Architecture Overview](./architecture.md) - Core components and system design
- [Credit Market Mechanics](./credit-market-mechanics.md) - How lending and borrowing works
- [Position Lifecycle](./position-lifecycle.md) - Creating, managing, and closing positions

### Advanced Features
- [Rebalancing](./rebalancing.md) - Automated position management
- [Liquidation System](./liquidation-system.md) - Liquidation triggers and mechanisms
- [DeFi Actions](./defi-actions.md) - Protocol composability framework
- [MOET's Role](./moet-role.md) - The unit of account in ALP

## How ALP Fits into FCM

```mermaid
graph TB
    User[User] -->|Deposits Collateral| ALP[ALP Position]
    ALP -->|Auto-borrows MOET| MOET[MOET Token]
    MOET -->|Via DrawDownSink| FYV[FYV Strategy]
    FYV -->|Generates Yield| Yield[Yield Tokens]

    Price[Price Drop] -.->|Triggers Rebalancing| ALP
    ALP -->|Pulls Funds| FYV
    FYV -->|Via TopUpSource| ALP
    ALP -->|Repays Debt| MOET

    style ALP fill:#f9f,stroke:#333,stroke-width:4px
    style FYV fill:#bbf,stroke:#333,stroke-width:2px
    style MOET fill:#bfb,stroke:#333,stroke-width:2px
```

## Getting Started with ALP

To use ALP directly:

1. Ensure you have Flow tokens or other supported collateral
2. Connect your wallet to the Flow blockchain
3. Create a position by depositing collateral
4. Configure DrawDownSink and TopUpSource for automation
5. Monitor your position health

For most users, we recommend using **[Flow Credit Market (FCM)](../fcm/index.md)** which provides a complete solution combining ALP, FYV, and MOET.

## Resources

- [ALP GitHub Repository](https://github.com/onflow/FlowCreditMarket) (FlowCreditMarket contract)
- [Flow Credit Market (FCM)](../fcm/index.md) - The complete product
- [MOET Token Documentation](#)
- [Flow Documentation](https://developers.flow.com)

## Security Considerations

ALP includes multiple safety features to protect users and the protocol. The system implements oracle staleness checks and deviation guards to ensure price accuracy, enforces warm-up periods after unpausing liquidations to prevent immediate exploits, provides slippage protection for DEX routes during trades, and continuously monitors health factors with alerts. Always monitor your position health and ensure sufficient collateral to avoid liquidation.
