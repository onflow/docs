---
sidebar_position: 1
---

# Hello, World

Welcome to Flow blockchain, Let's call a contract on Testnet.
## Calling a contract
There exists a HelloWorld Contract on Testnet. Scripts are used to call contracts. For the purposes of this quick start, we are embedding Flow Runner website to run a script against Testnet. For reference [Flow Runner](https://runflow.pratikpatel.io/) website


```
import HelloWorld from 0x9dca641e9a4b691b

pub fun main(): String {
  return HelloWorld.greeting
}
```
Copy the script above into Flow Runner and click "Execute Script" Then scroll down to see the output.


<iframe className="flow-runner-iframe" src="https://runflow.pratikpatel.io/" width="100%" height="400px"></iframe>

## Contract on Testnet

Here is the contract, see the simple Cadence syntax to create a contract.
```
pub contract HelloWorld {

  pub var greeting: String

  pub fun changeGreeting(newGreeting: String) {
    self.greeting = newGreeting
  }

  init() {
    self.greeting = "Hello, World!"
  }
}
```

You can see how simple it is to call a method on a contract. There are no costs associated with calling contracts. Continue to learn how to create your own custom contracts and deploying with Flow CLI


Check out the Flow CLI