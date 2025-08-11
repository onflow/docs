---
title: Basic Combinations
description: Learn how to combine DeFi Actions primitives to create powerful DeFi workflows
sidebar_position: 3
keywords:
  - combinations
  - workflows
  - strategies
  - examples
---

# Composing Workflows with DeFi Actions

DeFi Actions are designed to be **composable** - meaning you can chain them together like LEGO blocks to build complex strategies. Each primitive has a specific role:

- **Source** → Withdraw tokens
- **Sink** → Deposit tokens  
- **Swapper** → Convert tokens
- **PriceOracle** → Provide price data
- **Flasher** → Provide flash loans

## Usage Examples

## 🔄 Core Flow Patterns

### 1. **Linear Flow** (Source → Swapper → Sink)
The most common pattern: get tokens, convert them, then deposit them.

```
Source → Swapper → Sink
```

**Example**: Claim rewards → Swap to different token → Stake in new pool

### 2. **Bidirectional Flow** (Source ↔ Sink)
Two-way operations where you can both deposit and withdraw.

```
Source ↔ Sink
```

**Example**: Vault operations with both deposit and withdrawal capabilities

### 3. **Aggregated Flow** (Multiple Sources → Aggregator → Sink)
Combine multiple sources for optimal results.

```
Source A → Aggregator → Sink
Source B ↗
Source C ↗
```

**Example**: Multiple DEX aggregators finding the best swap route

## 💡 Common DeFi Workflow Combinations

### **Reward Harvesting & Conversion**

**Goal**: Claim staking rewards and convert them to a stable token

```cadence
// 1. Source: Claim rewards from staking pool
let rewardsSource = IncrementFiStakingConnectors.PoolRewardsSource(
    userCertificate: userCert,
    poolID: 1,
    vaultType: Type<@FlowToken.Vault>(),
    overflowSinks: {},
    uniqueID: nil
)

// 2. Swapper: Convert rewards to stable token
let swapper = IncrementFiConnectors.Swapper(
    path: ["A.FlowToken", "A.USDC"],
    inVault: Type<@FlowToken.Vault>(),
    outVault: Type<@USDC.Vault>(),
    uniqueID: nil
)

// 3. Sink: Deposit stable tokens to vault
let vaultSink = FungibleTokenStack.VaultSink(
    max: 1000.0,
    depositVault: vaultCap,
    uniqueID: nil
)

// Execute the workflow
let rewards = rewardsSource.withdrawAvailable(1000.0)
let stableTokens = swapper.swap(nil, inVault: <-rewards)
vaultSink.depositCapacity(from: &stableTokens)
```

### **Liquidity Provision & Yield Farming**

**Goal**: Convert single token to LP tokens for yield farming

```cadence
// 1. Source: Provide single token (e.g., FLOW)
let flowSource = FungibleTokenStack.VaultSource(
    min: 100.0,
    withdrawVault: flowVaultCap,
    uniqueID: nil
)

// 2. Zapper: Convert to LP tokens
let zapper = IncrementFiPoolLiquidityConnectors.Zapper(
    token0Type: Type<@FlowToken.Vault>(),
    token1Type: Type<@USDC.Vault>(),
    stableMode: false,
    uniqueID: nil
)

// 3. Sink: Stake LP tokens for rewards
let stakingSink = IncrementFiStakingConnectors.PoolSink(
    staker: user.address,
    poolID: 2,
    uniqueID: nil
)

// Execute the workflow
let flowTokens = flowSource.withdrawAvailable(100.0)
let lpTokens = zapper.swap(nil, inVault: <-flowTokens)
stakingSink.depositCapacity(from: &lpTokens)
```

### **Cross-VM Bridge & Swap**

**Goal**: Bridge tokens from Cadence to EVM, swap them, then bridge back

```cadence
// 1. Source: Cadence vault
let cadenceSource = FungibleTokenStack.VaultSource(
    min: 50.0,
    withdrawVault: cadenceVaultCap,
    uniqueID: nil
)

// 2. EVM Swapper: Cross-VM swap
let evmSwapper = DeFiActionsEVMConnectors.UniswapV2EVMSwapper(
    routerAddress: EVM.EVMAddress(0x...),
    path: [tokenA, tokenB],
    inVault: Type<@FlowToken.Vault>(),
    outVault: Type<@USDC.Vault>(),
    coaCapability: coaCap,
    uniqueID: nil
)

// 3. Sink: Cadence vault for swapped tokens
let cadenceSink = FungibleTokenStack.VaultSink(
    max: nil,
    depositVault: usdcVaultCap,
    uniqueID: nil
)

// Execute the workflow
let cadenceTokens = cadenceSource.withdrawAvailable(50.0)
let evmTokens = evmSwapper.swap(nil, inVault: <-cadenceTokens)
cadenceSink.depositCapacity(from: &evmTokens)
```

### **Flash Loan Arbitrage**

**Goal**: Borrow tokens, execute arbitrage, repay loan with profit

```cadence
// 1. Flasher: Borrow tokens for arbitrage
let flasher = IncrementFiConnectors.Flasher(
    pairAddress: pairAddress,
    type: Type<@FlowToken.Vault>(),
    uniqueID: nil
)

// 2. Multi-swapper: Find best arbitrage route
let multiSwapper = SwapStack.MultiSwapper(
    inVault: Type<@FlowToken.Vault>(),
    outVault: Type<@FlowToken.Vault>(),
    swappers: [swapper1, swapper2, swapper3],
    uniqueID: nil
)

// 3. Execute arbitrage with callback
flasher.flashLoan(1000.0, callback: arbitrageCallback)
```

