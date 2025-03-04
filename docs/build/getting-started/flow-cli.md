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

* Create a Flow project using the [Flow Command Line Interface]
* Run tests for a smart contract
* Add an already-deployed contract to your project with the [Dependency Manager]
* Deploy a smart contract locally to the Flow Emulator
* Write and execute scripts to interact with a deployed smart contract

## Installation

The first thing you'll need to do is install the Flow CLI. If you have [homebrew] installed you can run:

```zsh
brew install flow-cli
```

For other ways of installing, please refer to the [installation guide].

## Creating a New Project

To create a new project, navigate to the directory where you want to create your project and run:

```zsh
flow init
```

Upon running this command, you'll be prompted to enter a project name. Enter a name and press `Enter`.

You'll also be asked if you'd like to install any core contracts (such as `FungibleToken`, `NonFungibleToken`, etc.) using the [Dependency Manager](../../tools/flow-cli/dependency-manager.md). For this tutorial, you can select `No`.

The `init` command will create a new directory with the project name and the following files:

- `flow.json`: This file contains the configuration for your project.
- `emulator-account.pkey`: This file contains the private key for the default emulator account.
- `flow.json`: This file contains the configuration for your project.
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

For a more detailed guide on running Cadence tests, check out the [tests documentation](../../tools/flow-cli/tests.md).

:::

## Deploying the Contract to Emulator

The emulator is a local version of the Flow blockchain that you can use to test your contracts and scripts. It's a great way to develop and test your contracts locally - before you try them on the `testnet` or `mainnet`.

Before we deploy, let's open a new terminal window and run the emulator.  From the root of your project directory, where your `emulator-account.pkey` and `flow.json` files are located, run:

```zsh
flow emulator start
```

Your emulator should now be running.

### Deploying a Contract

#### Creating an Account

When you created a project you'll see that a `Counter` contract was added to your `flow.json` configuration file, but it's not set up for deployment yet. We could deploy it to the `emulator-account`, but for this example lets also create a new account on the emulator to deploy it to.

With your emulator running, run the following command:

```zsh
flow accounts create
```

When prompted, give your account the name `test-account` and select `Emulator` as the network. You'll now see this account in your `flow.json`.

> Note: We won't use this much in this example, but it's good to know how to create an account.

#### Configuring the Deployment

To deploy the `Counter` contract to the emulator, you'll need to add it to your project configuration. You can do this by running:

```zsh
flow config add deployment
```

You'll be prompted to select the contract you want to deploy. Select `Counter` and then select the account you want to deploy it to. For this example, select `emulator-account`.

#### Deploying the Contract

To deploy the `Counter` contract to the emulator, run:

```zsh
flow project deploy
```

That's it! You've just deployed your first contract to the Flow Emulator.

## Running Scripts

Scripts are used to read data from the Flow blockchain. There is no state modification. In our case, we are going to read a greeting from the `HelloWorld` contract.

If we wanted to generate a new script, we could run:

```zsh
flow generate script ScriptName
```

But the default project already has a `GetCounter` script for reading the count of the `Counter` contract.  Open `cadence/scripts/GetCounter.cdc` in your editor to see the script.

To run the script, you can run:

```zsh
flow scripts execute cadence/scripts/GetCounter.cdc
```

You should see zero as the result since the `Counter` contract initializes the count to zero and we haven't run any transactions to increment it.

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

:::tip

If you want to learn more about writing transactions, please read the docs for [basic transactions].

:::

## Installing & Interacting With External Dependencies

In addition to creating your own contracts, you can also install contracts that have already been deployed to the network by using the [Dependency Manager]. This is useful for interacting with contracts that are part of the Flow ecosystem or that have been deployed by other developers.

For example, let's say we want to format the result of our `GetCounter` script so that we display the number with commas if it's greater than 999. To do that we can install a contract called [`NumberFormatter`](https://contractbrowser.com/A.8a4dce54554b225d.NumberFormatter) from `testnet` that has a function to format numbers.

To grab it, run:

```zsh
flow dependencies install testnet://8a4dce54554b225d.NumberFormatter
```

When prompted for the account to deploy the contract to, select any account and ignore the prompt for an alias. This is if you wanted to configure a `mainnet` address for the contract.

This will add the `NumberFormatter` contract and any of its dependencies to an `imports` directory in your project. It will also add any dependencies to your `flow.json` file. In addition, the prompt will configure the deployment of the contract to the account you selected. Make sure to select the `emulator-account` account to deploy the contract to the emulator.

You should then see the `NumberFormatter` in your deployments for emulator in your `flow.json`. If you messed this up, you can always run `flow config add deployment` to add the contract to your deployments.

Now we can deploy the `NumberFormatter` contract to the emulator by running:

```zsh
flow project deploy
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

Now, to run the updated script, you can run:

```zsh
flow scripts execute cadence/scripts/GetCounter.cdc
```

You should now see the result. You won't see the commas unless the number is greater than 999.

## More

If you want to continue on generating your own contracts, you can also use the the `generate` subcommand to create a new contract file. See more in the [`generate` documentation].

After that, it's easy to add your contract to your project configuration using the Flow CLI [`config` commands].

<!-- Relative-style links.  Does not render on the page -->

[Flow Command Line Interface]: ../../tools/flow-cli/index.md
[Cadence]: https://cadence-lang.org/
[configuration docs]: ../../tools/flow-cli/flow.json/configuration.md
[homebrew]: https://brew.sh/
[installation guide]: ../../tools/flow-cli/install
[0xa1296b1e2e90ca5b]: https://contractbrowser.com/A.9dca641e9a4b691b.HelloWorld
[Dependency Manager]: ../../tools/flow-cli/dependency-manager
[basic scripts]: ../basics/scripts.md
[basic transactions]: ../basics/transactions.md
[`generate` documentation]: ../../tools/flow-cli/boilerplate.md
[`config` commands]: ../../tools/flow-cli/flow.json/manage-configuration.md