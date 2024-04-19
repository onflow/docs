---
sidebar_position: 2
sidebar_label: Pt. 2 - Local Development
---

# Hello World Pt. 2 - Local Development

The Flow Command Line Interface (CLI) is a set of tools that developers can use to interact with the Flow blockchain by managing accounts, sending transactions, deploying smart contracts, running the emulator, and more. This quickstart will get you familiar with its main concepts and functionality.

## Installation

The first thing you'll need to do is install the Flow CLI. If you have [homebrew](https://brew.sh/) installed you can run:

```
brew install flow-cli
```

For other ways of installing, please [refer to the installation guide](../../../tools/flow-cli/install.md).

## Configuration

Lets first create a project directory and navigate to it:

```
mkdir cli-quickstart
cd cli-quickstart
```

Next, we'll initialize a new Flow project with the CLI:

```
flow init
```

This will create a `flow.json` file in your project directory. This file is used to configure your project and describe the setup of your contracts, networks, and accounts.

It will also have a default `emulator-account` created for you. We'll use this account to interact with the emulator later on.

<Callout type="info">
For additional details on how `flow.json` is configured, [read here.](../../../tools/flow-cli/flow.json/configuration.md)
</Callout>

## Grabbing the HelloWorld Contract

For this demo, we are going to be interacting with a simple `HelloWorld` contract that is already deployed on Flow's `testnet` network. In order to grab this project dependency, we'll use Flow's [Dependency Manager](../../../tools/flow-cli/dependency-manager.md) to install it into our project using a source string that defines the network, address, and contract name of the contract we want to import.

```
flow dependencies add testnet://0x9dca641e9a4b691b.HelloWorld
```

This will add the `HelloWorld` contract and any of its dependencies to an `imports` directory in your project (we recommend adding this directory to your .gitignore file). It will also add any dependencies to your `flow.json` file.

During the install, it will also prompt you as to which account you'd like to have the contract deployed to. For this tutorial, you can select the default `emulator-account`. You can then interact with them in the local emulator or on any other network just as you would any contract you've written locally and deployed.

If you want to see what the contract looks like, you can open it up and you will see this:

```
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

Emulator is a local version of the Flow blockchain that you can use to test your contracts and scripts. It's a great way to develop and test your contracts without having to interact with the `testnet` or `mainnet`.

Before we deploy, let's open a new terminal window and run the emulator:

```
flow emulator start
```

To deploy the `HelloWorld` contract to the emulator, you can run the following command:

```
flow project deploy
```

The contract will now have been deployed to the account you selected earlier. You can now interact with it with a script.

## Running Scripts

On Flow, scripts are used to read data from the Flow blockchain. There is no state modification. In our case, we are going to read a greeting from the `HelloWorld` contract.

Let's create a script file. We can generate a boilerplate script file with the following command:

```
flow generate script ReadGreeting
```

This will create a file called `ReadGreeting.cdc` in the `cadence/scripts` directory.  Let's update the script to read the greeting from the `HelloWorld` contract:

```
import "HelloWorld"

access(all)
fun main(): String {
  return HelloWorld.greeting
}
```

The import syntax will automatically resolve the address of the contract on the network you are running the script on. This is determined by your `flow.json` configuration.

> Note: if you'll like to learn more about writing scripts, please [read here](../../basics/scripts.md).

To run the script, we'll run this from the CLI:

```
flow scripts execute cadence/scripts/ReadGreeting.cdc
```

You should see the result of the greeting. `Result: "Hello, world!"`

## Creating an Account and Running a Transaction

To change state on the Flow Blockchain, you need to run a transaction. Let's create a simple transaction file. We can use to modify the `greeting` on the `HelloWorld` contract.

First, create a file called `cadence/transactions/ChangeGreeting.cdc` with the following command:

```
flow generate transaction ChangeGreeting
```

Update the boilerplate transaction to look like this:

```
import "HelloWorld"

transaction(greeting: String) {

  prepare(acct: AuthAccount) {
    log(acct.address)
  }

  execute {
    HelloWorld.changeGreeting(newGreeting: greeting)
  }
}
```

This will log the account signing the transaction, call the `changeGreeting` method of the `HelloWorld` contract, and pass in the new greeting. (If you want to learn more about writing transactions, please [read here](../../basics/transactions.md)).

In order to run a transaction, the signing account needs to pay for it. We could run a transaction on emulator using the default `emulator-account` account. Let's learn one more command for creating accounts.

The easiest way to create an account using CLI is by running (remember, your emulator should still be running at this point in another terminal):

```
flow accounts create
```

Once that runs, select `Emulator` as the network and give your account the name `emulator-tester`. You'll now see this account in your `flow.json`.

To run a transaction with this new account, you can run the following:

```
flow transactions send cadence/transactions/ChangeGreeting.cdc "Hello, me" --signer emulator-tester --network emulator
```

You've just modified the state of the Flow Blockchain!

## More

If you want to continue on generating your own contracts, you can also use the the `generate` subcommand to create a new contract file. See more on the `generate` documentation.

After that, it's easy to add your contract to your project configuration using the Flow CLI `config` commands.
