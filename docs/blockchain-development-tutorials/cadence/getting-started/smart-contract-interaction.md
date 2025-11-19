---
sidebar_position: 2
sidebar_label: Smart Contract Interaction
title: Smart Contract Interaction
description: Master advanced Flow development skills including external dependencies, sophisticated transactions, and comprehensive testing strategies. Learn to integrate contracts and implement test-driven development workflows.
keywords:
  - Flow dependencies
  - contract interaction
  - Cadence transactions
  - NumberFormatter
  - dependency manager
  - transaction anatomy
  - smart contract testing
  - test-driven development
  - Flow CLI
  - external contracts
  - blockchain transactions
  - Flow development
---

# Smart Contract Interaction

Building on your local development setup from the previous tutorial, you'll now master advanced Flow development skills that every professional developer needs. This tutorial focuses on how to work with external dependencies, build sophisticated transactions, and establish robust testing practices.

Flow's composability is one of its greatest strengths, becuase contracts can easily import and use functionality from other contracts. You'll learn to leverage this power while you build reliable, well-tested applications that interact seamlessly with the broader Flow ecosystem.

## What you'll learn

After you complete this tutorial, you'll be able to:

- **Manage external dependencies** with Flow's dependency manager and integrate third-party contracts.
- **Build sophisticated transactions** that interact with multiple contracts and handle complex state changes.
- **Master transaction anatomy** and understand how Cadence transactions work under the hood.
- **Implement comprehensive testing** strategies including edge cases and error conditions.
- **Apply test-driven development** workflows to ensure code quality and reliability.
- **Handle transaction monitoring** and error management in production scenarios.

## What you'll build

Building on your Counter contract, you'll enhance it with external dependencies and create a comprehensive testing suite. By the end of this tutorial, you'll have:

- **Enhanced Counter app** that uses the NumberFormatter contract for better display.
- **Complex transactions** that demonstrate advanced interaction patterns.
- **Comprehensive test suite** that covers normal operations, edge cases, and error conditions.
- **Professional workflow** for you to develop, test, and deploy contract interactions.

**Prerequisites:**

- Completed Environment Setup tutorial.
- Flow CLI, emulator running, and Counter contract deployed.
- Basic understanding of Cadence syntax.

## Manage dependencies

In addition to creating your own contracts, you can also install contracts that you previously deployed to the network with the [Dependency Manager]. This is useful for interacting with contracts that are part of the Flow ecosystem or that other developers deployed.

Flow's dependency manager allows you to:

- Install contracts deployed on any Flow network (mainnet, testnet, emulator).
- Automatically manage contract addresses across different environments.
- Keep your code portable and environment-independent.

For example, let's say we want to format the result of our `GetCounter` script so that we display the number with commas if it's greater than 999. To do that we can install a contract called [`NumberFormatter`] from `testnet` that has a function to format numbers.

### Install NumberFormatter contract

The [`NumberFormatter`] contract provides utilities for formatting numbers with commas, which makes large numbers more readable. Let's install it from testnet:

```zsh
flow dependencies install testnet://8a4dce54554b225d.NumberFormatter
```

When prompted:

1. **Account to deploy to:** Select `emulator-account` (this will deploy it locally for development).
2. **Alias for mainnet:** To skip this, press Enter.

This command:

- Downloads the NumberFormatter contract from testnet and any of its dependencies.
- Adds it to your `imports/` directory.
- Configures deployment settings in [`flow.json`].
- Sets up automatic address resolution.

### Configure dependencies in flow.json

Open your `flow.json` file and view the new sections:

```json
{
    .
    .
    .
  "dependencies": {
		"NumberFormatter": {
			"source": "testnet://8a4dce54554b225d.NumberFormatter",
			"hash": "dc7043832da46dbcc8242a53fa95b37f020bc374df42586a62703b2651979fb9",
			"aliases": {
				"testnet": "8a4dce54554b225d"
			}
		}
	},
    .
    .
    .
  "deployments": {
		"emulator": {
			"emulator-account": [
				"NumberFormatter"
			]
		}
	}
}
```

