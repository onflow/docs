---
title: Connectors
description: Build Flow Actions connectors that integrate protocols with Flow Actions primitives
sidebar_position: 2
keywords:
  - Connectors
  - Flow Actions
  - Sink
  - Swap
  - Source
  - Oracles
  - Flashers
  - DeFi
  - Protocols
---

# Connectors

:::warning

We are reviewing and finalizing Flow Actions in [FLIP 339]. The specific implementation may change as a part of this process.

We will update these tutorials, but you may need to refactor your code if the implementation changes.

:::

## Overview

**Connectors** are the bridge between external DeFi protocols and the standardized Flow Actions primitive interfaces. They act as **protocol adapters** that translate protocol-specific APIs into the universal language of Flow Actions. Think of them as "drivers" that provide a connection between software and a piece of hardware without the software developer needing to know how the hardware expects to receive commands, or an MCP allowing an agent to use an API in a standardized manner. 

Flow Actions act as "money LEGOs" with which you can compose various complex operations with simple transactions. These are the benefits of connectors:

- Abstraction Layer: Connectors act like a universal translator between your application and various decentralized finance (DeFi) protocols.
- Standardized Interface: All connectors implement the same core methods, which makes them interchangeable.
- Protocol Integration: They handle the complex interactions with different DeFi services (swaps, staking, lending, and so on).

## How Connectors Work

### Abstraction Layer

Connectors sit between your application logic and protocol-specific contracts:

```
Your DeFi Strategy → Flow Actions Connector → Protocol Contract → Blockchain State
```

### Interface Implementation

Each connector implements one or more of the five primitive interfaces:

```cadence
// Example: A connector implementing the Sink primitive
access(all) struct MyProtocolSink: DeFiActions.Sink {
    // Protocol-specific configuration
    access(self) let protocolConfig: MyProtocol.Config
    
    // DeFiActions required methods
    access(all) fun getSinkType(): Type { ... }
    access(all) fun minimumCapacity(): UFix64 { ... }
    access(all) fun depositCapacity(from: auth(FungibleToken.Withdraw) &{FungibleToken.Vault}) { ... }
}
```

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

### Composition Pattern

You can combine Connetors to create sophisticated workflows:

```cadence
// Claim rewards → Swap to different token → Stake in new pool
ProtocolA.RewardsSource → SwapConnectors.SwapSource → ProtocolB.StakingSink
```

## Connector Library

  🔄 SOURCE Primitive Implementations

| Connector | Location | Protocol | Purpose |
|-----------|----------|----------|---------|
| VaultSource | [FungibleTokenConnectors] | Generic FungibleToken | Withdraw from vaults with minimum balance protection. |
| VaultSinkAndSource | [FungibleTokenConnectors] | Generic FungibleToken | Combined vault operations (dual interface). |
| SwapSource | [SwapConnectors] | Generic (composes with Swappers) | Source tokens then swap before returning. |
| PoolRewardsSource | [IncrementFiStakingConnectors] | IncrementFi Staking | Claim staking rewards from pools. |

  ⬇️ SINK Primitive Implementations

| Connector | Location | Protocol | Purpose |
|-----------|----------|----------|---------|
| VaultSink | [FungibleTokenConnectors] | Generic FungibleToken | Deposit to vaults with capacity limits. |
| VaultSinkAndSource | [FungibleTokenConnectors] | Generic FungibleToken | Combined vault operations (dual interface). |
| SwapSink | [SwapConnectors] | Generic (composes with Swappers) | Swap tokens before depositing to inner sink. |
| PoolSink | [IncrementFiStakingConnectors] | IncrementFi Staking | Stake tokens in staking pools. |

  🔀 SWAPPER Primitive Implementations

