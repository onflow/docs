---
title: Vault Lifecycle
sidebar_position: 5
---

# Vault Lifecycle

This guide walks you through the complete lifecycle of a Flow Yield Vault, from initial setup to closing your position and claiming your accumulated value.

## Overview

A YieldVault goes through five main phases:

1. **Setup** - Configure your account for FYV
2. **Creation** - Create a vault with chosen strategy
3. **Deposit** - Add collateral to start yield farming
4. **Management** - Monitor and manage your position
5. **Closure** - Withdraw or liquidate your vault

## Phase 1: Account Setup

Before creating your first vault, you need to set up your account with the required resources.

### Setup Transaction

```cadence
import FlowYieldVaults from 0xFlowYieldVaults
import FungibleToken from 0xFungibleToken

transaction {
    prepare(signer: AuthAccount) {
        // Check if already set up
        if signer.borrow<&FlowYieldVaults.YieldVaultManager>(
            from: FlowYieldVaults.YieldVaultManagerStoragePath
        ) != nil {
            return // Already set up
        }

        // Create YieldVaultManager
        let manager <- FlowYieldVaults.createYieldVaultManager()

        // Store in account
        signer.save(<-manager, to: FlowYieldVaults.YieldVaultManagerStoragePath)

        // Create public capability
        signer.link<&FlowYieldVaults.YieldVaultManager{FlowYieldVaults.YieldVaultManagerPublic}>(
            FlowYieldVaults.YieldVaultManagerPublicPath,
            target: FlowYieldVaults.YieldVaultManagerStoragePath
        )
    }
}
```

**What this does**: Creates a YieldVaultManager resource in your account, stores it at the designated storage path, and creates a public capability for querying your vaults.

**You only need to do this once** - the manager persists in your account and can hold multiple vaults.

## Phase 2: Vault Creation

Create a new vault with your chosen strategy (TracerStrategy or mUSDCStrategy).

### Create Vault Transaction

```cadence
import FlowYieldVaults from 0xFlowYieldVaults
import FlowToken from 0xFlowToken

transaction(strategyName: String) {
    prepare(signer: AuthAccount) {
        // Get your vault manager
        let manager = signer.borrow<&FlowYieldVaults.YieldVaultManager>(
            from: FlowYieldVaults.YieldVaultManagerStoragePath
        ) ?? panic("YieldVaultManager not found")

        // Get strategy factory
        let factory = FlowYieldVaults.getStrategyFactory()

        // Create strategy instance
        let strategy <- factory.createStrategy(
            strategyName: strategyName,
            collateralType: Type<@FlowToken.Vault>()
        )

        // Create vault with strategy
        let vaultID = manager.createVault(strategy: <-strategy)

        log("Created vault #".concat(vaultID.toString()))
    }
}
```

**Parameters:**
- `strategyName`: "TracerStrategy" or "mUSDCStrategy"

**What happens:**
1. Strategy instance created with configured connectors
2. AutoBalancer created and linked to strategy
3. ALP Position created (for leveraged strategies)
4. Vault registered in SchedulerRegistry
5. First rebalance scheduled for T+60 seconds
6. Vault ID returned (use this to interact with vault later)

**Example:**
```bash
flow transactions send create-vault.cdc "TracerStrategy"
# Output: Created vault #42
```

## Phase 3: Initial Deposit

Deposit collateral to activate your vault and start yield farming.

### Deposit Transaction

```cadence
import FlowYieldVaults from 0xFlowYieldVaults
import FlowToken from 0xFlowToken
import FungibleToken from 0xFungibleToken

transaction(vaultID: UInt64, amount: UFix64) {
    prepare(signer: AuthAccount) {
        // Get vault manager
        let manager = signer.borrow<&FlowYieldVaults.YieldVaultManager>(
            from: FlowYieldVaults.YieldVaultManagerStoragePath
        ) ?? panic("Manager not found")

        // Get vault
        let vault = manager.borrowVault(id: vaultID)
            ?? panic("Vault not found")

        // Withdraw FLOW from account
        let flowVault = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow FlowToken.Vault")

        let depositVault <- flowVault.withdraw(amount: amount)

        // Deposit to vault
        vault.deposit(collateralVault: <-depositVault)

        log("Deposited ".concat(amount.toString()).concat(" FLOW to vault #").concat(vaultID.toString()))
    }
}
```

