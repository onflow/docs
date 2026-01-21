---
title: Scheduled Transactions
description: Learn about Flow Scheduled Transactions, enabling smart contracts to autonomously execute predefined logic at specific future times without external triggers.
keywords:
  - scheduled transactions
  - autonomous execution
  - Flow blockchain
  - smart contracts
  - transaction scheduling
  - FlowTransactionScheduler
  - time-based automation
  - transaction handlers
  - blockchain automation
sidebar_position: 8
---

# Flow Scheduled Transactions Documentation

## Introduction

:::info

Scheduled transactions were part of the Forte network upgrade and are available on Flow Mainnet, Flow Emulator (CLI v2.7.0+) and Flow Testnet. For more information, see [Forte: Introducing Actions & Agents].

:::

Scheduled transactions on the Flow blockchain allow users and smart contracts to autonomously execute predefined logic at specific future times without external triggers. This powerful feature allows developers to create "wake up" patterns where contracts can schedule themselves to run at predetermined block timestamps, which allows novel blockchain automation patterns.

Key benefits include:
- **Autonomous execution**: no need for external services or manual intervention.
- **Time-based automation**: execute transactions based on blockchain time.
- **Predictable scheduling**: guaranteed execution within specified time windows. 

Common use cases include recurring payments, automated arbitrage, time-based contract logic, delayed executions, and periodic maintenance tasks.

:::info

Flow provides a scheduled transaction manager to help you manage your scheduled transactions more easily. Check out the [scheduled transactions intro] for a tutorial on how to schedule some basic transactions with the manager.

:::

## Concepts

### Create a scheduled transaction

To create a scheduled transaction, the logic that executes in the transaction must already be defined in a function that the scheduler calls when it is time for the transaction to execute.

Therefore, all scheduled transactions must include a capability to a resource that conforms to this Transaction Handler interface defined in the Scheduler contract and includes getters that conform to the [Flow metadata views standard]:

```cadence
access(all) resource interface TransactionHandler {
    // Called by the protocol to executed the scheduled transaction
    // **Transaction ID**: Unique identifier for tracking, returned during scheduling
    // **Data**: The optional data provided during scheduling that may relate
    // to the specific scheduled transaction
    access(Execute) fun executeTransaction(id: UInt64, data: AnyStruct?)

    // Allows querying this handler to get metadata about it
    // See the flow metadata views standard for more info
    access(all) view fun getViews(): [Type]
    access(all) fun resolveView(_ view: Type): AnyStruct?
}
```

To schedule a transaction, store an instance of this resource in your account storage and pass a capability to the scheduler contract as part of the schedule request.

Here is a simple example implementation for a Handler's `executeTransaction()` function that transfers FLOW at the scheduled time:

```cadence
access(all) contract TransferFLOWHandler {

    access(all) let HandlerStoragePath: StoragePath
    access(all) let HandlerPublicPath: PublicPath

    access(all) resource Handler: FlowTransactionScheduler.TransactionHandler {

        access(all) var from: Capability<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>

        access(all) var amount: UFix64

        // other functions left out for simplicity

        // The actual logic that is executed when the scheduled transaction
        // is executed
        access(FlowTransactionScheduler.Execute)
        fun executeTransaction(id: UInt64, data: AnyStruct?) {
            if let to = data as? Address {
                let providerRef = self.from.borrow()
                    ?? panic("Could not borrow a reference to the provider FlowToken Vault")

                // Get a reference to the recipient's Receiver
                let receiverRef =  getAccount(to)
                    .capabilities.borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
                    ?? panic("Could not borrow a Receiver reference to the FlowToken Vault in account \(to.toString())")

                // Deposit the withdrawn tokens in the recipient's receiver
                receiverRef.deposit(from: <-providerRef.withdraw(amount: self.amount))

            } else {
                panic("Unable to transfer FLOW because the data provided when scheduling the transaction is not a Flow address!")
            }
        }
    }

    // A user would call this to get an instance of this handler
    // for their own scheduling use
    access(all) fun createHandler(amount: UFix64, from: Capability<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>): @Handler {
        return <- create Handler(name: "Transfer FLOW Handler Resource", amount: amount, from: from)
    }

    // other functions left out for simplicity
}
```

### Scheduling

In scheduling, you create the transaction that executes at a specified future timestamp. The system uses three priority levels:

- **High Priority**: guarantees execution in the first block with the scheduled time or fails scheduling, requires the highest fees.
- **Medium Priority**: best-effort execution as close as possible to the scheduled time known during scheduling.
- **Low Priority**: opportunistic execution when network capacity allows, lowest fees but no guarantee about timing.

