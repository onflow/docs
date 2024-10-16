---
sidebar_position: 1
sidebar_label: 1 - Basics
---
import VerticalSplit from "./vertical-split.svg"

# Hello World Part 1 - Basics

Welcome to the Flow blockchain! In this quickstart guide, you'll interact with your first smart contract on our `Testnet`. For those unfamiliar, the Testnet is a public instance of the Flow blockchain designed for experimentation. Here, you can deploy and invoke smart contracts without incurring any real-world costs. 

Smart contracts on Flow are permanent code that live on the blockchain, allowing you to encode business logic, define digital assets, and much more.

Flow supports modern smart contracts written in [Cadence], as well as traditional [EVM] smart contracts written in Solidity.

## Objectives

After completing this guide, you'll be able to:

* Read a public variable on a [Cadence] smart contract deployed on Flow

## Calling a contract

The `HelloWorld` contract exposes a public variable named `greeting` that is accessible to everything outside the contract. We can retrieve its value using a simple script written in the [Cadence] programming language.

```cadence
import HelloWorld from 0xa1296b1e2e90ca5b

access(all) fun main(): String {
  return HelloWorld.greeting
}
```

 - `Click` <VerticalSplit /> To vertically orient Flow Runner editor. 
 - `Copy` the script above into Flow Runner input area and click "Run". 
 - See the output returned by the script. 

<iframe sandbox className="flow-runner-iframe" src="https://run.dnz.dev/" width="100%" height="400px"></iframe>

## Contract on Testnet

Below is the source code for the HelloWorld contract. As you continue through the next few tutorials, you'll discover how to invoke the `changeGreeting` function to modify the greeting value. Do take note, however, that only the contract's `owner` or permitted accounts can modify the greeting.

```cadence
access(all) contract HelloWorld {

  access(all) var greeting: String

  access(account) fun changeGreeting(newGreeting: String) {
    self.greeting = newGreeting
  }

  init() {
    self.greeting = "Hello, World!"
  }
}
```

:::tip

There are no `read` costs associated with calling contracts. 

:::

Continue to create your own contracts and get them deployed live with Flow CLI!

[Cadence]: https://cadence-lang.org/
[EVM]: https://flow.com/upgrade/crescendo/evm
