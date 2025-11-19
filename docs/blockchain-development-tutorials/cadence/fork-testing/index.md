---
sidebar_position: 20
sidebar_label: Fork Testing
title: Fork Testing with Cadence
description: Run your Cadence test suite against a forked mainnet or testnet using fork testing. Test against real contracts and production data without deploying to live networks.
keywords:
  - fork testing
  - test_fork pragma
  - flow test
  - cadence tests
  - mainnet fork
  - testnet fork
  - integration testing
  - Flow CLI
  - account impersonation
  - production testing
  - real contracts
  - on-chain state
  - block height
  - historical debugging
  - reproducible tests
  - test deployment
  - FlowToken
  - FungibleToken
  - test scripts
  - test transactions
  - local testing
  - safe testing
  - forked runtime
---

# Fork testing with Cadence

This tutorial teaches you how to run your Cadence tests against a snapshot of Flow mainnet using `flow test` with the `#test_fork` pragma. You'll learn how to test your contracts against real deployed contracts and production data without needing to deploy anything to a live network or bootstrap test accounts.

Fork testing bridges the gap between isolated local unit tests and testnet deployments. It allows you to validate your contracts work correctly with real on-chain state, test integrations with deployed contracts, and debug issues with historical blockchain data—all in a safe, local environment.

## What You'll Learn

After you complete this tutorial, you'll be able to:

- **Run Cadence tests against forked networks** with `#test_fork`.
- **Test contracts that depend on real mainnet contracts** without manual setup.
- **Use account impersonation** to execute transactions as any mainnet account.
- **Read from production blockchain state** in your test suite.
- **Pin tests to specific block heights** for historical debugging.
- **Integrate fork testing** into your development workflow.

## What You'll Build

You'll create a complete fork testing setup that demonstrates:

- Reading from the live FlowToken contract on mainnet.
- Deploying your own contract that interacts with mainnet contracts.
- Testing custom logic against real account balances and state.
- Executing transactions using impersonated mainnet accounts.
- A reusable pattern for integration testing your Flow applications.

## Prerequisites

### Flow CLI

This tutorial requires [Flow CLI] v1.8.0 or later installed. If you haven't installed it yet and have [homebrew] installed, run:

```bash
brew install flow-cli
```

For other operating systems, refer to the [installation guide].

### Basic Cadence testing knowledge

You should be familiar with writing basic Cadence tests. If you're new to Cadence testing, start with [Testing Smart Contracts] first.

### Network access

You'll need network access to Flow's public access nodes. The tutorial uses these endpoints, which are freely available:

- Mainnet: `access.mainnet.nodes.onflow.org:9000`
- Testnet: `access.devnet.nodes.onflow.org:9000`

:::info

This tutorial covers fork testing with `flow test` (running tests against forked network state), which is different from `flow emulator --fork` (starting the emulator in fork mode for manual interaction).

:::

## Create your project

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

## Install dependencies

Use the [Dependency Manager] to install the `FlowToken` and `FungibleToken` contracts:

```zsh
flow dependencies install FlowToken FungibleToken
```

This downloads the contracts and their dependencies into the `imports/` folder and updates your `flow.json` with the correct addresses and aliases across all networks (mainnet, testnet, emulator).

Your `flow.json` now includes an entry like:

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

Your `flow.json` now has the mainnet and testnet networks configured from `flow init`. In fork mode, contract imports automatically resolve to the correct network addresses.

## Test Reading Live State

Generate a script to read `FlowToken` supply:

```zsh
flow generate script GetFlowTokenSupply
```

Open `cadence/scripts/GetFlowTokenSupply.cdc` and replace its contents with:

```cadence cadence/scripts/GetFlowTokenSupply.cdc
import "FlowToken"

access(all) fun main(): UFix64 {
    return FlowToken.totalSupply
}
```

Generate the test file:

```zsh
flow generate test FlowToken
```

Open `cadence/tests/FlowToken_test.cdc` and replace its contents with:

```cadence cadence/tests/FlowToken_test.cdc
#test_fork(network: "mainnet", height: nil)

import Test

access(all) fun testFlowTokenSupplyIsPositive() {
    let scriptResult = Test.executeScript(
        Test.readFile("../scripts/GetFlowTokenSupply.cdc"),
        []
    )

    Test.expect(scriptResult, Test.beSucceeded())

    let supply = scriptResult.returnValue! as! UFix64
    Test.assert(supply > 0.0, message: "FlowToken supply should be positive")
}
```

