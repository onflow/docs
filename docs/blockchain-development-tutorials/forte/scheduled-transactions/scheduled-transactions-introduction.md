---
title: Introduction to Scheduled Transactions
description: Learn how to implement scheduled transactions for time-based smart contract execution on Flow
sidebar_position: 5
keywords:
  - scheduled transactions
  - flow transaction scheduler
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

Scheduled transactions are a new feature that is under development and is a part of [FLIP 330]. Currently, they only work in the emulator and testnet. We're close to finishing the specific implementation, but it but may change during the development process.

We will update these tutorials, but you may need to refactor your code if the implementation changes.

:::

Flow, EVM, and other blockchains are a form of a **single** shared computer that anyone can use, with no admin privileges, super user roles, or complete control. For this to work, it must be impossible for any user to freeze the computer, on purpose or by accident.

As a result, most blockchain computers, including EVM and Solana, aren't [Turing Complete], because they can't run an unbounded loop. Each transaction must occur within one block, and can't consume more gas than the limit.

While this limitation prevents infinite loops, it makes it so that you can't do anything 100% onchain if you need it to happen at a later time or after a trigger. As a result, developers must often build products that involve a fair amount of traditional infrastructure and requires users to give those developers a great amount of trust that their backend will execute the promised task.

Flow fixes this problem with _scheduled transactions_. Scheduled Transactions let smart contracts execute code at, or after, a chosen time without an external transaction. You schedule work now and the network executes it later. This allows recurring jobs, deferred actions, and autonomous workflows.

## Learning Objectives

After you complete this tutorial, you will be able to:

- Understand the concept of scheduled transactions and how they solve blockchain limitations.
- Explain the key components of the `FlowTransactionScheduler` system.
- Implement a basic scheduled transaction using the provided scaffold.
- Analyze the structure and flow of scheduled transaction transactions.
- Create custom scheduled transaction contracts and handlers.
- Evaluate the benefits and use cases of scheduled transactions in DeFi applications.

# Prerequisites

## Cadence Programming Language

This tutorial assumes you have a modest knowledge of [Cadence]. If you don't, you can follow along, but you'll get more out of it if you complete our series of [Cadence] tutorials. Most developers find it more pleasant than other blockchain languages, and it's not hard to pick up.

## Getting Started

To start, run `flow init` and select `Scheduled Transactions project`. Open the project.

The `readme` file has a robust getting started guide. Complete that to set up and run the demo scheduled transaction. It doesn't seem like much at first. The counter was at `0`, you ran a transaction, now it's at `1`. What's the big deal?

Let's try again to make it clearer what's happening. Open `cadence/transactions/ScheduleIncrementIn.cdc` and look at the arguments for the transaction:

```cadence
transaction(
    delaySeconds: UFix64,
    priority: UInt8,
    executionEffort: UInt64,
    transactionData: AnyStruct?
)
```

The first parameter is the delay in seconds for the scheduled transaction. Let's try running it again. You'll need to be quick on the keyboard, so feel free to use a higher number of `delaySeconds` if you need to. You're going to:

1. Call the script to view the counter.
2. Call the transaction to schedule the counter to increment after 10 seconds.
3. Call the script to view the counter again and verify that it hasn't changed yet.
4. Wait 10 seconds, call it again, and confirm the counter incremented.

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
briandoyle@Mac scheduled-transactions-scaffold % flow scripts execute cadence/scripts/GetCounter.cdc --network emulator

Result: 2

briandoyle@Mac scheduled-transactions-scaffold % flow transactions send cadence/transactions/ScheduleIncrementIn.cdc \
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

briandoyle@Mac scheduled-transactions-scaffold % flow scripts execute cadence/scripts/GetCounter.cdc --network emulator

Result: 2


briandoyle@Mac scheduled-transactions-scaffold % flow scripts execute cadence/scripts/GetCounter.cdc --network emulator

Result: 2


briandoyle@Mac scheduled-transactions-scaffold % flow scripts execute cadence/scripts/GetCounter.cdc --network emulator

