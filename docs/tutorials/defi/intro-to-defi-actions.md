---
title: Introduction to DeFi Actions
description: Learn about DeFi Actions, a suite of standardized Cadence interfaces that enable developers to compose complex DeFi workflows using small, reusable components.
sidebar_position: 0
keywords:
  - defi actions
  - cadence interfaces
  - cadence actions
  - flow actions
  - defi workflows
  - source
  - sink
  - swapper
  - price oracle
  - flasher
  - flash loans
  - atomic transactions
  - composable defi
  - flow blockchain
  - cadence smart contracts
  - defi protocols
  - token vaults
  - unique identifiers
  - event traceability
  - weak guarantees
  - fungible tokens
  - connectors
---

# Introduction to DeFi Actions

:::warning

Flow Actions are being reviewed and finalized in [FLIP 339]. The specific implementation may change as a part of this process.

These tutorials will be updated, but you may need to refactor your code if the implementation changes.

:::

_Actions_ are a suite of standardized Cadence interfaces that enable developers to compose complex workflows, starting with DeFi, by connecting small, reusable components. Actions provide a "LEGO" framework of plug-and-play blocks where each component performs a single operation (deposit, withdraw, swap, price lookup, flash loan) while maintaining composability with other components to create sophisticated workflows executable in a single atomic transaction.

By using DeFi Actions, developers are able remove large amounts of bespoke complexity from building DeFi apps and can instead focus on business logic using nouns and verbs.

## Key Features

- **Atomic Composition** - All operations complete or fail together
- **Weak Guarantees** - Flexible error handling, no-ops when conditions aren't met
- **Event Traceability** - UniqueIdentifier system for tracking operations
- **Protocol Agnostic** - Standardized interfaces across different protocols
- **Struct-based** - Lightweight, copyable components for efficient composition

## Learning Objectives

After completing this tutorial, you will be able to:

- Understand the key features of DeFi Actions including atomic composition, weak guarantees, and event traceability
- Create and use Sources to provide tokens from various protocols and locations
- Create and use Sinks to accept tokens up to defined capacity limits
- Create and use Swappers to exchange tokens between different types with price estimation
- Create and use Price Oracles to get price data for assets with consistent denomination
- Create and use Flashers to provide flash loans with atomic repayment requirements
- Use UniqueIdentifiers to trace and correlate operations across multiple DeFi Actions
- Compose complex DeFi workflows by connecting multiple Actions in a single atomic transaction

## DeFi Action Types

The first five DeFi Actions implement five core primitives to integrate external DeFi protocols.

[TODO - Graphic showing how each DeFi Action works (i.e. Source displays a funnel of assets from various protocols)]

1. **Source**: Provides tokens on demand (e.g. withdraw from vault, claim rewards, pull liquidity)
2. **Sink**: Accepts tokens up to capacity (e.g. deposit to vault, repay loan, add liquidity)
3. **Swapper**: Exchanges one token type for another (e.g. targeted DEX trades, multi-protocol aggregated swaps)
4. **PriceOracle**: Provides price data for assets (e.g. external price feeds, DEX prices, price caching)
5. **Flasher**: Provides flash loans with atomic repayment (e.g. arbitrage, liquidations)

## Connectors

[Connectors] create the bridge between the standardized interfaces of DeFi Actions and the often bespoke and complicated mechanisms of different DeFi protocols. You can utilize existing connectors written by other developers, or create your own.

DeFi Actions are instantiated by creating an instance of the appropriate [struct] from a connector that provides the desired type of action connected to the desired DeFi protocol.

[TODO - Graphic showing something spidery connecting a complicated protocol to a simple interface]

## Token Types

In Cadence, tokens that adhere to the [Fungible Token Standard] have types that work with type safety principles.

For example, you can find the type of $FLOW by running this script:

```cadence
import "FlowToken"

access(all) fun main(): String {
    return Type<@FlowToken.Vault>().identifier
}
```

You'll get:

```zsh
A.1654653399040a61.FlowToken.Vault
```

These types are used by many defi actions to provide a safer method of working with tokens then an arbitrary address that may or may not be a token.

## DeFi Actions

:::info

The following defi actions standardize **usage** patterns for common defi-related tasks. By working with them, you - or ai agents - can more easily write transactions and functionality regardless of the myriad of different ways each protocol works to accomplish these tasks.

That being said, defi protocols and tools operate very differently, which means the calls to instantiate the same kind of action connected to different protocols will vary by protocol and connector.

:::

### Source

A source is a primitive component that can supply a [vault] containing the requested type and amount of tokens from something the user controls, or has authorized access to. This includes, but is not limited to, personal vaults, accounts in protocols, and rewards.

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

Sources _degrade gracefully_ - If the requested amount of tokens is not available, they return the available amount. They always return a vault, even if that vault is empty.

You create a source by instantiating an instance of a `struct` that conforms to `source` from the [connector] for the protocol, or other location, that will provide the tokens. For example, if you want to create a source from a generic vault, you can do that by instantiating a `VaultSource` function from [`FungibleTokenStack`]:

```cadence
import "FungibleToken"
import "FungibleTokenStack"

transaction {

  prepare(acct: AuthAccount) {
    let withdrawCap = acct.getCapability<&AnyResource{FungibleToken.Vault, auth(FungibleToken.Withdraw)}>(
      /private/flowTokenWithdrawAuth
    )

    let source = FungibleTokenStack.VaultSource(
      min: 0.0,
      withdrawVault: withdrawCap,
      uniqueID: nil
    )

    log("Source created for vault type: ".concat(source.withdrawVaultType.identifier))
  }
}
```

### Sink

A sink is the opposite of a source - it's a place to send tokens, up to the limit of the capacity defined in the sink. As with any [resource], this process is non-destructive. Any remaining tokens are left in the vault provided by the source. They also have flexible limits, meaning the capacity can be dynamic.

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

You create a sink similar how you create a source, by instantiating an instance of the appropriate `struct` from the [connector]. For example, to create a sink in a generic vault from, instantiate a `VaultSink` from [`FungibleTokenStack`]:

```cadence
import "FungibleToken"
import "FungibleTokenStack"

transaction {

  prepare(acct: AuthAccount) {
    // Public, non-auth capability to deposit into the vault
    let depositCap = acct.getCapability<&AnyResource{FungibleToken.Vault}>(
      /public/flowTokenReceiver
    )

    // Optional: specify a max balance this Sink should hold
    let maxBalance: UFix64? = nil // or UFix64(1000.0)

    // Optional: for aligning with Source in a stack
    let uniqueID = nil

    let sink = FungibleTokenStack.VaultSink(
      max: maxBalance,
      depositVault: depositCap,
      uniqueID: uniqueID
    )

    log("VaultSink created for deposit type: ".concat(sink.depositVaultType.identifier))
  }
}
```

### Swapper

A swapper exchanges tokens between different types with support for bidirectional swaps and price estimation. Bi-directional means that they support swaps in both directions, which is necessary in the event that an inner connector can't accept the full swap output balance.

They also contain price discovery to provide estimates for the amounts in and out via the [`{Quote}`] object, and the [quote system] enables price caching and execution parameter optimization.

Swappers conform to the `Swapper` [interface]:

```cadence
access(all) struct interface Swapper : Identifiable {
    /// Input and output token types - in and out token types via default `swap()` route
    access(all) view fun inType(): Type
    access(all) view fun outType(): Type

    /// Price estimation methods - quote required amount given some desired output & output for some provided input
    access(all) fun quoteIn(forDesired: UFix64, reverse: Bool): {Quote}
    access(all) fun quoteOut(forProvided: UFix64, reverse: Bool): {Quote}

    /// Swap execution methods
    access(all) fun swap(quote: {Quote}?, inVault: @{FungibleToken.Vault}): @{FungibleToken.Vault}
    access(all) fun swapBack(quote: {Quote}?, residual: @{FungibleToken.Vault}): @{FungibleToken.Vault}
}
```

