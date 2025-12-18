---
title: Understanding FCM Basics
sidebar_position: 2
---

# Understanding FCM Basics

To understand how Flow Credit Market (FCM) works, let's build up from simple lending concepts to FCM's innovative three-component architecture.

## From Traditional Lending to FCM

### Level 1: Traditional Lending (Aave, Compound)

In traditional DeFi lending protocols:

```mermaid
graph LR
    User[User] -->|Deposit FLOW| Protocol[Lending Protocol]
    Protocol -->|Borrow USDC| User
    User -->|Repay + Interest| Protocol

    style Protocol fill:#bbf,stroke:#333,stroke-width:2px
```

**How it works**:
1. Deposit collateral (e.g., 1000 FLOW worth $1000)
2. Borrow up to ~75% of collateral value (e.g., $750 USDC)
3. Pay interest on borrowed amount
4. **Your responsibility**: Monitor health factor and manually manage position

**Limitations**: Traditional lending requires you to manually monitor and rebalance positions, quickly add collateral or repay debt if collateral price drops, manually deploy borrowed funds to avoid them sitting idle, and act fast enough to prevent liquidation.

### Level 2: Automated Lending (ALP)

ALP adds automation to traditional lending:

```mermaid
graph LR
    User[User] -->|Deposit FLOW| ALP[ALP Position]
    ALP -->|Auto-borrow MOET| User

    Price[Price Drop] -.->|Triggers| Rebalance[Auto-Rebalance]
    Rebalance -->|Pulls funds| Source[TopUpSource]
    Source -->|Repays debt| ALP

    style ALP fill:#f9f,stroke:#333,stroke-width:2px
```

**New features**:
- ✅ **Auto-borrowing**: Automatically borrows optimal amount when you deposit
- ✅ **Auto-rebalancing**: Maintains target health ratio automatically
- ✅ **TopUpSource integration**: Can pull from external sources to prevent liquidation

**Better, but**:
- ⚠️ TopUpSource must have funds available
- ⚠️ Borrowed MOET still needs manual deployment for yield
- ⚠️ Still some manual intervention required

### Level 3: FCM (ALP + FYV + MOET)

FCM completes the automation by adding yield generation:

```mermaid
graph TB
    User[User] -->|1. Deposit FLOW| ALP[ALP Position]
    ALP -->|2. Auto-borrow MOET| DrawDown[DrawDownSink]
    DrawDown -->|3. Deploy| FYV[FYV Strategy]
    FYV -->|4. Generate yield| Yield[Yield Tokens]

    Price[Price Drop] -.->|Triggers| ALP
    FYV -->|5. Provide liquidity| TopUp[TopUpSource]
    TopUp -->|6. Repay debt| ALP

    Yield -.->|Accumulates| FYV

    style ALP fill:#f9f,stroke:#333,stroke-width:4px
    style FYV fill:#bfb,stroke:#333,stroke-width:4px
    style MOET fill:#fbb,stroke:#333,stroke-width:2px
```

**Complete automation**:
- ✅ **Auto-borrowing**: Instantly borrow optimal amount
- ✅ **Auto-deployment**: Borrowed MOET flows directly to yield strategies
- ✅ **Auto-compounding**: FYV strategies reinvest yields
- ✅ **Auto-protection**: FYV provides liquidity to prevent liquidations
- ✅ **Auto-everything**: True set-and-forget experience

**The breakthrough**:
- 🎯 **Yield protects your position**: Your generated yield maintains health automatically
- 🎯 **No manual intervention**: Everything happens automatically
- 🎯 **Capital efficiency**: Borrowed capital works for you immediately

## Understanding the Three Components

### Component 1: ALP (The Lending Engine)

**What it does**: Manages collateral and debt positions with automated rebalancing.

**Key concepts**:
- **Collateral**: Assets you deposit (FLOW, stFLOW, etc.)
- **Collateral Factor**: Percentage of collateral value you can borrow (e.g., 0.8 = 80%)
- **Health Factor**: Ratio of collateral to debt (must be > 1.0)
- **Target Health**: Optimal ratio the system maintains (typically 1.3)

**Example**:
```
Deposit: 1000 FLOW @ $1 = $1000
Collateral Factor: 0.8 (80%)
Effective Collateral: $800

Target Health: 1.3
Max Safe Borrow: $800 / 1.3 ≈ $615.38 MOET

ALP auto-borrows: 615.38 MOET
Position Health: 800 / 615.38 = 1.3 ✓
```

Learn more: [ALP Documentation](../alp/index.md)

### Component 2: FYV (The Yield Engine)

**What it does**: Deploys capital into yield-generating strategies and provides liquidity for liquidation prevention.

**Key concepts**:
- **Strategies**: Predefined yield-generating approaches (TracerStrategy, etc.)
- **AutoBalancer**: Manages exposure to yield tokens and rebalancing
- **DrawDownSink**: Receives borrowed MOET from ALP
- **TopUpSource**: Provides liquidity back to ALP when needed