Result: 3
```

### Review of the Existing Contract and Transactions

If you're not familiar with `cadence/contracts/Counter.cdc` review it. This is the standard contract created by default when you run `flow init`. It's very simple, with a counter and public functions to increment or decrement it.

### Transaction Handler

Next, open `cadence/contracts/CounterTransactionHandler.cdc`

```cadence
import "FlowTransactionScheduler"
import "Counter"

access(all) contract CounterTransactionHandler {

    /// Handler resource that implements the Scheduled Transaction interface
    access(all) resource Handler: FlowTransactionScheduler.TransactionHandler {
        access(FlowTransactionScheduler.Execute) fun executeTransaction(id: UInt64, data: AnyStruct?) {
            Counter.increment()
            let newCount = Counter.getCount()
            log("Transaction executed (id: ".concat(id.toString()).concat(") newCount: ").concat(newCount.toString()))
        }

        access(all) view fun getViews(): [Type] {
            return [Type<StoragePath>(), Type<PublicPath>()]
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<StoragePath>():
                    return /storage/CounterTransactionHandler
                case Type<PublicPath>():
                    return /public/CounterTransactionHandler
                default:
                    return nil
            }
        }
    }

    /// Factory for the handler resource
    access(all) fun createHandler(): @Handler {
        return <- create Handler()
    }
}
```

This contract is simple. It contains a [resource] that has a function with the `FlowTransactionScheduler.Execute` [entitlement]. This function contains the code that the scheduled transaction calls. It:

1. Calls the `increment` function in the `Counter` contract.
2. Fetches the current value in the counter.
3. Logs that value to the console **for the emulator**.

It also contains functions to get metadata about the handler and a function, `createHandler`, which creates and returns an instance of the `Handler` resource. There are other metadata views that could be good to include in your Handler, but we're sticking to the basic ones for now.

### Initializing the Transaction Handler

Next, take a look at `cadence/transactions/InitCounterTransactionHandler.cdc`:

```cadence
import "CounterTransactionHandler"
import "FlowTransactionScheduler"

transaction() {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        // Save a handler resource to storage if not already present
        if signer.storage.borrow<&AnyResource>(from: /storage/CounterTransactionHandler) == nil {
            let handler <- CounterTransactionHandler.createHandler()
            signer.storage.save(<-handler, to: /storage/CounterTransactionHandler)
        }

        // Validation/example that we can create an issue a handler capability with correct entitlement for FlowTransactionScheduler
        let _ = signer.capabilities.storage
            .issue<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>(/storage/CounterTransactionHandler)

        // Issue a non-entitled public capability for the handler that is publicly accessible
        let publicCap = signer.capabilities.storage
            .issue<&{FlowTransactionScheduler.TransactionHandler}>(/storage/CounterTransactionHandler)

        // publish the capability
        signer.capabilities.publish(publicCap, at: /public/CounterTransactionHandler)
    }
}
```

This transaction saves an instance of the `Handler` resource to the user's [storage]. It also tests out/demonstrates how to issue the handler [capability] with the `FlowTransactionScheduler.Execute` [entitlement] and how to publish an un-entitled capability to the handler so it can be publicly accessible. The use of the name `_` is convention to name a variable we don't intend to use for anything.

### Scheduling the Transaction

Finally, open `cadence/transactions/ScheduleIncrementIn.cdc` again. This is the most complicated transaction, so we'll break it down. The final call other than the `log` is what actually schedules the transaction:

```cadence
manager.schedule(
    handlerCap: handlerCap,
    data: transactionData,
    timestamp: future,
    priority: pr,
    executionEffort: executionEffort,
    fees: <-fees
)
```

It calls the `schedule` function from the `FlowTransactionSchedulerUtils.Manager` contract. This function has parameters for:

- `handlerCap`: The handler [capability] for the code that should execute.

This was created above during the previous transaction with:

```cadence
let handlerCap = signer.capabilities.storage
            .issue<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>(/storage/CounterTransactionHandler)
```

That line creates a capability with the `FlowTransactionScheduler.Execute` entitlement. That entitlement permits calling the function (`executeTransaction()`) from the `Handler` resource in `CounterTransactionHandler.cdc` that you created and stored an instance of in the `InitCounterTransactionHandler` transaction.

Then, in the schedule transaction, we retrieve the handler capability that we created before.
We created two separate handlers, a public and a private one, so we have to make sure we're getting the private one:

```cadence
// Get the entitled capability that will be used to create the transaction
// Need to check both controllers because the order of controllers is not guaranteed
var handlerCap: Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>? = nil

