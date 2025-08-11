---
title: Connectors
description: 
sidebar_position: 2
keywords:
  - 
---

# Connectors

**Connectors** are the bridge between external DeFi protocols and the standardized DeFiActions primitive interfaces. They act as **protocol adapters** that translate protocol-specific APIs into the universal language of DeFi Actions. Think of them as "drivers" that provide a connection between software and piece of hardware without the software developer needing to know how the hardware expects commands to be delivered, or an MCP enabling an agent to use an API in a standardized manner. DeFi Actions act as "money LEGOs" with which you can compose various complex operations with simple transactions. These are the benefits of connectors:

- Abstraction Layer: Connectors act like a universal translator between your application and various DeFi protocols
- Standardized Interface: All connectors implement the same core methods, making them interchangeable
- Protocol Integration: They handle the complex interactions with different DeFi services (swaps, staking, lending, etc.)

## Purpose in the DeFiActions Ecosystem

### 1. **Standardization**

- **Unified API**: All protocols accessed through the same five interfaces
- **Reduced Complexity**: Developers learn one interface, work with any protocol
- **Interoperability**: Easy protocol switching without code changes

### 2. **Composability**

- **Building Blocks**: Mix and match connectors like LEGO pieces
- **Complex Strategies**: Build sophisticated DeFi workflows from simple components
- **Atomic Execution**: All operations within single transaction boundaries

### 3. **Risk Management**

- **Graceful Degradation**: Operations fail softly with no-ops instead of reverts
- **Capacity Awareness**: Work within available limits and constraints
- **Resource Safety**: Proper Cadence resource handling throughout

### 4. **Innovation**

- **Rapid Prototyping**: Quickly test new DeFi strategies
- **Protocol Aggregation**: Combine multiple protocols seamlessly
- **Cross-Chain Operations**: Bridge operations across different environments

## How Connectors Work

### 1. **Abstraction Layer**

Connectors sit between your application logic and protocol-specific contracts:

```
Your DeFi Strategy → DeFiActions Connector → Protocol Contract → Blockchain State
```

### 2. **Interface Implementation**
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

### 3. **Composition Pattern**
Connectors can be combined to create sophisticated workflows:

```cadence
// Claim rewards → Swap to different token → Stake in new pool
ProtocolA.RewardsSource → SwapStack.SwapSource → ProtocolB.StakingSink
```

## 📊 Connector Library

  🔄 SOURCE Primitive Implementations

| Connector | Location | Protocol | Purpose |
|-----------|----------|----------|---------|
| VaultSource | FungibleTokenStack | Generic FungibleToken | Withdraw from vaults with minimum balance protection |
| VaultSinkAndSource | FungibleTokenStack | Generic FungibleToken | Combined vault operations (dual interface) |
| SwapSource | SwapStack | Generic (composes with Swappers) | Source tokens then swap before returning |
| PoolRewardsSource | IncrementFiStakingConnectors | IncrementFi Staking | Claim staking rewards from pools |

  ⬇️ SINK Primitive Implementations

| Connector | Location | Protocol | Purpose |
|-----------|----------|----------|---------|
| VaultSink | FungibleTokenStack | Generic FungibleToken | Deposit to vaults with capacity limits |
| VaultSinkAndSource | FungibleTokenStack | Generic FungibleToken | Combined vault operations (dual interface) |
| SwapSink | SwapStack | Generic (composes with Swappers) | Swap tokens before depositing to inner sink |
| PoolSink | IncrementFiStakingConnectors | IncrementFi Staking | Stake tokens in staking pools |

  🔀 SWAPPER Primitive Implementations

| Connector | Location | Protocol | Purpose |
|-----------|----------|----------|---------|
| MultiSwapper | SwapStack | Generic (DEX aggregation) | Aggregate multiple swappers for optimal routing |
| Swapper | IncrementFiConnectors | IncrementFi DEX | Token swapping through SwapRouter |
| Zapper | IncrementFiPoolLiquidityConnectors | IncrementFi Pools | Single-token liquidity provision |
| UniswapV2EVMSwapper | DeFiActionsEVMConnectors | Flow EVM Bridge | Cross-VM UniswapV2-style swapping |

  💰 PRICEORACLE Primitive Implementations