Once again, you create a swapper by instantiating the appropriate `struct` from the appropriate connector. To create a swapper for [IncrementFi] with the [`IncrementFiConnectors`], instantiate `Swapper`:

```cadence
import "FlowToken"
import "FUSD"
import "IncrementFiConnectors"

transaction {

  prepare(_ acct: AuthAccount) {
    // Minimal path: names will be resolved from flow.json in your local setup
    let swapper = IncrementFiConnectors.Swapper(
      path: [
        "A.FlowToken",
        "A.FUSD"
      ],
      inVault: Type<@FlowToken.Vault>(),
      outVault: Type<@FUSD.Vault>(),
      uniqueID: nil
    )

    // Example: quote how much FUSD you'd get for 10.0 FLOW
    let qOut = swapper.quoteOut(forProvided: 10.0, reverse: false)
    log(qOut)

    // Example: quote how much FLOW you'd need to get 25.0 FUSD
    let qIn = swapper.quoteIn(forDesired: 25.0, reverse: false)
    log(qIn)
  }
}
```

### Price Oracle

A price [oracle] provides price data for assets with a consistent denomination. All prices are returned in the same unit and will return `nil` rather than reverting in the event that a price is unavailable. Prices are indexed by [Cadence type], requiring a specific Cadence-based token type for which to serve prices, as opposed to looking up an asset by a generic address.

You can pass an argument this `Type`, or any conforming fungible token type conforming to the interface to the `price` function to get a price.

The full [interface] for `PriceOracle` is:

```cadence
access(all) struct interface PriceOracle : Identifiable {
    /// Returns the denomination asset (e.g., USDCf, FLOW)
    access(all) view fun unitOfAccount(): Type
    /// Returns current price or nil if unavailable, conditions for which are implementation-specific
    access(all) fun price(ofToken: Type): UFix64?
}
```

To create a `PriceOracle` from [Band] with [`BandOracleConnectors`]:

:::info

You need to pay the oracle to get information from it. Here, we're using another defi action - a source - to fund getting a price from the oracle.

:::

```cadence
import "FlowToken"
import "FungibleToken"
import "FungibleTokenStack"
import "BandOracleConnectors"

transaction {

  prepare(acct: AuthAccount) {
    // Ensure we have a private withdraw capability for FlowToken (auth Withdraw)
    let withdrawPath = /private/flowTokenWithdraw

    if !acct.getCapability<&FlowToken.Vault{FungibleToken.Vault, auth(FungibleToken.Withdraw)}>(withdrawPath).check() {
      acct.link<&FlowToken.Vault{FungibleToken.Vault, auth(FungibleToken.Withdraw)}>(
        withdrawPath,
        target: /storage/flowTokenVault
      ) ?? panic("failed to link FlowToken withdraw capability")
    }

    let withdrawCap = acct.getCapability<&FlowToken.Vault{FungibleToken.Vault, auth(FungibleToken.Withdraw)}>(withdrawPath)

    // Fee source must PROVIDE FlowToken vaults (per PriceOracle preconditions)
    let feeSource = FungibleTokenStack.VaultSource(
      min: 0.0,                   // keep at least 0.0 FLOW in the vault
      withdrawVault: withdrawCap, // auth withdraw capability
      uniqueID: nil
    )

    // unitOfAccount must be a mapped symbol in BandOracleConnectors.assetSymbols.
    // The contract's init already maps FlowToken -> "FLOW", so this is valid.
    let oracle = BandOracleConnectors.PriceOracle(
      unitOfAccount: Type<@FlowToken.Vault>(), // quote token (e.g. FLOW in BASE/FLOW)
      staleThreshold: 600,                     // seconds; nil to skip staleness checks
      feeSource: feeSource,
      uniqueID: nil
    )

    log("Created PriceOracle; unit: ".concat(oracle.unitOfAccount().identifier))
  }
}
```