if let cap = account.capabilities.storage
                    .getControllers(forPath: /storage/CounterTransactionHandler)[0]
                    .capability as? Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}> {
    handlerCap = cap
} else {
    handlerCap = account.capabilities.storage
                    .getControllers(forPath: /storage/CounterTransactionHandler)[1]
                    .capability as! Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>
}
```

- `data`: The arguments required by the transaction function.

In this example, `transactionData` is passed in as a prop on the transaction and is `null`.

- `timestamp`: The timestamp for the time in the `future` that this transaction should be run.

The transaction call has an argument for `delaySeconds`, which is then converted to a `future` timestamp:

```cadence
let future = getCurrentBlock().timestamp + delaySeconds
```

- `priority`: The priority this transaction is given in the event of network congestion. A higher priority means a higher fee for higher precedence.

The `priority` argument is supplied in the transaction as a `UInt8` for convenience, then converted into the appropriate [enum] type:

```cadence
let pr = priority == 0
    ? FlowTransactionScheduler.Priority.High
    : priority == 1
        ? FlowTransactionScheduler.Priority.Medium
        : FlowTransactionScheduler.Priority.Low
```

The `executionEffort` is also supplied as an argument in the transaction. This represents the gas limit for your transaction and used to prepare the estimate for the gas fees that must be paid for the transaction, and directly in the call to `schedule()` the transaction.

- `fees`: A [vault] containing the appropriate amount of gas fees needed to pay for the execution of the scheduled transaction.

To create the vault, the `estimate()` function calculates the amount needed:

```cadence
let est = FlowTransactionScheduler.estimate(
    data: transactionData,
    timestamp: future,
    priority: pr,
    executionEffort: executionEffort
)
```

Then, an [authorized reference] to the signer's vault is created and used to `withdraw()` the needed funds and [move] them into the `fees` variable, which is then sent in the `schedule()` function call.

Finally, we also `assert` that some minimums are met to ensure the transaction will be called:

```cadence
assert(
    est.timestamp != nil || pr == FlowTransactionScheduler.Priority.Low,
    message: est.error ?? "estimation failed"
)
```

## Using the FlowTransactionSchedulerUtils.Manager

The `FlowTransactionSchedulerUtils.Manager` resource provides a safer and more convenient way to manage scheduled transactions. Instead of directly calling the `FlowTransactionScheduler` contract,
you can use the Manager resource that manages all your scheduled transactions from a single place and handles many of the common patterns to reduce boilerplate code.
It also provides many convenient functions to get detailed information about all the transactions you have scheduled by timestamp, handler, and so on.
When setting up a manager, you also publish a capability for it so it is easy for scripts
to query your account and also see what transactions are scheduled!

### Setting Up the Manager

First, you need to create and store a Manager resource in your account:

```cadence
import "FlowTransactionSchedulerUtils"
import "FlowToken"
import "FungibleToken"

transaction() {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        // Create and save the Manager resource
        let manager <- FlowTransactionSchedulerUtils.createManager()
        signer.storage.save(<-manager, to: FlowTransactionSchedulerUtils.managerStoragePath)

        // Create a capability for the Manager
        let managerCap = signer.capabilities.storage.issue<&FlowTransactionSchedulerUtils.Manager>(FlowTransactionSchedulerUtils.managerStoragePath)

        signer.capabilities.publish(managerCap, at: FlowTransactionSchedulerUtils.managerPublicPath)
    }
}
```

### Scheduling Transactions with the Manager

The Manager provides a `schedule` method that simplifies the scheduling process:

```cadence
manager.schedule(
    handlerCap: handlerCap,
    data: transactionData,
    timestamp: future,
    priority: priority,
    executionEffort: executionEffort,
    fees: <-fees
)
```

The Manager also provides utility methods for:

- Scheduling another transaction with a previously used handler.
- Getting scheduled transaction information in many different ways.
- Canceling scheduled transactions.
- Managing transaction handlers.
- Querying transaction status.

## Writing a New Scheduled Transaction

With this knowledge, we can create our own scheduled transaction. For this demo, we'll simply display a hello from an old friend in the emulator's console logs.

### Creating the Contracts

To start, use the [Flow CLI] to create a new contract called `RickRoll.cdc` and one called `RickRollTransactionHandler.cdc`:

```zsh
flow generate contract RickRoll
flow generate contract RickRollTransactionHandler
```

Open the `RickRoll` contract and add functions to log a fun message to the emulator console, and a variable to track which message to call:

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

Next, open `RickRollTransactionHandler.cdc`. Import the `RickRoll` contract, `FlowToken`, `FungibleToken`, and `FlowTransactionScheduler`, and stub out the `Handler` and factory:

```cadence
import "FlowTransactionScheduler"
import "RickRoll"
import "FlowToken"
import "FungibleToken"