Each transaction requires:
- **Handler Capability**: a capability to a resource implementing `TransactionHandler` interface, like the FLOW transfer one above.
- **Timestamp**: future Unix timestamp when execution should occur (fractional seconds ignored).
- **Execution Effort**: computational resources allocated (computation unit limit for the transaction).
- **Fees**: Flow tokens to cover execution costs and storage costs for the transaction data.
- **Optional Data**: arbitrary data that's possibly relevant to the transaction forwarded to the handler during execution.

These arguments are required by the [`FlowTransactionScheduler.schedule()` function]. This function returns a `ScheduledTransaction` resource object.

The Scheduled Transaction Manager standard (mentioned in the intro) provides an easy way for developers and users to manage their scheduled transactions from a central place in their account. Users are strongly encouraged to use this.

More information about the Scheduled Transaction manager is in the [section at the end of this document].

When a transaction is scheduled, the [`FlowTransactionScheduler.Scheduled` event] is emitted with information about the scheduled transaction and handler.

### Fees

Fee calculation includes:
- **Base execution fee**: based on computational effort with standard Flow fee structure.
- **Priority multiplier**: higher priorities pay more (High: 10x, Medium: 5x, Low: 2x base rate).
- **Storage fee**: cost to store transaction data on-chain.

Fees are paid upfront and are used in full. There are no refunds if the cost of execution was lower.

Please keep in mind the priority multiplier can change in the future. You can obtain the fee configuration from the contract, and you can use the estimate function check the fees upfront.

### Execution of transaction handlers

When the scheduled time arrives, the Flow blockchain calls the `executeTransaction` method on your handler resource.

If the transaction succeeds, the [`FlowTransactionScheduler.Executed` event] is emitted with information about the executed transaction.

If the scheduled transaction fails at any point during execution, the `Executed` event is not emitted.

### Cancel transactions

You can cancel scheduled transactions before execution. When you cancel a transaction, it returns a portion of the fees (configurable refund percentage, 50% as of now). Please keep in mind the refund percentage can change in the future.

To cancel, you need the `ScheduledTransaction` resource that was returned during scheduling. The scheduled transaction manager also makes scheduled transaction cancellation easier.

### Transaction lifecycle

Scheduled transactions follow a specific lifecycle with corresponding events:

1. **Scheduled**: Transaction is created and queued for future execution.
   - Event: `FlowTransactionScheduler.Scheduled`
   - Status: `Scheduled`

2. **Pending Execution**: Transaction timestamp has arrived and it's ready for execution.
   - Event: `FlowTransactionScheduler.PendingExecution` 
   - Status: `Executed` (Executed does not necessarily mean it succeeded, just that execution was attempted.)

3. **Executed**: The blockchain processed the transaction.
   - Event: `FlowTransactionScheduler.Executed`
   - Status: `Executed`

4. **Canceled**: Transaction was canceled before execution (optional path).
   - Event: `FlowTransactionScheduler.Canceled`
   - Status: `Canceled`

### Contracts

The `FlowTransactionScheduler` contract is deployed to the service account and manages all scheduled transactions across the network.

The `FlowTransactionSchedulerUtils` contract provides utilities for scheduled transactions, such as the transaction `Manager` resource, common handlers, and metadata views related to scheduled transactions.

Below are listed the addresses of both transaction scheduler contracts on each network they are deployed:

- **Emulator**: `0xf8d6e0586b0a20c7`
- \*\*Cadence Testing Framework: `0x0000000000000001`
- **Testnet**: `0x8c5303eaa26202d6`

## Examples

### 1. Example test handler contract

This contract implements the `TransactionHandler` interface and is used in the following examples. It emits events when scheduled transactions are executed.

```cadence
// TestFlowCallbackHandler.cdc - Simple test handler
import "FlowTransactionScheduler"

access(all) contract TestFlowScheduledTransactionHandler {
    access(all) let HandlerStoragePath: StoragePath
    access(all) let HandlerPublicPath: PublicPath

    access(all) event TransactionExecuted(data: String)

    access(all) resource Handler: FlowTransactionScheduler.TransactionHandler {

        access(FlowTransactionScheduler.Execute)
        fun executeTransaction(id: UInt64, data: AnyStruct?) {
            if let string: String = data as? String {
                emit TransactionExecuted(data: string)
            } else {
                emit TransactionExecuted(data: "bloop")
            }
        }

        // public functions that anyone can call to get information about
        // this handler
        access(all) view fun getViews(): [Type] {
            return [Type<StoragePath>(), Type<PublicPath>(), Type<MetadataViews.Display>()]
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<StoragePath>():
                    return TestFlowScheduledTransactionHandler.HandlerStoragePath
                case Type<PublicPath>():
                    return TestFlowScheduledTransactionHandler.HandlerPublicPath
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: "Basic Scheduled Transaction Handler",
                        description: "Emits a TransactionExecuted event when the scheduled transaction is executed",
                        thumbnail: MetadataViews.HTTPFile(
                            url: ""
                        )
                    )
                default:
                    return nil
            }
        }
    }

    access(all) fun createHandler(): @Handler {
        return <- create Handler()
    }

    init() {
        self.HandlerStoragePath = /storage/testCallbackHandler
        self.HandlerPublicPath = /public/testCallbackHandler
    }
}
```

