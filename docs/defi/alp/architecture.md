---
title: Architecture Overview
sidebar_position: 2
---

# Architecture Overview

ALP is built on a modular architecture with several core components that work together to provide a secure and efficient lending protocol.

## Core Components

```mermaid
graph TB
    subgraph "ALP Core"
        Pool[Pool<br/>Central Logic Hub]
        Position[Position<br/>User Accounts]
        TokenState[TokenState<br/>Per-Token Metrics]
        Oracle[Price Oracle<br/>Price Feeds]
    end

    User[User Wallet] -->|Creates/Manages| Position
    Position -->|Operations| Pool
    Pool -->|Tracks| TokenState
    Pool -->|Queries Prices| Oracle
    Pool -->|Stores| Reserves[Token Reserves]

    Position -->|Auto-Push| Sink[DrawDownSink<br/>Automated Flows]
    Position -->|Auto-Pull| Source[TopUpSource<br/>Automated Flows]

    style Pool fill:#f9f,stroke:#333,stroke-width:4px
    style Position fill:#bbf,stroke:#333,stroke-width:2px
```

### Pool

The **Pool** is the central smart contract that manages all protocol operations. It serves as the primary logic hub for:

```mermaid
graph LR
    subgraph "Pool Responsibilities"
        R1[Track All<br/>Positions]
        R2[Manage Token<br/>Balances]
        R3[Store<br/>Reserves]
        R4[Calculate<br/>Interest]
        R5[Execute<br/>Liquidations]
    end

    R1 --> Pool[Pool Contract]
    R2 --> Pool
    R3 --> Pool
    R4 --> Pool
    R5 --> Pool

    style Pool fill:#f9f,stroke:#333,stroke-width:3px
```

The Pool tracks global state for all positions, manages credit and debit balances for each supported token, stores reserves as they are deposited, coordinates interest rate calculations, and executes liquidations and rebalancing operations. It maintains a global ledger that tracks the state of each token type, including interest indices, total deposits, total borrows, and reserve factors.

### Position

A **Position** represents a user's credit account within the protocol. Each position tracks:

```mermaid
graph TD
    subgraph "Position Components"
        C[Collateral<br/>Deposits]
        D[Debt<br/>Obligations]
        H[Health<br/>Factor]
        A[DeFi Actions<br/>Connectors]
    end

    C --> Position[Your Position]
    D --> Position
    H --> Position
    A --> Position

    Position --> Operations[Operations:<br/>Deposit, Borrow<br/>Repay, Withdraw]

    style Position fill:#bbf,stroke:#333,stroke-width:3px
```

- **Collateral deposits**: Assets deposited to back borrowing
- **Debt obligations**: Amount borrowed against collateral
- **Health factor**: Ratio of collateral value to debt (must stay above 1.0)
- **DeFi Actions connectors**: Optional Sink and Source for automated flows

Positions are external objects representing ownership of deposited value, with each position capable of holding multiple token balances (both deposits and borrows). They can be configured with different min/max health targets and support composability through DeFi Actions interfaces.

### TokenState

Each supported token in the protocol has an associated **TokenState** that tracks per-token metrics:

```mermaid
graph LR
    Token[Token<br/>e.g., FLOW] --> State[TokenState]

    State --> I[Interest<br/>Indices]
    State --> TD[Total<br/>Deposits]
    State --> TB[Total<br/>Borrows]
    State --> CF[Collateral<br/>Factor 0.8]
    State --> IR[Interest Rate<br/>Parameters]

    style State fill:#bfb,stroke:#333,stroke-width:2px
```

TokenState maintains interest indices for scaled balance calculations, tracks total deposits and borrows for each token, stores the collateral factor (percentage of token value usable as collateral, e.g., 0.8 = 80%), applies borrow factors as multipliers to borrowed amounts, and configures interest rate parameters for rate curves.

### Scaled Balance System

ALP uses a **scaled balance** system to track user balances efficiently:

