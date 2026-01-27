# Scheduled Transactions Performance Guide

Since the Forte network upgrade, scheduled transactions have been a powerful and useful feature for many developers in the Flow ecosystem, providing tools to automate a ton of functionality and have extremely useful features like on-chain cron jobs.

This feature comes with some things that developers have to consider though. The functionality is complex, and therefore can be expensive if not used properly. Many of the use cases for scheduled transactions are in the DeFi space, which has razor-thin margins. This means that you need to make sure your transactions are efficient as possible to save money on gas fees.

Biggest piece of advice: Stop calling `FlowTransactionScheduler.estimate()` just to get an estimate of the fees for the transaction! Use `FlowTransactionScheduler.calculateFee()` instead and save approximately 30 percent on computation.

## The Problem: Double Work

Many developers are currently using this pattern when scheduling transactions:

```cadence
// Get an estimate of the fee required for the transaction
// also does a lot of other things
let estimate = FlowTransactionScheduler.estimate(...)
let fee = estimate.fee

// withdraw the fee amount from the account's vault
let feeVault <- authorizerVaultRef.withdraw(amount: fee)

// schedule the transaction
manager.schedule(txData, feeVault, ...)
```

### What happens under the hood

`estimate()` performs these operation:
- Validates transaction data
- Calculates data size
- finds an empty slot that the transaction will fit in
- Computes fee

`manager.schedule()` also does:
- Validates transaction data again
- Calculates data size again
- finds an empty slot that the transaction will fit in again
- Computes the fee
- Actually schedules the transaction

You are doing approximately 70 percent of the work in `schedule()` twice!

Computational Cost Comparison:
- Old way: `estimate()` plus `schedule()` does double work because `schedule()` calls estimate!
- New way: `calculateFee()` plus `schedule()` only calculates the fee twice, which is a trivial operation.
- Result: ~30 percent reduction in computation

## The Solution: Use `FlowTransactionScheduler.calculateFee()`

The new `calculateFee()` function does exactly one thing: calculates the fee.

```cadence
// Get an estimate of the fee required for the transaction
let fee = FlowTransactionScheduler.calculateFee(...)

// withdraw the fee amount from the account's vault
let feeVault <- authorizerVaultRef.withdraw(amount: fee)

manager.schedule(txData, feeVault, ...)
```

Why this works: `manager.schedule()` does all the validation anyway, so you only need the fee upfront. Let `schedule()` handle the rest!

In the long run, this will save a TON on transaction fees, especially if your app is scheduling a lot of recurring transactions!

## Bonus Optimization: Store Known Sizes

Scheduled Transactions can provide an optional piece of data when scheduling to be included with the transaction. The user must pay a fee for the storage of this data, so the contract needs to know its size.

If your transaction data is always the same size, stop calculating it every time!

Wasteful approach:
```cadence
// calculate the size of the data, which is an expensive operation
let dataSizeMB = FlowTransactionScheduler.getSizeOfData(txData)
let fee = FlowTransactionScheduler.calculateFee(executionEffort, priority, dataSizeMB)
```

If the data that you are providing when scheduling is the same size every time, you can just store that size in a variable in your contract or somewhere else and just access that field when scheduling, instead of doing redundant operations to calculate the size every time.

Smart approach:
```cadence
// get the pre-set size of the data from a field in the contract
let dataSizeMB = self.standardTxDataSizeMB
let fee = FlowTransactionScheduler.calculateFee(executionEffort, priority, dataSizeMB)
```

Pro tip: If your scheduled transaction payload is standardized with same fields and similar values, calculate the size once and store it in a configurable field in your contract or resource.

## Real World Examples

### Before: Inefficient Code

```cadence
import FlowTransactionScheduler from 0x1234
import FlowTransactionSchedulerUtils from 0x1234

transaction(
    txData: {String: AnyStruct},
    executionEffort: UInt64,
    priority: FlowTransactionScheduler.Priority
) {
    prepare(acct: AuthAccount) {
        let manager = acct.borrow<&FlowTransactionSchedulerUtils.Manager>(
            from: FlowTransactionSchedulerUtils.ManagerStoragePath
        ) ?? panic("No manager")
        
        let dataSizeMB = FlowTransactionScheduler.getSizeOfData(txData)
        let estimate = FlowTransactionScheduler.estimate(
            scheduler: manager.address,
            transaction: txData,
            ...
        )
        let fee = estimate.fee

        // withdraw the fee amount from the account's vault
       let feeVault <- authorizerVaultRef.withdraw(amount: fee)
        
        manager.schedule(
            transaction: txData,
            fee: <-feeVault,
            ...
        )
    }
}
```

### After: Optimized Code

```cadence
import FlowTransactionScheduler from 0x1234
import FlowTransactionSchedulerUtils from 0x1234
import MyTransactionHandler from 0x5678

transaction(
    txData: {String: AnyStruct},
    executionEffort: UInt64,
    priority: FlowTransactionScheduler.Priority
) {
    prepare(acct: AuthAccount) {
        let manager = acct.borrow<&FlowTransactionSchedulerUtils.Manager>(
            from: FlowTransactionSchedulerUtils.ManagerStoragePath
        ) ?? panic("No manager")
        
        let dataSizeMB = MyTransactionHandler.standardDataSize
        let fee = FlowTransactionScheduler.calculateFee(
            executionEffort: executionEffort,
            priority: priority,
            dataSizeMB: dataSizeMB
        )

        // withdraw the fee amount from the account's vault
       let feeVault <- authorizerVaultRef.withdraw(amount: fee)
        
        manager.schedule(
            transaction: txData,
            fee: <-feeVault,
            ...
        )
    }
}
```

This is the fastest way if your transaction structure is consistent! Store the size in a configurable field instead of recalculating it every time.

## When to still use `estimate()`

Use `estimate()` only when you need to validate the entire transaction before scheduling, such as in a UI where users need to see validation errors before submitting. For simple fee calculation, always use `calculateFee()`.

## Quick Reference

Do This:
- Use `FlowTransactionScheduler.calculateFee()` for fee estimation
- Store known data sizes in config fields
- Let `manager.schedule()` handle validation and scheduling

Do Not Do This:
- Call `estimate()` just for fees
- Calculate size every transaction
- Validate and schedule twice unnecessarily

Questions? Check out the Scheduled Transactions documentation at https://developers.flow.com/blockchain-development-tutorials/forte/scheduled-transactions/scheduled-transactions-introduction for more details.