This configuration:

- Maps the `NumberFormatter` dependency to its testnet source.
- Sets up deployment to your emulator account.
- Allows automatic address resolution in your code.

### Deploy external dependencies

Now we can deploy the `NumberFormatter` contract to the emulator:

```zsh
flow project deploy
```

You will see output like:

```zsh
Deploying 1 contracts for accounts: emulator-account

NumberFormatter -> 0xf8d6e0586b0a20c7 (66e6c4210ae8263370fc3661f148f750175bb4cf2e80637fb42eafe2d6c5b385)

🎉 All contracts deployed successfully
```

### Integrate external contract

Now let's update your `GetCounter.cdc` script to use the NumberFormatter. Open `cadence/scripts/GetCounter.cdc` and update it:

```cadence
import "Counter"
import "NumberFormatter"

access(all)
fun main(): String {
    // Retrieve the count from the Counter contract
    let count: Int = Counter.getCount()

    // Format the count using NumberFormatter
    let formattedCount = NumberFormatter.formatWithCommas(number: count)

    // Return the formatted count
    return formattedCount
}
```

**Key points:**

- **Import syntax**: `import "Counter"` and `import "NumberFormatter"` don't require addresses.
- **Contract interaction**: We call `NumberFormatter.formatWithCommas()` just like any other function.
- **Return type change**: The script now returns a `String` instead of an `Int`.

### Test the integration

Run your updated script:

```zsh
flow scripts execute cadence/scripts/GetCounter.cdc
```

You will see:

```zsh
Result: "1"
```

The number is now formatted as a string. Let's create a more impressive example and add a transaction that increments by 1000.

### Create a bulk increment transaction

Generate a new transaction to demonstrate the NumberFormatter's power:

```zsh
flow generate transaction IncrementBy1000
```

Open `cadence/transactions/IncrementBy1000.cdc` and replace the content with:

```cadence
import "Counter"

transaction {
    prepare(acct: &Account) {
        // Authorization handled automatically
    }

    execute {
        // Increment the counter 1000 times
        var i = 0
        while i < 1000 {
            Counter.increment()
            i = i + 1
        }

        // Retrieve the new count and log it
        let newCount = Counter.getCount()
        log("New count after incrementing by 1000: ".concat(newCount.toString()))
    }
}
```

Execute the transaction:

```zsh
flow transactions send cadence/transactions/IncrementBy1000.cdc --signer test-account
```

Now run your formatted script to see the NumberFormatter in action:

```zsh
flow scripts execute cadence/scripts/GetCounter.cdc
```

Result:

```zsh
Result: "1,001"
```

Perfect! The NumberFormatter automatically adds commas to make large numbers readable.

:::info

**The Power of Composability**: Notice what just happened—you enhanced your Counter contract's functionality **without modifying the original contract**. This is the power of Flow's composability: you can extend functionality by combining contracts, which allows rapid development and code reuse. Even more importantly, we did this **without the need for access or permission.**

:::

## Build transactions

Transactions are the foundation of blockchain state changes. Unlike scripts (which only read data), transactions can modify contract state, transfer tokens, and emit events. Let's master advanced transaction patterns.

### Understand transaction anatomy

Every Cadence transaction has the same basic structure:

```cadence
import "OtherContract"

transaction {
    // Optional: Declare variables available throughout the transaction
    let initialCount: Int

    // This phase has access to account storage and capabilities
    // Used for authorization and accessing private data
    prepare(acct: &Account) {
    }

    // This phase contains the main transaction logic
    // No access to account storage, only to data from prepare phase
    execute {
    }

    // Optional: Conditions that must be true after execution
    // Used for verification and ensuring transaction success
    post {
    }
}
```

