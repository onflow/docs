---
title: Leveraged Farming
sidebar_position: 6
---

# Leveraged Farming

Leveraged farming amplifies your yield potential by using borrowed capital to increase your exposure to yield-generating assets. This document explains how FYV's TracerStrategy implements leveraged farming and the mechanics of leverage amplification.

## What is Leveraged Farming?

Leveraged farming combines collateralized borrowing with yield farming to achieve returns greater than your initial capital. By depositing collateral to borrow additional capital, converting borrowed capital to yield-bearing tokens, and earning yield on both your capital and borrowed funds, you amplify your total returns while maintaining automated risk management through health factor monitoring.

**Simple example:**
```
Without leverage:
  - Deposit: $1,000
  - Yield: 10% APY
  - Annual return: $100 (10% on $1,000)

With 1.61x leverage:
  - Deposit: $1,000
  - Borrowed: $615
  - Total farming: $1,615
  - Yield: 10% APY on $1,615 = $161.50
  - After repaying borrow cost (assume 3% APY): $161.50 - $18.45 = $143.05
  - Net return: $143.05 (14.3% on $1,000 initial capital)
```

## How TracerStrategy Achieves Leverage

TracerStrategy implements leveraged farming through integration with ALP's lending platform:

### Step-by-Step Leverage Mechanics

**1. Collateral Deposit**
```
User deposits: 1000 FLOW @ $1.00 = $1,000
Collateral Factor: 0.8 (80%)
Effective Collateral (EC): $1,000 × 0.8 = $800
```

**2. Calculate Borrowing Capacity**
```
Target Health Factor: 1.3
Maximum Safe Borrow = EC / Target HF
                    = $800 / 1.3
                    = $615.38 MOET
```

**3. Auto-Borrow**
```
Position borrows: 615.38 MOET @ $1.00 = $615.38
Debt created: $615.38
Health Factor: $800 / $615.38 = 1.30 ✓
```

**4. Convert to Yield Tokens**
```
Swap: 615.38 MOET → ~610 YieldToken
Slippage: ~1% (typical)
Yield exposure: $610
```

**5. Deposit to Yield Vault**
```
AutoBalancer deposits: 610 YieldToken to ERC4626
Total position value: $1,000 (collateral) + $610 (yield) = $1,610
Effective leverage: $1,610 / $1,000 = 1.61x
```

## Leverage Ratio Calculation

The leverage ratio indicates how much total exposure you have relative to your initial capital:

```
Leverage = Total Exposure / Initial Capital
         = (Collateral + Borrowed Value) / Collateral
         = (C + B) / C
         = 1 + (B / C)
```

**For TracerStrategy with default settings:**
```
Borrowed (B) = (C × CF) / Target HF
             = (C × 0.8) / 1.3
             = 0.615 × C

Leverage = 1 + 0.615 = 1.615x
```

**Different collateral factors:**
```
CF = 0.75, Target HF = 1.3:
  Borrow = (C × 0.75) / 1.3 = 0.577 × C
  Leverage = 1.577x

CF = 0.85, Target HF = 1.3:
  Borrow = (C × 0.85) / 1.3 = 0.654 × C
  Leverage = 1.654x
```

## Risk-Adjusted Returns

Leverage amplifies both gains and losses. Understanding the risk/reward tradeoff is critical:

### Upside Scenario (Yield Positive)

```
Initial: 1000 FLOW, 1.61x leverage, 10% APY on yield tokens

Without leverage (baseline):
  - Capital: $1,000
  - Yield: 10% × $1,000 = $100
  - Return: 10%

With leverage (assuming 3% borrow cost):
  - Collateral: $1,000
  - Borrowed: $615.38
  - Yield farming: $615.38 at 10% = $61.54
  - Borrow cost: $615.38 at 3% = $18.46
  - Net from leverage: $61.54 - $18.46 = $43.08
  - Total return: $43.08 (4.3% additional from leverage)
  - Combined: 10% (baseline) + 4.3% (leverage) = 14.3%
  - Amplification: 1.43x returns
```

### Downside Scenario (Yield Negative)

```
Initial: 1000 FLOW, 1.61x leverage, -5% yield (vault loss)

Without leverage:
  - Capital: $1,000
  - Loss: -5% × $1,000 = -$50
  - Return: -5%

With leverage (3% borrow cost still applies):
  - Yield farming loss: $615.38 × -5% = -$30.77
  - Borrow cost: $615.38 × 3% = $18.46
  - Net from leverage: -$30.77 - $18.46 = -$49.23
  - Total return: -$49.23 (-4.9% additional loss from leverage)
  - Combined: -5% (baseline) - 4.9% (leverage) = -9.9%
  - Amplification: 1.98x losses
```

**Key insight:** Leverage amplifies returns but also amplifies losses. The amplification factor depends on the spread between yield and borrow cost.

## Health Factor Dynamics

The health factor is critical for managing liquidation risk in leveraged positions:

### Health Factor Formula

```
HF = Effective Collateral / Effective Debt
   = (Collateral Value × CF) / Debt Value
```

### Price Impact on Health

When collateral price changes, health factor changes proportionally:

```
Initial state:
  - 1000 FLOW @ $1.00
  - EC: $800 (80% CF)
  - Debt: $615.38
  - HF: 1.30

FLOW price drops to $0.90 (-10%):
  - Collateral value: $900
  - EC: $900 × 0.8 = $720
  - Debt: $615.38 (unchanged)
  - HF: $720 / $615.38 = 1.17

FLOW price drops to $0.75 (-25%):
  - Collateral value: $750
  - EC: $750 × 0.8 = $600
  - Debt: $615.38
  - HF: $600 / $615.38 = 0.975 ⚠️ LIQUIDATABLE!
```

### Safe Price Drop Calculation

How much can price drop before liquidation?

```
Liquidation occurs when HF < 1.0:
  (C_new × Price_new × CF) / Debt = 1.0

Solving for Price_new:
  Price_new = Debt / (C × CF)
            = $615.38 / (1000 × 0.8)
            = $0.769

Safe price drop from $1.00:
  Drop = ($1.00 - $0.769) / $1.00 = 23.1%
```

**With target HF = 1.3, you have a 23.1% price drop buffer before liquidation.**

## Rebalancing Impact on Leverage

AutoBalancer's rebalancing affects your effective leverage over time:

### Excess Profits Rebalancing

When yield accrues and AutoBalancer withdraws excess:

```
Before rebalancing:
  - Collateral: 1000 FLOW
  - Debt: $615.38
  - Yield value: $671 (excess over historical $610)
  - Leverage: ($1,000 + $671) / $1,000 = 1.671x

After rebalancing (withdraw $61 excess):
  - Swap $61 yield → ~60 FLOW
  - Deposit 60 FLOW to position
  - Collateral: 1060 FLOW
  - Debt: $615.38 (unchanged)
  - Yield value: $610 (back to baseline)
  - Leverage: ($1,060 + $610) / $1,060 = 1.575x
  - New HF: (1060 × 0.8) / 615.38 = 1.38 (improved!)
```

**Effect:** Leverage decreases slightly, safety buffer increases, profits locked in as collateral.

### Deficit Recovery Rebalancing

When vault loses value and AutoBalancer requests recovery:

```
Before rebalancing:
  - Collateral: 1000 FLOW
  - Debt: $615.38
  - Yield value: $580 (deficit below historical $610)
  - Leverage: ($1,000 + $580) / $1,000 = 1.58x

After rebalancing (borrow $30 more to cover deficit):
  - Borrow additional $30 MOET
  - Swap $30 MOET → ~29.7 YieldToken
  - Deposit to vault
  - Collateral: 1000 FLOW (unchanged)
  - Debt: $615.38 + $30 = $645.38
  - Yield value: $609.70 (recovered)
  - Leverage: ($1,000 + $609.70) / $1,000 = 1.6097x
  - New HF: (1000 × 0.8) / 645.38 = 1.24 (lower but still safe)
```

**Effect:** Leverage stays similar, safety buffer decreases, deficit recovered.

## Optimizing Leverage

You can adjust leverage by changing configuration parameters:

### Target Health Factor Adjustment

```
Higher Target HF (more conservative):
  - Target HF = 1.5
  - Borrow = (C × CF) / 1.5 = (C × 0.8) / 1.5 = 0.533 × C
  - Leverage = 1.533x
  - Larger safety buffer (50% above liquidation)
  - Lower yield amplification

Lower Target HF (more aggressive):
  - Target HF = 1.1
  - Borrow = (C × CF) / 1.1 = (C × 0.8) / 1.1 = 0.727 × C
  - Leverage = 1.727x
  - Smaller safety buffer (10% above liquidation)
  - Higher yield amplification but higher risk
```

### Multi-Vault Strategy

Advanced users can create multiple vaults with different leverage levels:

```
Conservative vault:
  - 50% of capital
  - Target HF = 1.5
  - Leverage: 1.53x
  - Low risk

Aggressive vault:
  - 50% of capital
  - Target HF = 1.2
  - Leverage: 1.67x
  - Higher risk

Combined effective leverage: (1.53 + 1.67) / 2 = 1.60x
Risk diversification: Two independent positions
```

## Best Practices

**Understand Your Risk**: Higher leverage = higher returns potential but also higher liquidation risk. Know your risk tolerance.

**Monitor Health Factor**: Check regularly, especially during volatile markets. Set alerts if possible for HF < 1.2.

**Conservative Targeting**: Start with higher target HF (1.4-1.5) until you understand the system, then optimize based on experience.

**Diversify Collateral**: If using multiple vaults, diversify across different collateral types to reduce price correlation risk.

**Account for Costs**: Factor in swap slippage, gas costs, and borrow costs when calculating expected returns.

**Emergency Plan**: Keep liquid funds available to add collateral if prices move against you.

## Summary

Leveraged farming in FYV achieves 1.6x+ exposure through ALP integration, borrowing at target health factor (typically 1.3), converting borrowed capital to yield tokens, and maintaining automated health management. The system amplifies returns when yields exceed borrow costs, increases liquidation risk through reduced price buffers, and continuously optimizes through AutoBalancer rebalancing.

**Risk/Reward tradeoff:**
- **Higher leverage** → Greater amplification but higher liquidation risk
- **Lower leverage** → Lower amplification but greater safety buffer
- **Optimal leverage** → Balanced based on your risk tolerance and market outlook

---

:::tip Key Takeaway
Leveraged farming amplifies both gains and losses. With FYV's default 1.61x leverage and 23% price drop buffer, you get meaningful yield amplification while maintaining reasonable safety. Always monitor your health factor and understand the liquidation risks.
:::
