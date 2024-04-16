---
sidebar_position: 4
---

# Scripts

A script provides a light-weight method to query chain data.

It is executable Cadence code that can query for Flow execution state data but cannot modify it in any way.

Unlike a Flow transaction, a script is not signed and requires no transaction fees. Also unlike a transaction, a script can return a value back to the caller.
You can think of executing a script as a read-only operation, very similar to the `eth_call` RPC method on Ethereum.

Scripts are currently executed on either the Access Nodes or the Execution Nodes based on the Access node configuration.

Scripts are defined by the following the Cadence code:

```cadence
// The 'main' function is the entry point function and every script needs to have one.
pub fun main() {
 // Cadence statements to be executed go here
}
```

Scripts can return a typed value:

```cadence
pub fun main(): Int {
	return 1 + 2
}
```

Scripts can also accept arguments:

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

## When to use a script?

Scripts can be used for the following:

1. Validating a transaction before submitting it e.g. checking if the payer has sufficient balance, the receiver account is setup correctly to receive a token or NFT etc.
2. Collecting chain data over time.
3. Continuously verifying accounts through a background job e.g. a Discord bot that verifies users by their Flow account.
4. Querying core contracts e.g. see [staking scripts and events](../../networks/staking/07-staking-scripts-events.md) for querying staking and epoch related information, see the scripts directory under each of the [core contract transactions](https://github.com/onflow/flow-core-contracts/tree/master/transactions) for other core contracts related scripts.

## Executing Scripts

### Access API

A script can be executed by submitting it to the Access API provided by access nodes. Currently, there are three API endpoints that allow a user to execute scripts at the latest sealed block, a previous block height, or a previous block ID.

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

1. **Rate limit** - Script execution is subjected to API rate-limits imposed by the Access nodes and the Execution nodes. The rate limits for the Public Access nodes hosted by QuickNode are outlined [here](https://www.quicknode.com/docs/flow#endpoint-rate-limits).


2. **Computation limit** - Similar to a transaction, each script is also subjected to a computation limit. The specific value can be configured by individual Access and Execution node operators. Currently, the default compute (gas) limit for a script is 100,000.


3. **Historic block data limit**
   1. Script execution on execution nodes is restricted to approximately the last 100 blocks. Any request for script execution on an execution node on a past block (specified by block ID or block height) will fail if that block is more than 100 blocks in the past.
   2. Script execution on an access node can go much beyond the last 100 blocks but is restricted to the height when the [last](https://developers.flow.com/networks/node-ops/node-operation/past-sporks) network upgrade ([HCU](https://developers.flow.com/networks/node-ops/node-operation/hcu) or spork) occurred. 


