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

Lets first create the scaffolded project:

```
flow setup cli-quickstart
```

And then let's navigate to our new directory:

```
cd cli-quickstart
```

If you look at `flow.json` now, you'll see its listed access nodes for networks and accounts. The default `emulator-account` create will come in handy when we want to run the emulator.

```json
{
  "contracts": {
    "FlowToken": {
      "source": "cadence/contracts/utility/FlowToken.cdc",
      "aliases": {
        "emulator": "0ae53cb6e3f42a79",
        "testnet": "7e60df042a9c0868",
        "mainnet": "1654653399040a61"
      }
    },
    "FungibleToken": {
      "source": "cadence/contracts/utility/FungibleToken.cdc",
      "aliases": {
        "emulator": "ee82856bf20e2aa6",
        "testnet": "9a0766d93b6608b7",
        "mainnet": "f233dcee88fe0abe"
      }
    },
    "FungibleTokenMetadataViews": {
      "source": "cadence/contracts/utility/FungibleTokenMetadataViews.cdc",
      "aliases": {
        "emulator": "ee82856bf20e2aa6",
        "testnet": "9a0766d93b6608b7",
        "mainnet": "f233dcee88fe0abe"
      }
    },
    "MetadataViews": {
      "source": "cadence/contracts/utility/MetadataViews.cdc",
      "aliases": {
        "emulator": "f8d6e0586b0a20c7",
        "testnet": "631e88ae7f1d7c20",
        "mainnet": "1d7e57aa55817448"
      }
    },
    "RandomBeaconHistory": {
      "source": "cadence/contracts/utility/RandomBeaconHistory.cdc",
      "aliases": {
        "emulator": "f8d6e0586b0a20c7",
        "testnet": "8c5303eaa26202d6",
        "mainnet": "e467b9dd11fa00df"
      }
    },
    "ViewResolver": {
      "source": "cadence/contracts/utility/ViewResolver.cdc",
      "aliases": {
        "emulator": "f8d6e0586b0a20c7",
        "testnet": "631e88ae7f1d7c20",
        "mainnet": "1d7e57aa55817448"
      }
    },
    "NonFungibleToken": {
      "source": "cadence/contracts/kitty-items/NonFungibleToken.cdc",
      "aliases": {
        "emulator": "f8d6e0586b0a20c7",
        "testnet": "631e88ae7f1d7c20",
        "mainnet": "1d7e57aa55817448"
      }
    }
  },
  "networks": {
    "emulator": "127.0.0.1:3569",
    "mainnet": "access.mainnet.nodes.onflow.org:9000",
    "testnet": "access.devnet.nodes.onflow.org:9000"
  },
  "accounts": {
    "emulator-account": {
      "address": "f8d6e0586b0a20c7",
      "key": "6d12eebfef9866c9b6fa92b97c6e705c26a1785b1e7944da701fc545a51d4673"
    }
  }
}

```


:::info

For additional details on how `flow.json` is configured, [read here.](../../../tools/flow-cli/flow.json/configuration.md)

:::

## Running Scripts

On Flow, scripts are used to read data from the Flow blockchain. There is no state modification. In our case, we are going to read a greeting from a contract deployed to `testnet` called `HelloWorld`. (You can [view the contract here](https://f.dnz.dev/0x9dca641e9a4b691b/HelloWorld))

Let's create a script file. We can generate a boilerplate script file with the following command:

```
flow generate script ReadGreeting
```

This will create a file called `ReadGreeting.cdc` in the `cadence/scripts` directory.  Let's update the script to read the greeting from the `HelloWorld` contract:

```
import HelloWorld from 0x9dca641e9a4b691b

access(all)
fun main(): String {
  return HelloWorld.greeting
}
```

In the above example, `0x9dca641e9a4b691b` is the address where the `HelloWorld` contract has been deployed to on `testnet`. (Note: if you'll like to learn more about writing scripts, please [read here](../../basics/scripts.md)).

To run the script, we'll run this from the CLI:

```
flow scripts execute cadence/scripts/ReadGreeting.cdc --network testnet
```

You should see the result of the greeting. `Result: "Hello, world!"`

## Running the Contract Locally on Emulator

The Flow Emulator is a local, lightweight, and standalone version of the Flow blockchain. It's designed to provide developers with a local environment for testing and development purposes without having to interact with the `mainnet` or `testnet`. This makes it easier and faster to develop, test, and debug smart contracts and apps.

In order to use it, let's update our project configuration. 

Let's create a local version of the HelloWorld contract. To do that, we'll again use the `generate` subcommand of the CLI to create a boilerplate contract. Except this time, we'll generate a contract file at `cadence/contracts/HelloWorld.cdc`.

```
flow generate contract HelloWorld
```

Now let's update the contract to have a `greeting` variable and a `changeGreeting` function that will allow us to change the greeting.

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

Next we need to add our `HelloWorld` contract to our `flow.json` configuration that will describe our project setup. We can do that by running the following command:

```
flow config add contract
```

This will prompt you to enter the contract name and the contract file location. For our case, we'll enter `HelloWorld` and `cadence/contracts/HelloWorld.cdc` respectively. For the `testnet` alias prompt you can use the address of the HelloWorld contract on testnet `0x9dca641e9a4b691b`. Skip the `mainnet` and `emulator` prompts for this tutorial.

Your `flow.json` should now look like this:

```
// flow.json

{
...
"contracts": {
  "HelloWorld": {
    "source": "cadence/contracts/HelloWorld.cdc",
    "aliases": {
      "testnet": "0x9dca641e9a4b691b"
    }
  }
}
...
}
```

We're also going to change the imports of our script so that there are no hardcoded network specific addresses. The CLI can figure out how to interact with the network (i.e. emulator, testnet or mainnet) based on our configuration.

```
// script.cdc

import "HelloWorld"

access(all)
fun main(): String {
  return HelloWorld.greeting
}

```

Next, we need to add our contract to the `deployments` section to `flow.json` and define what account we'd like what contract deployed to and on what network. You can add this easily by running the following command:

```
flow config add deployment
```

When prompted, enter `emulator` for the network, `emulator-account` for the account, and `HelloWorld` for the contract. Skip the `testnet` and `mainnet` prompts for this tutorial.

Your `flow.json` should now look have the following section:

```
// flow.json

{
...
"deployments": {
  "emulator": {
    "emulator-account": ["HelloWorld"]
}
...
}
```

Next let's run the emulator in a new terminal with:

```
flow emulator start
```

And then deploy the contract with:

```
flow project deploy
```

Now if we run the following script we should see the result of the script against our emulator deployed contract.

```
flow scripts execute cadence/scripts/ReadGreeting.cdc --network emulator
```

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

## Next Steps

Dive deeper by checking out the scaffolds generated by the Flow CLI. They can serve as a great starting point for any project you're trying to create. See how to [create a scaffold here](../../../tools/flow-cli/index.md).
