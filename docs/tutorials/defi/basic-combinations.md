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

DeFi Actions are designed to be **composable** meaning you can chain them together like LEGO blocks to build complex strategies. Each primitive has a standardized interface that works consistently across all protocols, eliminating the need to learn multiple APIs. This composability enables atomic execution of multi-step workflows within single transactions, ensuring either complete success or safe failure. By combining these primitives, developers can create sophisticated DeFi strategies like automated yield farming, cross-protocol arbitrage, and portfolio rebalancing. The [5 DeFi Actions Primitives] are:

- **Source** → Provides tokens on demand by withdrawing from vaults or claiming rewards. Sources respect minimum balance constraints and return empty vaults gracefully when nothing is available.

- **Sink** → Accepts token deposits up to a specified capacity limit. Sinks perform no-ops when capacity is exceeded rather than reverting, enabling smooth workflow execution.

- **Swapper** → Exchanges one token type for another through DEX trades or cross-chain bridges. Swappers support bidirectional operations and provide quote estimation for slippage protection.

- **PriceOracle** → Provides real-time price data for assets from external feeds or DEX prices. Oracles handle staleness validation and return nil for unavailable prices rather than failing.

- **Flasher** → Issues flash loans that must be repaid within the same transaction via callback execution. Flashers enable capital-efficient strategies like arbitrage and liquidations without requiring upfront capital.

## What You'll Learn

- **Basic Flow Patterns** - Linear, bidirectional, and aggregated token flows
- **Reward Harvesting** - Claim staking rewards and convert them to stable tokens  
- **Liquidity Provision** - Convert single tokens to LP tokens for yield farming
- **Cross-VM Operations** - Bridge tokens between Cadence and Flow EVM environments
- **Flash Loan Arbitrage** - Execute risk-free profit extraction using borrowed capital
- **Multi-Protocol Aggregation** - Find optimal rates across different DEX protocols
- **Autonomous Rebalancing** - Create price-driven portfolio management systems
- **Safety Best Practices** - Build resilient workflows with proper error handling
- **Testing Strategies** - Validate complex workflows before production deployment

## Core Flow Patterns

### Linear Flow (Source → Swapper → Sink)

The most common pattern: get tokens, convert them, then deposit them.

![source swap sink](sink.png)
[TODO - Combine the source, swap and sink images into a single one]

**Example**: Claim rewards → Swap to different token → Stake in new pool

### Bidirectional Flow (Source ↔ Sink)

Two-way operations where you can both deposit and withdraw.

![bidirectional flow](source.png)
[TODO - Looping source and sink]

**Example**: Vault operations with both deposit and withdrawal capabilities

### Aggregated Flow (Multiple Sources → Aggregator → Sink)

Combine multiple sources for optimal results.

```
Source A → Aggregator → Sink
Source B ↗
Source C ↗
```
[TODO - Create aggregator image]

**Example**: Multiple DEX aggregators finding the best swap route

## Common DeFi Workflow Combinations

### Single Token to LP (Zapper)

**Goal**: Convert a single token into liquidity provider (LP) tokens in one transaction

The **Zapper** is a specialized connector that combines swapper and sink functionality. It takes a single token input and outputs LP tokens by automatically handling the token splitting, swapping, and liquidity provision process.

![zapper](zapper.png)

**How it works:**

1. Takes single token A as input
2. Splits it into two portions
3. Swaps one portion to token B
4. Provides liquidity with A + B to get LP tokens
5. Returns LP tokens as output

```cadence
// Zapper: Convert single FLOW token to FLOW/USDC LP tokens
let zapper = IncrementFiPoolLiquidityConnectors.Zapper(
    token0Type: Type<@FlowToken.Vault>(),     // Input token type
    token1Type: Type<@USDC.Vault>(),         // Paired token type
    stableMode: false,                       // Use volatile pricing
    uniqueID: nil
)

// Execute: Input 100 FLOW → Output FLOW/USDC LP tokens
let flowTokens <- flowVault.withdraw(amount: 100.0)
let lpTokens <- zapper.swap(nil, inVault: <-flowTokens)

// Now you have LP tokens ready for staking or further use
```

**Benefits:**

- **Simplicity**: Single transaction converts any token to LP position
- **Efficiency**: Automatically calculates optimal split ratios
- **Composability**: Output LP tokens work with any sink connector

### Reward Harvesting & Conversion

**Goal**: Claim staking rewards and convert them to a stable token

This workflow automatically claims accumulated staking rewards and converts them to a stable asset like USDC. It combines a rewards source, token swapper, and vault sink to create a seamless reward collection and conversion process.

**How it works:**

1. Claims pending rewards from a staking pool using user certificate
2. Swaps the reward tokens (e.g., FLOW) to stable tokens (e.g., USDC)
3. Deposits the stable tokens to a vault with capacity limits
4. Returns any unconverted tokens back to the user

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

**Benefits:**

- **Risk Reduction**: Converts volatile reward tokens to stable assets
- **Automation**: Single transaction handles claim, swap, and storage
- **Capital Efficiency**: No manual intervention needed for reward management

### Liquidity Provision & Yield Farming

**Goal**: Convert single token to LP tokens for yield farming

