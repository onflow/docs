---
title: Mathematical Foundations
sidebar_position: 4
---

# Mathematical Foundations of FCM

This document explains the mathematical models and formulas that power Flow Credit Market. Understanding these fundamentals helps you reason about system behavior and make informed decisions.

## Core Variables

### Token-Level Variables

| Variable | Symbol | Description |
|----------|--------|-------------|
| **Price** | $P_t$ | Price of token $t$ in MOET terms |
| **Collateral Factor** | $CF_t$ | Usable percentage of token $t$ value (0 < $CF_t$ ≤ 1) |
| **Borrow Factor** | $BF_t$ | Multiplier for borrowed token $t$ (typically 1.0) |
| **Amount** | $A_t$ | Quantity of token $t$ |

### Position-Level Variables

| Variable | Symbol | Description |
|----------|--------|-------------|
| **Effective Collateral** | $EC$ | Total usable collateral value in MOET |
| **Effective Debt** | $ED$ | Total debt value in MOET |
| **Health Factor** | $HF$ | Ratio of collateral to debt |
| **Target Health** | $HF_target$ | Desired health ratio (typically 1.3) |
| **Min Health** | $HF_min$ | Minimum before rebalancing (typically 1.1) |
| **Max Health** | $HF_max$ | Maximum before rebalancing (typically 1.5) |

### Interest Variables

| Variable | Symbol | Description |
|----------|--------|-------------|
| **Interest Index** | $I_t(n)$ | Interest index for token $t$ at time $n$ |
| **Scaled Balance** | $B_scaled$ | Balance divided by interest index |
| **True Balance** | $B_true$ | Actual balance including accrued interest |
| **Interest Rate** | $r$ | Annual interest rate |

## Fundamental Formulas

### 1. Effective Collateral

The effective collateral is the sum of all collateral assets multiplied by their prices and collateral factors:

```math
EC = ∑(A_t × P_t × CF_t) for all t in Collateral
```

**Example**:
```
Collateral assets:
- 1000 FLOW @ $1 each, CF = 0.8
- 500 USDC @ $1 each, CF = 0.9

EC = (1000 × 1 × 0.8) + (500 × 1 × 0.9)
   = 800 + 450
   = $1250 MOET
```

### 2. Effective Debt

The effective debt is the sum of all borrowed assets multiplied by their prices and borrow factors:

```math
ED = \sum_t \in Debt A_t × P_t × BF_t
```

**Example**:
```
Debt:
- 800 MOET @ $1 each, BF = 1.0

ED = 800 × 1 × 1.0
   = $800 MOET
```

### 3. Health Factor

The health factor is the ratio of effective collateral to effective debt:

```math
HF = (EC / ED)
```

**Critical thresholds**:
- $HF < 1.0$: Position is liquidatable
- $HF = 1.0$: Exactly at liquidation threshold
- $HF > 1.0$: Position is solvent

**Example**:
```
EC = $1250, ED = $800

HF = 1250 / 800 = 1.5625
```

### 4. Maximum Borrowing Capacity

The maximum amount that can be borrowed to reach target health:

```math
MaxBorrow = (EC / HF_target)
```

**Derivation**:
```
We want: HF = EC / ED = HF_target
Therefore: ED = EC / HF_target
```

**Example**:
```
EC = $1250
HF_target = 1.3

Max Borrow = 1250 / 1.3 = $961.54 MOET
```

## Auto-Borrowing Mathematics

### Initial Auto-Borrow Amount

When a user deposits collateral with `pushToDrawDownSink=true`, the system calculates the initial borrow amount:

```math
BorrowAmount = (EC / HF_target)
```

**Step-by-step calculation**:

1. **Calculate effective collateral**:
```
   EC = A_collateral × P_collateral × CF_collateral
```

2. **Calculate target debt**:
```
   ED_target = (EC / HF_target)
```

3. **Borrow to reach target**:
```
   Borrow = ED_target = (EC / HF_target)
```

**Complete example**:
```
User deposits: 1000 FLOW
FLOW price: $1.00
Collateral factor: 0.8
Target health: 1.3

Step 1: EC = 1000 × 1.00 × 0.8 = $800

Step 2: ED_target = 800 / 1.3 = $615.38

Step 3: Borrow = $615.38 MOET

Result:
- Collateral: 1000 FLOW ($800 effective)
- Debt: 615.38 MOET
- Health: 800 / 615.38 = 1.30 ✓
```

## Rebalancing Mathematics

### Overcollateralized Rebalancing (HF > HF_max)

When health exceeds maximum, calculate additional borrowing capacity:

```
AdditionalBorrow = (EC / HF_target) - ED_current
```

**Proof**:
```
Want: HF_new = HF_target
HF_new = EC / ED_new = HF_target
ED_new = EC / HF_target

Additional borrow = ED_new - ED_current
                  = (EC / HF_target) - ED_current
```

**Example**:
```
Current state:
- EC = $800
- ED = $400
- HF = 800 / 400 = 2.0 (> HF_max of 1.5)

Calculate additional borrow:
ED_target = 800 / 1.3 = $615.38
Additional = 615.38 - 400 = $215.38 MOET

After borrowing $215.38:
- EC = $800 (unchanged)
- ED = $615.38
- HF = 800 / 615.38 = 1.30 ✓
```

### Undercollateralized Rebalancing (HF < HF_min)

When health falls below minimum, calculate required repayment:

```
RequiredRepayment = ED_current - (EC / HF_target)
```

**Proof**:
```
Want: HF_new = HF_target
HF_new = EC / ED_new = HF_target
ED_new = EC / HF_target

Required repayment = ED_current - ED_new
                   = ED_current - (EC / HF_target)
```

**Example**:
```
Price drops! Collateral value decreases.

New state:
- EC = $640 (was $800, FLOW dropped 20%)
- ED = $615.38 (unchanged)
- HF = 640 / 615.38 = 1.04 (< HF_min of 1.1)

Calculate required repayment:
ED_target = 640 / 1.3 = $492.31
Repayment = 615.38 - 492.31 = $123.07 MOET

After repaying $123.07:
- EC = $640 (unchanged)
- ED = $492.31
- HF = 640 / 492.31 = 1.30 ✓
```

## Interest Mathematics

### Scaled Balance System

FCM uses **scaled balances** to efficiently track interest:

```
B_scaled = \frac{B_true}{I_t}
```

Where:
- $B_scaled$: Stored scaled balance
- $B_true$: Actual balance including interest
- $I_t$: Current interest index

**Key insight**: Scaled balance stays constant while interest index grows.

### Interest Index Growth

The interest index grows continuously based on the interest rate:

```
I_t(n+1) = I_t(n) × (1 + r × \Delta t)
```

Where:
- $r$: Annual interest rate (e.g., 0.10 for 10%)
- $\Delta t$: Time elapsed (in years)

**For compound interest**:
```
I_t(n) = I_0 × e^{r × t}
```

Where $e$ is Euler's number (≈2.718).

### True Balance Calculation

To get the current true balance from scaled balance:

```
B_true(t) = B_scaled × I_t
```

**Example**:
```
Initial deposit: 1000 MOET
Initial index: I_0 = 1.0
Scaled balance: B_scaled = 1000 / 1.0 = 1000

After 1 year at 10% APY:
Interest index: I_1 = 1.0 × e^(0.10 × 1) ≈ 1.105
True balance: B_true = 1000 × 1.105 = 1105 MOET

User's debt grew from 1000 to 1105 MOET (10.5% with compound interest)
```

### Why Scaled Balances?

**Without scaled balances**:
```
Every block (every ~2 seconds):
- Update interest index
- Iterate through ALL positions
- Update each position's balance
- Gas cost: O(n) where n = number of positions
```

**With scaled balances**:
```
Every block:
- Update interest index only
- Gas cost: O(1)

When position is touched:
- Calculate true balance: scaled × index
- Gas cost: O(1) per position
```

**Result**: Massive gas savings for the protocol!

## Liquidation Mathematics

### Liquidation Trigger

A position becomes liquidatable when:

```
HF < 1.0
```

Equivalently:
```
EC < ED
```

### Liquidation Target

Liquidations aim to restore health to a target (typically 1.05):

```
HF_liquidation = 1.05
```

### Collateral Seized Calculation

Amount of collateral to seize:

```
CollateralSeized = \frac{ED_repaid × (1 + bonus)}{P_collateral × CF_collateral}
```

Where:
- $ED_repaid$: Amount of debt repaid by liquidator
- $bonus$: Liquidation bonus (e.g., 0.05 for 5%)
- $P_collateral$: Price of collateral token
- $CF_collateral$: Collateral factor

**Example**:
```
Liquidatable position:
- Collateral: 1000 FLOW @ $0.60
- Debt: 650 MOET @ $1.00
- HF = (1000 × 0.60 × 0.8) / 650 = 0.738 < 1.0

Liquidation:
- Liquidator repays: 150 MOET
- Liquidation bonus: 5%
- Collateral seized: (150 × 1.05) / (0.60 × 0.8) = 328.125 FLOW

After liquidation:
- Collateral: 671.875 FLOW @ $0.60 = $403.125 effective
- Debt: 500 MOET
- HF = 403.125 / 500 = 0.806...

(May need multiple liquidations or larger liquidation to reach target 1.05)
```

