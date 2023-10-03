---
sidebar_position: 1
---
import VerticalSplit from "./vertical-split.svg"

# Hello World Pt. 1 - Basics

Welcome to the Flow blockchain! In this quickstart guide, you'll interact with your first smart contract on our `Testnet`. For those unfamiliar, the Testnet is a public instance of the Flow blockchain designed for experimentation. Here, you can deploy and invoke smart contracts without incurring any real-world costs. 

Smart contracts on Flow are permanent code that live on the blockchain, allowing you to encode business logic, define digital assets, and much more.


## Calling a contract
On Testnet, `HelloWorld` Contract has a public variable named `greeting`, we'll use a Script to get it's value. For the purposes of this quick start, we are embedding Flow Runner website to run a script against Testnet. For reference [Flow Runner](https://run.dnz.dev/) website

The `HelloWorld` contract exposes a public variable named `greeting`. We can retrieve its value using a simple script written in the Cadence programming language.

```
import HelloWorld from 0x9dca641e9a4b691b

pub fun main(): String {
  return HelloWorld.greeting
}
```
 - `Click` <VerticalSplit /> To vertically orient Flow Runner editor. 
 - `Copy` the script above into Flow Runner input area and click "Run". 
 - See the output returned by the script. 

<iframe sandbox className="flow-runner-iframe" src="https://run.dnz.dev/" width="100%" height="400px"></iframe>

## Contract on Testnet

Below is the source code for the HelloWorld contract. As you continue through the next few tutorials, you'll discover how to invoke the `changeGreeting` function to modify the greeting value. Do take note, however, that only the contract's `owner` or permitted accounts can modify the greeting.
```
pub contract HelloWorld {

  pub var greeting: String

  access(account) fun changeGreeting(newGreeting: String) {
    self.greeting = newGreeting
  }

  init() {
    self.greeting = "Hello, World!"
  }
}

```
<Callout type="info">
There are no `read` costs associated with calling contracts. 
</Callout>

Continue to create your own contracts and get them deployed live with Flow CLI!