access(all)
contract RickRollTransactionHandler {
    /// Handler resource that implements the Scheduled Transaction interface
    access(all) resource Handler: FlowTransactionScheduler.TransactionHandler {
        // TODO
    }

    /// Factory for the handler resource
    access(all) fun createHandler(): @Handler {
        return <- create Handler()
    }
}
```

Next, add a switch to call the appropriate function based on what the current `messageNumber` is and add the metadata getters:

```cadence
access(all) resource Handler: FlowTransactionScheduler.TransactionHandler {
    access(FlowTransactionScheduler.Execute) fun executeTransaction(id: UInt64, data: AnyStruct?) {
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

    access(all) view fun getViews(): [Type] {
            return [Type<StoragePath>(), Type<PublicPath>()]
        }

    access(all) fun resolveView(_ view: Type): AnyStruct? {
        switch view {
            case Type<StoragePath>():
                return /storage/RickRollTransactionHandler
            case Type<PublicPath>():
                return /public/RickRollTransactionHandler
            default:
                return nil
        }
    }
}
```

We could move forward with this, but it would be more fun to have each transaction schedule the follow transaction to share the next message. To do this, move most of the code found in the transaction to the handler. Start with configuring the `delay`, `future`, `priority`, and `executionEffort`. We'll hardcode these for simplicity:

```cadence
var delay: UFix64 = 5.0
let future = getCurrentBlock().timestamp + delay
let priority = FlowTransactionScheduler.Priority.Medium
let executionEffort: UInt64 = 1000
```

Next, create the `estimate` and `assert` to validate minimums are met, and that the `Handler` exists:

```cadence
let estimate = FlowTransactionScheduler.estimate(
    data: data,
    timestamp: future,
    priority: priority,
    executionEffort: executionEffort
)

assert(
    estimate.timestamp != nil || priority == FlowTransactionScheduler.Priority.Low,
    message: estimate.error ?? "estimation failed"
)

 // Ensure a handler resource exists in the contract account storage
if RickRollTransactionHandler.account.storage.borrow<&AnyResource>(from: /storage/RickRollTransactionHandler) == nil {
    let handler <- RickRollTransactionHandler.createHandler()
    RickRollTransactionHandler.account.storage.save(<-handler, to: /storage/RickRollTransactionHandler)

    // Issue a non-entitled public capability for the handler that is publicly accessible
    let publicCap = RickRollTransactionHandler.account.capabilities.storage
        .issue<&{FlowTransactionScheduler.TransactionHandler}>(/storage/RickRollTransactionHandler)

    // publish the capability
    RickRollTransactionHandler.capabilities.publish(publicCap, at: /public/RickRollTransactionHandler)
}
```

Then withdraw the necessary funds:

```cadence
let vaultRef = CounterLoopTransactionHandler.account.storage
    .borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
    ?? panic("missing FlowToken vault on contract account")
let fees <- vaultRef.withdraw(amount: estimate.flowFee ?? 0.0) as! @FlowToken.Vault
```

Finally, schedule the transaction:

```cadence

// borrow a reference to the scheduled transaction manager
let manager = RickRollTransactionHandler.account.storage.borrow<auth(FlowTransactionSchedulerUtils.Owner) &{FlowTransactionSchedulerUtils.Manager}>(from: FlowTransactionSchedulerUtils.managerStoragePath)
    ?? panic("Could not borrow a Manager reference from \(FlowTransactionSchedulerUtils.managerStoragePath)")

let handlerTypeIdentifier = manager.getHandlerTypes().keys[0]!

manager.scheduleByHandler(
    handlerTypeIdentifier: handlerTypeIdentifier,
    handlerUUID: nil,
    data: data,
    timestamp: future,
    priority: priority,
    executionEffort: executionEffort,
    fees: <-fees
)
```

As you can see, this time, we didn't have to get the handler capability.
This is because the manager stores a history of handlers that you have used in the past
so that you can easily just specify the type of the handler that you want to schedule for
and it will schedule it for you.

### Setting Up the Transactions

Next, you need to add transactions to initialize the new transaction handler, and another to fire off the sequence.

Start by adding `InitRickRollHandler.cdc`:

```zsh
flow generate transaction InitRickRollHandler
```

The transaction itself is nearly identical to the one we reviewed:

```cadence
import "RickRollTransactionHandler"
import "FlowTransactionScheduler"

transaction() {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        // Save a handler resource to storage if not already present
        if signer.storage.borrow<&AnyResource>(from: /storage/RickRollTransactionHandler) == nil {
            let handler <- RickRollTransactionHandler.createHandler()
            signer.storage.save(<-handler, to: /storage/RickRollTransactionHandler)

            // Validation/example that we can create an issue a handler capability with correct entitlement for FlowTransactionScheduler
            signer.capabilities.storage
                .issue<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>(/storage/RickRollTransactionHandler)

            // Issue a non-entitled public capability for the handler that is publicly accessible
            let publicCap = signer.capabilities.storage
                .issue<&{FlowTransactionScheduler.TransactionHandler}>(/storage/RickRollTransactionHandler)

            // publish the capability
            signer.capabilities.publish(publicCap, at: /public/RickRollTransactionHandler)

        }
    }
}
```

Next, add `ScheduleRickRoll`:

```zsh
flow generate transaction ScheduleRickRoll
```

This transaction is essentially identical as well, it just uses the `handlerCap` stored in `RickRollTransaction`:

```cadence
import "FlowTransactionScheduler"
import "FlowToken"
import "FungibleToken"