**Example strategy (TracerStrategy)**:
```
1. Receive MOET from ALP → DrawDownSink
2. Swap MOET → YieldToken (e.g., LP token, farm token)
3. Hold YieldToken in AutoBalancer
4. Accumulate yield over time
5. When ALP needs funds:
   - Swap YieldToken → MOET
   - Provide via TopUpSource
   - ALP repays debt
```

Learn more: [FYV Documentation](../flow-yield-vaults/index.md)

### Component 3: MOET (The Unit of Account)

**What it does**: Serves as the currency for all operations - borrowed asset, pricing unit, and value transfer medium.

**Key concepts**:
- **Unit of Account**: All prices quoted in MOET (FLOW/MOET, USDC/MOET)
- **Primary Borrowed Asset**: What ALP auto-borrows and what FYV receives
- **Synthetic Stablecoin**: Value pegged to maintain stability
- **Medium of Exchange**: Flows between ALP and FYV

**Why MOET?**: MOET standardizes all valuations, simplifies multi-collateral calculations, is designed specifically for DeFi operations, and provides deep integration with the Flow ecosystem.

Learn more: [MOET Documentation](../moet/index.md)

## The Capital Flow Cycle

Let's follow $1000 of FLOW through the entire FCM system:

### Phase 1: Initial Deposit and Borrowing

```
You deposit: 1000 FLOW worth $1000
↓
ALP calculates:
  - Effective collateral: $1000 × 0.8 = $800
  - Target health: 1.3
  - Borrow amount: $800 / 1.3 = $615.38 MOET
↓
ALP auto-borrows: 615.38 MOET
↓
MOET flows to: FYV strategy (via DrawDownSink)
↓
FYV swaps: 615.38 MOET → 615.38 YieldToken
↓
Status:
  - Your ALP position: 1000 FLOW collateral, 615.38 MOET debt
  - Your FYV position: 615.38 YieldToken generating yield
  - Health factor: 1.3 ✓
```

### Phase 2: Yield Generation

```
Time passes...
↓
FYV Strategy generates yield:
  - Trading fees from LP positions
  - Farming rewards
  - Interest from lending
↓
Example after 1 month:
  - YieldToken value: 615.38 → 625.00 (+1.5% return)
  - Yield earned: ~$10
↓
FYV holds:
  - Original: 615.38 YieldToken
  - Plus accumulated yield
```

### Phase 3: Price Drop & Auto-Protection

```
FLOW price drops: $1.00 → $0.80 (-20%)
↓
ALP detects:
  - Collateral: 1000 FLOW @ $0.80 = $800 × 0.8 = $640 effective
  - Debt: 615.38 MOET
  - New health: 640 / 615.38 = 1.04 (below min 1.1!)
↓
ALP triggers rebalancing:
  - Calculates required repayment
  - Target debt: $640 / 1.3 = $492.31 MOET
  - Needs to repay: 615.38 - 492.31 = 123.07 MOET
↓
ALP pulls from FYV (TopUpSource):
  - FYV swaps: 123.07 YieldToken → 123.07 MOET
  - Sends MOET to ALP
↓
ALP repays debt:
  - New debt: 492.31 MOET
  - New health: 640 / 492.31 = 1.3 ✓
↓
Status:
  - ALP position: 1000 FLOW, 492.31 MOET debt, HF=1.3
  - FYV position: ~492 YieldToken remaining
  - Liquidation prevented! ✓
```

### Phase 4: Price Recovery

```
FLOW price recovers: $0.80 → $1.00
↓
ALP detects:
  - Collateral: 1000 FLOW @ $1.00 = $1000 × 0.8 = $800 effective
  - Debt: 492.31 MOET
  - New health: 800 / 492.31 = 1.625 (above max 1.5!)
↓
ALP triggers rebalancing:
  - Can borrow more to reach target health
  - Target debt: $800 / 1.3 = $615.38 MOET
  - Can borrow: 615.38 - 492.31 = 123.07 MOET
↓
ALP auto-borrows:
  - Borrows: 123.07 MOET
  - Pushes to FYV (DrawDownSink)
↓
FYV deploys:
  - Swaps: 123.07 MOET → 123.07 YieldToken
  - Back to ~615 YieldToken
↓
Status:
  - ALP position: 1000 FLOW, 615.38 MOET debt, HF=1.3
  - FYV position: ~615 YieldToken generating yield
  - Fully rebalanced and optimized! ✓
```

## Key Benefits Explained

### 1. Yield-Powered Liquidation Prevention

**Traditional protocol**:
```
Price drops → Health factor drops → You must manually:
  1. Monitor the drop
  2. Decide: add collateral or repay debt?
  3. Find liquidity
  4. Execute transaction
  5. Hope you're not liquidated first
```

