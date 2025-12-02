---
sidebar_position: 4
title: Scripts
description: Learn about Flow scripts - read-only Cadence code that can query blockchain state without fees. Understand how to write, execute, and optimize scripts for accessing Flow network data.
keywords:
  - scripts
  - Cadence scripts
  - blockchain queries
  - read operations
  - Flow scripts
  - script execution
  - state queries
  - Flow API
  - script limitations
  - best practices
  - historic data
  - script arguments
  - script returns
  - Flow CLI
  - computation limits
---

# Scripts

A script provides a light-weight method to query chain data.

It is executable Cadence code that can query for Flow execution state data but cannot modify it in any way.

Unlike a Flow transaction, a script is not signed and requires no transaction fees. Also unlike a transaction, a script can return a value back to the caller. You can think of script execution as a read-only operation, very similar to the `eth_call` RPC method on Ethereum.

Scripts are currently executed on either the Access Nodes or the Execution Nodes based on the Access node configuration.

Scripts are defined by the following the Cadence code:

```cadence
// The 'main' function is the entry point function and every script needs to have one.
access(all) fun main() {
 // Cadence statements to be executed go here
}
```

Scripts can return a typed value:

```cadence
access(all) fun main(): Int {
	return 1 + 2
}
```

Scripts can also accept arguments:

```cadence
access(all) fun main(arg: String): String {
	return "Hello ".concat(arg)
}
```

Scripts can call contract functions and query the state of a contract. To call a function on another contract, import it from its address and invoke the function:

```cadence
import World from 0x01

access(all) fun main(): String {
	return World.hello()
}
```

Scripts can also be run against previous blocks, which allows you to query historic data from the Flow network. This is particularly useful to retrieve historical states of contracts or track changes over time.

## When to use a script?

Scripts can be used for the following:

1. Validate a transaction before you submit it (for example, confirm that if the payer has sufficient balance, the receiver account is setup correctly to receive a token or NFT).
2. Collect chain data over time.
3. Continuously verify accounts through a background job, such as a Discord bot that verifies users by their Flow account.
4. Query core contracts. For an example, see how to [query staking and epoch related information]. Also, see the scripts directory under each of the [core contract transactions] for other core contracts related scripts.

## Execute Scripts

### Access API

To execute a script, submit it to the Access API provided by access nodes. Currently, there are three API endpoints that allow a user to execute scripts at the latest sealed block, a previous block height, or a previous block ID.

[**gRPC Script API**]

[**REST Script API**]

There are multiple SDKs implementing the above APIs for different languages:

[**Javascript SDK**]

[**Go SDK**]

Find a list of all SDKs [here]

### Flow CLI

You can also execute a script with the [Flow CLI]:

```sh
flow scripts execute ./helloWorld.cdc
```

A user can define their own scripts or can use already defined scripts by the contract authors that can be found with the [FLIX] service.

## Best Practices

The following are some recommendations for how to write efficient scripts:

1. **Simpler and shorter scripts**: Scripts, like transactions, are subject to computation limits (see [limitations]).We recommend that you run shorter and simpler scripts which have low time complexity for a faster response. If you have a script with several nested loops, long iteration, or that queries many onchain fields, we recommend that you simplify the script logic.

2. **Fewer state reads**: A script reads execution state and to get a faster response, it is best to limit the amount of state that is read by the script.

3. **Smaller length of array or dictionary type arguments**: If your script requires an array or a dictionary as an argument where each element causes a state lookup, instead of a single script call that passes in a long list, make multiple calls with a smaller subset of the array or dictionary.

4. **NFTCatalog**: If your script uses the [NFTCatalog] functions, ensure that you use the [latest functions] and do not use any of the deprecated functions such as `getCatalog()`.

## Limitations

1. **Rate limit** - Script execution is subjected to API rate-limits imposed by the Access nodes and the Execution nodes. The rate limits for the Public Access nodes hosted by QuickNode are outlined [outlined here].

2. **Computation limit** - Similar to a transaction, each script is also subjected to a computation limit. The specific value can be configured by individual Access and Execution node operators. Currently, the default compute unit (gas) limit for a script is 100,000.

3. **Historic block data limit**
   1. Script execution on execution nodes is restricted to approximately the last 100 blocks. Any request for script execution on an execution node on a past block (specified by block ID or block height) will fail if that block is more than 100 blocks in the past.
   2. Script execution on an access node can go much beyond the last 100 blocks but is restricted to the height when the [last] network upgrade ([HCU] or spork) occurred.

<!-- Relative links, will not render on page -->

[query staking and epoch related information]: ../../../protocol/staking/07-staking-scripts-events.md
[core contract transactions]: https://github.com/onflow/flow-core-contracts/tree/master/transactions
[**gRPC Script API**]: ../../../protocol/access-onchain-data/index.md#scripts
[**REST Script API**]: /http-api#tag/Scripts
[**Javascript SDK**]: ../../../build/tools/clients/fcl-js/index.md
[**Go SDK**]: ../../../build/tools/clients/flow-go-sdk/index.md
[here]: ../../../build/tools/clients/index.md
[Flow CLI]: ../../../build/tools/flow-cli/scripts/execute-scripts
[FLIX]: ../../../build/tools/flow-cli/flix
[limitations]: #limitations
[NFTCatalog]: https://github.com/onflow/nft-catalog 
[latest functions]: https://github.com/onflow/nft-catalog?tab=readme-ov-file#using-the-catalog-for-marketplaces-and-other-nft-applications
[outlined here]: https://www.quicknode.com/docs/flow#endpoint-rate-limits
[last]: https://developers.flow.com/protocol/node-ops/node-operation/past-upgrades 
[HCU]: https://developers.flow.com/protocol/node-ops/node-operation/hcu