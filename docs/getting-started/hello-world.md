---
title: Hello World Quickstart
sidebar_label: Hello World Quickstart
sidebar_position: 1
---

# Hello, World

Welcome to Flow blockchain, Let's call a contract on Testnet blockchain. Testnet is a public blockchain, you can call contracts without any cost. The Flow blockchain is decentralized data store that allows for custom executable code known as contracts to be deployed and called. Contracts are flexible and live on the Flow blockchain forever. 

## Calling a contract
On Testnet, `HelloWorld` Contract has a public variable named `greeting`, we'll use a Script to get it's value. For the purposes of this quick start, we are embedding Flow Runner website to run a script against Testnet. For reference [Flow Runner](https://runflow.pratikpatel.io/) website


```
import HelloWorld from 0x9dca641e9a4b691b

pub fun main(): String {
  return HelloWorld.greeting
}
```
`Copy` the script above into Flow Runner and click "Execute Script" Then scroll down to see the output. 
Ignore the `red underline` of HelloWorld. Fixing this will be in future learnings. 

<iframe className="flow-runner-iframe" src="https://runflow.pratikpatel.io/" width="100%" height="400px"></iframe>

## Contract on Testnet

Here is the `HelloWorld` contract, Continue to other getting started examples to learn how to call `changeGreeting` to change the greeting value. 
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
<Callout type="info">
There are no costs associated with calling contracts. 
</Callout>

Continue to learn to create your own contracts and deploying with Flow CLI