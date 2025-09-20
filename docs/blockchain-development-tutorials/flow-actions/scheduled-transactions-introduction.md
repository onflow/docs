---
title: Introduction to Scheduled Transactions
description: Learn how to implement scheduled transactions for time-based smart contract execution on Flow
sidebar_position: 5
keywords:
  - scheduled transactions
  - flow callback scheduler
  - time-based execution
  - blockchain automation
  - deferred actions
  - recurring jobs
  - smart contract scheduling
  - flow blockchain
  - cadence smart contracts
  - defi automation
---

# Introduction to Scheduled Transactions

:::warning

Scheduled transactions are a new feature that is under development and is a part of [FLIP 330]. Currently, they only work in the emulator. The specific implementation may change as a part of the development process.

These tutorials will be updated, but you may need to refactor your code if the implementation changes.

:::

Flow, EVM, and other blockchains are a form of a **single** shared computer that anyone can use and no one has admin privileges, super user roles, or complete control. For this to work, one of the requirements is that it needs to be impossible for any user to freeze the computer, on purpose or by accident.

As a result, most blockchain computers, including EVM and Solana, are not [Turing Complete], because they can't run an unbounded loop. Each transaction must take place within one block, and cannot consume more gas than the limit.

While this limitation prevents infinite loops, it makes it so that you can't do anything 100% onchain if you need it to happen at a later time or after a trigger. As a result, developers must often build products that involve a fair amount of traditional infrastructure and requires users to give those developers a great amount of trust that their backend will execute the promised task.

Flow fixes this problem with **scheduled transactions**. Scheduled transactions let smart contracts execute code at (or after) a chosen time without an external transaction. You schedule work now; the network executes it later. This enables recurring jobs, deferred actions, and autonomous workflows.

## Learning Objectives

After completing this tutorial, you will be able to:

- Understand the concept of scheduled transactions and how they solve blockchain limitations
- Explain the key components of the FlowTransactionScheduler system
- Implement a basic scheduled callback using the provided scaffold
- Analyze the structure and flow of scheduled callback transactions
- Create custom scheduled callback contracts and handlers
- Evaluate the benefits and use cases of scheduled transactions in DeFi applications

# Prerequisites

## Cadence Programming Language

This tutorial assumes you have a modest knowledge of [Cadence]. If you don't, you'll be able to follow along, but you'll get more out of it if you complete our series of [Cadence] tutorials. Most developers find it more pleasant than other blockchain languages and it's not hard to pick up.

## Getting Started

Begin by creating a new repo using the [Scheduled Transactions Scaffold] as a template.

This repository has a robust quickstart in the readme. Complete that first. It doesn't seem like much at first. The counter was at `0`, you ran a transaction, now it's at `1`. What's the big deal?

Let's try again to make it clearer what's happening. Open `cadence/transactions/ScheduleIncrementIn.cdc` and look at the arguments for the transaction:

```cadence
transaction(
    delaySeconds: UFix64,
    priority: UInt8,
    executionEffort: UInt64,
    callbackData: AnyStruct?
)
```

The first parameter is the delay in seconds for the callback. Let's try running it again. You'll need to be quick on the keyboard, so feel free to use a higher number of `delaySeconds` if you need to. You're going to:

1. Call the script to view the counter
2. Call the transaction to schedule the counter to increment after 10 seconds
3. Call the script to view the counter again and verify that it hasn't changed yet
4. Wait 10 seconds, call it again, and confirm the counter incremented

For your convenience, the updated transaction call is:

```zsh
flow transactions send cadence/transactions/ScheduleIncrementIn.cdc \
  --network emulator --signer emulator-account \
  --args-json '[
    {"type":"UFix64","value":"20.0"},
    {"type":"UInt8","value":"1"},
    {"type":"UInt64","value":"1000"},
    {"type":"Optional","value":null}
  ]'
```

And the call to run the script to get the count is:

```zsh
flow scripts execute cadence/scripts/GetCounter.cdc --network emulator
```

The result in your terminal should be similar to:

```zsh
briandoyle@Mac scheduledtransactions-scaffold % flow scripts execute cadence/scripts/GetCounter.cdc --network emulator

Result: 2

briandoyle@Mac scheduledtransactions-scaffold % flow transactions send cadence/transactions/ScheduleIncrementIn.cdc \
  --network emulator --signer emulator-account \
  --args-json '[
    {"type":"UFix64","value":"10.0"},
    {"type":"UInt8","value":"1"},
    {"type":"UInt64","value":"1000"},
    {"type":"Optional","value":null}
  ]'
Transaction ID: 61cc304cee26ad1311cc1b0bbcde23bf2b3a399485c2b6b8ab621e429abce976
Waiting for transaction to be sealed...⠹

Block ID        6b9f5138901cd0d299adea28e96d44a6d8b131ef58a9a14a072a0318da0ad16b
Block Height    671
Status          ✅ SEALED
ID              61cc304cee26ad1311cc1b0bbcde23bf2b3a399485c2b6b8ab621e429abce976
Payer           f8d6e0586b0a20c7
Authorizers     [f8d6e0586b0a20c7]

# Output omitted for brevity

briandoyle@Mac scheduledtransactions-scaffold % flow scripts execute cadence/scripts/GetCounter.cdc --network emulator

Result: 2


briandoyle@Mac scheduledtransactions-scaffold % flow scripts execute cadence/scripts/GetCounter.cdc --network emulator

Result: 2


briandoyle@Mac scheduledtransactions-scaffold % flow scripts execute cadence/scripts/GetCounter.cdc --network emulator

Result: 3
```

### Review of the Existing Contract and Transactions

If you're not familiar with it, review `cadence/contracts/Counter.cdc`. This is the standard contract created by default when you run `flow init`. It's very simple, with a counter and public functions to increment or decrement it.

### Callback Handler

Next, open `cadence/contracts/CounterCallbackHandler.cdc`

```cadence
import "FlowCallbackScheduler"
import "Counter"

access(all) contract CounterCallbackHandler {

    /// Handler resource that implements the Scheduled Callback interface
    access(all) resource Handler: FlowCallbackScheduler.CallbackHandler {
        access(FlowCallbackScheduler.Execute) fun executeCallback(id: UInt64, data: AnyStruct?) {
            Counter.increment()
            let newCount = Counter.getCount()
            log("Callback executed (id: ".concat(id.toString()).concat(") newCount: ").concat(newCount.toString()))
        }
    }

    /// Factory for the handler resource
    access(all) fun createHandler(): @Handler {
        return <- create Handler()
    }
}
```

This contract is simple. It contains a [resource] that has a function with the `FlowCallbackScheduler.Execute` [entitlement]. This function contains the code that will be called by the callback. It:

1. Calls the `increment` function in the `Counter` contract
2. Fetches the current value in the counter
3. Logs that value to the console **for the emulator**

It also contains a function, `createHandler`, which creates and returns an instance of the `Handler` resource.

### Initializing the Callback Handler

Next, take a look at `cadence/transactions/InitCounterCallbackHandler.cdc`:

```cadence
import "CounterCallbackHandler"
import "FlowCallbackScheduler"

transaction() {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        // Save a handler resource to storage if not already present
        if signer.storage.borrow<&AnyResource>(from: /storage/CounterCallbackHandler) == nil {
            let handler <- CounterCallbackHandler.createHandler()
            signer.storage.save(<-handler, to: /storage/CounterCallbackHandler)
        }

        // Validation/example that we can create an issue a handler capability with correct entitlement for FlowCallbackScheduler
        let _ = signer.capabilities.storage
            .issue<auth(FlowCallbackScheduler.Execute) &{FlowCallbackScheduler.CallbackHandler}>(/storage/CounterCallbackHandler)
    }
}
```

This transaction saves an instance of the `Handler` resource to the user's [storage]. It also tests out/demonstrates how to issue the handler [capability] with the `FlowCallbackScheduler.Execute` [entitlement]. The use of the name `_` is convention to name a variable we don't intend to use for anything.

### Scheduling the Callback

Finally, open `cadence/transactions/ScheduleIncrementIn.cdc` again. This is the most complicated transaction, so we'll break it down. The final call other than the `log` is what actually schedules the callback:

```cadence
let receipt = FlowCallbackScheduler.schedule(
    callback: handlerCap,
    data: callbackData,
    timestamp: future,
    priority: pr,
    executionEffort: executionEffort,
    fees: <-fees
)
```

It calls the `schedule` function from the `FlowCallbackScheduler` contract. This function has parameters for:

- `callback`: The handler [capability] for the code that should be executed.

This is created above as a part of the transaction with:

```cadence
let handlerCap = signer.capabilities.storage
            .issue<auth(FlowCallbackScheduler.Execute) &{FlowCallbackScheduler.CallbackHandler}>(/storage/CounterCallbackHandler)
```

That line is creating a capability that allows something with the `FlowCallbackScheduler.Execute` entitlement to call the function (`executeCallback()`) from the `Handler` resource in `CounterCallbackHandler.cdc` that you created and stored an instance of in the `InitCounterCallbackHandler` transaction.

- `data`: The arguments required by the callback function.

In this example, `callBackData` is passed in as a prop on the transaction and is `null`.

- `timestamp`: The timestamp for the time in the `future` that this callback should be run.

The transaction call has an argument for `delaySeconds`, which is then converted to a `future` timestamp:

```cadence
let future = getCurrentBlock().timestamp + delaySeconds
```

- `priority`: The priority this transaction will be given in the event of network congestion. A higher priority means a higher fee for higher precedence.

The `priority` argument is supplied in the transaction as a `UInt8` for convenience, then converted into the appropriate [enum] type:

```cadence
let pr = priority == 0
    ? FlowCallbackScheduler.Priority.High
    : priority == 1
        ? FlowCallbackScheduler.Priority.Medium
        : FlowCallbackScheduler.Priority.Low
```

The `executionEffort` is also supplied as an argument in the transaction. It's used to prepare the estimate for the gas fees that must be paid for the callback, and directly in the call to `schedule()` the callback.

- `fees`: A [vault] containing the appropriate amount of gas fees needed to pay for the execution of the scheduled callback.

To create the vault, the `estimate()` function is first used to calculate the amount needed:

```cadence
let est = FlowCallbackScheduler.estimate(
    data: callbackData,
    timestamp: future,
    priority: pr,
    executionEffort: executionEffort
)
```

Then, an [authorized reference] to the signer's vault is created and used to `withdraw()` the needed funds and [move] them into the `fees` variable which is then sent in the `schedule()` function call.

Finally, we also `assert` that some minimums are met to ensure the callback will be called:

```cadence
assert(
    est.timestamp != nil || pr == FlowCallbackScheduler.Priority.Low,
    message: est.error ?? "estimation failed"
)
```

## Writing a New Scheduled Callback

With this knowledge, we can create our own scheduled callback. For this demo, we'll simply display a hello from an old friend in the emulator's console logs.

### Creating the Contracts

Start by using the [Flow CLI] to create a new contract called `RickRoll.cdc` and one called `RickRollCallbackHandler.cdc`:

```zsh
flow generate contract RickRoll
flow generate contract RickRollCallbackHandler
```

Open the `RickRoll` contract, and add functions to log a fun message to the emulator console, and a variable to track which message to call:

```cadence
access(all)
contract RickRoll {

    access(all) var messageNumber: UInt8

    init() {
        self.messageNumber = 0
    }

    // Reminder: Anyone can call these functions!
    access(all) fun message1() {
        log("Never gonna give you up")
        self.messageNumber = 1
    }

    access(all) fun message2() {
        log("Never gonna let you down")
        self.messageNumber = 2
    }

    access(all) fun message3() {
        log("Never gonna run around and desert you")
        self.messageNumber = 3
    }

    access(all) fun resetMessageNumber() {
        self.messageNumber = 0
    }
}
```

Next, open `RickRollCallbackHandler.cdc`. Start by importing the `RickRoll` contract, `FlowToken`, `FungibleToken`, and `FlowCallbackScheduler`, and stubbing out the `Handler` and factory:

```cadence
import "FlowCallbackScheduler"
import "RickRoll"
import "FlowToken"
import "FungibleToken"

access(all)
contract RickRollCallbackHandler {
    /// Handler resource that implements the Scheduled Callback interface
    access(all) resource Handler: FlowCallbackScheduler.CallbackHandler {
        // TODO
    }

    /// Factory for the handler resource
    access(all) fun createHandler(): @Handler {
        return <- create Handler()
    }
}
```

Next, add a switch to call the appropriate function based on what the current `messageNumber` is:

```cadence
access(FlowCallbackScheduler.Execute) fun executeCallback(id: UInt64, data: AnyStruct?) {
    switch (RickRoll.messageNumber) {
        case 0:
            RickRoll.message1()
        case 1:
            RickRoll.message2()
        case 2:
            RickRoll.message3()
        case 3:
            return
        default:
            panic("Invalid message number")
    }
}
```