| Connector | Location | Protocol | Purpose |
|-----------|----------|----------|---------|
| MultiSwapper | [SwapConnectors] | Generic (DEX aggregation) | Aggregate multiple swappers for optimal routing. |
| Swapper | [IncrementFiSwapConnectors] | IncrementFi DEX | Token swapping through SwapRouter. |
| Zapper | [IncrementFiPoolLiquidityConnectors] | IncrementFi Pools | Single-token liquidity provision. |
| UniswapV2EVMSwapper | [UniswapV2SwapConnectors] | Flow EVM Bridge | Cross-VM UniswapV2-style swapping. |

  💰 PRICEORACLE Primitive Implementations

| Connector | Location | Protocol | Purpose |
|-----------|----------|----------|---------|
| PriceOracle | [BandOracleConnectors] | Band Protocol | External price feeds with staleness validation. |

  ⚡ FLASHER Primitive Implementations

| Connector | Location | Protocol | Purpose |
|-----------|----------|----------|---------|
| Flasher | [IncrementFiFlashloanConnectors] | IncrementFi DEX | Flash loans through SwapPair contracts. |

## Guide to Building Connectors

### Choose Your Primitive

First, determine which Flow Actions primitive(s) your connector will implement:

| Primitive | When to Use | Example Use Cases |
|-----------|-------------|-------------------|
| **Source** | Your protocol provides tokens | Vault withdrawals, reward claiming, unstaking. |
| **Sink** | Your protocol accepts tokens | Vault deposits, staking, loan repayments. |
| **Swapper** | Your protocol exchanges tokens | DEX trades, cross-chain bridges, LP provision. |
| **PriceOracle** | Your protocol provides price data | Oracle feeds, TWAP calculations. |
| **Flasher** | Your protocol offers flash loans | Arbitrage opportunities, liquidations. |

### Analyze Your Protocol

Study your target protocol to understand:

- **Contract interfaces** and method signatures
- **Required parameters** and data structures
- **Error conditions** and failure modes
- **Fee structures** and payment mechanisms
- **Access controls** and permissions

### Design Your Connector

Plan your connector implementation:

- **Configuration parameters** needed for initialization
- **Capability requirements** for protocol access
- **Error handling strategy** for graceful failures
- **Resource management** for token handling
- **Event emission** for traceability

### Implement the Interface

Create your connector struct implementing the chosen primitive interface(s).

### Add Safety Features

Implement safety mechanisms:
- **Capacity checking** before operations
- **Balance validation** after operations
- **Graceful error handling** with no-ops
- **Resource cleanup** for empty vaults

### Support Flow Actions Standards

Add required Flow Actions support:
- **IdentifiableStruct** implementation
- **UniqueIdentifier** management
- **ComponentInfo** for introspection
- **Event emission** integration

## Best Practices

### **Error Handling**

- **Graceful Failures**: Return empty results instead of panicking.
- **Validation**: Check all inputs and preconditions.
- **Resource Safety**: Properly handle vault resources in all paths.

```cadence
// Good: Graceful failure
access(all) fun minimumCapacity(): UFix64 {
    if let pool = self.poolCapability.borrow() {
        return pool.getAvailableCapacity()
    }
    return 0.0  // Graceful failure
}

// Bad: Panics on failure  
access(all) fun minimumCapacity(): UFix64 {
    let pool = self.poolCapability.borrow()!  // Will panic if invalid
    return pool.getAvailableCapacity()
}
```

### **Capacity and Balance Checking**

- **Always Check First**: Validate capacity/availability before operations.
- **Respect Limits**: Work within available constraints.
- **Handle Edge Cases**: Zero amounts, maximum values, empty vaults.

```cadence
access(all) fun depositCapacity(from: auth(FungibleToken.Withdraw) &{FungibleToken.Vault}) {
    // Check capacity first
    let capacity = self.minimumCapacity()
    if capacity == 0.0 { return }
    
    // Calculate actual deposit amount
    let availableAmount = from.balance
    let depositAmount = capacity < availableAmount ? capacity : availableAmount
    
    // Handle edge case
    if depositAmount == 0.0 { return }
    
    // Proceed with deposit...
}
```