**What happens (TracerStrategy example):**
```
Your deposit: 1000 FLOW @ $1.00

Step 1: Collateral deposit
  - Strategy deposits 1000 FLOW to ALP Position
  - Position calculates: EC = 1000 × $1 × 0.8 = $800

Step 2: Auto-borrowing
  - Target HF = 1.3
  - Max borrow = EC / Target HF = 800 / 1.3 = 615.38 MOET
  - Position borrows 615.38 MOET

Step 3: Swap to yield tokens
  - SwapConnector converts 615.38 MOET → ~610 YieldToken
  - Slippage protection ensures minimum output

Step 4: Deposit to yield vault
  - AutoBalancer deposits 610 YieldToken to ERC4626
  - Historical value tracked: $610
  - First rebalance scheduled

Result:
  - You have leveraged position: $1,000 collateral + $610 yield exposure
  - Effective leverage: 1.61x
  - Health factor: 1.30 (safe)
  - Yield farming begins automatically
```

## Phase 4: Position Management

Once your vault is active, you can monitor its performance and make adjustments.

### Monitoring Your Vault

**Check vault balance:**
```cadence
import FlowYieldVaults from 0xFlowYieldVaults

pub fun main(address: Address, vaultID: UInt64): UFix64 {
    let managerRef = getAccount(address)
        .getCapability<&FlowYieldVaults.YieldVaultManager{FlowYieldVaults.YieldVaultManagerPublic}>(
            FlowYieldVaults.YieldVaultManagerPublicPath
        )
        .borrow() ?? panic("Manager not found")

    return managerRef.getVaultBalance(id: vaultID)
}
```

**Check AutoBalancer ratio:**
```cadence
pub fun main(address: Address, vaultID: UInt64): UFix64 {
    let managerRef = getAccount(address)
        .getCapability<&FlowYieldVaults.YieldVaultManager{FlowYieldVaults.YieldVaultManagerPublic}>(
            FlowYieldVaults.YieldVaultManagerPublicPath
        )
        .borrow() ?? panic("Manager not found")

    let vault = managerRef.borrowVaultPublic(id: vaultID)
    let autoBalancer = vault.getAutoBalancer()

    let current = autoBalancer.getCurrentValue()
    let historical = autoBalancer.getHistoricalValue()

    return current / historical
}
```

**Check position health (TracerStrategy):**
```cadence
pub fun main(address: Address, vaultID: UInt64): UFix64 {
    // Get vault's ALP position health factor
    // Returns: 1.30 (safe), < 1.0 (danger)
}
```

### Additional Deposits

You can add more collateral at any time:

```cadence
// Same as initial deposit transaction
transaction(vaultID: UInt64, amount: UFix64) {
    // ... deposit logic
}
```

**Impact of additional deposits:**
- Increases collateral in ALP Position
- Position borrows more MOET to maintain target HF
- Additional MOET swapped to yield tokens
- AutoBalancer tracks new historical baseline
- Leverage ratio maintained

### Withdrawals

Withdraw a portion of your vault's value:

```cadence
import FlowYieldVaults from 0xFlowYieldVaults
import FungibleToken from 0xFungibleToken

transaction(vaultID: UInt64, amount: UFix64) {
    prepare(signer: AuthAccount) {
        let manager = signer.borrow<&FlowYieldVaults.YieldVaultManager>(
            from: FlowYieldVaults.YieldVaultManagerStoragePath
        ) ?? panic("Manager not found")

        let vault = manager.borrowVault(id: vaultID)
            ?? panic("Vault not found")

        // Withdraw from vault
        let withdrawn <- vault.withdraw(amount: amount)

        // Deposit to your account
        let receiver = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow receiver")

        receiver.deposit(from: <-withdrawn)

        log("Withdrew ".concat(amount.toString()).concat(" FLOW"))
    }
}
```

**What happens:**
1. AutoBalancer withdraws yield tokens from ERC4626
2. SwapConnector converts yield tokens → FLOW
3. For leveraged positions: may need to repay some debt to maintain health
4. FLOW returned to your account
5. Historical tracking updated

### Force Rebalancing

Manually trigger rebalancing (useful if automated schedule is stuck):

```cadence
transaction(vaultID: UInt64) {
    prepare(signer: AuthAccount) {
        let manager = signer.borrow<&FlowYieldVaults.YieldVaultManager>(
            from: FlowYieldVaults.YieldVaultManagerStoragePath
        ) ?? panic("Manager not found")

        let vault = manager.borrowVault(id: vaultID)
            ?? panic("Vault not found")

        vault.forceRebalance()

        log("Manual rebalance triggered for vault #".concat(vaultID.toString()))
    }
}
```

## Phase 5: Vault Closure

When you're ready to exit your position, you can liquidate the vault and claim all accumulated value.

### Liquidate Vault Transaction

