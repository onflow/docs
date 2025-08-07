---
title: Introduction to DeFi Actions
description: Learn .
sidebar_position: 0
keywords:
  - 
---

# Introduction to DeFi Actions

:::warning

Flow Actions are being reviewed and finalized in [FLIP 339].  The specific implementation may change as a part of this process.

These tutorials will be updated, but you may need to refactor your code if the implementation changes.

:::

_DeFi Actions_ are a suite of standardized Cadence interfaces that enable developers to compose complex workflows, starting with DeFi, by connecting small, reusable components. Actions provide a "LEGO" framework of plug-and-play blocks where each component performs a single operation (deposit, withdraw, swap, price lookup, flash loan) while maintaining composability with other components to create sophisticated workflows executable in a single atomic transaction.

By using DeFi Actions, developers are able remove large amounts of bespoke complexity from building DeFi apps and can instead focus on business logic using nouns and verbs.

## DeFi Action Types

The first five DeFi Actions implement five core primitives to integrate external DeFi protocols.

[TODO - Graphic showing how each DeFi Action works (i.e. Source displays a funnel of assets from various protocols)]

1. **Source**: Provides tokens on demand (e.g. withdraw from vault, claim rewards, pull liquidity)
2. **Sink**: Accepts tokens up to capacity (e.g. deposit to vault, repay loan, add liquidity)
3. **Swapper**: Exchanges one token type for another (e.g. targeted DEX trades, multi-protocol aggregated swaps)
4. **PriceOracle**: Provides price data for assets (e.g. external price feeds, DEX prices, price caching)
5. **Flasher**: Provides flash loans with atomic repayment (e.g. arbitrage, liquidations)

[Connectors] create the bridge between the standardized interfaces of DeFi Actions and the often bespoke and complicated mechanisms of different DeFi protocols. You can utilize existing connectors written by other developers, or create your own.

DeFi Actions are instantiated by calling the appropriate function in a connector that returns the desired type of action connected to the desired DeFi protocol.

[TODO - Graphic showing something spidery connecting a complicated protocol to a simple interface]

## Source

A source is...

You might use a source for...

For example, if you want to create a source from an [IncrementFi] rewards pool, you can do that by calling the `PoolRewardsSource` function from [`IncrementFiStakingConnectors`]:

```cadence
let poolRewardsSource = IncrementFiStakingConnectors.PoolRewardsSource(
    userCertificate: self.userCertificateCap,
    poolID: pid,
    vaultType: vaultType,
    overflowSinks: {},
    uniqueID: nil
)
```

## Sink


## Swapper


## PriceOracle


## Flasher



## Usage Patterns

### Basic Vault Operations
```cadence
let sink = FungibleTokenStack.VaultSink(
    maximumBalance: 1000.0,
    depositVault: vaultCapability,
    uniqueID: nil
)
sink.depositCapacity(from: &userVault)
```

### Token Swapping
```cadence
let swapper = IncrementFiConnectors.Swapper(
    path: ["A.token1", "A.token2"], 
    inVault: Type<@Token1.Vault>(),
    outVault: Type<@Token2.Vault>(),
    uniqueID: nil
)
let outVault <- swapper.swap(quote: nil, inVault: <-inVault)
```

### Staking Operations
```cadence
let stakingSink = IncrementFiStakingConnectors.PoolSink(
    staker: userAddress,
    poolID: 1,
    uniqueID: nil
)
stakingSink.depositCapacity(from: &tokenVault)
```

## Key Features

- **Atomic Composition** - All operations complete or fail together
- **Weak Guarantees** - Flexible error handling, no-ops when conditions aren't met
- **Event Traceability** - UniqueIdentifier system for tracking operations
- **Protocol Agnostic** - Standardized interfaces across different protocols
- **Struct-based** - Lightweight, copyable components for efficient composition

<!-- Reference-style links, will not render on page. -->

[Connectors]: 
[IncrementFi]: 
[`IncrementFiStakingConnectors`]: 