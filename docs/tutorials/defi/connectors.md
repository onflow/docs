---
title: Connectors
description: Learn .
sidebar_position: 2
keywords:
  - 
---

# Connectors

Connectors are 

You can think of connectors as being similar to a driver that provides a connection between software and piece of hardware without the software developer needing to know how the hardware expects commands to be delivered, or an MCP enabling an agent to use an API.

## Core Interface Methods

All connectors implement these standard methods:

```cadence
// Identity & Component Info
fun getComponentInfo(): ComponentInfo
fun copyID(): UniqueIdentifier?
fun setID(_ id: UniqueIdentifier?)

// Type-specific methods
fun getSinkType(): Type              // Sink only
fun getSourceType(): Type            // Source only  
fun inType() / outType(): Type       // Swapper only

// Core operations
fun minimumCapacity(): UFix64                    // Sink
fun depositCapacity(from: &Vault)               // Sink
fun minimumAvailable(): UFix64                  // Source
fun withdrawAvailable(maxAmount: UFix64): @Vault // Source
fun swap(quote: Quote?, inVault: @Vault): @Vault // Swapper
fun getPrice(baseAsset: Type, quoteAsset: Type): UFix64 // PriceOracle
fun flashLoan(amount: UFix64, callback: Function) // Flasher
```

### FungibleTokenStack
**Purpose**: Generic vault operations for any FungibleToken implementation

- **VaultSink** - Deposits tokens into a vault with configurable maximum balance limits. Accepts tokens until the vault reaches the specified maximum balance, then stops accepting deposits.
  ```cadence
  init(
    max: UFix64?,                                             // Maximum balance limit (nil = no limit)
    depositVault: Capability<&{FungibleToken.Vault}>,        // Vault capability to deposit to
    uniqueID: DeFiActions.UniqueIdentifier?                  // Optional stack identifier
  )
  ```

- **VaultSource** - Withdraws tokens from a vault while maintaining a minimum balance threshold. Ensures the vault never goes below the specified minimum balance.
  ```cadence
  init(
    min: UFix64?,                                                              // Minimum balance to maintain (nil = 0.0)
    withdrawVault: Capability<auth(FungibleToken.Withdraw) &{FungibleToken.Vault}>, // Withdrawable vault capability
    uniqueID: DeFiActions.UniqueIdentifier?                                   // Optional stack identifier
  )
  ```

- **VaultSinkAndSource** - Combines deposit and withdrawal functionality for a single vault. Provides both sink and source capabilities with configurable minimum/maximum balance constraints.
  ```cadence
  init(
    min: UFix64?,                                                              // Minimum balance to maintain (nil = 0.0)
    max: UFix64?,                                                              // Maximum balance limit (nil = no limit)
    vault: Capability<auth(FungibleToken.Withdraw) &{FungibleToken.Vault}>,   // Combined vault capability
    uniqueID: DeFiActions.UniqueIdentifier?                                   // Optional stack identifier
  )
  ```

### SwapStack  
**Purpose**: Token swapping abstractions and swap aggregation

- **MultiSwapper** - Aggregates multiple swapper implementations to find optimal routing. Automatically selects the best swapper from a collection based on quote comparison for maximum output or minimum input.
  ```cadence
  init(
    inVault: Type,                           // Input vault type
    outVault: Type,                          // Output vault type
    swappers: [{DeFiActions.Swapper}],       // Array of swapper implementations
    uniqueID: DeFiActions.UniqueIdentifier?  // Optional stack identifier
  )
  ```

- **SwapSink** - Converts tokens via a swapper before depositing to an inner sink. Takes tokens of one type, swaps them to another type, then deposits to the target sink.
  ```cadence
  init(
    swapper: {DeFiActions.Swapper},          // Swapper to use for conversion
    sink: {DeFiActions.Sink},                // Target sink for converted tokens
    uniqueID: DeFiActions.UniqueIdentifier?  // Optional stack identifier
  )
  ```

- **SwapSource** - Sources tokens and converts them via swapper before returning. Withdraws from an inner source, swaps the tokens to target type, then returns the converted tokens.
  ```cadence
  init(
    swapper: {DeFiActions.Swapper},          // Swapper to use for conversion
    source: {DeFiActions.Source},            // Source to withdraw from
    uniqueID: DeFiActions.UniqueIdentifier?  // Optional stack identifier
  )
  ```

- **BasicQuote** - Simple quote implementation storing input/output amounts and types for swap estimation.
  ```cadence
  init(
    inType: Type,      // Input token type
    outType: Type,     // Output token type
    inAmount: UFix64,  // Input amount
    outAmount: UFix64  // Output amount
  )
  ```

