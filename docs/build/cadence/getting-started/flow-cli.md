---
sidebar_position: 2
sidebar_label: Local Development
title: Local Development with Flow CLI
description: Learn how to use the Flow Command Line Interface (CLI) for local blockchain development. Create projects, run tests, manage dependencies, deploy contracts, and interact with the Flow emulator.
keywords:
  - Flow CLI
  - local development
  - Flow emulator
  - smart contracts
  - contract deployment
  - dependency management
  - blockchain testing
  - Flow projects
  - contract testing
  - script execution
  - transactions
  - Flow tools
  - development environment
  - contract management
  - blockchain development
---

# Local Development

The [Flow Command Line Interface] (CLI) is a set of tools that developers can use to interact with the Flow blockchain by managing accounts, sending transactions, deploying smart contracts, running the emulator, and more. This quickstart will get you familiar with its main concepts and functionality.

## Objectives

After completing this guide, you'll be able to:

- Create a Flow project using the [Flow Command Line Interface]
- Run tests for a smart contract
- Add an already-deployed contract to your project with the [Dependency Manager]
- Deploy a smart contract locally to the Flow Emulator
- Write and execute scripts to interact with a deployed smart contract

## Installation

The first thing you'll need to do is install the Flow CLI. If you have [homebrew] installed you can run:

```zsh
brew install flow-cli
```

For other ways of installing, please refer to the [installation guide].

### Flow Cadence VSCode Extension

Install the [Flow Cadence VSCode Extension] from the marketplace.

## Creating a New Project

To create a new project, navigate to the directory where you want to create your project and run:

```zsh
flow init
```

Upon running this command, you'll be prompted to enter a project name. Enter a name and press `Enter`.

You'll also be asked if you'd like to install any core contracts (such as `FungibleToken`, `NonFungibleToken`, etc.) using the [Dependency Manager](../../../build/tools/flow-cli/dependency-manager.md). For this tutorial, you can select `No`.

The `init` command will create a new directory with the project name and the following files:

- `flow.json`: This file contains the configuration for your project, including accounts, contracts, deployments, and network settings. It's the central configuration file that the Flow CLI uses to understand your project structure and deployment targets.
- `emulator-account.pkey`: This file contains the private key for the default emulator account.
- `cadence/`: This directory contains your Cadence code. Inside there are subdirectories for contracts, scripts, transactions, and tests.

Inside the `cadence/contracts` directory, you'll find a `Counter.cdc` file. This is the same as the `Counter` contract in the previous step.

Next, `cd` into your new project directory.

:::info

For additional details on how `flow.json` is configured, review the [configuration docs].

:::

### Running the Tests

To run the example test for the `Counter` contract located in `cadence/tests`, you can run:

```zsh
flow test
```

:::tip

For a more detailed guide on running Cadence tests, check out the [tests documentation](../../../build/tools/flow-cli/tests.md).

:::

## Deploying the Contract to Emulator

The emulator is a local version of the Flow blockchain that you can use to test your contracts and scripts. It's a great way to develop and test your contracts locally - before you try them on the `testnet` or `mainnet`.

Before we deploy, let's open a new terminal window and run the emulator. From the root of your project directory, where your `emulator-account.pkey` and `flow.json` files are located, run:

```zsh
flow emulator start
```

Your emulator will now be running.

### Deploying a Contract

#### Creating an Account

When you created a project you'll see that a `Counter` contract was added to your [`flow.json` configuration file](../../../build/tools/flow-cli/flow.json/configuration.md), but it's not set up for deployment yet. We could deploy it to the automatically created `emulator-account`, but for this example lets also create a new account on the emulator to deploy it to.

:::info

**Reminder**: On Flow Cadence, contracts are deployed to the storage of the account that deploys them.

:::

Leave your emulator running, and open a second terminal. Run the following command:

```zsh
flow accounts create
```

When prompted, give your account the name `test-account` and select `Emulator` as the network. You'll now see this account in your [`flow.json`](../../../build/tools/flow-cli/flow.json/configuration.md).

#### Configuring the Deployment

To deploy the `Counter` contract to the emulator, you'll need to add it to your project configuration. You can do this by running:

```zsh
flow config add deployment
```

First, pick `emulator` as the network for deployment. Select your `test-account` as the account to deploy to. Next, pick `Counter` as the contract to deploy. Finally, choose `no` when asked if you wish to deploy more contracts.

#### Deploying the Contract

To deploy the `Counter` contract to the emulator, run:

```zsh
flow project deploy
```

You'll see something similar to:

```zsh
Deploying 1 contracts for accounts: test-account

Counter -> 0x179b6b1cb6755e31 (a98c155fe7afc8eb2af5551748759b08a80a0ae85d1b09f92f1afc293c61ca98)

🎉 All contracts deployed successfully
```

That's it! You've just deployed your first contract to the Flow Emulator.

:::info

**Deploying to Testnet**: To deploy your contracts to testnet instead of the emulator, simply add the `--network=testnet` flag to your deploy command:

```zsh
flow project deploy --network=testnet
```

Make sure you have a testnet account configured in your [`flow.json` file](../../../build/tools/flow-cli/flow.json/configuration.md) and that you have enough FLOW tokens to pay for deployment fees. You can get testnet FLOW tokens from the [Flow Testnet Faucet](https://faucet.flow.com/fund-account).

:::

:::warning

You can't deploy the same contract to multiple accounts at the same time with the `deploy` command. If you've experimented with the above, you may need to manually edit the `"deployments"` property in [`flow.json`](../../../build/tools/flow-cli/flow.json/configuration.md) to remove extra deployments.

:::

## Running Scripts

Scripts are used to read data from the Flow blockchain. There is no state modification. In our case, we are going to read a greeting from the `HelloWorld` contract.

If we wanted to generate a new script, we could run:

```zsh
flow generate script ScriptName
```

:::info
For more information about generating Cadence files, see the [Generating Cadence Boilerplate](../../../build/tools/flow-cli/generate.md) documentation.
:::

But the default project already has a `GetCounter` script for reading the count of the `Counter` contract. Open `cadence/scripts/GetCounter.cdc` in your editor to see the script.

To run the script, you can run:

```zsh
flow scripts execute cadence/scripts/GetCounter.cdc
```

You should see zero as the result since the `Counter` contract initializes the count to zero and we haven't run any transactions to increment it.

```zsh
Result: 0
```

:::tip

If you'll like to learn more about writing scripts, please check out the docs for [basic scripts].

:::

## Executing Transactions

Transactions are used to modify the state of the blockchain. In our case, we want to increment the count of the `Counter` contract. Luckily, we already have a transaction for that in the project that was generated for us. Open `cadence/transactions/IncrementCounter.cdc` in your editor to see the transaction.

To run the transaction, you can run:

```zsh
flow transactions send cadence/transactions/IncrementCounter.cdc
```

By default, this uses the `emulator-account` to sign the transaction and the emulator network. If you want to use your `test-account` account, you can specify the `--signer` flag with the account name.

```zsh
Transaction ID: 9cc7ac4d3d5239016965aba89b9692d3401a48a090d1ad1a8d9ef9cfca685e6e

Block ID        b8537860b0fc9ca8b3195b121e762502f9a220874b605d6a810998e8b62321a3
Block Height    3
Status          ✅ SEALED
ID              9cc7ac4d3d5239016965aba89b9692d3401a48a090d1ad1a8d9ef9cfca685e6e
Payer           f8d6e0586b0a20c7
Authorizers     [f8d6e0586b0a20c7]

Proposal Key:
    Address     f8d6e0586b0a20c7
    Index       0
    Sequence    1

No Payload Signatures

Envelope Signature 0: f8d6e0586b0a20c7
Signatures (minimized, use --include signatures)

Events:
    Index       0
    Type        A.179b6b1cb6755e31.Counter.CounterIncremented
    Tx ID       9cc7ac4d3d5239016965aba89b9692d3401a48a090d1ad1a8d9ef9cfca685e6e
    Values
                - newCount (Int): 1



Code (hidden, use --include code)

Payload (hidden, use --include payload)

Fee Events (hidden, use --include fee-events)
```

Run the script to check the counter again. You'll see that it has incremented:

```zsh
Result: 1
```

:::tip

If you want to learn more about writing transactions, please read the docs for [basic transactions].

:::

## Installing & Interacting With External Dependencies

In addition to creating your own contracts, you can also install contracts that have already been deployed to the network by using the [Dependency Manager]. This is useful for interacting with contracts that are part of the Flow ecosystem or that have been deployed by other developers.

For example, let's say we want to format the result of our `GetCounter` script so that we display the number with commas if it's greater than 999. To do that we can install a contract called [`NumberFormatter`] from `testnet` that has a function to format numbers.

To grab it, run:

```zsh
flow dependencies install testnet://8a4dce54554b225d.NumberFormatter
```

When prompted for the account to deploy the contract to, select any account and ignore the prompt for an alias. This is if you wanted to configure a `mainnet` address for the contract.

This will add the `NumberFormatter` contract and any of its dependencies to an `imports` directory in your project. It will also add any dependencies to your [`flow.json` file](../../../build/tools/flow-cli/flow.json/configuration.md). In addition, the prompt will configure the deployment of the contract to the account you selected. Make sure to select the `emulator-account` account to deploy the contract to the emulator.

You'll then see the `NumberFormatter` in your deployments for emulator in your [`flow.json`](../../../build/tools/flow-cli/flow.json/configuration.md).

Now we can deploy the `NumberFormatter` contract to the emulator by running:

```zsh
flow project deploy
```

```zsh
Deploying 2 contracts for accounts: test-account

Counter -> 0x179b6b1cb6755e31 [skipping, no changes found]
NumberFormatter -> 0x179b6b1cb6755e31 (f8ce6dfa1771c7bad216e72e7f7aac7f1987c4261d425d27e689c701b9ec69cd)

🎉 All contracts deployed successfully
```

Now that we have the `NumberFormatter` contract deployed, we can update our `GetCounter` script to format the result. Open `cadence/scripts/GetCounter.cdc` and update it to use the following code:

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

The things to note here are:

- We import the `NumberFormatter` contract.
- We call the `formatWithCommas` function from the `NumberFormatter` contract to format the count.
- We return the formatted count as a `String`.

:::warning

Do **not** simply add a new file. Use `flow generate transaction IncrementBy1000.cdc`

:::

Add a new transaction called `IncrementBy1000.cdc`. Fill it with a variant of `IncrementCounter.cdc` that instead loops through the `increment` function 1000 times.

```cadence
import "Counter"

transaction {

    prepare(acct: &Account) {
        // Authorizes the transaction
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
        log("New count after incrementing: ".concat(newCount.toString()))
    }
}
```

Try out your new transaction with:

```zsh
flow transactions send cadence/transactions/IncrementBy1000.cdc --signer test-account

```

Finally, to test the updated script, you can run:

```zsh
flow scripts execute cadence/scripts/GetCounter.cdc
```

You should now see the result with commas.

:::info

If you're a Solidity developer, did you catch what we just did here? We updated the features and functionality available in the smart contract **without updating the contract itself!**

Even more importantly, we did this **without needing access or permission.** You can use the power of composability in Flow Cadence to add new features to contracts you don't own.

:::

## More

If you want to continue on generating your own contracts, you can also use the the `generate` subcommand to create a new contract file. See more in the [Generating Cadence Boilerplate](../../../build/tools/flow-cli/generate.md) documentation.

After that, it's easy to add your contract to your project configuration using the Flow CLI [`config` commands].

## Conclusion

In this tutorial, we've accomplished all of our learning objectives:

1. ✅ Created a Flow project using the Flow CLI

   - Initialized a new project with `flow init`
   - Set up the project structure with contracts, scripts, and tests
   - Configured the project using `flow.json`

2. ✅ Ran tests for a smart contract

   - Executed the example test for the `Counter` contract
   - Learned about the testing capabilities of the Flow CLI

3. ✅ Added an already-deployed contract to your project

   - Used the Dependency Manager to install the `NumberFormatter` contract
   - Configured the contract deployment in `flow.json`
   - Deployed the contract to the emulator

4. ✅ Deployed a smart contract locally to the Flow Emulator

   - Started the Flow Emulator
   - Created a test account
   - Deployed the `Counter` contract to the emulator
   - Deployed the `NumberFormatter` contract

5. ✅ Wrote and executed scripts to interact with deployed contracts
   - Created and executed the `GetCounter` script
   - Modified the script to use the `NumberFormatter` contract
   - Created and executed the `IncrementBy1000` transaction
   - Demonstrated the power of Cadence's composability

<!-- Relative-style links.  Does not render on the page -->

[Flow Cadence VSCode Extension]: https://marketplace.visualstudio.com/items?itemName=onflow.cadence
[Flow Command Line Interface]: ../../../build/tools/flow-cli/index.md
[Cadence]: https://cadence-lang.org/
[configuration docs]: ../../../build/tools/flow-cli/flow.json/configuration.md
[homebrew]: https://brew.sh/
[installation guide]: ../../../build/tools/flow-cli/install
[0xa1296b1e2e90ca5b]: https://contractbrowser.com/A.9dca641e9a4b691b.HelloWorld
[Dependency Manager]: ../../../build/tools/flow-cli/dependency-manager
[basic scripts]: ../basics/scripts.md
[basic transactions]: ../basics/transactions.md
[Generating Cadence Boilerplate]: ../../../build/tools/flow-cli/generate.md
[`config` commands]: ../../../build/tools/flow-cli/flow.json/manage-configuration.md
[`NumberFormatter`]: https://contractbrowser.com/A.8a4dce54554b225d.NumberFormatter