### 2. Schedule a transaction with the scripts manager

This example shows how to create and schedule a transaction that will execute at a future timestamp with the [`TestFlowCallbackHandler`] from Example 1.

```cadence
// schedule.cdc
import "FlowTransactionScheduler"
import "FlowTransactionSchedulerUtils"
import "TestFlowScheduledTransactionHandler"
import "FlowToken"
import "FungibleToken"

transaction(timestamp: UFix64, feeAmount: UFix64, effort: UInt64, priority: UInt8, testData: AnyStruct?) {

    prepare(account: auth(BorrowValue, SaveValue, IssueStorageCapabilityController, PublishCapability, GetStorageCapabilityController) &Account) {

        // if a transaction scheduler manager has not been created for this account yet, create one
        if !account.storage.check<@{FlowTransactionSchedulerUtils.Manager}>(from: FlowTransactionSchedulerUtils.managerStoragePath) {
            let manager <- FlowTransactionSchedulerUtils.createManager()
            account.storage.save(<-manager, to: FlowTransactionSchedulerUtils.managerStoragePath)

            // create a public capability to the callback manager
            let managerRef = account.capabilities.storage.issue<&{FlowTransactionSchedulerUtils.Manager}>(FlowTransactionSchedulerUtils.managerStoragePath)
            account.capabilities.publish(managerRef, at: FlowTransactionSchedulerUtils.managerPublicPath)
        }

        // If a transaction handler has not been created for this account yet, create one,
        // store it, and issue a capability that will be used to create the transaction
        if !account.storage.check<@TestFlowScheduledTransactionHandler.Handler>(from: TestFlowScheduledTransactionHandler.HandlerStoragePath) {
            let handler <- TestFlowScheduledTransactionHandler.createHandler()

            account.storage.save(<-handler, to: TestFlowScheduledTransactionHandler.HandlerStoragePath)
            account.capabilities.storage.issue<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>(TestFlowScheduledTransactionHandler.HandlerStoragePath)

            let publicHandlerCap = account.capabilities.storage.issue<&{FlowTransactionScheduler.TransactionHandler}>(TestFlowScheduledTransactionHandler.HandlerStoragePath)
            account.capabilities.publish(publicHandlerCap, at: TestFlowScheduledTransactionHandler.HandlerPublicPath)
        }

        // Get the entitled capability that will be used to create the transaction
        // Need to check both controllers because the order of controllers is not guaranteed
        var handlerCap: Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>? = nil

        if let cap = account.capabilities.storage
                            .getControllers(forPath: TestFlowScheduledTransactionHandler.HandlerStoragePath)[0]
                            .capability as? Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}> {
            handlerCap = cap
        } else {
            handlerCap = account.capabilities.storage
                            .getControllers(forPath: TestFlowScheduledTransactionHandler.HandlerStoragePath)[1]
                            .capability as! Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>
        }

        // borrow a reference to the vault that will be used for fees
        let vault = account.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow FlowToken vault")

        let fees <- vault.withdraw(amount: feeAmount) as! @FlowToken.Vault
        let priorityEnum = FlowTransactionScheduler.Priority(rawValue: priority)
            ?? FlowTransactionScheduler.Priority.High

        // borrow a reference to the callback manager
        let manager = account.storage.borrow<auth(FlowTransactionSchedulerUtils.Owner) &{FlowTransactionSchedulerUtils.Manager}>(from: FlowTransactionSchedulerUtils.managerStoragePath)
            ?? panic("Could not borrow a Manager reference from \(FlowTransactionSchedulerUtils.managerStoragePath)")

        // Schedule the regular transaction with the main contract
        manager.schedule(
            handlerCap: handlerCap!,
            data: testData,
            timestamp: timestamp,
            priority: priorityEnum,
            executionEffort: effort,
            fees: <-fees
        )
    }
}
```

### 3. Query transaction information

Get Status: [The get_status script] demonstrates how to check the current status of a scheduled transaction with the global status function.

Get all Tx Info: [The get_transaction_data script] gets all the internal information about a scheduled transaction.

#### Manager scripts

The manager provides many different ways to get information about all of your scheduled transactions. Check out all the scripts you can use with your [manager].

### 4. Cancel a scheduled transaction

This transaction shows how to cancel a scheduled transaction and receive a partial refund of the fees paid.

