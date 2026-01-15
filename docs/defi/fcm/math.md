---
title: Mathematical Foundations
sidebar_position: 4
---

# Mathematical Foundations of FCM

This document explains the mathematical models and formulas that power Flow Credit Market. Understanding these fundamentals helps you reason about system behavior and make informed decisions.

:::tip
These mathematical foundations ensure FCM operates predictably and safely. All formulas are implemented on-chain and can be verified by examining the smart contracts.
:::

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
| **Target Health** | $TargetHF$ | Desired health ratio (typically 1.3) |
| **Min Health** | $MinHF$ | Minimum before rebalancing (typically 1.1) |
| **Max Health** | $MaxHF$ | Maximum before rebalancing (typically 1.5) |

### Interest Variables

| Variable | Symbol | Description |
|----------|--------|-------------|
| **Interest Index** | $I_t(n)$ | Interest index for token $t$ at time $n$ |
| **Scaled Balance** | $ScaledBalance$ | Balance divided by interest index |
| **True Balance** | $TrueBalance$ | Actual balance including accrued interest |
| **Interest Rate** | $r$ | Annual interest rate |

## Fundamental Formulas

### Effective Collateral

The effective collateral is the sum of all collateral assets multiplied by their prices and collateral factors:

```math
EC = ∑(A_t × P_t × CF_t), t ∈ Collateral
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

### Effective Debt

The effective debt is the sum of all borrowed assets multiplied by their prices and borrow factors:

```math
ED = \sum_t \in Debt A_t × P_t × BF_t
```

**Borrow Factor (BF)** is a risk adjustment multiplier applied to debt. While typically set to 1.0 for standard assets like MOET, the borrow factor can be increased above 1.0 for riskier or more volatile borrowed assets. This makes the effective debt higher than the nominal debt, requiring more collateral to maintain the same health factor. For example, a BF of 1.2 means borrowing $100 of that asset counts as $120 of effective debt, providing an extra safety margin for the protocol.

**Example**:
```
Debt:
- 800 MOET @ $1 each, BF = 1.0

ED = 800 × 1 × 1.0
   = $800 MOET
```

### Health Factor

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

### Maximum Borrowing Capacity

The maximum amount that can be borrowed to reach target health:

```math
MaxBorrow = EC / TargetHF
```

**Derivation**:

```
We want: HF = EC / ED = TargetHF
Therefore: ED = EC / TargetHF
```

**Example**:

```
EC = $1250
TargetHF = 1.3

Max Borrow = 1250 / 1.3 = $961.54 MOET
```

## Auto-Borrowing Mathematics

### Initial Auto-Borrow Amount

When a user deposits collateral with `pushToDrawDownSink=true`, the system calculates the initial borrow amount:

```math
BorrowAmount = (EC / TargetHF)
```

**Step-by-step calculation**:

1. **Calculate effective collateral**:

```math
   EC = A_collateral × P_collateral × CF_collateral
```

2. **Calculate target debt**:

```math
   ED_target = (EC / TargetHF)
```

3. **Borrow to reach target**:

```math
   Borrow = ED_target = (EC / TargetHF)
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
- Health: 800 / 615.38 = 1.30
```

## Rebalancing Mathematics

### Overcollateralized Rebalancing (HF > MaxHF)

When health exceeds maximum, calculate additional borrowing capacity:

```math
AdditionalBorrow = (EC / TargetHF) - CurrentED
```

**Proof**:

```
Want: HF_new = TargetHF
HF_new = EC / ED_new = TargetHF
ED_new = EC / TargetHF

Additional borrow = ED_new - CurrentED
                  = (EC / TargetHF) - CurrentED
```

**Example**:

```
Current state:
- EC = $800
- ED = $400
- HF = 800 / 400 = 2.0 (> MaxHF of 1.5)

Calculate additional borrow:
ED_target = 800 / 1.3 = $615.38
Additional = 615.38 - 400 = $215.38 MOET