### Required Debt Repayment for Target Health

To restore position to target health factor:

```
ED_repay = ED_current - (EC / HF_liquidation)
```

**Example**:
```
From above, to reach HF = 1.05:
EC = 1000 × 0.60 × 0.8 = $480
ED_current = $650

ED_target = 480 / 1.05 = $457.14
ED_repay = 650 - 457.14 = $192.86 MOET must be repaid
```

## Price Impact Analysis

### Health Factor Sensitivity to Price Changes

Given a percentage change in collateral price:

```
HF_new = HF_old × \frac{P_new}{P_old}
```

**Derivation**:
```
HF_old = EC_old / ED = (A × P_old × CF) / ED

HF_new = EC_new / ED = (A × P_new × CF) / ED

HF_new / HF_old = P_new / P_old

Therefore: HF_new = HF_old × (P_new / P_old)
```

**Example**:
```
Initial: HF = 1.5, Price = $1.00

Price drops 20% to $0.80:
HF_new = 1.5 × (0.80 / 1.00) = 1.5 × 0.80 = 1.20

Price drops 30% to $0.70:
HF_new = 1.5 × (0.70 / 1.00) = 1.5 × 0.70 = 1.05 (approaching danger!)

Price drops 35% to $0.65:
HF_new = 1.5 × (0.65 / 1.00) = 1.5 × 0.65 = 0.975 < 1.0 (liquidatable!)
```

### Maximum Safe Price Drop

What's the maximum price drop before liquidation?

```
MaxDropPercent = 1 - (1.0 / HF_current)
```

**Derivation**:
```
Want: HF_new = 1.0 (liquidation threshold)
HF_new = HF_old × (P_new / P_old) = 1.0

P_new / P_old = 1.0 / HF_old

P_new = P_old / HF_old

Drop = P_old - P_new = P_old × (1 - 1/HF_old)

Drop % = 1 - 1/HF_old
```

**Examples**:
```
HF = 1.3: Max drop = 1 - 1/1.3 = 23.08%
HF = 1.5: Max drop = 1 - 1/1.5 = 33.33%
HF = 2.0: Max drop = 1 - 1/2.0 = 50.00%
HF = 1.1: Max drop = 1 - 1/1.1 = 9.09% (very risky!)
```

## Multi-Collateral Mathematics

### Multiple Collateral Types

With multiple collateral types:

```
EC = \sum_i=1^{n} A_i × P_i × CF_i
```

Where $i$ iterates over all collateral token types.

### Effective Collateral with Price Correlation

When collateral types are correlated (e.g., FLOW and stFLOW):

**Simplified (no correlation)**:
```
Risk = \sum_i Risk_i
```

**With correlation** (advanced):
```
Risk = \sqrt{\sum_i\sum_j w_i w_j \sigma_i \sigma_j \rho_ij}
```

Where:
- $w_i$: Weight of asset $i$
- $\sigma_i$: Volatility of asset $i$
- $\rho_ij$: Correlation between assets $i$ and $j$

**Practical impact**:
```
Scenario 1: Uncorrelated collateral
- 50% FLOW (volatile)
- 50% USDC (stable)
- Effective diversification

Scenario 2: Correlated collateral
- 50% FLOW (volatile)
- 50% stFLOW (volatile, correlated with FLOW)
- Limited diversification
- Both can drop together!
```

## Yield Calculations

### Simple APY

Annual Percentage Yield without compounding:

```
APY_simple = (FinalValue - InitialValue / InitialValue) × (365 / Days)
```

### Compound APY

With continuous compounding:

```
APY_compound = e^r - 1
```

Where $r$ is the continuous annual rate.

### Leveraged Yield

When borrowing to increase yield exposure:

```
Yield_leveraged = Yield_strategy - Interest_borrowed
```

**Example**:
```
Deposit: $1000 collateral
Borrow: $615 at 5% APY
Deploy $615 to strategy earning 10% APY

Costs:
- Interest on borrowed: 615 × 0.05 = $30.75/year

Returns:
- Yield from strategy: 615 × 0.10 = $61.50/year

Net leveraged yield: 61.50 - 30.75 = $30.75/year
Effective APY on your $1000: 30.75 / 1000 = 3.075% extra
Total return: Base yield + leveraged yield
```

## Risk Metrics

