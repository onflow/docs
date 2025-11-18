---
title: High-Precision Fixed-Point Math
description: Learn about Flow's high-precision mathematical utilities for DeFi applications using UInt128-based 24-decimal fixed-point arithmetic for accurate financial calculations.
sidebar_position: 3
keywords:
  - DeFi math
  - fixed-point arithmetic
  - UInt128
  - high precision
  - financial calculations
  - rounding modes
  - math utilities
  - UFix64 conversion
  - DeFi Actions
  - price calculations
sidebar_label: DeFi Math Utils
---

# High-precision fixed-point 128 bit math 

Dealing with decimals is a notorious issue for most developers on other chains, especially when working with decentralized finance (DeFi). Blockchains are deterministic systems and floating-point arithmetic is non-deterministic across different compilers and architectures, which is why blockchains use fixed-point arithmetic via integers (scaling numbers by a fixed factor). 

The issue with this is that these fixed-point integers tend to be very imprecise when using various mathematical operations on them. The more operations you apply to these numbers, the more imprecise these numbers become. However [`DeFiActionsMathUtils`] provides a standardized library for high-precision mathematical operations in DeFi applications on Flow. The contract extends Cadence's native 8-decimal precision (`UFix64`) to 24 decimals using `UInt128` for intermediate calculations, ensuring accuracy in complex financial computations while maintaining deterministic results across the network.

Through integration of this math utility library, developers can ensure that their DeFi protocols perform precise calculations for liquidity pools, yield farming, token swaps, and other financial operations without accumulating rounding errors.

:::info

While this document focuses on DeFi use cases, you can use these mathematical utilities for any application requiring high-precision decimal arithmetic beyond the native 8-decimal limitation of `UFix64`.

:::

## The precision problem

DeFi applications often require multiple sequential calculations, and each operation can introduce rounding errors. When these errors compound over multiple operations, they can lead to:

- Price manipulation vulnerabilities
- Incorrect liquidity calculations
- Unfair token distributions
- Arbitrage opportunities from precision loss

Consider a simple example:

```cadence
// Native UFix64 with 8 decimals
let price: UFix64 = 1.23456789 // Actually stored as 1.23456789
let amount: UFix64 = 1000000.0
let fee: UFix64 = 0.003 // 0.3%

// Multiple operations compound rounding errors
let afterFee = amount * (1.0 - fee)     // Some precision lost
let output = afterFee * price            // More precision lost
let finalAmount = output / someRatio     // Even more precision lost
```

After three-to-four sequential operations, significant cumulative rounding errors can occur, especially when dealing with large amounts. Assuming a rounding error with eight decimals (1.234567885 rounds up to 1.23456789, causing a rounding error of 0.000000005), then after 100 operations with this error and dealing with one million dollars USDF, the protocol loses $0.5 in revenue from this lack of precision. This might not seem like a lot, but if we consider the TVL of Aave, which is around 40 billion USD, then that loss results in $20,000 USD!

## The solution: 24-decimal precision

[`DeFiActionsMathUtils`] solves this with `UInt128` to represent fixed-point numbers with 24 decimal places (scaling factor of 10^24). This provides 16 additional decimal places for intermediate calculations, dramatically reducing precision loss.

:::warning

There is still some precision loss occurring, but it is much smaller than with eight decimals.

:::

### The three-tier precision system

The contract implements a precision sandwich pattern:

1. **Input Layer**: `UFix64` (8 decimals) - User-facing values
2. **Processing Layer**: `UInt128` (24 decimals) - Internal calculations
3. **Output Layer**: `UFix64` (8 decimals) - Final results with smart rounding

```cadence
// Import the contract
import DeFiActionsMathUtils from 'ContractAddress'

// Convert UFix64 to high-precision UInt128
let inputAmount: UFix64 = 1000.12345678
let highPrecision = DeFiActionsMathUtils.toUInt128(inputAmount)
// highPrecision now represents 1000.123456780000000000000000 (24 decimals)

// Perform calculations at 24-decimal precision
let result = DeFiActionsMathUtils.mul(highPrecision, anotherValue)

// Convert back to UFix64 with rounding
let output = DeFiActionsMathUtils.toUFix64Round(result)
```

