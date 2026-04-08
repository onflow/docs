---
title: Fork Testing
description: Test your Flow applications against production state using mainnet or testnet forks
sidebar_position: 15
---

# Fork Testing

Fork testing allows you to run tests and development environments against a **local copy of mainnet or testnet state**. This gives you access to real contracts, accounts, and data without deploying to live networks or affecting production state.

## What is Fork Testing?

Fork testing creates a local Flow network that mirrors the state of a real network (mainnet or testnet). Your code runs locally, but can read from and interact with production contract implementations, real account balances, and actual on-chain data.

**Key Benefits:**

- ✅ **Test against real production contracts** - No need to mock complex dependencies
- ✅ **Access real account state** - Test with actual balances, NFTs, and storage
- ✅ **Reproduce production issues** - Debug problems at specific block heights
- ✅ **Test contract upgrades safely** - Verify changes work with real mainnet state
- ✅ **Safe testing environment** - All changes stay local, never affect the real network
- ✅ **Fast iteration** - No deployment costs or wait times

Fork testing is an essential part of a comprehensive testing strategy. It complements unit tests and integration tests by letting you validate your contracts against real-world state and dependencies. Learn more about building a complete testing approach in the [Testing Strategy guide](../../../build/cadence/smart-contracts/testing-strategy.md).

## Two Fork Testing Modes

The Flow CLI provides two different fork testing modes for different use cases:

### 1. Emulator Fork Mode (`flow emulator --fork`)

**Best for:**

- Frontend and app development
- E2E testing (Cypress, Playwright)
- Manual testing and exploration
- Wallet integration testing
- Bot and indexer development

**How it works:**
Starts a full emulator with REST and gRPC APIs that you can connect to with FCL, dev wallet, or any Flow SDK.

```bash
flow emulator --fork mainnet
```

**Learn more:** [Interactive Testing with Forked Emulator](../../../blockchain-development-tutorials/cadence/emulator-fork-testing/index.md)

### 2. Test Framework Fork Mode (`flow test` + `#test_fork`)

**Best for:**

- Cadence integration tests
- Contract testing against real dependencies
- Testing contract logic with real mainnet state

**How it works:**
Runs your `*_test.cdc` files against a forked network using the [Cadence Testing Framework](../../../build/cadence/smart-contracts/testing.md). Add the `#test_fork` pragma to your test file, then run:

```bash
flow test
```

**Learn more:** [Fork Testing with Cadence](../../../blockchain-development-tutorials/cadence/fork-testing/index.md)

## Quick Comparison

| Feature         | `flow emulator --fork`                  | `flow test` + `#test_fork` |
| --------------- | --------------------------------------- | -------------------------- |
| **Use for**     | App E2E, manual testing, debugging      | Cadence integration tests  |
| **Connects to** | Frontend, wallets, bots, E2E tools      | Cadence Testing Framework  |
| **Run with**    | FCL, Cypress, Playwright, manual clicks | `flow test` command        |
| **Best for**    | User flows, UI testing, exploration     | Contract logic validation  |
| **Examples**    | React app, wallet flows, E2E suites     | `*_test.cdc` files         |

## Common Use Cases

### DeFi Protocol Testing

Test your DeFi contracts against real mainnet state - real DEX liquidity, real oracle prices, real token supplies.

### Contract Upgrade Testing

Deploy your upgraded contract to a fork and verify it works with real mainnet state before deploying to production.

### Bug Reproduction

Fork to the exact block height where a bug occurred and debug with the actual state that caused the issue.

### Integration Testing

Test how your contracts interact with production versions of core contracts (FungibleToken, NFT standards, etc).

## Getting Started

### Prerequisites

- [Flow CLI](./install.md) v2.12.0 or later
- Basic understanding of Flow development

### Quick Start: Emulator Fork

```bash
# 1. Initialize a Flow project
flow init

# 2. Install dependencies (e.g., FlowToken)
flow dependencies install FlowToken FungibleToken

# 3. Start the forked emulator
flow emulator --fork mainnet

# 4. In another terminal, run scripts/transactions
flow scripts execute myScript.cdc --network mainnet-fork
```