```cadence
import FlowYieldVaults from 0xFlowYieldVaults
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken

transaction(vaultID: UInt64) {
    prepare(signer: AuthAccount) {
        let manager = signer.borrow<&FlowYieldVaults.YieldVaultManager>(
            from: FlowYieldVaults.YieldVaultManagerStoragePath
        ) ?? panic("Manager not found")

        // Liquidate vault (destroys it and returns all value)
        let finalValue <- manager.liquidateVault(id: vaultID)

        // Deposit to your account
        let receiver = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow receiver")

        receiver.deposit(from: <-finalValue)

        log("Liquidated vault #".concat(vaultID.toString()))
    }
}
```

**What happens:**
1. AutoBalancer withdraws all yield tokens from ERC4626
2. All yield tokens swapped to collateral (FLOW)
3. For leveraged positions:
   - All debt repaid to ALP
   - Remaining collateral withdrawn
4. Vault removed from SchedulerRegistry
5. All resources destroyed
6. Final value returned to you in FLOW

**Example liquidation:**
```
Initial deposit: 1000 FLOW
After 1 year of farming at 10% APY:

Liquidation process:
  - Withdraw all yield tokens from ERC4626
  - Yield tokens value: ~$671 (10% growth on $610)
  - Swap yield tokens → 671 FLOW
  - Repay debt: 615.38 MOET
  - After debt: ~55.62 FLOW profit from yield
  - Withdraw collateral: 1000 FLOW
  - Total returned: 1000 + 55.62 = 1055.62 FLOW

Your profit: 55.62 FLOW (5.562% return on initial deposit)
```

Note: Actual returns depend on ERC4626 vault performance, swap slippage, and gas costs.

## Complete Lifecycle Example

Let's walk through a full vault lifecycle from start to finish:

**Day 1 - Setup and Creation:**
```bash
# Setup account (one-time)
flow transactions send setup-account.cdc

# Create vault with TracerStrategy
flow transactions send create-vault.cdc "TracerStrategy"
# Output: Vault #42 created

# Initial deposit
flow transactions send deposit.cdc 42 1000.0
# Deposited 1000 FLOW, now farming with 1.61x leverage
```

**Day 1-365 - Automated Farming:**
```
AutoBalancer runs every 60 seconds:
  - Day 30: Ratio = 102%, no action
  - Day 60: Ratio = 106%, rebalanced (withdrew 6% excess)
  - Day 90: Ratio = 104%, no action
  - Day 120: Ratio = 107%, rebalanced (withdrew 7% excess)
  ... continues for full year
```

**Day 365 - Closure:**
```bash
# Check final balance
flow scripts execute get-vault-balance.cdc 0x123... 42
# Output: 1055.62 FLOW

# Liquidate and withdraw
flow transactions send liquidate-vault.cdc 42
# Vault #42 liquidated, 1055.62 FLOW returned
```

**Result:** 5.562% annual return through automated leveraged yield farming.

## Best Practices

**Start Small**: Test with a small amount first to understand vault behavior before committing significant capital.

**Monitor Regularly**: Check your vault's health factor (leveraged positions) and AutoBalancer ratio weekly to ensure healthy performance.

**Understand Thresholds**: Know when rebalancing triggers (95%-105%). Frequent hits indicate systematic performance.

**Plan for Gas**: Each rebalance costs gas. Factor this into yield calculations for smaller vaults.

**Track Performance**: Record deposit amounts and dates to calculate actual returns vs. expectations.

**Diversify**: Use multiple vaults with different strategies to spread risk across yield sources.

**Emergency Withdrawals**: Keep some liquid FLOW in your account for emergency deposits if health factor drops unexpectedly.

## Troubleshooting

**Vault creation fails**: Ensure you have set up your account first with the setup transaction, have sufficient FLOW for gas, and hold a beta capability (during closed beta period).

**Rebalancing not triggering**: Check that vault is registered in SchedulerRegistry, manually trigger with forceRebalance() if needed, and contact support if issue persists.

**Health factor dropping** (TracerStrategy): Add more collateral via deposit transaction, withdraw some yield to reduce leverage, or monitor collateral price movements.

**Cannot withdraw**: Ensure vault has sufficient balance, for leveraged positions: check health factor allows withdrawal, and verify no pending rebalances blocking operations.

## Next Steps

- **Understand leverage**: Read [Leveraged Farming](./leveraged-farming.md)
- **Learn strategies**: Explore [Strategies](./strategies.md)
- **Master rebalancing**: See [AutoBalancer](./autobalancer.md)
- **Cross-chain options**: Check [Cross-Chain Integration](./cross-chain.md)

---

:::tip Key Takeaway
The vault lifecycle is designed for simplicity: set up once, deposit to start, let AutoBalancer optimize continuously, and liquidate when ready. The system handles all complexity of leveraged borrowing, yield farming, and rebalancing automatically.
:::