:::info

- **The `#test_fork` pragma** at the top configures this test to run against mainnet
- Use `Test.executeScript()` to read contract state
- The script imports `FlowToken` by name - the dependency manager handles address resolution
- In fork mode, this automatically uses the mainnet FlowToken contract
- Extract the return value with proper type casting and assert on it
- File paths in `Test.readFile()` are relative to the test file location (use `../scripts/` from `cadence/tests/`)

:::

#### Quick verify

Run just this test file to confirm your setup works:

```zsh
flow test cadence/tests/FlowToken_test.cdc
```

The pragma handles the fork configuration automatically! You will see the test PASS. If not, verify your network host in `flow.json` and that dependencies are installed.

**To test against testnet instead**, simply change the pragma in the test file:

```cadence
#test_fork(network: "testnet", height: nil)
```

## Deploy and Test Your Contract

Now you'll create a contract that depends on FlowToken and test it against the forked mainnet state—no need to bootstrap tokens or set up test accounts.

### Create a Test Account

Create a new account for deploying your contract:

```zsh
flow accounts create
```

Follow the prompts:

- Select "mainnet" for the network.
- Name your account as desired.

This will output the new account address. Use this address as the mainnet alias for your contract in flow.json.

:::note

This creates a local account with a mainnet-format address for fork testing. When you're ready to deploy to actual mainnet, you'll use this same account—see the [Deploying Contracts guide](pathname:///build/cadence/smart-contracts/deploying) for details.
:::

### Create a Contract that Uses `FlowToken`

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

### Configure contract in flow.json

Add the `TokenChecker` contract configuration to `flow.json`. The contract needs a **mainnet alias** so that imports can resolve properly during fork testing.

Update your `flow.json` to include the contract with aliases, and use the address you generated in the previous step:

```json
{
  "contracts": {
    "TokenChecker": {
      "source": "cadence/contracts/TokenChecker.cdc",
      "aliases": {
        "testing": "0000000000000008",
        "mainnet": "<from_previous_step>"
      }
    }
  },
  "accounts": {
    "mainnet-test": {
      "address": "<from_previous_step>"
    }
  }
}
```

:::info

No local private key is required for forked tests. The accounts entry above is included so you can copy and reference the address in your config. You can also omit keys for fork tests. Contracts deploy to the testing environment at `testing` alias, and transactions that interact with forked state can use impersonation. The `Test.deployContract` function will automatically deploy your contract to the testing environment during test execution.

:::

### Create scripts for testing

Generate the scripts:

```zsh
flow generate script CheckBalance
flow generate script HasMinimumBalance
```

Open `cadence/scripts/CheckBalance.cdc` and replace its contents with:

```cadence cadence/scripts/CheckBalance.cdc
import "TokenChecker"

access(all) fun main(addr: Address): UFix64 {
    return TokenChecker.checkBalance(address: addr)
}
```

Open `cadence/scripts/HasMinimumBalance.cdc` and replace its contents with:

```cadence cadence/scripts/HasMinimumBalance.cdc
import "TokenChecker"

access(all) fun main(addr: Address, min: UFix64): Bool {
    return TokenChecker.hasMinimumBalance(address: addr, minimum: min)
}
```

### Test Your contract with forked state

Generate the test file:

```zsh
flow generate test TokenChecker
```

Open `cadence/tests/TokenChecker_test.cdc` and replace its contents with:

```cadence cadence/tests/TokenChecker_test.cdc
#test_fork(network: "mainnet", height: nil)

import Test

access(all) fun setup() {
    // Deploy TokenChecker to the test account
    let err = Test.deployContract(
        name: "TokenChecker",
        path: "../contracts/TokenChecker.cdc",
        arguments: []
    )
    Test.expect(err, Test.beNil())
}

access(all) fun testCheckBalanceOnRealAccount() {
    // Test against a real mainnet account (Flow service account)
    let scriptResult = Test.executeScript(
        Test.readFile("../scripts/CheckBalance.cdc"),
        [Address(0x1654653399040a61)]  // Flow service account on mainnet
    )

    Test.expect(scriptResult, Test.beSucceeded())

    let balance = scriptResult.returnValue! as! UFix64
    // The Flow service account should have a balance
    Test.assert(balance > 0.0, message: "Service account should have FLOW tokens")
}

access(all) fun testHasMinimumBalance() {
    let scriptResult = Test.executeScript(
        Test.readFile("../scripts/HasMinimumBalance.cdc"),
        [Address(0x1654653399040a61), 1.0]
    )

    Test.expect(scriptResult, Test.beSucceeded())

    let hasMinimum = scriptResult.returnValue! as! Bool
    Test.assert(hasMinimum == true, message: "Service account should have at least 1 FLOW")
}
```

### What's happening here

1. **The `#test_fork` pragma configures the test**: At the top of the file, the pragma tells the test framework to run against mainnet.
2. **Your contract uses FlowToken**: `TokenChecker` imports and interacts with the real FlowToken contract.
3. **No bootstrapping needed**: With the fork pragma, real mainnet accounts (like `0x1654653399040a61`, the Flow service account) already have balances.
4. **Test against real state**: You can query actual accounts and verify your contract logic works with production data.
5. **Local deployment**: Your `TokenChecker` contract is deployed locally to the test environment, but it reads from forked mainnet state.

## Execute transactions with account impersonation

Fork testing includes built-in account impersonation—you can execute transactions as **any mainnet account** without needing private keys. This lets you test interactions with real accounts and their existing state.

### Create Transactions

Generate the transactions:

```zsh
flow generate transaction SetupFlowTokenVault
flow generate transaction TransferTokens
```

Open `cadence/transactions/SetupFlowTokenVault.cdc` and replace its contents with:

```cadence cadence/transactions/SetupFlowTokenVault.cdc
import "FungibleToken"
import "FlowToken"

transaction {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        if signer.storage.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) == nil {
            signer.storage.save(<-FlowToken.createEmptyVault(vaultType: Type<@FlowToken.Vault>()), to: /storage/flowTokenVault)
            let cap = signer.capabilities.storage.issue<&FlowToken.Vault>(/storage/flowTokenVault)
            signer.capabilities.publish(cap, at: /public/flowTokenReceiver)
            signer.capabilities.publish(cap, at: /public/flowTokenBalance)
        }
    }
}
```

Open `cadence/transactions/TransferTokens.cdc` and replace its contents with:

```cadence cadence/transactions/TransferTokens.cdc
import "FungibleToken"
import "FlowToken"

transaction(amount: UFix64, to: Address) {
    let sentVault: @{FungibleToken.Vault}

    prepare(signer: auth(Storage) &Account) {
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

### Test transaction execution with impersonation

Add this test function to the current `cadence/tests/TokenChecker_test.cdc` file (the pragma is already at the top of the file):

```cadence
access(all) fun testTransactionAsMainnetAccount() {
    // Impersonate the Flow service account (or any mainnet account)
    // No private keys needed - fork testing has built-in impersonation
    let serviceAccount = Test.getAccount(0x1654653399040a61)

    // Check initial balance
    let initialBalanceScript = Test.executeScript(
        Test.readFile("../scripts/CheckBalance.cdc"),
        [serviceAccount.address]
    )
    Test.expect(initialBalanceScript, Test.beSucceeded())
    let initialBalance = initialBalanceScript.returnValue! as! UFix64

    // Create a test recipient account and set up FlowToken vault
    let recipient = Test.createAccount()

    // Set up the recipient's FlowToken vault
    let setupResult = Test.executeTransaction(
        Test.Transaction(
            code: Test.readFile("../transactions/SetupFlowTokenVault.cdc"),
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
            code: Test.readFile("../transactions/TransferTokens.cdc"),
            authorizers: [serviceAccount.address],
            signers: [serviceAccount],
            arguments: [10.0, recipient.address]
        )
    )

    Test.expect(txResult, Test.beSucceeded())

    // Verify the sender's balance decreased
    let newBalanceScript = Test.executeScript(
        Test.readFile("../scripts/CheckBalance.cdc"),
        [serviceAccount.address]
    )
    Test.expect(newBalanceScript, Test.beSucceeded())
    let newBalance = newBalanceScript.returnValue! as! UFix64

    // Balance should have decreased by exactly the transfer amount
    Test.assertEqual(initialBalance - 10.0, newBalance)

    // Verify the recipient received the tokens
    let recipientBalanceScript = Test.executeScript(
        Test.readFile("../scripts/CheckBalance.cdc"),
        [recipient.address]
    )
    Test.expect(recipientBalanceScript, Test.beSucceeded())
    let recipientBalance = recipientBalanceScript.returnValue! as! UFix64
    // Recipient should have at least 10.0 (may be slightly more due to storage refunds)
    Test.assert(recipientBalance >= 10.0, message: "Recipient should have at least 10 FLOW")
}
```

### Key points about account impersonation

1. **Any account can be used**: Call `Test.getAccount(address)` with any mainnet address.
2. **No private keys needed**: Fork testing has built-in impersonation—you can sign transactions as any account.
3. **Real account state**: The account has its actual mainnet balance, storage, and capabilities.
4. **Mutations are local**: Changes only affect your test environment, not the real network.
5. **Test complex scenarios**: Impersonate whale accounts, protocol accounts, or any user to test edge cases.

## Run all tests together

Now that you have multiple test files with the `#test_fork` pragma, simply run:

```zsh
flow test
```

That's it! The pragma handles all the fork configuration. This runs all `*_test.cdc` files in your project—both local tests and fork tests together. You will see:

```
Test results: "cadence/tests/FlowToken_test.cdc"
- PASS: testFlowTokenSupplyIsPositive

Test results: "cadence/tests/TokenChecker_test.cdc"
- PASS: testCheckBalanceOnRealAccount
- PASS: testHasMinimumBalance
- PASS: testTransactionAsMainnetAccount
```

### Best Practices: In-File Configuration vs CLI Flags

**Recommended:** Configure fork tests in your test file with `#test_fork`

```cadence
#test_fork(network: "mainnet", height: nil)
import Test
// Your tests...
```

Then run with:

```bash
flow test
```

**Not recommended:** CLI flags (legacy approach)

```bash
flow test --fork mainnet  # Requires typing flags every time
```

Configuring fork tests in the file keeps the configuration with your test code, making tests self-documenting and easier to maintain.

You can also run specific test files or change the network/block height in the pragma as needed. See the [Fork Testing Flags] reference for more options.

## When to use fork testing

Fork testing is most valuable for:

- Integration testing with real onchain contracts and data.
- Pre-deployment validation before mainnet releases.
- Upgrade testing against production state.
- Reproducing issues at a specific block height.
- Testing interactions with high-value or protocol accounts.
- Validating contract behavior with real-world data patterns.

For strategy, limitations, and best practices, see the guide: [Testing Smart Contracts].

## Conclusion

In this tutorial, you learned how to use fork testing to validate your Cadence contracts against live Flow network state. You created tests that read from real mainnet contracts, deployed custom contracts that interact with production data, and executed transactions using account impersonation—all without deploying to a live network or bootstrapping test accounts.

Now that you have completed this tutorial, you can:

- **Run Cadence tests against forked networks** with `#test_fork`.
- **Test contracts that depend on real mainnet contracts** without manual setup.
- **Use account impersonation** to execute transactions as any mainnet account.
- **Read from production blockchain state** in your test suite.
- **Pin tests to specific block heights** for historical debugging.
- **Integrate fork testing** into your development workflow.

Fork testing bridges the gap between local unit tests and testnet deployments, allowing you to catch integration issues early and test against real-world conditions. Use it as part of your pre-deployment validation process, alongside emulator unit tests for determinism and isolation, and testnet deployments for final verification.

### Next Steps

- Explore additional assertions and helpers in the [Cadence Testing Framework].
- Add more real-world tests that read from standard contracts like Flow NFT.
- Keep unit tests on the emulator for determinism and isolation; run forked integration tests selectively in CI.
- Review the [Fork Testing Flags] reference for advanced options.
- Learn about [Flow Networks] and public access nodes.

<!-- Reference-style links -->

[Flow CLI]: ../../../build/tools/flow-cli/index.md
[homebrew]: https://brew.sh
[installation guide]: ../../../build/tools/flow-cli/install.md
[Testing Smart Contracts]: ../../../build/cadence/smart-contracts/testing-strategy.md
[Dependency Manager]: ../../../build/tools/flow-cli/dependency-manager.md
[Fork Testing Flags]: ../../../build/tools/flow-cli/tests.md#fork-testing-flags
[Cadence Testing Framework]: https://cadence-lang.org/docs/testing-framework
[Flow Networks]: ../../../protocol/flow-networks/index.md
[Testing Strategy on Flow]: ../../../build/cadence/smart-contracts/testing-strategy.md
[Flow Emulator]: ../../../build/tools/emulator/index.md
