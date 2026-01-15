---
title: MOET Tokenomics
sidebar_label: Tokenomics
sidebar_position: 2
---

# MOET Tokenomics

This document provides a comprehensive analysis of MOET's supply dynamics, minting and burning mechanisms, interest rate models, and economic incentives.

## Supply Management

MOET employs a **dynamic supply model** where total supply directly tracks outstanding debt across all ALP positions.

### Supply Formula

```
Total MOET Supply = Total Outstanding Debt Across All Positions

Supply Changes:
├── Increases When:
│   ├── Users borrow MOET from ALP positions
│   ├── ALP auto-borrows during rebalancing (HF > 1.5)
│   └── Interest accrues on existing debt
└── Decreases When:
    ├── Users repay MOET debt
    ├── Positions are liquidated (debt repaid by liquidators)
    ├── ALP auto-repays during rebalancing (HF < 1.1)
    └── Vaults containing MOET are destroyed
```

### Supply Dynamics Example

**Day 1: Protocol Launch**

```
Initial State:
├── Total MOET Supply: 0
├── Total Collateral Locked: $0
├── Active Positions: 0
└── Utilization: N/A
```

**Day 7: Early Adoption**

```
User Activity:
├── 10 users deposit collateral
├── Total collateral value: $100,000
├── Average CF: 0.8, Average Target HF: 1.3
├── Total borrowed: $61,538 MOET

Supply Metrics:
├── Total MOET Supply: 61,538 tokens
├── Backing: $100,000 collateral
├── Average Collateralization: 162.5%
└── System Health: All positions HF > 1.3
```

**Day 30: Growth Phase**

```
Market Activity:
├── 100 users with active positions
├── Total collateral value: $5,000,000
├── Total borrowed: $3,076,923 MOET
├── Accrued interest (30 days @ 10% APY): ~$25,000

Supply Metrics:
├── Total MOET Supply: 3,101,923 tokens
│   ├── Principal: 3,076,923 MOET
│   └── Interest: ~25,000 MOET
├── Utilization: 62% (assuming $2M deposited, $3.1M borrowed capacity)
└── Interest Rate: ~8% APY (moderate utilization)
```

**Day 90: Market Volatility**

```
Price Crash Scenario:
├── Collateral values drop 30%
├── Remaining collateral value: $3,500,000
├── Outstanding debt: 3,101,923 MOET
├── Many positions approach liquidation

Automated Response:
├── FYV provides: 500,000 MOET for debt repayment
├── ALP burns: 500,000 MOET
├── New supply: 2,601,923 MOET
├── System health restored

Supply Metrics After Rebalancing:
├── Total MOET Supply: 2,601,923 tokens (-16%)
├── Collateral value: $3,500,000
├── Average HF restored to: 1.3
└── Crisis averted through automated deleveraging
```

**Key Insight**: Supply contracts during market stress as positions automatically deleverage, reducing systemic risk.

## Minting Mechanics

MOET tokens are created through a controlled minting process integrated with ALP borrowing operations.

### Minter Resource

**Contract Implementation:**

```cadence
// Minter resource (simplified)
access(all) resource Minter {
    access(all) fun mintTokens(amount: UFix64): @MOET.Vault {
        // Create new MOET tokens
        MOET.totalSupply = MOET.totalSupply + amount

        // Emit event for transparency
        emit TokensMinted(amount: amount)

        // Return vault with minted tokens
        return <-create Vault(balance: amount)
    }
}
```

**Access Control:**

- **Who Can Mint**: Only the account holding the Minter resource
- **Storage**: Stored at admin storage path on protocol deployer account
- **Current Status**: Centralized (single Minter created at contract initialization)
- **Production Plans**: Should transition to multi-sig or decentralized minting

### Minting Trigger Flow

**User-Initiated Borrowing:**

```
Step 1: User Deposits Collateral
├── User calls: ALP.deposit(1000 FLOW)
├── Position created with: collateralID
└── Collateral locked in Pool reserves

Step 2: Borrow Capacity Calculation
├── Collateral value: 1000 × $1.00 = $1,000
├── Collateral factor: 0.8
├── Effective collateral: $800
├── Target health: 1.3
├── Max borrow: $800 / 1.3 = $615.38
└── Borrowable amount determined

Step 3: Minting Request
├── ALP calls: Minter.mintTokens(615.38)
├── Minter creates: 615.38 new MOET tokens
├── Vault returned to: ALP Pool
└── Event emitted: TokensMinted(amount: 615.38, ...)

Step 4: Debt Recording
├── Position debt set to: 615.38 MOET (scaled balance)
├── Interest index captured: I₀
├── Position state updated: {collateral: 1000 FLOW, debt: 615.38 MOET}
└── Health factor: 1.30

Step 5: Token Distribution
├── If pushToDrawDownSink=true:
│   └── MOET flows to: FYV strategy
├── If pushToDrawDownSink=false:
│   └── MOET sent to: User's wallet
└── User can now utilize MOET for yield farming
```