| Connector | Location | Protocol | Purpose |
|-----------|----------|----------|---------|
| PriceOracle | BandOracleConnectors | Band Protocol | External price feeds with staleness validation |

  ⚡ FLASHER Primitive Implementations

| Connector | Location | Protocol | Purpose |
|-----------|----------|----------|---------|
| Flasher | IncrementFiConnectors | IncrementFi DEX | Flash loans through SwapPair contracts |

## Guide to Building Connectors

### Step 1: Choose Your Primitive

First, determine which DeFiActions primitive(s) your connector will implement:

| Primitive | When to Use | Example Use Cases |
|-----------|-------------|-------------------|
| **Source** | Your protocol provides tokens | Vault withdrawals, reward claiming, unstaking |
| **Sink** | Your protocol accepts tokens | Vault deposits, staking, loan repayments |
| **Swapper** | Your protocol exchanges tokens | DEX trades, cross-chain bridges, LP provision |
| **PriceOracle** | Your protocol provides price data | Oracle feeds, TWAP calculations |
| **Flasher** | Your protocol offers flash loans | Arbitrage opportunities, liquidations |

### Step 2: Analyze Your Protocol

Study your target protocol to understand:
- **Contract interfaces** and method signatures
- **Required parameters** and data structures
- **Error conditions** and failure modes
- **Fee structures** and payment mechanisms
- **Access controls** and permissions

### Step 3: Design Your Connector

Plan your connector implementation:
- **Configuration parameters** needed for initialization
- **Capability requirements** for protocol access
- **Error handling strategy** for graceful failures
- **Resource management** for token handling
- **Event emission** for traceability

### Step 4: Implement the Interface

Create your connector struct implementing the chosen primitive interface(s).

### Step 5: Add Safety Features

Implement safety mechanisms:
- **Capacity checking** before operations
- **Balance validation** after operations
- **Graceful error handling** with no-ops
- **Resource cleanup** for empty vaults

### Step 6: Support DeFiActions Standards

Add required DeFiActions support:
- **IdentifiableStruct** implementation
- **UniqueIdentifier** management
- **ComponentInfo** for introspection
- **Event emission** integration

## Best Practices

### 1. **Error Handling**

- **Graceful Failures**: Return empty results instead of panicking
- **Validation**: Check all inputs and preconditions
- **Resource Safety**: Properly handle vault resources in all paths

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

### 2. **Capacity and Balance Checking**

- **Always Check First**: Validate capacity/availability before operations
- **Respect Limits**: Work within available constraints
- **Handle Edge Cases**: Zero amounts, maximum values, empty vaults

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

### 3. **Type Safety**
- **Validate Types**: Ensure vault types match expected types
- **Early Returns**: Fail fast on type mismatches
- **Clear Error Messages**: Help developers understand issues

```cadence
access(all) fun depositCapacity(from: auth(FungibleToken.Withdraw) &{FungibleToken.Vault}) {
    // Type validation
    if from.getType() != self.getSinkType() {
        return  // No-op for wrong token type
    }
    
    // Continue with deposit...
}
```

### 4. **Event Integration**

- **Leverage Post-conditions**: DeFiActions interfaces emit events automatically  
- **Provide Context**: Include relevant information in events
- **Support Traceability**: Use UniqueIdentifiers consistently

### 5. **Resource Management**

- **Handle Empty Vaults**: Use `DeFiActionsUtils.getEmptyVault()` for consistent empty vault creation
- **Destroy Properly**: Clean up resources in all code paths
- **Avoid Resource Leaks**: Ensure all vaults are handled appropriately

### 6. **Capability Management**

- **Validate Capabilities**: Check capabilities before using them
- **Handle Revocation**: Gracefully handle revoked capabilities
- **Proper Entitlements**: Use correct entitlement levels (auth vs unauth)

### 7. **Documentation**

- **Clear Comments**: Explain protocol-specific logic
- **Usage Examples**: Show how to use your connectors
- **Integration Patterns**: Demonstrate composition with other connectors

## Integration into DeFiActions

### Step 1: Deploy Your Connector Contract

Deploy your connector contract on Flow with the following command:

```bash
flow project deploy
```
In your 'flow.json' you will find:

```bash
# Add to flow.json
"contracts": {
    "MyProtocolConnectors": {
        "source": "./cadence/contracts/connectors/MyProtocolConnectors.cdc",
        "aliases": {
            "emulator": "f8d6e0586b0a20c7",
            "testnet": "...",
            "mainnet": "..."
        }
    }
}

# Deploy the contract
flow accounts add-contract MyProtocolConnectors ./cadence/contracts/connectors/MyProtocolConnectors.cdc
```

### Step 2: Create Usage Transactions

Create transaction templates for using your connectors:

```cadence
// Transaction: save_staking_sink.cdc
import "MyProtocolConnectors"
import "DeFiActions"

transaction(poolID: UInt64, maxStakeAmount: UFix64?) {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        // Get staking capability (implementation specific)
        let stakingCap = signer.capabilities.get<&MyProtocol.StakingPool>(/public/MyProtocolStaking)
        
        // Create the sink connector
        let stakingSink = MyProtocolConnectors.StakingSink(
            poolID: poolID,
            stakingCapability: stakingCap,
            maxStakeAmount: maxStakeAmount,
            uniqueID: nil
        )
        
        // Save to storage for later use
        signer.storage.save(stakingSink, to: /storage/MyProtocolStakingSink)
    }
}
```

### Step 3: Create Combinations Examples

Show how your connectors work with existing DeFiActions components:

```cadence
// Transaction: compound_rewards.cdc
import "MyProtocolConnectors"
import "SwapStack"
import "DeFiActions"

transaction(poolID: UInt64, swapperAddress: Address) {
    prepare(signer: auth(Storage) &Account) {
        // Load connectors from storage
        let rewardsSource = signer.storage.load<MyProtocolConnectors.RewardsSource>(
            from: /storage/MyProtocolRewardsSource
        ) ?? panic("Rewards source not found")
        
        let stakingSink = signer.storage.load<MyProtocolConnectors.StakingSink>(
            from: /storage/MyProtocolStakingSink  
        ) ?? panic("Staking sink not found")
        
        // Get swapper from another protocol
        let swapperAccount = getAccount(swapperAddress)
        let swapper = swapperAccount.storage.load<{DeFiActions.Swapper}>(...)
        
        // Create combination workflow: Rewards → Swap → Stake
        let swapSource = SwapStack.SwapSource(
            swapper: swapper,
            source: rewardsSource,
            uniqueID: DeFiActions.createUniqueIdentifier()
        )
        
        // Execute compound strategy
        let compoundedTokens <- swapSource.withdrawAvailable(maxAmount: UFix64.max)
        stakingSink.depositCapacity(from: compoundedTokens)
        
        // Save updated connectors back to storage
        signer.storage.save(rewardsSource, to: /storage/MyProtocolRewardsSource)
        signer.storage.save(stakingSink, to: /storage/MyProtocolStakingSink)
    }
}
```

### Step 4: Add to Existing Workflows

Integrate your connectors with existing DeFiActions workflows:

```cadence
// Use in AutoBalancer
let autoBalancer <- DeFiActions.createAutoBalancer(
    vault: <-initialTokens,
    lowerThreshold: 0.9,
    upperThreshold: 1.1,
    source: myProtocolRewardsSource,  // Your connector
    sink: myProtocolStakingSink,      // Your connector
    oracle: bandPriceOracle,
    uniqueID: nil
)
```

## Conclusion

The DeFiActions framework provides a comprehensive set of connectors that successfully implement the 5 fundamental DeFi primitives across multiple protocols:

- **20+ Connector Implementations** spanning basic vault operations to complex cross-VM swapping
- **4 Protocol Integrations**: Generic FungibleToken, IncrementFi, Band Oracle, Flow EVM
- **Composable Architecture**: Connectors can be combined to create sophisticated financial workflows
- **Safety-First Design**: Graceful error handling and resource safety throughout
- **Event-Driven Traceability**: Full workflow tracking and debugging capabilities

This framework enables developers to build sophisticated DeFi strategies while maintaining the simplicity and reliability of standardized primitive interfaces. The modular design allows for easy extension to additional protocols while preserving composability and atomic execution guarantees.