/// Schedule a Rick Roll with a delay of delaySeconds
transaction(
    delaySeconds: UFix64,
    priority: UInt8,
    executionEffort: UInt64,
    transactionData: AnyStruct?
) {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        let future = getCurrentBlock().timestamp + delaySeconds

        let pr = priority == 0
            ? FlowTransactionScheduler.Priority.High
            : priority == 1
                ? FlowTransactionScheduler.Priority.Medium
                : FlowTransactionScheduler.Priority.Low

        let est = FlowTransactionScheduler.estimate(
            data: transactionData,
            timestamp: future,
            priority: pr,
            executionEffort: executionEffort
        )

        assert(
            est.timestamp != nil || pr == FlowTransactionScheduler.Priority.Low,
            message: est.error ?? "estimation failed"
        )

        let vaultRef = signer.storage
            .borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("missing FlowToken vault")
        let fees <- vaultRef.withdraw(amount: est.flowFee ?? 0.0) as! @FlowToken.Vault

        // if a transaction scheduler manager has not been created for this account yet, create one
        if !signer.storage.check<@{FlowTransactionSchedulerUtils.Manager}>(from: FlowTransactionSchedulerUtils.managerStoragePath) {
            let manager <- FlowTransactionSchedulerUtils.createManager()
            signer.storage.save(<-manager, to: FlowTransactionSchedulerUtils.managerStoragePath)

            // create a public capability to the scheduled transaction manager
            let managerRef = signer.capabilities.storage.issue<&{FlowTransactionSchedulerUtils.Manager}>(FlowTransactionSchedulerUtils.managerStoragePath)
            signer.capabilities.publish(managerRef, at: FlowTransactionSchedulerUtils.managerPublicPath)
        }

        // Get a capability to the handler stored in this contract account
        // Get the entitled capability that will be used to create the transaction
        // Need to check both controllers because the order of controllers is not guaranteed
        var handlerCap: Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>? = nil

        if let cap = signer.capabilities.storage
                            .getControllers(forPath: /storage/RickRollTransactionHandler)[0]
                            .capability as? Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}> {
            handlerCap = cap
        } else {
            handlerCap = signer.capabilities.storage
                            .getControllers(forPath: /storage/RickRollTransactionHandler)[1]
                            .capability as! Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>
        }

        // borrow a reference to the scheduled transaction manager
        let manager = signer.storage.borrow<auth(FlowTransactionSchedulerUtils.Owner) &{FlowTransactionSchedulerUtils.Manager}>(from: FlowTransactionSchedulerUtils.managerStoragePath)
            ?? panic("Could not borrow a Manager reference from \(FlowTransactionSchedulerUtils.managerStoragePath)")

        manager.schedule(
            handlerCap: handlerCap,
            data: transactionData,
            timestamp: future,
            priority: pr,
            executionEffort: executionEffort,
            fees: <-fees
        )

        log("Scheduled transaction at \(future)")
    }
}
```

### Deployment and Testing

It's now time to deploy and test the new scheduled transaction! First, add the new contracts to the emulator account in `flow.json` (other contracts may be present):

```json
"deployments": {
    "emulator": {
        "emulator-account": [
            "RickRoll",
            "RickRollTransactionHandler"
        ]
    }
}
```

Then, deploy the contracts to the emulator:

```zsh
flow project deploy --network emulator
```

Next, execute the transaction to initialize the new scheduled transaction handler:

```zsh
flow transactions send cadence/transactions/InitRickRollHandler.cdc \
  --network emulator --signer emulator-account