### Transaction phases explained

1. **Import Phase**: declare contract dependencies.
2. **Parameter Declaration**: define inputs the transaction accepts.
3. **Variable Declaration**: declare transaction-scoped variables.
4. **Prepare Phase**: access account storage and capabilities (authorized).
5. **Execute Phase**: main logic execution (no storage access).
6. **Post Phase**: verify transaction success conditions.

#### Transaction with parameters

Create a transaction that accepts a custom increment value:

```zsh
flow generate transaction IncrementByAmount
```

Open `cadence/transactions/IncrementByAmount.cdc`:

```cadence
import "Counter"

transaction(amount: Int) {

    // Store initial value
    let initialCount: Int

    prepare(acct: &Account) {
        // Verify the account is authorized to make this change
        log("Account ".concat(acct.address.toString()).concat(" is incrementing by ").concat(amount.toString()))

    prepare(acct: &Account) {
        self.initialCount = Counter.getCount()  // Capture initial state
        log("Account".concat(acct.address.toString()).concat(" is incrementing by").concat(amount.toString()))
    }

    execute {
        // Validate input
        if amount <= 0 {
            panic("Amount must be positive")
        }

        // Increment the specified number of times
        var i = 0
        while i < amount {
            Counter.increment()
            i = i + 1
        }

        let newCount = Counter.getCount()
        log("Counter incremented by ".concat(amount.toString()).concat(", new value: ").concat(newCount.toString()))
    }

    post {
        // Verify the counter increased correctly
        Counter.getCount() == (self.initialCount + amount): "Counter must equal initial count plus increment amount"
      }
    }
}
```

Execute with a parameter:

```zsh
flow transactions send cadence/transactions/IncrementByAmount.cdc <amount> --network emulator --signer test-account
```

## Test your code

Testing is crucial for smart contract development. Flow provides powerful testing capabilities built into the CLI that allow comprehensive test coverage and test-driven development workflows.

Execute the test suite:

```zsh
flow test
```

You will see output that confirms the tests pass:

```zsh
Test results: "Counter_test.cdc"
- PASS: testContract

All tests passed
```

### Understand current tests

Open `cadence/tests/Counter_test.cdc` to see the existing test:

```cadence
import Test

access(all) let account = Test.createAccount()

access(all) fun testContract() {
    let err = Test.deployContract(
        name: "Counter",
        path: "../contracts/Counter.cdc",
        arguments: []
    )

    Test.expect(err, Test.beNil())
}
```

This basic test:

1. **Creates a test account** with `Test.createAccount()`.
2. **Deploys the Counter contract** to the test environment.
3. **Verifies deployment succeeded** by checking that no error occurred.

### Test integration with dependencies

Test the NumberFormatter integration:

```cadence
import Test

access(all) let account = Test.createAccount()

access(all) fun testNumberFormatterLogic() {
    // Test NumberFormatter logic inline without contract deployment
    // Test small number (under 1000) - should have no comma
    let smallNumberScript = Test.executeScript(
        "access(all) fun formatWithCommas(number: Int): String { let isNegative = number < 0; let absNumber = number < 0 ? -number : number; let numberString = absNumber.toString(); var formatted = \"\"; var count = 0; let numberLength = numberString.length; var i = numberLength - 1; while i >= 0 { let digit = numberString.slice(from: i, upTo: i + 1); formatted = digit.concat(formatted); count = count + 1; if count % 3 == 0 && i != 0 { formatted = \",\".concat(formatted) }; i = i - 1 }; if isNegative { formatted = \"-\".concat(formatted) }; return formatted }; access(all) fun main(): String { return formatWithCommas(number: 123) }",
        []
    )
    Test.expect(smallNumberScript, Test.beSucceeded())
    let smallResult = smallNumberScript.returnValue! as! String
    Test.expect(smallResult, Test.equal("123"))

    // Test large number (over 999) - should have comma
    let largeNumberScript = Test.executeScript(
        "access(all) fun formatWithCommas(number: Int): String { let isNegative = number < 0; let absNumber = number < 0 ? -number : number; let numberString = absNumber.toString(); var formatted = \"\"; var count = 0; let numberLength = numberString.length; var i = numberLength - 1; while i >= 0 { let digit = numberString.slice(from: i, upTo: i + 1); formatted = digit.concat(formatted); count = count + 1; if count % 3 == 0 && i != 0 { formatted = \",\".concat(formatted) }; i = i - 1 }; if isNegative { formatted = \"-\".concat(formatted) }; return formatted }; access(all) fun main(): String { return formatWithCommas(number: 1234) }",
        []
    )
    Test.expect(largeNumberScript, Test.beSucceeded())
    let largeResult = largeNumberScript.returnValue! as! String
    Test.expect(largeResult, Test.equal("1,234"))
}
```