**Automated Rebalancing (HF > 1.5):**

```
Scenario: Collateral Price Increases
├── Original: 1000 FLOW @ $1.00, debt 615.38 MOET
├── New price: FLOW @ $1.50 (+50%)
├── New collateral value: $1,500
├── Effective collateral: $1,500 × 0.8 = $1,200
├── Current HF: $1,200 / $615.38 = 1.95 > 1.5 ⚠️
└── Opportunity for more leverage

Automated Minting:
├── Target HF: 1.3
├── New max debt: $1,200 / 1.3 = $923.08
├── Additional borrow: $923.08 - $615.38 = $307.70
├── ALP mints: 307.70 MOET
├── Debt updated: 615.38 → 923.08 MOET
├── HF restored: $1,200 / $923.08 = 1.30 ✓
└── Extra MOET flows to FYV for yield generation
```

### Minting Limits and Controls

**Current Implementation (Mock):**

- **No Hard Cap**: Unlimited MOET can be minted
- **Collateral Constraint**: Minting limited by available collateral and CF/HF ratios
- **Implicit Cap**: Total supply ≤ (Total Collateral Value × Average CF) / Average Target HF

**Production Requirements:**

```
Recommended Limits:
├── Per-Transaction Limit: e.g., max 100,000 MOET per mint
├── Daily Minting Cap: e.g., max 1,000,000 MOET per 24 hours
├── Total Supply Cap: e.g., 100,000,000 MOET absolute maximum
├── Emergency Pause: Ability to halt minting during crises
└── Multi-Sig Approval: Require 3-of-5 signatures for minting

Risk Mitigation:
├── Prevents single-transaction exploits
├── Limits daily supply inflation
├── Creates upper bound for systemic risk
├── Enables crisis response
└── Reduces centralization risk
```

## Burning Mechanics

MOET tokens are permanently destroyed when debt is repaid, automatically reducing total supply.

### Burn Callback

**Contract Implementation:**

```cadence
// Automatic burn on vault destruction
access(contract) fun burnCallback() {
    if self.balance > 0 {
        // Reduce total supply
        MOET.totalSupply = MOET.totalSupply - self.balance

        // Emit event
        emit TokensBurned(amount: self.balance)

        // Zero out balance before destruction
        self.balance = 0
    }
}

// Called when vault is destroyed
destroy() {
    // Automatic burn before destruction
    self.burnCallback()
    // Vault destroyed
}
```

**Key Features:**

- **Automatic**: Burns happen automatically when vaults are destroyed
- **Supply Accounting**: Ensures total supply always accurate
- **Transparent**: Events emitted for every burn operation
- **Irreversible**: Destroyed MOET cannot be recovered

### Burning Trigger Flow

**Debt Repayment:**

```
Step 1: User Initiates Repayment
├── User's position: 615.38 MOET debt
├── User has: 615.38 MOET in wallet
└── User calls: ALP.repay(615.38 MOET)

Step 2: Token Transfer
├── MOET transferred from: User's wallet
├── MOET transferred to: ALP Pool
└── Vault received by protocol

Step 3: Debt Settlement
├── Position debt reduced: 615.38 → 0 MOET
├── Scaled balance updated: 0
├── Interest index: Captured for final calculation
└── Position debt cleared

Step 4: Automatic Burn
├── ALP destroys received vault: destroy moetVault
├── burnCallback() executed automatically
├── Total supply reduced: 615.38 MOET
├── Event emitted: TokensBurned(amount: 615.38)
└── MOET permanently removed from circulation

Step 5: Collateral Release
├── With debt = 0, HF = infinite
├── User can withdraw: All collateral
└── Position can be closed
```

**Liquidation Burning:**

