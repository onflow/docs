---
sidebar_position: 20
sidebar_label: Fork Testing
title: Fork Testing with Cadence
description: Run your Cadence test suite against a forked mainnet or testnet using flow test --fork. Test against real contracts and production data without deploying to live networks.
keywords:
  - fork testing
  - flow test
  - cadence tests
  - mainnet fork
  - testnet fork
  - integration testing
  - Flow CLI
  - account impersonation
  - production testing
---

# Fork Testing with Cadence

This tutorial teaches you how to run your Cadence tests against a snapshot of Flow mainnet using `flow test --fork`. You'll learn how to test your contracts against real deployed contracts and production data without needing to deploy anything to a live network or bootstrap test accounts.

Fork testing bridges the gap between isolated local unit tests and testnet deployments. It enables you to validate your contracts work correctly with real on-chain state, test integrations with deployed contracts, and debug issues using historical blockchain data—all in a safe, local environment.

## What You'll Learn

After completing this tutorial, you'll be able to:

- **Run Cadence tests against forked networks** using `flow test --fork`
- **Test contracts that depend on real mainnet contracts** without manual setup
- **Use account impersonation** to execute transactions as any mainnet account
- **Read from production blockchain state** in your test suite
- **Pin tests to specific block heights** for historical debugging
- **Integrate fork testing** into your development workflow

## What You'll Build

You'll create a complete fork testing setup that demonstrates:

- Reading from the live FlowToken contract on mainnet
- Deploying your own contract that interacts with mainnet contracts
- Testing custom logic against real account balances and state
- Executing transactions using impersonated mainnet accounts
- A reusable pattern for integration testing your Flow applications

**Time Commitment:** Approximately 30 minutes

### Reproducibility first

Pin a specific block height when you need reproducible results:

```zsh
flow test --fork mainnet --fork-height <BLOCK_HEIGHT>
```

Document the pin heights you rely on (for example in CI variables or a simple file in the repo) and update them via a dedicated freshness PR. For best results, keep a per‑spork stable pin and also run a "latest" freshness job.

## Prerequisites

### Flow CLI

This tutorial requires [Flow CLI] v1.8.0 or later installed. If you haven't installed it yet and have [homebrew] installed, run:

```bash
brew install flow-cli
```

For other operating systems, refer to the [installation guide].

### Basic Cadence Testing Knowledge

You should be familiar with writing basic Cadence tests. If you're new to Cadence testing, start with [Testing Smart Contracts] first.

### Network Access

You'll need network access to Flow's public access nodes. The tutorial uses these endpoints, which are freely available:

- Mainnet: `access.mainnet.nodes.onflow.org:9000`
- Testnet: `access.devnet.nodes.onflow.org:9000`

:::info

This tutorial covers `flow test --fork` (running tests against forked network state), which is different from `flow emulator --fork` (starting the emulator in fork mode for manual interaction).

:::

## Create Your Project

Navigate to your development directory and create a new Flow project:

```zsh
mkdir fork-testing-demo
cd fork-testing-demo
flow init --yes
```

The `--yes` flag accepts defaults non-interactively. `flow init` is interactive by default and can scaffold various templates.

Alternatively, create the directory and initialize in one command:

```zsh
flow init fork-testing-demo --yes
cd fork-testing-demo
```

## Install Dependencies

Use the [Dependency Manager] to install the `FlowToken` and `FungibleToken` contracts:

```zsh
flow dependencies install FlowToken FungibleToken
```

This downloads the contracts and their dependencies into the `imports/` folder and updates your `flow.json` with the correct addresses and aliases across all networks (mainnet, testnet, emulator).

Your `flow.json` will now include an entry like:

```json
{
  "dependencies": {
    "FlowToken": {
      "source": "mainnet://1654653399040a61.FlowToken",
      "aliases": {
        "emulator": "0ae53cb6e3f42a79",
        "mainnet": "1654653399040a61",
        "testnet": "7e60df042a9c0868"
      }
    }
  }
}
```

Your `flow.json` should now have the mainnet and testnet networks configured from `flow init`. In fork mode, contract imports automatically resolve to the correct network addresses.

## Test Reading Live State

Create the test directories:

```zsh
mkdir -p tests cadence/scripts
```

First, create a script to read FlowToken supply. Create `cadence/scripts/GetFlowTokenSupply.cdc`:

```cadence cadence/scripts/GetFlowTokenSupply.cdc
import "FlowToken"

access(all) fun main(): UFix64 {
    return FlowToken.totalSupply
}
```

Now create the test file `tests/flow_token_test.cdc`:

