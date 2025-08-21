---
sidebar_position: 1
sidebar_label: Contract Interaction
title: Contract Interaction
description: Learn how to interact with your first smart contract on Flow's Testnet. Understand how to read data from Cadence contracts, execute scripts, and explore the Counter contract example.
keywords:
  - smart contracts
  - Flow Testnet
  - contract interaction
  - Cadence scripts
  - Counter contract
  - contract deployment
  - Flow CLI
  - contract examples
  - blockchain interaction
  - Flow development
  - contract reading
  - script execution
  - Flow dApps
  - contract tutorial
  - Flow quickstart
---

import VerticalSplit from "./vertical-split.svg"

# Contract Interaction

In this quickstart guide, you'll interact with your first smart contract on the Flow Testnet. `Testnet` is a public instance of the Flow blockchain designed for experimentation, where you can deploy and invoke smart contracts without incurring any real-world costs.

Smart contracts on Flow are permanent pieces of code that live on the blockchain. They allow you to encode business logic, define digital assets, and much more. By leveraging smart contracts, you can create decentralized applications (dApps) that are transparent, secure, and open to anyone.

Flow supports modern smart contracts written in [Cadence], a resource-oriented programming language designed specifically for smart contracts. Cadence focuses on safety and security, making it easier to write robust contracts. Flow also supports traditional [EVM]-compatible smart contracts written in Solidity, allowing developers to port their existing Ethereum contracts to Flow. In this guide, we'll focus on interacting with Cadence smart contracts.

## Objectives

After completing this guide, you'll be able to:

- Read data from a [Cadence] smart contract deployed on Flow.
- Understand how to interact with contracts on Flow's `testnet`.
- Retrieve and display data from a deployed smart contract via scripts.

In later steps, you'll learn how to:

- Create a Flow project using the [Flow CLI](../../../build/tools/flow-cli/index.md).
- Add an already-deployed contract to your project with the [Dependency Manager](../../../build/tools/flow-cli/dependency-manager.md).
- Deploy a smart contract locally to the [Flow Emulator](../../../build/tools/emulator/index.md).
- Write and execute transactions to interact with a deployed smart contract.
- Display data from a Cadence smart contract on a React frontend using the [Flow Client Library](../../../build/tools/clients/fcl-js/index.md).

## Calling a Contract With a Script

The `Counter` contract exposes a public function named `getCount()` that returns the current value of the counter. We can retrieve its value using a simple script written in the [Cadence] programming language. Scripts in Cadence are read-only operations that allow you to query data from the blockchain without changing any state.

Here's the script:

```cadence
import Counter from 0x8a4dce54554b225d

access(all)
fun main(): Int {
    return Counter.getCount()
}
```

Let's break down what this script does:

- **Import Statement**: `import Counter from 0x8a4dce54554b225d` tells the script to use the `Counter` contract deployed at the address `0x8a4dce54554b225d` on the `testnet`.
- **Main Function**: `access(all) fun main(): Int` defines the entry point of the script, which returns an `Int`.
- **Return Statement**: `return Counter.getCount()` calls the `getCount()` function from the `Counter` contract and returns its value.

### Steps to Execute the Script

- **Run the Script**: Click the Run button to execute the script.
- **View the Output**: Observe the output returned by the script. You should see the current value of the `count` variable, which is `0` unless it has been modified.

<iframe sandbox className="flow-runner-iframe" src="https://run.dnz.dev/snippet/a7a18e74d27f691a?colormode=dark&output=horizontal&outputSize=400" width="100%" height="400px"></iframe>

## Understanding the `Counter` Contract

To fully grasp how the script works, it's important to understand the structure of the `Counter` contract. Below is the source code for the contract:

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

### Breakdown of the Contract

- **Contract Declaration**: `access(all) contract Counter` declares a new contract named `Counter` that is accessible to everyone.
- **State Variable**: `access(all) var count: Int` declares a public variable `count` of type `Int`. The `access(all)` modifier means that this variable can be read by anyone.
- **Events**: Two events are declared:
  - `CounterIncremented(newCount: Int)`: Emitted when the counter is incremented.
  - `CounterDecremented(newCount: Int)`: Emitted when the counter is decremented.
- **Initializer**: The `init()` function initializes the `count` variable to `0` when the contract is deployed.
- **Public Functions**:
  - `increment()`: Increases the `count` by `1` and emits the `CounterIncremented` event.
  - `decrement()`: Decreases the `count` by `1` and emits the `CounterDecremented` event.
  - `getCount()`: Returns the current value of `count`. The `view` modifier indicates that this function does not modify the contract's state.

### Key Points

- **Public Access**: The `count` variable and the functions `increment()`, `decrement()`, and `getCount()` are all public, allowing anyone to interact with them.
- **State Modification**: The `increment()` and `decrement()` functions modify the state of the contract by changing the value of `count` and emitting events.
- **Read Costs**: Reading data from the blockchain is free on Flow. Executing scripts like the one you ran does not incur any costs. However, transactions that modify state, such as calling `increment()` or `decrement()`, will incur costs and require proper authorization.

### What's Next?

In the upcoming tutorials, you'll learn how to:

- **Modify the Counter**: Invoke the `increment()` and `decrement()` functions to update the `count` value.
- **Deploy Contracts**: Use the Flow CLI to deploy your own smart contracts.
- **Interact with Contracts Locally**: Use the Flow Emulator to test contracts in a local development environment.
- **Build Frontend Applications**: Display data from smart contracts in a React application using the Flow Client Library.

By understanding the `Counter` contract and how to interact with it, you're building a solid foundation for developing more complex applications on the Flow blockchain.

Proceed to the next tutorial to learn how to create your own contracts and deploy them live using the Flow CLI.

<!-- Relative-style links. Does not render on the page -->

[Cadence]: https://cadence-lang.org/
[EVM]: https://flow.com/upgrade/crescendo/evm
