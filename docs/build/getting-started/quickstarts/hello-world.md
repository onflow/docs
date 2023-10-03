---
sidebar_position: 1
---
import VerticalSplit from "./vertical-split.svg"

# Hello World Pt. 1 - Basics

Welcome to Flow blockchain, Let's call a contract on Testnet blockchain. Testnet is a public blockchain, you can call contracts without any cost. The Flow blockchain is decentralized data store that allows for custom executable code known as contracts to be deployed and called. Contracts are flexible and live on the Flow blockchain forever. 

## Calling a contract
On Testnet, `HelloWorld` Contract has a public variable named `greeting`, we'll use a Script to get it's value. For the purposes of this quick start, we are embedding Flow Runner website to run a script against Testnet. For reference [Flow Runner](https://run.dnz.dev/) website


```
import HelloWorld from 0x9dca641e9a4b691b

pub fun main(): String {
  return HelloWorld.greeting
}
```
 - `Click` <VerticalSplit /> To vertically split Flow Runner editor. 
 - `Copy` the script above into Flow Runner input area and click "Run". 
 - See the output returned by the script. 

<iframe sandbox className="flow-runner-iframe" src="https://run.dnz.dev/" width="100%" height="400px"></iframe>

## Contract on Testnet

Here is the `HelloWorld` contract, Continue to other getting started examples to learn how to call `changeGreeting` to change the greeting value. Notice that only owner or owner contracts can change the greeting.
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
There are no costs associated with calling contracts. 
</Callout>

Continue to learn how to create and deploy your own contracts with Flow CLI