## Core constants

The contract defines several key constants:

```cadence
access(all) let e24: UInt128  // 10^24 = 1,000,000,000,000,000,000,000,000
access(all) let e8: UInt128   // 10^8 = 100,000,000
access(all) let decimals: UInt8 // 24
```

These constants ensure consistent scaling across all operations.

## Rounding modes

Smart rounding is the strategic selection of rounding strategies based on the financial context of your calculation. After performing high-precision calculations at 24 decimals, you must convert the final results back to `UFix64` (8 decimals). How you handle this conversion can protect your protocol from losses, ensure fairness to users, and reduce systematic bias.

[`DeFiActionsMathUtils`] provides four rounding modes, each optimized for specific financial scenarios:

```cadence
access(all) enum RoundingMode: UInt8 {
    /// Rounds down (floor) - use for payouts
    access(all) case RoundDown

    /// Rounds up (ceiling) - use for fees/liabilities
    access(all) case RoundUp

    /// Standard rounding: < 0.5 down, >= 0.5 up
    access(all) case RoundHalfUp

    /// Banker's rounding: ties round to even number
    access(all) case RoundEven
}
```

### When to use each mode

**RoundDown** - Choose this when you calculate user payouts, withdrawals, or rewards. When you round down, your protocol retains any fractional amounts, which protects against losses from accumulated rounding errors. This is the conservative choice when funds leave your protocol.

```cadence
// When you calculate how much to pay out to users
let userReward = DeFiActionsMathUtils.toUFix64RoundDown(calculatedReward)
```

**RoundUp** - Use this for protocol fees, transaction costs, or amounts owed to your protocol. Rounding up ensures your protocol collects slightly more, compensating for precision loss and preventing systematic under-collection of fees over many transactions.

```cadence
// When calculating fees the protocol collects
let protocolFee = DeFiActionsMathUtils.toUFix64RoundUp(calculatedFee)
```

**RoundHalfUp** - Apply this for general-purpose calculations, display values, or when presenting prices to users. This is the familiar rounding method (values 0.5 and above round up, below 0.5 round down) that users expect in traditional finance.

```cadence
// For display values or general calculations
let displayValue = DeFiActionsMathUtils.toUFix64Round(calculatedValue)
```

**RoundEven** - Select this for scenarios with many repeated calculations where you want to minimize systematic bias. Also known as "[banker's rounding]", this mode rounds ties (exactly 0.5) to the nearest even number, which statistically balances out over many operations, making it ideal for large-scale distributions or statistical calculations.

```cadence
// For repeated operations where bias matters
let unbiasedValue = DeFiActionsMathUtils.toUFix64(calculatedValue, DeFiActionsMathUtils.RoundingMode.RoundEven)
```

## Core functions

### Conversion functions

**Convert UFix64 to UInt128**

```cadence
access(all) view fun toUInt128(_ value: UFix64): UInt128
```

Converts a `UFix64` value to `UInt128` with 24-decimal precision.

**Example:**

```cadence
import DeFiActionsMathUtils from 'ContractAddress'

let price: UFix64 = 123.45678900
let highPrecisionPrice = DeFiActionsMathUtils.toUInt128(price)
// highPrecisionPrice = 123456789000000000000000000 (represents 123.45678900... with 24 decimals)
```

**Convert UInt128 to UFix64**

```cadence
access(all) view fun toUFix64(_ value: UInt128, _ roundingMode: RoundingMode): UFix64
access(all) view fun toUFix64Round(_ value: UInt128): UFix64
access(all) view fun toUFix64RoundDown(_ value: UInt128): UFix64
access(all) view fun toUFix64RoundUp(_ value: UInt128): UFix64
```

Converts a `UInt128` value back to `UFix64`, applying the specified rounding strategy.

**Example:**

```cadence
let highPrecisionValue: UInt128 = 1234567890123456789012345678
let roundedValue = DeFiActionsMathUtils.toUFix64Round(highPrecisionValue)
// roundedValue = 1234567.89012346 (rounded to 8 decimals using RoundHalfUp)

let flooredValue = DeFiActionsMathUtils.toUFix64RoundDown(highPrecisionValue)
// flooredValue = 1234567.89012345 (truncated to 8 decimals)

let ceilingValue = DeFiActionsMathUtils.toUFix64RoundUp(highPrecisionValue)
// ceilingValue = 1234567.89012346 (rounded up to 8 decimals)
```