```

Finally, **get ready to quickly switch to the emulator console** and call the transaction to schedule the transaction:

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

In the logs, you'll see content similar to:

```zsh
11:40AM INF LOG: "[system.process_transactions] processing transactions"
11:40AM INF LOG: "[system.process_transactions] processing transactions"
11:40AM INF LOG: "Scheduled transaction at 1755099632.00000000"
11:40AM INF LOG: "[system.process_transactions] processing transactions"
11:40AM INF LOG: "[system.process_transactions] processing transactions"
11:40AM INF LOG: "[system.process_transactions] processing transactions"
11:40AM INF LOG: "[system.execute_transaction] executing transaction 4"
11:40AM INF LOG: "Never gonna give you up"
11:40AM INF LOG: "[system.process_transactions] processing transactions"
11:40AM INF LOG: "[system.process_transactions] processing transactions"
11:40AM INF LOG: "[system.process_transactions] processing transactions"
11:40AM INF LOG: "[system.process_transactions] processing transactions"
11:40AM INF LOG: "[system.process_transactions] processing transactions"
11:40AM INF LOG: "[system.execute_transaction] executing transaction 5"
11:40AM INF LOG: "Never gonna let you down"
11:40AM INF LOG: "[system.process_transactions] processing transactions"
11:40AM INF LOG: "[system.process_transactions] processing transactions"
11:40AM INF LOG: "[system.process_transactions] processing transactions"
11:40AM INF LOG: "[system.process_transactions] processing transactions"
11:40AM INF LOG: "[system.process_transactions] processing transactions"
11:40AM INF LOG: "[system.execute_transaction] executing transaction 6"
11:40AM INF LOG: "Never gonna run around and desert you"
11:40AM INF LOG: "[system.process_transactions] processing transactions"
11:40AM INF LOG: "[system.process_transactions] processing transactions"
11:40AM INF LOG: "[system.process_transactions] processing transactions"
11:40AM INF LOG: "[system.process_transactions] processing transactions"
```

The last case `return`s the function, so it doesn't set a new scheduled transaction.

## Conclusion

In this tutorial, you learned about scheduled transactions, a powerful feature that enables smart contracts to execute code at future times without external transactions. You explored how scheduled transactions solve the fundamental limitation of blockchain computers being unable to run unbounded loops or execute time-delayed operations.

Now that you have completed this tutorial, you should be able to:

- Understand the concept of scheduled transactions and how they solve blockchain limitations.
- Explain the key components of the FlowTransactionScheduler system.
- Understand the benefits of the Transaction Scheduler Manager.
- Implement a basic scheduled transaction using the provided scaffold.
- Analyze the structure and flow of scheduled transaction transactions.
- Create custom scheduled transaction contracts and handlers.
- Evaluate the benefits and use cases of scheduled transactions in DeFi applications.

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
