---
title: MOET Core Concepts
sidebar_label: Core Concepts
sidebar_position: 1
---

# MOET Core Concepts

This guide explains the fundamental mechanics of MOET and how it functions within the Flow Credit Market ecosystem.

## What Makes MOET Different

MOET is fundamentally different from traditional stablecoins like USDC or DAI. Rather than existing as an independent token backed by separate reserves, MOET is directly integrated into the lending protocol as the **protocol debt token**.

### Comparison with Other Stablecoins

| Feature | MOET | USDC | DAI |
|---------|------|------|-----|
| **Backing** | Over-collateralized debt positions | Fiat reserves held by Circle | Crypto collateral in Maker vaults |
| **Issuance** | Minted when users borrow from ALP | Minted when fiat deposited | Minted when users lock collateral |
| **Supply Control** | Automatic (tied to borrowing demand) | Centralized (Circle controls) | Decentralized (MakerDAO governance) |
| **Use Case** | FCM ecosystem (lending, yield) | General payments, DeFi | General DeFi usage |
| **Peg Mechanism** | Over-collateralization + liquidations | 1:1 fiat redemption | Stability fee + DSR + liquidations |

The key insight is that **MOET doesn't need separate reserves** because every MOET token represents debt backed by collateral already locked in ALP positions.

## The Lifecycle of MOET

Understanding MOET requires following its complete lifecycle from creation to destruction:

### 1. Creation (Minting)

MOET tokens are created when users borrow from their ALP positions.

**Example: Alice Deposits Collateral**

```
Initial State:
├── Alice has: 1000 FLOW tokens
├── FLOW price: $1.00
├── MOET supply: 10,000 tokens (existing)

Alice's Action:
├── Deposits: 1000 FLOW into new ALP position
├── Target Health Factor: 1.3
├── Collateral Factor for FLOW: 0.8

Calculation:
├── Total Collateral Value: 1000 × $1.00 = $1,000
├── Effective Collateral: $1,000 × 0.8 = $800
├── Max Borrow: $800 / 1.3 = $615.38 MOET
└── ALP auto-borrows: 615.38 MOET

Minting Process:
├── Protocol Minter creates: 615.38 new MOET tokens
├── Tokens deposited into: Alice's position
├── MOET supply increases: 10,000 → 10,615.38
└── Alice's debt recorded: 615.38 MOET

Result:
├── Alice's Position:
│   ├── Collateral: 1000 FLOW ($1,000)
│   ├── Debt: 615.38 MOET
│   └── Health Factor: $800 / $615.38 = 1.30 ✓
├── Alice's Wallet: 615.38 MOET (to use for yield farming)
└── Total MOET Supply: 10,615.38 tokens
```

**Key Principle**: Every MOET minted increases a user's debt and must be repaid later.

### 2. Utilization (Capital Deployment)

Once minted, MOET flows through the FCM ecosystem to generate yield.

**Alice's MOET Journey:**

```
Step 1: Borrow from ALP
├── Alice's position borrows: 615.38 MOET
└── MOET created and ready for deployment

Step 2: Flow to FYV (via DrawDownSink)
├── MOET automatically flows to: FYV TracerStrategy
├── No manual transfer needed (DeFi Actions handle it)
└── Alice's 615.38 MOET enters yield generation

Step 3: Convert to Yield Assets
├── FYV swaps: 615.38 MOET → 615.38 LP tokens
├── LP tokens are yield-bearing (e.g., AMM liquidity positions)
└── AutoBalancer holds LP tokens in optimal vault

Step 4: Yield Generation
├── LP tokens earn: Trading fees, liquidity rewards
├── After 30 days: 615.38 LP → 640 LP (+4% yield)
└── Value growth: $615.38 → $640.00 (+$24.62)
```

**Key Principle**: MOET doesn't sit idle - it's immediately deployed to generate returns that exceed the borrowing cost.

### 3. Rebalancing (Risk Management)

MOET enables automated position protection through yield-powered rebalancing.

**Scenario: FLOW Price Drops**

```
Market Event:
├── FLOW price drops: $1.00 → $0.80 (-20%)
├── Alice's collateral value: $1,000 → $800
├── Effective collateral: $800 × 0.8 = $640
└── Health Factor: $640 / $615.38 = 1.04 (DANGER!)

Automated Response:
├── ALP detects: HF < 1.1 (minimum threshold)
├── Target: Restore HF to 1.3
├── Required debt: $640 / 1.3 = $492.31
├── Must repay: $615.38 - $492.31 = $123.07 MOET
└── ALP pulls from TopUpSource (FYV)

FYV Provides Liquidity:
├── FYV checks balance: 640 LP tokens available
├── Converts: 123.07 LP → 123.07 MOET (via SwapConnector)
├── Sends: 123.07 MOET to ALP (via TopUpSource)
└── Remaining: 517 LP tokens still generating yield

Debt Repayment:
├── ALP receives: 123.07 MOET
├── Burns: 123.07 MOET (supply decreases)
├── New debt: 615.38 - 123.07 = 492.31 MOET
└── New HF: $640 / $492.31 = 1.30 ✓ (restored!)

Result:
├── Liquidation prevented automatically
├── Position health restored
├── Alice keeps all collateral
├── Yield continues with remaining 517 LP tokens
└── Total MOET supply: 10,615.38 → 10,492.31
```