### Flasher

A flasher provides flash loans with atomic repayment requirements.

If you're not familiar with flash loans, imagine a scenario where you discovered an NFT listed for sale one one marketplace for 1 million dollars, then noticed an open bid to buy that same NFT for 1.1 million dollars on another marketplace.

In theory, you could make an easy 100k by buying the NFT on the first marketplace and then fulfilling the open buy offer on the second marketplace. There's just one big problem - You might not have 1 million dollars liquid just laying around for you to purchase the NFT!

Flash loans solve this problem by enabling you to create one transaction during which you:

1. Borrow 1 million dollars
2. Purchase the NFT
3. Sell the NFT
4. Repay 1 million dollars plus a small fee

:::warning

This scenario may be a scam. A scammer could set up this situation as bait and cancel the buy order the instant someone purchases the NFT that is for sale. You'd be left having payed a vast amount of money for something worthless.

The great thing about Cadence transactions, with or without Actions, is that you can set up an atomic transaction where everything either works, or is reverted. Either you make 100k, or nothing happens except a tiny expenditure of gas.

:::

Flashers adhere to the `Flasher` interface:

```cadence
access(all) struct interface Flasher : Identifiable {
    /// Returns the asset type this Flasher can issue as a flash loan
    access(all) view fun borrowType(): Type
    /// Returns the estimated fee for a flash loan of the specified amount
    access(all) fun calculateFee(loanAmount: UFix64): UFix64
    /// Performs a flash loan of the specified amount. The callback function is passed the fee amount, a loan Vault,
    /// and data. The callback function should return a Vault containing the loan + fee.
    access(all) fun flashLoan(
        amount: UFix64,
        data: AnyStruct?,
        callback: fun(UFix64, @{FungibleToken.Vault}, AnyStruct?): @{FungibleToken.Vault} // fee, loan, data
    )
}
```

You create a flasher the same way as the other actions, but you'll need the address for a `SwapPair`. You can get that onchain at runtime. For example, to borrow $FLOW from [IncrementFi]:

```cadence
import "FungibleToken"
import "FlowToken"
import "FUSD"
import "SwapInterfaces"
import "SwapConfig"
import "SwapFactory"
import "IncrementFiConnectors"

transaction {

  prepare(_ acct: AuthAccount) {
    // Increment uses token *keys* like "A.1654653399040a61.FlowToken" (mainnet FlowToken)
    // and "A.3c5959b568896393.FUSD" (mainnet FUSD).
    let flowKey = "A.1654653399040a61.FlowToken"
    let fusdKey = "A.3c5959b568896393.FUSD"

    // Ask the factory for the pair’s public capability (or address), then verify it.
    // Depending on the exact factory interface you have, one of these will exist:
    //   - getPairAddress(token0Key: String, token1Key: String): Address
    //   - getPairPublicCap(token0Key: String, token1Key: String): Capability<&{SwapInterfaces.PairPublic}>
    //   - getPair(token0Key: String, token1Key: String): Address
    //
    // Try address first; if your factory exposes a different helper, swap it in.
    let pairAddr: Address = SwapFactory.getPairAddress(flowKey, fusdKey)

    // Sanity-check: borrow PairPublic and verify it actually contains FLOW/FUSD
    let pair = getAccount(pairAddr)
      .capabilities
      .borrow<&{SwapInterfaces.PairPublic}>(SwapConfig.PairPublicPath)
      ?? panic("Could not borrow PairPublic at resolved address")

    let info = pair.getPairInfoStruct()
    assert(
      (info.token0Key == flowKey && info.token1Key == fusdKey) ||
      (info.token0Key == fusdKey && info.token1Key == flowKey),
      message: "Resolved pair does not match FLOW/FUSD"
    )

    // Instantiate the Flasher to borrow FLOW (switch to FUSD if you want that leg)
    let flasher = IncrementFiConnectors.Flasher(
      pairAddress: pairAddr,
      type: Type<@FlowToken.Vault>(),
      uniqueID: nil
    )

    log("Flasher ready on mainnet FLOW/FUSD at ".concat(pairAddr.toString()))
  }
}
```