## High-precision arithmetic

### Multiplication

```cadence
access(all) view fun mul(_ x: UInt128, _ y: UInt128): UInt128
```

Multiplies two 24-decimal fixed-point numbers, maintaining precision.

**Example:**

```cadence
let amount = DeFiActionsMathUtils.toUInt128(1000.0)
let price = DeFiActionsMathUtils.toUInt128(1.5)

let totalValue = DeFiActionsMathUtils.mul(amount, price)
let result = DeFiActionsMathUtils.toUFix64Round(totalValue)
// result = 1500.0
```

:::info

**Important:** The multiplication uses `UInt256` internally to prevent overflow:

:::

```cadence
// Internal implementation prevents overflow
return UInt128(UInt256(x) * UInt256(y) / UInt256(e24))
```

### Division

```cadence
access(all) view fun div(_ x: UInt128, _ y: UInt128): UInt128
```

Divides two 24-decimal fixed-point numbers, maintaining precision.

**Example:**

```cadence
let totalValue = DeFiActionsMathUtils.toUInt128(1500.0)
let shares = DeFiActionsMathUtils.toUInt128(3.0)

let pricePerShare = DeFiActionsMathUtils.div(totalValue, shares)
let result = DeFiActionsMathUtils.toUFix64Round(pricePerShare)
// result = 500.0
```

### UFix64 division with rounding

For convenience, the contract provides direct division functions that handle
conversion and rounding in one call:

```cadence
access(all) view fun divUFix64WithRounding(_ x: UFix64, _ y: UFix64): UFix64
access(all) view fun divUFix64WithRoundingUp(_ x: UFix64, _ y: UFix64): UFix64
access(all) view fun divUFix64WithRoundingDown(_ x: UFix64, _ y: UFix64): UFix64
```

**Example:**

```cadence
let totalAmount: UFix64 = 1000.0
let numberOfUsers: UFix64 = 3.0

// Standard rounding
let perUserStandard = DeFiActionsMathUtils.divUFix64WithRounding(totalAmount, numberOfUsers)
// perUserStandard = 333.33333333

// Round down (conservative for payouts)
let perUserSafe = DeFiActionsMathUtils.divUFix64WithRoundingDown(totalAmount, numberOfUsers)
// perUserSafe = 333.33333333

// Round up (conservative for fees)
let perUserFee = DeFiActionsMathUtils.divUFix64WithRoundingUp(totalAmount, numberOfUsers)
// perUserFee = 333.33333334
```

## Common DeFi use cases

### Liquidity pool pricing (constant product AMM)

Automated Market Makers (AMM) like Uniswap use the formula `x * y = k`. Here's how to calculate swap outputs with high precision:

```cadence
import DeFiActionsMathUtils from 'ContractAddress'
import FungibleToken from 'FungibleTokenAddress'

access(all) fun calculateSwapOutput(
    inputAmount: UFix64,
    inputReserve: UFix64,
    outputReserve: UFix64,
    feeBasisPoints: UFix64  // e.g., 30 for 0.3%
): UFix64 {
    // Convert to high precision
    let input = DeFiActionsMathUtils.toUInt128(inputAmount)
    let reserveIn = DeFiActionsMathUtils.toUInt128(inputReserve)
    let reserveOut = DeFiActionsMathUtils.toUInt128(outputReserve)
    let fee = DeFiActionsMathUtils.toUInt128(feeBasisPoints)
    let basisPoints = DeFiActionsMathUtils.toUInt128(10000.0)

    // Calculate: inputWithFee = inputAmount * (10000 - fee)
    let feeMultiplier = DeFiActionsMathUtils.div(
        basisPoints - fee,
        basisPoints
    )
    let inputWithFee = DeFiActionsMathUtils.mul(input, feeMultiplier)

    // Calculate: numerator = inputWithFee * outputReserve
    let numerator = DeFiActionsMathUtils.mul(inputWithFee, reserveOut)

    // Calculate: denominator = inputReserve + inputWithFee
    let denominator = reserveIn + inputWithFee

    // Calculate output: numerator / denominator
    let output = DeFiActionsMathUtils.div(numerator, denominator)

    // Return with conservative rounding (round down for user protection)
    return DeFiActionsMathUtils.toUFix64RoundDown(output)
}
```

