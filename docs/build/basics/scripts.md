---
sidebar_position: 4
---

# Scripts

A script is executable Cadence code that queries the Flow network but does not modify it. Unlike Flow transactions, they don’t need to be signed and require no transaction fees. Also unlike transactions, scripts can return a value. You can think of executing scripts as a read-only operation very similar to the `eth_call` RPC method on Ethereum. 

Scripts are currently executed on either the Access Nodes or the Execution Nodes based on the Access node setup.

Scripts are defined by following the Cadence code:

```cadence
// The main function is the entry point function and every script needs to have one.
pub fun main() {
 // Cadence statements to be executed go here
}
```

Scripts can return a typed value.

```cadence
pub fun main(): Int {
	return 1 + 2
}
```

Scripts can accept arguments.

```cadence
pub fun main(arg: String): String {
	return "Hello ".concat(arg)
}
```

Scripts can call contract functions and query the state of a contract. To call a function on another contract, import it from its address and invoke the function:

```cadence
import World from 0x01

pub fun main(): String {
	return World.hello()
}
```

Scripts can also be run against previous blocks, allowing you to query historic data from the Flow network. This is particularly useful for retrieving historical states of contracts or tracking changes over time.

## Why use a script?

A script provide a light-weight method to query chain data. It can be used for the following:

1. Validating a transaction before submitting it e.g. checking if the payer has sufficient balance, the receiver account is setup correctly to receive a token or NFT etc.
2. Collecting chain data over time.
3. Continuously verifying accounts through a background job e.g. a Discord bot that verifies users by their Flow account.
4. Querying core contracts e.g. see [staking scripts and events](../../networks/staking/07-staking-scripts-events.md) for querying staking and epoch related information, see the scripts directory under each of the [core contract transactions](https://github.com/onflow/flow-core-contracts/tree/master/transactions) for other core contracts related scripts.

## Executing Scripts

### Access API

A Script can be executed by being submitted it to the Access Node APIs provided by the access nodes. Currently, there’s support for three APIs which allows a user to execute script at the latest sealed block or a previous block height or previous block ID.

[**gRPC Script API**](../../networks/node-ops/access-onchain-data/access-nodes/accessing-data/access-api.md#scripts)

[**REST Script API**](/http-api#tag/Scripts)

There are multiple SDKs implementing the above APIs for different languages:

[**Javascript SDK**](../../tools/clients/fcl-js/index.md)

[**Go SDK**](../../tools/clients/flow-go-sdk/index.mdx)

Find a list of all SDKs [here](../../tools/clients/index.md)

### Flow CLI

You can also execute a script by using the [Flow CLI](../../tools/flow-cli/scripts/execute-scripts):

```sh
flow scripts execute ./helloWorld.cdc
```

A user can define their own scripts or can use already defined scripts by the contract authors that can be found by using the [FLIX](../../tools/flow-cli/flix) service.

## Limitations

1. Rate limits - Script execution is subjected to API rate-limits imposed by the Access node. The rate limits for the Public Access nodes hosted by QuickNode is available [here](https://www.quicknode.com/docs/flow#endpoint-rate-limits).

2. Computation limits - Similar to a transaction, script also have computation limits. Currently, the compute (gas) limit for script is 100,000.

3. Historic block data - Script execution on the execution node is restricted to approximately the last 600 blocks. Any request for script execution on an execution node by block (ID or height) will fail if the block is more than 600 blocks in the past. Script execution on an access node can go much beyond the last 600 blocks but is restricted to the height when the [last](https://developers.flow.com/networks/node-ops/node-operation/past-sporks) network upgrade ([HCU](https://developers.flow.com/networks/node-ops/node-operation/hcu) or spork) occurred. 


