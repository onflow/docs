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

_Actions_ are a suite of standardized Cadence interfaces that enable developers to compose complex workflows, starting with DeFi, by connecting small, reusable components. Actions provide a "LEGO" framework of plug-and-play blocks where each component performs a single operation (deposit, withdraw, swap, price lookup, flash loan) while maintaining composability with other components to create sophisticated workflows executable in a single atomic transaction.

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

A source is a primitive component that can supply a [vault] containing the requested type and amount of tokens from something the user controls, or has authorized access to.  This includes, but is not limited to, personal vaults, accounts in protocols, and rewards.

You'll likely use one or more sources in any transactions using actions if the user needs to pay for something or otherwise provide tokens.

Sources conform to the `Source` [interface]:

```cadence
access(all) struct interface Source : Identifiable {
    /// Returns the Vault type provided by this Source
    access(all) view fun getSourceType(): Type
    /// Returns an estimate of how much can be withdrawn
    access(all) fun minimumAvailable(): UFix64
    /// Withdraws up to maxAmount, returning what's actually available
    access(FungibleToken.Withdraw) fun withdrawAvailable(maxAmount: UFix64): @{FungibleToken.Vault}
}
```

In other words, ever source is guaranteed to have the above functions and return types allowing you to get the type of vault returned by the source, get an estimate of how many tokens may be withdrawn currently, and actually withdraw those tokens, up to the amount available.

Sources _degrade gracefully_ - If the requested amount of tokens is not available, they return the available amount.  They always return a vault, even if that vault is empty.

You create a source by calling the appropriate function in the [connector] for the protocol that will provide the tokens. For example, if you want to create a source from an [IncrementFi] rewards pool, you can do that by calling the `PoolRewardsSource` function from [`IncrementFiStakingConnectors`]:

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

A sink is the opposite of a source - it's a place to send tokens, up to the limit of the capacity defined in the sink.  As with any [resource], this process is non-destructive. Any remaining tokens are left in the vault provided by the source.  They also have flexible limits, meaning the capacity can be dynamic.

Sinks adhere to the `Sink` [interface].

```cadence
access(all) struct interface Sink : Identifiable {
    /// Returns the Vault type accepted by this Sink
    access(all) view fun getSinkType(): Type
    /// Returns an estimate of remaining capacity
    access(all) fun minimumCapacity(): UFix64
    /// Deposits up to capacity, leaving remainder in the referenced vault
    access(all) fun depositCapacity(from: auth(FungibleToken.Withdraw) &{FungibleToken.Vault})
}
```

You create a sink similar how you create a source, by calling a function on the [connector]. For example, to create a sink from an [IncrementFi] pool:

```cadence
let poolSink = IncrementFiStakingConnectors.PoolSink(
    staker: self.userCertificateCap.address,
    poolID: pid,
    uniqueID: nil
)
```

## Swapper


### Zapper




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
[connector]: 
[vault]: 
[interface]: 
[resource]: 
[IncrementFi]: 
[`IncrementFiStakingConnectors`]: 