After borrowing $215.38:
- EC = $800 (unchanged)
- ED = $615.38
- HF = 800 / 615.38 = 1.30
```

### Undercollateralized Rebalancing (HF < MinHF)

When health falls below minimum, calculate required repayment:

```math
RequiredRepayment = CurrentED - (EC / TargetHF)
```

**Proof**:

```
Want: HF_new = TargetHF
HF_new = EC / ED_new = TargetHF
ED_new = EC / TargetHF

Required repayment = CurrentED - ED_new
                   = CurrentED - (EC / TargetHF)
```

**Example**:

```
Price drops! Collateral value decreases.

New state:
- EC = $640 (was $800, FLOW dropped 20%)
- ED = $615.38 (unchanged)
- HF = 640 / 615.38 = 1.04 (< MinHF of 1.1)

Calculate required repayment:
ED_target = 640 / 1.3 = $492.31
Repayment = 615.38 - 492.31 = $123.07 MOET

After repaying $123.07:
- EC = $640 (unchanged)
- ED = $492.31
- HF = 640 / 492.31 = 1.30
```

## Interest Mathematics

### Scaled Balance System

Instead of updating every position's balance when interest accrues, FCM stores a "scaled" version of each balance that remains constant over time. This scaled balance is the actual balance divided by a global interest index, allowing the protocol to track interest for thousands of positions with minimal gas costs.

```math
ScaledBalance = \frac{TrueBalance}{I_t}
```

Where:
- $ScaledBalance$: Stored scaled balance
- $TrueBalance$: Actual balance including interest
- $I_t$: Current interest index

**Key insight**: Scaled balance stays constant while interest index grows.

### Interest Index Growth

The interest index is a global multiplier that starts at 1.0 and grows over time based on the current interest rate. Every time the protocol updates, the index increases slightly, and this single update effectively compounds interest for all positions simultaneously.

```math
I_t(n+1) = I_t(n) × (1 + r × \Delta t)
```

Where:
- $r$: Annual interest rate (e.g., 0.10 for 10%)
- $\Delta t$: Time elapsed (in years)

**For compound interest**:

```math
I_t(n) = I_0 × e^{r × t}
```

Where $e$ is Euler's number (≈2.718).

### True Balance Calculation

When you need to know the actual current balance of a position (including all accrued interest), you multiply the stored scaled balance by the current interest index. This calculation happens on-demand only when the position is accessed, not on every block.

```math
TrueBalance(t) = ScaledBalance × I_t
```

**Example**:
```
Initial deposit: 1000 MOET
Initial index: I_0 = 1.0
Scaled balance: ScaledBalance = 1000 / 1.0 = 1000

After 1 year at 10% APY:
Interest index: I_1 = 1.0 × e^(0.10 × 1) ≈ 1.105
True balance: TrueBalance = 1000 × 1.105 = 1105 MOET