```
Scenario: Underwater Position
├── Collateral: 1000 FLOW @ $0.60 = $600
├── Effective collateral: $600 × 0.8 = $480
├── Debt: 615.38 MOET
├── HF: $480 / $615.38 = 0.78 < 1.0 ⚠️
└── Position liquidatable

Liquidator Action:
├── Liquidator has: 200 MOET
├── Calls: ALP.liquidate(positionID, 200 MOET)
└── Goal: Profit from liquidation bonus

Burning Process:
├── Step 1: Receive 200 MOET from liquidator
├── Step 2: Calculate collateral seizure
│   └── Seized: (200 × 1.05) / $0.60 = 350 FLOW
├── Step 3: Transfer 350 FLOW to liquidator
├── Step 4: Reduce position debt: 615.38 → 415.38 MOET
├── Step 5: Destroy 200 MOET vault (automatic burn)
├── Step 6: Total supply: Reduced by 200 MOET
└── Step 7: Position remains open with 650 FLOW, 415.38 MOET debt

Result:
├── 200 MOET permanently burned
├── System becomes more solvent (debt ↓, collateral remains)
├── Liquidator profits incentivize future liquidations
└── Peg pressure alleviated (supply reduction)
```

**Automated Rebalancing Burn (HF < 1.1):**

```
Scenario: Collateral Price Drop
├── Original: 1000 FLOW @ $1.00, debt 615.38 MOET
├── New price: FLOW @ $0.85 (-15%)
├── New collateral value: $850
├── Effective collateral: $850 × 0.8 = $680
├── Current HF: $680 / $615.38 = 1.11 > 1.0 but < 1.1 ⚠️
└── Below minimum threshold

Automated Burning:
├── Target HF: 1.3
├── New target debt: $680 / 1.3 = $523.08
├── Must repay: $615.38 - $523.08 = $92.30 MOET
├── ALP pulls from TopUpSource (FYV)
├── FYV provides: 92.30 MOET (from yield)
├── ALP burns: 92.30 MOET (debt repayment)
├── Debt updated: 615.38 → 523.08 MOET
├── HF restored: $680 / $523.08 = 1.30 ✓
└── Supply reduced: 615.38 → 523.08 MOET
```

### Burn Rate Analysis

**Factors Influencing Burn Rate:**

```
High Burn Rate (Supply Contracts):
├── Market downturns → Forced deleveraging
├── Rising interest rates → Incentivized repayment
├── Liquidations → Debt cleared by liquidators
├── Yield maturity → FYV returns exceed new borrowing
└── Collateral appreciation → Users reduce leverage

Low Burn Rate (Supply Expands):
├── Bull markets → More borrowing demand
├── Low interest rates → Cheap capital attracts users
├── High yield opportunities → More FYV deployment
├── New collateral types → Expanded borrowing capacity
└── Protocol growth → More users entering system
```

**Example Burn Scenarios:**

```
Bear Market (30 Days):
├── Total supply start: 3,100,000 MOET
├── Liquidations: -200,000 MOET burned
├── Auto-rebalancing: -500,000 MOET burned
├── Voluntary repayment: -300,000 MOET burned
├── New borrowing: +150,000 MOET minted
├── Net change: -850,000 MOET
└── Total supply end: 2,250,000 MOET (-27.4%)

Bull Market (30 Days):
├── Total supply start: 2,250,000 MOET
├── New borrowing: +800,000 MOET minted
├── Auto-leverage: +300,000 MOET minted
├── Repayments: -150,000 MOET burned
├── Liquidations: -50,000 MOET burned
├── Net change: +900,000 MOET
└── Total supply end: 3,150,000 MOET (+40%)
```

**Key Insight**: Supply naturally contracts during stress (reducing risk) and expands during growth (increasing capital efficiency).

## Interest Rate Model

MOET borrowing costs are determined by a **utilization-based interest rate curve** that automatically balances supply and demand.

### Utilization Rate

```
Utilization Rate (U) = Total MOET Borrowed / Total MOET Available

Components:
├── Total MOET Borrowed: Sum of all debt across positions
├── Total MOET Available: MOET deposited + mintable capacity
└── Range: 0% (no borrowing) to 100% (fully utilized)
```

### Interest Rate Curve

**Kink Model** (similar to Compound/Aave):

```
Rate Calculation:
├── If U ≤ Optimal Utilization (e.g., 80%):
│   └── Rate = BaseRate + (U / OptimalU) × Multiplier
└── If U > Optimal Utilization:
    └── Rate = BaseRate + Multiplier + ((U - OptimalU) / (1 - OptimalU)) × JumpMultiplier

Example Parameters:
├── BaseRate: 2% APY
├── Multiplier: 8% APY
├── OptimalUtilization: 80%
├── JumpMultiplier: 40% APY
└── MaxRate: 50% APY (at 100% utilization)
```