The `Formatter_test.cdc` test validates that number formatting with commas works correctly by testing two scenarios: numbers under 1,000 (which should have no commas) and numbers over 999 (which should have commas). The test is constructed with two main assertions - first testing that 123 formats as "123" without commas, and second testing that 1234 formats as "1,234" with a comma.

### Run your enhanced test suite

Execute the complete test suite with your new comprehensive tests:

```zsh
flow test
```

You should see output like:

```zsh
Running tests...

Test results: "cadence/tests/Formatter_test.cdc"
- PASS: testNumberFormatterLogic
Test results: "cadence/tests/Counter_test.cdc"
- PASS: testContract

All tests passed
```

:::tip

For a more detailed guide on Cadence testing patterns and advanced techniques, check out the [tests documentation].

:::

---

## Conclusion

Through this tutorial, you've accomplished:

✅ **Dependency management**

- Successfully integrated the NumberFormatter contract from testnet.
- Learned about Flow's dependency management system and automatic address resolution.
- Demonstrated contract composability by enhancing functionality without modifying source code.
- Configured multi-contract deployments across different environments.

✅ **Transaction development**

- Understood transaction anatomy including prepare, execute, and post phases.
- Implemented proper input validation and error handling patterns.

✅ **Testing**

- Implemented test coverage for contract functionality
- Created integration tests that verify multi-contract interactions

### What you've learned

You have learned how to use Flow's dependency management system to install and integrate external contracts (like NumberFormatter), understand the structure of Cadence transactions including their prepare, execute, and post phases, and implement basic testing for contract functionality. You can now work with multi-contract applications and understand how contracts can be composed together to extend functionality.

### Next steps

With these skills, you're ready to:

- Build frontend applications that interact with your smart contracts.
- Deploy contracts to live networks (testnet and mainnet).
- Explore advanced Flow patterns and ecosystem contracts.
- Contribute to the growing Flow developer community.

You've made significant progress in becoming a proficient Flow developer!

### Resources for continued learning

Continue your Flow mastery with these advanced resources:

- **[Flow Discord Community]**: Connect with other developers building sophisticated Flow applications.
- **[Cadence Language Reference]**: Master advanced language features including resources, capabilities, and access control.
- **[Flow GitHub]**: Explore production contract examples and contribute to the ecosystem.

<!-- Links -->

[tests documentation]: ../../../build/tools/flow-cli/tests.md
[Flow Discord Community]: https://discord.gg/flow-blockchain
[Flow Documentation]: https://developers.flow.com
[Cadence Language Reference]: https://cadence-lang.org
[Flow GitHub]: https://github.com/onflow
[Flow DevEX]: https://flowdevx.com
[Dependency Manager]: https://developers.flow.com/build/tools/flow-cli/dependency-manager
[`NumberFormatter`]: https://contractbrowser.com/A.8a4dce54554b225d.NumberFormatter
[`flow.json`]: https://developers.flow.com/build/tools/flow-cli/flow.json/configuration