```cadence tests/flow_token_test.cdc
import Test

access(all) fun testFlowTokenSupplyIsPositive() {
    let scriptResult = Test.executeScript(
        Test.readFile("cadence/scripts/GetFlowTokenSupply.cdc"),
        []
    )
    
    Test.expect(scriptResult, Test.beSucceeded())
    
    let supply = scriptResult.returnValue! as! UFix64
    Test.assert(supply > 0.0, message: "FlowToken supply should be positive")
}
```

Notes:
- Use `Test.executeScript()` to read contract state
- The script imports `FlowToken` by name - the dependency manager handles address resolution
- In fork mode, this automatically uses the mainnet FlowToken contract
- Extract the return value with proper type casting and assert on it

#### Quick verify

Run just this test file against a fork to confirm your setup works:

```zsh
flow test tests/flow_token_test.cdc --fork
```

Target testnet instead:

```zsh
flow test tests/flow_token_test.cdc --fork testnet
```

You should see the test PASS. If not, verify your network host in `flow.json` and that dependencies are installed.

## Deploy and Test Your Contract

Now you'll create a contract that depends on FlowToken and test it against the forked mainnet state—no need to bootstrap tokens or set up test accounts.

### Create a Test Account

Create a mainnet account for testing:

```zsh
flow accounts create
```

When prompted, select `mainnet` as the network. This will generate a new account and save the private key to a `.pkey` file. Note the account address (e.g., `0xf8d6e0586b0a20c7`).

### Create a Contract that Uses FlowToken

Generate a new contract:

```zsh
flow generate contract TokenChecker
```

This creates `cadence/contracts/TokenChecker.cdc` and adds it to `flow.json`. Now update the contract with your logic:

```cadence cadence/contracts/TokenChecker.cdc
import "FlowToken"

access(all) contract TokenChecker {
    
    access(all) fun checkBalance(address: Address): UFix64 {
        let account = getAccount(address)
        
        let vaultRef = account.capabilities
            .borrow<&FlowToken.Vault>(/public/flowTokenBalance)
            ?? panic("Could not borrow FlowToken Vault reference")
        
        return vaultRef.balance
    }
    
    access(all) fun hasMinimumBalance(address: Address, minimum: UFix64): Bool {
        return self.checkBalance(address: address) >= minimum
    }
}
```

### Configure Contract Deployment

Add the deployment configuration to `flow.json`. The account you created in the previous step is already present under `accounts`; reference it here:

```json
{
  "contracts": {
    "TokenChecker": {
      "source": "cadence/contracts/TokenChecker.cdc"
    }
  },
  "deployments": {
    "mainnet": {
      "mainnet-account": ["TokenChecker"]
    }
  },
  "accounts": {
    "mainnet-account": {
      "address": "<from previous step>",
      "key": "<from previous step>"
    }
  }
}
```

This configuration tells the test framework to deploy `TokenChecker` to your mainnet account when running fork tests.

### Create Scripts for Testing

Create `cadence/scripts/CheckBalance.cdc`:

```cadence cadence/scripts/CheckBalance.cdc
import "TokenChecker"

access(all) fun main(addr: Address): UFix64 {
    return TokenChecker.checkBalance(address: addr)
}
```

Create `cadence/scripts/HasMinimumBalance.cdc`:

```cadence cadence/scripts/HasMinimumBalance.cdc
import "TokenChecker"

access(all) fun main(addr: Address, min: UFix64): Bool {
    return TokenChecker.hasMinimumBalance(address: addr, minimum: min)
}
```

### Test Your Contract with Forked State

Create `tests/token_checker_test.cdc`:

```cadence tests/token_checker_test.cdc
import Test

access(all) fun setup() {
    // Deploy TokenChecker to the test account
    let err = Test.deployContract(
        name: "TokenChecker",
        path: "cadence/contracts/TokenChecker.cdc",
        arguments: []
    )
    Test.expect(err, Test.beNil())
}

access(all) fun testCheckBalanceOnRealAccount() {
    // Test against a real mainnet account (Flow service account)
    let scriptResult = Test.executeScript(
        Test.readFile("cadence/scripts/CheckBalance.cdc"),
        [0x1654653399040a61]  // Flow service account on mainnet
    )
    
    Test.expect(scriptResult, Test.beSucceeded())
    
    let balance = scriptResult.returnValue! as! UFix64
    // The Flow service account should have a balance
    Test.assert(balance > 0.0, message: "Service account should have FLOW tokens")
}

access(all) fun testHasMinimumBalance() {
    let scriptResult = Test.executeScript(
        Test.readFile("cadence/scripts/HasMinimumBalance.cdc"),
        [0x1654653399040a61, 1000.0]
    )
    
    Test.expect(scriptResult, Test.beSucceeded())
    
    let hasMinimum = scriptResult.returnValue! as! Bool
    Test.assert(hasMinimum == true, message: "Service account should have at least 1000 FLOW")
}
```