```mermaid
sequenceDiagram
    participant User
    participant Position
    participant Pool
    participant Index

    User->>Position: Borrow 1000 MOET
    Position->>Pool: Record balance
    Note over Pool: Index = 1.0<br/>Scaled = 1000 / 1.0 = 1000

    Note over Index: Time passes...<br/>Interest accrues

    Index->>Index: Index grows to 1.05

    User->>Position: Check balance
    Position->>Pool: Query
    Pool->>Pool: Calculate: 1000 × 1.05
    Pool-->>User: Balance = 1050 MOET

    Note over User,Index: No transaction needed<br/>for interest to accrue!
```

Instead of updating every user's balance when interest accrues, the protocol:

1. Tracks each user's "scaled balance" (actual balance / interest index)
2. Updates the global interest index as time passes
3. Calculates true balance on-demand as: scaled balance × current interest index

This means balances grow automatically without requiring transactions, as the interest index increases over time.

This system is highly gas efficient since it eliminates per-user balance updates, enables automatic compounding for all users simultaneously, provides precise calculations using UFix128 precision, and scales to unlimited users without additional overhead. See [FCM Mathematical Foundations](../fcm/math.md#interest-mathematics) for detailed formulas.

### Price Oracle

The **Price Oracle** provides token prices in terms of the default token (MOET):

```mermaid
graph TB
    subgraph "Oracle Safety Features"
        S1[Staleness Checks<br/>Price not too old]
        S2[Deviation Guards<br/>Prevent extreme moves]
        S3[TWAP Support<br/>Time-weighted prices]
        S4[Fallback Sources<br/>Redundancy]
    end

    Oracle[Price Oracle] --> S1
    Oracle --> S2
    Oracle --> S3
    Oracle --> S4

    Oracle --> Prices[Token Prices<br/>in MOET terms]

    Prices --> HF[Health Factor<br/>Calculations]
    Prices --> Liq[Liquidation<br/>Triggers]

    style Oracle fill:#bfb,stroke:#333,stroke-width:3px
```

The oracle implements the DeFi Actions PriceOracle interface, enabling standardized price queries across the protocol.

The oracle includes multiple safety features: configurable staleness thresholds per token (typically 5 minutes), maximum deviation checks against the last price snapshot, additional DEX price deviation checks during liquidations, and TWAP (Time-Weighted Average Price) support for manipulation resistance.

## Key Interfaces

### FungibleToken.Vault

```mermaid
graph LR
    Vault[FungibleToken.Vault<br/>Standard Interface] --> Op1[Deposit<br/>Tokens]
    Vault --> Op2[Withdraw<br/>Tokens]
    Vault --> Op3[Balance<br/>Queries]
    Vault --> Op4[Transfer<br/>Tokens]

    Op1 --> Compat[Flow Ecosystem<br/>Compatibility]
    Op2 --> Compat
    Op3 --> Compat
    Op4 --> Compat

    style Compat fill:#bfb,stroke:#333,stroke-width:2px
```

ALP integrates with Flow's standard `FungibleToken.Vault` interface for token operations, ensuring compatibility with all Flow fungible tokens and wallets.

### DeFi Actions Framework

ALP implements the **DeFi Actions** framework for protocol composability:

```mermaid
graph TB
    subgraph "Sink Pattern (Push)"
        S1[Position<br/>Overcollateralized] --> S2[Auto-Borrow<br/>MOET]
        S2 --> S3[Push to<br/>DrawDownSink]
        S3 --> S4[User Wallet<br/>or DeFi Protocol]
    end

    subgraph "Source Pattern (Pull)"
        P1[Position<br/>Undercollateralized] --> P2[Need to<br/>Repay Debt]
        P2 --> P3[Pull from<br/>TopUpSource]
        P3 --> P4[User Wallet<br/>or DeFi Protocol]
    end

    style S1 fill:#bbf
    style P1 fill:#fbb
```

The **Sink Interface** receives tokens when positions are overcollateralized, automatically pushing borrowed funds to user wallets or other protocols through the `drawDownSink` configuration on positions, enabling automated value flows out of positions. The **Source Interface** provides tokens when positions need rebalancing, automatically pulling funds to repay debt when undercollateralized through the `topUpSource` configuration, enabling automated value flows into positions.

Learn more: [DeFi Actions Integration](./defi-actions.md)

### ViewResolver

The **ViewResolver** interface provides metadata for wallet integration, including position details and balance sheets, supported token types, protocol parameters and configuration, and user-friendly data formatting. This enables wallets and dApps to display ALP positions with rich, contextual information.

## System Architecture Diagram

```mermaid
graph TB
    User[User Wallet] -->|Deposit/Withdraw| Position[Position]
    Position -->|Manages| Pool[Pool Contract]
    Pool -->|Stores| Reserves[Token Reserves]
    Pool -->|Queries| Oracle[Price Oracle]
    Pool -->|Updates| TokenState[TokenState per Token]
    Position -->|Auto-Push| Sink[DrawDown Sink]
    Position -->|Auto-Pull| Source[TopUp Source]
    Pool -->|Liquidates| Liquidator[Liquidators/Keepers]

    style Pool fill:#f9f,stroke:#333,stroke-width:4px
    style Position fill:#bbf,stroke:#333,stroke-width:2px
    style Oracle fill:#bfb,stroke:#333,stroke-width:2px
```

## Data Flow

### Deposit Flow

```mermaid
sequenceDiagram
    participant User
    participant Position
    participant Pool
    participant TokenState
    participant Sink

    User->>Position: deposit()
    Position->>Pool: Transfer tokens to reserves
    Pool->>Pool: Update scaled balance
    Pool->>TokenState: Update totals
    Pool->>Pool: Check if overcollateralized
    alt Overcollateralized & DrawDownSink enabled
        Pool->>Pool: Auto-borrow
        Pool->>Sink: Push borrowed tokens
    end
```

**Steps**:
1. User calls `deposit()` on their Position
2. Position transfers tokens to Pool reserves
3. Pool updates user's scaled balance
4. Pool updates global TokenState
5. If `drawDownSink` enabled and overcollateralized → auto-borrow

### Borrow Flow

```mermaid
sequenceDiagram
    participant User
    participant Position
    participant Pool
    participant Reserves

    User->>Position: withdraw(debt token)
    Position->>Pool: Check health factor
    alt Health would remain safe
        Pool->>Pool: Update debt scaled balance
        Pool->>Reserves: Transfer tokens
        Reserves-->>User: Receive tokens
        Pool->>Position: Update health
    else Health would drop too low
        Pool-->>User: Revert: Insufficient health
    end
```

**Steps**:
1. User calls `withdraw()` for debt token
2. Pool checks health factor would remain above minimum
3. Pool updates user's debt scaled balance
4. Pool transfers tokens from reserves to user
5. Position health is recalculated

### Interest Accrual

```mermaid
graph LR
    Time[Time Passes] --> Touch[Any Position<br/>Touched]
    Touch --> Update[Pool Updates<br/>Interest Index]
    Update --> Index[Index Increases<br/>Based on Utilization]
    Index --> All[All Positions'<br/>Balances Grow<br/>Automatically]

    style All fill:#bfb,stroke:#333,stroke-width:2px
```

**Process**:
1. Time passes, interest accumulates
2. When any position is touched, Pool updates interest indices
3. Interest index increases based on utilization and rates
4. All positions' true balances grow automatically via scaled balance math

## Security Architecture

ALP includes multiple layers of security:

```mermaid
graph TB
    subgraph "Security Layers"
        L1[Health Factor<br/>Monitoring]
        L2[Oracle<br/>Safety]
        L3[Liquidation<br/>Mechanisms]
        L4[Circuit<br/>Breakers]
        L5[Access<br/>Controls]
    end

    Protocol[Protocol<br/>Operations] --> L1
    L1 -->|Pass| L2
    L2 -->|Pass| L3
    L3 -->|Pass| L4
    L4 -->|Pass| L5
    L5 -->|Pass| Execute[Execute<br/>Operation]

    style Execute fill:#bfb
```

1. **Health factor monitoring**: Continuous tracking of position solvency
2. **Oracle safety**: Staleness and deviation checks
3. **Liquidation mechanisms**: Multiple paths to resolve undercollateralized positions
4. **Circuit breakers**: Ability to pause operations in emergencies
5. **Access controls**: Permissioned functions for admin operations

## Gas Optimization

The architecture is optimized for gas efficiency:

```mermaid
graph LR
    subgraph "Gas Optimizations"
        O1[Scaled Balances<br/>No per-user updates]
        O2[Batch Operations<br/>Multiple in one tx]
        O3[Efficient Storage<br/>Compact structures]
        O4[Lazy Updates<br/>Calculate on-demand]
    end

    O1 --> Result[Minimal<br/>Gas Costs]
    O2 --> Result
    O3 --> Result
    O4 --> Result

    style Result fill:#bfb,stroke:#333,stroke-width:3px
```

The architecture is optimized for gas efficiency through scaled balances that eliminate per-user interest updates, batch operations that allow single transactions to update multiple positions, efficient storage using compact data structures for on-chain state, and lazy updates that only calculate interest when needed.

## Upgradability

The protocol includes mechanisms for upgrades and parameter adjustments:

```mermaid
graph TD
    Admin[Protocol Admin] --> Functions[Admin Functions]

    Functions --> Rate[Adjust Interest<br/>Rates]
    Functions --> Factor[Update Collateral<br/>Factors]
    Functions --> Token[Add New<br/>Tokens]
    Functions --> Oracle[Switch Price<br/>Feeds]
    Functions --> Feature[Enable/Disable<br/>Features]

    Rate --> Protocol[Protocol<br/>Configuration]
    Factor --> Protocol
    Token --> Protocol
    Oracle --> Protocol
    Feature --> Protocol

    style Protocol fill:#f9f,stroke:#333,stroke-width:2px
```

The protocol supports admin functions to adjust interest rates and collateral factors, dynamic token addition to support new tokens, oracle updates to switch price feed sources, and feature flags to enable or disable features like liquidations.

## Summary

**Core Architecture**:
- 🏗️ Modular design with Pool, Position, TokenState, and Oracle
- 🔗 DeFi Actions framework for composability
- 📊 Scaled balance system for efficiency
- 🛡️ Multiple security layers

**Key Benefits**:
- ✅ Gas efficient scaled balance system
- ✅ Automated flows via Sink/Source interfaces
- ✅ Robust oracle safety features
- ✅ Multi-layer security architecture
- ✅ Flexible and upgradable design

**Integration Points**:
- Flow FungibleToken standard
- DeFi Actions Sink/Source
- ViewResolver for wallets
- Price Oracle interface

## Mathematical Foundation

The architecture implements these mathematical principles:
- **Scaled Balances**: [Interest Mathematics](../fcm/math.md#scaled-balance-system)
- **Health Calculations**: [Health Factor Formula](../fcm/math.md#health-factor)
- **Effective Collateral**: [Collateral Calculation](../fcm/math.md#effective-collateral)
- **Multi-Token Support**: [Multi-Collateral Math](../fcm/math.md#multi-collateral-mathematics)

See [FCM Mathematical Foundations](../fcm/math.md) for complete formulas and proofs.

## Next Steps

- **Understand operations**: [Credit Market Mechanics](./credit-market-mechanics.md)
- **Learn about safety**: [Liquidation System](./liquidation-system.md)
- **Explore automation**: [Position Lifecycle](./position-lifecycle.md)
- **See the big picture**: [FCM Architecture](../fcm/architecture.md)

---

:::tip Key Takeaway
ALP's modular architecture combines efficiency with security. The scaled balance system eliminates gas overhead, DeFi Actions enable composability, and multiple security layers protect users. This design makes ALP both powerful for developers and accessible for users.
:::
