---
sidebar_position: 2
sidebar_label: Local Development
---

# Local Development

The [Flow Command Line Interface] (CLI) is a set of tools that developers can use to interact with the Flow blockchain by managing accounts, sending transactions, deploying smart contracts, running the emulator, and more. This quickstart will get you familiar with its main concepts and functionality.

## Objectives

After completing this guide, you'll be able to:

* Create a Flow project using the [Flow Command Line Interface]
* Add an already-deployed contract to your project with the [Dependency Manager]
* Deploy a smart contract locally to the Flow Emulator
* Write and execute scripts to interact with a deployed smart contract

## Installation

The first thing you'll need to do is install the Flow CLI. If you have [homebrew] installed you can run:

```zsh
brew install flow-cli
```

For other ways of installing, please refer to the [installation guide].

## Configuration

Lets first create a project directory and navigate to it:

```zsh
mkdir cli-quickstart
cd cli-quickstart
```

Next, we'll initialize a new Flow project with the CLI:

```zsh
flow init --config-only
```

This will create a `flow.json` file in your project directory. This file is used to configure your project and describe the setup of your contracts, networks, and accounts.

It will also have a default `emulator-account` created for you. We'll use this account to interact with the emulator later on.

:::info

For additional details on how `flow.json` is configured, review the [configuration docs].

:::

## Grabbing the `HelloWorld` Contract

For this demo, we are going to be interacting with a simple `HelloWorld` contract, written in [Cadence], that is already deployed on Flow's `testnet` network on account [0xa1296b1e2e90ca5b]. In order to grab this project dependency, we'll use Flow's [Dependency Manager] to install it into our project using a source string that defines the network, address, and contract name of the contract we want to import.

```zsh
flow dependencies add testnet://0xa1296b1e2e90ca5b.HelloWorld
```

This will add the `HelloWorld` contract and any of its dependencies to an `imports` directory in your project. We recommend adding this directory to your `.gitignore` file, which is done by the script by default. It will also add any dependencies to your `flow.json` file.

During the install you'll be prompted to specify which account to deploy the contracts to. For this tutorial, you can select the default `emulator-account`. Leave the alias address for HelloWorld on mainnet blank.

Review the `📝 Dependency Manager Actions Summary` for a list of actions completed by the script.

Open `imports/a1296b1e2e90ca5b/HelloWorld.cdc` in your editor. You will see the following:

```cadence
access(all) contract HelloWorld {

  access(all)
  var greeting: String

  access(all)
  fun changeGreeting(newGreeting: String) {
    self.greeting = newGreeting
  }

  init() {
    self.greeting = "Hello, World!"
  }
}
```

This contract has a `greeting` variable that can be read and changed. It also has a `changeGreeting` function that allows you to change the greeting.

## Deploying the Contract to Emulator

The emulator is a local version of the Flow blockchain that you can use to test your contracts and scripts. It's a great way to develop and test your contracts locally - before you try them on the `testnet` or `mainnet`.

Before we deploy, let's open a new terminal window and run the emulator.  From the root of your project directory, where your `emulator-account.pkey` and `flow.json` files are located, run:

```zsh
flow emulator start
```

:::warning

If you see a message that configuration is missing, you are in the wrong directory.  Do **not** run `flow init`!.


> 🙏 Configuration is missing, initialize it with: 'flow init' and then rerun this command.

:::

To deploy the `HelloWorld` contract to the emulator, return to your first terminal and run the following command:

```zsh
flow project deploy
```

You should see:

```zsh
🎉 All contracts deployed successfully
```

The contract will now have been deployed to the default `emulator-account`. You can now interact with it using a script.

## Running Scripts

Scripts are used to read data from the Flow blockchain. There is no state modification. In our case, we are going to read a greeting from the `HelloWorld` contract.

Let's create a script file. We can generate a boilerplate script file with the following command:

```zsh
flow generate script ReadGreeting
```

This will create a file called `ReadGreeting.cdc` in the `cadence/scripts` directory.  Let's update the script to read the greeting from the `HelloWorld` contract.  Replace the existing coded with:

```cadence
import "HelloWorld"

access(all) fun main(): String {
  return HelloWorld.greeting
}
```

The import syntax will automatically resolve the address of the contract on the network you are running the script on. This is determined by your `flow.json` configuration.

:::tip

If you'll like to learn more about writing scripts, please check out the docs for [basic scripts].

:::

To run the script, we'll run this from the CLI:

```zsh
flow scripts execute cadence/scripts/ReadGreeting.cdc
```

You should see the result of the greeting. `Result: "Hello, world!"`

## Creating an Account and Running a Transaction

To change state on the Flow Blockchain, you need to run a transaction. Let's create a simple transaction file. We can use to modify the `greeting` on the `HelloWorld` contract.

First, create a file called `cadence/transactions/ChangeGreeting.cdc` with the following command:

```zsh
flow generate transaction ChangeGreeting
```

Open the new file - `cadence/transactions/ChangeGreeting.cdc`.  Update the boilerplate transaction to look like this:

```cadence
import "HelloWorld"

transaction(greeting: String) {

  prepare(acct: &Account) {
    log(acct.address)
  }

  execute {
    HelloWorld.changeGreeting(newGreeting: greeting)
  }
}
```

This will log the account signing the transaction, call the `changeGreeting` method of the `HelloWorld` contract, and pass in the new greeting. 

:::tip

If you want to learn more about writing transactions, please read the docs for [basic transactions].

:::

In order to run a transaction, the signing account needs to pay for it. You could run the transaction on emulator using the default `emulator-account` account, but a better test is to run it with a new test account.

Let's learn the command for creating accounts.

The easiest way to create an account using CLI is with:

```zsh
flow accounts create
```

Remember, your emulator should still be running at this point in another terminal.

Give your account the name `emulator-tester`, then select `Emulator` as the network.  You'll now see this account in your `flow.json`.

To run a transaction with this new account, you can run the following:

```zsh
flow transactions send cadence/transactions/ChangeGreeting.cdc "Hello, me" --signer emulator-tester --network emulator
```

You've just modified the state of the Flow Blockchain! At least on the emulator.  You'll know it worked if you see the receipt.  Yours will be similar to:

```zsh
Transaction ID: 2ff6cbb8125103595fca0abaead94cd00510d29902ceae9f5dc480e927ab7334

Block ID	36bbf6fc573129fa9a3c78a43e257d3b627a3af78fd9e64eeb133d981819cc69
Block Height	3
Status		✅ SEALED
ID		2ff6cbb8125103595fca0abaead94cd00510d29902ceae9f5dc480e927ab7334
Payer		179b6b1cb6755e31
Authorizers	[179b6b1cb6755e31]
```

You can also re-run the `ReadGreeting` script with:

```zsh
flow scripts execute cadence/scripts/ReadGreeting.cdc
```

You'll now see:

```zsh
Result: "Hello, me"
```

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