### What's Happening Here

1. **Your contract uses FlowToken**: `TokenChecker` imports and interacts with the real FlowToken contract
2. **No bootstrapping needed**: When you run with `--fork`, real mainnet accounts (like `0x1654653399040a61`, the Flow service account) already have balances
3. **Test against real state**: You can query actual accounts and verify your contract logic works with production data
4. **Local deployment**: Your `TokenChecker` contract is deployed locally to the test environment, but it reads from forked mainnet state

## Execute Transactions with Account Impersonation

Fork testing includes built-in account impersonation—you can execute transactions as **any mainnet account** without needing private keys. This lets you test interactions with real accounts and their existing state.

### Create Transactions

Create the transactions directory:

```zsh
mkdir -p cadence/transactions
```

First, create a transaction to set up a FlowToken vault. Create `cadence/transactions/SetupFlowTokenVault.cdc`:

```cadence cadence/transactions/SetupFlowTokenVault.cdc
import "FungibleToken"
import "FlowToken"

transaction {
    prepare(signer: &Account) {
        if signer.storage.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) == nil {
            signer.storage.save(<-FlowToken.createEmptyVault(vaultType: Type<@FlowToken.Vault>()), to: /storage/flowTokenVault)
            let cap = signer.capabilities.storage.issue<&FlowToken.Vault>(/storage/flowTokenVault)
            signer.capabilities.publish(cap, at: /public/flowTokenReceiver)
            signer.capabilities.publish(cap, at: /public/flowTokenBalance)
        }
    }
}
```

Now create the transfer transaction. Create `cadence/transactions/TransferTokens.cdc`:

```cadence cadence/transactions/TransferTokens.cdc
import "FungibleToken"
import "FlowToken"

transaction(amount: UFix64, to: Address) {
    let sentVault: @{FungibleToken.Vault}

    prepare(signer: &Account) {
        let vaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
            from: /storage/flowTokenVault
        ) ?? panic("Could not borrow reference to the owner's Vault")

        self.sentVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        let recipient = getAccount(to)
        let receiverRef = recipient.capabilities
            .borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            ?? panic("Could not borrow receiver reference")

        receiverRef.deposit(from: <-self.sentVault)
    }
}
```

### Test Transaction Execution with Impersonation

Add this test function to the existing `tests/token_checker_test.cdc` file:

```cadence
access(all) fun testTransactionAsMainnetAccount() {
    // Impersonate the Flow service account (or any mainnet account)
    // No private keys needed - fork testing has built-in impersonation
    let serviceAccount = Test.getAccount(0x1654653399040a61)
    
    // Check initial balance
    let initialBalanceScript = Test.executeScript(
        Test.readFile("cadence/scripts/CheckBalance.cdc"),
        [serviceAccount.address]
    )
    Test.expect(initialBalanceScript, Test.beSucceeded())
    let initialBalance = initialBalanceScript.returnValue! as! UFix64
    
    // Create a test recipient account and set up FlowToken vault
    let recipient = Test.createAccount()
    
    // Set up the recipient's FlowToken vault
    let setupResult = Test.executeTransaction(
        Test.Transaction(
            code: Test.readFile("cadence/transactions/SetupFlowTokenVault.cdc"),
            authorizers: [recipient.address],
            signers: [recipient],
            arguments: []
        )
    )
    Test.expect(setupResult, Test.beSucceeded())
    
    // Execute transaction AS the mainnet service account
    // This works because fork testing allows impersonating any account
    let txResult = Test.executeTransaction(
        Test.Transaction(
            code: Test.readFile("cadence/transactions/TransferTokens.cdc"),
            authorizers: [serviceAccount.address],
            signers: [serviceAccount],
            arguments: [10.0, recipient.address]
        )
    )
    
    Test.expect(txResult, Test.beSucceeded())
    
    // Verify the sender's balance decreased
    let newBalanceScript = Test.executeScript(
        Test.readFile("cadence/scripts/CheckBalance.cdc"),
        [serviceAccount.address]
    )
    Test.expect(newBalanceScript, Test.beSucceeded())
    let newBalance = newBalanceScript.returnValue! as! UFix64
    
    // Balance should have decreased by exactly the transfer amount
    Test.assertEqual(initialBalance - 10.0, newBalance)
    
    // Verify the recipient received the tokens
    let recipientBalanceScript = Test.executeScript(
        Test.readFile("cadence/scripts/CheckBalance.cdc"),
        [recipient.address]
    )
    Test.expect(recipientBalanceScript, Test.beSucceeded())
    let recipientBalance = recipientBalanceScript.returnValue! as! UFix64
    Test.assertEqual(10.0, recipientBalance)
}
```