### Liquidation Risk Score

A simplified risk score:

```
\text{Risk Score} = (1 / HF - 1.0) × Volatility_collateral
```

Higher score = higher risk.

### Value at Risk (VaR)

Maximum expected loss over time period at confidence level:

```
VaR_95% = EC × \sigma × z_0.95
```

Where:
- $\sigma$: Daily volatility of collateral
- $z_0.95$: Z-score for 95% confidence (≈1.645)

**Example**:
```
Collateral: $1000 FLOW
Daily volatility: 5%
Confidence: 95%

VaR = 1000 × 0.05 × 1.645 = $82.25

Interpretation: 95% confident that daily loss won't exceed $82.25
```

## Validation & Safety Checks

### Health Factor Bounds

All operations must satisfy:

```
1.0 ≤ HF_min < HF_target < HF_max
```

Typical values: $HF_min = 1.1$, $HF_target = 1.3$, $HF_max = 1.5$

### Collateral Factor Bounds

For safety:

```
0 < CF_t ≤ 1.0
```

Typically:
- Volatile assets (FLOW): $CF = 0.75 - 0.85$
- Stable assets (USDC): $CF = 0.90 - 0.95$
- Liquid staking (stFLOW): $CF = 0.80 - 0.85$

### Maximum Leverage

Maximum theoretical leverage:

```
MaxLeverage = (1 / 1 - CF)
```

**Examples**:
```
CF = 0.8: Max leverage = 1 / (1 - 0.8) = 5x
CF = 0.75: Max leverage = 1 / (1 - 0.75) = 4x
CF = 0.9: Max leverage = 1 / (1 - 0.9) = 10x (risky!)
```

But actual safe leverage is constrained by target health:

```
SafeLeverage = (CF / HF_target)
```

**Examples**:
```
CF = 0.8, HF = 1.3: Safe leverage = 0.8 / 1.3 ≈ 0.615 = ~1.62x
CF = 0.75, HF = 1.5: Safe leverage = 0.75 / 1.5 = 0.50 = 1.5x
```

## Practical Examples

### Complete Position Lifecycle Math

```
=== Initial Deposit ===
Deposit: 1000 FLOW @ $1.00
CF = 0.8, HF_target = 1.3

EC = 1000 × 1.00 × 0.8 = $800
Borrow = 800 / 1.3 = $615.38 MOET
HF = 800 / 615.38 = 1.30 ✓

=== Price Drop 20% ===
New price: $0.80
EC = 1000 × 0.80 × 0.8 = $640
ED = $615.38 (unchanged)
HF = 640 / 615.38 = 1.04 < 1.1 ⚠️

Rebalance needed:
ED_target = 640 / 1.3 = $492.31
Repay = 615.38 - 492.31 = $123.07

After repayment:
EC = $640, ED = $492.31
HF = 640 / 492.31 = 1.30 ✓

=== Price Recovery to $1.00 ===
EC = 1000 × 1.00 × 0.8 = $800
ED = $492.31
HF = 800 / 492.31 = 1.625 > 1.5 ⚠️

Rebalance needed:
ED_target = 800 / 1.3 = $615.38
Borrow = 615.38 - 492.31 = $123.07

After borrowing:
EC = $800, ED = $615.38
HF = 800 / 615.38 = 1.30 ✓

Position back to optimal state!
```

## Summary of Key Formulas

| Formula | Expression | Use |
|---------|------------|-----|
| **Effective Collateral** | $EC = \sum A_t × P_t × CF_t$ | Calculate total collateral value |
| **Health Factor** | $HF = EC / ED$ | Monitor position safety |
| **Max Borrow** | $Max = EC / HF_target$ | Auto-borrowing amount |
| **Rebalance Up** | $Repay = ED - (EC / HF_target)$ | Required debt reduction |
| **Rebalance Down** | $Borrow = (EC / HF_target) - ED$ | Additional borrowing capacity |
| **Scaled Balance** | $B_scaled = B_true / I_t$ | Interest-efficient tracking |
| **True Balance** | $B_true = B_scaled × I_t$ | Current balance with interest |
| **Max Price Drop** | $DropPercent = 1 - (1 / HF)$ | Liquidation safety margin |

## Next Steps

- **Apply these formulas**: [ALP Documentation](../alp/index.md)
- **Understand architecture**: [FCM Architecture](./architecture.md)
- **Learn the basics**: [Understanding FCM Basics](./basics.md)

---

:::tip
These mathematical foundations ensure FCM operates predictably and safely. All formulas are implemented on-chain and can be verified by examining the smart contracts.
:::
