---
title: Scheduled Transactions
description: Learn about Flow Scheduled Transactions, enabling smart contracts
to autonomously execute predefined logic at specific future times without external triggers.
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

::::warning
Scheduled tranasctions are part of the Forte network upgrade and are currently available on Flow Emulator (CLI v2.7.0+) and [Flow Testnet]. See the announcement for context: [Forte: Introducing Actions & Agents].
::::

Scheduled transactions on the Flow blockchain enable users and smart contracts to autonomously execute predefined logic at specific future times without external triggers. This powerful feature allows developers to create "wake up" patterns where contracts can schedule themselves to run at predetermined block timestamps, enabling novel blockchain automation patterns.

Key benefits include:
- **Autonomous execution**: No need for external services or manual intervention
- **Time-based automation**: Execute transactions based on blockchain time
- **Predictable scheduling**: Guaranteed execution within specified time windows  

Common use cases include recurring payments, automated arbitrage, time-based contract logic, delayed executions, and periodic maintenance tasks.

::::info
Flow provides a scheduled transaction manager to make managing your scheduled transactions more streamlined. Check out the [scheduled transactions intro](../../../blockchain-development-tutorials/forte/scheduled-transactions/scheduled-transactions-introduction.md) for a tutorial on how to schedule some basic transactions with the manager.
::::

## Concepts

### Creating a Scheduled Transaction

In order to create a scheduled transaction, the logic that will be executed
in the transaction must already be defined in a function that the scheduler
will call when it is time for the transaction to be executed.

Therefore, all scheduled transactions must include a capability to a resource that conforms to this Transaction Handler interface defined in the Scheduler contract
and includes getters that conform to the [Flow metadata views standard](./metadata-views.md):

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

To schedule a transaction, you or your users will typically store
an instance of this resource in their account storage and pass a capability
to the scheduler contract as part of their schedule request.

Here is a simple example implementation for a Handler that transfers FLOW
at the scheduled time:

```cadence
access(all) contract TransferFLOWHandler {

    access(all) let HandlerStoragePath: StoragePath
    access(all) let HandlerPublicPath: PublicPath
    
    access(all) resource Handler: FlowTransactionScheduler.TransactionHandler {

        access(all) let name: String

        access(all) var from: Capability<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>

        access(all) var amount: UFix64

        init(name: String
             amount: UFix64,
             from: Capability<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>
             ) {
            pre {
                from.check(): "Capability to the provider is invalid!"
            }
            self.name = name
            self.amount = amount
            self.from = from
        }

        // public functions that anyone can call to get information about 
        // this handler
        access(all) view fun getViews(): [Type] {
            return [Type<StoragePath>(), Type<PublicPath>(), Type<MetadataViews.Display>()]
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<StoragePath>():
                    return TransferFLOWHandler.HandlerStoragePath
                case Type<PublicPath>():
                    return TransferFLOWHandler.HandlerPublicPath
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.name,
                        description: "Transfers \(self.amount) FLOW from \(self.from.owner.address.toString()) to the address provided when scheduling",
                        thumbnail: MetadataViews.HTTPFile(
                            url: ""
                        )
                    )
                default:
                    return nil
            }
        }

        // The actual logic that is executed when the scheduled transaction
        // is executed
        access(FlowTransactionScheduler.Execute) 
        fun executeTransaction(id: UInt64, data: AnyStruct?) {
            if let to = data as Address {
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

    access(all) init() {
        self.HandlerStoragePath = /storage/scheduleFlowTransferHandler
        self.HandlerPublicPath = /public/scheduleFlowTransferHandler
    }
} 
```


### Scheduling

Scheduling involves creating the specific transaction that will execute at a specified future timestamp. The system uses three priority levels:

- **High Priority**: Guarantees execution in the first block with the scheduled time or fails scheduling, requires the highest fees
- **Medium Priority**: Best-effort execution as close as possible to the scheduled time known during scheduling
- **Low Priority**: Opportunistic execution when network capacity allows, lowest fees but no guarantee about timing.

Each transaction requires:
- **Handler Capability**: A capability to a resource implementing `TransactionHandler` interface, like the FLOW transfer one above.
- **Timestamp**: Future Unix timestamp when execution should occur (fractional seconds ignored)
- **Execution Effort**: Computational resources allocated (gas limit for the transaction)
- **Fees**: Flow tokens to cover execution costs and storage costs for the
transaction data.
- **Optional Data**: Arbitrary data forwarded to the handler during execution
that may be relevant to the transaction.