### Key Points About Account Impersonation

1. **Any account can be used**: Call `Test.getAccount(address)` with any mainnet address
2. **No private keys needed**: Fork testing has built-in impersonation—you can sign transactions as any account
3. **Real account state**: The account has its actual mainnet balance, storage, and capabilities
4. **Mutations are local**: Changes only affect your test environment, not the real network
5. **Test complex scenarios**: Impersonate whale accounts, protocol accounts, or any user to test edge cases

## Run All Tests Together

Now that you have multiple test files, run them all against the forked network:

```zsh
flow test --fork
```

This runs all `*_test.cdc` files in your project against mainnet by default. You should see:

```
Test results: "tests/flow_token_test.cdc"
- PASS: testFlowTokenSupplyIsPositive

Test results: "tests/token_checker_test.cdc"
- PASS: testCheckBalanceOnRealAccount
- PASS: testHasMinimumBalance
- PASS: testTransactionAsMainnetAccount
```

### Additional Options

You can also fork from testnet (`flow test --fork testnet`) or pin to a specific block height (`--fork-height`). See the [Fork Testing Flags] reference for all available options.

See also:

- High-Level Testing Strategy: [Testing Strategy on Flow](../../../build/cadence/smart-contracts/testing-strategy.md)
- Emulator (fork mode for interactive E2E): [Flow Emulator](../../../build/tools/emulator/index.md)
- Networks and access nodes: [Flow Networks](../../../protocol/flow-networks/index.md)

::::info
External oracles and off-chain systems

Fork tests run against Flow chain state only:
- No live off-chain/API calls or cross-chain reads
- Price feeds, bridges, indexers, and similar must be mocked (stub contracts or fixtures)
- For end-to-end, combine with `flow emulator --fork` and a local stub service
::::

### Select tests quickly

- Run specific files or directories:

```zsh
flow test tests/flow_token_test.cdc tests/token_checker_test.cdc tests/subsuite/
```

- Optional: narrow by function name with `--name`:

```zsh
flow test tests/token_checker_test.cdc --name _smoke
```

- Optional: suffix a few functions with `_smoke` for quick PR runs; run the full suite nightly or on protected branches.

## When to Use Fork Testing

Fork testing is most valuable for:

- Integration testing with real onchain contracts and data
- Pre-deployment validation before mainnet releases
- Upgrade testing against production state
- Reproducing issues at a specific block height
- Testing interactions with high-value or protocol accounts
- Validating contract behavior with real-world data patterns

For strategy, limitations, and best practices, see the guide: [Testing Smart Contracts].

## Conclusion

In this tutorial, you learned how to use fork testing to validate your Cadence contracts against live Flow network state. You created tests that read from real mainnet contracts, deployed custom contracts that interact with production data, and executed transactions using account impersonation—all without deploying to a live network or bootstrapping test accounts.

Now that you have completed this tutorial, you should be able to:

- **Run Cadence tests against forked networks** using `flow test --fork`
- **Test contracts that depend on real mainnet contracts** without manual setup
- **Use account impersonation** to execute transactions as any mainnet account
- **Read from production blockchain state** in your test suite
- **Pin tests to specific block heights** for historical debugging
- **Integrate fork testing** into your development workflow

Fork testing bridges the gap between local unit tests and testnet deployments, enabling you to catch integration issues early and test against real-world conditions. Use it as part of your pre-deployment validation process, alongside emulator unit tests for determinism and isolation, and testnet deployments for final verification.

### Next Steps

- Explore additional assertions and helpers in the [Cadence Testing Framework]
- Add more real-world tests that read from standard contracts like Flow NFT
- Keep unit tests on the emulator for determinism and isolation; run forked integration tests selectively in CI
- Review the [Fork Testing Flags] reference for advanced options
- Learn about [Flow Networks] and public access nodes

<!-- Reference-style links -->

[Flow CLI]: ../../../build/tools/flow-cli/index.md
[homebrew]: https://brew.sh
[installation guide]: ../../../build/tools/flow-cli/install.md
[Testing Smart Contracts]: ../../../build/cadence/smart-contracts/testing.md
[Dependency Manager]: ../../../build/tools/flow-cli/dependency-manager.md
[Fork Testing Flags]: ../../../build/tools/flow-cli/tests.md#fork-testing-flags
[Cadence Testing Framework]: https://cadence-lang.org/docs/testing-framework
[Flow Networks]: ../../../protocol/flow-networks/index.md


