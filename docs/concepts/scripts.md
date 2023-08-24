---
sidebar_position: 4
---

# Scripts

A script is an executable Cadence code that queries the Flow network but does not modify it. Unlike Flow transactions, they don’t need signing and they can return a value. You can think of executing scripts as a read-only operation. 

Scrips are executed on Access Nodes, Archive Nodes, or Execution Nodes. 

Scripts are defined by following the Cadence code and we can only execute one at a time.

```cadence
pub fun main() {}
```

Scripts can return a typed value like so:

```cadence
pub fun main(): Int {
	return 1 + 2
}
```

The most useful things we can do with scripts are call contract functions and query the state of a contract. It can do so by importing the contract and calling a function on it:

```cadence
import World from 0x01

pub fun main(): String {
	return World.hello()
}
```

## Executing Scripts

The easiest way to execute a script is by using the Flow CLI:

```sh
flow scripts execute ./helloWorld.cdc
```

A user can define their own scripts or it can use already defined scripts by the contract authors that can be found by using the FLIX service.

Scripts can be run against previous blocks, allowing you to query historic data from the Flow network. This is particularly useful for retrieving historical states of contracts or tracking changes over time.

Scripts are executed by being submitted to the Access Node APIs. Currently, there’s support for two APIs:

[**gRPC Script API**](../concepts/nodes/access-api.mdx#scripts)

[**REST Script API**](/http-api#tag/Scripts)

There are multiple SDKs implementing the above APIs for different languages:

[**Javascript SDK**](../tools/clients/fcl-js/index.md)

[**Go SDK**](../tools/clients/flow-go-sdk/index.mdx)

Find a list of all SDKs [here](../tools/clients/index.md)