User's debt grew from 1000 to 1105 MOET (10.5% with compound interest)
```

### Why Scaled Balances?

The scaled balance system is a gas optimization that makes FCM economically viable even with thousands of active positions. By storing balances in a scaled form and only updating a single global index, the protocol avoids the prohibitive cost of updating every position on every block.

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

```math
HF < 1.0
```

Equivalently:

```math
EC < ED
```

### Liquidation Target

Liquidations aim to restore health to a target (typically 1.05):

```math
Target HF = 1.05
```

### Collateral Seized Calculation

The amount of collateral to seize depends on the implementation approach used by the protocol.

**Simplified Formula** (used in basic examples and documentation):

```math
CollateralSeized = (DebtRepaid × (1 + bonus)) / PriceCollateral
```

Where:
- $DebtRepaid$: Amount of debt repaid by liquidator (in MOET or debt token)
- $bonus$: Liquidation bonus (e.g., 0.05 for 5%)
- $PriceCollateral$: Market price of collateral token in MOET terms

**Complete Formula** (actual FCM implementation):

```math
CollateralSeized = [(DebtRepaid × PriceDebt) / BorrowFactor] × (1 + bonus) / (PriceCollateral × CollateralFactor)
```

Where:
- $DebtRepaid$: Amount of debt repaid by liquidator
- $PriceDebt$: Oracle price of debt token (in MOET terms, typically 1.0 for MOET)
- $BorrowFactor$: Risk parameter for debt (typically 1.0)
- $bonus$: Liquidation bonus (e.g., 0.05 for 5%)
- $PriceCollateral$: Oracle price of collateral token (in MOET terms)
- $CollateralFactor$: Risk parameter for collateral (e.g., 0.8 for FLOW)

**Why the difference?** The simplified formula assumes debt price = 1.0, borrow factor = 1.0, and ignores the collateral factor in seizure (treating it as only affecting borrowing capacity). The complete formula properly accounts for all risk parameters and token prices as implemented in the actual protocol.

**For MOET debt with typical parameters:**
- $PriceDebt$ = 1.0 (MOET)
- $BorrowFactor$ = 1.0
- This simplifies the numerator to: $(DebtRepaid × 1.0)/ 1.0 = DebtRepaid$

The collateral factor appears in the denominator because it affects how much collateral value must be seized to repay the effective debt. Since effective collateral is calculated as $CollateralAmount × PriceCollateral × CollateralFactor$, seizing collateral to cover debt requires dividing by the CollateralFactor to get the actual token amount.

**Example using simplified formula**:

```
Liquidatable position:
- Collateral: 1000 FLOW @ $0.60 = $600 total value
- Effective collateral: $600 × 0.8 CF = $480
- Debt: 650 MOET @ $1.00
- HF = 480 / 650 = 0.738 < 1.0

Partial liquidation using simplified formula:
- Liquidator repays: 150 MOET
- Liquidation bonus: 5%
- Collateral seized = (150 × 1.05) / 0.60 = 262.5 FLOW
- Value of seized collateral: 262.5 × $0.60 = $157.50

After partial liquidation:
- Remaining collateral: 1000 - 262.5 = 737.5 FLOW @ $0.60 = $442.50
- Effective collateral: $442.50 × 0.8 = $354.00
- Remaining debt: 650 - 150 = 500 MOET
- New HF = 354.00 / 500 = 0.708 (still liquidatable)

Liquidator's profit:
- Paid: $150 (debt repayment)
- Received: $157.50 worth of FLOW
- Profit: $7.50 (5% bonus on $150)
```

**Example using complete formula**:

```
Same liquidatable position as above.

Partial liquidation using complete formula:
- DebtRepaid: 150 MOET
- PriceDebt: 1.0 (MOET)
- BorrowFactor: 1.0
- Liquidation bonus: 5% (0.05)
- PriceCollateral: 0.60 (FLOW in MOET terms)
- CollateralFactor: 0.8

CollateralSeized = (150 × 1.0 / 1.0) × 1.05 / (0.60 × 0.8)
                 = 157.50 / 0.48
                 = 328.125 FLOW

Value of seized collateral: 328.125 × $0.60 = $196.875

After partial liquidation:
- Remaining collateral: 1000 - 328.125 = 671.875 FLOW @ $0.60 = $403.125
- Effective collateral: $403.125 × 0.8 = $322.50
- Remaining debt: 650 - 150 = 500 MOET
- New HF = 322.50 / 500 = 0.645 (still liquidatable, but lower than simplified)

Liquidator's profit:
- Paid: $150 (debt repayment)
- Received: $196.875 worth of FLOW
- Profit: $46.875 (31.25% effective bonus!)

