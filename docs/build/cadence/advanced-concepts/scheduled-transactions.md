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

Scheduled transactions on the Flow blockchain enable smart contracts to autonomously execute predefined logic at specific future times without external triggers. This powerful feature allows developers to create "wake up" patterns where contracts can schedule themselves to run at predetermined block timestamps, enabling novel blockchain automation patterns.

Key benefits include:
- **Autonomous execution**: No need for external services or manual intervention
- **Time-based automation**: Execute transactions based on blockchain time
- **Predictable scheduling**: Guaranteed execution within specified time windows  

Common use cases include recurring payments, automated arbitrage, time-based contract logic, delayed executions, and periodic maintenance tasks.

## Concepts

### Scheduling

Scheduling involves creating a transaction that will execute at a specified future timestamp. The system uses three priority levels:

- **High Priority**: Guarantees execution in the first block with the scheduled time or fails scheduling, requires with highest fees
- **Medium Priority**: Best-effort execution closest to the scheduled time known during scheduling
- **Low Priority**: Opportunistic execution when network capacity allows, lowest fees but no time returned during scheduling

Each transaction requires:
- **Handler Capability**: A capability to a resource implementing `TransactionHandler` interface
- **Timestamp**: Future Unix timestamp when execution should occur (fractional seconds ignored)
- **Execution Effort**: Computational resources allocated (gas limit for the transaction)
- **Fees**: Flow tokens to cover execution costs
- **Optional Data**: Arbitrary data forwarded to the handler during execution

### Execution of Transaction Handlers

When the scheduled time arrives, the Flow blockchain calls the `executeTransaction` method on your handler resource. The handler receives:
- **Transaction ID**: Unique identifier for tracking, returned during scheduling
- **Data**: The optional data provided during scheduling

Your handler must implement the `TransactionHandler` interface:

```cadence
access(all) resource interface TransactionHandler {
    access(Execute) fun executeTransaction(id: UInt64, data: AnyStruct?)
}
```

### Canceling

Scheduled transactions can be canceled before execution if they're still in `Scheduled` status. Canceling returns a portion of the fees (configurable refund percentage, 90% as of now). To cancel, you need the `ScheduledTransaction` resource returned during scheduling.

### Fees

Fee calculation includes:
- **Base execution fee**: Based on computational effort using standard Flow fee structure  
- **Priority multiplier**: Higher priorities pay more (High: 10x, Medium: 5x, Low: 2x base rate)
- **Storage fee**: Cost for storing transaction data on-chain

Fees are paid upfront and are used in full, no refunds if the cost of execution was lower.

### Transaction Lifecycle

Scheduled transactions follow a specific lifecycle with corresponding events:

1. **Scheduled**: Transaction is created and queued for future execution
   - Event: `FlowTransactionScheduler.Scheduled`
   - Status: `Scheduled`

2. **Pending Execution**: Transaction timestamp has arrived and it's ready for execution
   - Event: `FlowTransactionScheduler.PendingExecution` 
   - Status: `Scheduled` (still scheduled until actually executed)

3. **Executed**: Transaction has been processed by the blockchain
   - Event: `FlowTransactionScheduler.Executed`
   - Status: `Executed`

4. **Canceled**: Transaction was canceled before execution (optional path)
   - Event: `FlowTransactionScheduler.Canceled`
   - Status: `Canceled`

The FlowTransactionScheduler contract is deployed to the service account and manages all scheduled transactions across the network. 

## Examples

### 1. Example Test Handler Contract

This contract implements the TransactionHandler interface and will be used in the following examples. It emits events when scheduled transactions are executed.

```cadence
// TestFlowCallbackHandler.cdc - Simple test handler
import "FlowTransactionScheduler"

access(all) contract TestFlowCallbackHandler {
    access(all) let HandlerStoragePath: StoragePath
    access(all) let HandlerPublicPath: PublicPath
    
    access(all) event CallbackExecuted(data: String)

    access(all) resource Handler: FlowTransactionScheduler.TransactionHandler {
        
        access(FlowTransactionScheduler.Execute) 
        fun executeTransaction(id: UInt64, data: AnyStruct?) {
            if let string: String = data as? String {
                emit CallbackExecuted(data: string)
            } else {
                emit CallbackExecuted(data: "bloop")
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

### 2. Scheduling a Transaction

This example shows how to create and schedule a transaction that will execute at a future timestamp using the TestFlowCallbackHandler from Example 1.

```cadence
// schedule.cdc
import "FlowTransactionScheduler"
import "TestFlowCallbackHandler" 
import "FlowToken"
import "FungibleToken"