## Identification and Traceability

The `UniqueIdentifier` enables protocols to trace stack operations via defi actions interface-level events, identifying them by IDs. `IdentifiableResource` implementations should ensure that access to the identifier is encapsulated by the structures they identify.

While Cadence struct types can be created in any context (including being passed in as transaction parameters), the authorized `AuthenticationToken` [capability] ensures that only those issued by the DeFiActions contract can be utilized in connectors, preventing forgery.

For example, to use a `UniqueIdentifier` in a source->swap->sink:

```cadence
import "FungibleToken"
import "FlowToken"
import "FungibleTokenStack"
import "IncrementFiConnectors"
import "DeFiActions"

transaction {

  prepare(acct: AuthAccount) {
    // Standard FlowToken paths
    let storagePath = /storage/flowTokenVault
    let publicReceiverPath = /public/flowTokenReceiver
    let privateWithdrawPath = /private/flowTokenVaultWithdraw

    // Ensure public receiver (for Sink)
    if !acct.getCapability<&{FungibleToken.Vault}>(publicReceiverPath).check() {
      acct.link<&FlowToken.Vault{FungibleToken.Vault}>(
        publicReceiverPath,
        target: storagePath
      ) ?? panic("failed to link public receiver")
    }
    let depositCap = acct.getCapability<&{FungibleToken.Vault}>(publicReceiverPath)

    // Ensure private auth-withdraw (for Source)
    if !acct.getCapability<&FlowToken.Vault{FungibleToken.Vault, auth(FungibleToken.Withdraw)}>(privateWithdrawPath).check() {
      acct.link<&FlowToken.Vault{FungibleToken.Vault, auth(FungibleToken.Withdraw)}>(
        privateWithdrawPath,
        target: storagePath
      ) ?? panic("failed to link private withdraw cap")
    }
    let withdrawCap = acct.getCapability<&FlowToken.Vault{FungibleToken.Vault, auth(FungibleToken.Withdraw)}>(privateWithdrawPath)

    // Instantiate: Source, Swapper, Sink (IDs will be aligned next)
    let source = FungibleTokenStack.VaultSource(
      min: 5.0,
      withdrawVault: withdrawCap,
      uniqueID: nil
    )

    // Replace with a real Increment path when swapping tokens (e.g., FLOW→FUSD)
    // e.g. ["A.1654653399040a61.FlowToken", "A.3c5959b568896393.FUSD"]
    let swapper = IncrementFiConnectors.Swapper(
      path: ["A.FlowToken", "A.FlowToken"],
      inVault: Type<@FlowToken.Vault>(),
      outVault: Type<@FlowToken.Vault>(),
      uniqueID: nil
    )

    let sink = FungibleTokenStack.VaultSink(
      max: nil,
      depositVault: depositCap,
      uniqueID: nil
    )

    // Align UniqueIdentifier: copy ID from Source → Swapper and Source → Sink
    DeFiActions.alignID(
      toUpdate: &swapper as auth(Extend) &{DeFiActions.IdentifiableStruct},
      with:     &source  as auth(Identify) &{DeFiActions.IdentifiableStruct}
    )
    DeFiActions.alignID(
      toUpdate: &sink    as auth(Extend) &{DeFiActions.IdentifiableStruct},
      with:     &source  as auth(Identify) &{DeFiActions.IdentifiableStruct}
    )

    // ----- Real composition (no destroy) -----
    // 1) Withdraw from Source
    let tokens <- source.withdrawAvailable(maxAmount: 100.0)

    // 2) Swap with Swapper
    let swapped <- swapper.swap(quote: nil, inVault: <-tokens)

    // 3) Deposit into Sink (consumes by reference via withdraw())
    sink.depositCapacity(from: &swapped as auth(FungibleToken.Withdraw) &{FungibleToken.Vault})

    // 4) Return any residual by depositing the *entire* vault back to user's Flow vault
    //    (works even if balance is 0; deposit will still consume the resource)
    let ownerVault = acct.borrow<&FlowToken.Vault>(storagePath)
      ?? panic("missing FlowToken vault in storage")
    ownerVault.deposit(from: <-swapped)

    // Optional: inspect that all three share the same ID
    log(source.id())
    log(swapper.id())
    log(sink.id())
  }
}
```

