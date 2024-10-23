---
sidebar_position: 1
sidebar_label: Hello World
---
import VerticalSplit from "./vertical-split.svg"

# Hello World

In this quickstart guide, you'll interact with your first smart contract on the Flow Testnet. `Testnet` is a public instance of the Flow blockchain designed for experimentation, where you can deploy and invoke smart contracts without incurring any real-world costs.

Smart contracts on Flow are permanent pieces of code that live on the blockchain. They allow you to encode business logic, define digital assets, and much more. By leveraging smart contracts, you can create decentralized applications (dApps) that are transparent, secure, and open to anyone.

Flow supports modern smart contracts written in [Cadence], a resource-oriented programming language designed specifically for smart contracts. Cadence focuses on safety and security, making it easier to write robust contracts. Flow also supports traditional [EVM]-compatible smart contracts written in Solidity, allowing developers to port their existing Ethereum contracts to Flow. In this guide, we'll focus on interacting with Cadence smart contracts.

## Objectives

After completing this guide, you'll be able to:

* Read a public variable on a [Cadence] smart contract deployed on Flow.
* Understand how to interact with contracts on Flow's `testnet`. 
* Retrieve and display data from a deployed smart contract via scripts.

In later steps, you'll learn how to:

* Create a Flow project using the [Flow CLI](../../tools/flow-cli).
* Add an already-deployed contract to your project with the [Dependency Manager](../../tools/flow-cli/dependency-manager.md).
* Deploy a smart contract locally to the [Flow Emulator](../../tools/emulator).
* Write and execute transactions to interact with a deployed smart contract.
* Display data from a Cadence smart contract on a React frontend using the [Flow Client Library](../../tools/clients/fcl-js).


## Calling a Contract With a Script

The `HelloWorld` contract exposes a public variable named `greeting` that is accessible to everything outside the contract. We can retrieve its value using a simple script written in the [Cadence] programming language. Scripts in Cadence are read-only operations that allow you to query data from the blockchain without changing any state.

Here's the script:

```cadence
import HelloWorld from 0xa1296b1e2e90ca5b

access(all) fun main(): String {
  return HelloWorld.greeting
}
```

Let's break down what this script does:

- **Import Statement**: `import HelloWorld from 0xa1296b1e2e90ca5b` tells the script to use the `HelloWorld` contract deployed at the address `0xa1296b1e2e90ca5b` on the `testnet`.
- **Main Function**: `access(all) fun main(): String` defines the entry point of the script, which returns a `String`.
- **Return Statement**: `return HelloWorld.greeting` accesses the greeting variable from the `HelloWorld` contract and returns its value.

### Steps to Execute the Script

- **Run the Script**: Click the Run button to execute the script.
- **View the Output**: Observe the output returned by the script. You should see the current value of the `greeting` variable, which is `"Hello, World!"`.

<iframe sandbox className="flow-runner-iframe" src="https://run.dnz.dev/snippet/2b3ec75d38d01dfa?colormode=dark&output=horizontal&outputSize=400" width="100%" height="400px"></iframe>

## Understanding the `HelloWorld` Contract

To fully grasp how the script works, it's important to understand the structure of the `HelloWorld` contract. Below is the source code for the contract:

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

### Breakdown of the Contract

- **Contract Declaration**: `access(all) contract HelloWorld` declares a new contract named `HelloWorld` that is accessible to everyone.
- **State Variable**: `access(all) var greeting: String` declares a public variable `greeting` of type `String`. The `access(all)` modifier means that this variable can be read by anyone.
- **Function to Change Greeting**: `access(account) fun changeGreeting(newGreeting: String)` defines a function that allows changing the value of `greeting`. The `access(account)` modifier restricts this function so that only the account that deployed the contract (the owner) can call it.
- **Initializer**: The `init()` function is called when the contract is deployed. It sets the initial value of `greeting` to `"Hello, World!"`.

### Key Points

- **Public Access**: The `greeting` variable is public, allowing anyone to read its value without any restrictions.
- **Restricted Modification**: Only the contract owner can modify the `greeting` variable using the `changeGreeting` function. This ensures that unauthorized accounts cannot change the contract's state.
- **No Read Costs**: Reading data from the blockchain is free on Flow. Executing scripts like the one you ran does not incur any costs.

### What's Next?

In the upcoming tutorials, you'll learn how to:

- **Modify the Greeting**: Invoke the `changeGreeting` function to update the `greeting` value.
- **Deploy Contracts**: Use the Flow CLI to deploy your own smart contracts.
- **Interact with Contracts Locally**: Use the Flow Emulator to test contracts in a local development environment.
- **Build Frontend Applications**: Display data from smart contracts in a React application using the Flow Client Library.

By understanding the `HelloWorld` contract and how to interact with it, you're building a solid foundation for developing more complex applications on the Flow blockchain.

Proceed to the next tutorial to learn how to create your own contracts and deploy them live using the Flow CLI.

<!-- Relative-style links.  Does not render on the page -->

[Cadence]: https://cadence-lang.org/
[EVM]: https://flow.com/upgrade/crescendo/evm