**FCM**:
```
Price drops → Health factor drops → System automatically:
  1. Detects drop instantly
  2. Calculates exact repayment needed
  3. Pulls from your yield
  4. Repays debt
  5. Restores health

All in one transaction, no intervention needed!
```

### 2. Capital Efficiency

**Without FCM**:
```
Scenario: Have 1000 FLOW, want to generate yield

Option A: Just hold FLOW
  - Capital: $1000 working
  - Opportunity cost: Missing yield opportunities

Option B: Deposit in lending protocol
  - Earn deposit interest: ~3% APY
  - Capital: $1000 working
  - Yield: ~$30/year

Option C: Manual yield farming
  - Borrow against FLOW: ~$750
  - Deploy to farm: Complex, risky
  - Must monitor constantly
  - Risk liquidation
```

**With FCM**:
```
Deposit 1000 FLOW → FCM does everything:
  - Borrow optimal amount: ~$615 MOET
  - Deploy to best yield: Automatic
  - Compound returns: Automatic
  - Prevent liquidation: Automatic
  - Potential yield: 5-15% APY (varies by strategy)

Capital efficiency: Using collateral to earn yield on borrowed funds
Risk management: Yield protects against liquidation
Effort: Set and forget
```

### 3. Composability

Each component has value independently:

**Use ALP alone** when you:
- Want simple lending/borrowing
- Have your own yield strategies
- Need DeFi Actions integration

**Use FYV alone** when you:
- Want yield aggregation
- Don't need leverage
- Prefer direct yield farming

**Use FCM together** when you:
- Want maximum automation
- Desire liquidation protection
- Seek optimal capital efficiency

## Understanding the Math

### Health Factor Calculation

```
Health Factor = Effective Collateral / Effective Debt

Effective Collateral = Token Amount × Price × Collateral Factor
Effective Debt = Borrowed Amount × Price

Example:
  - 1000 FLOW @ $1 each × 0.8 factor = $800 effective collateral
  - 615.38 MOET @ $1 each = $615.38 effective debt
  - Health Factor = 800 / 615.38 = 1.30
```

### Target Health Ranges

```
Health Factor States:

HF < 1.0   → Liquidatable (immediate danger!)
HF = 1.0-1.1 → At risk (very close to liquidation)
HF = 1.1-1.3 → Below target (should rebalance up)
HF = 1.3     → Target (optimal!)
HF = 1.3-1.5 → Above target (can borrow more)
HF > 1.5     → Overcollateralized (should rebalance down)
```

### Borrowing Capacity

```
Maximum Safe Borrow = Effective Collateral / Target Health

Example with target health of 1.3:
  - Effective collateral: $800
  - Max borrow: $800 / 1.3 = $615.38 MOET

Why not borrow more?
  - Need safety buffer for price volatility
  - Target of 1.3 means 30% buffer above liquidation
  - If you borrowed $800, health would be 1.0 (liquidatable immediately!)
```

Learn more: [Mathematical Foundations](./math.md)

## Common Questions

### How does FCM differ from Uniswap V3?

**Uniswap V3** evolved from V2 by adding:
- Concentrated liquidity (specific price ranges)
- Multiple fee tiers
- Capital efficiency improvements
- More complex LP management

**FCM** evolves from basic lending by adding:
- Automated position management
- Yield generation integration
- Liquidation prevention via yield
- Multi-component architecture (ALP + FYV + MOET)

Both are "evolved" versions of simpler protocols, adding complexity for better capital efficiency.

### Can I use FCM without understanding all three components?

**Yes!** Think of it like using a car:
- **User level**: Just drive (deposit and earn yield)
- **Enthusiast level**: Understand the engine (how ALP, FYV, and MOET connect)
- **Builder level**: Modify and extend (create custom strategies)

Start with user level, learn more as you go.

### What happens if FYV doesn't have enough liquidity for rebalancing?

Multiple fallback mechanisms:
1. **Primary**: FYV provides from yield
2. **Secondary**: FYV can exit positions partially
3. **Tertiary**: Traditional liquidation (external liquidators)
4. **Emergency**: Circuit breakers and admin intervention

The system is designed with multiple safety layers.

### Is my yield always enough to prevent liquidation?

**Not guaranteed**, but highly likely because you're earning yield continuously, the system only pulls what's needed, the health buffer (1.3 target) provides cushion, and you can deposit more collateral anytime. Traditional protocols have 0% chance of automatic prevention - FCM gives you a strong automatic defense.

## Next Steps

Now that you understand the basics:

1. **Learn the architecture**: [Architecture Overview](./architecture.md)
2. **Understand the math**: [Mathematical Foundations](./math.md)
3. **Explore components**: [ALP](../alp/index.md), [FYV](../flow-yield-vaults/index.md), [MOET](../moet/index.md)
4. **Start using FCM**: Follow the quick start guide

---

:::tip Key Takeaway
FCM = Traditional Lending + Automation + Yield Generation + Liquidation Protection

It's not just "another lending protocol" - it's a complete yield-generating system with automated risk management.
:::