This workflow takes a single token from your vault, converts it into liquidity provider (LP) tokens, and immediately stakes them for yield farming rewards. It combines vault operations, zapping functionality, and staking in one seamless transaction.

**How it works:**

1. Withdraws single token (e.g., FLOW) from vault with minimum balance protection
2. Uses Zapper to split token and create LP position (FLOW/USDC pair)
3. Stakes the resulting LP tokens in a yield farming pool
4. Begins earning rewards on the staked LP position

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

**Benefits:**

- **Yield Optimization**: Converts idle tokens to yield-generating LP positions
- **Single Transaction**: No need for multiple manual steps or approvals
- **Automatic Staking**: LP tokens immediately start earning rewards

### Cross-VM Bridge & Swap

**Goal**: Bridge tokens from Cadence to EVM, swap them, then bridge back

This workflow demonstrates Flow's unique cross-VM capabilities by bridging tokens from Cadence to Flow EVM, executing a swap using UniswapV2-style routing, and bridging the results back to Cadence. This enables access to EVM-based DEX liquidity while maintaining Cadence token ownership.

**How it works:**

1. Withdraws tokens from Cadence vault with minimum balance protection
2. Bridges tokens from Cadence to Flow EVM environment
3. Executes swap using UniswapV2 router on EVM side
4. Bridges the swapped tokens back to Cadence environment
5. Deposits final tokens to target Cadence vault

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

**Benefits:**

- **Extended Liquidity**: Access to both Cadence and EVM DEX liquidity
- **Cross-VM Arbitrage**: Exploit price differences between VM environments
- **Atomic Execution**: All bridging and swapping happens in single transaction

### Flash Loan Arbitrage

**Goal**: Borrow tokens, execute arbitrage, repay loan with profit

This advanced strategy uses flash loans to execute risk-free arbitrage by borrowing tokens, exploiting price differences across multiple DEXs, and repaying the loan with interest while keeping the profit. The entire operation happens atomically within a single transaction.

**How it works:**

1. Borrows tokens via flash loan without collateral requirements
2. Uses multi-swapper to find optimal arbitrage routes across DEXs
3. Executes trades to exploit price differences
4. Repays flash loan with fees from arbitrage profits
5. Keeps remaining profit after loan repayment

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

**Benefits:**

- **Zero Capital Required**: No upfront investment needed for arbitrage
- **Risk-Free Profit**: Transaction reverts if arbitrage isn't profitable
- **Market Efficiency**: Helps eliminate price discrepancies across DEXs

## Advanced Workflow Combinations

### Multi-Protocol Aggregation

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

### Price-Informed Rebalancing

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


## Safety Best Practices

### Always Check Capacity

Prevents transaction failures and enables graceful handling when sinks reach their maximum capacity limits. This is crucial for automated workflows that might encounter varying capacity conditions.

```cadence
// Check before depositing
if sink.depositCapacity(from: &vault) {
    sink.depositCapacity(from: &vault)
} else {
    // Handle insufficient capacity
}
```

### Validate Balances

Ensures operations behave as expected and helps detect unexpected token loss or gain during complex workflows. Balance validation is essential for financial applications where token accuracy is critical.

```cadence
// Verify operations completed successfully
let beforeBalance = vault.balance
sink.depositCapacity(from: &vault)
let afterBalance = vault.balance

assert(afterBalance >= beforeBalance, message: "Balance should not decrease")
```

### Use Graceful Degradation

Prevents entire workflows from failing when individual components encounter issues. This approach enables robust strategies that can adapt to changing market conditions or temporary protocol unavailability.

```cadence
// Handle failures gracefully
if let result = try? operation.execute() {
    // Success path
} else {
    // Fallback or no-op
    log("Operation failed, continuing with strategy")
}
```

### Resource Management

Proper resource cleanup prevents token loss and ensures all vaults are properly handled, even when transactions partially fail. This is critical in Cadence where resources must be explicitly managed.

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

## Testing Your Combinations

### Unit Testing

Tests individual connectors in isolation to verify they respect their constraints and behave correctly under various conditions. This catches bugs early and ensures each component works as designed.

```cadence
// Test individual components
test("VaultSource should maintain minimum balance") {
    let source = VaultSource(min: 100.0, withdrawVault: vaultCap, uniqueID: nil)
    
    // Test minimum balance enforcement
    let available = source.minimumAvailable()
    assert(available >= 100.0, message: "Should maintain minimum balance")
}
```

### Integration Testing

Validates that multiple connectors work together correctly in complete workflows. This ensures the composition logic is sound and identifies issues that only appear when components interact.

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

### Simulation Testing

Tests strategies under various market conditions using mock data to verify they respond appropriately to price changes, liquidity variations, and other market dynamics. This is essential for strategies that rely on external market data.

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

Composability is the core strength of DeFi Actions. These examples demonstrate how DeFi Actions primitives can be combined to create powerful, automated workflows that integrate multiple protocols seamlessly. The framework's standardized interfaces enable developers to chain operations together like LEGO blocks, focusing on strategy implementation rather than protocol-specific integration details.

<!-- Relative links, will not render on page -->
[5 DeFi Actions Primitives]: intro-to-defi-actions.md