```cadence
// cancel_transaction.cdc
import "FlowTransactionScheduler"
import "FlowToken"

transaction(transactionId: UInt64) {
    prepare(account: auth(BorrowValue, SaveValue, LoadValue) &Account) {

        // borrow a reference to the manager
        let manager = account.storage.borrow<auth(FlowTransactionSchedulerUtils.Owner) &{FlowTransactionSchedulerUtils.Manager}>(from: FlowTransactionSchedulerUtils.managerStoragePath)
            ?? panic("Could not borrow a Manager reference from \(FlowTransactionSchedulerUtils.managerStoragePath)")

        // Get the vault where the refund should be deposited
        let vault = account.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow FlowToken vault")

        // cancel the transaction
        vault.deposit(from: <-manager.cancel(id: id))
    }
}
```

### 5. Fee estimation

This script helps estimate the cost of scheduling a transaction before you actually submit it. This is useful for budget and validation.

```cadence
// estimate_fees.cdc - Script to estimate scheduling costs
import "FlowTransactionScheduler"

access(all) fun main(
    dataSize: AnyStruct?,
    timestamp: UFix64,
    priority: UInt8,
    executionEffort: UInt64
): FlowTransactionScheduler.EstimatedScheduledTransaction {

    let priorityEnum = FlowTransactionScheduler.Priority(rawValue: priority)
        ?? FlowTransactionScheduler.Priority.Medium

    return FlowTransactionScheduler.estimate(
        data: dataSize,
        timestamp: timestamp,
        priority: priorityEnum,
        executionEffort: executionEffort
    )
}
```

### 6. Monitor execution events

Use the Flow Command Line Interface (CLI) to monitor all scheduled transaction events in real-time (example for testnet - account addresses may differ):

```bash
flow events get \
  A.8c5303eaa26202d6.FlowTransactionScheduler.Scheduled \
  A.8c5303eaa26202d6.FlowTransactionScheduler.PendingExecution \
  A.8c5303eaa26202d6.FlowTransactionScheduler.Executed \
  A.8c5303eaa26202d6.FlowTransactionScheduler.Canceled \
  A.373ce83aef691d2d.TestFlowCallbackHandler.TransactionExecuted \
  --last 200 \
  -n testnet
```

This command fetches the last 200 blocks of events for:
- **Scheduled**: when a transaction is scheduled.
- **PendingExecution**: when a transaction is ready for execution.
- **Executed**: when a transaction has been executed.
- **Canceled**: when a transaction is canceled.
- **TransactionExecuted**: custom event from the test handler.

These examples demonstrate the complete lifecycle of scheduled transactions: create handlers, schedule execution, monitor events, and manage cancellations. The system provides flexibility for various automation scenarios while you maintain network stability through resource limits and priority management.

## Tools

Support for scheduled transactions in different tools is still work in progress and is coming soon. The Flow CLI and Access Node API will support specific commands and APIs to query scheduled transactions by ID, which it easier to manage and monitor your scheduled transactions programmatically.

The [flow-go-sdk] will also add support for these new commands. It provides native integration for Go applications that work with scheduled transactions.

Block explorer support for scheduled transactions is also coming, which will provide a visual interface to view and track scheduled transaction execution on the Flow blockchain.

For feature requests and suggestions for scheduled transaction tooling, visit [github.com/onflow/flow] and create an issue with the tag `scheduled_transactions`.


Read [FLIP 330: Scheduled Callbacks] for more details.

<!-- Relative links, will not render on page -->

[FLIP 330: Scheduled Callbacks]: https://github.com/onflow/flips/blob/main/protocol/20250609-scheduled-callbacks.md
[flow-go-sdk]: ../../tools/clients/flow-go-sdk/index.md
[Flow metadata views standard]: metadata-views.md
[Forte: Introducing Actions & Agents]: https://flow.com/post/forte-introducing-actions-agents-supercharging-composability-and-automation
[github.com/onflow/flow]: https://github.com/onflow/flow
[manager]: https://github.com/onflow/flow-core-contracts/tree/master/transactions/transactionScheduler/scripts/manager
[The get_status script]: https://github.com/onflow/flow-core-contracts/blob/master/transactions/transactionScheduler/scripts/get_status.cdc
[The get_transaction_data script]: https://github.com/onflow/flow-core-contracts/blob/master/transactions/transactionScheduler/scripts/get_transaction_data.cdc
[`TestFlowCallbackHandler`]: #1-example-test-handler-contract
[`FlowTransactionScheduler.Executed` event]: https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowTransactionScheduler.cdc#L78
[`FlowTransactionScheduler.Scheduled` event]: https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowTransactionScheduler.cdc#L52
[section at the end of this document]: #2-scheduling-a-transaction-with-the-manager
[`FlowTransactionScheduler.schedule()` function]: https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowTransactionScheduler.cdc#L732
[scheduled transactions intro]: ../../../blockchain-development-tutorials/forte/scheduled-transactions/scheduled-transactions-introduction.md