Note: The complete formula gives the liquidator significantly more collateral because
it divides by the CollateralFactor. This compensates for the risk discount applied
to the collateral. In practice, the actual FlowCreditMarket implementation uses the
quoteLiquidation() function which calculates the exact amounts needed to reach the
target health factor of 1.05.
```

### Required Debt Repayment for Target Health

To restore a position to the target health factor (typically 1.05), we need to find how much debt to repay. This is complex because seizing collateral also reduces the effective collateral simultaneously.

**Goal:** Achieve a specific target health factor after liquidation:

```math
HF_target = EC_after / ED_after
```

**The challenge:** Both EC and ED change during liquidation:

```math
EC_after = EC_current - (Collateral Seized × Price × CF)
ED_after = ED_current - Debt Repaid
```

**Using the simplified seizure formula:**

```math
Collateral Seized = (Debt Repaid × (1 + bonus)) / Price
```

The effective collateral value seized is:

```math
EC_seized = Collateral Seized × Price × CF
          = [(Debt Repaid × (1 + bonus)) / Price] × Price × CF
          = Debt Repaid × (1 + bonus) × CF
```

**Substituting into the target health equation:**

```math
HF_target = [EC_current - Debt Repaid × (1 + bonus) × CF] / [ED_current - Debt Repaid]
```

**Solving for Debt Repaid:**

```math
HF_target × (ED_current - Debt Repaid) = EC_current - Debt Repaid × (1 + bonus) × CF

HF_target × ED_current - HF_target × Debt Repaid = EC_current - Debt Repaid × (1 + bonus) × CF

HF_target × ED_current - EC_current = HF_target × Debt Repaid - Debt Repaid × (1 + bonus) × CF

HF_target × ED_current - EC_current = Debt Repaid × [HF_target - (1 + bonus) × CF]
```

**Final formula:**

```math
Debt Repaid = (HF_target × ED_current - EC_current) / [HF_target - (1 + bonus) × CF]
```

**Working example:**

```
Initial position (severely undercollateralized):
- Collateral: 1000 FLOW @ $0.50 (price dropped significantly!)
- EC = 1000 × 0.50 × 0.8 = $400
- ED = 615.38 MOET
- Current HF = 400 / 615.38 = 0.65 < 1.0 (liquidatable!)
- Target HF = 1.05
- Liquidation bonus = 5% (0.05)
- Collateral Factor (CF) = 0.8

Step 1: Calculate required debt repayment
Debt Repaid = (1.05 × 615.38 - 400) / [1.05 - (1.05 × 0.8)]
            = (646.15 - 400) / [1.05 - 0.84]
            = 246.15 / 0.21
            = 1,172.14 MOET

This is more than the total debt! This means the position cannot be restored to HF = 1.05
because there isn't enough collateral. This would be a full liquidation case.

Step 2: Calculate maximum achievable HF
If all debt is repaid (615.38 MOET):
Collateral seized = (615.38 × 1.05) / 0.50 = 1,292.30 FLOW
But we only have 1000 FLOW, so this is a full liquidation.

In full liquidation:
- All 1000 FLOW seized → value = $500
- Effective value for liquidator = $500
- Debt repaid = 500 / 1.05 = $476.19 MOET (limited by collateral available)
- Remaining debt = 615.38 - 476.19 = $139.19 (bad debt for protocol)
```

**Better example with partial liquidation:**

```
Initial position (moderately undercollateralized):
- Collateral: 1000 FLOW @ $0.78
- EC = 1000 × 0.78 × 0.8 = $624
- ED = 650 MOET
- Current HF = 624 / 650 = 0.96 < 1.0 (liquidatable)
- Target HF = 1.05
- Bonus = 5% (0.05)
- CF = 0.8

Step 1: Calculate debt repayment
Debt Repaid = (1.05 × 650 - 624) / [1.05 - (1.05 × 0.8)]
            = (682.5 - 624) / [1.05 - 0.84]
            = 58.5 / 0.21
            = 278.57 MOET

Step 2: Verify the calculation
Collateral seized = (278.57 × 1.05) / 0.78 = 375.33 FLOW
EC seized = 375.33 × 0.78 × 0.8 = $234.21
EC after = 624 - 234.21 = $389.79
ED after = 650 - 278.57 = $371.43
HF after = 389.79 / 371.43 = 1.049 ≈ 1.05 ✓

