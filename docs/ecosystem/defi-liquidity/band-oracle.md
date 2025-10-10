---
id: band-oracle
title: Band Oracle on Flow
description: Band Protocol provides decentralized oracle services on Flow, delivering real-time price feeds and data for DeFi applications.
keywords:
  - Band Oracle
  - Band Protocol
  - oracle
  - price feeds
  - data feeds
  - DeFi
  - Flow blockchain
  - Flow Cadence
  - smart contracts
sidebar_position: 6
sidebar_label: Band Oracle
---

# Band Oracle with Cadence

The Band Protocol Oracle contract enables Flow blockchain applications to access real-time price data from the [Band Protocol Oracle network](https://faq.bandprotocol.com/). The oracle provides a comprehensive set of cryptocurrency and fiat currency price quotes from the Band Standard Dataset, making them available to any Cadence application, contract, or transaction.

## Contract Addresses

| Network | Address | Contract Browser |
|---------|---------|------------------|
| Testnet | `0x2c71de7af78d1adf` | [View Contract](https://contractbrowser.com/A.2c71de7af78d1adf.BandOracle) |
| Mainnet | `0x9fb6606c300b5051` | [View Contract](https://contractbrowser.com/A.9fb6606c300b5051.BandOracle) |

## Supported Symbols

### Cryptocurrency Pairs (against USD)
- **Major**: ETH, FLOW, USDC, USDT, WBTC, BNB, XRP, ADA, DOGE, POL (MATIC)
- **Layer 1**: SOL, DOT, AVAX, ATOM, XLM, TRX, SUI
- **DeFi**: AAVE, LINK, CRV, OP, UNI, SUSHI, CAKE, DYDX, 1INCH, BAT
- **Others**: LTC, SHIB, DAI, FTM

### Fiat Currency Pairs (against USD)
- **Asian**: KRW, INR, HKD, TWD, THB, JPY, MYR, PHP, CNY, SGD
- **European**: PLN, CZK, EUR, GBP, CHF, RUB, SEK, TRY
- **Americas**: BRL, CAD
- **Oceanic**: AUD, NZD

## How It Works

### Architecture

The Band Oracle contract maintains a decentralized price feed system with three key components:

1. **Data Storage**: Price data is stored in a contract-level dictionary `symbolsRefData: {String: RefData}` where each symbol maps to its latest price information.

2. **Data Updates**: Authorized BandChain relayers continuously update price data from the Band Protocol network to keep prices current.

3. **Data Access**: Any user or contract can query the latest price data through public functions, enabling real-time price integrations.

### Data Structure

Price data is stored using the `RefData` struct:

```cadence
pub struct RefData {
    // USD-rate, multiplied by 1e9
    pub var rate: UInt64
    // UNIX epoch when data was last resolved
    pub var timestamp: UInt64
    // BandChain request identifier for this data
    pub var requestID: UInt64
}
```

When querying prices, you receive a `ReferenceData` struct:

```cadence
pub struct ReferenceData {
    // Rate as integer multiplied by 1e18
    pub var integerE18Rate: UInt256
    // Rate as a fixed-point decimal
    pub var fixedPointRate: UFix64
    // Timestamp of base symbol data
    pub var baseTimestamp: UInt64
    // Timestamp of quote symbol data
    pub var quoteTimestamp: UInt64
}
```

### Data Normalization

All price data is stored with a USD conversion rate. When you query for price conversions between two non-USD symbols, the contract derives the rate from their respective USD rates. For example, to get ETH/EUR, the contract calculates: `(ETH/USD) / (EUR/USD)`.

## Features

### Price Queries
- Query any supported symbol pair in real-time
- Get both integer (e18 precision) and fixed-point decimal rates
- Access timestamp information to verify data freshness
- Track BandChain request IDs for transparency

### Fee Structure
- Configurable fee system for oracle usage (currently set to zero)
- Fee collected in FLOW tokens
- Query current fee using `BandOracle.getFee()`

### Event Monitoring
The contract emits events to notify applications of updates:

```cadence
// Emitted when symbol prices are updated
pub event BandOracleSymbolsUpdated(
    symbols: [String],
    relayerID: UInt64,
    requestID: UInt64
)

// Emitted when a symbol is removed
pub event BandOracleSymbolRemoved(symbol: String)
```

## Usage Guide

### Basic Price Query (Transaction)

To query price data from a transaction:

```cadence
import "BandOracle"
import "FlowToken"
import "FungibleToken"

transaction(baseSymbol: String, quoteSymbol: String) {

    let payment: @{FungibleToken.Vault}

    prepare(acct: auth(BorrowValue) &Account) {
        // Borrow reference to user's FLOW vault
        let vaultRef = acct.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
            from: /storage/flowTokenVault
        ) ?? panic("Cannot borrow reference to signer's FLOW vault")

        // Withdraw payment for oracle fee
        self.payment <- vaultRef.withdraw(amount: BandOracle.getFee())
    }

    execute {
        // Get reference data
        let priceData = BandOracle.getReferenceData(
            baseSymbol: baseSymbol,
            quoteSymbol: quoteSymbol,
            payment: <- self.payment
        )

        log("Rate (fixed-point): ".concat(priceData.fixedPointRate.toString()))
        log("Rate (integer e18): ".concat(priceData.integerE18Rate.toString()))
        log("Base timestamp: ".concat(priceData.baseTimestamp.toString()))
        log("Quote timestamp: ".concat(priceData.quoteTimestamp.toString()))
    }
}
```

### Example: ETH/USD Price
```cadence
// Get ETH price in USD
let priceData = BandOracle.getReferenceData(
    baseSymbol: "ETH",
    quoteSymbol: "USD",
    payment: <- flowPayment
)
// priceData.fixedPointRate contains ETH price in USD
```

### Example: Cross-Currency Conversion
```cadence
// Get EUR price in JPY
let priceData = BandOracle.getReferenceData(
    baseSymbol: "EUR",
    quoteSymbol: "JPY",
    payment: <- flowPayment
)
// priceData.fixedPointRate contains EUR/JPY exchange rate
```

### Contract Integration

Here's how to integrate the oracle into your smart contract:

```cadence
import "BandOracle"
import "FlowToken"
import "FungibleToken"

pub contract MyDeFiContract {

    // Store a vault to pay for oracle fees
    access(self) let oracleFeeVault: @{FungibleToken.Vault}

    pub fun getTokenPriceInUSD(tokenSymbol: String): UFix64 {
        // Withdraw payment for oracle
        let payment <- self.oracleFeeVault.withdraw(
            amount: BandOracle.getFee()
        )

        // Query the oracle
        let priceData = BandOracle.getReferenceData(
            baseSymbol: tokenSymbol,
            quoteSymbol: "USD",
            payment: <- payment
        )

        return priceData.fixedPointRate
    }

    pub fun swapTokens(amount: UFix64, maxPrice: UFix64) {
        // Get current price
        let currentPrice = self.getTokenPriceInUSD(tokenSymbol: "ETH")

        // Verify price is acceptable
        if currentPrice > maxPrice {
            panic("Price too high")
        }

        // Proceed with swap logic...
    }

    init() {
        // Initialize vault for oracle fees
        self.oracleFeeVault <- FlowToken.createEmptyVault(
            vaultType: Type<@FlowToken.Vault>()
        )
    }
}
```

## Best Practices

### 1. Listen for Price Updates

Monitor the `BandOracleSymbolsUpdated` event to keep your contract's stored prices up-to-date:

```cadence
// Listen for this event in your application
pub event BandOracleSymbolsUpdated(
    symbols: [String],
    relayerID: UInt64,
    requestID: UInt64
)
```

When you detect an update for symbols your dapp uses, trigger a transaction to refresh your stored prices.


## Advanced Features

### Converting Between Number Formats

The contract provides a utility function to convert between integer and fixed-point representations:

```cadence
// Convert e18 integer to fixed-point decimal
let fixedPoint = BandOracle.e18ToFixedPoint(rate: integerE18Rate)
```

### Fee Management

For contract administrators, the oracle supports dynamic fee configuration:

```cadence
// Query current fee
let currentFee = BandOracle.getFee()

// Fee can be updated by the fee collector (admin only)
// feeCollector.setFee(fee: 0.001) // 0.001 FLOW per query
```

## Resources

- [Band Protocol FAQ](https://faq.bandprotocol.com/)
- [Band Standard Dataset](https://data.bandprotocol.com/)
- [Flow Documentation](https://docs.onflow.org/)
- [Cadence Language Reference](https://cadence-lang.org/)

## Support

For issues or questions about the Band Oracle on Flow:
- Check the Band Protocol documentation
- Engage with the Flow developer community

---

**Note**: The oracle currently charges no fees for usage, but this may change in the future. Always check `BandOracle.getFee()` before querying to ensure your contract has sufficient FLOW tokens allocated.