## 🚀 Advanced Workflow Combinations

### **Multi-Protocol Aggregation**

**Goal**: Find the best rates across multiple DEX protocols

```cadence
// Aggregate multiple DEX protocols
let multiSwapper = SwapStack.MultiSwapper(
    inVault: Type<@FlowToken.Vault>(),
    outVault: Type<@USDC.Vault>(),
    swappers: [
        incrementFiSwapper,
        evmSwapper,
        // Additional DEX swappers...
    ],
    uniqueID: nil
)

// Automatically selects best rate
let quote = multiSwapper.quoteOut(forProvided: 100.0, reverse: false)
let result <- multiSwapper.swap(quote: quote, inVault: <-flowTokens)
```

### **Price-Informed Rebalancing**

**Goal**: Create autonomous rebalancing system based on price feeds

```cadence
// Create autonomous rebalancing system
let priceOracle = BandOracleConnectors.PriceOracle(
    unitOfAccount: Type<@FlowToken.Vault>(),
    staleThreshold: 3600, // 1 hour
    feeSource: flowTokenSource,
    uniqueID: nil
)

let autoBalancer <- DeFiActions.createAutoBalancer(
    vault: <-initialVault,
    lowerThreshold: 0.8,
    upperThreshold: 1.2,
    source: rebalanceSource,
    sink: rebalanceSink, 
    oracle: priceOracle,
    uniqueID: nil
)

autoBalancer.rebalance(force: false)  // Autonomous rebalancing
```

### **Restake & Compound Strategy**

**Goal**: Automatically compound staking rewards back into the pool

```cadence
// Restake rewards workflow  
let rewardsSource = IncrementFiStakingConnectors.PoolRewardsSource(
    poolID: 1, 
    staker: userAddress, 
    uniqueID: nil
)
let zapper = IncrementFiPoolLiquidityConnectors.Zapper(...)
let swapSource = SwapStack.SwapSource(
    swapper: zapper, 
    source: rewardsSource, 
    uniqueID: nil
)
let poolSink = IncrementFiStakingConnectors.PoolSink(
    poolID: 1, 
    staker: userAddress, 
    uniqueID: nil
)

let lpTokens <- swapSource.withdrawAvailable(maxAmount: UFix64.max)
poolSink.depositCapacity(from: lpTokens)
```

### **Scheduled Callbacks**

## 🛡️ Safety Best Practices

### **1. Always Check Capacity**

```cadence
// Check before depositing
if sink.depositCapacity(from: &vault) {
    sink.depositCapacity(from: &vault)
} else {
    // Handle insufficient capacity
}
```

### **2. Validate Balances**

```cadence
// Verify operations completed successfully
let beforeBalance = vault.balance
sink.depositCapacity(from: &vault)
let afterBalance = vault.balance

assert(afterBalance >= beforeBalance, message: "Balance should not decrease")
```

### **3. Use Graceful Degradation**

```cadence
// Handle failures gracefully
if let result = try? operation.execute() {
    // Success path
} else {
    // Fallback or no-op
    log("Operation failed, continuing with strategy")
}
```

### **4. Resource Management**

```cadence
// Always clean up resources
let vault = source.withdrawAvailable(amount)
defer {
    // Ensure vault is properly handled
    if vault.balance > 0 {
        // Return unused tokens
        sourceVault.deposit(from: <-vault)
    }
}
```

## 🔧 Testing Your Combinations

### **Unit Testing**

```cadence
// Test individual components
test("VaultSource should maintain minimum balance") {
    let source = VaultSource(min: 100.0, withdrawVault: vaultCap, uniqueID: nil)
    
    // Test minimum balance enforcement
    let available = source.minimumAvailable()
    assert(available >= 100.0, message: "Should maintain minimum balance")
}
```

### **Integration Testing**

```cadence
// Test complete workflows
test("Reward harvesting workflow should complete successfully") {
    let workflow = RewardHarvestingWorkflow(
        rewardsSource: rewardsSource,
        swapper: swapper,
        sink: sink
    )
    
    let result = workflow.execute()
    assert(result.success, message: "Workflow should complete successfully")
}
```

### **Simulation Testing**

```cadence
// Test with simulated market conditions
test("Strategy should handle price volatility") {
    let strategy = ArbitrageStrategy(
        priceOracle: mockPriceOracle,
        swapper: mockSwapper
    )
    
    // Simulate price changes
    mockPriceOracle.setPrice(1.0)
    let result1 = strategy.execute()
    
    mockPriceOracle.setPrice(2.0)
    let result2 = strategy.execute()
    
    assert(result1 != result2, message: "Strategy should adapt to price changes")
}
```

## 📚 Next Steps

Now that you understand basic combinations, explore:

1. **Advanced Strategies**: Complex multi-step workflows
2. **Risk Management**: Advanced safety and monitoring techniques
3. **Custom Connectors**: Building your own protocol adapters

## Conclusion

Composability is the core strength of DeFi Actions. You've now mastered the art of combining DeFi Actions primitives to create powerful, automated workflows. By understanding the core flow patterns and safety practices, you're equipped to build sophisticated strategies that integrate multiple protocols seamlessly. The power of DeFi Actions lies in its composability - you can now chain operations together like LEGO blocks and focus on strategy rather than implementation details.