transaction(timestamp: UFix64, feeAmount: UFix64, effort: UInt64, priority: UInt8, testData: String) {
    prepare(account: auth(BorrowValue, SaveValue, IssueStorageCapabilityController, PublishCapability, GetStorageCapabilityController) &Account) {
        
        // If a transaction handler has not been created for this account yet, create one,
        // store it, and issue a capability that will be used to create the scheduled transaction
        if !account.storage.check<@TestFlowCallbackHandler.Handler>(from: TestFlowCallbackHandler.HandlerStoragePath) {
            let handler <- TestFlowCallbackHandler.createHandler()
        
            account.storage.save(<-handler, to: TestFlowCallbackHandler.HandlerStoragePath)
            account.capabilities.storage.issue<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>(TestFlowCallbackHandler.HandlerStoragePath)
        }

        // Get the capability that will be used to create the scheduled transaction
        let handlerCap = account.capabilities.storage
                            .getControllers(forPath: TestFlowCallbackHandler.HandlerStoragePath)[0]
                            .capability as! Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>
        
        // borrow a reference to the vault that will be used for fees
        let vault = account.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow FlowToken vault")
        
        let priorityEnum = FlowTransactionScheduler.Priority(rawValue: priority)
            ?? FlowTransactionScheduler.Priority.High

        // Estimate the fee first to ensure we have enough funds
        let estimate = FlowTransactionScheduler.estimate(
            data: testData,
            timestamp: timestamp,
            priority: priorityEnum,
            executionEffort: effort
        )
        
        // Check if estimation was successful and we have enough funds
        if estimate.error != nil {
            panic("Cannot schedule transaction: ".concat(estimate.error!))
        }
        
        let requiredFee = estimate.flowFee!
        if vault.balance < requiredFee {
            panic("Insufficient funds: need ".concat(requiredFee.toString()).concat(" FLOW but only have ").concat(vault.balance.toString()))
        }
        
        let fees <- vault.withdraw(amount: requiredFee) as! @FlowToken.Vault

        // Schedule the transaction with the main contract
        let scheduledTransaction <- FlowTransactionScheduler.schedule(
            handlerCap: handlerCap,
            data: testData,
            timestamp: timestamp,
            priority: priorityEnum,
            executionEffort: effort,
            fees: <-fees
        )
        
        // Store the scheduled transaction resource so we can query its status and cancel it if needed
        let txID = scheduledTransaction.id
        let storagePath = StoragePath(identifier: "scheduledTx_".concat(txID.toString()))!
        account.storage.save(<-scheduledTransaction, to: storagePath)
    }
}
```

### 3. Querying Transaction Status

This script demonstrates how to check the current status of a scheduled transaction using the stored ScheduledTransaction resource.

```cadence
// query_status.cdc - Script to check the status of a scheduled transaction
import "FlowTransactionScheduler"

access(all) fun main(account: Address, transactionId: UInt64): FlowTransactionScheduler.Status {
    let storagePath = StoragePath(identifier: "scheduledTx_".concat(transactionId.toString()))!
    
    return getAccount(account).storage
        .borrow<&FlowTransactionScheduler.ScheduledTransaction>(from: storagePath)?.status()
        ?? FlowTransactionScheduler.getStatus(id: transactionId)
        ?? FlowTransactionScheduler.Status.Unknown
}
```

### 4. Canceling a Scheduled Transaction

This transaction shows how to cancel a scheduled transaction and receive a partial refund of the fees paid.

```cadence
// cancel_transaction.cdc
import "FlowTransactionScheduler"
import "FlowToken"

transaction(transactionId: UInt64) {
    prepare(account: auth(BorrowValue, SaveValue, LoadValue) &Account) {
        
        // Load the scheduled transaction from storage
        let scheduledTx <- account.storage.load<@FlowTransactionScheduler.ScheduledTransaction>(
            from: StoragePath(identifier: "scheduledTx_".concat(transactionId.toString()))!
        ) ?? panic("Could not load scheduled transaction with ID ".concat(transactionId.toString()))
        
        // Cancel and get refund
        let refundedFees <- FlowTransactionScheduler.cancel(scheduledTx: <-scheduledTx)
        
        // Deposit refund back to account
        let vault = account.storage.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow FlowToken vault")
        vault.deposit(from: <-refundedFees)
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
  A.373ce83aef691d2d.TestFlowCallbackHandler.CallbackExecuted \
  --last 200 \
  -n testnet
```

This command fetches the last 200 blocks of events for:
- **Scheduled**: When a transaction is scheduled
- **PendingExecution**: When a transaction is ready for execution
- **Executed**: When a transaction has been executed
- **Canceled**: When a transaction is canceled
- **CallbackExecuted**: Custom event from the test handler

These examples demonstrate the complete lifecycle of scheduled transactions: creating handlers, scheduling execution, monitoring events, and managing cancellations. The system provides flexibility for various automation scenarios while maintaining network stability through resource limits and priority management.


## Tools

Support for scheduled transactions in different tools is still work in progress and is coming soon. The Flow CLI and Access Node API will support specific commands and APIs to query scheduled transactions by ID, making it easier to manage and monitor your scheduled transactions programmatically.

The flow-go-sdk will also add support for these new commands, providing native integration for Go applications working with scheduled transactions.

Block explorer support for scheduled transactions is also coming, which will provide a visual interface to view and track scheduled transaction execution on the Flow blockchain.

For feature requests and suggestions for scheduled transaction tooling, please visit [github.com/onflow/flow](https://github.com/onflow/flow) and create an issue with the tag `scheduled_transactions`.


Read FLIP for more details: https://github.com/onflow/flips/blob/main/protocol/20250609-scheduled-callbacks.md