### Compound interest calculations

Calculate compound interest for yield farming rewards:

```cadence
import DeFiActionsMathUtils from 0xYourAddress

access(all) fun calculateCompoundInterest(
    principal: UFix64,
    annualRate: UFix64,  // e.g., 0.05 for 5%
    periodsPerYear: UInt64,
    numberOfYears: UFix64
): UFix64 {
    // Convert to high precision
    let p = DeFiActionsMathUtils.toUInt128(principal)
    let r = DeFiActionsMathUtils.toUInt128(annualRate)
    let n = DeFiActionsMathUtils.toUInt128(UFix64(periodsPerYear))
    let t = DeFiActionsMathUtils.toUInt128(numberOfYears)
    let one = DeFiActionsMathUtils.toUInt128(1.0)

    // Calculate: rate per period = r / n
    let ratePerPeriod = DeFiActionsMathUtils.div(r, n)

    // Calculate: (1 + rate per period)
    let onePlusRate = one + ratePerPeriod

    // Calculate: number of periods = n * t
    let totalPeriods = DeFiActionsMathUtils.mul(n, t)

    // Note: For production, you'd need to implement a power function
    // This is simplified for demonstration

    // Calculate final amount with rounding
    return DeFiActionsMathUtils.toUFix64Round(finalAmount)
}
```

### Proportional distribution

Distribute rewards proportionally among stakeholders:

```cadence
import DeFiActionsMathUtils from 0xYourAddress

access(all) fun calculateProportionalShare(
    totalRewards: UFix64,
    userStake: UFix64,
    totalStaked: UFix64
): UFix64 {
    // Convert to high precision
    let rewards = DeFiActionsMathUtils.toUInt128(totalRewards)
    let stake = DeFiActionsMathUtils.toUInt128(userStake)
    let total = DeFiActionsMathUtils.toUInt128(totalStaked)

    // Calculate: (userStake / totalStaked) * totalRewards
    let proportion = DeFiActionsMathUtils.div(stake, total)
    let userReward = DeFiActionsMathUtils.mul(proportion, rewards)

    // Round down for conservative payout
    return DeFiActionsMathUtils.toUFix64RoundDown(userReward)
}
```

### Price impact calculation

Calculate the price impact of a large trade:

```cadence
import DeFiActionsMathUtils from 0xYourAddress

access(all) fun calculatePriceImpact(
    inputAmount: UFix64,
    inputReserve: UFix64,
    outputReserve: UFix64
): UFix64 {
    // Convert to high precision
    let input = DeFiActionsMathUtils.toUInt128(inputAmount)
    let reserveIn = DeFiActionsMathUtils.toUInt128(inputReserve)
    let reserveOut = DeFiActionsMathUtils.toUInt128(outputReserve)

    // Calculate initial price: outputReserve / inputReserve
    let initialPrice = DeFiActionsMathUtils.div(reserveOut, reserveIn)

    // Calculate new reserves after trade
    let newReserveIn = reserveIn + input
    let k = DeFiActionsMathUtils.mul(reserveIn, reserveOut)
    let newReserveOut = DeFiActionsMathUtils.div(k, newReserveIn)

    // Calculate final price: newOutputReserve / newInputReserve
    let finalPrice = DeFiActionsMathUtils.div(newReserveOut, newReserveIn)

    // Calculate impact: (initialPrice - finalPrice) / initialPrice
    let priceDiff = initialPrice - finalPrice
    let impact = DeFiActionsMathUtils.div(priceDiff, initialPrice)

    return DeFiActionsMathUtils.toUFix64Round(impact)
}
```

## Benefits of high-precision math

### Precision preservation

The 24-decimal precision provides headroom for complex calculations:

```cadence
// Chain multiple operations without significant precision loss
let step1 = DeFiActionsMathUtils.mul(valueA, valueB)
let step2 = DeFiActionsMathUtils.div(step1, valueC)
let step3 = DeFiActionsMathUtils.mul(step2, valueD)
let step4 = DeFiActionsMathUtils.div(step3, valueE)
// Still maintains 24 decimals of precision until final conversion
```

### Overflow protection

The contract uses `UInt256` for intermediate multiplication to prevent overflow:

```cadence
// Internal implementation protects against overflow
access(all) view fun mul(_ x: UInt128, _ y: UInt128): UInt128 {
    return UInt128(UInt256(x) * UInt256(y) / UInt256(self.e24))
}
```

And includes explicit bounds checking when converting to `UFix64`:

```cadence
access(all) view fun assertWithinUFix64Bounds(_ value: UInt128) {
    let MAX_1E24: UInt128 = 184_467_440_737_095_516_150_000_000_000_000_000
    assert(
        value <= MAX_1E24,
        message: "Value exceeds UFix64.max"
    )
}
```

## Best practices

Always Use High Precision for Intermediate Calculations.

**❌ Low precision (loses ~$0.50 per 1M USDC):**

```cadence
let fee: UFix64 = amount * 0.003
let afterFee: UFix64 = amount - fee
let output: UFix64 = afterFee * price
```

**✅ High precision (safe and accurate):**

```cadence
// Convert once at the start
let amountHP = DeFiActionsMathUtils.toUInt128(amount)
let feeRate = DeFiActionsMathUtils.toUInt128(0.003)
let priceHP = DeFiActionsMathUtils.toUInt128(price)

// Perform all calculations at high precision
let afterFeeHP = DeFiActionsMathUtils.mul(amountHP, DeFiActionsMathUtils.toUInt128(1.0) - feeRate)
let outputHP = DeFiActionsMathUtils.mul(afterFeeHP, priceHP)

// Convert once at the end with smart rounding
let output = DeFiActionsMathUtils.toUFix64RoundDown(outputHP)
```

The pattern is simple: **convert → calculate → convert back**. The extra lines give you production-grade precision that protects your protocol from financial losses.

Always validate that inputs are within acceptable ranges:

```cadence
access(all) fun swap(inputAmount: UFix64) {
    pre {
        inputAmount > 0.0: "Amount must be positive"
        inputAmount <= 1000000.0: "Amount exceeds maximum"
    }

    let inputHP = DeFiActionsMathUtils.toUInt128(inputAmount)
    // ... perform calculations
}
```

## More resources

- [View the DeFiActionsMathUtils source code]
- [Flow DeFi Actions Documentation]
- [Cadence Fixed-Point Numbers]

## Key takeaways

- Use high precision (24 decimals) for all intermediate calculations.
- Convert to `UFix64` only for final results.
- Choose appropriate rounding modes based on your use case.
- Always validate inputs and test edge cases.
- Document your rounding decisions for maintainability.

## Conclusion

[`DeFiActionsMathUtils`] gives Flow developers a significant advantage in building DeFi applications. With 24-decimal precision, it is much more accurate than typical blockchain implementations (which use 6-18 decimals). The standardized library eliminates the need to build custom math implementations.

The simple **convert → calculate → convert back** pattern, combined with strategic rounding modes and built-in overflow protection, means you can focus on your protocol's business logic instead of low-level precision handling. At scale, this protection prevents thousands of dollars in losses from accumulated rounding errors.

<!-- Relative links, will not render on page -->

[`DeFiActionsMathUtils`]: https://github.com/onflow/FlowActions/blob/main/cadence/contracts/utils/DeFiActionsMathUtils.cdc
[banker's rounding]: https://learn.microsoft.com/en-us/openspecs/microsoft_general_purpose_programming_languages/ms-vbal/98152b5a-4d86-4acb-b875-66cb1f49433e
[View the DeFiActionsMathUtils source code]: https://github.com/onflow/FlowActions/blob/main/cadence/contracts/utils/DeFiActionsMathUtils.cdc
[Flow DeFi Actions Documentation]: https://developers.flow.com/blockchain-development-tutorials/forte/flow-actions
[Cadence Fixed-Point Numbers]: https://cadence-lang.org/docs/language/values-and-types/fixed-point-nums-ints