**Next steps:** Follow the [complete emulator fork tutorial](../../../blockchain-development-tutorials/cadence/emulator-fork-testing/index.md)

### Quick Start: Cadence Test Fork

Add the fork pragma to your test file:

```cadence
#test_fork(network: "mainnet", height: nil)

import Test

access(all) fun testExample() {
    // Your test code here
}
```

Then run the test:

```bash
flow test tests/MyContract_test.cdc
```

**Next steps:** Follow the [complete Cadence fork testing tutorial](../../../blockchain-development-tutorials/cadence/fork-testing/index.md)

## Key Features

### Pin to Block Heights

Fork to specific block heights for reproducible testing:

```bash
# Emulator fork with block height
flow emulator --fork mainnet --fork-height <BLOCK_HEIGHT>
```

```cadence
// Test with block height - add to your test file
#test_fork(network: "mainnet", height: <BLOCK_HEIGHT>)
```

```bash
# Then run the test
flow test test_file.cdc
```

Replace `<BLOCK_HEIGHT>` with the specific block number you want to test against. Note that block heights are only available within the current spork.

### Account Impersonation

Fork mode disables signature verification, allowing you to execute transactions as any mainnet account for testing.

### Dependency Mocking

Override specific mainnet contracts with your own versions while keeping all other contracts unchanged - perfect for testing contract upgrades.

### Automatic Configuration

Fork networks are automatically configured when you run fork commands. Contract aliases from the parent network (mainnet/testnet) are automatically inherited.

Learn more: [flow.json Configuration - Fork Networks](./flow.json/configuration.md#networks)

## Best Practices

1. **Pin block heights in CI/CD** - Ensures reproducible test results
2. **Test on testnet first** - Avoid mainnet rate limits during development
3. **Use the right mode** - Emulator fork for apps, test fork for Cadence contracts
4. **Mock external services** - Fork only mirrors Flow state, not external APIs
5. **Document your fork heights** - Keep track of which blocks work for testing

## Network Requirements

Fork testing requires network access to Flow's public access nodes:

- **Mainnet:** `access.mainnet.nodes.onflow.org:9000`
- **Testnet:** `access.devnet.nodes.onflow.org:9000`

Data is fetched on-demand and cached locally for performance.

## Limitations

- **Spork boundaries:** Historical data is only available within the current spork
- **Off-chain services:** Oracles, IPFS, and cross-chain bridges must be mocked
- **Network latency:** First access to accounts/contracts requires network fetch

Learn more: [Network Upgrade (Spork) Process](../../../protocol/node-ops/node-operation/network-upgrade.md)

## Tutorials

- [Interactive Testing with Forked Emulator](../../../blockchain-development-tutorials/cadence/emulator-fork-testing/index.md) - Complete guide to `flow emulator --fork`
- [Fork Testing with Cadence](../../../blockchain-development-tutorials/cadence/fork-testing/index.md) - Complete guide to `flow test` with `#test_fork`

## Related Documentation

- [Flow Emulator](../emulator/index.md) - Learn more about the Flow emulator
- [Cadence Testing Framework](../../../build/cadence/smart-contracts/testing.md) - Write and run Cadence tests
- [flow.json Configuration](./flow.json/configuration.md) - Configure fork networks
- [Testing Strategy](../../../build/cadence/smart-contracts/testing-strategy.md) - Overall testing approach
- [Dependency Manager](./dependency-manager.md) - Install and manage contract dependencies

## Need Help?

- Review the [complete tutorials](../../../blockchain-development-tutorials/cadence/emulator-fork-testing/index.md) for step-by-step guidance
- Check the [troubleshooting sections](../../../blockchain-development-tutorials/cadence/emulator-fork-testing/index.md#troubleshooting) in the tutorials
- Ask questions in the [Flow Discord](https://discord.gg/flow)
