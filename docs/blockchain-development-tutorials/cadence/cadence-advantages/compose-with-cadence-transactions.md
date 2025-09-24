---
title: Compose with Cadence Transactions
description: Learn how to compose with someone else's on-chain contracts by writing a Cadence transaction that conditionally calls a public contract on testnet, then extend it with a formatting helper—no redeploy required.
sidebar_position: 1
keywords:
  - Cadence transactions
  - composition
  - public contracts
  - Flow testnet
  - Flow CLI
  - super-commands
  - dependency manager
  - Counter
  - NumberFormatter
  - onchain reads
  - onchain writes
---

In this tutorial, you will **compose with someone else's contract** on Flow testnet. You'll write a Cadence transaction that reads public state from a contract named `Counter` and only increments the counter when it is odd. Then you will extend the transaction to format output using a helper contract `NumberFormatter`. Everything runs against testnet using the Flow CLI and the dependency manager.

You can use transactions developed and tested this way from the frontend of your app.

:::info

We are importing the testnet `Counter` contract using the dependency manager. You are composing with a the public features of contract you do not own!

:::

## Objectives

After completing this guide, you will be able to:

- Configure the Flow CLI _dependency manager_ to import named contracts from **testnet**
- Write a Cadence **transaction** that reads and writes to a public contract you did not deploy
- Run the transaction on **testnet** with a funded account using the Flow CLI
- Extend the transaction to compose multiple public contracts (`Counter` + `NumberFormatter`) without redeploying anything

## Prerequisites

- [Flow CLI installed]
- A **funded testnet account** to sign transactions  
  See **Create accounts** and **Fund accounts** in the Flow CLI super-commands:
  - Create: https://developers.flow.com/build/tools/flow-cli/super-commands#create-accounts
  - Fund: https://developers.flow.com/build/tools/flow-cli/super-commands#fund-accounts

## Getting Started

Create a [new project] with the [Flow CLI]:

```bash
flow init
```

Follow the prompts and create your project. You do **not** need to install any dependencies.

### Install dependencies

We will resolve imports **using string format** (`import "Counter"`, later `import "NumberFormatter"`) using the [dependency manager]. This is the recommended way of working with imports, whether you have the files locally or not.

:::warning

For this exercise, you need to **delete** the existing contract entry for `Counter` from your `flow.json`.

:::

You can install dependencies for already deployed contracts, whether yours or those deployed by others:

```bash
# Add a deployed instance of the Counter contract
flow dependencies install testnet://0x8a4dce54554b225d.Counter

# Later in the tutorial you will also need NumberFormatter (install it now if you wish)
flow dependencies install testnet://0x8a4dce54554b225d.NumberFormatter
```

You can pick `none` for the deployment account as you won't need to redeploy these contracts.

Once installed with the dependency manager, Cadence imports like `import "Counter"` will resolve to the testnet address when sending transactions on testnet.

:::info

In Cadence, contracts are deployed to the account storage of the deploying address. Due to security reasons, the same private key produces different address on Cadence testnet and mainnet. One of the features of the dependency manager is to automatically select the right address for imports based on the network you're working on.

:::

---

## Compose with the public `Counter` contract

Review the `Counter` contract that's created as an example by `flow init`:

```cadence
access(all) contract Counter {

    access(all) var count: Int

    // Event to be emitted when the counter is incremented
    access(all) event CounterIncremented(newCount: Int)

    // Event to be emitted when the counter is decremented
    access(all) event CounterDecremented(newCount: Int)

    init() {
        self.count = 0
    }

    // Public function to increment the counter
    access(all) fun increment() {
        self.count = self.count + 1
        emit CounterIncremented(newCount: self.count)
    }

    // Public function to decrement the counter
    access(all) fun decrement() {
        self.count = self.count - 1
        emit CounterDecremented(newCount: self.count)
    }

    // Public function to get the current count
    view access(all) fun getCount(): Int {
        return self.count
    }
}
```

It's a basic example of a simple contract.

Unlike in Solidity, apps aren't limited to the functionality deployed in a smart contract. One of the ways you can expand your app is to write new transactions that call multiple functions in multiple contracts, with branching based on conditions and state, using a single call and a single signature. You don't need to deploy a new contract, use a proxy, or switch to V2.

In this simple example, imagine that you've already deployed a product that has thousands of users and is dependent on the `Counter` smart contract. After a time, you realize that a significant portion of your users only wish to use the `increment` feature if the current `count` is odd, to try and make the number be even.

We will write a transaction that **reads** the current count from `Counter` and **only increments** it if the value is odd.

Create a new [transaction] called `IncrementIfOdd` using the Flow CLI:

```bash
flow generate transaction IncrementIfOdd
```

Start by adding the code from the existing `IncrementCounter` [transaction]:

```cadence
import "Counter"

transaction {

    prepare(acct: &Account) {
        // Authorizes the transaction
    }

    execute {
        // Increment the counter
        Counter.increment()

        // Retrieve the new count and log it
        let newCount = Counter.getCount()
        log("New count after incrementing: ".concat(newCount.toString()))
    }
}
```

```cadence
import "Counter"

transaction() {
  prepare(account: &Account) {}

  execute {
    // Get the current count from the Counter contract (public read)
    let currentCount = Counter.getCount()

    // Print the current count
    log("Current count: ".concat(currentCount.toString()))

    // If odd (remainder when divided by 2 is not 0), increment
    if currentCount % 2 != 0 {
      Counter.increment()
      log("Counter was odd, incremented to: ".concat(Counter.getCount().toString()))
    } else {
      log("Counter was even, no increment performed")
    }
  }
}
```

### Run on testnet

You need a **funded** testnet account to sign the transaction.

```bash
# If needed, create a testnet account (one-time)
flow accounts create --network testnet

# If needed, fund it (one-time)
flow accounts fund --network testnet --address <YOUR_TESTNET_ADDRESS>
```

Send the transaction:

```bash
flow cadence send cadence/transactions/odd_increment.cdc   --network testnet   --signer <YOUR_TESTNET_ADDRESS_OR_CONFIGURED_SIGNER_NAME>
```

You should see logs that show the prior value and whether the increment occurred.

:::tip
This same transaction could be triggered **from an app** and **signed by a wallet** with a single user click. Your dApp would assemble and submit this exact Cadence transaction using your preferred client library, and the user's wallet would authorize it.
:::

---

## Extend the composition with NumberFormatter

Now you will **compose with a second public contract**, `NumberFormatter`, to render numbers with commas. No redeploys—just an additional import and a small code change.

### Install the `NumberFormatter` dependency

Add it with the CLI (preferred), replacing the address with the testnet deployment you intend to use:

```bash
flow dependencies add --network testnet NumberFormatter 0x<NumberFormatterAddressOnTestnet>
```

Or update `flow.json` as shown earlier.

### Update the transaction

Create `cadence/transactions/odd_increment_formatted.cdc`:

```cadence
import "Counter"
import "NumberFormatter"

transaction() {
  prepare(account: &Account) {
    // This is where you'd interact with a user's tokens, NFTs,
    // and other digital property or data stored in their account.
    // It's also where you'd obtain authorization if needed.
    //
    // We don't need any of that for this transaction.
  }

  execute {
    // Get the current count from the Counter contract
    let currentCount = Counter.getCount()

    // Print the current count using NumberFormatter
    log("Current count: ".concat(NumberFormatter.formatWithCommas(number: currentCount)))

    // If odd, increment and print the new formatted value
    if currentCount % 2 != 0 {
      Counter.increment()
      log("Counter was odd, incremented to: "
        .concat(NumberFormatter.formatWithCommas(number: Counter.getCount())))
    } else {
      log("Counter was even, no increment performed")
    }
  }
}
```

Run it:

```bash
flow cadence send cadence/transactions/odd_increment_formatted.cdc   --network testnet   --signer <YOUR_TESTNET_ADDRESS_OR_CONFIGURED_SIGNER_NAME>
```

You should see formatted output in the transaction logs.

---

## Why this matters

- **No redeploys, no forks:** You composed your app logic with on-chain public contracts you do not control.
- **Cadence-first composition:** Transactions can include _arbitrary logic_ that calls into multiple contracts in one atomic operation with a single signature.
- **Production-ready path:** The same code path works from a CLI or a dApp frontend, authorized by a wallet.

## Troubleshooting

- If imports fail, confirm your dependency mapping (CLI `flow dependencies add ...` or `flow.json` aliases) and that you are using `--network testnet`.
- If sending fails with an authorization error, confirm your signer is configured in `flow.json` and that the account is **funded** on testnet.
- If `NumberFormatter` import fails, verify the testnet address you used and that the contract exposes the `formatWithCommas` function as expected.

## Conclusion

<!-- Reference-style links, will not render on page -->

[Flow CLI installed]: ../../../build/tools/flow-cli/install.md
[dependency manager]: ../../../build/tools/flow-cli/dependency-manager.md
[new project]: ../../../build/tools/flow-cli/flow.json/initialize-configuration
[Flow CLI]: ../../../build/tools/flow-cli/index.md
[transaction]: https://cadence-lang.org/docs/language/transactions