### **Type Safety**

- **Validate Types**: Ensure vault types match expected types.
- **Early Returns**: Fail fast on type mismatches.
- **Clear Error Messages**: Help developers understand issues.

```cadence
access(all) fun depositCapacity(from: auth(FungibleToken.Withdraw) &{FungibleToken.Vault}) {
    // Type validation
    if from.getType() != self.getSinkType() {
        return  // No-op for wrong token type
    }
    
    // Continue with deposit...
}
```

### **Event Integration**

- **Leverage Post-conditions**: Flow Actions interfaces emit events automatically.  
- **Provide Context**: Include relevant information in events.
- **Support Traceability**: Use UniqueIdentifiers consistently.

### **Resource Management**

- **Handle Empty Vaults**: Use `DeFiActionsUtils.getEmptyVault()` for consistent empty vault creation.
- **Destroy Properly**: Clean up resources in all code paths.
- **Avoid Resource Leaks**: Ensure all vaults are handled appropriately.

### **Capability Management**

- **Validate Capabilities**: Check capabilities before using them.
- **Handle Revocation**: Gracefully handle revoked capabilities.
- **Proper Entitlements**: Use correct entitlement levels (auth vs unauth).

### **Documentation**

- **Clear Comments**: Explain protocol-specific logic.
- **Usage Examples**: Show how to use your connectors.
- **Integration Patterns**: Demonstrate composition with other connectors.

## Integration into Flow Actions

We will now go over how to build a connector and integrate it with Flow Actions. Specifically, we will showcase the process of using the **VaultSink** connector in the [FungibleTokenConnectors]. It only performs basic token deposits to a vault with capacity limits, implements the Sink interface, has minimal external dependencies (only FungibleToken standard), and requires simple configuration (max balance, deposit vault capability,and unique ID).

The `VaultSink` connector is already deployed and working in Flow Actions. Let's examine how it's integrated:

**Location**: `cadence/contracts/connectors/FungibleTokenConnectors.cdc`
**Contract**: `FungibleTokenConnectors` 
**Connector**: `VaultSink` struct that defines the interaction with the connector.

### Deploy Your Connector Contract

Deploy your connector contract with the following command:

```bash
flow project deploy
```
In your 'flow.json' you will find:

```json
{
  "contracts": {
    "FungibleTokenConnectors": {
      "source": "./cadence/contracts/connectors/FungibleTokenConnectors.cdc",
      "aliases": {
        "emulator": "f8d6e0586b0a20c7",
        "testnet": "...",
        "mainnet": "..."
      }
    }
  }
}
```

### Create Usage Transactions

Create transaction templates for using your connectors:

```cadence
// Transaction: save_vault_sink.cdc
import "FungibleTokenConnectors"
import "DeFiActions"
import "FungibleToken"

transaction(maxBalance: UFix64) {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        // Get vault capability for deposits
        let vaultCap = signer.capabilities.get<&{FungibleToken.Receiver}>(
            /public/flowTokenReceiver
        )
        
        // Create the VaultSink connector
        let vaultSink = FungibleTokenConnectors.VaultSink(
            max: maxBalance,
            depositVault: vaultCap,
            uniqueID: nil
        )
        
        // Save to storage for later use
        signer.storage.save(vaultSink, to: /storage/FlowTokenVaultSink)
    }
}
```

### Real Usage Transaction: VaultSink

Here's the actual working transaction that creates a VaultSink:

```cadence
// File: cadence/transactions/fungible-token-stack/save_vault_sink.cdc
import "FungibleToken"
import "FungibleTokenMetadataViews"
import "FlowToken"
import "FungibleTokenConnectors"

transaction(receiver: Address, vaultPublicPath: PublicPath, sinkStoragePath: StoragePath, max: UFix64?) {
    let depositVault: Capability<&{FungibleToken.Vault}>
    let signer: auth(SaveValue) &Account

    prepare(signer: auth(SaveValue) &Account) {
        // Get the receiver's vault capability
        self.depositVault = getAccount(receiver).capabilities.get<&{FungibleToken.Vault}>(vaultPublicPath)
        self.signer = signer
    }

    pre {
        self.signer.storage.type(at: sinkStoragePath) == nil:
            "Collision at sinkStoragePath \(sinkStoragePath.toString())"
        self.depositVault.check(): "Invalid deposit vault capability"
    }

    execute {
        // Create the VaultSink connector
        let sink = FungibleTokenConnectors.VaultSink(
            max: max,                    // Maximum capacity (nil = unlimited)
            depositVault: self.depositVault,  // Where tokens will be deposited
            uniqueID: nil               // No unique ID for this example
        )
        
        // Save the connector for later use
        self.signer.storage.save(sink, to: sinkStoragePath)
        
        log("VaultSink created and saved!")
        log("Max capacity: ".concat(max?.toString() ?? "unlimited"))
        log("Receiver: ".concat(receiver.toString()))
    }

    post {
        self.signer.storage.type(at: sinkStoragePath) == Type<FungibleTokenConnectors.VaultSink>():
            "VaultSink was not stored correctly"
    }
}
```

Execute this transaction:

```bash
flow transactions send cadence/transactions/fungible-token-stack/save_vault_sink.cdc \
  --arg Address:0x01cf0e2f2f715450 \
  --arg PublicPath:"/public/FlowTokenReceiver" \
  --arg StoragePath:"/storage/FlowTokenSink" \
  --arg "UFix64?":1000.0 \
  --signer emulator
```

### Create Combinations Examples

Show how your connectors work with existing Flow Actions components:

```cadence
// Example: Using VaultSink in a real deposit workflow
import "FungibleTokenConnectors"
import "FlowToken"

transaction(depositAmount: UFix64) {
    prepare(signer: auth(BorrowValue) &Account) {
        // 1. Load the saved VaultSink
        let sink = signer.storage.borrow<&FungibleTokenConnectors.VaultSink>(
            from: /storage/FlowTokenSink
        ) ?? panic("VaultSink not found - create one first!")
        
        // 2. Create a simple source (your own vault)
        let flowVault = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
            from: /storage/FlowTokenVault
        ) ?? panic("FlowToken vault not found")
        
        // 3. Check sink capacity before depositing
        let capacity = sink.minimumCapacity()
        log("Sink capacity: ".concat(capacity.toString()))
        
        if capacity >= depositAmount {
            // 4. Execute Source → Sink workflow
            let tokens <- flowVault.withdraw(amount: depositAmount)
            sink.depositCapacity(from: tokens)
            log("Deposited ".concat(depositAmount.toString()).concat(" FLOW through VaultSink!"))
        } else {
            log("Insufficient sink capacity: ".concat(capacity.toString()))
        }
    }
}
```

### Add to Existing Workflows

You can use VaultSink in advanced Flow Actions workflows:

```cadence
// Example: VaultSink in AutoBalancer (real integration pattern)
import "DeFiActions"
import "FungibleTokenConnectors" 
import "BandOracleConnectors"

transaction() {
    prepare(signer: auth(SaveValue, BorrowValue, IssueStorageCapabilityController) &Account) {
        // 1. Create rebalancing sink using VaultSink pattern
        let rebalanceCap = getAccount(signer.address)
            .capabilities.get<&{FungibleToken.Receiver}>(/public/FlowTokenReceiver)
        
        let rebalanceSink = FungibleTokenConnectors.VaultSink(
            max: nil,  // No limit for rebalancing
            depositVault: rebalanceCap,
            uniqueID: nil
        )
        
        // 2. Create rebalancing source 
        let sourceCap = signer.capabilities.storage.issue<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
            /storage/FlowTokenVault
        )
        let rebalanceSource = FungibleTokenConnectors.VaultSource(
            min: 100.0,  // Keep 100 FLOW minimum
            withdrawVault: sourceCap,
            uniqueID: nil
        )
        
        // 3. Create price oracle
        let priceOracle = BandOracleConnectors.PriceOracle(
            unitOfAccount: Type<@FlowToken.Vault>(),
            staleThreshold: 3600,
            feeSource: rebalanceSource,
            uniqueID: nil
        )
        
        // 4. Create AutoBalancer using VaultSink pattern
        let autoBalancer <- DeFiActions.createAutoBalancer(
            oracle: priceOracle,
            vaultType: Type<@FlowToken.Vault>(),
            lowerThreshold: 0.9,
            upperThreshold: 1.1,
            rebalanceSink: rebalanceSink,      // Uses VaultSink!
            rebalanceSource: rebalanceSource,  // Uses VaultSource!
            uniqueID: nil
        )
        
        signer.storage.save(<-autoBalancer, to: /storage/FlowAutoBalancer)
        
        log("AutoBalancer created using VaultSink/VaultSource pattern!")
    }
}
```

### For Your Own Connectors

When building your own connectors, follow the VaultSink pattern:

1. **Keep constructors simple** - minimal required parameters.
2. **Validate inputs** - check capabilities and preconditions.
3. **Handle errors gracefully** - no-ops instead of panics.
4. **Support Flow Actions standards** - UniqueIdentifier, ComponentInfo.
5. **Test thoroughly** - create usage transactions like the ones shown.
6. **Document clearly** - show real integration examples.

## Conclusion

The Flow Actions framework provides a comprehensive set of connectors that successfully implement the five fundamental DeFi primitives across multiple protocols:

- **20+ Connector Implementations** spanning basic vault operations to complex cross-VM swapping.
- **4 Protocol Integrations**: Generic FungibleToken, IncrementFi, Band Oracle, Flow EVM.
- **Composable Architecture**: Combine Connectors to create sophisticated financial workflows.
- **Safety-First Design**: Graceful error handling and resource safety throughout.
- **Event-Driven Traceability**: Full workflow tracking and debugging capabilities.

This framework allows developers to build sophisticated DeFi strategies while maintaining the simplicity and reliability of standardized primitive interfaces. The modular design allows for easy extension to additional protocols while preserving composability and atomic execution guarantees.

<!-- Relative links, will not render on page -->
[FLIP 339]: https://github.com/onflow/flips/pull/339/files
[FungibleTokenConnectors]: https://github.com/onflow/FlowActions/blob/main/cadence/contracts/connectors/FungibleTokenConnectors.cdc
[SwapConnectors]: https://github.com/onflow/FlowActions/blob/main/cadence/contracts/connectors/SwapConnectors.cdc
[IncrementFiStakingConnectors]: https://github.com/onflow/FlowActions/blob/main/cadence/contracts/connectors/increment-fi/IncrementFiStakingConnectors.cdc
[IncrementFiSwapConnectors]: https://github.com/onflow/FlowActions/blob/main/cadence/contracts/connectors/increment-fi/IncrementFiSwapConnectors.cdc
[IncrementFiPoolLiquidityConnectors]: https://github.com/onflow/FlowActions/blob/main/cadence/contracts/connectors/increment-fi/IncrementFiPoolLiquidityConnectors.cdc
[UniswapV2SwapConnectors]: https://github.com/onflow/FlowActions/blob/main/cadence/contracts/connectors/evm/UniswapV2SwapConnectors.cdc
[BandOracleConnectors]: https://github.com/onflow/FlowActions/blob/main/cadence/contracts/connectors/band-oracle/BandOracleConnectors.cdc
[IncrementFiFlashloanConnectors]: https://github.com/onflow/FlowActions/blob/main/cadence/contracts/connectors/increment-fi/IncrementFiFlashloanConnectors.cdc