**Visual Representation:**

```
Interest Rate vs. Utilization

 50% │                                  ╱
     │                                ╱
 40% │                              ╱
     │                            ╱
 30% │                          ╱
     │                        ╱
 20% │                    ╱╱╱← Kink at 80% utilization
     │                ╱╱╱
 10% │            ╱╱╱
     │        ╱╱╱
  2% │╱╱╱╱╱╱╱
     └─────────────────────────────────────
     0%   20%   40%   60%   80%   100%
              Utilization Rate
```

### Interest Rate Examples

**Low Utilization (20%):**

```
Market Conditions:
├── Total MOET capacity: 10,000,000
├── Total MOET borrowed: 2,000,000
├── Utilization: 20%
└── Plenty of available capital

Interest Rate Calculation:
├── U = 20% < 80% (below kink)
├── Rate = 2% + (20%/80%) × 8%
├── Rate = 2% + 0.25 × 8%
├── Rate = 2% + 2%
└── Borrowing Cost: 4% APY

Market Effect:
├── Cheap borrowing encourages more positions
├── Lenders earn low yield (limited demand)
└── System incentivizes borrowing to increase utilization
```

**Optimal Utilization (80%):**

```
Market Conditions:
├── Total MOET capacity: 10,000,000
├── Total MOET borrowed: 8,000,000
├── Utilization: 80%
└── Balanced market

Interest Rate Calculation:
├── U = 80% (at kink)
├── Rate = 2% + (80%/80%) × 8%
├── Rate = 2% + 1.0 × 8%
├── Rate = 2% + 8%
└── Borrowing Cost: 10% APY

Market Effect:
├── Moderate borrowing cost
├── Lenders earn attractive yield
└── System in equilibrium
```

**High Utilization (95%):**

```
Market Conditions:
├── Total MOET capacity: 10,000,000
├── Total MOET borrowed: 9,500,000
├── Utilization: 95%
└── Capital constrained

Interest Rate Calculation:
├── U = 95% > 80% (above kink)
├── Rate = 2% + 8% + ((95% - 80%) / (100% - 80%)) × 40%
├── Rate = 10% + (15% / 20%) × 40%
├── Rate = 10% + 0.75 × 40%
├── Rate = 10% + 30%
└── Borrowing Cost: 40% APY

Market Effect:
├── Very expensive borrowing discourages new positions
├── High rates incentivize debt repayment
├── Lenders earn exceptional yield
└── System self-balances toward optimal utilization
```

### Compound Interest Accrual

MOET uses continuous compounding through the scaled balance system:

**Interest Index Growth:**

```
Index Update Formula:
I(t+1) = I(t) × (1 + r × Δt)

Where:
├── I(t): Current interest index
├── r: Interest rate per second
├── Δt: Time elapsed since last update
└── I(t+1): New interest index

Example (10% APY):
├── I₀ = 1.0 (initial)
├── r = 10% / (365.25 × 24 × 3600) = 3.17 × 10⁻⁹ per second
├── After 30 days:
│   ├── Δt = 30 × 24 × 3600 = 2,592,000 seconds
│   ├── I₃₀ = 1.0 × (1 + 3.17×10⁻⁹ × 2,592,000)
│   └── I₃₀ ≈ 1.00821 (0.821% growth in 30 days)
└── After 1 year: I₃₆₅ ≈ 1.10517 (10.517% including compounding)
```

**User Debt Calculation:**

```
True Debt = Scaled Balance × Current Index

Example:
├── User borrows: 1,000 MOET at I₀ = 1.0
├── Scaled balance stored: 1,000
├── After 1 year: I₃₆₅ = 1.10517
├── True debt: 1,000 × 1.10517 = 1,105.17 MOET
└── Interest accrued: 105.17 MOET (10.517%)

Gas Efficiency:
├── Only global index updated per block
├── Individual balances never updated in storage
├── Calculation performed on-demand
└── Scales to millions of positions efficiently
```

## Economic Incentives

MOET's tokenomics create aligned incentives for all participants:

### For Borrowers

**Benefits:**