**Key Principle**: MOET serves as the common denominator for debt, enabling seamless value transfer between yield sources and debt obligations.

### 4. Destruction (Burning)

MOET tokens are permanently destroyed when debt is repaid.

**Alice Closes Her Position:**

```
Final State:
├── Collateral: 1000 FLOW @ $1.00 = $1,000
├── Debt: 492.31 MOET (after rebalancing)
├── FYV Holdings: 517 LP tokens worth $517
├── Accrued Interest: 30 days @ 5% APY = ~$2.05

Closure Process:
Step 1: Liquidate Yield Position
├── FYV converts: 517 LP → 517 MOET
├── Alice now has: 517 MOET available
└── Debt to repay: 492.31 + 2.05 = 494.36 MOET

Step 2: Repay Debt
├── ALP receives: 494.36 MOET from FYV
├── Burns: 494.36 MOET (automatic on repayment)
├── Debt cleared: 494.36 - 494.36 = 0 MOET
└── Total MOET supply: 10,492.31 → 9,997.95

Step 3: Withdraw Collateral
├── Health Factor: infinite (no debt)
├── Alice withdraws: 1000 FLOW
└── Position closed

Alice's Profit:
├── MOET remaining: 517 - 494.36 = 22.64 MOET
├── Value: $22.64
├── ROI: $22.64 / $1,000 = 2.26% for 30 days
└── Annualized: ~27% APY
```

**Key Principle**: Burning MOET reduces total supply, ensuring supply always equals outstanding debt.

## How MOET Maintains Its Peg

While MOET is a mock token in testing, the production version relies on several mechanisms to maintain its $1 peg:

### Over-Collateralization

Every MOET is backed by collateral worth significantly more than $1.

**Collateralization Calculation:**

```
Position Parameters:
├── Collateral Factor (CF): 0.8 (80% of value usable)
├── Target Health Factor (HF): 1.3
└── Typical Collateralization = CF × HF = 0.8 × 1.3 = 1.04

For $1 of MOET debt:
├── Effective Collateral Required: $1.30 (due to HF = 1.3)
├── Total Collateral Required: $1.30 / 0.8 = $1.625
└── Collateralization Ratio: 162.5%

Buffer Against Price Drops:
├── Collateral can drop: ($1.625 - $1.00) / $1.625 = 38.5%
└── Before reaching liquidation threshold (HF = 1.0)
```

This substantial over-collateralization provides safety margin for price volatility and creates confidence that MOET is redeemable for its backing collateral.

### Liquidation Mechanism

When positions become under-collateralized (HF < 1.0), liquidators can repay debt to seize collateral at a profit.

**Liquidation Example:**

```
Under-collateralized Position:
├── Collateral: 1000 FLOW @ $0.60 = $600
├── Effective Collateral: $600 × 0.8 = $480
├── Debt: 615.38 MOET
├── Health Factor: $480 / $615.38 = 0.78 < 1.0 ⚠️
└── Status: Liquidatable

Liquidator Action:
├── Liquidator has: 200 MOET
├── Repays: 200 MOET of Alice's debt
└── Goal: Profit from liquidation bonus

Collateral Seizure (Simplified Formula):
├── Formula: CollateralSeized = (DebtRepaid × (1 + Bonus)) / PriceCollateral
├── Calculation: (200 × 1.05) / $0.60 = 350 FLOW
├── Liquidator receives: 350 FLOW worth $210
└── Profit: $210 - $200 = $10 (5% return)

Result:
├── Liquidator profit incentivizes MOET buying pressure
├── Ensures MOET remains valuable for liquidation participation
├── Creates natural demand floor for MOET
└── Helps maintain peg during market stress
```

**Key Principle**: Liquidations create buying pressure for MOET, as liquidators need MOET to participate in profitable liquidations.

### Arbitrage Opportunities

If MOET trades away from $1, arbitrage opportunities arise:

**MOET Trading Above $1 (e.g., $1.05):**

```
Arbitrage Strategy:
1. Deposit $1,625 of FLOW collateral
2. Borrow 1,000 MOET (valued at $1,000)
3. Sell 1,000 MOET for: $1,050 (at $1.05 market price)
4. Profit: $1,050 - $1,000 = $50
5. Result: Increased MOET supply pushes price down toward $1
```

**MOET Trading Below $1 (e.g., $0.95):**

