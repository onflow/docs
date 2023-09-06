---
title: Transaction Fee Guide
---

This guide will explain how to see transaction fees, how they are calculated, and how you can handle fees within your implementation. It will cover estimating and limit fees on emulator, testnet and mainnet and how to optimize Cadence code to reduce transaction costs where possible.

Also, this guide provide information on how to educate your users about fees and how to learn more about the implementation of transaction fees.

Important to understand the concepts behind [Transaction Fees](../concepts/fees) on Flow

**Using Flow Emulator**

You can start the [emulator using the Flow CLI](../tools/toolchains/emulator/index.md#running-the-emulator-with-the-flow-cli). Run your transaction and take a look at the events emitted:

```shell
0|emulator | time="2022-04-06T17:13:22-07:00" level=info msg="⭐  Transaction executed" computationUsed=3 txID=a782c2210c0c1f2a6637b20604d37353346bd5389005e4bff6ec7bcf507fac06
```

You should see the `computationUsed` field. Take a note of the value, you will use it in the next step.

**On testnet or mainnet**

Once a transaction is completed, you can use an explorer like [Flowscan](https://flowscan.org/) to review the transaction details and events emitted. For Flowscan, you can open the transaction in question and look for the event `FeesDeducted` from the [`FlowFees`](https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowFees.cdc) contract:

![flowscan-fees](./flowscan-fees.png)

In the event data on the right side, you will see a set of fields representing [FeeParameters](https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowFees.cdc#L58):

- surgeFactor
- inclusionEffort
- executionEffort

Take a note of the last value in the list - the `executionEffort` value. You will use it in the next step.

### Calculating final costs

The cost for transactions can be calculated using the following FCL scripts on mainnet/testnet respectively.

**On mainnet**

```cadence
import FlowFees from 0xf919ee77447b7497
pub fun main(
  inclusionEffort: UFix64,
  executionEffort: UFix64
): UFix64 {
  return FlowFees.computeFees(inclusionEffort: inclusionEffort, executionEffort: executionEffort)
}
```

**On testnet**

```cadence
import FlowFees from 0x912d5440f7e3769e
pub fun main(
  inclusionEffort: UFix64,
  executionEffort: UFix64
): UFix64 {
  return FlowFees.computeFees(inclusionEffort: inclusionEffort, executionEffort: executionEffort)
}
```

## Configuring execution limits

FCL SDKs allow you to set the execution effort limit for each transaction. Based on the execution effort limit determined in the previous step, you should set a reasonable maximum to avoid unexpected behavior and protect your users. The final transaction fee is computed from the actual execution effort used up to this maximum.

> **Note**: Keep in mind that the limits are not for the final fees that the user will have to pay. The limits are for the execution efforts specifically.

It is important to set a limit that isn’t too high or too low. If it is set too high, the payer needs to have more funds in their account before sending the transaction. If it is too low, the execution could fail and all state changes are dropped.

**Using FCL JS SDK**

You need to set the `limit` parameter for the `mutate` function, for example:

```js
import * as fcl from "@onflow/fcl"

const transactionId = await fcl.mutate({
  cadence: `
    transaction {
      execute {
        log("Hello from execute")
      }
    }
  `,
  proposer: fcl.currentUser,
  payer: fcl.currentUser,
  limit: 100
})

const transaction = await fcl.tx(transactionId).onceSealed();
console.log(transaction;)
```

**Using FCL Go SDK**

You need to call the `SetComputeLimit` method to set the fee limit, for example:

```go
import (
    "github.com/onflow/flow-go-sdk"
    "github.com/onflow/flow-go-sdk/crypto"
)

var (
    myAddress    flow.Address
    myAccountKey flow.AccountKey
    myPrivateKey crypto.PrivateKey
)

tx := flow.NewTransaction().
    SetScript([]byte("transaction { execute { log(\"Hello, World!\") } }")).
    SetComputeLimit(100).
    SetProposalKey(myAddress, myAccountKey.Index, myAccountKey.SequenceNumber).
    SetPayer(myAddress)
```

### Maximum transaction fees of a transaction

The maximum possible fees the payer could pay for a transaction can be calculated as the inclusion cost plus the execution cost as if the transaction was executed with execution effort equal to the transactions specified execution effort limit.

The payer will never pay more than this amount for the transaction.

## Optimizing Cadence code to reduce effort

Several optimizations can lead to reduced execution time of transactions. Below is a list of some practices. This list is not exhaustive but rather exemplary.

**Limit functions calls**

Whenever you make function calls, make sure these are absolutely required. In some cases, you might be able to check prerequisites and avoid additional calls:

```cadence
for obj in sampleList {
   /// check if call is required
   if obj.id != nil {
      functionCall(obj)
   }
}
```

**Limit loops and iterations**

Whenever you want to iterate over a list, make sure it is necessary to iterate through all elements as opposed to a subset. Avoid loops to grow in size too much over time. Limit loops when possible.

```cadence
// Iterating over long lists can be costly
pub fun sum(list: [Int]): Int {
 var total = 0
 var i = 0
 // if list grows too large, this might not be possible anymore
 while i < list.length {
   total = total + list[i]
 }
 return total
}

// Consider designing transactions (and scripts) in a way where work can be "chunked" into smaller pieces
pub fun partialSum(list: [Int], start: Int, end: Int): Int {
 var partialTotal = 0
 var i = start
 while i < end {
   partialTotal = partialTotal + list[i]
 }
 return partialTotal
}
```

**Understand the impact of function calls**

Some functions will require more execution efforts than others. You should carefully review what function calls are made and what execution they involve.

```cadence
// be aware functions that call a lot of other functions
// (or call themselves) might cost a lot
pub fun fib(_ x: Int): Int {
 if x == 1 || x== 0 {
   return x
 }
 // + 2 function calls each recursion
 return fib(x-1) + fib(x-2)
}

// consider inlining functions with single statements, to reduce costs
pub fun add(_ a: Int, _ b: Int): Int {
 // single statement; worth inlining
 return a + b
}
```

**Avoid excessive load and save operations**

Avoid costly loading and storage operations and [borrow references](../cadence/design-patterns.mdx#avoid-excessive-load-and-save-storage-operations-prefer-in-place-mutations) where possible, for example:

```cadence
transaction {

    prepare(acct: AuthAccount) {

        // Borrows a reference to the stored vault, much less costly operation that removing the vault from storage
        let vault <- acct.borrow<&ExampleToken.Vault>(from: /storage/exampleToken)

        let burnVault <- vault.withdraw(amount: 10)

        destroy burnVault

        // No `save` required because we only used a reference
    }
}
```

> **Note**: If the requested resource does not exist, no reading costs are charged.

**Limit accounts created per transaction**

Creating accounts and adding keys are associated with costs. Try to only create accounts and keys when necessary.

**Check user’s balance before executing transactions**

You should ensure that the user’s balance has enough balance to cover the highest possible fees. For FT transfers, you need to cover the amount to transfer in addition to the highest possible fees.

## Educating users

Wallets will handle the presentation of the final transaction costs but you can still facilitate the user experience by educating them within your application.

If your user is using self-custody wallets, they may have to pay the transaction and want to understand the fees. Here are some suggestions.

**Explain that costs can vary depending on the network usage**

Suggested message: “Fees improve the security of the network. They are flexible to ensure fair pricing based on the impact on the network.”

**Explain that waiting for the network surge to pass is an option**

Inevitably, network surges will cause higher fees. Users who might want to submit a transaction while the network usage is surging should consider sending the transaction at a later time to reduce costs.

**Explain that the wallet might not allow the transaction due to a lack of funds**

If dynamic fees increase to the highest possible level, the user’s fund might not be enough to execute the transaction. Let the users know that they should either add funds or try when the network is less busy.

## How to learn more

There are several places to learn more about transaction fees:

- [FLIP-660](https://github.com/onflow/flow/pull/660)
- [FLIP-753](https://github.com/onflow/flow/pull/753)
- [Flow Fees Contract](https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowFees.cdc)

> **Note**: If you have thoughts on the implementation of transaction fees on Flow, you can [leave feedback on this forum post](https://forum.onflow.org/t/variable-transaction-fees-are-coming-to-flow/2941).

## FAQs

**When will the fee update go into effect?**

The updates were rolled out with the [Spork on April 6, 2022](../building-on-flow/nodes/node-operation/past-sporks.mdx#mainnet-17), and were enabled on [June 1st](https://forum.onflow.org/t/permissionless-contract-deployment-progress/2981) during the [weekly epoch transition](https://github.com/onflow/service-account/tree/main/transactions/set-execution-effort-weights/2022/jun-1).

**Why are fees collected even when transactions fail?**

Broadcasting and verifying a transaction requires execution, so costs are deducted appropriately.

**What execution costs are considered above average?**

There is no average for execution costs. Every function will vary significantly based on the logic implemented. You should review the optimization best practices to determine if you could reduce your costs.

**Do hardware wallets like Ledger support segmented fees?**

Yes.

**What is the lowest execution cost?**

The lowest execution cost is 1. This means your transaction included one function call or loop that didn't read or write any date.

**Can I determine how much a transaction will cost on mainnet without actually paying?**

You can estimate the costs in a two-way process: 1) determine execution costs for transactions (emulator or testnet) and 2) use an FCL SDK method to calculate the final transaction fees.

**How accurate will testnet fees be to mainnet fees?**

Final fees are determined by the surge factor on the network. The surge factor for the testnet will be different from the factor for the mainnet, so you need to expect a variation between mainnet and testnet estimates.

**I use Blocto and I haven't paid any fees yet. Why is that?**

That is because Blocto is acting as the payer for transactions. self-custody wallets may have the user pay the transaction. Additionally, apps can sponsor the transaction if they choose.