We could move forward with this, but it would be more fun to have each callback schedule the follow callback to share the next message. You can do this by moving most of the code found in the callback transaction to the handler. Start with configuring the `delay`, `future`, `priority`, and `executionEffort`. We'll hardcode these for simplicity:

```cadence
var delay: UFix64 = 5.0
let future = getCurrentBlock().timestamp + delay
let priority = FlowCallbackScheduler.Priority.Medium
let executionEffort: UInt64 = 1000
```

Next, create the `estimate` and `assert` to validate minimums are met, and that the `Handler` exists:

```cadence
let estimate = FlowCallbackScheduler.estimate(
    data: data,
    timestamp: future,
    priority: priority,
    executionEffort: executionEffort
)

assert(
    estimate.timestamp != nil || priority == FlowCallbackScheduler.Priority.Low,
    message: estimate.error ?? "estimation failed"
)

 // Ensure a handler resource exists in the contract account storage
if RickRollCallbackHandler.account.storage.borrow<&AnyResource>(from: /storage/RickRollCallbackHandler) == nil {
    let handler <- RickRollCallbackHandler.createHandler()
    RickRollCallbackHandler.account.storage.save(<-handler, to: /storage/RickRollCallbackHandler)
}
```

Then withdraw the necessary funds:

```cadence
let vaultRef = CounterLoopCallbackHandler.account.storage
    .borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
    ?? panic("missing FlowToken vault on contract account")
let fees <- vaultRef.withdraw(amount: estimate.flowFee ?? 0.0) as! @FlowToken.Vault
```

Finally, issue a capability, and schedule the callback:

```cadence
// Issue a capability to the handler stored in this contract account
let handlerCap = RickRollCallbackHandler.account.capabilities.storage
    .issue<auth(FlowCallbackScheduler.Execute) &{FlowCallbackScheduler.CallbackHandler}>(/storage/RickRollCallbackHandler)

let receipt = FlowCallbackScheduler.schedule(
    callback: handlerCap,
    data: data,
    timestamp: future,
    priority: priority,
    executionEffort: executionEffort,
    fees: <-fees
)
```

### Setting Up the Transactions

Next, you need to add transactions to initialize the new callback, and another to fire off the sequence.

Start by adding `InitRickRollHandler.cdc`:

```zsh
flow generate transaction InitRickRollHandler
```

The contract itself is nearly identical to the one we reviewed:

```cadence
import "RickRollCallbackHandler"
import "FlowCallbackScheduler"

transaction() {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        // Save a handler resource to storage if not already present
        if signer.storage.borrow<&AnyResource>(from: /storage/RickRollCallbackHandler) == nil {
            let handler <- RickRollCallbackHandler.createHandler()
            signer.storage.save(<-handler, to: /storage/RickRollCallbackHandler)
        }

        // Validation/example that we can create an issue a handler capability with correct entitlement for FlowCallbackScheduler
        let _ = signer.capabilities.storage
            .issue<auth(FlowCallbackScheduler.Execute) &{FlowCallbackScheduler.CallbackHandler}>(/storage/CounterCallbackHandler)
    }
}
```

Next, add `ScheduleRickRoll`:

```zsh
flow generate transaction ScheduleRickRoll
```

This transaction is essentially identical as well, it just uses the `handlerCap` stored in `RickRollCallback`:

```cadence
import "FlowCallbackScheduler"
import "FlowToken"
import "FungibleToken"

/// Schedule an increment of the Counter with a relative delay in seconds
transaction(
    delaySeconds: UFix64,
    priority: UInt8,
    executionEffort: UInt64,
    callbackData: AnyStruct?
) {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        let future = getCurrentBlock().timestamp + delaySeconds

        let pr = priority == 0
            ? FlowCallbackScheduler.Priority.High
            : priority == 1
                ? FlowCallbackScheduler.Priority.Medium
                : FlowCallbackScheduler.Priority.Low

        let est = FlowCallbackScheduler.estimate(
            data: callbackData,
            timestamp: future,
            priority: pr,
            executionEffort: executionEffort
        )

        assert(
            est.timestamp != nil || pr == FlowCallbackScheduler.Priority.Low,
            message: est.error ?? "estimation failed"
        )

        let vaultRef = signer.storage
            .borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("missing FlowToken vault")
        let fees <- vaultRef.withdraw(amount: est.flowFee ?? 0.0) as! @FlowToken.Vault

        let handlerCap = signer.capabilities.storage
            .issue<auth(FlowCallbackScheduler.Execute) &{FlowCallbackScheduler.CallbackHandler}>(/storage/RickRollCallbackHandler)

        let receipt = FlowCallbackScheduler.schedule(
            callback: handlerCap,
            data: callbackData,
            timestamp: future,
            priority: pr,
            executionEffort: executionEffort,
            fees: <-fees
        )

        log("Scheduled callback id: ".concat(receipt.id.toString()).concat(" at ").concat(receipt.timestamp.toString()))
    }
}
```