Step 3: Liquidator's outcome
Collateral received: 375.33 FLOW @ $0.78 = $292.76
Debt repaid: $278.57
Profit: $292.76 - $278.57 = $14.19 (5.09% return)
```

**Key insights:**
1. The formula works when there's sufficient collateral to reach target HF
2. When `Debt Repaid > ED_current`, it indicates a full liquidation scenario
3. The denominator `[HF_target - (1 + bonus) × CF]` is typically small (0.21 in this example), meaning small changes in EC/ED require large debt repayments
4. The liquidation becomes more efficient (smaller debt repayment needed) when the current HF is closer to the target HF

## Price Impact Analysis

### Health Factor Sensitivity to Price Changes

Given a percentage change in collateral price:

```math
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

```math
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

```math
EC = ∑(A_i × P_i × CF_i)
```

Where the sum is taken over all n collateral token types.

### Effective Collateral with Price Correlation

When collateral types are correlated (e.g., FLOW and stFLOW):

**Simplified (no correlation)**:

```math
Risk = \sum_i Risk_i
```

**With correlation** (advanced):

```math
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

```math
APY_simple = ((FinalValue - InitialValue) / InitialValue) × (365 / Days)
```

### Compound APY

With continuous compounding:

```math
APY_compound = e^r - 1
```

Where $r$ is the continuous annual rate.

### Leveraged Yield

When borrowing to increase yield exposure:

```math
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

```math
\text{Risk Score} = (1 / HF - 1.0) × \text{Volatility Collateral}
```

Higher score = higher risk.

### Value at Risk (VaR)

Maximum expected loss over time period at confidence level 95%:

```math
VaR(95) = EC × σ × z(0.95)
```

Where:
- σ: Daily volatility of collateral
- z(0.95): Z-score for 95% confidence (≈1.645)

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

```math
1.0 ≤ MinHF < TargetHF < MaxHF
```

Typical values: $MinHF = 1.1$, $TargetHF = 1.3$, $MaxHF = 1.5$

### Collateral Factor Bounds

For safety:

```math
0 < CF_t ≤ 1.0
```

Typically:
- Volatile assets (FLOW): $CF = 0.75 - 0.85$
- Stable assets (USDC): $CF = 0.90 - 0.95$
- Liquid staking (stFLOW): $CF = 0.80 - 0.85$

### Maximum Leverage

Maximum theoretical leverage:

```math
MaxLeverage = \frac{1}{1 - CF}
```

**Examples**:

```
CF = 0.8: Max leverage = 1 / (1 - 0.8) = 5x
CF = 0.75: Max leverage = 1 / (1 - 0.75) = 4x
CF = 0.9: Max leverage = 1 / (1 - 0.9) = 10x (risky!)
```

But actual safe borrowing is constrained by target health:

### Safe Debt Ratio

Maximum debt-to-collateral ratio while maintaining target health:

```math
SafeDebtRatio = CF / TargetHF
```

**Examples**:

```
CF = 0.8, TargetHF = 1.3: Safe debt ratio = 0.8 / 1.3 ≈ 0.615
CF = 0.75, TargetHF = 1.5: Safe debt ratio = 0.75 / 1.5 = 0.50
```

This means with CF = 0.8 and TargetHF = 1.3, you can safely borrow up to $0.615 for every $1 of collateral value.

## Practical Examples

### Complete Position Lifecycle Math

```
=== Initial Deposit ===
Deposit: 1000 FLOW @ $1.00
CF = 0.8, TargetHF = 1.3

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

## Next Steps

- **Apply these formulas**: [ALP Documentation](../alp/index.md)
- **Understand architecture**: [FCM Architecture](./architecture.md)
- **Learn the basics**: [Understanding FCM Basics](./basics.md)