- **MultiSwapperQuote** - Extended quote for MultiSwapper that includes the index of the optimal swapper to use.
  ```cadence
  init(
    inType: Type,         // Input token type
    outType: Type,        // Output token type
    inAmount: UFix64,     // Input amount
    outAmount: UFix64,    // Output amount
    swapperIndex: Int     // Index of optimal swapper to use
  )
  ```

### IncrementFi Protocol Connectors
**Purpose**: Integration with IncrementFi DEX, staking, and liquidity protocols

#### IncrementFiConnectors
- **Swapper** - Executes token swaps via IncrementFi's SwapRouter using predefined token paths. Supports multi-hop swaps through intermediate tokens.
  ```cadence
  init(
    path: [String],                          // Swap path (e.g., ["A.token1", "A.token2"])
    inVault: Type,                           // Input vault type
    outVault: Type,                          // Output vault type
    uniqueID: DeFiActions.UniqueIdentifier?  // Optional stack identifier
  )
  ```

- **Flasher** - Provides flash loan functionality from IncrementFi pools. Executes callbacks with borrowed funds that must be repaid with fees in the same transaction.
  ```cadence
  init(
    pairAddress: Address,                    // IncrementFi pair contract address
    type: Type,                              // Token type to flash loan
    uniqueID: DeFiActions.UniqueIdentifier?  // Optional stack identifier
  )
  ```

#### IncrementFiStakingConnectors  
- **PoolSink** - Stakes tokens in IncrementFi staking pools by pool ID. Automatically discovers pool requirements and enforces user staking limits.
  ```cadence
  init(
    staker: Address,                         // Address of the user staking
    poolID: UInt64,                          // Staking pool identifier
    uniqueID: DeFiActions.UniqueIdentifier?  // Optional stack identifier
  )
  ```

- **PoolRewardsSource** - Claims accumulated staking rewards from IncrementFi pools. Provides reward tokens that users have earned from staking activities.
  ```cadence
  init(
    userCertificate: Capability<&Staking.UserCertificate>, // User's staking certificate capability
    poolID: UInt64,                                        // Staking pool identifier
    vaultType: Type,                                       // Reward token type
    overflowSinks: {Type: {DeFiActions.Sink}},            // Overflow sinks for different reward types
    uniqueID: DeFiActions.UniqueIdentifier?,              // Optional stack identifier
    stakeThreshold: UFix64?                               // Minimum stake threshold
  )
  ```

#### IncrementFiPoolLiquidityConnectors
- **Zapper** - Converts single tokens into liquidity pool (LP) tokens through optimal swapping. Takes one token type, swaps half to the pair token, adds liquidity to the pool, and returns LP tokens. Supports both stable and volatile pools.
  ```cadence
  init(
    token0Type: Type,                        // First token in the pool pair
    token1Type: Type,                        // Second token in the pool pair
    stableMode: Bool,                        // True for stable pools, false for volatile
    uniqueID: DeFiActions.UniqueIdentifier?  // Optional stack identifier
  )
  ```

### BandOracleConnectors
**Purpose**: Price data integration from Band Protocol oracle

- **PriceOracle** - Fetches real-time price data for assets using Band Protocol's decentralized oracle network. Maps asset types to Band Oracle symbols and provides price feeds with configurable staleness thresholds. Requires FlowToken for oracle fees.
  ```cadence
  init(
    unitOfAccount: Type,                     // Token type to get price for (must have symbol mapping)
    staleThreshold: UInt64?,                 // Seconds after which price is considered stale (nil = no check)
    feeSource: {DeFiActions.Source},         // Source providing FlowToken for oracle fees
    uniqueID: DeFiActions.UniqueIdentifier?  // Optional stack identifier
  )
  ```

### DeFiActionsEVMConnectors  
**Purpose**: Integration with EVM-based DeFi protocols on Flow EVM

- **UniswapV2EVMSwapper** - Executes token swaps using UniswapV2-style routers on Flow EVM. Bridges tokens between Cadence and EVM, performs swaps via EVM contracts, and bridges results back to Cadence. Requires a CadenceOwnedAccount for EVM interactions.
  ```cadence
  init(
    routerAddress: EVM.EVMAddress,                              // UniswapV2Router contract address on EVM
    path: [EVM.EVMAddress],                                     // Token swap path (EVM addresses)
    inVault: Type,                                              // Input vault type (Cadence)
    outVault: Type,                                             // Output vault type (Cadence)
    coaCapability: Capability<auth(EVM.Owner) &EVM.CadenceOwnedAccount>, // COA for EVM interactions
    uniqueID: DeFiActions.UniqueIdentifier?                     // Optional stack identifier
  )
  ```