```
Arbitrage Strategy:
1. Buy 1,000 MOET for: $950 (at $0.95 market price)
2. Repay $1,000 MOET debt (valued at $1,000)
3. Saved: $1,000 - $950 = $50 on repayment
4. Withdraw collateral (now unlocked)
5. Result: Increased MOET demand pushes price up toward $1
```

**Key Principle**: Market participants profit from deviations, naturally stabilizing MOET around $1.

## MOET as Unit of Account

All prices in FCM are denominated in MOET, creating a consistent pricing framework:

### Price Quotes

```
Collateral Prices (in MOET):
├── FLOW/MOET: 1.0 (1 FLOW = 1 MOET)
├── stFLOW/MOET: 1.05 (liquid staking premium)
├── USDC/MOET: 1.0 (stablecoin parity)
├── wBTC/MOET: 65,000 (Bitcoin price in USD)
└── wETH/MOET: 3,500 (Ethereum price in USD)
```

This MOET-denominated pricing simplifies multi-collateral calculations:

**Health Factor with Multiple Collateral Types:**

```
Alice's Position:
├── Collateral:
│   ├── 500 FLOW @ 1.0 MOET = 500 MOET value × 0.8 CF = 400 effective
│   ├── 100 stFLOW @ 1.05 MOET = 105 MOET value × 0.85 CF = 89.25 effective
│   └── 1,000 USDC @ 1.0 MOET = 1,000 MOET value × 0.9 CF = 900 effective
├── Total Effective Collateral: 400 + 89.25 + 900 = 1,389.25 MOET
├── Debt: 1,068.65 MOET
└── Health Factor: 1,389.25 / 1,068.65 = 1.30 ✓

Calculation Benefits:
├── No currency conversion needed
├── All values in common denomination (MOET)
├── Simplified real-time health monitoring
└── Efficient on-chain computation
```

**Key Principle**: MOET as unit of account eliminates complex cross-currency calculations, enabling efficient multi-collateral lending.

## Interest Accrual on MOET Debt

MOET debt grows over time through interest, using a scaled balance system:

### Scaled Balance System

Instead of updating every position's debt continuously, the protocol uses **interest indices**:

```
Interest Index Growth:
├── Initial Index (I₀): 1.0
├── After 1 year @ 10% APY: I₁ = 1.1
├── After 2 years @ 10% APY: I₂ = 1.21
└── After 3 years @ 10% APY: I₃ = 1.331

User's Debt Calculation:
├── Scaled Balance: 1,000 MOET (stored once)
├── Current Index: 1.1 (after 1 year)
└── True Balance: 1,000 × 1.1 = 1,100 MOET

Benefits:
├── Gas Efficient: Only update global index, not individual balances
├── Automatic Compounding: Interest compounds continuously
└── Accurate: Precise interest calculation at any time
```

### Interest Rate Model

Interest rates adjust based on utilization to balance supply and demand:

```
Utilization Rate = Total MOET Borrowed / Total MOET Available

Interest Rate Curve:
├── 0-80% utilization: 2-8% APY (cheap borrowing)
├── 80-90% utilization: 8-20% APY (balanced)
└── 90-100% utilization: 20-50%+ APY (expensive, discourages borrowing)

Example:
├── Total MOET Deposits: 100,000 MOET
├── Total MOET Borrowed: 85,000 MOET
├── Utilization: 85%
├── Current Interest Rate: ~15% APY
└── Borrowers pay: 15% APY on debt
```

**Key Principle**: Utilization-based rates create self-balancing markets without manual intervention.

## Summary: Key Concepts for Analysts

Understanding MOET requires grasping these core principles:

1. **MOET is Protocol Debt**: Every MOET represents borrowed value, not a separate reserve-backed asset

2. **Mint-and-Burn Model**: Supply dynamically adjusts with borrowing activity (mint on borrow, burn on repay)

3. **Over-Collateralization**: Typical 162.5% backing provides substantial safety margin

4. **Automated Capital Flows**: DeFi Actions enable MOET to move seamlessly between ALP and FYV for yield generation

5. **Unit of Account**: MOET-denominated pricing simplifies multi-collateral calculations

6. **Liquidation Creates Demand**: Profitable liquidations incentivize MOET accumulation

7. **Arbitrage Maintains Peg**: Deviations from $1 create profit opportunities that naturally stabilize price

8. **Utilization-Driven Rates**: Interest rates automatically adjust to balance borrowing demand

These concepts form the foundation for understanding MOET's role in FCM's capital-efficient yield generation system.

## Next Steps

- **[Tokenomics](./tokenomics.md)**: Deep dive into supply dynamics, minting mechanics, and economic models
- **[System Integration](./integration.md)**: Learn how MOET connects ALP, FYV, and FCM components
- **[Stability Mechanisms](./stability.md)**: Understand risk management, oracles, and safety measures