```
Cheap Leverage:
├── Borrow at: 5-10% APY (typical)
├── Deploy to FYV yielding: 10-20% APY
├── Net profit: 5-10% APY on borrowed capital
└── Amplified returns on collateral

Capital Efficiency:
├── 1000 FLOW collateral → 615 MOET borrowed
├── Total exposure: 1615 MOET equivalent
├── Effective leverage: 1.615x
└── Higher returns than holding collateral alone

Automated Protection:
├── FYV yield auto-repays during downturns
├── No manual position management needed
├── Reduced liquidation risk
└── Peace of mind
```

**Costs:**

```
Interest Payments:
├── Debt grows at: Current APY (5-40%)
├── Must be repaid eventually
└── Erodes profits if yield < interest

Liquidation Risk:
├── If HF < 1.0, position liquidatable
├── Lose collateral (minus debt)
├── 5% penalty to liquidator
└── Must monitor position health
```

### For Liquidators

**Profit Opportunity:**

```
Liquidation Profit:
├── Repay: X MOET of underwater debt
├── Receive: X × (1 + bonus) / collateral_price in collateral
├── Bonus: Typically 5%
└── Risk-free arbitrage when HF < 1.0

Example:
├── Repay: 1,000 MOET
├── Collateral: FLOW @ $0.80
├── Receive: (1,000 × 1.05) / $0.80 = 1,312.5 FLOW
├── Value: 1,312.5 × $0.80 = $1,050
├── Profit: $1,050 - $1,000 = $50 (5%)
└── Incentivizes holding MOET for liquidation opportunities
```

**Requirements:**

```
Capital Needed:
├── Must hold MOET to liquidate
├── Larger positions = more profit
└── Creates natural MOET demand

Monitoring:
├── Run keeper bots to detect liquidations
├── Gas costs for transactions
├── Competition with other liquidators
└── Requires technical infrastructure
```

### For Protocol (DAO/Treasury)

**Revenue Streams** (future implementation):

```
Protocol Fees:
├── Interest spread: 10% of interest paid
├── Liquidation fees: 1% of liquidated value
├── Minting fees: Small fee on MOET creation
└── Withdrawal fees: Small fee on collateral withdrawal

Example Revenue (1 month):
├── Total debt: 10,000,000 MOET @ 10% APY
├── Monthly interest: 10,000,000 × 0.10 / 12 = 83,333 MOET
├── Protocol fee: 83,333 × 0.10 = 8,333 MOET
├── Liquidations: 500,000 MOET × 0.01 = 5,000 MOET
├── Total revenue: 13,333 MOET/month
└── Use for: Development, security audits, reserves
```

## Token Metrics Summary

**Supply Characteristics:**

| Metric | Value |
|--------|-------|
| **Initial Supply** | 0 MOET (mainnet/testnet), 1M MOET (emulator) |
| **Max Supply** | Unlimited (constrained by collateral) |
| **Supply Type** | Dynamic (elastic) |
| **Issuance** | Mint-on-borrow |
| **Destruction** | Burn-on-repay (automatic) |
| **Backing** | Over-collateralized debt positions |

**Economic Parameters:**

| Parameter | Typical Value |
|-----------|---------------|
| **Collateral Factor** | 0.8 (80%) |
| **Target Health Factor** | 1.3 |
| **Collateralization Ratio** | 162.5% |
| **Base Interest Rate** | 2% APY |
| **Optimal Utilization** | 80% |
| **Max Interest Rate** | 50% APY |
| **Liquidation Bonus** | 5% |
| **Minimum Health Factor** | 1.0 (liquidation threshold) |

**Growth Metrics Example:**

```
Month 1:
├── Supply: 1,000,000 MOET
├── Collateral: $1,625,000
├── Positions: 50
└── Utilization: 40%

Month 6:
├── Supply: 10,000,000 MOET (+900%)
├── Collateral: $16,250,000 (+900%)
├── Positions: 500 (+900%)
└── Utilization: 65% (+62.5%)

Month 12:
├── Supply: 50,000,000 MOET (+400%)
├── Collateral: $81,250,000 (+400%)
├── Positions: 2,500 (+400%)
└── Utilization: 75% (+15.4%)
```

## Next Steps

- **[System Integration](./integration.md)**: Learn how MOET connects ALP, FYV, and FCM
- **[Stability Mechanisms](./stability.md)**: Understand risk management and safety measures
- **[FCM Math](../fcm/math.md)**: Explore the mathematical formulas behind MOET mechanics