These arguments are required by the [`FlowTransactionScheduler.schedule()` function](https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowTransactionScheduler.cdc#L732).
This function returns a `ScheduledTransaction` resource object.
The Scheduled Transaction Manager standard (mentioned in the intro) provides an easy way for developers
and users to manage their scheduled transactions from a central place in their account. Users are strongly encouraged to use this.

More information about the Scheduled Transaction manager is in the [section at the end of this document](#2-scheduling-a-transaction-with-the-manager).

When a transaction is scheduled, the [`FlowTransactionScheduler.Scheduled` event](https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowTransactionScheduler.cdc#L52)
is emitted with information about the scheduled transaction and handler.

### Fees

Fee calculation includes:
- **Base execution fee**: Based on computational effort using standard Flow fee structure  
- **Priority multiplier**: Higher priorities pay more (High: 10x, Medium: 5x, Low: 2x base rate)
- **Storage fee**: Cost for storing transaction data on-chain

Fees are paid upfront and are used in full, no refunds if the cost of execution was lower.

Please keep in mind the priority multiplier can change in the future. The fee configuration can be obtained from the contract, and estimate function can be used to check the fees upfront.

### Execution of Transaction Handlers

When the scheduled time arrives, the Flow blockchain calls the `executeTransaction` method on your handler resource.

If the transaction succeeds, the [`FlowTransactionScheduler.Executed` event](https://github.com/onflow/flow-core-contracts/blob/master/contracts/FlowTransactionScheduler.cdc#L78)
is emitted with information about the executed transaction.

If the scheduled transaction fails at any point during execution, the `Executed` event
is not emitted.

### Canceling

Scheduled transactions can be canceled before execution. 
Canceling returns a portion of the fees (configurable refund percentage, 50% as of now). Please keep in mind the refund percentage can change in the future.

To cancel, you need the `ScheduledTransaction` resource that was returned during scheduling. The scheduled transaction manager also makes cancelling scheduled transaction easier.

### Transaction Lifecycle

Scheduled transactions follow a specific lifecycle with corresponding events:

1. **Scheduled**: Transaction is created and queued for future execution
   - Event: `FlowTransactionScheduler.Scheduled`
   - Status: `Scheduled`

2. **Pending Execution**: Transaction timestamp has arrived and it's ready for execution
   - Event: `FlowTransactionScheduler.PendingExecution` 
   - Status: `Executed` (Executed does not necessarily mean it succeeded, just that execution was attempted)

3. **Executed**: Transaction has been processed by the blockchain
   - Event: `FlowTransactionScheduler.Executed`
   - Status: `Executed`

4. **Canceled**: Transaction was canceled before execution (optional path)
   - Event: `FlowTransactionScheduler.Canceled`
   - Status: `Canceled`

### Contracts
The `FlowTransactionScheduler` contract is deployed to the service account and manages all scheduled transactions across the network.

The `FlowTransactionSchedulerUtils` contract provides utilities for scheduled transactions, such as the transaction `Manager` resource, common handlers, and metadata views related to scheduled transactions.

Below are listed the addresses of both transaction scheduler contracts on each network they are deployed:
- **Emulator**: `0xf8d6e0586b0a20c7`
- **Cadence Testing Framework: `0x0000000000000001`
- **Testnet**: `0x8c5303eaa26202d6`

## Examples

### 1. Example Test Handler Contract

This contract implements the TransactionHandler interface and will be used in the following examples. It emits events when scheduled transactions are executed.

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

### 2. Scheduling a Transaction with the Manager

This example shows how to create and schedule a transaction that will execute at a future timestamp using the TestFlowCallbackHandler from Example 1.

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

### 3. Querying Transaction Information

Get Status: [This script](https://github.com/onflow/flow-core-contracts/blob/master/transactions/transactionScheduler/scripts/get_status.cdc) demonstrates how to check the current status of a scheduled transaction using the global status function.

Get all Tx Info: [This script](https://github.com/onflow/flow-core-contracts/blob/master/transactions/transactionScheduler/scripts/get_transaction_data.cdc) gets all the internal information about a scheduled transaction.

#### Manager Scripts

The manager provides many different ways to get information about all of your scheduled transactions. Check out all the scripts you can use with your manager [here](https://github.com/onflow/flow-core-contracts/tree/master/transactions/transactionScheduler/scripts/manager).

### 4. Canceling a Scheduled Transaction

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

### 5. Fee Estimation

This script helps estimate the cost of scheduling a transaction before actually submitting it, useful for budgeting and validation.

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

### 6. Monitoring Execution Events

Use the Flow CLI to monitor all scheduled transaction events in real-time (example for testnet - account addresses may differ):

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
- **Scheduled**: When a transaction is scheduled
- **PendingExecution**: When a transaction is ready for execution
- **Executed**: When a transaction has been executed
- **Canceled**: When a transaction is canceled
- **TransactionExecuted**: Custom event from the test handler

These examples demonstrate the complete lifecycle of scheduled transactions: creating handlers, scheduling execution, monitoring events, and managing cancellations. The system provides flexibility for various automation scenarios while maintaining network stability through resource limits and priority management.

## Tools

Support for scheduled transactions in different tools is still work in progress and is coming soon. The Flow CLI and Access Node API will support specific commands and APIs to query scheduled transactions by ID, making it easier to manage and monitor your scheduled transactions programmatically.

The flow-go-sdk will also add support for these new commands, providing native integration for Go applications working with scheduled transactions.

Block explorer support for scheduled transactions is also coming, which will provide a visual interface to view and track scheduled transaction execution on the Flow blockchain.

For feature requests and suggestions for scheduled transaction tooling, please visit [github.com/onflow/flow](https://github.com/onflow/flow) and create an issue with the tag `scheduled_transactions`.


Read FLIP for more details: https://github.com/onflow/flips/blob/main/protocol/20250609-scheduled-callbacks.md