## Why `UniqueIdentifier` Matters in DeFiActions

The `UniqueIdentifier` is used to tag multiple DeFiActions connectors as part of the **same logical operation**.  
By aligning the same ID across connectors (e.g., Source → Swapper → Sink), you can:

### 1. Event Correlation

- Every connector emits events tagged with its `UniqueIdentifier`.
- Shared IDs let you filter and group related events in the chain’
  's event stream.
- Makes it easy to see that a withdrawal, swap, and deposit were part of **one workflow**.

### 2. Stack Tracing

- When using composite connectors (e.g., `SwapSource`, `SwapSink`, `MultiSwapper`), IDs allow you to trace the complete path through the stack.
- Helpful for debugging and understanding the flow of operations inside complex strategies.

### 3. Analytics & Attribution

- Enables measuring usage of specific strategies or routes.
- Lets you join data from multiple connectors into a single logical "transaction" for reporting.
- Supports fee attribution and performance monitoring across multi-step workflows.

### Without a Shared `UniqueIdentifier`

- Events from different connectors appear unrelated, even if they occurred in the same transaction.
- Harder to debug, track, or analyze multi-step processes.

## Conclusion

In this tutorial, you learned about DeFi Actions, a suite of standardized Cadence interfaces that enable developers to compose complex DeFi workflows using small, reusable components. You explored the five core DeFi Action types - Source, Sink, Swapper, PriceOracle, and Flasher - and learned how to create and use them with various connectors.

Now that you have completed this tutorial, you should be able to:

- Understand the key features of DeFi Actions including atomic composition, weak guarantees, and event traceability
- Create and use Sources to provide tokens from various protocols and locations
- Create and use Sinks to accept tokens up to defined capacity limits
- Create and use Swappers to exchange tokens between different types with price estimation
- Create and use Price Oracles to get price data for assets with consistent denomination
- Create and use Flashers to provide flash loans with atomic repayment requirements
- Use UniqueIdentifiers to trace and correlate operations across multiple DeFi Actions
- Compose complex DeFi workflows by connecting multiple Actions in a single atomic transaction

<!-- Reference-style links, will not render on page. -->

[Fungible Token Standard]: https://developers.flow.com/build/guides/fungible-token
[Connectors]: ./connectors.md
[connector]: ./connectors.md
[vault]: https://developers.flow.com/build/guides/fungible-token#vaults-on-flow
[interface]: https://cadence-lang.org/docs/language/interfaces
[resource]: https://cadence-lang.org/docs/language/resources
[IncrementFi]: https://app.increment.fi/swap?in=A.1654653399040a61.FlowToken&out=
[`IncrementFiConnectors`]: https://github.com/onflow/DeFiActions/blob/main/cadence/contracts/connectors/increment-fi/IncrementFiConnectors.cdc
[`FungibleTokenStack`]: https://github.com/onflow/DeFiActions/blob/c21b481e20e61cebdf76dff14225d6fb61c1d5e0/cadence/contracts/connectors/FungibleTokenStack.cdc
[oracle]: https://developers.flow.com/ecosystem/defi-liquidity/defi-contracts#oracles
[Band]: https://blog.bandprotocol.com/
[`BandOracleConnectors`]: https://github.com/onflow/DeFiActions/blob/main/cadence/contracts/connectors/band-oracle/BandOracleConnectors.cdc
[Cadence type]: https://cadence-lang.org/docs/language/types-and-type-system/type-safety
[capability]: https://cadence-lang.org/docs/language/capabilities