### Deployment and Testing

It's now time to deploy and test the new scheduled callback!: First, add the new contracts to the emulator account in `flow.json` (other contracts may be present):

```json
"deployments": {
    "emulator": {
        "emulator-account": [
            "RickRoll",
            "RickRollCallbackHandler"
        ]
    }
}
```

Then, deploy the contracts to the emulator:

```zsh
flow project deploy --network emulator
```

And execute the transaction to initialize the new scheduled callback:

```zsh
flow transactions send cadence/transactions/InitRickRollHandler.cdc \
  --network emulator --signer emulator-account
```

Finally, **get ready to quickly switch to the emulator console** and call the transaction to schedule the callback!:

```zsh
flow transactions send cadence/transactions/ScheduleRickRoll.cdc \
  --network emulator --signer emulator-account \
  --args-json '[
    {"type":"UFix64","value":"2.0"},
    {"type":"UInt8","value":"1"},
    {"type":"UInt64","value":"1000"},
    {"type":"Optional","value":null}
  ]'
```

In the logs, you'll see similar to:

```zsh
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
11:40AM INF LOG: "Scheduled callback id: 4 at 1755099632.00000000"
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
11:40AM INF LOG: "[system.execute_callback] executing callback 4"
11:40AM INF LOG: "Never gonna give you up"
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
11:40AM INF LOG: "[system.execute_callback] executing callback 5"
11:40AM INF LOG: "Never gonna let you down"
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
11:40AM INF LOG: "[system.execute_callback] executing callback 6"
11:40AM INF LOG: "Never gonna run around and desert you"
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
11:40AM INF LOG: "[system.process_callbacks] processing callbacks"
```

The last case `return`s the function, so it doesn't set a new scheduled callback.

## Conclusion

In this tutorial, you learned about scheduled transactions, a powerful feature that enables smart contracts to execute code at future times without external transactions. You explored how scheduled transactions solve the fundamental limitation of blockchain computers being unable to run unbounded loops or execute time-delayed operations.

Now that you have completed this tutorial, you should be able to:

- Understand the concept of scheduled transactions and how they solve blockchain limitations
- Explain the key components of the FlowCallbackScheduler system
- Implement a basic scheduled callback using the provided scaffold
- Analyze the structure and flow of scheduled callback transactions
- Create custom scheduled callback contracts and handlers
- Evaluate the benefits and use cases of scheduled transactions in DeFi applications

Scheduled transactions open up new possibilities for DeFi applications, enabling recurring jobs, deferred actions, and autonomous workflows that were previously impossible on blockchain. This feature represents a significant step forward in making blockchain more practical for real-world applications that require time-based execution.

<!-- Reference-style links, will not render on page. -->

[FLIP 330]: https://github.com/onflow/flips/pull/331/files
[Turing Complete]: https://en.wikipedia.org/wiki/Turing_completeness
[Scheduled Transactions Scaffold]: https://github.com/onflow/scheduledtransactions-scaffold
[Cadence]: https://cadence-lang.org/docs
[resource]: https://cadence-lang.org/docs/language/resources
[entitlement]: https://cadence-lang.org/docs/language/access-control#entitlements
[storage]: https://cadence-lang.org/docs/language/accounts/storage
[enum]: https://cadence-lang.org/docs/language/enumerations
[vault]: https://developers.flow.com/build/cadence/guides/fungible-token#vaults-on-flow
[authorized reference]: https://cadence-lang.org/docs/language/references#authorized-references
[move]: https://cadence-lang.org/docs/language/operators/assign-move-force-swap#move-operator--
[Flow CLI]: https://developers.flow.com/tools/flow-cli
